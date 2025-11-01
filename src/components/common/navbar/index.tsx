'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navItems } from './constant';

function Navbar({ variant = 'default' }: { variant?: 'default' | 'white' }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (variant === 'white') return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  const useBlackText = variant === 'white' || isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        variant === 'white'
          ? 'bg-white'
          : isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
      }`}
    >
      <div className="relative w-full mx-auto px-4 sm:px-4 lg:px-8 xl:max-w-7xl xl:mx-auto">
        {/* Border container that maintains responsive margins */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-center">
          <div
            className={`${
              variant === 'white' || isScrolled
                ? 'w-full border-b border-transparent'
                : 'w-[92%] sm:w-[93%] md:w-[94%] lg:w-[95%] xl:w-[96%] border-b border-white/50'
            }`}
          ></div>
        </div>
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 transition-all duration-500">
            <div className="flex space-x-0.5 sm:space-x-1">
              <Image
                src="/assets/images/logo.png"
                alt="PAQI"
                width={40}
                height={40}
                className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] lg:w-[60px] lg:h-[60px] transition-all duration-500"
                style={{
                  filter: useBlackText ? 'invert(100%)' : '',
                }}
              />
            </div>
            <h2
              className={`text-[14px] sm:text-sm lg:text-l font-semibold tracking-wide transition-all duration-500 leading-tight ${
                useBlackText ? 'text-black' : 'text-white'
              }`}
            >
              <Link href="/" className="inline-block">
                <span>
                  <span className="block">Pakistan</span>
                  <span className="block">Air Quality</span>
                  <span className="block">Initiative</span>
                </span>
              </Link>
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-6 xl:space-x-8">
              {navItems?.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    href={item.href ?? '#'}
                    className={`text-sm font-medium transition-all duration-500 flex items-center space-x-1 whitespace-nowrap
                      ${
                        useBlackText
                          ? 'text-black hover:text-gray-600'
                          : 'text-white hover:text-gray-300'
                      }
                      ${pathname === item.href ? 'text-green-600' : ''}
                    `}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          useBlackText ? 'text-black' : 'text-white'
                        } group-hover:rotate-180`}
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-transparent ${
                        useBlackText
                          ? 'backdrop-blur-md bg-white/95'
                          : 'backdrop-blur-md bg-black/90'
                      }`}
                    >
                      <ul className="py-2">
                        {item.children.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={sub.href}
                              className={`block px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 ${useBlackText ? 'text-black hover:bg-[#123524]/[.1] hover:text-black' : 'text-gray-200 hover:bg-white/10'} `}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-1 sm:p-2 ${
              useBlackText
                ? 'text-black hover:text-gray-600'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } ${useBlackText ? 'bg-white/95' : 'bg-black/50'} backdrop-blur-md`}
      >
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item, index) => (
            <div key={index}>
              <div
                className={`w-full flex items-center justify-between px-3 py-3 text-left text-base font-medium rounded-md transition-colors cursor-pointer
                  ${
                    pathname === item.href
                      ? 'text-green-600'
                      : useBlackText
                        ? 'text-black hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                  }`}
              >
                <Link
                  href={item.href ?? '#'}
                  className="flex-1"
                  onClick={() => {
                    if (!item.hasDropdown) {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.name ? null : item.name
                      )
                    }
                    className="ml-2"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Mobile Dropdown */}
              {item.hasDropdown && item.children && (
                <div
                  className={`pl-6 transition-all duration-500 overflow-hidden ${
                    openDropdown === item.name
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.children.map((child, idx) => (
                    <Link
                      key={idx}
                      href={child.href}
                      className={`block px-3 py-2 text-sm transition-colors
                        ${
                          pathname === child.href
                            ? 'text-green-600'
                            : useBlackText
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'text-gray-200 hover:bg-white/10'
                        }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
