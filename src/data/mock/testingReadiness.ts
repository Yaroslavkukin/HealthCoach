export type NotificationPlaceholder = {
  id: string;
  title: string;
  timing: string;
  status: 'planned' | 'ready' | 'disabled';
};

export type PrivacySafetyNotice = {
  id: string;
  title: string;
  message: string;
};

export type PartialDataStatus = {
  id: string;
  label: string;
  status: 'complete' | 'partial' | 'empty';
  detail: string;
};

export type ReviewFollowUp = {
  id: string;
  title: string;
  detail: string;
};

export const notificationPlaceholders: NotificationPlaceholder[] = [
  {
    id: 'morning-plan',
    title: 'Morning plan reminder',
    timing: '08:00 daily',
    status: 'ready'
  },
  {
    id: 'supplement-window',
    title: 'Supplement timing reminder',
    timing: 'With scheduled meals',
    status: 'planned'
  },
  {
    id: 'fourteen-day-review',
    title: '14-day review check-in',
    timing: 'Day 14 after onboarding',
    status: 'ready'
  }
];

export const privacySafetyNotices: PrivacySafetyNotice[] = [
  {
    id: 'educational',
    title: 'Educational guidance',
    message: 'Health Coach guidance is informational and does not replace diagnosis, treatment, or advice from a qualified clinician.'
  },
  {
    id: 'urgent-care',
    title: 'Urgent symptoms',
    message: 'For severe symptoms, allergic reactions, or urgent medical concerns, contact local emergency care immediately.'
  },
  {
    id: 'data-use',
    title: 'Prototype data handling',
    message: 'Screens may show demo and partial data during testing. Connected account data should only be saved after secure sign-in is available.'
  }
];

export const partialDataStatuses: PartialDataStatus[] = [
  {
    id: 'profile',
    label: 'Profile',
    status: 'complete',
    detail: 'Basic goal, motivation, and delivery preferences are available.'
  },
  {
    id: 'bloodwork',
    label: 'Bloodwork',
    status: 'partial',
    detail: 'Upload metadata can be captured, while file storage remains a placeholder.'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    status: 'partial',
    detail: 'Reminder copy and timing are visible, with no device push registration yet.'
  },
  {
    id: 'device-push',
    label: 'Device push',
    status: 'empty',
    detail: 'No device tokens are registered. Reminders stay inside the prototype screens.'
  }
];

export const reviewFollowUps: ReviewFollowUp[] = [
  {
    id: 'today-plan',
    title: 'Refresh today',
    detail: 'Use the review to decide which mock tasks should stay visible.'
  },
  {
    id: 'supplements',
    title: 'Check supplement fit',
    detail: 'Flag tolerance, timing, or confidence issues for tester feedback.'
  },
  {
    id: 'nutrition',
    title: 'Adjust nutrition focus',
    detail: 'Confirm whether meals still match energy, mood, and schedule.'
  }
];
