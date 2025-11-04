import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Card, colors, Input, Text, Title} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<any>(null);
  const [redirect, setRedirect] = useState('/getting-started');

  useEffect(() => {
    const redirectParam = searchParams.get('redirect') || '/getting-started';
    setRedirect(redirectParam);
  }, [searchParams]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // TODO: handle login through API
    auth
      .login({email, password})
      .then(() => navigate(redirect))
      .catch((err) => {
        logger.error('Error!', err);
        const errorMessage =
          err.response?.body?.error?.message || 'Invalid credentials';

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
            Welcome back
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: '16px',
              color: colors.textMuted,
              display: 'block',
            }}
          >
            Sign in to your Netia account
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
                  Password
                </Text>
              </Box>
              <Input
                id="password"
                size="large"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChangePassword}
                placeholder="Enter your password"
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
                Log in
              </Button>
            </Box>

            <Box sx={{textAlign: 'center'}}>
              <Link
                to="/reset-password"
                style={{
                  fontSize: '14px',
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
                Forgot your password?
              </Link>
            </Box>
          </form>
        </Card>

        <Box mt={4} sx={{textAlign: 'center'}}>
          <Text
            type="secondary"
            style={{
              fontSize: '13px',
              color: colors.textMuted,
            }}
          >
            Don't have an account?{' '}
            <a
              href="https://www.netia.ai/signup/starter"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.primary,
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Sign up
            </a>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
