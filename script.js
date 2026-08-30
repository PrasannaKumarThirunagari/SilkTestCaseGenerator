/* ============================================================================
   Silk Test Case Prompt Builder — script.js
   Pure vanilla JS. No framework, no CDN, no network, no build step.

   Responsibility of this application: turn structured user input into ONE
   high-quality AI prompt. It never generates, validates or executes Silk Test
   code, and never contacts Silk Central or any other service.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATALOADS;

  /* ======================================================================
     1. STATE
     ====================================================================== */

  var state = null;

  function cloneState(src) {
    return {
      testContext: {
        testCaseName: src.testContext.testCaseName || '',
        targetApplication: src.testContext.targetApplication || '',
        referenceFile: src.testContext.referenceFile || '',
        userStory: src.testContext.userStory || ''
      },
      navigationSteps: (src.navigationSteps || []).map(function (s) {
        return { action: s.action || '', target: s.target || '' };
      }),
      silkCentralSteps: (src.silkCentralSteps || []).map(function (s) {
        return { command: s.command || '', name: s.name || '' };
      }),
      verification: {
        operation: src.verification.operation || '',
        controlAccess: src.verification.controlAccess || '',
        controlType: src.verification.controlType || '',
        expectedValue: src.verification.expectedValue || '',
        acceptanceCriteria: src.verification.acceptanceCriteria || ''
      }
    };
  }

  /* ======================================================================
     2. SMALL DOM / STRING HELPERS
     ====================================================================== */

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function trim(v) { return (v === undefined || v === null) ? '' : String(v).trim(); }

  function hasText(v) { return trim(v).length > 0; }

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function lines(text) {
    return trim(text)
      .split(/\r?\n/)
      .map(function (l) { return l.trim(); })
      .filter(function (l) { return l.length > 0; });
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  /* ======================================================================
     2b. TEST CASE NAME
     A name the user types wins. Otherwise a name is built from the target
     application and the time it was generated: Microsoft_Outlook_Desktop_
     20260830_143022. The generated name is held steady rather than being
     recomputed on every keystroke, so the prompt and its character count do
     not churn while typing. It is refreshed on load, on reset, when a sample
     is loaded, and when the target application changes.
     ====================================================================== */

  var autoTestCaseName = '';

  function nameTimestamp(d) {
    return '' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) +
      '_' + pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  }

  /* 'Microsoft Outlook (Desktop)' -> 'Microsoft_Outlook_Desktop' */
  function nameFromApplication(application) {
    return trim(application)
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function buildAutoTestCaseName() {
    var base = nameFromApplication(state.testContext.targetApplication) || 'SilkTestCase';
    return base + '_' + nameTimestamp(new Date());
  }

  function refreshAutoTestCaseName() {
    autoTestCaseName = buildAutoTestCaseName();
    var input = $('test-case-name');
    if (input) input.placeholder = autoTestCaseName;
  }

  /* What the prompt actually uses. */
  function effectiveTestCaseName() {
    return trim(state.testContext.testCaseName) || autoTestCaseName;
  }

  /* ======================================================================
     3. REUSABLE SEARCHABLE COMBOBOX
     Portalled listbox -> can never be clipped by an overflow container.
     ====================================================================== */

  var comboSeq = 0;

  function Combobox(host, config) {
    this.host = host;
    this.options = config.options || [];
    this.allowCustom = config.allowCustom !== false;
    this.placeholder = config.placeholder || '';
    this.labelText = config.label || '';
    this.onChange = config.onChange || function () {};
    this.value = config.value || '';
    this.uid = 'cbx-' + (++comboSeq);
    this.listId = this.uid + '-list';
    this.isOpen = false;
    this.activeIndex = -1;
    this.filtered = [];
    this._bound = {};
    this.build(config.inputId);
  }

  Combobox.prototype.build = function (inputId) {
    var self = this;

    clear(this.host);
    this.host.classList.add('cbx');

    this.input = el('input', 'cbx__input');
    this.input.type = 'text';
    this.input.id = inputId || (this.uid + '-input');
    this.input.autocomplete = 'off';
    this.input.spellcheck = false;
    this.input.placeholder = this.placeholder;
    this.input.value = this.value;
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-haspopup', 'listbox');
    this.input.setAttribute('aria-controls', this.listId);
    if (this.labelText && !inputId) this.input.setAttribute('aria-label', this.labelText);

    this.warnEl = el('span', 'cbx__warn', '⚠');
    this.warnEl.setAttribute('aria-hidden', 'true');
    this.warnEl.hidden = true;

    this.warnTextEl = el('span', 'sr-only');
    this.warnTextEl.id = this.uid + '-warn';

    this.clearBtn = el('button', 'cbx__btn cbx__clear', '×');
    this.clearBtn.type = 'button';
    this.clearBtn.setAttribute('aria-label', 'Clear ' + (this.labelText || 'value'));
    this.clearBtn.hidden = !this.value;

    this.toggleBtn = el('button', 'cbx__btn cbx__toggle', '▾');
    this.toggleBtn.type = 'button';
    this.toggleBtn.tabIndex = -1;
    this.toggleBtn.setAttribute('aria-label', 'Show options for ' + (this.labelText || 'this field'));

    this.host.appendChild(this.input);
    this.host.appendChild(this.warnEl);
    this.host.appendChild(this.warnTextEl);
    this.host.appendChild(this.clearBtn);
    this.host.appendChild(this.toggleBtn);

    this.list = el('ul', 'cbx-list');
    this.list.id = this.listId;
    this.list.setAttribute('role', 'listbox');
    if (this.labelText) this.list.setAttribute('aria-label', this.labelText + ' options');
    this.list.hidden = true;
    document.body.appendChild(this.list);

    /* --- events --- */
    this.input.addEventListener('focus', function () {
      self.host.classList.add('is-focused');
    });

    this.input.addEventListener('input', function () {
      // For a free-typed field (allowCustom), whatever is typed IS the
      // value, live. For a picker (allowCustom:false, e.g. Quick navigation)
      // this.value instead tracks the last actual SELECTION — set only by
      // setValue(), never by typing — so commitOnBlur() has something real
      // to revert to when what was typed doesn't match anything.
      if (self.allowCustom) self.value = self.input.value;
      self.clearBtn.hidden = !self.input.value;
      self.render(self.input.value);
      self.open();
      self.onChange(self.input.value);
    });

    this.input.addEventListener('mousedown', function () {
      if (!self.isOpen) {
        self.render('');
        self.open();
      }
    });

    this.input.addEventListener('keydown', function (e) { self.onKeyDown(e); });

    this.input.addEventListener('blur', function () {
      self.host.classList.remove('is-focused');
      // Delay so a click on a list item still lands.
      window.setTimeout(function () {
        if (document.activeElement === self.input) return;
        if (self.list.contains(document.activeElement)) return;
        self.commitOnBlur();
      }, 120);
    });

    this.toggleBtn.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });
    this.toggleBtn.addEventListener('click', function () {
      if (self.isOpen) { self.close(); }
      else { self.render(''); self.open(); }
      self.input.focus();
    });

    this.clearBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });
    this.clearBtn.addEventListener('click', function () {
      self.setValue('', true);
      self.input.focus();
      self.render('');
      self.open();
    });

    this.list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    this.list.addEventListener('click', function (e) {
      var item = e.target.closest ? e.target.closest('.cbx-list__item') : null;
      if (!item) return;
      self.setValue(item.getAttribute('data-value'), true);
      self.close();
      self.input.focus();
    });

    this._bound.outside = function (e) {
      if (!self.isOpen) return;
      if (self.host.contains(e.target) || self.list.contains(e.target)) return;
      self.commitOnBlur();
      self.close();
    };
    this._bound.reposition = function () { if (self.isOpen) self.position(); };

    document.addEventListener('mousedown', this._bound.outside, true);
    window.addEventListener('resize', this._bound.reposition);
    window.addEventListener('scroll', this._bound.reposition, true);
  };

  Combobox.prototype.commitOnBlur = function () {
    var typed = this.input.value;
    if (!this.allowCustom && typed && this.options.indexOf(typed) === -1) {
      // Snap back to the last valid value.
      this.input.value = this.value;
      this.clearBtn.hidden = !this.value;
      return;
    }
    if (typed !== this.value) {
      this.value = typed;
      this.onChange(this.value);
    }
  };

  Combobox.prototype.onKeyDown = function (e) {
    var key = e.key;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen) { this.render(this.input.value); this.open(); return; }
      this.move(key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (key === 'Home' && this.isOpen) { e.preventDefault(); this.setActive(0); return; }
    if (key === 'End' && this.isOpen) { e.preventDefault(); this.setActive(this.filtered.length - 1); return; }

    if (key === 'Enter') {
      if (this.isOpen && this.activeIndex >= 0 && this.filtered[this.activeIndex] !== undefined) {
        e.preventDefault();
        this.setValue(this.filtered[this.activeIndex], true);
        this.close();
      } else if (this.isOpen) {
        e.preventDefault();
        this.commitOnBlur();
        this.close();
      }
      return;
    }

    if (key === 'Escape') {
      if (this.isOpen) { e.preventDefault(); e.stopPropagation(); this.close(); }
      return;
    }

    if (key === 'Tab') {
      if (this.isOpen) { this.commitOnBlur(); this.close(); }
      return;
    }
  };

  Combobox.prototype.move = function (delta) {
    if (!this.filtered.length) return;
    var next = this.activeIndex + delta;
    if (next < 0) next = this.filtered.length - 1;
    if (next >= this.filtered.length) next = 0;
    this.setActive(next);
  };

  Combobox.prototype.setActive = function (index) {
    this.activeIndex = index;
    var items = this.list.querySelectorAll('.cbx-list__item');
    for (var i = 0; i < items.length; i++) {
      var on = (i === index);
      items[i].classList.toggle('is-active', on);
      if (on) {
        this.input.setAttribute('aria-activedescendant', items[i].id);
        var it = items[i];
        var top = it.offsetTop;
        var bottom = top + it.offsetHeight;
        if (top < this.list.scrollTop) this.list.scrollTop = top;
        else if (bottom > this.list.scrollTop + this.list.clientHeight) {
          this.list.scrollTop = bottom - this.list.clientHeight;
        }
      }
    }
    if (index < 0) this.input.removeAttribute('aria-activedescendant');
  };

  Combobox.prototype.render = function (query) {
    var self = this;
    var q = trim(query).toLowerCase();

    this.filtered = this.options.filter(function (opt) {
      return !q || opt.toLowerCase().indexOf(q) !== -1;
    });

    clear(this.list);

    if (!this.filtered.length) {
      var empty = el('li', 'cbx-list__empty',
        this.allowCustom
          ? 'No matches — your typed value will be used.'
          : 'No results found.');
      empty.setAttribute('role', 'presentation');
      this.list.appendChild(empty);
      this.activeIndex = -1;
      this.input.removeAttribute('aria-activedescendant');
      return;
    }

    var rx = q ? new RegExp('(' + escapeRegExp(q) + ')', 'i') : null;

    this.filtered.forEach(function (opt, i) {
      var li = el('li', 'cbx-list__item');
      li.id = self.uid + '-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', opt);
      li.setAttribute('aria-selected', opt === self.value ? 'true' : 'false');
      if (rx) {
        var parts = opt.split(rx);
        parts.forEach(function (part) {
          if (!part) return;
          if (part.toLowerCase() === q) li.appendChild(el('mark', null, part));
          else li.appendChild(document.createTextNode(part));
        });
      } else {
        li.textContent = opt;
      }
      self.list.appendChild(li);
    });

    if (this.allowCustom && q && this.filtered.indexOf(trim(query)) === -1) {
      var note = el('li', 'cbx-list__custom');
      note.setAttribute('role', 'presentation');
      note.appendChild(document.createTextNode('Custom value: '));
      note.appendChild(el('strong', null, trim(query)));
      this.list.appendChild(note);
    }

    var selectedIndex = this.filtered.indexOf(this.value);
    this.setActive(selectedIndex >= 0 ? selectedIndex : (q ? 0 : -1));
  };

  Combobox.prototype.position = function () {
    var r = this.host.getBoundingClientRect();
    var margin = 6;
    var vh = window.innerHeight;
    var vw = window.innerWidth;

    this.list.style.width = Math.max(r.width, 200) + 'px';
    var left = Math.min(r.left, vw - Math.max(r.width, 200) - 8);
    this.list.style.left = Math.max(8, left) + 'px';

    // Measure with a temporary cap so we can decide up/down.
    this.list.style.maxHeight = '260px';
    var h = this.list.offsetHeight;
    var spaceBelow = vh - r.bottom - margin - 8;
    var spaceAbove = r.top - margin - 8;

    if (h > spaceBelow && spaceAbove > spaceBelow) {
      var capUp = Math.min(260, Math.max(120, spaceAbove));
      this.list.style.maxHeight = capUp + 'px';
      this.list.style.top = Math.max(8, r.top - margin - Math.min(h, capUp)) + 'px';
    } else {
      var capDown = Math.min(260, Math.max(120, spaceBelow));
      this.list.style.maxHeight = capDown + 'px';
      this.list.style.top = (r.bottom + margin) + 'px';
    }
  };

  Combobox.prototype.open = function () {
    if (this.isOpen) { this.position(); return; }
    this.isOpen = true;
    this.list.hidden = false;
    this.host.classList.add('is-open');
    this.input.setAttribute('aria-expanded', 'true');
    this.position();
  };

  Combobox.prototype.close = function () {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.list.hidden = true;
    this.host.classList.remove('is-open');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
    this.activeIndex = -1;
  };

  Combobox.prototype.setValue = function (value, fire) {
    this.value = value || '';
    this.input.value = this.value;
    this.clearBtn.hidden = !this.value;
    if (fire) this.onChange(this.value);
  };

  /* Swap the option list without rebuilding the widget, so the value, the
     caret and the focus all survive. */
  Combobox.prototype.setOptions = function (options) {
    this.options = options || [];
    if (this.isOpen) {
      this.render(this.input.value);
      this.position();
    }
  };

  /* '' clears the warning. Anything else flags the field and exposes the
     message to both pointer users (tooltip) and screen readers. */
  Combobox.prototype.setWarning = function (message) {
    var msg = message || '';
    if (msg) {
      this.host.classList.add('cbx--warn');
      this.host.title = msg;
      this.warnEl.hidden = false;
      this.warnTextEl.textContent = msg;
      this.input.setAttribute('aria-describedby', this.warnTextEl.id);
    } else {
      this.host.classList.remove('cbx--warn');
      this.host.removeAttribute('title');
      this.warnEl.hidden = true;
      this.warnTextEl.textContent = '';
      this.input.removeAttribute('aria-describedby');
    }
  };

  Combobox.prototype.destroy = function () {
    this.close();
    document.removeEventListener('mousedown', this._bound.outside, true);
    window.removeEventListener('resize', this._bound.reposition);
    window.removeEventListener('scroll', this._bound.reposition, true);
    if (this.list && this.list.parentNode) this.list.parentNode.removeChild(this.list);
    this.host.classList.remove('cbx', 'is-open', 'is-focused');
    clear(this.host);
    this.host._combobox = null;
  };

  function createCombobox(host, fieldKey, config) {
    var meta = D.fields[fieldKey] || {};
    var cfg = {
      options: (config && config.options) || meta.options || [],
      allowCustom: meta.allowCustom !== false,
      placeholder: meta.placeholder || '',
      label: meta.label || '',
      value: (config && config.value) || '',
      inputId: config && config.inputId,
      onChange: (config && config.onChange) || function () {}
    };
    var cb = new Combobox(host, cfg);
    host._combobox = cb;
    return cb;
  }

  function destroyComboboxesIn(root) {
    var hosts = root.querySelectorAll('[data-cbx]');
    for (var i = 0; i < hosts.length; i++) {
      if (hosts[i]._combobox) hosts[i]._combobox.destroy();
    }
  }

  /* ======================================================================
     4. DYNAMIC ROW ENGINE (shared by Navigation + SilkCentral)
     ====================================================================== */

  /**
   * Generic renderer for an ordered, reorderable list of rows.
   * cfg = { tbody, getRows, columns:[{key, fieldKey, inputIdPrefix}], label, onChange }
   */
  function renderRows(cfg) {
    var tbody = cfg.tbody;
    var rows = cfg.getRows();

    destroyComboboxesIn(tbody);
    clear(tbody);

    rows.forEach(function (row, index) {
      var tr = el('tr');
      tr.setAttribute('data-index', String(index));

      var tdOrder = el('td', 'col-order');
      var badge = el('span', 'order-badge', String(index + 1));
      badge.setAttribute('aria-hidden', 'true');
      tdOrder.appendChild(badge);
      tdOrder.appendChild(el('span', 'sr-only', cfg.label + ' step ' + (index + 1)));
      tr.appendChild(tdOrder);

      cfg.columns.forEach(function (col) {
        var td = el('td');
        var hostDiv = el('div', null);
        hostDiv.setAttribute('data-cbx', '');
        td.appendChild(hostDiv);
        tr.appendChild(td);

        createCombobox(hostDiv, col.fieldKey, {
          options: col.optionsFor ? col.optionsFor() : null,
          value: row[col.key] || '',
          onChange: (function (i, key, column, host) {
            return function (val) {
              cfg.getRows()[i][key] = val;
              if (column.warningFor) host._combobox.setWarning(column.warningFor(val));
              cfg.onChange();
            };
          })(index, col.key, col, hostDiv)
        });
        hostDiv._combobox.input.setAttribute(
          'aria-label',
          (D.fields[col.fieldKey].label || col.key) + ', ' + cfg.label + ' step ' + (index + 1)
        );
        if (col.warningFor) {
          hostDiv._combobox.setWarning(col.warningFor(row[col.key] || ''));
        }
      });

      var tdCtrls = el('td', 'col-controls');
      var group = el('div', 'row-ctrls');

      var up = el('button', 'icon-btn', '↑');
      up.type = 'button';
      up.disabled = (index === 0);
      up.setAttribute('aria-label', 'Move ' + cfg.label + ' step ' + (index + 1) + ' up');
      up.addEventListener('click', function () { cfg.onMove(index, -1); });

      var down = el('button', 'icon-btn', '↓');
      down.type = 'button';
      down.disabled = (index === rows.length - 1);
      down.setAttribute('aria-label', 'Move ' + cfg.label + ' step ' + (index + 1) + ' down');
      down.addEventListener('click', function () { cfg.onMove(index, 1); });

      var dup = el('button', 'icon-btn', '⧉');
      dup.type = 'button';
      dup.setAttribute('aria-label', 'Duplicate ' + cfg.label + ' step ' + (index + 1));
      dup.title = 'Duplicate this step';
      dup.addEventListener('click', function () { cfg.onDuplicate(index); });

      var del = el('button', 'icon-btn icon-btn--danger', '✕');
      del.type = 'button';
      del.disabled = (rows.length <= 1);
      del.setAttribute('aria-label', 'Remove ' + cfg.label + ' step ' + (index + 1));
      del.addEventListener('click', function () { cfg.onRemove(index); });

      group.appendChild(up);
      group.appendChild(down);
      group.appendChild(dup);
      group.appendChild(del);
      tdCtrls.appendChild(group);
      tr.appendChild(tdCtrls);

      tbody.appendChild(tr);
    });
  }

  /* Inserts a copy of row `index` directly below it. */
  function duplicateInArray(arr, index) {
    var source = arr[index];
    if (!source) return false;
    var copy = {};
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) copy[key] = source[key];
    }
    arr.splice(index + 1, 0, copy);
    return true;
  }

  function moveInArray(arr, index, delta) {
    var next = index + delta;
    if (next < 0 || next >= arr.length) return false;
    var tmp = arr[index];
    arr[index] = arr[next];
    arr[next] = tmp;
    return true;
  }

  /* ======================================================================
     4b. QUICK NAVIGATION
     A searchable, non-persisted picker above the Navigation Steps table.
     Selecting a flow appends its steps to the Navigation Steps table only —
     SilkCentral Steps is left entirely to the user — then resets itself; it
     is a trigger, not a data field, so it never holds a sticky value of its
     own.
     ====================================================================== */

  var quickNavCombobox = null;

  function currentQuickNavFlows() {
    return D.quicknavForApplication(state.testContext.targetApplication);
  }

  function refreshQuickNavOptions() {
    if (!quickNavCombobox) return;
    quickNavCombobox.setOptions(currentQuickNavFlows().map(function (f) { return f.label; }));
  }

  function initializeQuickNav() {
    var host = $('cbx-quick-nav');
    quickNavCombobox = new Combobox(host, {
      options: currentQuickNavFlows().map(function (f) { return f.label; }),
      allowCustom: false,
      label: 'Quick navigation',
      placeholder: 'Search a common flow to insert…',
      inputId: 'cbx-quick-nav-input',
      onChange: handleQuickNavPick
    });
    host._combobox = quickNavCombobox;
  }

  function handleQuickNavPick(label) {
    if (!hasText(label)) return;

    // The combobox's onChange fires on every keystroke, not just on an
    // actual selection — that is what lets the dropdown filter live as you
    // type words. Only an EXACT label match means something was actually
    // selected (click or Enter on a highlighted option); anything else is
    // still-in-progress typing, so leave the field alone and keep filtering.
    var flow = D.quicknav.filter(function (f) { return f.label === label; })[0];
    if (!flow) return;

    // A real selection was made — clear the picker back to empty (it never
    // keeps a sticky value) and insert the flow.
    quickNavCombobox.setValue('', false);
    insertQuickNavFlow(flow);
  }

  function insertQuickNavFlow(flow) {
    // If Target application is still empty, adopt the flow's own application
    // so the newly inserted targets are never flagged as mismatched.
    if (flow.application && !hasText(state.testContext.targetApplication)) {
      state.testContext.targetApplication = flow.application;
      topCombos.targetApplication.setValue(flow.application, false);
      refreshAutoTestCaseName();
    }

    // A single still-blank leading row is a placeholder, not real content —
    // drop it rather than leaving an empty row ahead of the inserted flow.
    // Quick navigation only ever fills Navigation Steps; SilkCentral Steps is
    // left entirely to the user.
    if (state.navigationSteps.length === 1 &&
        !hasText(state.navigationSteps[0].action) && !hasText(state.navigationSteps[0].target)) {
      state.navigationSteps.length = 0;
    }

    var insertedAt = state.navigationSteps.length;

    flow.steps.forEach(function (step) {
      state.navigationSteps.push({ action: step.action, target: step.target });
    });

    refreshNavigationTargets();          // application may have just changed
    renderNavigationSteps();
    updateNavigationPath();
    refreshQuickNavOptions();
    updateGeneratedPrompt();

    showToast('Inserted: ' + flow.label);
    focusRowField($('nav-body'), insertedAt);
  }

  /* ======================================================================
     5. NAVIGATION STEPS
     ====================================================================== */

  /* Target options follow the selected Target application. An empty, unknown
     or custom application falls back to every target. */
  function currentTargetOptions() {
    return D.targetsForApplication(state.testContext.targetApplication);
  }

  function targetWarning(value) {
    return D.targetMismatch(state.testContext.targetApplication, value);
  }

  /**
   * Re-points every Target cell at the option list for the current
   * application and re-evaluates its warning. Entered values are never
   * touched — a target belonging to another application simply gets flagged.
   */
  function refreshNavigationTargets() {
    var options = currentTargetOptions();
    var rows = $('nav-body').querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
      var hosts = rows[i].querySelectorAll('[data-cbx]');
      var host = hosts[1];                       // column 2 is Target
      if (!host || !host._combobox) continue;
      host._combobox.setOptions(options);
      host._combobox.setWarning(targetWarning(host._combobox.value));
    }
  }

  function navConfig() {
    return {
      tbody: $('nav-body'),
      label: 'navigation',
      getRows: function () { return state.navigationSteps; },
      columns: [
        { key: 'action', fieldKey: 'action' },
        {
          key: 'target',
          fieldKey: 'target',
          optionsFor: currentTargetOptions,
          warningFor: targetWarning
        }
      ],
      onChange: function () { updateNavigationPath(); updateGeneratedPrompt(); },
      onMove: function (i, d) { moveNavigationStep(i, d); },
      onDuplicate: function (i) { duplicateNavigationStep(i); },
      onRemove: function (i) { removeNavigationStep(i); }
    };
  }

  function renderNavigationSteps() {
    renderRows(navConfig());
    refreshNavigationDecorations();
  }

  /* ======================================================================
     4c. NAVIGATION STEP DECORATIONS — search filter + duplicate highlight
     Both are view-only: they never touch state.navigationSteps, only how the
     already-rendered rows are displayed. Runs after every render, so it
     stays correct across add / remove / move / duplicate / quick-nav insert
     without each of those call sites needing to know about it.
     ====================================================================== */

  var navSearchQuery = '';
  var highlightDuplicatesOn = false;

  /**
   * Row-key for duplicate detection: trimmed, case-insensitive Action+Target.
   * Rows missing either field are excluded — an incomplete row is not yet a
   * meaningful duplicate of anything.
   */
  function navRowKey(step) {
    var a = trim(step.action).toLowerCase();
    var t = trim(step.target).toLowerCase();
    if (!a || !t) return '';
    return a + ' / ' + t;
  }

  function refreshNavigationDecorations() {
    var rows = $('nav-body').querySelectorAll('tr');
    var query = navSearchQuery.trim().toLowerCase();
    var visibleCount = 0;

    var duplicateCounts = {};
    if (highlightDuplicatesOn) {
      state.navigationSteps.forEach(function (step) {
        var key = navRowKey(step);
        if (key) duplicateCounts[key] = (duplicateCounts[key] || 0) + 1;
      });
    }

    rows.forEach(function (tr, i) {
      var step = state.navigationSteps[i];
      if (!step) return;

      var a = trim(step.action);
      var t = trim(step.target);
      var matchesSearch = !query ||
        a.toLowerCase().indexOf(query) !== -1 ||
        t.toLowerCase().indexOf(query) !== -1;

      tr.hidden = !matchesSearch;
      if (matchesSearch) visibleCount++;

      var key = navRowKey(step);
      var isDuplicate = highlightDuplicatesOn && key && duplicateCounts[key] > 1;
      tr.classList.toggle('row--duplicate', isDuplicate);
      if (isDuplicate) {
        tr.title = 'Another step uses the same Action + Target.';
      } else {
        tr.removeAttribute('title');
      }
    });

    var total = state.navigationSteps.length;
    var unit = total === 1 ? ' step' : ' steps';
    $('nav-count').textContent = query
      ? (visibleCount + ' of ' + total + unit + ' shown')
      : (total + unit);

    var emptyMessage = $('nav-search-empty');
    emptyMessage.hidden = !(query && visibleCount === 0);
  }

  function setNavigationSearch(query) {
    navSearchQuery = query || '';
    var clearBtn = $('btn-nav-search-clear');
    if (clearBtn) clearBtn.hidden = !navSearchQuery;
    refreshNavigationDecorations();
  }

  function toggleHighlightDuplicates() {
    highlightDuplicatesOn = !highlightDuplicatesOn;
    var btn = $('btn-toggle-duplicates');
    if (btn) btn.setAttribute('aria-pressed', highlightDuplicatesOn ? 'true' : 'false');
    refreshNavigationDecorations();
  }

  function addNavigationStep() {
    state.navigationSteps.push({ action: '', target: '' });
    renderNavigationSteps();
    updateNavigationPath();
    updateGeneratedPrompt();
    focusLastRow($('nav-body'));
  }

  function removeNavigationStep(index) {
    if (state.navigationSteps.length <= 1) return;
    state.navigationSteps.splice(index, 1);
    renderNavigationSteps();
    updateNavigationPath();
    updateGeneratedPrompt();
  }

  function moveNavigationStep(index, delta) {
    if (!moveInArray(state.navigationSteps, index, delta)) return;
    renderNavigationSteps();
    updateNavigationPath();
    updateGeneratedPrompt();
    focusRowControl($('nav-body'), index + delta, delta > 0 ? 1 : 0);
  }

  function duplicateNavigationStep(index) {
    if (!duplicateInArray(state.navigationSteps, index)) return;
    renderNavigationSteps();
    updateNavigationPath();
    updateGeneratedPrompt();
    focusRowField($('nav-body'), index + 1);
  }

  function moveNavigationStepUp(index) { moveNavigationStep(index, -1); }
  function moveNavigationStepDown(index) { moveNavigationStep(index, 1); }

  /* ======================================================================
     6. SILKCENTRAL STEPS
     ====================================================================== */

  function silkConfig() {
    return {
      tbody: $('silk-body'),
      label: 'SilkCentral',
      getRows: function () { return state.silkCentralSteps; },
      columns: [
        { key: 'command', fieldKey: 'silkCommand' },
        { key: 'name', fieldKey: 'silkName' }
      ],
      onChange: function () { updateCommandValues(); updateGeneratedPrompt(); },
      onMove: function (i, d) { moveSilkCentralStep(i, d); },
      onDuplicate: function (i) { duplicateSilkCentralStep(i); },
      onRemove: function (i) { removeSilkCentralStep(i); }
    };
  }

  function renderSilkCentralSteps() {
    renderRows(silkConfig());
    $('silk-count').textContent =
      state.silkCentralSteps.length + (state.silkCentralSteps.length === 1 ? ' step' : ' steps');
  }

  function addSilkCentralStep() {
    state.silkCentralSteps.push({ command: '', name: '' });
    renderSilkCentralSteps();
    updateCommandValues();
    updateGeneratedPrompt();
    focusLastRow($('silk-body'));
  }

  function removeSilkCentralStep(index) {
    if (state.silkCentralSteps.length <= 1) return;
    state.silkCentralSteps.splice(index, 1);
    renderSilkCentralSteps();
    updateCommandValues();
    updateGeneratedPrompt();
  }

  function moveSilkCentralStep(index, delta) {
    if (!moveInArray(state.silkCentralSteps, index, delta)) return;
    renderSilkCentralSteps();
    updateCommandValues();
    updateGeneratedPrompt();
    focusRowControl($('silk-body'), index + delta, delta > 0 ? 1 : 0);
  }

  /* --- Command values ------------------------------------------------------
     The selected command values in row order, each prefixed with $ and joined
     by commas: $OpenApplication,$SetWindow,$SelectItem
     Derived only — rows with no command selected contribute nothing.
     ---------------------------------------------------------------------- */

  function commandValueString() {
    return state.silkCentralSteps
      .map(function (s) { return trim(s.command); })
      .filter(function (v) { return v.length > 0; })
      .map(function (v) { return '$' + v; })
      .join(',');
  }

  function updateCommandValues() {
    var container = $('silk-values');
    var value = commandValueString();

    clear(container);

    if (!value) {
      container.appendChild(el('span', 'path__empty',
        'The command values build themselves as you select commands above.'));
      return;
    }
    container.appendChild(el('code', 'path__code', value));
  }

  function duplicateSilkCentralStep(index) {
    if (!duplicateInArray(state.silkCentralSteps, index)) return;
    renderSilkCentralSteps();
    updateCommandValues();
    updateGeneratedPrompt();
    focusRowField($('silk-body'), index + 1);
  }

  function moveSilkCentralStepUp(index) { moveSilkCentralStep(index, -1); }
  function moveSilkCentralStepDown(index) { moveSilkCentralStep(index, 1); }

  /* --- focus helpers so keyboard users are not dropped after a re-render --- */

  function focusLastRow(tbody) {
    var rows = tbody.querySelectorAll('tr');
    if (!rows.length) return;
    var input = rows[rows.length - 1].querySelector('.cbx__input');
    if (input) input.focus();
  }

  function focusRowField(tbody, rowIndex) {
    var rows = tbody.querySelectorAll('tr');
    if (!rows[rowIndex]) return;
    var input = rows[rowIndex].querySelector('.cbx__input');
    if (input) input.focus();
  }

  function focusRowControl(tbody, rowIndex, buttonIndex) {
    var rows = tbody.querySelectorAll('tr');
    if (!rows[rowIndex]) return;
    var btns = rows[rowIndex].querySelectorAll('.row-ctrls .icon-btn');
    var btn = btns[buttonIndex];
    if (btn && !btn.disabled) btn.focus();
    else if (btns[0] && !btns[0].disabled) btns[0].focus();
  }

  /* ======================================================================
     7. NAVIGATION PATH (derived, never edited by hand)
     ====================================================================== */

  function navigationPathNodes() {
    return state.navigationSteps
      .map(function (s) {
        var a = trim(s.action);
        var t = trim(s.target);
        if (!a && !t) return '';
        if (a && t) return a + ' ' + t;
        return a || t;
      })
      .filter(function (v) { return v.length > 0; });
  }

  function updateNavigationPath() {
    var container = $('nav-path');
    var nodes = navigationPathNodes();

    clear(container);

    if (!nodes.length) {
      container.appendChild(el('span', 'path__empty',
        'The navigation path builds itself as you fill in the steps above.'));
      return;
    }

    nodes.forEach(function (label, i) {
      if (i > 0) {
        var arrow = el('span', 'path__arrow', '→');
        arrow.setAttribute('aria-hidden', 'true');
        container.appendChild(arrow);
      }
      var node = el('span', 'path__node');
      node.appendChild(el('span', 'path__index', String(i + 1)));
      node.appendChild(document.createTextNode(label));
      container.appendChild(node);
    });
  }

  /* ======================================================================
     8. PROMPT GENERATION  (the primary output)
     ====================================================================== */

  function filledNavSteps() {
    return state.navigationSteps.filter(function (s) {
      return hasText(s.action) || hasText(s.target);
    });
  }

  function filledSilkSteps() {
    return state.silkCentralSteps.filter(function (s) {
      return hasText(s.command) || hasText(s.name);
    });
  }

  function hasAnyInput() {
    var tc = state.testContext;
    var v = state.verification;
    /* The generated fallback name is not user input, so it alone must not
       make the prompt appear. Only a typed name counts. */
    return hasText(tc.testCaseName) ||
      hasText(tc.targetApplication) || hasText(tc.referenceFile) || hasText(tc.userStory) ||
      filledNavSteps().length > 0 || filledSilkSteps().length > 0 ||
      hasText(v.operation) || hasText(v.controlAccess) || hasText(v.controlType) ||
      hasText(v.expectedValue) || hasText(v.acceptanceCriteria);
  }

  function numberedList(items, startIndex) {
    var start = startIndex || 1;
    return items.map(function (item, i) { return (i + start) + '. ' + item; });
  }

  function section(out, heading, bodyLines) {
    if (!bodyLines || !bodyLines.length) return;
    out.push(heading);
    out.push(repeat('-', heading.length));
    bodyLines.forEach(function (l) { out.push(l); });
    out.push('');
  }

  function repeat(ch, n) {
    var s = '';
    for (var i = 0; i < n; i++) s += ch;
    return s;
  }

  /**
   * Builds the prompt from the entered information ONLY.
   *
   * There is no preamble, no role statement, no instruction block, no
   * constraint list and no closing text. The only strings that are not typed
   * by the user are the section headings and field labels, and those are taken
   * from DATALOADS.promptHeadings, which mirrors the labels shown in
   * index.html. Empty fields produce no output at all.
   */
  function generatePrompt() {
    if (!hasAnyInput()) return '';

    var tc = state.testContext;
    var v = state.verification;
    var nav = filledNavSteps();
    var silk = filledSilkSteps();
    var path = navigationPathNodes();
    var criteria = lines(v.acceptanceCriteria);
    var H = D.promptHeadings;
    var L = H.labels;

    var out = [];

    /* --- Test Context --------------------------------------------------- */
    var ctx = [];
    ctx.push(L.testCaseName + ': ' + effectiveTestCaseName());
    if (hasText(tc.targetApplication)) ctx.push(L.targetApplication + ': ' + trim(tc.targetApplication));
    if (hasText(tc.referenceFile)) ctx.push(L.referenceFile + ': ' + trim(tc.referenceFile));
    if (hasText(tc.userStory)) {
      if (ctx.length) ctx.push('');
      ctx.push(L.userStory + ':');
      lines(tc.userStory).forEach(function (l) { ctx.push(l); });
    }
    section(out, H.testContext, ctx);

    /* --- Navigation Steps ----------------------------------------------- */
    var navBody = [];
    nav.forEach(function (s, i) {
      var parts = [];
      if (hasText(s.action)) parts.push(trim(s.action));
      if (hasText(s.target)) parts.push(trim(s.target));
      navBody.push((i + 1) + '. ' + parts.join(' — '));
    });
    if (navBody.length && path.length) {
      navBody.push('');
      navBody.push(L.navigationPath + ': ' + path.join(' → '));
    }
    section(out, H.navigationSteps, navBody);

    /* --- SilkCentral Steps ---------------------------------------------- */
    var silkBody = [];
    silk.forEach(function (s, i) {
      var parts = [];
      if (hasText(s.command)) parts.push(trim(s.command));
      if (hasText(s.name)) parts.push(trim(s.name));
      silkBody.push((i + 1) + '. ' + parts.join(' — '));
    });
    if (silkBody.length) {
      var commandValues = commandValueString();
      if (commandValues) {
        silkBody.push('');
        silkBody.push(L.commandValues + ': ' + commandValues);
      }
    }
    section(out, H.silkCentralSteps, silkBody);

    /* --- Verification Evidence ------------------------------------------ */
    var verBody = [];
    if (hasText(v.operation)) verBody.push(L.verificationOperation + ': ' + trim(v.operation));
    if (hasText(v.controlAccess)) verBody.push(L.controlAccess + ': ' + trim(v.controlAccess));
    if (hasText(v.controlType)) verBody.push(L.controlType + ': ' + trim(v.controlType));
    if (hasText(v.expectedValue)) verBody.push(L.expectedValue + ': ' + trim(v.expectedValue));
    if (criteria.length) {
      if (verBody.length) verBody.push('');
      verBody.push(L.acceptanceCriteria + ':');
      numberedList(criteria).forEach(function (l) { verBody.push(l); });
    }
    section(out, H.verificationEvidence, verBody);

    // Collapse any trailing blank lines.
    while (out.length && out[out.length - 1] === '') out.pop();

    return out.join('\n');
  }

  /* ======================================================================
     9. OUTPUT PANEL
     ====================================================================== */

  var EMPTY_PROMPT_MESSAGE =
    'Fill in the form on the left — or load a sample — and the AI prompt will build ' +
    'itself here as you type.';

  var currentPrompt = '';

  function updateGeneratedPrompt() {
    currentPrompt = generatePrompt();

    var panel = $('prompt-output');
    if (currentPrompt) {
      panel.textContent = currentPrompt;
      panel.classList.remove('is-empty');
    } else {
      panel.textContent = EMPTY_PROMPT_MESSAGE;
      panel.classList.add('is-empty');
    }

    updateCharacterCount();
    updateReadyState();

    $('btn-copy').disabled = !currentPrompt;
    $('btn-download').disabled = !currentPrompt;
  }

  function updateCharacterCount() {
    var count = currentPrompt.length;
    $('char-count').textContent = count.toLocaleString('en-US') + ' chars';
  }

  function updateReadyState() {
    var tc = state.testContext;
    var v = state.verification;
    var required = [
      hasText(tc.targetApplication),
      hasText(tc.userStory),
      filledNavSteps().length > 0,
      filledSilkSteps().length > 0,
      hasText(v.operation),
      lines(v.acceptanceCriteria).length > 0
    ];
    var done = required.filter(Boolean).length;

    var label;
    if (!currentPrompt) label = 'Waiting for input';
    else if (done === required.length) label = 'Ready to send';
    else label = done + ' of ' + required.length + ' key sections complete';

    $('ready-state').textContent = label;
  }

  /* ======================================================================
     10. COPY / DOWNLOAD
     ====================================================================== */

  function flashButton(btn, message) {
    var labelNode = btn.querySelector('.btn__label');
    if (!labelNode) return;
    if (btn._restoreTimer) {
      window.clearTimeout(btn._restoreTimer);
    } else {
      btn._originalLabel = labelNode.textContent;
    }
    labelNode.textContent = message;
    btn.classList.add('btn--ok');
    btn._restoreTimer = window.setTimeout(function () {
      labelNode.textContent = btn._originalLabel;
      btn.classList.remove('btn--ok');
      btn._restoreTimer = null;
    }, 1800);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyPrompt() {
    if (!currentPrompt) return;
    var btn = $('btn-copy');

    function success() { flashButton(btn, 'Copied!'); showToast('Prompt copied to clipboard'); }
    function failure() { showToast('Copy failed — select the prompt text and copy manually'); }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentPrompt).then(success, function () {
        if (legacyCopy(currentPrompt)) success(); else failure();
      });
    } else {
      if (legacyCopy(currentPrompt)) success(); else failure();
    }
  }

  function timestampedFilename() {
    var d = new Date();
    return 'silk-test-prompt-' +
      d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + '-' +
      pad2(d.getHours()) + '-' + pad2(d.getMinutes()) + '-' + pad2(d.getSeconds()) + '.txt';
  }

  function downloadPrompt() {
    if (!currentPrompt) return;
    var name = timestampedFilename();
    var blob = new Blob([currentPrompt], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    flashButton($('btn-download'), 'Saved');
    showToast('Downloaded ' + name);
  }

  /* ======================================================================
     11. TOAST
     ====================================================================== */

  var toastTimer = null;

  function showToast(message) {
    var t = $('toast');
    t.textContent = message;
    t.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      t.classList.remove('is-visible');
    }, 2400);
  }

  /* ======================================================================
     12. SAMPLES / RESET
     ====================================================================== */

  function userHasEnteredData() {
    return hasAnyInput();
  }

  function applyState(next) {
    state = cloneState(next);
    if (!state.navigationSteps.length) state.navigationSteps = [{ action: '', target: '' }];
    if (!state.silkCentralSteps.length) state.silkCentralSteps = [{ command: '', name: '' }];
    // A stale search over content that no longer exists is confusing —
    // clear it. The duplicate-highlight toggle is a display preference, not
    // tied to any one test case, so it deliberately survives resets/samples.
    var searchInput = $('nav-search');
    if (searchInput) searchInput.value = '';
    var searchClear = $('btn-nav-search-clear');
    if (searchClear) searchClear.hidden = true;
    navSearchQuery = '';
    updateUI();
  }

  function loadSample(key) {
    var sample = D.samples[key];
    if (!sample) return;

    if (userHasEnteredData()) {
      var ok = window.confirm(
        'Load the ' + sample.label + '?\n\n' +
        'This replaces everything currently entered in the form.'
      );
      if (!ok) return;
    }

    applyState({
      testContext: sample.testContext,
      navigationSteps: sample.navigationSteps,
      silkCentralSteps: sample.silkCentralSteps,
      verification: sample.verification
    });
    showToast(sample.label + ' loaded');
  }

  function loadOutlookSample() { loadSample('outlook'); }
  function loadTeamsSample() { loadSample('teams'); }

  function resetForm() {
    if (userHasEnteredData()) {
      var ok = window.confirm('Reset everything?\n\nAll entered information will be cleared.');
      if (!ok) return;
    }
    applyState(D.emptyState);
    showToast('Form reset');
  }

  /* ======================================================================
     13. TOP-LEVEL FIELD COMBOBOXES + TEXTAREAS
     ====================================================================== */

  var topCombos = {};

  function initializeComboboxes() {
    initializeQuickNav();

    topCombos.targetApplication = createCombobox($('cbx-target-application'), 'targetApplication', {
      inputId: 'cbx-target-application-input',
      value: state.testContext.targetApplication,
      onChange: function (v) {
        state.testContext.targetApplication = v;
        refreshNavigationTargets();
        refreshAutoTestCaseName();
        refreshQuickNavOptions();
        updateGeneratedPrompt();
      }
    });

    topCombos.referenceFile = createCombobox($('cbx-reference-file'), 'referenceFile', {
      inputId: 'cbx-reference-file-input',
      value: state.testContext.referenceFile,
      onChange: function (v) { state.testContext.referenceFile = v; updateGeneratedPrompt(); }
    });

    topCombos.operation = createCombobox($('cbx-verification-operation'), 'verificationOperation', {
      inputId: 'cbx-verification-operation-input',
      value: state.verification.operation,
      onChange: function (v) { state.verification.operation = v; updateGeneratedPrompt(); }
    });

    topCombos.controlAccess = createCombobox($('cbx-control-access'), 'controlAccess', {
      inputId: 'cbx-control-access-input',
      value: state.verification.controlAccess,
      onChange: function (v) { state.verification.controlAccess = v; updateGeneratedPrompt(); }
    });

    topCombos.controlType = createCombobox($('cbx-control-type'), 'controlType', {
      inputId: 'cbx-control-type-input',
      value: state.verification.controlType,
      onChange: function (v) { state.verification.controlType = v; updateGeneratedPrompt(); }
    });

    topCombos.expectedValue = createCombobox($('cbx-expected-value'), 'expectedValue', {
      inputId: 'cbx-expected-value-input',
      value: state.verification.expectedValue,
      onChange: function (v) { state.verification.expectedValue = v; updateGeneratedPrompt(); }
    });
  }

  function syncTopControls() {
    topCombos.targetApplication.setValue(state.testContext.targetApplication, false);
    topCombos.referenceFile.setValue(state.testContext.referenceFile, false);
    topCombos.operation.setValue(state.verification.operation, false);
    topCombos.controlAccess.setValue(state.verification.controlAccess, false);
    topCombos.controlType.setValue(state.verification.controlType, false);
    topCombos.expectedValue.setValue(state.verification.expectedValue, false);

    $('test-case-name').value = state.testContext.testCaseName;
    $('user-story').value = state.testContext.userStory;
    $('acceptance').value = state.verification.acceptanceCriteria;
  }

  /* ======================================================================
     14. UI ORCHESTRATION
     ====================================================================== */

  function updateUI() {
    refreshAutoTestCaseName();
    syncTopControls();
    renderNavigationSteps();
    renderSilkCentralSteps();
    updateNavigationPath();
    updateCommandValues();
    refreshQuickNavOptions();
    updateGeneratedPrompt();
  }

  function bindEvents() {
    $('test-case-name').addEventListener('input', function () {
      state.testContext.testCaseName = this.value;
      updateGeneratedPrompt();
    });

    $('user-story').addEventListener('input', function () {
      state.testContext.userStory = this.value;
      updateGeneratedPrompt();
    });

    $('acceptance').addEventListener('input', function () {
      state.verification.acceptanceCriteria = this.value;
      updateGeneratedPrompt();
    });

    $('nav-search').addEventListener('input', function () {
      setNavigationSearch(this.value);
    });
    $('btn-nav-search-clear').addEventListener('click', function () {
      $('nav-search').value = '';
      setNavigationSearch('');
      $('nav-search').focus();
    });
    $('btn-toggle-duplicates').addEventListener('click', toggleHighlightDuplicates);

    $('btn-add-nav').addEventListener('click', addNavigationStep);
    $('btn-add-silk').addEventListener('click', addSilkCentralStep);

    $('btn-sample-outlook').addEventListener('click', loadOutlookSample);
    $('btn-sample-teams').addEventListener('click', loadTeamsSample);
    $('btn-reset').addEventListener('click', resetForm);

    $('btn-copy').addEventListener('click', copyPrompt);
    $('btn-download').addEventListener('click', downloadPrompt);
  }

  var initialized = false;

  function initializeApp() {
    /* Guard against a second init (duplicate script tag, a late
       DOMContentLoaded, a manual call). Re-running would discard everything
       entered and orphan the dropdowns already attached to <body>. */
    if (initialized) return;
    initialized = true;

    if (!D) {
      // Nothing sensible can be rendered without the data layer.
      document.body.innerHTML =
        '<p style="padding:24px">dataloads.js failed to load. Keep index.html, style.css, ' +
        'script.js and dataloads.js in the same folder.</p>';
      return;
    }
    state = cloneState(D.emptyState);
    initializeComboboxes();
    bindEvents();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  /* Exposed for debugging / manual use in the console. Nothing here talks to
     a server, a Silk API, or an AI service. */
  window.SilkPromptBuilder = {
    getState: function () { return state; },
    getPrompt: function () { return currentPrompt; },
    generatePrompt: generatePrompt,
    updateGeneratedPrompt: updateGeneratedPrompt,
    updateCharacterCount: updateCharacterCount,
    updateNavigationPath: updateNavigationPath,
    updateCommandValues: updateCommandValues,
    commandValueString: commandValueString,
    addNavigationStep: addNavigationStep,
    duplicateNavigationStep: duplicateNavigationStep,
    duplicateSilkCentralStep: duplicateSilkCentralStep,
    insertQuickNavFlow: insertQuickNavFlow,
    handleQuickNavPick: handleQuickNavPick,
    effectiveTestCaseName: effectiveTestCaseName,
    setNavigationSearch: setNavigationSearch,
    toggleHighlightDuplicates: toggleHighlightDuplicates,
    isHighlightDuplicatesOn: function () { return highlightDuplicatesOn; },
    removeNavigationStep: removeNavigationStep,
    moveNavigationStepUp: moveNavigationStepUp,
    moveNavigationStepDown: moveNavigationStepDown,
    addSilkCentralStep: addSilkCentralStep,
    removeSilkCentralStep: removeSilkCentralStep,
    moveSilkCentralStepUp: moveSilkCentralStepUp,
    moveSilkCentralStepDown: moveSilkCentralStepDown,
    loadOutlookSample: loadOutlookSample,
    loadTeamsSample: loadTeamsSample,
    resetForm: resetForm,
    copyPrompt: copyPrompt,
    downloadPrompt: downloadPrompt,
    updateUI: updateUI
  };
})();
