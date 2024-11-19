export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    dashboard: '/dashboard',
    account: '/dashboard/account',
    employ: '/dashboard/employ',
    branding: '/dashboard/branding',
    settings: '/dashboard/settings',
    invoice : '/dashboard/invoice',
    client : '/dashboard/clients',
    biometric : '/dashboard/biometric',

  },
  errors: { notFound: '/errors/not-found' },
} as const;
