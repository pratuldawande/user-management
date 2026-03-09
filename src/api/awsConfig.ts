import type { ResourcesConfig } from 'aws-amplify';
import awsconfig from '../../aws-exports';

type GraphQLAuthMode = 'apiKey' | 'userPool' | 'iam' | 'oidc' | 'lambda';

const authModeMap: Record<string, GraphQLAuthMode> = {
  API_KEY: 'apiKey',
  AMAZON_COGNITO_USER_POOLS: 'userPool',
  AWS_IAM: 'iam',
  OPENID_CONNECT: 'oidc',
  AWS_LAMBDA: 'lambda',
};

const defaultAuthMode: GraphQLAuthMode =
  authModeMap[awsconfig.aws_appsync_authenticationType] ?? 'apiKey';

export const amplifyConfig: ResourcesConfig = {
  API: {
    GraphQL: {
      endpoint: awsconfig.aws_appsync_graphqlEndpoint,
      region: awsconfig.aws_appsync_region,
      defaultAuthMode,
      apiKey: awsconfig.aws_appsync_apiKey,
    },
  },
};
