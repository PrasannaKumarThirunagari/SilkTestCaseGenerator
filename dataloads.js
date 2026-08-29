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
    'Outlook_Mail_Verification.t',
    'Teams_Chat_Verification.t',
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

  var TARGETS = [
    'Application shortcut',
    'Login page',
    'Home page',
    'Main window',
    'Navigation pane',
    'Ribbon toolbar',
    'Inbox folder',
    'Sent Items folder',
    'Drafts folder',
    'Email message',
    'Email attachment',
    'New Mail window',
    'Calendar view',
    'Meeting invite',
    'Contacts list',
    'Teams sidebar',
    'Chat list',
    'Chat window',
    'Message compose box',
    'Teams channel',
    'Files tab',
    'Meetings tab',
    'Search box',
    'Settings dialog',
    'Confirmation dialog',
    'Results grid',
    'Details panel',
    'Status bar'
  ];

  var SILK_COMMANDS = [
    'OpenApplication',
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
    'CloseApplicationUnderTest'
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

  /* ---------------------------------------------------------------------- */
  /* Sample payloads                                                         */
  /*                                                                        */
  /* Every sample value below is taken from the option lists above through  */
  /* pick(), so a sample can never contain a value that is missing from the */
  /* dropdowns. If a list is edited and a sample value disappears, pick()   */
  /* reports it in the console instead of failing silently.                 */
  /* ---------------------------------------------------------------------- */

  function pick(list, listName, value) {
    if (list.indexOf(value) === -1 && global.console && global.console.warn) {
      global.console.warn(
        '[dataloads] Sample value "' + value + '" is not present in ' + listName +
        '. Add it to that list to keep the samples and the dropdowns in sync.'
      );
    }
    return value;
  }

  function navStep(action, target) {
    return {
      action: pick(ACTIONS, 'ACTIONS', action),
      target: pick(TARGETS, 'TARGETS', target)
    };
  }

  function silkStep(command, name) {
    return {
      command: pick(SILK_COMMANDS, 'SILK_COMMANDS', command),
      name: pick(SILK_NAMES, 'SILK_NAMES', name)
    };
  }

  var OUTLOOK_SAMPLE = {
    id: 'outlook',
    label: 'Outlook Sample',
    testContext: {
      targetApplication: pick(APPLICATIONS, 'APPLICATIONS', 'Microsoft Outlook (Desktop)'),
      referenceFile: pick(REFERENCE_FILES, 'REFERENCE_FILES', 'Outlook_Mail_Verification.t'),
      userStory:
        'As an internal business user, I want to open the most recent email in my Outlook Inbox ' +
        'and open its attachment, so that I can confirm the daily reconciliation report was ' +
        'delivered with the correct file attached.'
    },
    navigationSteps: [
      navStep('Launch application', 'Application shortcut'),
      navStep('Login', 'Login page'),
      navStep('Navigate to', 'Inbox folder'),
      navStep('Select', 'Email message'),
      navStep('Open', 'Email attachment')
    ],
    silkCentralSteps: [
      silkStep('OpenApplication', 'LaunchApplicationUnderTest'),
      silkStep('SetWindow', 'PerformLogin'),
      silkStep('SelectItem', 'OpenInboxFolder'),
      silkStep('ClickControl', 'SelectFirstEmail'),
      silkStep('DoubleClickControl', 'OpenAttachment'),
      silkStep('VerifyText', 'ValidateAttachmentName'),
      silkStep('CaptureScreenshot', 'CaptureEvidenceScreenshot')
    ],
    verification: {
      operation: pick(VERIFICATION_OPERATIONS, 'VERIFICATION_OPERATIONS', 'Verify text contains'),
      controlAccess: pick(CONTROL_ACCESS, 'CONTROL_ACCESS', 'Accessibility name'),
      controlType: pick(CONTROL_TYPES, 'CONTROL_TYPES', 'Label'),
      expectedValue: pick(EXPECTED_VALUES, 'EXPECTED_VALUES', 'Attachment opened successfully'),
      acceptanceCriteria:
        'The most recent Inbox email opens without error.\n' +
        'The attachment name displayed in the reading pane matches the expected report name.\n' +
        'The attachment opens in its associated application within 15 seconds.\n' +
        'A screenshot is captured as verification evidence and attached to the test result.'
    }
  };

  var TEAMS_SAMPLE = {
    id: 'teams',
    label: 'Teams Sample',
    testContext: {
      targetApplication: pick(APPLICATIONS, 'APPLICATIONS', 'Microsoft Teams (Desktop)'),
      referenceFile: pick(REFERENCE_FILES, 'REFERENCE_FILES', 'Teams_Chat_Verification.t'),
      userStory:
        'As a project team member, I want to send a message in an existing Teams chat, ' +
        'so that I can confirm the message is delivered and displayed in the conversation history.'
    },
    navigationSteps: [
      navStep('Launch application', 'Application shortcut'),
      navStep('Login', 'Login page'),
      navStep('Navigate to', 'Teams sidebar'),
      navStep('Select', 'Chat list'),
      navStep('Open', 'Chat window'),
      navStep('Type text into', 'Message compose box'),
      navStep('Send', 'Chat window')
    ],
    silkCentralSteps: [
      silkStep('OpenApplication', 'LaunchApplicationUnderTest'),
      silkStep('SetWindow', 'PerformLogin'),
      silkStep('ClickControl', 'OpenChatWindow'),
      silkStep('SetText', 'SendChatMessage'),
      silkStep('PressKey', 'SendChatMessage'),
      silkStep('WaitForObject', 'ValidateMessageDelivered'),
      silkStep('VerifyText', 'ValidateControlText')
    ],
    verification: {
      operation: pick(VERIFICATION_OPERATIONS, 'VERIFICATION_OPERATIONS', 'Verify text equals'),
      controlAccess: pick(CONTROL_ACCESS, 'CONTROL_ACCESS', 'Locator (XPath)'),
      controlType: pick(CONTROL_TYPES, 'CONTROL_TYPES', 'ListItem'),
      expectedValue: pick(EXPECTED_VALUES, 'EXPECTED_VALUES', 'Message sent successfully'),
      acceptanceCriteria:
        'The typed message appears as the last item in the chat conversation.\n' +
        'The message text matches exactly what was entered in the compose box.\n' +
        'No delivery failure indicator is shown next to the message.\n' +
        'The verification result is written to the test report.'
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Defaults used by reset / initial render                                 */
  /* ---------------------------------------------------------------------- */

  var EMPTY_STATE = {
    testContext: { targetApplication: '', referenceFile: '', userStory: '' },
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
      targetApplication: 'Target application',
      referenceFile: 'Reference filename',
      userStory: 'User story description',
      navigationPath: 'Navigation path',
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
    silkCommands: SILK_COMMANDS,
    silkNames: SILK_NAMES,
    verificationOperations: VERIFICATION_OPERATIONS,
    controlAccess: CONTROL_ACCESS,
    controlTypes: CONTROL_TYPES,
    expectedValues: EXPECTED_VALUES,
    fields: FIELDS,
    emptyState: EMPTY_STATE,
    promptHeadings: PROMPT_HEADINGS,
    samples: {
      outlook: OUTLOOK_SAMPLE,
      teams: TEAMS_SAMPLE
    }
  };
})(window);
