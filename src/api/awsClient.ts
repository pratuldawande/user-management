import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

import { amplifyConfig } from './awsConfig';

type GraphQLReq<GraphQLVariables> = {
  query: string;
  variables?: GraphQLVariables;
  authMode?: 'apiKey' | 'userPool' | 'iam' | 'oidc' | 'lambda';
};

let isConfigured = false;

const ensureConfigured = () => {
  Amplify.configure(amplifyConfig);
  isConfigured = true;
};

export const client = async <T, GraphQLVariables = Record<string, unknown>>(
  options: GraphQLReq<GraphQLVariables>,
): Promise<T> => {
  if (!isConfigured) {
    ensureConfigured();
  }
  const response = await generateClient().graphql({
    query: options.query,
    variables: options.variables,
    authMode: options.authMode,
  });
  return (response as { data: T }).data;
};
