import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'chart-pie' },
  { key: 'employ', title: 'Employ', href: paths.dashboard.employ, icon: 'users' },
  { key: 'invoice', title: 'Invoice', href: paths.dashboard.invoice, icon: 'user' },
  { key: 'branding', title: 'Branding', href: paths.dashboard.branding, icon: 'plugs-connected' },
  { key: 'biometric', title: 'Employee Biometric', href: paths.dashboard.biometric, icon: 'file' }, 
  { key: 'subadmin', title: 'Subadmin', href: paths.dashboard.subadmin, icon: 'user' }, 



 
] satisfies NavItemConfig[];
