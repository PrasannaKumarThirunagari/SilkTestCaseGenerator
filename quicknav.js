
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
        },
        /* ========================================================================
       MAIL - BASIC
       ======================================================================== */

        {
            id: 'outlook-open-inbox',
            label: 'Open Outlook → Open Inbox',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder']
            ]
        },

        {
            id: 'outlook-open-sent-items',
            label: 'Open Outlook → Open Sent Items',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Sent Items folder', 'SelectItem', 'OpenSentItemsFolder']
            ]
        },

        {
            id: 'outlook-open-drafts',
            label: 'Open Outlook → Open Drafts',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Drafts folder', 'SelectItem', 'OpenDraftsFolder']
            ]
        },

        {
            id: 'outlook-open-deleted-items',
            label: 'Open Outlook → Open Deleted Items',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Deleted Items folder', 'SelectItem', 'OpenDeletedItemsFolder']
            ]
        },

        {
            id: 'outlook-open-junk-email',
            label: 'Open Outlook → Open Junk Email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Junk Email folder', 'SelectItem', 'OpenJunkEmailFolder']
            ]
        },

        /* ========================================================================
           COMPOSE / SEND EMAIL
           ======================================================================== */

        {
            id: 'outlook-compose-email',
            label: 'Open Outlook → Compose and send email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'New Email button', 'ClickControl', 'CreateNewEmail'],
                ['Type text into', 'To field', 'SetText', 'EnterRecipient'],
                ['Type text into', 'Subject field', 'SetText', 'EnterSubject'],
                ['Type text into', 'Message body', 'SetText', 'EnterMessageBody'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        {
            id: 'outlook-compose-email-cc-bcc',
            label: 'Open Outlook → Compose email with CC and BCC',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'New Email button', 'ClickControl', 'CreateNewEmail'],
                ['Type text into', 'To field', 'SetText', 'EnterRecipient'],
                ['Type text into', 'CC field', 'SetText', 'EnterCcRecipient'],
                ['Type text into', 'BCC field', 'SetText', 'EnterBccRecipient'],
                ['Type text into', 'Subject field', 'SetText', 'EnterSubject'],
                ['Type text into', 'Message body', 'SetText', 'EnterMessageBody'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        {
            id: 'outlook-save-draft',
            label: 'Open Outlook → Compose and save draft',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'New Email button', 'ClickControl', 'CreateNewEmail'],
                ['Type text into', 'To field', 'SetText', 'EnterRecipient'],
                ['Type text into', 'Subject field', 'SetText', 'EnterSubject'],
                ['Type text into', 'Message body', 'SetText', 'EnterMessageBody'],
                ['Click', 'Close message button', 'ClickControl', 'CloseMailWindow']
            ]
        },

        /* ========================================================================
           REPLY / FORWARD
           ======================================================================== */

        {
            id: 'outlook-reply-to-email',
            label: 'Open Outlook → Reply to selected email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Reply button', 'ClickControl', 'ClickReplyButton'],
                ['Type text into', 'Message body', 'SetText', 'EnterReplyText'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        {
            id: 'outlook-reply-all',
            label: 'Open Outlook → Reply all to selected email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Reply All button', 'ClickControl', 'ClickReplyAllButton'],
                ['Type text into', 'Message body', 'SetText', 'EnterReplyText'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        {
            id: 'outlook-forward-email',
            label: 'Open Outlook → Forward selected email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Forward button', 'ClickControl', 'ClickForwardButton'],
                ['Type text into', 'To field', 'SetText', 'EnterForwardRecipient'],
                ['Type text into', 'Message body', 'SetText', 'EnterForwardMessage'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        /* ========================================================================
           EMAIL ACTIONS
           ======================================================================== */

        {
            id: 'outlook-mark-read',
            label: 'Open Outlook → Mark email as read',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Mark as read button', 'ClickControl', 'MarkEmailAsRead']
            ]
        },

        {
            id: 'outlook-mark-unread',
            label: 'Open Outlook → Mark email as unread',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Mark as unread button', 'ClickControl', 'MarkEmailAsUnread']
            ]
        },

        {
            id: 'outlook-flag-email',
            label: 'Open Outlook → Flag an email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Flag button', 'ClickControl', 'FlagEmail']
            ]
        },

        {
            id: 'outlook-unflag-email',
            label: 'Open Outlook → Remove email flag',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Flag button', 'ClickControl', 'RemoveEmailFlag']
            ]
        },

        {
            id: 'outlook-delete-email',
            label: 'Open Outlook → Delete selected email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Delete button', 'ClickControl', 'DeleteEmail']
            ]
        },

        {
            id: 'outlook-move-email',
            label: 'Open Outlook → Move email to folder',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Move button', 'ClickControl', 'OpenMoveMenu'],
                ['Select', 'Destination folder', 'SelectItem', 'SelectDestinationFolder']
            ]
        },

        {
            id: 'outlook-copy-email',
            label: 'Open Outlook → Copy email to folder',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Move button', 'ClickControl', 'OpenMoveMenu'],
                ['Select', 'Copy to folder option', 'SelectItem', 'SelectCopyToFolder'],
                ['Select', 'Destination folder', 'SelectItem', 'SelectDestinationFolder']
            ]
        },

        /* ========================================================================
           ATTACHMENTS
           ======================================================================== */

        {
            id: 'outlook-send-attachment',
            label: 'Open Outlook → Send email with attachment',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'New Email button', 'ClickControl', 'CreateNewEmail'],
                ['Type text into', 'To field', 'SetText', 'EnterRecipient'],
                ['Type text into', 'Subject field', 'SetText', 'EnterSubject'],
                ['Type text into', 'Message body', 'SetText', 'EnterMessageBody'],
                ['Click', 'Attach file button', 'ClickControl', 'AttachFile'],
                ['Type text into', 'File name field', 'SetText', 'EnterAttachmentPath'],
                ['Click', 'Open button', 'ClickControl', 'ConfirmAttachment'],
                ['Click', 'Send button', 'ClickControl', 'SendMail']
            ]
        },

        {
            id: 'outlook-open-attachment',
            label: 'Open Outlook → Open email attachment',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Select', 'Email attachment', 'ClickControl', 'SelectAttachment'],
                ['Click', 'Open attachment button', 'ClickControl', 'OpenAttachment']
            ]
        },

        {
            id: 'outlook-save-attachment',
            label: 'Open Outlook → Save email attachment',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Select', 'Email attachment', 'ClickControl', 'SelectAttachment'],
                ['Click', 'Save attachment button', 'ClickControl', 'SaveAttachment'],
                ['Type text into', 'File name field', 'SetText', 'EnterSaveLocation'],
                ['Click', 'Save button', 'ClickControl', 'ConfirmSaveAttachment']
            ]
        },

        /* ========================================================================
           SEARCH
           ======================================================================== */

        {
            id: 'outlook-search-email',
            label: 'Open Outlook → Search for an email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Search box', 'ClickControl', 'OpenSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterSearchText'],
                ['Click', 'Search button', 'ClickControl', 'ExecuteSearch'],
                ['Select', 'Search result', 'SelectItem', 'SelectSearchResult']
            ]
        },

        {
            id: 'outlook-search-sender',
            label: 'Open Outlook → Search emails from sender',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Search box', 'ClickControl', 'OpenSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterSenderSearch'],
                ['Click', 'Search button', 'ClickControl', 'ExecuteSearch'],
                ['Select', 'Search result', 'SelectItem', 'SelectSearchResult']
            ]
        },

        {
            id: 'outlook-search-subject',
            label: 'Open Outlook → Search by email subject',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Search box', 'ClickControl', 'OpenSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterSubjectSearch'],
                ['Click', 'Search button', 'ClickControl', 'ExecuteSearch'],
                ['Select', 'Search result', 'SelectItem', 'SelectSearchResult']
            ]
        },

        /* ========================================================================
           FOLDERS
           ======================================================================== */

        {
            id: 'outlook-create-folder',
            label: 'Open Outlook → Create mail folder',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Mail navigation', 'ClickControl', 'OpenMailNavigation'],
                ['Click', 'Folder pane', 'ClickControl', 'OpenFolderOptions'],
                ['Click', 'New folder option', 'ClickControl', 'CreateNewFolder'],
                ['Type text into', 'Folder name field', 'SetText', 'EnterFolderName'],
                ['Click', 'OK button', 'ClickControl', 'ConfirmFolderCreation']
            ]
        },

        {
            id: 'outlook-open-custom-folder',
            label: 'Open Outlook → Open custom mail folder',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Mail navigation', 'ClickControl', 'OpenMailNavigation'],
                ['Select', 'Custom mail folder', 'SelectItem', 'SelectCustomFolder']
            ]
        },

        /* ========================================================================
           CALENDAR
           ======================================================================== */

        {
            id: 'outlook-open-calendar',
            label: 'Open Outlook → Open Calendar',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar']
            ]
        },

        {
            id: 'outlook-create-calendar-event',
            label: 'Open Outlook → Create calendar event',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Click', 'New event button', 'ClickControl', 'CreateNewCalendarEvent'],
                ['Type text into', 'Event title field', 'SetText', 'EnterEventTitle'],
                ['Type text into', 'Start date field', 'SetText', 'EnterStartDate'],
                ['Type text into', 'Start time field', 'SetText', 'EnterStartTime'],
                ['Type text into', 'End date field', 'SetText', 'EnterEndDate'],
                ['Type text into', 'End time field', 'SetText', 'EnterEndTime'],
                ['Type text into', 'Event body', 'SetText', 'EnterEventDetails'],
                ['Click', 'Save button', 'ClickControl', 'SaveCalendarEvent']
            ]
        },

        {
            id: 'outlook-create-meeting',
            label: 'Open Outlook → Schedule a meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Click', 'New meeting button', 'ClickControl', 'CreateNewMeeting'],
                ['Type text into', 'To field', 'SetText', 'EnterMeetingAttendees'],
                ['Type text into', 'Subject field', 'SetText', 'EnterMeetingSubject'],
                ['Type text into', 'Start date field', 'SetText', 'EnterStartDate'],
                ['Type text into', 'Start time field', 'SetText', 'EnterStartTime'],
                ['Type text into', 'End date field', 'SetText', 'EnterEndDate'],
                ['Type text into', 'End time field', 'SetText', 'EnterEndTime'],
                ['Type text into', 'Meeting body', 'SetText', 'EnterMeetingDetails'],
                ['Click', 'Send button', 'ClickControl', 'SendMeetingInvitation']
            ]
        },

        {
            id: 'outlook-create-teams-meeting',
            label: 'Open Outlook → Create Teams meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Click', 'New Teams meeting button', 'ClickControl', 'CreateTeamsMeeting'],
                ['Type text into', 'To field', 'SetText', 'EnterMeetingAttendees'],
                ['Type text into', 'Subject field', 'SetText', 'EnterMeetingSubject'],
                ['Type text into', 'Start date field', 'SetText', 'EnterStartDate'],
                ['Type text into', 'Start time field', 'SetText', 'EnterStartTime'],
                ['Type text into', 'End time field', 'SetText', 'EnterEndTime'],
                ['Click', 'Send button', 'ClickControl', 'SendMeetingInvitation']
            ]
        },

        {
            id: 'outlook-open-meeting',
            label: 'Open Outlook → Open scheduled meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Calendar meeting', 'SelectItem', 'SelectCalendarMeeting']
            ]
        },

        {
            id: 'outlook-edit-meeting',
            label: 'Open Outlook → Edit scheduled meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Calendar meeting', 'SelectItem', 'SelectCalendarMeeting'],
                ['Click', 'Edit meeting button', 'ClickControl', 'EditCalendarMeeting'],
                ['Type text into', 'Meeting details', 'SetText', 'UpdateMeetingDetails'],
                ['Click', 'Send update button', 'ClickControl', 'SendMeetingUpdate']
            ]
        },

        {
            id: 'outlook-cancel-meeting',
            label: 'Open Outlook → Cancel scheduled meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Calendar navigation', 'ClickControl', 'OpenCalendar'],
                ['Select', 'Calendar meeting', 'SelectItem', 'SelectCalendarMeeting'],
                ['Click', 'Cancel meeting button', 'ClickControl', 'CancelCalendarMeeting'],
                ['Click', 'Send cancellation button', 'ClickControl', 'SendMeetingCancellation']
            ]
        },

        {
            id: 'outlook-accept-meeting',
            label: 'Open Outlook → Accept meeting invitation',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Meeting invitation', 'SelectItem', 'SelectMeetingInvitation'],
                ['Click', 'Accept button', 'ClickControl', 'AcceptMeetingInvitation']
            ]
        },

        {
            id: 'outlook-decline-meeting',
            label: 'Open Outlook → Decline meeting invitation',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Meeting invitation', 'SelectItem', 'SelectMeetingInvitation'],
                ['Click', 'Decline button', 'ClickControl', 'DeclineMeetingInvitation']
            ]
        },

        {
            id: 'outlook-tentative-meeting',
            label: 'Open Outlook → Respond tentative to meeting',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Meeting invitation', 'SelectItem', 'SelectMeetingInvitation'],
                ['Click', 'Tentative button', 'ClickControl', 'TentativelyAcceptMeeting']
            ]
        },

        /* ========================================================================
           PEOPLE / CONTACTS
           ======================================================================== */

        {
            id: 'outlook-open-people',
            label: 'Open Outlook → Open People',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'People navigation', 'ClickControl', 'OpenPeople']
            ]
        },

        {
            id: 'outlook-create-contact',
            label: 'Open Outlook → Create a contact',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'People navigation', 'ClickControl', 'OpenPeople'],
                ['Click', 'New contact button', 'ClickControl', 'CreateNewContact'],
                ['Type text into', 'First name field', 'SetText', 'EnterFirstName'],
                ['Type text into', 'Last name field', 'SetText', 'EnterLastName'],
                ['Type text into', 'Email field', 'SetText', 'EnterContactEmail'],
                ['Type text into', 'Phone field', 'SetText', 'EnterContactPhone'],
                ['Click', 'Save button', 'ClickControl', 'SaveContact']
            ]
        },

        {
            id: 'outlook-search-contact',
            label: 'Open Outlook → Search for a contact',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'People navigation', 'ClickControl', 'OpenPeople'],
                ['Click', 'Search box', 'ClickControl', 'OpenPeopleSearch'],
                ['Type text into', 'Search box', 'SetText', 'EnterContactSearch'],
                ['Click', 'Search button', 'ClickControl', 'ExecuteContactSearch'],
                ['Select', 'Contact result', 'SelectItem', 'SelectContactResult']
            ]
        },

        /* ========================================================================
           TASKS / TO DO
           ======================================================================== */

        {
            id: 'outlook-open-tasks',
            label: 'Open Outlook → Open Tasks',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Tasks navigation', 'ClickControl', 'OpenTasks']
            ]
        },

        {
            id: 'outlook-create-task',
            label: 'Open Outlook → Create a task',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Tasks navigation', 'ClickControl', 'OpenTasks'],
                ['Click', 'New task button', 'ClickControl', 'CreateNewTask'],
                ['Type text into', 'Task subject field', 'SetText', 'EnterTaskSubject'],
                ['Type text into', 'Task details field', 'SetText', 'EnterTaskDetails'],
                ['Type text into', 'Due date field', 'SetText', 'EnterTaskDueDate'],
                ['Click', 'Save button', 'ClickControl', 'SaveTask']
            ]
        },

        {
            id: 'outlook-complete-task',
            label: 'Open Outlook → Complete a task',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Tasks navigation', 'ClickControl', 'OpenTasks'],
                ['Select', 'Task item', 'SelectItem', 'SelectTask'],
                ['Click', 'Mark complete button', 'ClickControl', 'CompleteTask']
            ]
        },

        /* ========================================================================
           RULES
           ======================================================================== */

        {
            id: 'outlook-create-rule',
            label: 'Open Outlook → Create an email rule',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Settings and more button', 'ClickControl', 'OpenOutlookOptions'],
                ['Click', 'Rules option', 'ClickControl', 'OpenRules'],
                ['Click', 'New rule button', 'ClickControl', 'CreateNewRule'],
                ['Type text into', 'Rule name field', 'SetText', 'EnterRuleName'],
                ['Select', 'Rule condition', 'SelectItem', 'SelectRuleCondition'],
                ['Select', 'Rule action', 'SelectItem', 'SelectRuleAction'],
                ['Click', 'Save rule button', 'ClickControl', 'SaveRule']
            ]
        },

        /* ========================================================================
           EMAIL ORGANIZATION
           ======================================================================== */

        {
            id: 'outlook-categorize-email',
            label: 'Open Outlook → Categorize an email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Categories button', 'ClickControl', 'OpenCategoriesMenu'],
                ['Select', 'Category option', 'SelectItem', 'SelectEmailCategory']
            ]
        },

        {
            id: 'outlook-snooze-email',
            label: 'Open Outlook → Snooze an email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Snooze button', 'ClickControl', 'OpenSnoozeOptions'],
                ['Select', 'Snooze time option', 'SelectItem', 'SelectSnoozeTime']
            ]
        },

        /* ========================================================================
           QUICK STEPS / AUTOMATION
           ======================================================================== */

        {
            id: 'outlook-open-quick-steps',
            label: 'Open Outlook → Open Quick Steps',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Quick Steps group', 'ClickControl', 'OpenQuickSteps']
            ]
        },

        {
            id: 'outlook-apply-quick-step',
            label: 'Open Outlook → Apply Quick Step to email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'Quick Step button', 'ClickControl', 'ApplyQuickStep'],
                ['Select', 'Quick Step option', 'SelectItem', 'SelectQuickStep']
            ]
        },

        /* ========================================================================
           PRINT / EXPORT
           ======================================================================== */

        {
            id: 'outlook-print-email',
            label: 'Open Outlook → Print selected email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Inbox folder', 'SelectItem', 'OpenInboxFolder'],
                ['Select', 'Email message', 'ClickControl', 'SelectEmail'],
                ['Click', 'More options button', 'ClickControl', 'OpenMoreOptions'],
                ['Click', 'Print option', 'ClickControl', 'PrintEmail'],
                ['Click', 'Print button', 'ClickControl', 'ConfirmPrint']
            ]
        },

        /* ========================================================================
           OUTLOOK SETTINGS
           ======================================================================== */

        {
            id: 'outlook-open-settings',
            label: 'Open Outlook → Open settings',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'Settings button', 'ClickControl', 'OpenOutlookSettings']
            ]
        },

        {
            id: 'outlook-open-account-settings',
            label: 'Open Outlook → Open account settings',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Click', 'File tab', 'ClickControl', 'OpenFileMenu'],
                ['Click', 'Account settings option', 'ClickControl', 'OpenAccountSettings']
            ]
        },

        /* ========================================================================
           MAILBOX MANAGEMENT
           ======================================================================== */

        {
            id: 'outlook-empty-deleted-items',
            label: 'Open Outlook → Empty Deleted Items',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Deleted Items folder', 'SelectItem', 'OpenDeletedItemsFolder'],
                ['Click', 'Empty folder button', 'ClickControl', 'EmptyDeletedItems'],
                ['Click', 'Confirmation button', 'ClickControl', 'ConfirmEmptyFolder']
            ]
        },

        {
            id: 'outlook-empty-junk-email',
            label: 'Open Outlook → Empty Junk Email',
            application: 'Microsoft Outlook (Desktop)',
            steps: [
                ['Launch application', 'Application shortcut', '{OpenApplication}', 'LaunchApplicationUnderTest'],
                ['Navigate to', 'Junk Email folder', 'SelectItem', 'OpenJunkEmailFolder'],
                ['Click', 'Empty folder button', 'ClickControl', 'EmptyJunkFolder'],
                ['Click', 'Confirmation button', 'ClickControl', 'ConfirmEmptyFolder']
            ]
        }

    ];

})(window);