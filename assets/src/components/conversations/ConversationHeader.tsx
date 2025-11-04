import React from 'react';
import {Box, Flex} from 'theme-ui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  colors,
  Button,
  Popconfirm,
  Select,
  Text,
  Title,
  Tooltip,
} from '../common';
import {
  CheckOutlined,
  StarOutlined,
  StarFilled,
  UploadOutlined,
  UserOutlined,
} from '../icons';
import {Conversation, User} from '../../types';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

// TODO: create date utility methods so we don't have to do this everywhere
dayjs.extend(utc);

const UNASSIGNED = 'unassigned';

const ConversationHeader = ({
  conversation,
  users,
  onAssignUser,
  onMarkPriority,
  onRemovePriority,
  onCloseConversation,
  onReopenConversation,
  onDeleteConversation,
}: {
  conversation: Conversation | null;
  users: Array<User>;
  onAssignUser: (conversationId: string, userId: string | null) => void;
  onMarkPriority: (conversationId: string) => void;
  onRemovePriority: (conversationId: string) => void;
  onCloseConversation: (conversationId: string) => void;
  onReopenConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}) => {
  if (!conversation) {
    // No point in showing the header if no conversation exists
    return null;
  }

  const {
    id: conversationId,
    assignee_id,
    status,
    priority,
    customer,
  } = conversation;
  const {name, email} = customer;
  const assigneeId = assignee_id ? String(assignee_id) : undefined;
  const hasBothNameAndEmail = !!(name && email);

  const handleAssignUser = (userId: string) => {
    const assigneeId = userId === UNASSIGNED ? null : String(userId);

    onAssignUser(conversationId, assigneeId);
  };

  return (
    <header
      style={{
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        zIndex: 1,
        opacity: status === 'closed' ? 0.8 : 1,
        borderBottom: `1px solid ${colors.borderLight}`,
        background: colors.bgWhite,
      }}
    >
      <Flex
        py={3}
        px={4}
        backgroundColor={colors.bgWhite}
        sx={{justifyContent: 'space-between', alignItems: 'center'}}
      >
        <Box>
          <Flex sx={{alignItems: 'center'}}>
            <Title
              level={4}
              style={{
                marginBottom: hasBothNameAndEmail ? 0 : 4,
                marginTop: hasBothNameAndEmail ? 0 : 4,
                fontSize: '18px',
                fontWeight: 600,
                color: colors.textPrimary,
              }}
            >
              {name || email || 'Anonymous User'}
            </Title>
          </Flex>
          {hasBothNameAndEmail && (
            <Box style={{marginLeft: 1, lineHeight: 1.4, marginTop: 2}}>
              <Text
                type="secondary"
                style={{fontSize: '13px', color: colors.textMuted}}
              >
                {email}
              </Text>
            </Box>
          )}
        </Box>

        <Flex sx={{gap: '8px', alignItems: 'center'}}>
          <Select
            style={{minWidth: 200, height: 36}}
            placeholder="No assignee"
            value={assigneeId ? String(assigneeId) : undefined}
            onSelect={handleAssignUser}
          >
            <Select.Option key={UNASSIGNED} value={UNASSIGNED}>
              No assignee
            </Select.Option>

            {users.map((user: User) => {
              const value = String(user.id);

              return (
                <Select.Option key={value} value={value}>
                  <Flex sx={{alignItems: 'center', gap: '8px'}}>
                    <UserOutlined style={{fontSize: 14}} />
                    <Box>{user.full_name || user.email}</Box>
                  </Flex>
                </Select.Option>
              );
            })}
          </Select>
          {priority === 'priority' ? (
            <Tooltip title="Remove priority" placement="bottomRight">
              <Button
                type="text"
                icon={<StarFilled style={{color: colors.gold}} />}
                onClick={() => onRemovePriority(conversationId)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Mark as priority" placement="bottomRight">
              <Button
                type="text"
                icon={<StarOutlined />}
                onClick={() => onMarkPriority(conversationId)}
              />
            </Tooltip>
          )}

          {status === 'closed' ? (
            <Tooltip title="Reopen conversation" placement="bottomRight">
              <Button
                type="text"
                icon={<UploadOutlined />}
                onClick={() => onReopenConversation(conversationId)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Close conversation" placement="bottomRight">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => onCloseConversation(conversationId)}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Are you sure you want to delete this conversation?"
            okText="Yes"
            cancelText="No"
            placement="leftBottom"
            onConfirm={() => onDeleteConversation(conversationId)}
          >
            <Button type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      </Flex>
    </header>
  );
};

export default ConversationHeader;
