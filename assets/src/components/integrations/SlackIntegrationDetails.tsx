// @ts-nocheck
import React from 'react';
import {Navigate, useSearchParams} from 'react-router-dom';
import {parseSlackAuthState} from './support';

export const SlackIntegrationDetails = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || searchParams.get('state') || '';
  const {type, inboxId} = parseSlackAuthState(typeParam);
  const restParams = Object.fromEntries(searchParams.entries());
  delete restParams.type;
  delete restParams.state;

  if (inboxId && inboxId.length) {
    switch (type) {
      case 'reply': {
        const params = new URLSearchParams(restParams);
        if (searchParams.get('state'))
          params.set('state', searchParams.get('state')!);
        return (
          <Navigate
            to={`/inboxes/${inboxId}/integrations/slack/reply?${params.toString()}`}
            replace
          />
        );
      }
      case 'support': {
        const params = new URLSearchParams(restParams);
        if (searchParams.get('state'))
          params.set('state', searchParams.get('state')!);
        return (
          <Navigate
            to={`/inboxes/${inboxId}/integrations/slack/support?${params.toString()}`}
            replace
          />
        );
      }
      default:
        return <Navigate to={`/inboxes/${inboxId}/integrations`} replace />;
    }
  }

  switch (type) {
    case 'reply': {
      const params = new URLSearchParams(restParams);
      if (searchParams.get('state'))
        params.set('state', searchParams.get('state')!);
      return (
        <Navigate
          to={`/integrations/slack/reply?${params.toString()}`}
          replace
        />
      );
    }
    case 'support': {
      const params = new URLSearchParams(restParams);
      if (searchParams.get('state'))
        params.set('state', searchParams.get('state')!);
      return (
        <Navigate
          to={`/integrations/slack/support?${params.toString()}`}
          replace
        />
      );
    }
    default:
      return <Navigate to="/integrations" replace />;
  }
};

export default SlackIntegrationDetails;
