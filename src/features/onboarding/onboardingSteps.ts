export const onboardingSteps = [
  {
    id: 'blood-analysis',
    title: 'Blood Analysis',
    description: 'Upload your blood test results or select the package you need to take.',
    route: '/analyses'
  },
  {
    id: 'braverman',
    title: 'Braverman Assessment',
    description: 'Identify your neurotransmitter profile and motivation archetype.',
    route: '/braverman-test'
  },
  {
    id: 'profile',
    title: 'Fill Profile',
    description: 'Complete your basic profile details for personalization.',
    route: '/onboarding/profile'
  }
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]['id'];
