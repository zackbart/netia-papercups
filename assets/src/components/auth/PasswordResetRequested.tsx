import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Card, colors, Result, Text, Title} from '../common';

export const PasswordResetRequested = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: `linear-gradient(180deg, ${colors.bgWhite} 0%, ${colors.bgSurface} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 440,
        }}
      >
        <Card
          style={{
            width: '100%',
            padding: '40px',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
            background: colors.bgWhite,
            textAlign: 'center',
          }}
        >
          <Result
            status="success"
            title={
              <Title
                level={3}
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
                  marginBottom: '8px',
                }}
              >
                Please check your email
              </Title>
            }
            subTitle={
              <Box>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '15px',
                    color: colors.textMuted,
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  We'll send you a link to reset your password{' '}
                  <span role="img" aria-label=":)">
                    😊
                  </span>
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '14px',
                    color: colors.textMuted,
                    display: 'block',
                  }}
                >
                  If you don't see it in a few minutes, you may need to check
                  your spam folder.
                </Text>
              </Box>
            }
            extra={
              <Box mt={4}>
                <Link to="/login">
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      height: '44px',
                      padding: '0 24px',
                      fontSize: '15px',
                      fontWeight: 500,
                      borderRadius: '8px',
                    }}
                  >
                    Back to login
                  </Button>
                </Link>
              </Box>
            }
          />
        </Card>
      </Flex>
    </Box>
  );
};

export default PasswordResetRequested;
