import React from 'react';
import {Box, SxStyleProp} from 'theme-ui';

const EmbeddableChat = ({
  config,
  height,
  width,
  sx = {},
  onChatLoaded,
  onMessageSent,
  onMessageReceived,
}: {
  config: any;
  height?: number | string;
  width?: number | string;
  sx?: SxStyleProp;
  onChatLoaded?: (papercups: any) => void;
  onMessageSent?: (message: any) => void;
  onMessageReceived?: (message: any) => void;
}) => {
  const chatUrl = `${window.location.origin}/chat?token=${
    config.token
  }&title=${encodeURIComponent(
    config.title || 'Welcome!'
  )}&subtitle=${encodeURIComponent(
    config.subtitle || ''
  )}&primaryColor=${encodeURIComponent(
    config.primaryColor || '#1677ff'
  )}&greeting=${encodeURIComponent(
    config.greeting || ''
  )}&customer=${encodeURIComponent(JSON.stringify(config.customer || {}))}`;

  return (
    <Box
      sx={{
        height: height || 560,
        width: width || 376,
        border: '1px solid rgb(230, 230, 230)',
        borderRadius: 4,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <iframe
        src={chatUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Embeddable Chat"
        onLoad={() => {
          if (onChatLoaded) {
            onChatLoaded({});
          }
        }}
      />
    </Box>
  );
};

export default EmbeddableChat;
