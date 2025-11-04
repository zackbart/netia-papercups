import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Card, colors, Input, Text, Title} from '../common';
import * as API from '../../api';
import logger from '../../logger';

const RequestPasswordReset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<any>(null);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    API.sendPasswordResetEmail(email)
      .then(({ok}) => {
        if (ok) {
          navigate('/reset-password-requested');
        } else {
          setError('Something went wrong! Try again in a few minutes.');
          setLoading(false);
        }
      })
      .catch((err) => {
        logger.error('Error!', err);
        const errorMessage =
          err.response?.body?.error?.message ||
          'Something went wrong! Try again in a few minutes.';

        setError(errorMessage);
        setLoading(false);
      });
  };

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
        <Box mb={5} sx={{textAlign: 'center', width: '100%'}}>
          <Title
            level={1}
            style={{
              fontSize: '36px',
              fontWeight: 600,
              marginBottom: '12px',
              color: colors.textPrimary,
              fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
            }}
          >
            Reset password
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: '16px',
              color: colors.textMuted,
              display: 'block',
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password
          </Text>
        </Box>

        <Card
          style={{
            width: '100%',
            padding: '40px',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
            background: colors.bgWhite,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box mb={4}>
              <Box mb={1}>
                <Text
                  strong
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textPrimary,
                    display: 'block',
                  }}
                >
                  Email
                </Text>
              </Box>
              <Input
                id="email"
                size="large"
                type="email"
                autoComplete="username"
                value={email}
                onChange={handleChangeEmail}
                placeholder="Enter your email"
                style={{
                  fontSize: '14px',
                  height: '44px',
                }}
              />
            </Box>

            {error && (
              <Box
                mb={3}
                sx={{
                  padding: '12px 16px',
                  backgroundColor: '#fff1f0',
                  border: `1px solid ${colors.red}`,
                  borderRadius: '8px',
                }}
              >
                <Text
                  type="danger"
                  style={{
                    fontSize: '14px',
                    color: colors.red,
                  }}
                >
                  {error}
                </Text>
              </Box>
            )}

            <Box mb={3}>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  height: '44px',
                  fontSize: '15px',
                  fontWeight: 500,
                  borderRadius: '8px',
                }}
              >
                Send reset link
              </Button>
            </Box>

            <Box sx={{textAlign: 'center'}}>
              <Text
                type="secondary"
                style={{
                  fontSize: '14px',
                  color: colors.textMuted,
                }}
              >
                Back to{' '}
                <Link
                  to="/login"
                  style={{
                    color: colors.primary,
                    textDecoration: 'none',
                    transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.primary;
                  }}
                >
                  login
                </Link>
              </Text>
            </Box>
          </form>
        </Card>
      </Flex>
    </Box>
  );
};

export default RequestPasswordReset;
