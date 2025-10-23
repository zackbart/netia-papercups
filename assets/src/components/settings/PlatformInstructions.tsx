import React from 'react';
import {Box} from 'theme-ui';
import Collapse from 'antd/lib/collapse';
import {Paragraph, Text, Title} from '../common';

const {Panel} = Collapse;

const PlatformInstructions: React.FC = () => {
  return (
    <Box mt={4}>
      <Title level={4}>Platform-Specific Installation Guides</Title>
      <Paragraph>
        <Text type="secondary">
          Choose your platform below for detailed installation instructions:
        </Text>
      </Paragraph>

      <Collapse accordion>
        <Panel header="WordPress" key="wordpress">
          <Box>
            <Paragraph>
              <Text strong>Method 1: Using a Custom HTML Block (Easiest)</Text>
            </Paragraph>
            <ol>
              <li>Go to your WordPress admin dashboard</li>
              <li>
                Navigate to <Text code>Appearance → Widgets</Text>
              </li>
              <li>
                Add a <Text strong>Custom HTML</Text> widget to your footer
              </li>
              <li>Paste the embed code from above</li>
              <li>Save changes</li>
            </ol>

            <Paragraph sx={{mt: 3}}>
              <Text strong>Method 2: Adding to Theme Footer</Text>
            </Paragraph>
            <ol>
              <li>
                Go to <Text code>Appearance → Theme File Editor</Text>
              </li>
              <li>
                Select your theme's <Text code>footer.php</Text> file
              </li>
              <li>
                Paste the embed code before the closing{' '}
                <Text code>{'</body>'}</Text> tag
              </li>
              <li>
                Click <Text strong>Update File</Text>
              </li>
            </ol>

            <Paragraph sx={{mt: 3}}>
              <Text strong>Method 3: Using a Plugin</Text>
            </Paragraph>
            <ol>
              <li>
                Install the <Text strong>"Insert Headers and Footers"</Text>{' '}
                plugin
              </li>
              <li>
                Go to <Text code>Settings → Insert Headers and Footers</Text>
              </li>
              <li>Paste the code in the "Scripts in Footer" section</li>
              <li>Save changes</li>
            </ol>
          </Box>
        </Panel>

        <Panel header="Wix" key="wix">
          <Box>
            <ol>
              <li>Open your Wix site editor</li>
              <li>
                Click the <Text strong>Add</Text> button (+) on the left panel
              </li>
              <li>
                Select <Text code>Embed → Embed HTML iframe</Text>
              </li>
              <li>Click "Enter Code"</li>
              <li>Paste the embed code</li>
              <li>Position the widget where you want it on your page</li>
              <li>Publish your site</li>
            </ol>

            <Paragraph sx={{mt: 2}}>
              <Text type="secondary">
                <Text strong>Note:</Text> For the chat button to appear on all
                pages, add it to your site's master page or use the "Custom
                Code" option in <Text code>Settings → Custom Code</Text>{' '}
                (Business & eCommerce plans only).
              </Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="Squarespace" key="squarespace">
          <Box>
            <Paragraph>
              <Text strong>Method 1: Site-Wide Installation (Recommended)</Text>
            </Paragraph>
            <ol>
              <li>
                Go to <Text code>Settings → Advanced → Code Injection</Text>
              </li>
              <li>
                Paste the embed code in the <Text strong>Footer</Text> section
              </li>
              <li>
                Click <Text strong>Save</Text>
              </li>
            </ol>

            <Paragraph sx={{mt: 3}}>
              <Text strong>Method 2: Single Page Installation</Text>
            </Paragraph>
            <ol>
              <li>Edit the page where you want the chat</li>
              <li>
                Add a <Text strong>Code Block</Text>
              </li>
              <li>Paste the embed code</li>
              <li>Save and publish</li>
            </ol>
          </Box>
        </Panel>

        <Panel header="Shopify" key="shopify">
          <Box>
            <ol>
              <li>
                From your Shopify admin, go to{' '}
                <Text code>Online Store → Themes</Text>
              </li>
              <li>
                Click <Text strong>Actions → Edit code</Text> for your active
                theme
              </li>
              <li>
                In the Layout folder, click <Text code>theme.liquid</Text>
              </li>
              <li>
                Find the closing <Text code>{'</body>'}</Text> tag
              </li>
              <li>Paste the embed code just before it</li>
              <li>
                Click <Text strong>Save</Text>
              </li>
            </ol>

            <Paragraph sx={{mt: 2}}>
              <Text type="secondary">
                The chat will now appear on all pages of your store.
              </Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="Webflow" key="webflow">
          <Box>
            <Paragraph>
              <Text strong>Project-Wide Installation</Text>
            </Paragraph>
            <ol>
              <li>Open your Webflow project</li>
              <li>
                Click the <Text strong>Settings</Text> icon (gear) in the left
                panel
              </li>
              <li>
                Go to the <Text strong>Custom Code</Text> tab
              </li>
              <li>
                Paste the embed code in the <Text strong>Footer Code</Text>{' '}
                section
              </li>
              <li>
                Click <Text strong>Save Changes</Text>
              </li>
              <li>Publish your site</li>
            </ol>
          </Box>
        </Panel>

        <Panel header="GoDaddy Website Builder" key="godaddy">
          <Box>
            <ol>
              <li>Open your GoDaddy Website Builder</li>
              <li>
                Click <Text strong>Add Section</Text>
              </li>
              <li>
                Select <Text strong>HTML</Text> from the section types
              </li>
              <li>Paste the embed code</li>
              <li>Position it at the bottom of your page</li>
              <li>Publish your site</li>
            </ol>
          </Box>
        </Panel>

        <Panel header="React / Next.js / Vue / Angular" key="react">
          <Box>
            <Paragraph>
              <Text strong>React / Next.js Example</Text>
            </Paragraph>
            <Paragraph>
              <Text>
                Create a component and use{' '}
                <Text code>dangerouslySetInnerHTML</Text> or add the script to
                your <Text code>_document.js</Text> (Next.js) or{' '}
                <Text code>index.html</Text> (React):
              </Text>
            </Paragraph>

            <pre
              style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {`// In Next.js _app.js or layout component
import { useEffect } from 'react';

export default function ChatWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = \`
      // Paste the JavaScript embed code here
    \`;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup
      if (window.netiaChat) {
        window.netiaChat.remove();
      }
    };
  }, []);
  
  return null;
}`}
            </pre>

            <Paragraph sx={{mt: 2}}>
              <Text type="secondary">
                Or simply add the script tag to your{' '}
                <Text code>index.html</Text> or <Text code>_document.js</Text>{' '}
                file.
              </Text>
            </Paragraph>
          </Box>
        </Panel>

        <Panel header="Plain HTML / Custom Site" key="html">
          <Box>
            <Paragraph>
              <Text>
                For any custom HTML site, simply paste the embed code before the
                closing <Text code>{'</body>'}</Text> tag in your HTML file:
              </Text>
            </Paragraph>

            <pre
              style={{
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Your website content -->
  
  <!-- Netia Chat Widget - Paste embed code here -->
  <script>
    // Your embed code goes here
  </script>
</body>
</html>`}
            </pre>

            <Paragraph sx={{mt: 2}}>
              <Text type="secondary">
                The chat button will appear on every page that includes this
                code.
              </Text>
            </Paragraph>
          </Box>
        </Panel>
      </Collapse>
    </Box>
  );
};

export default PlatformInstructions;
