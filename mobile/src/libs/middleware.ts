import { Storage } from "@capacitor/storage";

export enum DF_STEPS {
  NOT_STARTED = 'NOT_STARTED',
  PRESENCE = 'PRESENCE',
  VALIDATION = 'VALIDATION',
  CLOSED = 'CLOSED'
}

export const DF_CURRENT_STEP = '__DF_CURRENT_STEP__';

export async function setCurrentStep(step: DF_STEPS) {
  await Storage.set({
    key: DF_CURRENT_STEP,
    value: step + ''
  });
}

export async function getCurrentStep() {
  return (await Storage.get({ key: DF_CURRENT_STEP })).value;
}

export async function applyInterceptorMiddleware(router: any) {
  const currentStep = await getCurrentStep();
  if (!currentStep) {
    setCurrentStep(DF_STEPS.PRESENCE);
    router.push('/presences');
  } else {
    const stepsRoutes_: any = {
      NOT_STARTED: '/home',
      PRESENCE: '/presences',
      VALIDATION: '/validations',
      CLOSED: '/process-end'
    };

    router.push(stepsRoutes_[currentStep]);
  }
}