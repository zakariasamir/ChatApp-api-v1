export const notFound = () => {
  const err = new Error("url not found please check the documentation");
  // @ts-expect-error
  err.status = 404;
  return err;
};

export const incorrectCredentials = () => {
  const err = new Error("The provided auth credentials are incorrect.");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const unAuthenticatedUser = () => {
  const err = new Error(
    "You need to be authenticated to perform this request."
  );
  // @ts-expect-error
  err.status = 301;
  return err;
};

export const invalidAuthTokenProvided = () => {
  const err = new Error("An invalid token was provided in the request header.");
  // @ts-expect-error
  err.status = 301;
  return err;
};

export const invalidResetToken = () => {
  const err = new Error("An invalid reset token was provided.");
  // @ts-expect-error
  err.status = 301;
  return err;
};

export const noAccountAssociatedWithAuthToken = () => {
  const err = new Error("No valid account was found with the request token.");
  // @ts-expect-error
  err.status = 301;
  return err;
};

export const noAccountWithThisEmail = () => {
  const err = new Error("No account associated with the email address");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const emailExist = (email: string) => {
  const err = new Error(
    `the ${email} address email is already associated with another user account`
  );
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const uniqueEntity = (entity: string) => {
  const err = new Error(`the ${entity} entity must be unique`);
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const emailValid = () => {
  const err = new Error("please enter a valid email address");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const googleAccountIsNotVerified = () => {
  const err = new Error("Please sign in with a verified Google account.");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const autorize = () => {
  const err = new Error("you are not allowed to do this action");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const dataIsInvalid = () => {
  // This is way too generic lol
  const err = new Error("Data validation failed.");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const dataRequired = () => {
  const err = new Error("Missing required fields");
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const entityDoesntExist = (entity: string) => {
  const err = new Error(`No ${entity} found.`);
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const emptyEntityDocumentsCount = (entity: string) => {
  const err = new Error(`There are no ${entity} documents found.`);
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const unAuthorizedUser = () => {
  const err = new Error(`You're not authorized to get the requested resource.`);
  // @ts-expect-error
  err.status = 401;
  return err;
};

export const verifyPassword = () => {
  const err = new Error(
    "Your current password is incorrect. Please try again!"
  );
  // @ts-expect-error
  err.status = 400;
  return err;
};

export const genericError = () => {
  const err = new Error("Something went wrong!");
  // @ts-expect-error
  err.status = 500;
  return err;
};

export const googleCalendarInvalidPermission = () => {
  const err = new Error("You need permission to perform this action");
  // @ts-expect-error
  err.status = 401;
  return err;
};

export const custom = (errMsg = "", errStatus = 500) => {
  const err = new Error(errMsg);
  // @ts-expect-error
  err.status = errStatus;
  return err;
};

export const limitReached = () => {
  const err = new Error("Resource limit is reached");
  // @ts-expect-error
  err.status = 422;
  return err;
};
