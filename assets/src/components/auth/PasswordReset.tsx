import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title} from '../common';
import * as API from '../../api';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

const PasswordReset = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token') || '';

    if (!token || typeof token !== 'string') {
      setError('Invalid reset token!');
    } else {
      setPasswordResetToken(token);
    }
  }, [searchParams]);

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangePasswordConfirmation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  const getValidationError = () => {
    if (!password) {
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

    API.attemptPasswordReset(passwordResetToken, {
      password,
      passwordConfirmation,
    })
      .then(({email}) => auth.login({email, password}))
      .then(() => navigate('/conversations'))
      .catch((err) => {
        logger.error('Error!', err);
        // TODO: provide more granular error messages?
        const errorMessage =
          err.response?.body?.error?.message ||
          'Something went wrong! Try again in a few minutes.';

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
        <Title level={1}>Reset password</Title>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <label htmlFor="password">New password</label>
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
            <label htmlFor="confirm_password">Confirm new password</label>
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
              Reset
            </Button>
          </Box>

          {error && (
            <Box mt={2}>
              <Text type="danger">{error}</Text>
            </Box>
          )}

          <Box mt={error ? 3 : 4}>
            Back to <Link to="/login">login</Link>.
          </Box>
        </form>
      </Box>
    </Flex>
  );
};

export default PasswordReset;
