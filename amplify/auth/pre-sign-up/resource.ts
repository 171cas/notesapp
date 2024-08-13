import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-sign-up',
  environment: {
    ALLOW_DOMAIN: 'gmail.com'
  },
  entry: './handler.ts', // Ensure you point to the correct handler path
});
