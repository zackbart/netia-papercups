import React, {useState} from 'react';
import {Box} from 'theme-ui';
import {
  Button,
  Paragraph,
  StandardSyntaxHighlighter,
  Tabs,
  Text,
  Title,
} from '../common';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import {message} from 'antd';
import {FRONTEND_BASE_URL} from '../../config';

type Props = {
  accountId: string;
  inboxId?: string;
  title: string;
  subtitle: string;
  color: string;
  greeting?: string;
  awayMessage?: string;
  newMessagePlaceholder?: string;
  showAgentAvailability: boolean;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  requireEmailUpfront: boolean;
  iconVariant: string;
  isBrandingHidden?: boolean;
};

enum EmbedType {
  SCRIPT = 'SCRIPT',
  IFRAME = 'IFRAME',
}

const UniversalEmbedCode: React.FC<Props> = ({
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
  isBrandingHidden = false,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const buildQueryParams = () => {
    const params = new URLSearchParams({
      token: accountId,
      title: title,
      subtitle: subtitle,
      primaryColor: color,
      ...(inboxId && {inbox: inboxId}),
      ...(greeting && {greeting}),
      ...(awayMessage && {awayMessage}),
      ...(newMessagePlaceholder && {newMessagePlaceholder}),
      showAgentAvailability: showAgentAvailability ? '1' : '0',
      ...(agentAvailableText && {agentAvailableText}),
      ...(agentUnavailableText && {agentUnavailableText}),
      requireEmailUpfront: requireEmailUpfront ? '1' : '0',
      iconVariant: iconVariant,
      isBrandingHidden: isBrandingHidden ? 'true' : 'false',
    });

    return params.toString();
  };

  const chatUrl = `${FRONTEND_BASE_URL}/chat?${buildQueryParams()}`;

  const scriptEmbedCode = `<script>
  (function() {
    var config = {
      ${[
        `token: "${accountId}"`,
        inboxId && `inbox: "${inboxId}"`,
        `title: "${title}"`,
        `subtitle: "${subtitle}"`,
        `primaryColor: "${color}"`,
        greeting && `greeting: "${greeting}"`,
        awayMessage && `awayMessage: "${awayMessage}"`,
        newMessagePlaceholder &&
          `newMessagePlaceholder: "${newMessagePlaceholder}"`,
        `showAgentAvailability: ${showAgentAvailability ? '1' : '0'}`,
        agentAvailableText && `agentAvailableText: "${agentAvailableText}"`,
        agentUnavailableText &&
          `agentUnavailableText: "${agentUnavailableText}"`,
        `requireEmailUpfront: ${requireEmailUpfront ? '1' : '0'}`,
        `iconVariant: "${iconVariant}"`,
        `isBrandingHidden: "${isBrandingHidden}"`,
      ]
        .filter(Boolean)
        .join(',\n      ')}
    };
    
    // Create floating chat button
    var btn = document.createElement('button');
    btn.innerHTML = '💬';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:'+config.primaryColor+';color:white;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-size:24px;transition:transform 0.2s;';
    btn.onmouseenter = function() { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; };
    
    btn.onclick = function() {
      if (!window.netiaChat) {
        var iframe = document.createElement('iframe');
        var params = new URLSearchParams(config).toString();
        iframe.src = '${FRONTEND_BASE_URL}/chat?' + params;
        iframe.style.cssText = 'position:fixed;bottom:90px;right:20px;width:400px;height:600px;border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;max-width:calc(100vw - 40px);max-height:calc(100vh - 120px);';
        document.body.appendChild(iframe);
        window.netiaChat = iframe;
        btn.innerHTML = '✕';
      } else {
        var isVisible = window.netiaChat.style.display !== 'none';
        window.netiaChat.style.display = isVisible ? 'none' : 'block';
        btn.innerHTML = isVisible ? '💬' : '✕';
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(btn);
      });
    } else {
      document.body.appendChild(btn);
    }
  })();
</script>`;

  const iframeEmbedCode = `<iframe 
  src="${chatUrl}"
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; max-width: calc(100vw - 40px); max-height: calc(100vh - 40px);"
  title="Chat with us"
  allow="microphone">
</iframe>`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    message.success('Code copied to clipboard!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Box>
      <Tabs defaultActiveKey={EmbedType.SCRIPT} type="card">
        <Tabs.TabPane
          tab="With Chat Button (Recommended)"
          key={EmbedType.SCRIPT}
        >
          <Box mb={3}>
            <Paragraph>
              <Text>
                This code creates a floating chat button in the bottom-right
                corner of your website. When clicked, it opens the chat widget.
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>
                Copy and paste this code before the closing{' '}
                <Text code>{'</body>'}</Text> tag in your HTML:
              </Text>
            </Paragraph>
          </Box>

          <Box mb={3} sx={{position: 'relative'}}>
            <StandardSyntaxHighlighter language="html">
              {scriptEmbedCode}
            </StandardSyntaxHighlighter>
            <Box sx={{position: 'absolute', top: 12, right: 12}}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(scriptEmbedCode, 'script')}
                type={copiedType === 'script' ? 'primary' : 'default'}
              >
                {copiedType === 'script' ? 'Copied!' : 'Copy Code'}
              </Button>
            </Box>
          </Box>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Always Visible (Iframe)" key={EmbedType.IFRAME}>
          <Box mb={3}>
            <Paragraph>
              <Text>
                This code embeds the chat widget directly on your page, always
                visible in the bottom-right corner.
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>
                Copy and paste this code before the closing{' '}
                <Text code>{'</body>'}</Text> tag in your HTML:
              </Text>
            </Paragraph>
          </Box>

          <Box mb={3} sx={{position: 'relative'}}>
            <StandardSyntaxHighlighter language="html">
              {iframeEmbedCode}
            </StandardSyntaxHighlighter>
            <Box sx={{position: 'absolute', top: 12, right: 12}}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(iframeEmbedCode, 'iframe')}
                type={copiedType === 'iframe' ? 'primary' : 'default'}
              >
                {copiedType === 'iframe' ? 'Copied!' : 'Copy Code'}
              </Button>
            </Box>
          </Box>
        </Tabs.TabPane>
      </Tabs>
    </Box>
  );
};

export default UniversalEmbedCode;
