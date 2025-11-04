import React from 'react';
import {Box, Flex} from 'theme-ui';

import * as API from '../../api';
import {Inbox, OnboardingStatus} from '../../types';
import logger from '../../logger';
import {colors, Container, Divider, Text, Title} from '../common';
import Spinner from '../Spinner';
import Steps from './Steps';

const GettingStarted = () => {
  const [onboardingStatus, setOnboardingStatus] =
    React.useState<OnboardingStatus | null>(null);
  const [inbox, setDefaultInbox] = React.useState<Inbox | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const status = await API.getOnboardingStatus();
        const inboxes = await API.fetchInboxes();
        const [first] = inboxes;
        const primary = inboxes.find((inbox) => inbox.is_primary);

        setOnboardingStatus(status);
        setDefaultInbox(primary || first);
      } catch (error) {
        logger.error('Failed to get onboarding status:', error);
      }

      setLoading(false);
    })();
  }, []);

  if (loading || !onboardingStatus || !inbox) {
    return (
      <Flex
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Spinner size={40} />
      </Flex>
    );
  }

  return (
    <Container sx={{maxWidth: 800, paddingTop: '48px', paddingBottom: '48px'}}>
      <Box mb={6} sx={{width: '100%', maxWidth: 800, textAlign: 'center'}}>
        <Title
          level={2}
          style={{fontSize: '28px', fontWeight: 600, marginBottom: '8px'}}
        >
          Get started with Netia
        </Title>
        <Text
          type="secondary"
          style={{fontSize: '15px', color: colors.textMuted}}
        >
          Complete these steps to set up your workspace
        </Text>
      </Box>
      <Box sx={{width: '100%', maxWidth: 720}}>
        <Steps onboardingStatus={onboardingStatus} inbox={inbox} />
      </Box>
    </Container>
  );
};

export default GettingStarted;
