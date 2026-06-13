export const accessRoutes = {
  preview: '/preview',
  subscription: '/subscription',
  mainApp: '/(tabs)/today',
  createAccount: '/(auth)/create-account',
  profile: '/onboarding/profile',
  delivery: '/onboarding/delivery',
  startChecklist: '/onboarding/start-checklist'
} as const;

export type AccessRoute = (typeof accessRoutes)[keyof typeof accessRoutes];

export type AccessStage =
  | 'preview'
  | 'subscription'
  | 'accountCreation'
  | 'profileSetup'
  | 'deliverySetup'
  | 'startChecklist';

export type AccessFlowStep = {
  id: AccessStage;
  title: string;
  route: AccessRoute;
  description: string;
};

export const founderAccessRule = 'Preview first. Subscription unlocks the full app; account setup is optional later.';

export const accessFlowSteps = [
  {
    id: 'preview',
    title: 'Preview Mode',
    route: accessRoutes.preview,
    description: 'Explore fictional dashboards before entering personal data.'
  },
  {
    id: 'subscription',
    title: 'Subscription',
    route: accessRoutes.subscription,
    description: 'Choose a mocked plan after the product value is clear.'
  },
  {
    id: 'accountCreation',
    title: 'Optional Account',
    route: accessRoutes.createAccount,
    description: 'Create or sign in to an account later when the user wants saved profile access.'
  },
  {
    id: 'profileSetup',
    title: 'Profile',
    route: accessRoutes.profile,
    description: 'Collect profile details used by later recommendations.'
  },
  {
    id: 'deliverySetup',
    title: 'Delivery',
    route: accessRoutes.delivery,
    description: 'Collect delivery preferences as part of profile setup.'
  },
  {
    id: 'startChecklist',
    title: 'Start Checklist',
    route: accessRoutes.startChecklist,
    description: 'Move the user into the initial assessment steps.'
  }
] as const satisfies readonly AccessFlowStep[];

export function getAccessProgressLabel(stage: AccessStage): string {
  const index = accessFlowSteps.findIndex((step) => step.id === stage);
  const safeIndex = index >= 0 ? index : 0;

  return `Access step ${safeIndex + 1} of ${accessFlowSteps.length}: ${accessFlowSteps[safeIndex].title}`;
}

export function getAccessStageDescription(stage: AccessStage): string {
  return accessFlowSteps.find((step) => step.id === stage)?.description ?? accessFlowSteps[0].description;
}
