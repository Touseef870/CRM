// import type { NavItemConfig } from '@/types/nav';
// import { paths } from '@/paths';

// const adminLoginData: string | null = localStorage.getItem('AdminloginData');
// console.log(JSON.parse(adminLoginData!).type);

// export const navItems = [
//   { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'chart-pie' },
//   { key: 'employ', title: 'Employee', href: paths.dashboard.employ, icon: 'users' },
//   { key: 'client', title: 'Client', href: paths.dashboard.client , icon: 'user' },
//   { key: 'invoice', title: 'Invoice', href: paths.dashboard.invoice, icon: 'user' },
//   { key: 'branding', title: 'Branding', href: paths.dashboard.branding, icon: 'plugs-connected' },
//   { key: 'biometric', title: 'Employee Biometric', href: paths.dashboard.biometric, icon: 'file' }, 



// ] satisfies NavItemConfig[];

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

const adminLoginData: string | null = localStorage.getItem('AdminloginData');
const userType = adminLoginData ? JSON.parse(adminLoginData).type : null;

const allNavItems: NavItemConfig[] = [
  { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.dashboard, icon: 'chart-pie' },
  { key: 'subadmin', title: 'Sub Admin', href: paths.dashboard.subadmin, icon: 'user' }, 

  { key: 'employ', title: 'Employee', href: paths.dashboard.employ, icon: 'users' },
  { key: 'client', title: 'Client', href: paths.dashboard.client, icon: 'user' },
  { key: 'invoice', title: 'Invoice', href: paths.dashboard.invoice, icon: 'user' },
  { key: 'branding', title: 'Branding', href: paths.dashboard.branding, icon: 'plugs-connected' },
  { key: 'biometric', title: 'Employee Biometric', href: paths.dashboard.biometric, icon: 'file' },
];


export const navItems = (userType === 'employee')
  ? allNavItems.filter(item => item.key !== 'biometric' && item.key !== 'employ')
  : allNavItems;
