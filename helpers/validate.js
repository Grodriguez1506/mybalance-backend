import validator from "validator";

export const validateRegister = (params) => {
  let firstname =
    validator.isAlpha(params.firstname) &&
    validator.isLength(params.firstname, { min: 3, max: undefined });

  if (!firstname) {
    throw new Error(
      "Firstname must contain only letters and minimun 3 characters"
    );
  }

  let lastname =
    validator.isAlpha(params.lastname) &&
    validator.isLength(params.lastname, { min: 3, max: undefined });

  if (!lastname) {
    throw new Error(
      "Lastname must contain only letters and minimun 3 characters"
    );
  }

  let username = validator.isLength(params.username, {
    min: 3,
    max: undefined,
  });

  if (!username) {
    throw new Error("Username must contain minimun 3 characters");
  }

  let password =
    !validator.isAlpha(params.password) &&
    validator.isLength(params.password, { min: 6, max: undefined });

  if (!password) {
    throw new Error(
      "Password must contain letters, numbers and minimun 6 characters"
    );
  }
};

export const validateRecovery = (pwd) => {
  let password =
    !validator.isAlpha(pwd) &&
    validator.isLength(pwd, { min: 6, max: undefined });

  if (!password) {
    throw new Error(
      "Password must contain letters, numbers and minimun 6 characters"
    );
  }
};
