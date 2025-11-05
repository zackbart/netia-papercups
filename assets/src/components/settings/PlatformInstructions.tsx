import React from 'react';
import {Box} from 'theme-ui';
import Collapse from 'antd/lib/collapse';
import {Paragraph, Text, Title} from '../common';

const {Panel} = Collapse;

const PlatformInstructions = () => {
  return (
    <Box mb={4}>
      <Title level={4}>Platform-Specific Installation Instructions</Title>

      <Collapse
        accordion
        style={{
          marginTop: '16px',
          backgroundColor: '#fff',
        }}
      >
        <Panel header="🚀 React & Next.js" key="react">
          <Box>
            <Paragraph>
              <Text>
                <strong>React (Create React App):</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                1. Add the embed code to your <code>public/index.html</code>{' '}
                file before the closing <code>&lt;/body&gt;</code> tag
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Or create a component:</Text>
            </Paragraph>
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                bg: '#f5f5f5',
                p: 2,
                borderRadius: 4,
                mb: 2,
              }}
            >
              {`// ChatWidget.jsx
import { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Add your embed code here
    const script = document.createElement('script');
    script.innerHTML = \`/* Your embed code */\`;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);
  
  return null;
};

export default ChatWidget;`}
            </Box>
            <Paragraph>
              <Text>
                <strong>Next.js:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                1. Add to <code>pages/_document.js</code> or{' '}
                <code>app/layout.js</code> (App Router)
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                2. Use Next.js Script component for better performance:
              </Text>
            </Paragraph>
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                bg: '#f5f5f5',
                p: 2,
                borderRadius: 4,
                mb: 2,
              }}
            >
              {`import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script id="netia-chat" strategy="afterInteractive">
          {\`/* Your embed code */\`}
        </Script>
      </body>
    </html>
  );
}`}
            </Box>
          </Box>
        </Panel>

        <Panel header="🌐 WordPress" key="wordpress">
          <Box>
            <Paragraph>
              <Text>
                <strong>Method 1 - Theme Editor:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Appearance → Theme Editor</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                2. Select <code>footer.php</code>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                3. Add embed code before <code>&lt;/body&gt;</code> tag
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Method 2 - Plugin:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Install "Insert Headers and Footers" plugin</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Go to Settings → Insert Headers and Footers</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Paste embed code in "Footer" section</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Method 3 - Custom HTML Widget:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Appearance → Widgets</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Add "Custom HTML" widget to footer</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Paste embed code</Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="🛍️ E-commerce Platforms" key="ecommerce">
          <Box>
            <Paragraph>
              <Text>
                <strong>Shopify:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Online Store → Themes</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Click "Actions" → "Edit code"</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                3. Open <code>theme.liquid</code>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                4. Add embed code before <code>&lt;/body&gt;</code> tag
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>WooCommerce:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Follow WordPress instructions above</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                2. Or use WooCommerce-specific hooks in{' '}
                <code>functions.php</code>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Magento:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Content → Design → Configuration</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Edit your theme</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Add to "Footer" → "Miscellaneous HTML"</Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="🎨 Website Builders" key="builders">
          <Box>
            <Paragraph>
              <Text>
                <strong>Wix:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Settings → Custom Code</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Click "Add Custom Code"</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Select "Body - End"</Text>
            </Paragraph>
            <Paragraph>
              <Text>4. Paste embed code</Text>
            </Paragraph>
            <Paragraph>
              <Text>5. Apply to "All Pages" or specific pages</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Squarespace:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Settings → Advanced → Code Injection</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Paste embed code in "Footer" section</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Save changes</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Webflow:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Project Settings → Custom Code</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Add embed code to "Footer Code"</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Publish your site</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Framer:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Site Settings → Custom Code</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Add embed code to "Head" or "Body" section</Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="💼 Business Platforms" key="business">
          <Box>
            <Paragraph>
              <Text>
                <strong>HubSpot:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Marketing → Website → Website Pages</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Edit your page</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Add "Embed" module</Text>
            </Paragraph>
            <Paragraph>
              <Text>4. Paste embed code</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Drupal:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Structure → Block Layout</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Add "Custom Block" to footer region</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Paste embed code in block content</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Joomla:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Go to Extensions → Modules</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Create "Custom HTML" module</Text>
            </Paragraph>
            <Paragraph>
              <Text>3. Position in footer</Text>
            </Paragraph>
            <Paragraph>
              <Text>4. Paste embed code</Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="📱 Mobile App Integration" key="mobile">
          <Box>
            <Paragraph>
              <Text>
                <strong>React Native:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Use WebView component:</Text>
            </Paragraph>
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                bg: '#f5f5f5',
                p: 2,
                borderRadius: 4,
                mb: 2,
              }}
            >
              {`import { WebView } from 'react-native-webview';

const ChatScreen = () => {
  return (
    <WebView
      source={{ uri: 'https://app.netia.ai/chat?token=YOUR_TOKEN' }}
      style={{ flex: 1 }}
    />
  );
};`}
            </Box>
            <Paragraph>
              <Text>
                <strong>Flutter:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Add webview_flutter dependency</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Use WebView widget</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>iOS (Swift):</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Use WKWebView</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Load your chat URL</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                <strong>Android (Kotlin):</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>1. Use WebView component</Text>
            </Paragraph>
            <Paragraph>
              <Text>2. Enable JavaScript</Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="⚡ Performance Tips" key="performance">
          <Box>
            <Paragraph>
              <Text>
                <strong>Lazy Loading:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>Load chat widget only when user scrolls or interacts:</Text>
            </Paragraph>
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                bg: '#f5f5f5',
                p: 2,
                borderRadius: 4,
                mb: 2,
              }}
            >
              {`// Load chat widget after user scrolls
window.addEventListener('scroll', function() {
  if (!window.chatLoaded) {
    // Load your embed code here
    window.chatLoaded = true;
  }
}, { once: true });`}
            </Box>
            <Paragraph>
              <Text>
                <strong>Conditional Loading:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>Only load on specific pages or for certain users:</Text>
            </Paragraph>
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                bg: '#f5f5f5',
                p: 2,
                borderRadius: 4,
                mb: 2,
              }}
            >
              {`// Only load on product pages
if (window.location.pathname.includes('/products/')) {
  // Load your embed code here
}`}
            </Box>
          </Box>
        </Panel>

        <Panel header="🔧 Troubleshooting" key="troubleshooting">
          <Box>
            <Paragraph>
              <Text>
                <strong>Common Issues:</strong>
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                • <strong>Widget not appearing:</strong> Check browser console
                for errors
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                • <strong>CORS errors:</strong> Ensure your domain is
                whitelisted
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                • <strong>Mobile issues:</strong> Test responsive design
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                • <strong>Performance:</strong> Use lazy loading for better page
                speed
              </Text>
            </Paragraph>
            <Paragraph>
              <Text>
                • <strong>Multiple instances:</strong> Ensure embed code runs
                only once
              </Text>
            </Paragraph>
          </Box>
        </Panel>
      </Collapse>
    </Box>
  );
};

export default PlatformInstructions;
