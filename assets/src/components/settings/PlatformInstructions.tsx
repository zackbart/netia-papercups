import React from 'react';
import {Box} from 'theme-ui';
import {Paragraph, Text, Title} from '../common';

const PlatformInstructions = () => {
  return (
    <Box mb={4}>
      <Title level={4}>Platform-Specific Instructions</Title>
      <Paragraph>
        <Text>
          For detailed installation instructions on specific platforms, check
          out our documentation:
        </Text>
      </Paragraph>

      <Box mb={3}>
        <Text strong>Popular Platforms:</Text>
        <ul>
          <li>
            <Text>WordPress - Use our WordPress plugin</Text>
          </li>
          <li>
            <Text>Shopify - Install via Shopify App Store</Text>
          </li>
          <li>
            <Text>Webflow - Add via custom code</Text>
          </li>
          <li>
            <Text>Squarespace - Use the code injection feature</Text>
          </li>
          <li>
            <Text>Wix - Add via HTML embed</Text>
          </li>
        </ul>
      </Box>

      <Paragraph>
        <Text type="secondary">
          Need help with a specific platform? Contact our support team for
          assistance.
        </Text>
      </Paragraph>
    </Box>
  );
};

export default PlatformInstructions;
