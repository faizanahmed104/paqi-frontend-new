interface NavItem {
  name: string;
  href?: string;
  hasDropdown?: boolean;
  children?: { name: string; href: string }[];
}

export const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Insights',
    href: '/insights',
  },
  { name: 'About us', href: '/about-us' },
  { name: 'Contact us', href: '/contact-us' },
  { name: 'Map', href: '/map' },
];
