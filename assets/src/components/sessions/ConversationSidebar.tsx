import React from 'react';
import {Flex} from 'theme-ui';
import {colors} from '../common';
import ConversationMessages from '../conversations/ConversationMessages';
import ConversationFooter from '../conversations/ConversationFooter';
import {Conversation, Message, User} from '../../types';
import {useConversations} from '../conversations/ConversationsProvider';
import {useAuth} from '../auth/AuthProvider';

type Props = {
  conversation: Conversation;
  currentUser: User | null;
  messages: Array<Message>;
};

class ConversationSidebar extends React.Component<Props, any> {
  scrollToEl: any;

  componentDidMount() {
    this.scrollIntoView();
  }

  componentDidUpdate(prev: Props) {
    const {messages: previousMessages} = prev;
    const {messages} = this.props;

    if (messages.length > previousMessages.length) {
      this.scrollIntoView();
    }
  }

  scrollIntoView = () => {
    this.scrollToEl && this.scrollToEl.scrollIntoView();
  };

  render() {
    const {currentUser, conversation, messages = []} = this.props;

    return (
      <Flex
        className="rr-block"
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          bg: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          flex: 1,
        }}
      >
        <ConversationMessages
          sx={{p: 3}}
          messages={messages}
          currentUser={currentUser}
          setScrollRef={(el: any) => (this.scrollToEl = el)}
        />

        <ConversationFooter
          sx={{px: 3, pb: 3}}
          conversationId={conversation.id}
          onSendMessage={this.scrollIntoView}
        />
      </Flex>
    );
  }
}

const ConversationSidebarWrapper = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const {currentUser} = useAuth();
  const {loading, fetchConversationById, getConversationById} =
    useConversations();

  React.useEffect(() => {
    Promise.all([fetchConversationById(conversationId)]);
    // eslint-disable-next-line
  }, [conversationId]);

  if (loading) {
    return null;
  }

  const conversation = getConversationById(conversationId);

  if (!conversation) {
    return null;
  }

  const {messages = []} = conversation;

  return (
    <ConversationSidebar
      conversation={conversation}
      messages={messages}
      currentUser={currentUser}
    />
  );
};

export default ConversationSidebarWrapper;
