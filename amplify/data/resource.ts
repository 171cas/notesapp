import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sayHello } from '../functions/say-hello/resource';

const schema = a.schema({
  Note: a
    .model({
      name:a.string(),
      description: a.string(),
      image: a.string(),
    })
    .authorization(allow => [allow.owner()]),
  sayHello: a
    .query()
    .arguments({
      name: a.string()
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()]) // Example authorization rule
    .handler(a.handler.function(sayHello)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 5,
    },
  },
});
