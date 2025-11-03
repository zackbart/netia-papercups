import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

const Register = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const {invite: inviteToken} = useParams<{invite?: string}>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [redirect, setRedirect] = useState('/getting-started');
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const redirectParam = searchParams.get('redirect') || '/getting-started';
    const emailParam = searchParams.get('email') || '';

    setRedirect(redirectParam);
    setEmail(emailParam);
  }, [searchParams]);

  const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangePasswordConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  const getValidationError = () => {
    if (!companyName && !inviteToken) {
      return 'Company name is required';
    } else if (!email) {
      return 'Email is required';
    } else if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (password !== passwordConfirmation) {
      return 'Password confirmation does not match';
    } else {
      return null;
    }
  };

  const handleInputBlur = () => {
    if (!submitted) {
      return;
    }

    setError(getValidationError());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = getValidationError();

    if (validationError) {
      setError(validationError);
      setSubmitted(true);

      return;
    }

    setLoading(true);
    setSubmitted(true);
    setError(null);

    auth
      .register({
        companyName,
        inviteToken,
        email,
        password,
        passwordConfirmation,
      })
      .then(() => navigate(redirect))
      .catch((err) => {
        logger.error('Error!', err);
        // TODO: provide more granular error messages?
        const errorMessage =
          err.response?.body?.error?.message || 'Invalid credentials';

        setError(errorMessage);
        setLoading(false);
      });
  };

  const location = {
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
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
        <Title level={1}>Get started</Title>
        <form onSubmit={handleSubmit}>
          {!inviteToken && (
            <Box mb={2}>
              <label htmlFor="companyName">Company Name</label>
              <Input
                id="companyName"
                size="large"
                type="text"
                autoComplete="company-name"
                value={companyName}
                onChange={handleChangeCompanyName}
                onBlur={handleInputBlur}
              />
            </Box>
          )}

          <Box mb={2}>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              size="large"
              type="email"
              autoComplete="username"
              value={email}
              onChange={handleChangeEmail}
              onBlur={handleInputBlur}
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
              onBlur={handleInputBlur}
            />
          </Box>

          <Box mb={2}>
            <label htmlFor="confirm_password">Confirm password</label>
            <Input
              id="confirm_password"
              size="large"
              type="password"
              autoComplete="current-password"
              value={passwordConfirmation}
              onChange={handleChangePasswordConfirmation}
              onBlur={handleInputBlur}
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
              Register
            </Button>
          </Box>

          {error && (
            <Box mt={2}>
              <Text type="danger">{error}</Text>
            </Box>
          )}

          <Box mt={error ? 3 : 4}>
            Already have an account?{' '}
            <Link to={`/login${location.search}`}>Log in!</Link>
          </Box>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
