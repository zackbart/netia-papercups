import React from 'react';
import {Box} from 'theme-ui';
import {Link} from 'react-router-dom';

import type {Inbox, OnboardingStatus} from '../../types';
import {colors, Button, Divider, Text} from '../common';
import {CheckOutlined} from '../icons';

type StepMetadata = {
  completed?: boolean;
  ctaHref: string;
  ctaText: string;
  text: React.ReactElement;
};

type StepsProps = {
  onboardingStatus: OnboardingStatus;
  inbox: Inbox;
};

const Steps = ({onboardingStatus, inbox}: StepsProps) => {
  const stepsMetadata: Array<StepMetadata> = getStepsMetadata(
    onboardingStatus,
    inbox
  );

  return (
    <>
      {stepsMetadata.map((stepMetadata, index) => (
        <Step {...stepMetadata} value={index + 1} key={stepMetadata.ctaText} />
      ))}
    </>
  );
};

const getStepsMetadata = (
  onboardingStatus: OnboardingStatus,
  inbox: Inbox
): Array<StepMetadata> => {
  const {id: inboxId} = inbox;

  return [
    {
      completed: onboardingStatus.has_configured_inbox,
      ctaHref: `/inboxes/${inboxId}`,
      ctaText: 'Configure your inbox',
      text: (
        <>
          <Text strong>Configure your inbox</Text> to start receiving messages
          via <Link to={`/inboxes/${inboxId}/chat-widget`}>live chat</Link> and
          many other channels.
        </>
      ),
    },
    {
      completed: onboardingStatus.has_configured_profile,
      ctaHref: '/settings/business-context',
      ctaText: 'Add your business information',
      text: (
        <>
          <Text strong>Add your business information</Text> to help the AI
          assistant provide more relevant and personalized responses to your
          customers.
        </>
      ),
    },
    {
      completed: onboardingStatus.has_invited_teammates,
      ctaHref: '/settings/team',
      ctaText: 'Invite teammates',
      text: (
        <>
          <Text strong>Invite your teammates</Text> to join you in connecting
          with and supporting your customers.
        </>
      ),
    },
    // Hidden steps - keeping integrations and billing hidden
    // {
    //   completed: onboardingStatus.has_integrations,
    //   ctaHref: '/integrations',
    //   ctaText: 'Add integrations',
    //   text: (
    //     <>
    //       <Text strong>Connect more integrations</Text> to make the most of
    //       Papercups.
    //     </>
    //   ),
    // },
    // {
    //   completed: onboardingStatus.has_upgraded_subscription,
    //   ctaHref: '/settings/billing',
    //   ctaText: 'Upgrade subscription',
    //   text: (
    //     <>
    //       <Text strong>Upgrade your subscription</Text> for access to even more
    //       features!
    //     </>
    //   ),
    // },
  ];
};

type StepProps = {
  completed?: boolean;
  ctaHref: string;
  ctaText: string;
  text: React.ReactNode;
  value: number;
};

const Step = ({completed, ctaHref, ctaText, text, value}: StepProps) => {
  const opacity = completed ? 0.7 : 1;

  return (
    <>
      <Box
        p={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: colors.bgHover,
          },
        }}
      >
        <StepIcon value={value} completed={completed} />
        <Box sx={{flexGrow: 1, opacity, minWidth: 0}}>{text}</Box>
        <Link to={ctaHref}>
          <Button type={completed ? 'default' : 'primary'}>{ctaText}</Button>
        </Link>
      </Box>
      <Divider />
    </>
  );
};

type StepIconProps = {
  completed?: boolean;
  value: number;
};

const StepIcon = ({completed, value}: StepIconProps) => {
  const baseStyles = {
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    height: '36px',
    justifyContent: 'center',
    minWidth: '36px',
    width: '36px',
    fontSize: '14px',
    fontWeight: 600,
    flexShrink: 0,
  };

  if (completed) {
    return (
      <Box
        sx={{
          ...baseStyles,
          backgroundColor: colors.primary,
          color: colors.white,
          boxShadow: '0 1px 2px 0 rgba(22, 119, 255, 0.2)',
        }}
      >
        <CheckOutlined style={{fontSize: 16}} />
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          ...baseStyles,
          border: `2px solid ${colors.primary}`,
          color: colors.primary,
          backgroundColor: colors.primaryLight,
        }}
      >
        {value}
      </Box>
    );
  }
};

export default Steps;
