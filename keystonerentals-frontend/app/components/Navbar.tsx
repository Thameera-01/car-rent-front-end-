'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About us', href: '#aboutus' },
    { label: 'Features', href: '#features' },
    { label: 'Our Cars', href: '#ourcars' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 650);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div className="text-3xl font-bold text-red-600 flex items-center gap-2">
          Keystone<span className={isScrolled ? 'text-gray-800' : 'text-white'}>Rentals</span>
        </div>
        
        <ul className={`md:flex gap-8 items-center ${isMenuOpen ? 'block absolute top-16 left-0 w-full bg-white p-4 shadow-lg' : 'hidden'}`}>
          {navItems.map(({ label, href }) => {
            return (
              <li key={label} className="my-2 md:my-0">
                <a 
                  href={href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`font-medium transition hover:text-red-600 block ${isScrolled || isMenuOpen ? 'text-gray-800' : 'text-white'}`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="md:hidden cursor-pointer p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`w-6 h-0.5 mb-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
          <div className={`w-6 h-0.5 mb-1 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
          <div className={`w-6 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></div>
        </div>
      </nav>
    </header>
  );
}