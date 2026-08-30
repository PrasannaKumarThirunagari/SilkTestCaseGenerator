/* ============================================================================
   dataloads.js
   SINGLE SOURCE OF TRUTH for all predefined + sample data used by the
   "Silk Test Case Prompt Builder".

   Nothing in this file executes Silk commands. Every value here is purely
   INPUT DATA used to assemble an AI prompt.

   Exposed globally as: window.DATALOADS
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------------- */
  /* Option lists                                                            */
  /* ---------------------------------------------------------------------- */

  var APPLICATIONS = [
    'Microsoft Outlook (Desktop)',
    'Microsoft Outlook (Web)',
    'Microsoft Teams (Desktop)',
    'Microsoft Teams (Web)'
  ];

  var REFERENCE_FILES = [
    'Outlook.t',
    'Teams.t',
  ];

  var ACTIONS = [
    'Launch application',
    'Login',
    'Logout',
    'Navigate to',
    'Open',
    'Close',
    'Click',
    'Double click',
    'Right click',
    'Select',
    'Expand',
    'Collapse',
    'Type text into',
    'Clear',
    'Search for',
    'Filter by',
    'Scroll to',
    'Hover over',
    'Drag and drop',
    'Upload file to',
    'Download from',
    'Switch to',
    'Wait for',
    'Refresh',
    'Maximize window',
    'Send',
    'Save',
    'Delete'
  ];

  /* --- Navigation targets -------------------------------------------------
     Targets are split by application so the Navigation Steps "Target" column
     only offers what the selected Target application actually has.

     SHELL   : app-agnostic entry points, offered first for every application.
     OUTLOOK : mail / calendar targets.
     TEAMS   : chat / channel targets.
     GENERIC : app-agnostic UI furniture, offered last for every application.

     Desktop and Web variants of an application share one list.
     ---------------------------------------------------------------------- */

  var SHELL_TARGETS = [
    'Application shortcut',
    'Login page',
    'Home page',
    'Main window',
    'Navigation pane'
  ];

  var OUTLOOK_TARGETS = [
    'Ribbon toolbar',
    'Inbox folder',
    'Sent Items folder',
    'Drafts folder',
    'Email message',
    'Email attachment',
    'New Mail window',
    'Calendar view',
    'Meeting invite',
    'Contacts list'
  ];

  var TEAMS_TARGETS = [
    'Teams sidebar',
    'Chat list',
    'Chat window',
    'New chat button',
    'Message compose box',
    'Teams channel',
    'Files tab',
    'Meetings tab',
    'Join button'
  ];

  var GENERIC_TARGETS = [
    'Search box',
    'Settings dialog',
    'Confirmation dialog',
    'Results grid',
    'Details panel',
    'Status bar'
  ];

  function targetSet(appSpecific) {
    return SHELL_TARGETS.concat(appSpecific, GENERIC_TARGETS);
  }

  /* Every target that exists anywhere. Used as the fallback list when no
     application is selected, and to tell a recognised-but-wrong-app target
     apart from a value the user typed themselves. */
  var TARGETS = SHELL_TARGETS
    .concat(OUTLOOK_TARGETS, TEAMS_TARGETS, GENERIC_TARGETS);

  /* Keys must match the entries in APPLICATIONS exactly. */
  var TARGETS_BY_APPLICATION = {
    'Microsoft Outlook (Desktop)': targetSet(OUTLOOK_TARGETS),
    'Microsoft Outlook (Web)': targetSet(OUTLOOK_TARGETS),
    'Microsoft Teams (Desktop)': targetSet(TEAMS_TARGETS),
    'Microsoft Teams (Web)': targetSet(TEAMS_TARGETS)
  };

  /**
   * Target options for the given application.
   * An empty, unknown or custom-typed application falls back to every target,
   * so nothing is ever unreachable.
   */
  function targetsForApplication(application) {
    var key = (application === undefined || application === null) ? '' : String(application).trim();
    return TARGETS_BY_APPLICATION[key] || TARGETS;
  }

  /**
   * Returns a warning message when value is a target belonging to a different
   * application, or '' when there is nothing to flag.
   * A value the user typed themselves is never flagged — only recognised
   * targets that belong to another application are.
   */
  function targetMismatch(application, value) {
    var app = (application === undefined || application === null) ? '' : String(application).trim();
    var val = (value === undefined || value === null) ? '' : String(value).trim();

    if (!app || !val) return '';
    if (!TARGETS_BY_APPLICATION[app]) return '';       // custom / unknown application
    if (TARGETS.indexOf(val) === -1) return '';        // value the user typed themselves
    if (TARGETS_BY_APPLICATION[app].indexOf(val) !== -1) return '';

    return '"' + val + '" is not a ' + app + ' target.';
  }

  var SILK_COMMANDS = [
    '{OpenApplication}',
    'CloseApplication',
    'AttachToApplication',
    'SetWindow',
    'ClickControl',
    'DoubleClickControl',
    'RightClickControl',
    'SetText',
    'ClearText',
    'SelectItem',
    'SelectListItem',
    'SelectTab',
    'SelectMenuItem',
    'CheckControl',
    'UncheckControl',
    'PressKey',
    'WaitForObject',
    'WaitForProperty',
    'VerifyText',
    'VerifyProperty',
    'VerifyExists',
    'VerifyEnabled',
    'VerifyVisible',
    'CaptureScreenshot',
    'WriteToReport',
    'ReadTestData',
    'SetTestVariable',
    'GetTestVariable'
  ];

  var SILK_NAMES = [
    'LaunchApplicationUnderTest',
    'PerformLogin',
    'PerformLogout',
    'NavigateToModule',
    'OpenInboxFolder',
    'SelectFirstEmail',
    'OpenAttachment',
    'ComposeNewMail',
    'SendMail',
    'OpenChatWindow',
    'SendChatMessage',
    'OpenTeamsChannel',
    'JoinMeeting',
    'EnterSearchKeyword',
    'ApplyFilter',
    'ValidateControlText',
    'ValidateControlState',
    'ValidateAttachmentName',
    'ValidateMessageDelivered',
    'CaptureEvidenceScreenshot',
    'LogVerificationResult',
    'CloseApplicationUnderTest',
    'StartNewChat',
    'EnterRecipientName',
    'SelectRecipientFromResults',
    'OpenMeetingsTab',
    'ClickReplyButton',
    'EnterReplyText'
  ];

  var VERIFICATION_OPERATIONS = [
    'Verify text equals',
    'Verify text contains',
    'Verify text does not contain',
    'Verify text starts with',
    'Verify text ends with',
    'Verify control exists',
    'Verify control does not exist',
    'Verify control is enabled',
    'Verify control is disabled',
    'Verify control is visible',
    'Verify control is hidden',
    'Verify checkbox is checked',
    'Verify checkbox is unchecked',
    'Verify item is selected',
    'Verify item count equals',
    'Verify property value equals',
    'Verify attribute value equals',
    'Verify screenshot captured'
  ];

  var CONTROL_ACCESS = [
    'Locator (XPath)',
    'Locator (CSS selector)',
    'Automation ID',
    'Accessibility name',
    'Caption / Label text',
    'Object Map identifier',
    'Window class name',
    'Control index',
    'Test object hierarchy path',
    'Tag / HTML id',
    'Name property',
    'Text property'
  ];

  var CONTROL_TYPES = [
    'Button',
    'CheckBox',
    'RadioButton',
    'TextField',
    'TextArea',
    'ComboBox',
    'ListBox',
    'ListItem',
    'Table',
    'TableRow',
    'TableCell',
    'TreeView',
    'TreeItem',
    'TabControl',
    'Menu',
    'MenuItem',
    'Label',
    'Link',
    'Image',
    'Dialog',
    'Window',
    'Toolbar',
    'StatusBar',
    'ScrollBar',
    'ProgressBar'
  ];

  var EXPECTED_VALUES = [
    'True',
    'False',
    'Enabled',
    'Disabled',
    'Visible',
    'Hidden',
    'Checked',
    'Unchecked',
    'Selected',
    'Message sent successfully',
    'Attachment opened successfully',
    'Login successful',
    'Record saved successfully',
    'No results found',
    '0',
    '1',
    'Non-empty text'
  ];

  /* ======================================================================
     SAMPLE PAYLOADS

     The samples are NOT stored as fixed values. Each one is a blueprint that
     names what it wants, and buildSample() resolves every name against the
     option lists above at load time. The value a sample loads therefore
     always comes from the current lists — edit a list and the samples follow.

     Each blueprint entry is either a single name, or several names in order
     of preference. resolve() tries, in order:

       1. an exact match (case-insensitive)
       2. a partial match either way, so 'Inbox folder' still finds a renamed
          'Inbox', and 'Inbox' still finds 'Inbox folder'
       3. the entry sharing the most words, so 'CaptureScreenshot' still finds
          a renamed 'TakeScreenshot' and 'Email attachment' finds
          'Mail attachment' (camelCase is split into words too)
       4. the first entry in the list, reported in the console

     A sample can never load a value that is absent from its dropdown.
     ====================================================================== */

  /* 'CaptureScreenshot' -> ['capture','screenshot'];
     'Outlook_Mail_Verification.t' -> ['outlook','mail','verification'].
     Words of 1-2 characters carry no meaning here and are dropped. */
  function tokenize(text) {
    return String(text)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(function (word) { return word.length > 2; });
  }

  function sharedWordCount(aTokens, bTokens) {
    var shared = 0;
    for (var i = 0; i < aTokens.length; i++) {
      if (bTokens.indexOf(aTokens[i]) !== -1) shared++;
    }
    return shared;
  }

  function resolve(list, candidates, listName, notes, fieldLabel) {
    if (!list || !list.length) {
      notes.push(fieldLabel + ': ' + listName + ' is empty — left blank.');
      return '';
    }

    var wanted = (typeof candidates === 'string') ? [candidates] : (candidates || []);
    var i, j, want, entry;

    /* 1. exact match */
    for (i = 0; i < wanted.length; i++) {
      want = String(wanted[i]).toLowerCase();
      for (j = 0; j < list.length; j++) {
        if (String(list[j]).toLowerCase() === want) return list[j];
      }
    }

    /* 2. partial match in either direction (survives renames) */
    for (i = 0; i < wanted.length; i++) {
      want = String(wanted[i]).toLowerCase();
      if (!want) continue;
      for (j = 0; j < list.length; j++) {
        entry = String(list[j]).toLowerCase();
        if (!entry) continue;
        if (entry.indexOf(want) !== -1 || want.indexOf(entry) !== -1) {
          notes.push(fieldLabel + ': "' + wanted[0] + '" → "' + list[j] + '"');
          return list[j];
        }
      }
    }

    /* 3. the entry sharing the most words */
    var entryTokens = list.map(tokenize);
    for (i = 0; i < wanted.length; i++) {
      var wantTokens = tokenize(wanted[i]);
      if (!wantTokens.length) continue;

      var bestIndex = -1;
      var bestScore = 0;
      for (j = 0; j < list.length; j++) {
        var score = sharedWordCount(wantTokens, entryTokens[j]);
        if (score > bestScore) { bestScore = score; bestIndex = j; }
      }
      if (bestIndex !== -1) {
        notes.push(fieldLabel + ': "' + wanted[0] + '" → "' + list[bestIndex] + '"');
        return list[bestIndex];
      }
    }

    /* 4. nothing recognisable left — fall back to the first entry */
    notes.push(
      fieldLabel + ': "' + wanted[0] + '" is no longer in ' + listName +
      ' — used "' + list[0] + '"'
    );
    return list[0];
  }

  function buildSample(bp) {
    var notes = [];

    var application = resolve(APPLICATIONS, bp.application, 'APPLICATIONS', notes, 'Target application');

    /* Navigation targets are resolved against this application's own target
       list, so an Outlook sample can never pick up a Teams target. */
    var appTargets = targetsForApplication(application);
    var targetListName = 'the ' + (application || 'default') + ' target list';

    var sample = {
      id: bp.id,
      label: bp.label,
      testContext: {
        testCaseName: bp.testCaseName || '',
        targetApplication: application,
        referenceFile: resolve(REFERENCE_FILES, bp.referenceFile, 'REFERENCE_FILES', notes, 'Reference filename'),
        userStory: bp.userStory
      },
      navigationSteps: bp.navigation.map(function (step, i) {
        var where = 'Navigation step ' + (i + 1);
        return {
          action: resolve(ACTIONS, step[0], 'ACTIONS', notes, where + ' action'),
          target: resolve(appTargets, step[1], targetListName, notes, where + ' target')
        };
      }),
      silkCentralSteps: bp.silkCentral.map(function (step, i) {
        var where = 'SilkCentral step ' + (i + 1);
        return {
          command: resolve(SILK_COMMANDS, step[0], 'SILK_COMMANDS', notes, where + ' command'),
          name: resolve(SILK_NAMES, step[1], 'SILK_NAMES', notes, where + ' name')
        };
      }),
      verification: {
        operation: resolve(VERIFICATION_OPERATIONS, bp.verification.operation, 'VERIFICATION_OPERATIONS', notes, 'Verification operation'),
        controlAccess: resolve(CONTROL_ACCESS, bp.verification.controlAccess, 'CONTROL_ACCESS', notes, 'Control access'),
        controlType: resolve(CONTROL_TYPES, bp.verification.controlType, 'CONTROL_TYPES', notes, 'Control type'),
        expectedValue: resolve(EXPECTED_VALUES, bp.verification.expectedValue, 'EXPECTED_VALUES', notes, 'Expected value'),
        acceptanceCriteria: bp.verification.acceptanceCriteria
      }
    };

    /* Anything that had to be adapted is reported once, per sample. */
    sample.adaptations = notes;
    if (notes.length && global.console && global.console.warn) {
      global.console.warn(
        '[dataloads] "' + bp.label + '" was adapted to the current lists:\n  ' + notes.join('\n  ')
      );
    }

    return sample;
  }

  /* --- Blueprints ---------------------------------------------------------
     Free text (user story, acceptance criteria) belongs to the sample and is
     used as written. Everything else names a list entry.
     ---------------------------------------------------------------------- */

  var OUTLOOK_BLUEPRINT = {
    id: 'outlook',
    label: 'Outlook Sample',
    testCaseName: 'Outlook_OpenInboxAttachment',
    application: 'Microsoft Outlook (Desktop)',
    referenceFile: 'Outlook.t',
    userStory:
      'As an internal business user, I want to open the most recent email in my Outlook Inbox ' +
      'and open its attachment, so that I can confirm the daily reconciliation report was ' +
      'delivered with the correct file attached.',
    navigation: [
      ['Launch application', 'Application shortcut'],
      ['Login', 'Login page'],
      ['Navigate to', 'Inbox folder'],
      ['Select', 'Email message'],
      ['Open', 'Email attachment']
    ],
    silkCentral: [
      ['OpenApplication', 'LaunchApplicationUnderTest'],
      ['SetWindow', 'PerformLogin'],
      ['SelectItem', 'OpenInboxFolder'],
      ['ClickControl', 'SelectFirstEmail'],
      ['DoubleClickControl', 'OpenAttachment'],
      ['VerifyText', 'ValidateAttachmentName'],
      ['CaptureScreenshot', 'CaptureEvidenceScreenshot']
    ],
    verification: {
      operation: 'Verify text contains',
      controlAccess: 'Accessibility name',
      controlType: 'Label',
      expectedValue: 'Attachment opened successfully',
      acceptanceCriteria:
        'The most recent Inbox email opens without error.\n' +
        'The attachment name displayed in the reading pane matches the expected report name.\n' +
        'The attachment opens in its associated application within 15 seconds.\n' +
        'A screenshot is captured as verification evidence and attached to the test result.'
    }
  };

  var TEAMS_BLUEPRINT = {
    id: 'teams',
    label: 'Teams Sample',
    testCaseName: 'Teams_SendChatMessage',
    application: 'Microsoft Teams (Desktop)',
    referenceFile: 'Teams.t',
    userStory:
      'As a project team member, I want to send a message in an existing Teams chat, ' +
      'so that I can confirm the message is delivered and displayed in the conversation history.',
    navigation: [
      ['Launch application', 'Application shortcut'],
      ['Login', 'Login page'],
      ['Navigate to', 'Teams sidebar'],
      ['Select', 'Chat list'],
      ['Open', 'Chat window'],
      ['Type text into', 'Message compose box'],
      ['Send', 'Chat window']
    ],
    silkCentral: [
      ['OpenApplication', 'LaunchApplicationUnderTest'],
      ['SetWindow', 'PerformLogin'],
      ['ClickControl', 'OpenChatWindow'],
      ['SetText', 'SendChatMessage'],
      ['PressKey', 'SendChatMessage'],
      ['WaitForObject', 'ValidateMessageDelivered'],
      ['VerifyText', 'ValidateControlText']
    ],
    verification: {
      operation: 'Verify text equals',
      controlAccess: 'Locator (XPath)',
      controlType: 'ListItem',
      expectedValue: 'Message sent successfully',
      acceptanceCriteria:
        'The typed message appears as the last item in the chat conversation.\n' +
        'The message text matches exactly what was entered in the compose box.\n' +
        'No delivery failure indicator is shown next to the message.\n' +
        'The verification result is written to the test report.'
    }
  };

  var OUTLOOK_SAMPLE = buildSample(OUTLOOK_BLUEPRINT);
  var TEAMS_SAMPLE = buildSample(TEAMS_BLUEPRINT);

  /* ======================================================================
     QUICK NAVIGATION FLOWS

     Raw content lives in quicknav.js (window.QUICKNAV_BLUEPRINTS), loaded
     before this file. Each flow is resolved here the same way the samples
     are: every action / target / command / name is matched against the real
     option lists, so a rename or deletion in the lists above is absorbed
     instead of breaking the flow. Navigation targets are resolved against
     the flow's own application, not whatever is currently selected in the
     form.
     ====================================================================== */

  function buildQuickNavFlow(bp) {
    var notes = [];
    var application = bp.application
      ? resolve(APPLICATIONS, bp.application, 'APPLICATIONS', notes, bp.label + ': application')
      : '';
    var appTargets = application ? targetsForApplication(application) : TARGETS;
    var targetListName = application ? ('the ' + application + ' target list') : 'TARGETS';

    var steps = (bp.steps || []).map(function (step, i) {
      var where = bp.label + ': step ' + (i + 1);
      return {
        action: resolve(ACTIONS, step[0], 'ACTIONS', notes, where + ' action'),
        target: resolve(appTargets, step[1], targetListName, notes, where + ' target'),
        command: resolve(SILK_COMMANDS, step[2], 'SILK_COMMANDS', notes, where + ' command'),
        name: resolve(SILK_NAMES, step[3], 'SILK_NAMES', notes, where + ' name')
      };
    });

    var flow = {
      id: bp.id,
      label: bp.label,
      application: application,
      steps: steps,
      adaptations: notes
    };

    if (notes.length && global.console && global.console.warn) {
      global.console.warn(
        '[dataloads] Quick-nav flow "' + bp.label + '" was adapted to the current lists:\n  ' +
        notes.join('\n  ')
      );
    }

    return flow;
  }

  var QUICKNAV = (global.QUICKNAV_BLUEPRINTS || []).map(buildQuickNavFlow);

  /**
   * Flows relevant to the given Target application, for the Quick navigation
   * picker. Falls back to every flow when no application is selected, the
   * application is unrecognised, or no flow declares that exact application —
   * so the picker is never left empty.
   */
  function quicknavForApplication(application) {
    var app = (application === undefined || application === null) ? '' : String(application).trim();
    if (!app) return QUICKNAV;
    var matches = QUICKNAV.filter(function (f) { return f.application === app; });
    return matches.length ? matches : QUICKNAV;
  }

  /* ---------------------------------------------------------------------- */
  /* Defaults used by reset / initial render                                 */
  /* ---------------------------------------------------------------------- */

  var EMPTY_STATE = {
    testContext: { testCaseName: '', targetApplication: '', referenceFile: '', userStory: '' },
    navigationSteps: [{ action: '', target: '' }],
    silkCentralSteps: [{ command: '', name: '' }],
    verification: {
      operation: '',
      controlAccess: '',
      controlType: '',
      expectedValue: '',
      acceptanceCriteria: ''
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Field metadata — drives combobox creation so behaviour stays uniform    */
  /* ---------------------------------------------------------------------- */

  var FIELDS = {
    targetApplication: {
      label: 'Target application',
      options: APPLICATIONS,
      allowCustom: true,
      placeholder: 'Search or type an application…'
    },
    referenceFile: {
      label: 'Reference filename',
      options: REFERENCE_FILES,
      allowCustom: true,
      placeholder: 'Search or type a filename…'
    },
    action: {
      label: 'Action',
      options: ACTIONS,
      allowCustom: true,
      placeholder: 'Search or type an action…'
    },
    target: {
      label: 'Target',
      options: TARGETS,
      allowCustom: true,
      placeholder: 'Search or type a target…'
    },
    silkCommand: {
      label: 'Command value',
      options: SILK_COMMANDS,
      allowCustom: true,
      placeholder: 'Search or type a command…'
    },
    silkName: {
      label: 'Name',
      options: SILK_NAMES,
      allowCustom: true,
      placeholder: 'Search or type a name…'
    },
    verificationOperation: {
      label: 'Verification operation',
      options: VERIFICATION_OPERATIONS,
      allowCustom: true,
      placeholder: 'Search or type an operation…'
    },
    controlAccess: {
      label: 'Control access',
      options: CONTROL_ACCESS,
      allowCustom: true,
      placeholder: 'Search or type how the control is accessed…'
    },
    controlType: {
      label: 'Control type',
      options: CONTROL_TYPES,
      allowCustom: true,
      placeholder: 'Search or type a control type…'
    },
    expectedValue: {
      label: 'Expected value',
      options: EXPECTED_VALUES,
      allowCustom: true,
      placeholder: 'Search or type the expected value…'
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Section headings used by the generated prompt.                          */
  /* These mirror the section titles and field labels shown in index.html —  */
  /* no additional instruction text is added to the prompt anywhere.         */
  /* ---------------------------------------------------------------------- */

  var PROMPT_HEADINGS = {
    testContext: 'TEST CONTEXT',
    navigationSteps: 'NAVIGATION STEPS',
    silkCentralSteps: 'SILKCENTRAL STEPS',
    verificationEvidence: 'VERIFICATION EVIDENCE',
    labels: {
      testCaseName: 'Test case name',
      targetApplication: 'Target application',
      referenceFile: 'Reference filename',
      userStory: 'User story description',
      navigationPath: 'Navigation path',
      commandValues: 'Command values',
      verificationOperation: 'Verification operation',
      controlAccess: 'Control access',
      controlType: 'Control type',
      expectedValue: 'Expected value',
      acceptanceCriteria: 'Expected results / acceptance criteria'
    }
  };

  /* ---------------------------------------------------------------------- */

  global.DATALOADS = {
    applications: APPLICATIONS,
    referenceFiles: REFERENCE_FILES,
    actions: ACTIONS,
    targets: TARGETS,
    targetsByApplication: TARGETS_BY_APPLICATION,
    targetsForApplication: targetsForApplication,
    targetMismatch: targetMismatch,
    silkCommands: SILK_COMMANDS,
    silkNames: SILK_NAMES,
    verificationOperations: VERIFICATION_OPERATIONS,
    controlAccess: CONTROL_ACCESS,
    controlTypes: CONTROL_TYPES,
    expectedValues: EXPECTED_VALUES,
    fields: FIELDS,
    emptyState: EMPTY_STATE,
    promptHeadings: PROMPT_HEADINGS,
    quicknav: QUICKNAV,
    quicknavForApplication: quicknavForApplication,
    samples: {
      outlook: OUTLOOK_SAMPLE,
      teams: TEAMS_SAMPLE
    }
  };
})(window);
