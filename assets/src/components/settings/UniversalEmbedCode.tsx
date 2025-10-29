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
    const params = new URLSearchParams({
      token: accountId,
      ...(inboxId && {inbox: inboxId}),
      ...(title && {title}),
      ...(subtitle && {subtitle}),
      ...(color && {primaryColor: color}),
      ...(greeting && {greeting}),
      ...(awayMessage && {awayMessage}),
      ...(newMessagePlaceholder && {newMessagePlaceholder}),
      showAgentAvailability: showAgentAvailability ? '1' : '0',
      ...(agentAvailableText && {agentAvailableText}),
      ...(agentUnavailableText && {agentUnavailableText}),
      requireEmailUpfront: requireEmailUpfront ? '1' : '0',
      ...(iconVariant && {iconVariant}),
      isBrandingHidden: isBrandingHidden ? 'true' : 'false',
    });

    return `
<!-- Netia Chat Widget -->
<div id="netia-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <button id="netia-chat-button" style="
    width: 60px;
    height: 60px;
    border-radius: 50%;
        background: ${color || '#1677ff'};
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 24px;
    transition: transform 0.2s;
  ">💬</button>
</div>

<script>
(function() {
  const button = document.getElementById('netia-chat-button');
  const widget = document.getElementById('netia-chat-widget');
  let iframe = null;
  
  button.addEventListener('click', function() {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.src = '${FRONTEND_BASE_URL}/chat?${params.toString()}';
      iframe.style.cssText = \`
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 120px);
      \`;
      document.body.appendChild(iframe);
      button.innerHTML = '✕';
    } else {
      const isVisible = iframe.style.display !== 'none';
      iframe.style.display = isVisible ? 'none' : 'block';
      button.innerHTML = isVisible ? '💬' : '✕';
    }
  });
  
  button.addEventListener('mouseenter', function() {
    button.style.transform = 'scale(1.1)';
  });
  
  button.addEventListener('mouseleave', function() {
    button.style.transform = 'scale(1)';
  });
})();
</script>
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
