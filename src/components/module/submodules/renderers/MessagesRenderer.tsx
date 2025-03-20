
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import MessagesDashboard from '../../messages/dashboard/MessagesDashboard';
import ContactsPage from '../../messages/contacts/ContactsPage';
import ComposePage from '../../messages/compose/ComposePage';
import InboxPage from '../../messages/inbox/InboxPage';
import ArchivePage from '../../messages/archive/ArchivePage';
import ScheduledPage from '../../messages/scheduled/ScheduledPage';
import MessagesSettingsPage from '../../messages/settings/SettingsPage';
import { SubModule } from '@/data/types/modules';

export const renderMessagesSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'messages-dashboard':
      return <MessagesDashboard />;
    case 'messages-contacts':
      return <ContactsPage />;
    case 'messages-compose':
      return <ComposePage />;
    case 'messages-inbox':
      return <InboxPage />;
    case 'messages-archive':
      return <ArchivePage />;
    case 'messages-scheduled':
      return <ScheduledPage />;
    case 'messages-settings':
      return <MessagesSettingsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
