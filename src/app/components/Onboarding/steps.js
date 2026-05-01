export const TOUR_STEPS = [
  {
    id: "metric-messages",
    target: '[data-tour="metric-messages"]',
    placement: "bottom",
    title: "Every conversation, one place",
    body: "Your total message volume across WhatsApp, SMS, Instagram, Facebook, and more.",
  },
  {
    id: "metric-customers",
    target: '[data-tour="metric-customers"]',
    placement: "bottom",
    title: "Your customer hub",
    body: "Everyone in your CRM at a glance — registered, active, and ready to engage.",
  },
  {
    id: "metric-tasks",
    target: '[data-tour="metric-tasks"]',
    placement: "bottom",
    title: "Work at a glance",
    body: "Tasks across your team — pending, in progress, and completed.",
  },
  {
    id: "metric-users",
    target: '[data-tour="metric-users"]',
    placement: "bottom",
    title: "Your team",
    body: "Everyone with access to NativeTalk. Manage roles and permissions any time.",
  },
  {
    id: "notifications",
    target: '[data-tour="notifications"]',
    placement: "bottom-end",
    title: "Stay in the loop",
    body: "System alerts, message pings, and important activity — nothing slips through.",
  },
  {
    id: "nav-dashboard",
    target: '[data-tour="nav-dashboard"]',
    placement: "right",
    title: "Your command center",
    body: "Overview of system activity, performance metrics, and key insights.",
  },
  {
    id: "nav-users",
    target: '[data-tour="nav-users"]',
    placement: "right",
    title: "Manage your team",
    body: "Add teammates, set roles, and control access across the platform.",
  },
  {
    id: "nav-messages",
    target: '[data-tour="nav-messages"]',
    placement: "right",
    title: "The unified inbox",
    body: "Reply to every customer conversation across every channel from one screen.",
  },
  {
    id: "nav-tasks",
    target: '[data-tour="nav-tasks"]',
    placement: "right",
    title: "Get work done",
    body: "Create, assign, and track tasks across your team. Kanban or table — your call.",
  },
  {
    id: "nav-tickets",
    target: '[data-tour="nav-tickets"]',
    placement: "right",
    title: "Resolve, don't forget",
    body: "Turn any customer issue into a ticket and track it through to resolution.",
  },
  {
    id: "nav-customers",
    target: '[data-tour="nav-customers"]',
    placement: "right",
    title: "Know your customers",
    body: "Profiles, history, and every interaction — searchable and at your fingertips.",
  },
  {
    id: "nav-leads",
    target: '[data-tour="nav-leads"]',
    placement: "right",
    title: "Grow your pipeline",
    body: "Track potential customers and sales opportunities from first touch to converted.",
  },
  {
    id: "nav-call-center",
    target: '[data-tour="nav-call-center"]',
    placement: "right",
    title: "Calls, handled",
    body: "Inbound, outbound, and live call activity — all from one screen.",
  },
  {
    id: "nav-reports",
    target: '[data-tour="nav-reports"]',
    placement: "right",
    title: "Insights that matter",
    body: "Generate and view performance and activity reports across your operation.",
  },
  {
    id: "nav-notifications",
    target: '[data-tour="nav-notifications"]',
    placement: "right",
    title: "Catch up any time",
    body: "Browse system alerts and updates whenever you're ready.",
  },
  {
    id: "settings",
    target: '[data-tour="settings"]',
    placement: "right",
    title: "Tune NativeTalk",
    body: "Configure system preferences, integrations, and account-level settings.",
  },
  {
    id: "profile",
    target: '[data-tour="profile"]',
    placement: "top",
    title: "Your account",
    body: "View and manage your profile details, security, and system access.",
  },
];

export const ONBOARDING_STORAGE_KEY = "nativetalk_onboarding_v1";

export const ONBOARDING_STATUS = Object.freeze({
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  SKIPPED: "skipped",
});

export const ONBOARDING_PHASE = Object.freeze({
  IDLE: "idle",
  WELCOME: "welcome",
  TOUR: "tour",
  COMPLETION: "completion",
});
