interface NavItem {
  name: string;
  href?: string;
  hasDropdown?: boolean;
  children?: { name: string; href: string }[];
}

export const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Dashboard',
    href: '/dashboard',
    hasDropdown: true,
    children: [
      { name: 'Overview', href: '/dashboard/overview' },
      { name: 'Data', href: '/dashboard/data' },
    ],
  },
  { name: 'Map', href: '/map' },
  {
    name: 'Insights',
    hasDropdown: false,
  },
  { name: 'About us', href: '/about-us' },
  { name: 'Contact us', href: '/contact-us' },
];
