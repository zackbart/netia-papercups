import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title} from '../common';
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

          <Box mt={3}>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Submit
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

export default RequestPasswordReset;
