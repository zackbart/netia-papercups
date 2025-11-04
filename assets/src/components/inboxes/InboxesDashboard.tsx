// @ts-nocheck
import React from 'react';
import {
  useLocation,
  Routes,
  Navigate,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {MenuItemProps} from 'antd/lib/menu/MenuItem';

import {colors, Layout, Menu, Sider} from '../common';
import {SettingOutlined} from '../icons';
import {INBOXES_DASHBOARD_SIDER_WIDTH} from '../../utils';
import * as API from '../../api';
import {Inbox} from '../../types';
import {useAuth} from '../auth/AuthProvider';
import {useConversations} from '../conversations/ConversationsProvider';
import ConversationsDashboardWrapper from '../conversations/ConversationsDashboard';
import ChatWidgetSettings from '../settings/ChatWidgetSettings';
import SlackReplyIntegrationDetails from '../integrations/SlackReplyIntegrationDetails';
import SlackSyncIntegrationDetails from '../integrations/SlackSyncIntegrationDetails';
import SlackIntegrationDetails from '../integrations/SlackIntegrationDetails';
import GmailIntegrationDetails from '../integrations/GmailIntegrationDetails';
import GoogleIntegrationDetails from '../integrations/GoogleIntegrationDetails';
import MattermostIntegrationDetails from '../integrations/MattermostIntegrationDetails';
import TwilioIntegrationDetails from '../integrations/TwilioIntegrationDetails';
import InboxEmailForwardingPage from './InboxEmailForwardingPage';
import InboxDetailsPage from './InboxDetailsPage';
import InboxesOverview from './InboxesOverview';
import InboxConversations from './InboxConversations';
import NewInboxModal from './NewInboxModal';

const getSectionKey = (pathname: string) => {
  const isInboxSettings =
    pathname === '/inboxes' ||
    (pathname.startsWith('/inboxes') &&
      pathname.indexOf('conversations') === -1);

  if (isInboxSettings) {
    return ['inbox-settings'];
  } else {
    return pathname.split('/').slice(1); // Slice off initial slash
  }
};

export const NewInboxModalMenuItem = ({
  onSuccess,
  ...props
}: {
  onSuccess: (inbox: Inbox) => void;
} & MenuItemProps) => {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSuccess = (inbox: Inbox) => {
    handleCloseModal();
    onSuccess(inbox);
  };

  return (
    <>
      <Menu.Item {...props} onClick={handleOpenModal} />
      <NewInboxModal
        visible={isModalOpen}
        onCancel={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

const InboxesDashboard = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {currentUser} = useAuth();
  const {unread} = useConversations();
  const [inboxes, setCustomInboxes] = React.useState<Array<Inbox>>([]);

  const [section, key] = getSectionKey(pathname);
  const isAdminUser = currentUser?.role === 'admin';

  // Determine if we're in /conversations/* or /inboxes/* context
  const isConversationsPath = pathname.startsWith('/conversations');

  React.useEffect(() => {
    API.fetchInboxes().then((inboxes) => setCustomInboxes(inboxes));
  }, []);

  return (
    <Layout style={{background: colors.bgWhite}}>
      <Sider
        className="Dashboard-Sider"
        width={INBOXES_DASHBOARD_SIDER_WIDTH}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          color: colors.white,
        }}
      >
        <Flex sx={{flexDirection: 'column', height: '100%'}}>
          <Box py={3} sx={{flex: 1}}>
            {/* TODO: eventually we should design our own sidebar menu so we have more control over the UX */}
            <Menu
              selectedKeys={[section, key]}
              defaultOpenKeys={[]}
              mode="inline"
              theme="dark"
            >
              {/* Conversations and Inboxes sections removed for LLM-only setup */}

              {isAdminUser && (
                <Menu.Item
                  key="inbox-settings"
                  icon={<SettingOutlined />}
                  title="Inbox settings"
                >
                  <Link to="/inboxes">Configure inboxes</Link>
                </Menu.Item>
              )}
            </Menu>
          </Box>
        </Flex>
      </Sider>

      <Layout
        style={{
          background: colors.bgWhite,
          marginLeft: INBOXES_DASHBOARD_SIDER_WIDTH,
        }}
      >
        <Routes>
          {/* Render routes based on parent path context */}
          {isConversationsPath ? (
            <>
              {/* Conversation bucket routes - these match /conversations/* paths */}
              <Route
                path=":bucket/:conversation_id"
                element={<ConversationsDashboardWrapper />}
              />
              <Route
                path=":bucket"
                element={<ConversationsDashboardWrapper />}
              />
              {/* Redirect empty /conversations to /conversations/all */}
              <Route
                path=""
                element={<Navigate to="/conversations/all" replace />}
              />
              {/* Catch-all: redirect to conversations/all */}
              <Route
                path="*"
                element={<Navigate to="/conversations/all" replace />}
              />
            </>
          ) : (
            <>
              {/* Inbox routes - these are relative to /inboxes/* parent route */}
              <Route
                path=":inbox_id/conversations/:conversation_id"
                element={<InboxConversations />}
              />
              <Route
                path=":inbox_id/conversations"
                element={<InboxConversations />}
              />
              <Route
                path=":inbox_id/chat-widget"
                element={<ChatWidgetSettings />}
              />
              <Route
                path=":inbox_id/integrations/slack/reply"
                element={<SlackReplyIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/slack/support"
                element={<SlackSyncIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/slack"
                element={<SlackIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/google/gmail"
                element={<GmailIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/google"
                element={<GoogleIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/mattermost"
                element={<MattermostIntegrationDetails />}
              />
              <Route
                path=":inbox_id/integrations/twilio"
                element={<TwilioIntegrationDetails />}
              />
              {/* @ts-expect-error - InboxEmailForwardingPage uses @ts-nocheck, will be fixed with wrapper */}
              <Route
                path=":inbox_id/email-forwarding"
                element={<InboxEmailForwardingPage />}
              />
              {/* @ts-expect-error - InboxDetailsPage uses @ts-nocheck, will be fixed with wrapper */}
              <Route path=":inbox_id" element={<InboxDetailsPage />} />
              {/* Empty path for /inboxes shows overview */}
              <Route path="" element={<InboxesOverview />} />
              {/* Catch-all for /inboxes/* paths */}
              <Route path="*" element={<InboxesOverview />} />
            </>
          )}
        </Routes>
      </Layout>
    </Layout>
  );
};

export default InboxesDashboard;
