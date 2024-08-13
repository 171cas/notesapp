import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { createUserProfile } from "./graphql/mutations";


Amplify.configure(
    {
      API: {
        GraphQL: {
          endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT as string, // provide default endpoint
          region: process.env.AWS_REGION,
          defaultAuthMode: "iam",
        },
      },
    },
    {
      Auth: {
        credentialsProvider: {
          getCredentialsAndIdentityId: async () => ({
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
              sessionToken: process.env.AWS_SESSION_TOKEN,
            },
          }),
          clearCredentialsAndIdentityId: () => {
            /* noop */
          },
        },
      },
    }
  );


const client = new CognitoIdentityProviderClient();
const clientTwo = generateClient<Schema>({
    authMode: "iam",
});

//add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
    const command = new AdminAddUserToGroupCommand({
        GroupName: process.env.GROUP_NAME,
        // GroupName: 'EVERYONE',
        Username: event.userName,
        UserPoolId: event.userPoolId,
    });
    const response = await client.send(command);

  console.log('processed', response.$metadata.requestId);


  const responseGraphql = await clientTwo.graphql({
    query: createUserProfile,
    variables: {
      input: {
        email: event.request.userAttributes.email,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
      },
    },
  });

  console.log('responseGraphql', responseGraphql)

  return event;
}
