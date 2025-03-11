
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Hand className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ASL Recognizer</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {[
            { path: '/', label: 'Home' },
            { path: '/recognize', label: 'Recognize' },
            { path: '/train', label: 'Train' }
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative ${
                location.pathname === link.path
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
