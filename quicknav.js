
/* ============================================================================
   quicknav.js
   Raw content for the "Quick navigation" picker on Navigation Steps.

   Microsoft Teams (Desktop) common workflows.

   Each step is a 4-tuple:
     [action, target, commandValue, name]

   application must match the APPLICATIONS entry in dataloads.js.
   ========================================================================== */

(function (global) {
    'use strict';

    global.QUICKNAV_BLUEPRINTS = [

        /* ------------------------------------------------------------------------
           CHAT
           ------------------------------------------------------------------------ */

        {
            id: 'teams-start-new-chat',
            label: 'Open Teams → Start a new chat',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Click', 'New chat button', 'ClickControl', 'StartNewChat'],
                ['Type text into', 'Search box', 'SetText', 'EnterRecipientName'],
                ['Select', 'Results grid', 'SelectItem', 'SelectRecipientFromResults'],
                ['Type text into', 'Message box', 'SetText', 'EnterMessageText'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-send-message-existing-chat',
            label: 'Open Teams → Send message in existing chat',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Type text into', 'Message box', 'SetText', 'EnterMessageText'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-reply-to-message',
            label: 'Open Teams → Reply to a chat message',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Select', 'Chat message', 'ClickControl', 'SelectMessage'],
                ['Click', 'Reply button', 'ClickControl', 'ReplyToMessage'],
                ['Type text into', 'Message box', 'SetText', 'EnterReplyText'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-group-chat',
            label: 'Open Teams → Start a group chat',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Click', 'New chat button', 'ClickControl', 'StartNewChat'],
                ['Type text into', 'Search box', 'SetText', 'EnterFirstRecipient'],
                ['Select', 'Results grid', 'SelectItem', 'SelectFirstRecipient'],
                ['Type text into', 'Search box', 'SetText', 'EnterAdditionalRecipient'],
                ['Select', 'Results grid', 'SelectItem', 'SelectAdditionalRecipient'],
                ['Click', 'Message box', 'ClickControl', 'OpenGroupChat'],
                ['Type text into', 'Message box', 'SetText', 'EnterGroupMessage'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-search-message',
            label: 'Open Teams → Search for a message',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Search box', 'ClickControl', 'OpenGlobalSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterSearchText'],
                ['Click', 'Search results', 'ClickControl', 'OpenSearchResults'],
                ['Select', 'Message result', 'SelectItem', 'SelectMessageResult']
            ]
        },

        {
            id: 'teams-search-person',
            label: 'Open Teams → Search for a person',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Search box', 'ClickControl', 'OpenGlobalSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterPersonName'],
                ['Select', 'Search results', 'SelectItem', 'SelectPersonFromResults']
            ]
        },

        /* ------------------------------------------------------------------------
           TEAMS & CHANNELS
           ------------------------------------------------------------------------ */

        {
            id: 'teams-open-team-channel',
            label: 'Open Teams → Open a team and channel',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Teams navigation', 'ClickControl', 'OpenTeamsSection'],
                ['Select', 'Team list', 'SelectItem', 'SelectTeam'],
                ['Select', 'Channel list', 'SelectItem', 'SelectChannel']
            ]
        },

        {
            id: 'teams-send-channel-message',
            label: 'Open Teams → Send message to a channel',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Teams navigation', 'ClickControl', 'OpenTeamsSection'],
                ['Select', 'Team list', 'SelectItem', 'SelectTeam'],
                ['Select', 'Channel list', 'SelectItem', 'SelectChannel'],
                ['Click', 'New post button', 'ClickControl', 'StartNewPost'],
                ['Type text into', 'Post message box', 'SetText', 'EnterChannelMessage'],
                ['Click', 'Post button', 'ClickControl', 'PostChannelMessage']
            ]
        },

        {
            id: 'teams-reply-channel-post',
            label: 'Open Teams → Reply to a channel post',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Teams navigation', 'ClickControl', 'OpenTeamsSection'],
                ['Select', 'Team list', 'SelectItem', 'SelectTeam'],
                ['Select', 'Channel list', 'SelectItem', 'SelectChannel'],
                ['Select', 'Channel post', 'SelectItem', 'SelectChannelPost'],
                ['Click', 'Reply button', 'ClickControl', 'ReplyToPost'],
                ['Type text into', 'Reply message box', 'SetText', 'EnterReplyText'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-mention-person',
            label: 'Open Teams → Mention a person in a message',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Click', 'Message box', 'ClickControl', 'OpenMessageBox'],
                ['Type text into', 'Message box', 'SetText', 'EnterMentionText'],
                ['Select', 'Mention results', 'SelectItem', 'SelectMentionedPerson'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        /* ------------------------------------------------------------------------
           FILES
           ------------------------------------------------------------------------ */

        {
            id: 'teams-upload-file-chat',
            label: 'Open Teams → Upload a file to chat',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Click', 'Attach button', 'ClickControl', 'OpenAttachmentMenu'],
                ['Select', 'File option', 'SelectItem', 'SelectFileUploadOption'],
                ['Type text into', 'File name field', 'SetText', 'EnterFilePath'],
                ['Click', 'Open button', 'ClickControl', 'UploadFile'],
                ['Click', 'Send button', 'ClickControl', 'SendMessage']
            ]
        },

        {
            id: 'teams-open-shared-file',
            label: 'Open Teams → Open a shared file',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Select', 'Shared file', 'SelectItem', 'SelectSharedFile'],
                ['Click', 'Open file button', 'ClickControl', 'OpenSharedFile']
            ]
        },

        {
            id: 'teams-download-file',
            label: 'Open Teams → Download a shared file',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Chat list', 'ClickControl', 'OpenChatWindow'],
                ['Select', 'Chat conversation', 'SelectItem', 'SelectExistingChat'],
                ['Select', 'Shared file', 'SelectItem', 'SelectSharedFile'],
                ['Click', 'More options button', 'ClickControl', 'OpenFileOptions'],
                ['Click', 'Download button', 'ClickControl', 'DownloadFile']
            ]
        },

        /* ------------------------------------------------------------------------
           MEETINGS
           ------------------------------------------------------------------------ */

        {
            id: 'teams-join-meeting',
            label: 'Open Teams → Join a scheduled meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Scheduled meeting', 'SelectItem', 'SelectScheduledMeeting'],
                ['Click', 'Join button', 'ClickControl', 'JoinMeeting']
            ]
        },

        {
            id: 'teams-schedule-meeting',
            label: 'Open Teams → Schedule a meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Click', 'New meeting button', 'ClickControl', 'CreateNewMeeting'],
                ['Type text into', 'Meeting title field', 'SetText', 'EnterMeetingTitle'],
                ['Type text into', 'Attendees field', 'SetText', 'EnterAttendees'],
                ['Type text into', 'Meeting details field', 'SetText', 'EnterMeetingDetails'],
                ['Click', 'Save button', 'ClickControl', 'SaveMeeting']
            ]
        },

        {
            id: 'teams-start-instant-meeting',
            label: 'Open Teams → Start an instant meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Click', 'Meet now button', 'ClickControl', 'StartInstantMeeting'],
                ['Click', 'Join now button', 'ClickControl', 'JoinMeetingNow']
            ]
        },

        {
            id: 'teams-share-screen',
            label: 'Open Teams → Share screen during meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Scheduled meeting', 'SelectItem', 'SelectScheduledMeeting'],
                ['Click', 'Join button', 'ClickControl', 'JoinMeeting'],
                ['Click', 'Share button', 'ClickControl', 'OpenShareTray'],
                ['Select', 'Screen option', 'SelectItem', 'SelectScreenToShare']
            ]
        },

        {
            id: 'teams-toggle-microphone',
            label: 'Open Teams → Toggle microphone in meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Scheduled meeting', 'SelectItem', 'SelectScheduledMeeting'],
                ['Click', 'Join button', 'ClickControl', 'JoinMeeting'],
                ['Click', 'Microphone button', 'ClickControl', 'ToggleMicrophone']
            ]
        },

        {
            id: 'teams-toggle-camera',
            label: 'Open Teams → Toggle camera in meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Scheduled meeting', 'SelectItem', 'SelectScheduledMeeting'],
                ['Click', 'Join button', 'ClickControl', 'JoinMeeting'],
                ['Click', 'Camera button', 'ClickControl', 'ToggleCamera']
            ]
        },

        {
            id: 'teams-leave-meeting',
            label: 'Open Teams → Leave a meeting',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Scheduled meeting', 'SelectItem', 'SelectScheduledMeeting'],
                ['Click', 'Join button', 'ClickControl', 'JoinMeeting'],
                ['Click', 'Leave button', 'ClickControl', 'LeaveMeeting']
            ]
        },

        /* ------------------------------------------------------------------------
           PROFILE / STATUS
           ------------------------------------------------------------------------ */

        {
            id: 'teams-change-status',
            label: 'Open Teams → Change availability status',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Profile button', 'ClickControl', 'OpenProfileMenu'],
                ['Click', 'Availability status', 'ClickControl', 'OpenAvailabilityStatus'],
                ['Select', 'Status options', 'SelectItem', 'SelectAvailabilityStatus']
            ]
        },

        {
            id: 'teams-set-status-message',
            label: 'Open Teams → Set a status message',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Profile button', 'ClickControl', 'OpenProfileMenu'],
                ['Click', 'Set status message', 'ClickControl', 'OpenStatusMessage'],
                ['Type text into', 'Status message box', 'SetText', 'EnterStatusMessage'],
                ['Click', 'Done button', 'ClickControl', 'SaveStatusMessage']
            ]
        },

        /* ------------------------------------------------------------------------
           NOTIFICATIONS
           ------------------------------------------------------------------------ */

        {
            id: 'teams-view-notifications',
            label: 'Open Teams → View notifications',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Activity navigation', 'ClickControl', 'OpenActivity'],
                ['Select', 'Notification item', 'SelectItem', 'SelectNotification']
            ]
        },

        {
            id: 'teams-open-settings',
            label: 'Open Teams → Open settings',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Settings and more button', 'ClickControl', 'OpenSettingsMenu'],
                ['Click', 'Settings option', 'ClickControl', 'OpenTeamsSettings']
            ]
        },

        /* ------------------------------------------------------------------------
           TEAM MANAGEMENT
           ------------------------------------------------------------------------ */

        {
            id: 'teams-add-team-member',
            label: 'Open Teams → Add member to a team',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Teams navigation', 'ClickControl', 'OpenTeamsSection'],
                ['Select', 'Team list', 'SelectItem', 'SelectTeam'],
                ['Click', 'More options button', 'ClickControl', 'OpenTeamOptions'],
                ['Click', 'Add member option', 'ClickControl', 'OpenAddMember'],
                ['Type text into', 'Member search box', 'SetText', 'EnterMemberName'],
                ['Select', 'Member search results', 'SelectItem', 'SelectMember'],
                ['Click', 'Add button', 'ClickControl', 'AddTeamMember']
            ]
        },

        {
            id: 'teams-create-channel',
            label: 'Open Teams → Create a channel',
            application: 'Microsoft Teams (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Teams navigation', 'ClickControl', 'OpenTeamsSection'],
                ['Select', 'Team list', 'SelectItem', 'SelectTeam'],
                ['Click', 'More options button', 'ClickControl', 'OpenTeamOptions'],
                ['Click', 'Add channel option', 'ClickControl', 'OpenAddChannel'],
                ['Type text into', 'Channel name field', 'SetText', 'EnterChannelName'],
                ['Select', 'Channel privacy option', 'SelectItem', 'SelectChannelPrivacy'],
                ['Click', 'Create button', 'ClickControl', 'CreateChannel']
            ]
        }

    ];

})(window);