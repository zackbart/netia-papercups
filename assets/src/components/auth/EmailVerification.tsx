import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {Flex} from 'theme-ui';
import * as API from '../../api';
import {Result} from '../common';

// Currently unused, but would like to introduce email verification for our users soon
export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = React.useState(true);
  const [isVerified, setVerified] = React.useState(false);
  const token = searchParams.get('token') || '';

  React.useEffect(() => {
    if (!token || typeof token !== 'string') {
      setLoading(false);

      return;
    }

    API.verifyUserEmail(token)
      .then(() => setVerified(true))
      .catch(() => setVerified(false))
      .then(() => setLoading(false));
  }, [token]);

  if (isLoading) {
    return null;
  }

  return (
    <Flex my={5} sx={{justifyContent: 'center'}}>
      <Result
        status={isVerified ? 'success' : 'error'}
        title={isVerified ? 'Email verified!' : 'Email verification failed.'}
        subTitle={
          isVerified
            ? 'Thanks for verifying your email address 😊'
            : 'Something went wrong. '
        }
      />
    </Flex>
  );
};

export default EmailVerification;
