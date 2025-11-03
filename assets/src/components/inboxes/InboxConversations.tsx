import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Flex} from 'theme-ui';

import * as API from '../../api';
import {Conversation, Inbox} from '../../types';
import {Result} from '../common';
import {formatServerError} from '../../utils';
import {useAuth} from '../auth/AuthProvider';
import {ConversationsDashboard} from '../conversations/ConversationsDashboard';

const Wrapper = () => {
  const {inbox_id: inboxId, conversation_id: conversationId = null} =
    useParams<{
      inbox_id: string;
      conversation_id?: string;
    }>();
  const navigate = useNavigate();
  const [inbox, setSelectedInbox] = React.useState<Inbox | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setErrorMessage] = React.useState<string | null>(null);
  const {currentUser, account} = useAuth();

  React.useEffect(() => {
    if (!inboxId) return;

    setStatus('loading');

    API.fetchInbox(inboxId)
      .then((result) => setSelectedInbox(result))
      .then(() => setStatus('success'))
      .catch((error) => {
        setStatus('error');
        setErrorMessage(formatServerError(error));
      });
  }, [inboxId]);

  const handleSelectConversation = (conversationId: string) =>
    navigate(`/inboxes/${inboxId}/conversations/${conversationId}`);

  if (error || status === 'error') {
    // TODO: render better error state?
    return (
      <Flex
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Result
          status="error"
          title="Error retrieving inbox"
          subTitle={error || 'Unknown error'}
        />
      </Flex>
    );
  } else if (status === 'loading') {
    return null;
  } else if (!inbox || !account || !currentUser) {
    return null;
  }

  return (
    <ConversationsDashboard
      title={inbox.name}
      account={account}
      inbox={inbox}
      currentUser={currentUser}
      initialSelectedConversationId={conversationId}
      filter={{inbox_id: inboxId, status: 'open'}}
      onSelectConversation={handleSelectConversation}
      isValidConversation={(conversation: Conversation) => {
        const {status, inbox_id, archived_at, closed_at} = conversation;

        return (
          inbox_id === inboxId &&
          status === 'open' &&
          !archived_at &&
          !closed_at
        );
      }}
    />
  );
};

export default Wrapper;
