import type { PreSignUpTriggerHandler } from 'aws-lambda';

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log('hitting pre-sign-up func', event)
  const email = event.request.userAttributes['email'];

  // Access the environment variable directly using process.env
  const allowedDomain = process.env.ALLOW_DOMAIN;

  if (!email.endsWith(allowedDomain || '')) {
    throw new Error('Invalid email domain');
  }

  return event;
};
