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
    href: '#',
    hasDropdown: true,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Data', href: '#' },
    ],
  },
  { name: 'Map', href: '/map' },
  {
    name: 'Insights',
    href: '/insights',
  },
  { name: 'About us', href: '/about-us' },
  { name: 'Contact us', href: '/contact-us' },
];
