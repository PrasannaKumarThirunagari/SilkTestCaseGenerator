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

    this.clearBtn = el('button', 'cbx__btn cbx__clear', '×');
    this.clearBtn.type = 'button';
    this.clearBtn.setAttribute('aria-label', 'Clear ' + (this.labelText || 'value'));
    this.clearBtn.hidden = !this.value;

    this.toggleBtn = el('button', 'cbx__btn cbx__toggle', '▾');
    this.toggleBtn.type = 'button';
    this.toggleBtn.tabIndex = -1;
    this.toggleBtn.setAttribute('aria-label', 'Show options for ' + (this.labelText || 'this field'));

    this.host.appendChild(this.input);
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
      self.value = self.input.value;
      self.clearBtn.hidden = !self.value;
      self.render(self.input.value);
      self.open();
      self.onChange(self.value);
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
      options: meta.options || [],
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
          value: row[col.key] || '',
          onChange: (function (i, key) {
            return function (val) {
              cfg.getRows()[i][key] = val;
              cfg.onChange();
            };
          })(index, col.key)
        });
        hostDiv._combobox.input.setAttribute(
          'aria-label',
          (D.fields[col.fieldKey].label || col.key) + ', ' + cfg.label + ' step ' + (index + 1)
        );
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

      var del = el('button', 'icon-btn icon-btn--danger', '✕');
      del.type = 'button';
      del.disabled = (rows.length <= 1);
      del.setAttribute('aria-label', 'Remove ' + cfg.label + ' step ' + (index + 1));
      del.addEventListener('click', function () { cfg.onRemove(index); });

      group.appendChild(up);
      group.appendChild(down);
      group.appendChild(del);
      tdCtrls.appendChild(group);
      tr.appendChild(tdCtrls);

      tbody.appendChild(tr);
    });
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
     5. NAVIGATION STEPS
     ====================================================================== */

  function navConfig() {
    return {
      tbody: $('nav-body'),
      label: 'navigation',
      getRows: function () { return state.navigationSteps; },
      columns: [
        { key: 'action', fieldKey: 'action' },
        { key: 'target', fieldKey: 'target' }
      ],
      onChange: function () { updateNavigationPath(); updateGeneratedPrompt(); },
      onMove: function (i, d) { moveNavigationStep(i, d); },
      onRemove: function (i) { removeNavigationStep(i); }
    };
  }

  function renderNavigationSteps() {
    renderRows(navConfig());
    $('nav-count').textContent =
      state.navigationSteps.length + (state.navigationSteps.length === 1 ? ' step' : ' steps');
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
      onChange: function () { updateGeneratedPrompt(); },
      onMove: function (i, d) { moveSilkCentralStep(i, d); },
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
    updateGeneratedPrompt();
    focusLastRow($('silk-body'));
  }

  function removeSilkCentralStep(index) {
    if (state.silkCentralSteps.length <= 1) return;
    state.silkCentralSteps.splice(index, 1);
    renderSilkCentralSteps();
    updateGeneratedPrompt();
  }

  function moveSilkCentralStep(index, delta) {
    if (!moveInArray(state.silkCentralSteps, index, delta)) return;
    renderSilkCentralSteps();
    updateGeneratedPrompt();
    focusRowControl($('silk-body'), index + delta, delta > 0 ? 1 : 0);
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
    return hasText(tc.targetApplication) || hasText(tc.referenceFile) || hasText(tc.userStory) ||
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
    topCombos.targetApplication = createCombobox($('cbx-target-application'), 'targetApplication', {
      inputId: 'cbx-target-application-input',
      value: state.testContext.targetApplication,
      onChange: function (v) { state.testContext.targetApplication = v; updateGeneratedPrompt(); }
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

    $('user-story').value = state.testContext.userStory;
    $('acceptance').value = state.verification.acceptanceCriteria;
  }

  /* ======================================================================
     14. UI ORCHESTRATION
     ====================================================================== */

  function updateUI() {
    syncTopControls();
    renderNavigationSteps();
    renderSilkCentralSteps();
    updateNavigationPath();
    updateGeneratedPrompt();
  }

  function bindEvents() {
    $('user-story').addEventListener('input', function () {
      state.testContext.userStory = this.value;
      updateGeneratedPrompt();
    });

    $('acceptance').addEventListener('input', function () {
      state.verification.acceptanceCriteria = this.value;
      updateGeneratedPrompt();
    });

    $('btn-add-nav').addEventListener('click', addNavigationStep);
    $('btn-add-silk').addEventListener('click', addSilkCentralStep);

    $('btn-sample-outlook').addEventListener('click', loadOutlookSample);
    $('btn-sample-teams').addEventListener('click', loadTeamsSample);
    $('btn-reset').addEventListener('click', resetForm);

    $('btn-copy').addEventListener('click', copyPrompt);
    $('btn-download').addEventListener('click', downloadPrompt);
  }

  function initializeApp() {
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
    addNavigationStep: addNavigationStep,
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
