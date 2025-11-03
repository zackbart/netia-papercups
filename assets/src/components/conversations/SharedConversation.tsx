import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {colors} from '../common';
import ConversationMessages from './ConversationMessages';
import {sortConversationMessages} from '../../utils';
import * as API from '../../api';
import {Message} from '../../types';
import logger from '../../logger';

type Props = {};
type State = {
  loading: boolean;
  messages: Array<Message>;
};

class SharedConversationContainer extends React.Component<
  Props & {search: string},
  State
> {
  scrollToEl: any = null;

  constructor(props: Props & {search: string}) {
    super(props);

    this.state = {loading: true, messages: []};
  }

  async componentDidMount() {
    try {
      const q = new URLSearchParams(this.props.search);
      const conversationId = q.get('cid') || '';
      const token = q.get('token') || '';
      const {messages = []} = await API.fetchSharedConversation(
        conversationId,
        token
      );

      this.setState({
        messages: sortConversationMessages(messages),
        loading: false,
      });
    } catch (err) {
      logger.error('Unable to fetch shared conversation:', err);

      this.setState({loading: false});
    }
  }

  scrollIntoView = () => {
    this.scrollToEl && this.scrollToEl.scrollIntoView();
  };

  render() {
    const {loading, messages} = this.state;

    return (
      <Flex
        sx={{
          justifyContent: 'center',
          bg: 'rgb(250, 250, 250)',
          border: `1px solid rgba(0,0,0,.06)`,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 8px',
          flex: 1,
        }}
      >
        <Box
          py={3}
          sx={{
            width: '100%',
            maxWidth: 640,
            bg: colors.white,
          }}
        >
          <ConversationMessages
            sx={{p: 3}}
            loading={loading}
            messages={messages}
            setScrollRef={(el: any) => (this.scrollToEl = el)}
          />
        </Box>
      </Flex>
    );
  }
}

const SharedConversation = () => {
  const [searchParams] = useSearchParams();
  return <SharedConversationContainer search={searchParams.toString()} />;
};

export default SharedConversation;
