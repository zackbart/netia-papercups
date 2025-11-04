import React from 'react';
import {Box, Flex} from 'theme-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {colors, Badge, Text} from '../common';
import {UserOutlined, StarFilled} from '../icons';
import {formatShortRelativeTime} from '../../utils';
import {Conversation, Message} from '../../types';
import {
  getUserIdentifier,
  getUserProfilePhoto,
  isUnreadConversation,
} from './support';
import {useAuth} from '../auth/AuthProvider';
import {SenderAvatar} from './ChatMessage';

dayjs.extend(utc);

const formatConversation = (
  conversation: Conversation,
  messages: Array<Message> = []
) => {
  const recent = messages[messages.length - 1];
  const ts = recent ? recent.created_at : conversation.created_at;
  const created = dayjs.utc(ts);
  const date = formatShortRelativeTime(created);

  return {
    ...conversation,
    date: dayjs().diff(created, 'second') < 10 ? 'Just now' : date,
    preview: recent && recent.body ? recent.body : '...',
    agent: recent && recent.user ? recent.user : null,
    messages: messages,
  };
};

const ConversationItem = ({
  conversation,
  messages,
  color,
  isHighlighted,
  isCustomerOnline,
  onSelectConversation,
}: {
  conversation: Conversation;
  messages: Array<Message>;
  color: string;
  isHighlighted?: boolean;
  isCustomerOnline?: boolean;
  onSelectConversation: (id: string) => void;
}) => {
  const {currentUser} = useAuth();
  const formatted = formatConversation(conversation, messages);
  const {id, priority, status, customer, date, preview, agent} = formatted;
  const {name, email} = customer;
  const isPriority = priority === 'priority';
  const isClosed = status === 'closed';
  const isRead = !isUnreadConversation(conversation, currentUser);
  const agentAvatarPhotoUrl = agent ? getUserProfilePhoto(agent) : null;

  return (
    <Box
      id={`ConversationItem--${id}`}
      p={3}
      sx={{
        opacity: isClosed ? 0.7 : 1,
        borderBottom: `1px solid ${colors.borderLight}`,
        borderLeft: isHighlighted
          ? `3px solid ${colors.primary}`
          : '3px solid transparent',
        background: isHighlighted ? colors.primaryLight : colors.bgWhite,
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: isHighlighted ? '0 8px 8px 0' : '0',
        '&:hover': {
          background: isHighlighted ? colors.primaryLight : colors.bgHover,
          borderLeft: `3px solid ${
            isHighlighted ? colors.primary : colors.borderDark
          }`,
        },
      }}
      onClick={() => onSelectConversation(id)}
    >
      <Flex
        mb={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Flex sx={{alignItems: 'center', gap: '12px', flex: 1, minWidth: 0}}>
          <Box>
            <Flex
              sx={{
                bg:
                  isPriority && color === colors.gold
                    ? 'rgb(245, 245, 245)'
                    : color,
                opacity: 0.6,
                height: 24,
                width: 24,
                fontSize: 24,
                borderRadius: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              }}
            >
              {isPriority ? (
                <StarFilled style={{fontSize: 12, color: colors.gold}} />
              ) : (
                <UserOutlined style={{fontSize: 12, color: colors.white}} />
              )}
            </Flex>
          </Box>
          <Text
            strong
            style={{
              maxWidth: isCustomerOnline || date.length > 4 ? 156 : 164,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              fontSize: '14px',
              fontWeight: isRead ? 500 : 600,
              color: colors.textSecondary,
            }}
          >
            {name || email || 'Anonymous User'}
          </Text>
        </Flex>

        {isRead ? (
          isCustomerOnline ? (
            <Badge status="success" text="Online" />
          ) : (
            <Text type="secondary">{date}</Text>
          )
        ) : (
          <Badge status="processing" />
        )}
      </Flex>

      <Flex sx={{alignItems: 'center'}}>
        {!!agent && (
          <SenderAvatar
            sx={{opacity: agentAvatarPhotoUrl ? 0.8 : 0.4, bg: colors.gray[0]}}
            isAgent
            size={16}
            name={getUserIdentifier(agent)}
            avatarPhotoUrl={agentAvatarPhotoUrl}
            color={color}
          />
        )}
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '90%',
          }}
        >
          {isRead ? (
            <Text
              type="secondary"
              style={{fontSize: '13px', color: colors.textMuted}}
            >
              {preview}
            </Text>
          ) : (
            <Text
              strong
              style={{
                fontSize: '13px',
                color: colors.textSecondary,
                fontWeight: 500,
              }}
            >
              {preview}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ConversationItem;
