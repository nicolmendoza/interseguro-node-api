export type Matrix = number[][];

type ValidationSuccess = {
  valid: true;
};

type ValidationFailure = {
  valid: false;
  error: string;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;
