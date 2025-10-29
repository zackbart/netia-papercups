import React, {useContext} from 'react';
import {getAuthTokens, setAuthTokens, removeAuthTokens} from '../../storage';
import * as API from '../../api';
import logger from '../../logger';
import {Account, User, Subscription, SubscriptionError} from '../../types';

export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  tokens: any | null;
  loading: boolean;
  currentUser: User | null;
  account: Account | null;
  subscription: Subscription | null;
  register: (params: any) => Promise<void>;
  login: (params: any) => Promise<void>;
  logout: () => Promise<void>;
  refresh: (token: string) => Promise<void>;
}>({
  isAuthenticated: false,
  tokens: null,
  loading: false,
  currentUser: null,
  account: null,
  subscription: null,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

// Refresh every 20 mins
const AUTH_SESSION_TTL = 20 * 60 * 1000;

type Props = React.PropsWithChildren<{}>;
type State = {
  loading: boolean;
  tokens: any;
  currentUser: User | null;
  account: Account | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
};

export class AuthProvider extends React.Component<Props, State> {
  timeout: any = null;

  constructor(props: Props) {
    super(props);

    const cachedTokens = getAuthTokens();

    this.state = {
      loading: true,
      isAuthenticated: false,
      currentUser: null,
      account: null,
      subscription: null,
      tokens: cachedTokens,
    };
  }

  async componentDidMount() {
    const {tokens} = this.state;
    const refreshToken = tokens && tokens.renew_token;

    if (!refreshToken) {
      this.setState({loading: false});

      return;
    }

    // Attempt refresh auth session on load
    await this.refresh(refreshToken);
    const [currentUser, account] = await Promise.all([
      this.fetchCurrentUser(),
      this.fetchCurrentAccount(),
    ]);

    this.setState({currentUser, account, loading: false});
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    this.timeout = null;
  }

  handleAuthSuccess = async (tokens: any) => {
    setAuthTokens(tokens);

    const [currentUser, account] = await Promise.all([
      this.fetchCurrentUser(),
      this.fetchCurrentAccount(),
    ]);
    const nextRefreshToken = tokens && tokens.renew_token;
    const subscription =
      tokens && tokens.subscription ? tokens.subscription : null;

    this.setState({
      tokens,
      currentUser,
      account,
      subscription,
      isAuthenticated: true,
    });

    // Refresh the session every 20 mins to avoid the access token expiring
    // (By default, the session will expire after 30 mins)
    this.timeout = setTimeout(
      () => this.refresh(nextRefreshToken),
      AUTH_SESSION_TTL
    );
  };

  handleClearAuth = () => {
    removeAuthTokens();

    this.setState({
      tokens: null,
      currentUser: null,
      account: null,
      subscription: null,
      isAuthenticated: false,
    });
  };

  fetchCurrentAccount = async () => {
    return API.fetchAccountInfo()
      .then((account) => account)
      .catch((err) => {
        logger.error('Could not retrieve current account:', err);

        return null;
      });
  };

  fetchCurrentUser = async () => {
    return API.me()
      .then((user) => user)
      .catch((err) => {
        logger.error('Could not retrieve current user:', err);

        return null;
      });
  };

  refresh = async (refreshToken: string) => {
    return API.renew(refreshToken)
      .then((tokens) => this.handleAuthSuccess(tokens))
      .catch((err) => {
        logger.error('Invalid session:', err);
        this.handleSubscriptionError(err);
      });
  };

  register = async (params: API.RegisterParams): Promise<void> => {
    logger.debug('Signing up!');
    // Set user, authenticated status, etc
    return API.register(params)
      .then((tokens) => this.handleAuthSuccess(tokens))
      .then(() => {
        logger.debug('Successfully signed up!');
      });
  };

  login = async (params: API.LoginParams): Promise<void> => {
    logger.debug('Logging in!');
    // Set user, authenticated status, etc
    return API.login(params)
      .then((tokens) => this.handleAuthSuccess(tokens))
      .then(() => {
        logger.debug('Successfully logged in!');
      })
      .catch((err) => {
        logger.error('Login error:', err);
        this.handleSubscriptionError(err);
        throw err;
      });
  };

  logout = async (): Promise<void> => {
    logger.debug('Logging out!');
    // Set user, authenticated status, etc
    return API.logout()
      .then(() => this.handleClearAuth())
      .then(() => {
        logger.debug('Successfully logged out!');
      });
  };

  handleSubscriptionError = (err: any) => {
    // Check if this is a subscription error (403 with subscription_status)
    if (
      err &&
      err.response &&
      err.response.body &&
      err.response.body.error &&
      err.response.body.error.status === 403 &&
      err.response.body.error.subscription_status !== undefined
    ) {
      const error: SubscriptionError = err.response.body.error;
      logger.error('Subscription error:', error);

      // Redirect to billing page if action is required
      if (
        error.action_required === 'update_payment' ||
        error.action_required === 'setup_account'
      ) {
        const billingPath = '/billing';
        if (window.location.pathname !== billingPath) {
          window.location.href = billingPath;
        }
      }

      // Clear auth if subscription is invalid
      this.handleClearAuth();
    }
  };

  render() {
    const {
      loading,
      isAuthenticated,
      tokens,
      currentUser,
      account,
      subscription,
    } = this.state;

    return (
      <AuthContext.Provider
        value={{
          loading,
          isAuthenticated,
          tokens,
          currentUser,
          account,
          subscription,

          register: this.register,
          login: this.login,
          logout: this.logout,
          refresh: this.refresh,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
