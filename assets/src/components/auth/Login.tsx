import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title} from '../common';
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
    <Flex
      px={[2, 5]}
      py={5}
      sx={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{width: '100%', maxWidth: 320}}>
        <Title level={1}>Welcome back</Title>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              size="large"
              type="email"
              autoComplete="username"
              value={email}
              onChange={handleChangeEmail}
            />
          </Box>

          <Box mb={2}>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              size="large"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChangePassword}
            />
          </Box>

          <Box mt={3}>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Log in
            </Button>
          </Box>

          {error && (
            <Box mt={2}>
              <Text type="danger">{error}</Text>
            </Box>
          )}

          <Box my={3}>
            <Link to="/reset-password">Forgot your password?</Link>
          </Box>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
