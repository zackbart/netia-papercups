// @ts-nocheck
import React from 'react';
import {Navigate, useSearchParams} from 'react-router-dom';

export const GoogleIntegrationDetails = () => {
  const [searchParams] = useSearchParams();
  const scope = searchParams.get('scope');
  const state = searchParams.get('state');
  const type = searchParams.get('type');
  const restParams = Object.fromEntries(searchParams.entries());
  delete restParams.scope;
  delete restParams.state;
  delete restParams.type;

  switch (scope) {
    case 'https://www.googleapis.com/auth/gmail.modify': {
      const params = new URLSearchParams(restParams);
      if (state) params.set('state', state);
      if (scope) params.set('scope', scope);
      if (type) params.set('type', type);
      return (
        <Navigate
          to={`/integrations/google/gmail?${params.toString()}`}
          replace
        />
      );
    }
    case 'https://www.googleapis.com/auth/spreadsheets': {
      const params = new URLSearchParams(restParams);
      if (state) params.set('state', state);
      if (scope) params.set('scope', scope);
      if (type) params.set('type', type);
      return (
        <Navigate
          to={`/integrations/google/sheets?${params.toString()}`}
          replace
        />
      );
    }
    default:
      return <Navigate to="/integrations" replace />;
  }
};

export default GoogleIntegrationDetails;
