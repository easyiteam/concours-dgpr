export enum ValidatorType {
  'define-pin' = 'definePin',
  'accept-revocation' = 'acceptRevocation',
}

export enum ValidatorViews {
  definePin = 'define-pin',
  acceptRevocation = 'accept-revocation',
}

export const ValidatorTemplates = {
  definePin: 'validator.define-pin',
  acceptRevocation: 'validator.accept-revocation',
  validate: 'validation.validate',
};

export const ValidatorSubject = {
  definePin: 'DGEFC, nouveau validateur',
  acceptRevocation: 'DGEFC, demande de révocation de validation',
  validate: 'DGEFC, vous avez une nouvelle demande de validation en attente',
};
