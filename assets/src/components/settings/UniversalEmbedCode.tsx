import React, {FunctionComponent} from 'react';
import {Box} from 'theme-ui';
import {StandardSyntaxHighlighter} from '../common';
import {FRONTEND_BASE_URL} from '../../config';

type UniversalEmbedCodeProps = {
  accountId: string;
  inboxId?: string;
  title?: string;
  subtitle?: string;
  color?: string;
  greeting?: string;
  awayMessage?: string;
  newMessagePlaceholder?: string;
  showAgentAvailability?: boolean;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  requireEmailUpfront?: boolean;
  iconVariant?: string;
  isBrandingHidden?: boolean;
};

const UniversalEmbedCode: FunctionComponent<UniversalEmbedCodeProps> = ({
  accountId,
  inboxId,
  title,
  subtitle,
  color,
  greeting,
  awayMessage,
  newMessagePlaceholder,
  showAgentAvailability,
  agentAvailableText,
  agentUnavailableText,
  requireEmailUpfront,
  iconVariant,
  isBrandingHidden,
}) => {
  const generateEmbedCode = () => {
    return `
<script>
window.Papercups = {
  config: {
    ${[
      `token: "${accountId}"`,
      inboxId && `inbox: "${inboxId}"`,
      title && `title: "${title}"`,
      subtitle && `subtitle: "${subtitle}"`,
      color && `primaryColor: "${color}"`,
      greeting && `greeting: "${greeting}"`,
      awayMessage && `awayMessage: "${awayMessage}"`,
      newMessagePlaceholder &&
        `newMessagePlaceholder: "${newMessagePlaceholder}"`,
      `showAgentAvailability: ${showAgentAvailability}`,
      agentAvailableText && `agentAvailableText: "${agentAvailableText}"`,
      agentUnavailableText && `agentUnavailableText: "${agentUnavailableText}"`,
      `requireEmailUpfront: ${requireEmailUpfront}`,
      iconVariant && `iconVariant: "${iconVariant}"`,
      `baseUrl: "${FRONTEND_BASE_URL}"`,
    ]
      .filter(Boolean)
      .join(',\n    ')}
    // Optionally include data about your customer here to identify them
    // customer: {
    //   name: __CUSTOMER__.name,
    //   email: __CUSTOMER__.email,
    //   external_id: __CUSTOMER__.id,
    //   metadata: {
    //     plan: "premium"
    //   }
    // }
  },
};
</script>
<script
  type="text/javascript"
  async
  defer
  src="${FRONTEND_BASE_URL}/widget.js"
></script>
`.trim();
  };

  return (
    <Box>
      <StandardSyntaxHighlighter language="html">
        {generateEmbedCode()}
      </StandardSyntaxHighlighter>
    </Box>
  );
};

export default UniversalEmbedCode;
