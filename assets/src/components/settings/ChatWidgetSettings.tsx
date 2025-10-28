import React, {FunctionComponent} from 'react';
import {RouteComponentProps} from 'react-router';
import {capitalize, debounce} from 'lodash';
import {Box} from 'theme-ui';
import {TwitterPicker} from 'react-color';

import * as API from '../../api';
import {Account, Inbox, User, WidgetIconVariant} from '../../types';
import {
  colors,
  Alert,
  Button,
  Paragraph,
  Popover,
  Input,
  Select,
  StandardSyntaxHighlighter,
  Switch,
  Text,
  Title,
  Tabs,
} from '../common';
import {ArrowLeftOutlined, InfoCircleTwoTone} from '../icons';
import {BASE_URL, FRONTEND_BASE_URL} from '../../config';
import logger from '../../logger';
import {formatUserExternalId} from '../../utils';
import {Link} from 'react-router-dom';
import UniversalEmbedCode from './UniversalEmbedCode';
import PlatformInstructions from './PlatformInstructions';

type Props = RouteComponentProps<{inbox_id?: string}> & {};
type State = {
  accountId: string | null;
  account: Account | null;
  inbox: Inbox | null;
  color: string;
  title: string;
  subtitle: string;
  greeting?: string;
  awayMessage?: string;
  newMessagePlaceholder?: string;
  currentUser: User | null;
  showAgentAvailability: boolean;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  requireEmailUpfront: boolean;
  iconVariant: WidgetIconVariant;
  isBrandingHidden: boolean;
};

class ChatWidgetSettings extends React.Component<Props, State> {
  state: State = {
    accountId: null,
    account: null,
    inbox: null,
    currentUser: null,
    color: colors.primary,
    title: 'Welcome!',
    subtitle: 'Ask us anything in the chat window below 😊',
    greeting: '',
    awayMessage: '',
    newMessagePlaceholder: 'Start typing...',
    showAgentAvailability: false,
    agentAvailableText: `We're online right now!`,
    agentUnavailableText: `We're away at the moment.`,
    requireEmailUpfront: false,
    iconVariant: 'outlined',
    isBrandingHidden: false,
  };

  async componentDidMount() {
    const {inbox_id: inboxId} = this.props.match.params;
    const currentUser = await API.me();
    const account = await API.fetchAccountInfo();
    const {id: accountId, company_name: company} = account;
    const widgetSettings = await API.fetchWidgetSettings({
      account_id: accountId,
      inbox_id: inboxId,
    });

    if (inboxId) {
      const inbox = await API.fetchInbox(inboxId);

      this.setState({inbox});
    }

    if (widgetSettings && widgetSettings.id) {
      const {
        color,
        title,
        subtitle,
        greeting,
        new_message_placeholder: newMessagePlaceholder,
        show_agent_availability: showAgentAvailability,
        agent_available_text: agentAvailableText,
        agent_unavailable_text: agentUnavailableText,
        require_email_upfront: requireEmailUpfront,
        icon_variant: iconVariant,
        away_message: awayMessage,
        is_branding_hidden: isBrandingHidden,
      } = widgetSettings;

      this.setState({
        accountId,
        account,
        currentUser,
        greeting,
        awayMessage,
        color: color || this.state.color,
        subtitle: subtitle || this.state.subtitle,
        title: title || `Welcome to ${company}`,
        newMessagePlaceholder: newMessagePlaceholder || 'Start typing...',
        showAgentAvailability:
          showAgentAvailability || this.state.showAgentAvailability,
        agentAvailableText: agentAvailableText || this.state.agentAvailableText,
        agentUnavailableText:
          agentUnavailableText || this.state.agentUnavailableText,
        requireEmailUpfront:
          requireEmailUpfront || this.state.requireEmailUpfront,
        iconVariant: iconVariant || this.state.iconVariant,
        isBrandingHidden: isBrandingHidden || this.state.isBrandingHidden,
      });
    } else {
      this.setState({
        accountId,
        account,
        currentUser,
        title: `Welcome to ${company}`,
      });
    }
  }

  debouncedUpdateWidgetSettings = debounce(
    () => this.updateWidgetSettings(),
    400
  );

  handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({title: e.target.value}, this.debouncedUpdateWidgetSettings);
  };

  handleChangeSubtitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {subtitle: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeGreeting = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {greeting: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeAwayMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {awayMessage: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeNewMessagePlaceholder = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState(
      {newMessagePlaceholder: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeRequireEmailUpfront = (isChecked: boolean) => {
    this.setState(
      {requireEmailUpfront: isChecked},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeShowingAgentAvailability = (isChecked: boolean) => {
    this.setState(
      {showAgentAvailability: isChecked},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeAgentAvailableText = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {agentAvailableText: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeAgentUnavailableText = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState(
      {agentUnavailableText: e.target.value},
      this.debouncedUpdateWidgetSettings
    );
  };

  handleChangeIconVariant = (variant: 'outlined' | 'filled') => {
    // Icon variant changed - no need to close anything since we're using iframe
    this.setState({iconVariant: variant}, this.debouncedUpdateWidgetSettings);
  };

  handleChangeColor = (color: any) => {
    this.setState({color: color.hex}, this.debouncedUpdateWidgetSettings);
  };

  handleChangeBrandingVisibility = (isChecked: boolean) => {
    this.setState(
      {isBrandingHidden: isChecked},
      this.debouncedUpdateWidgetSettings
    );
  };

  updateWidgetSettings = async () => {
    const {inbox_id: inboxId} = this.props.match.params;
    const {
      color,
      title,
      subtitle,
      greeting,
      awayMessage,
      newMessagePlaceholder,
      showAgentAvailability,
      agentAvailableText,
      agentUnavailableText,
      requireEmailUpfront,
      iconVariant,
      isBrandingHidden,
    } = this.state;

    return API.updateWidgetSettings({
      color,
      title,
      subtitle,
      greeting,
      away_message: awayMessage,
      new_message_placeholder: newMessagePlaceholder,
      show_agent_availability: showAgentAvailability,
      agent_available_text: agentAvailableText,
      agent_unavailable_text: agentUnavailableText,
      require_email_upfront: requireEmailUpfront,
      icon_variant: iconVariant,
      is_branding_hidden: isBrandingHidden,
      inbox_id: inboxId,
    })
      .then((res) => logger.debug('Updated widget settings:', res))
      .catch((err) => logger.error('Error updating widget settings:', err));
  };

  getUserMetadata = () => {
    const {account, currentUser} = this.state;

    if (!account || !currentUser) {
      return {};
    }

    const {email} = currentUser;

    // TODO: include name if available
    return {
      email: email,
      external_id: formatUserExternalId(currentUser),
      metadata: {
        company_name: account.company_name,
        subscription_plan: account.subscription_plan,
      },
    };
  };

  render() {
    const {
      inbox,
      accountId,
      color,
      title,
      subtitle,
      greeting,
      awayMessage,
      newMessagePlaceholder,
      showAgentAvailability,
      agentAvailableText,
      agentUnavailableText,
      requireEmailUpfront,
      iconVariant,
      isBrandingHidden,
    } = this.state;

    if (!accountId) {
      return null; // TODO: better loading state
    }

    const customer = this.getUserMetadata();
    const {inbox_id: inboxId} = this.props.match.params;

    return (
      <Box px={5} py={4} sx={{maxWidth: 800}}>
        <Box mb={4}>
          {inboxId ? (
            <Link to={`/inboxes/${inboxId}`}>
              <Button icon={<ArrowLeftOutlined />}>
                Back to {inbox?.name || 'inbox'}
              </Button>
            </Link>
          ) : (
            <Link to="/integrations">
              <Button icon={<ArrowLeftOutlined />}>Back to integrations</Button>
            </Link>
          )}
        </Box>

        <Box mb={4}>
          <Title level={3}>Chat Widget Settings</Title>
          <Paragraph>
            <Text>
              Before you can start chatting with your customers, you'll need to
              install our chat component on your website.
            </Text>
          </Paragraph>
        </Box>

        <Box mb={4}>
          <Title level={4}>Customize your widget</Title>

          <Box mb={3}>
            <label htmlFor="title">Update the title:</label>
            <Input
              id="title"
              type="text"
              placeholder="Welcome!"
              value={title}
              onChange={this.handleChangeTitle}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="subtitle">Update the subtitle:</label>
            <Input
              id="subtitle"
              type="text"
              placeholder="How can we help you?"
              value={subtitle}
              onChange={this.handleChangeSubtitle}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="greeting">
              Set a greeting (requires page refresh to view):
            </label>
            <Input
              id="greeting"
              type="text"
              placeholder="Hello! Any questions?"
              value={greeting}
              onChange={this.handleChangeGreeting}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="away_message">
              Set an away message (will replace greeting message outside working
              hours):
            </label>
            <Input
              id="away_message"
              type="text"
              placeholder="Sorry, we're away at the moment!"
              value={awayMessage}
              onChange={this.handleChangeAwayMessage}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="new_message_placeholder">
              Update the new message placeholder text:
            </label>
            <Input
              id="new_message_placeholder"
              type="text"
              placeholder="Start typing..."
              value={newMessagePlaceholder}
              onChange={this.handleChangeNewMessagePlaceholder}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={4}>
            <Paragraph>Try changing the color:</Paragraph>
            <TwitterPicker
              color={this.state.color}
              onChangeComplete={this.handleChangeColor}
            />
          </Box>

          <Box mb={4}>
            <label htmlFor="icon_variant">
              Icon style (close the chat to view)
            </label>

            <Box>
              <Select
                id="icon_variant"
                style={{width: 280}}
                value={iconVariant}
                onChange={this.handleChangeIconVariant}
                options={['outlined', 'filled'].map((variant) => {
                  return {value: variant, label: capitalize(variant)};
                })}
              />
            </Box>
          </Box>

          <Box mb={1}>
            <label htmlFor="require_email_upfront">
              Require unidentified customers to provide their email upfront?{' '}
              <Popover
                content={
                  <Box sx={{maxWidth: 200}}>
                    This will only show up for anonymous users. To see an
                    example of what this looks like, visit{' '}
                    <a
                      href="https://papercups.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://papercups.io
                    </a>{' '}
                    and open the chat.
                  </Box>
                }
                title={null}
              >
                <InfoCircleTwoTone twoToneColor={colors.primary} />
              </Popover>
            </label>
          </Box>
          <Box mb={3}>
            <Switch
              checked={requireEmailUpfront}
              onChange={this.handleChangeRequireEmailUpfront}
            />
          </Box>

          <Box mb={1}>
            <label htmlFor="show_agent_availability">
              Show agent availability?
            </label>
          </Box>
          <Box mb={3}>
            <Switch
              checked={showAgentAvailability}
              onChange={this.handleChangeShowingAgentAvailability}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="agent_available_text">
              Set the text displayed when agents are available:
            </label>
            <Input
              id="agent_available_text"
              type="text"
              placeholder="We're online right now!"
              value={agentAvailableText}
              onChange={this.handleChangeAgentAvailableText}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={3}>
            <label htmlFor="agent_unavailable_text">
              Set the text displayed when agents are unavailable:
            </label>
            <Input
              id="agent_unavailable_text"
              type="text"
              placeholder="We're away at the moment."
              value={agentUnavailableText}
              onChange={this.handleChangeAgentUnavailableText}
              onBlur={this.updateWidgetSettings}
            />
          </Box>

          <Box mb={1}>
            <label htmlFor="hide_branding">
              Hide "Powered by Netia" branding
            </label>
          </Box>
          <Box mb={3}>
            <Switch
              checked={isBrandingHidden}
              onChange={this.handleChangeBrandingVisibility}
            />
          </Box>

          <Box mb={4}>
            <Title level={4}>Widget Preview</Title>
            <Paragraph>
              <Text>Preview of your chat widget with current settings:</Text>
            </Paragraph>
            <iframe
              src={`${BASE_URL}/chat?token=${accountId}&inbox=${inboxId}&title=${encodeURIComponent(
                title || 'Welcome!'
              )}&subtitle=${encodeURIComponent(
                subtitle
              )}&primaryColor=${encodeURIComponent(
                color
              )}&greeting=${encodeURIComponent(
                greeting
              )}&awayMessage=${encodeURIComponent(
                awayMessage
              )}&showAgentAvailability=${showAgentAvailability}&agentAvailableText=${encodeURIComponent(
                agentAvailableText
              )}&agentUnavailableText=${encodeURIComponent(
                agentUnavailableText
              )}&requireEmailUpfront=${requireEmailUpfront}&newMessagePlaceholder=${encodeURIComponent(
                newMessagePlaceholder
              )}&iconVariant=${iconVariant}&isBrandingHidden=${isBrandingHidden}`}
              style={{
                width: '100%',
                height: '500px',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
              title="Chat Widget Preview"
            />
          </Box>
        </Box>

        <Box mb={4}>
          <Title level={4}>Universal Embed Code</Title>
          <Paragraph>
            <Text>
              Copy and paste this code into your website to add the chat widget.
              It works on any platform!
            </Text>
          </Paragraph>

          <UniversalEmbedCode
            accountId={accountId}
            inboxId={inboxId}
            title={title}
            subtitle={subtitle}
            color={color}
            greeting={greeting}
            awayMessage={awayMessage}
            newMessagePlaceholder={newMessagePlaceholder}
            showAgentAvailability={showAgentAvailability}
            agentAvailableText={agentAvailableText}
            agentUnavailableText={agentUnavailableText}
            requireEmailUpfront={requireEmailUpfront}
            iconVariant={iconVariant}
            isBrandingHidden={isBrandingHidden}
          />
        </Box>

        <PlatformInstructions />

        <Box mb={4}>
          <Title level={4}>Installation Instructions</Title>
          <Paragraph>
            <Text>
              Simply copy the Universal Embed Code above and paste it into your
              website's HTML. The widget will automatically load and connect to
              your chat system.
            </Text>
          </Paragraph>
        </Box>

        <Title level={4}>Learn more</Title>
        <Paragraph>
          <Text>
            This chat widget is powered by your custom implementation at{' '}
            <Text code>/chat</Text>. All settings are applied in real-time to
            the widget preview above.
          </Text>
        </Paragraph>
      </Box>
    );
  }
}

export default ChatWidgetSettings;
