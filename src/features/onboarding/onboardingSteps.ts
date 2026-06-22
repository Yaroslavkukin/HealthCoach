export const onboardingSteps = [
  {
    id: 'blood-analysis',
    title: 'Blood Analysis',
    description: 'Upload your blood test results or select the package you need to take.',
    route: '/onboarding/blood-upload'
  },
  {
    id: 'braverman',
    title: 'Braverman Assessment',
    description: 'Identify your neurotransmitter profile and motivation archetype.',
    route: '/onboarding/braverman'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Description',
    description: 'Describe your sleep, work, stress, activity, and daily rhythm.',
    route: '/onboarding/lifestyle'
  },
  {
    id: 'nutrition',
    title: 'Nutrition Description',
    description: 'Describe what you normally eat so Nutrition AI can personalize recommendations.',
    route: '/onboarding/nutrition'
  },
  {
    id: 'ai-profile',
    title: 'AI Health Profile',
    description: 'Generate your Health Coach profile after all required data is ready.',
    route: '/onboarding/ai-processing'
  }
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]['id'];
