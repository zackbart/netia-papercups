export const isDev = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const serverEnvData = (window as any).__ENV__ || {};

// Safely access process.env - CRA replaces process.env.REACT_APP_* at build time
// Guard against "process is not defined" errors in the browser
const getProcessEnv = (key: string): string | undefined => {
  try {
    return typeof process !== 'undefined' && process.env
      ? (process.env as any)[key]
      : undefined;
  } catch {
    return undefined;
  }
};

export const env = {
  REACT_APP_URL: getProcessEnv('REACT_APP_URL'),
  REACT_APP_EU_EDITION: getProcessEnv('REACT_APP_EU_EDITION'),
  REACT_APP_STORYTIME_ENABLED: getProcessEnv('REACT_APP_STORYTIME_ENABLED'),
  REACT_APP_USER_INVITATION_EMAIL_ENABLED: getProcessEnv(
    'REACT_APP_USER_INVITATION_EMAIL_ENABLED'
  ),
  REACT_APP_SLACK_CLIENT_ID: getProcessEnv('REACT_APP_SLACK_CLIENT_ID'),
  REACT_APP_GITHUB_APP_NAME: getProcessEnv('REACT_APP_GITHUB_APP_NAME'),
  REACT_APP_HUBSPOT_CLIENT_ID: getProcessEnv('REACT_APP_HUBSPOT_CLIENT_ID'),
  REACT_APP_INTERCOM_CLIENT_ID: getProcessEnv('REACT_APP_INTERCOM_CLIENT_ID'),
  ...serverEnvData,
};

const hostname = window.location.hostname;

export const isHostedProd =
  hostname === 'app.papercups.io' || hostname === 'app.papercups-eu.io';

export const isEuEdition =
  env.REACT_APP_EU_EDITION === 'true' || env.REACT_APP_EU_EDITION === '1';

export const isStorytimeEnabled =
  env.REACT_APP_STORYTIME_ENABLED === 'true' ||
  env.REACT_APP_STORYTIME_ENABLED === '1';

export const isUserInvitationEmailEnabled =
  env.REACT_APP_USER_INVITATION_EMAIL_ENABLED === 'true' ||
  env.REACT_APP_USER_INVITATION_EMAIL_ENABLED === '1';

export const REACT_URL = env.REACT_APP_URL || 'app.netia.ai';

// In production, we can use window.location.hostname as a fallback
// since frontend and API are served from the same domain
export const BASE_URL = isDev
  ? 'http://localhost:4000'
  : env.REACT_APP_URL
  ? `https://${REACT_URL}`
  : `${window.location.protocol}//${window.location.host}`;

// In the dev environment, CRA runs on port 3000 and makes direct API calls to Phoenix on 4000
// (We don't use CRA's proxy - see apiUrl() in api.ts for details)
export const FRONTEND_BASE_URL = isDev ? 'http://localhost:3000' : BASE_URL;

// Defaults to Papercups client ID (it's ok for this value to be public)
export const SLACK_CLIENT_ID =
  env.REACT_APP_SLACK_CLIENT_ID || '1192316529232.1250363411891';

export const GITHUB_APP_NAME = env.REACT_APP_GITHUB_APP_NAME || 'papercups-io';

// Defaults to Papercups client ID (it's ok for this value to be public)
export const HUBSPOT_CLIENT_ID =
  env.REACT_APP_HUBSPOT_CLIENT_ID || '01ec4478-4828-43b5-b505-38f517856add';

// Defaults to Papercups client ID (it's ok for this value to be public)
export const INTERCOM_CLIENT_ID =
  env.REACT_APP_INTERCOM_CLIENT_ID || '9d849ad9-d174-476f-aa1f-1d27370a937b';
