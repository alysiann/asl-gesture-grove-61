
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Hand, Home, User } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Recognize', path: '/recognize', icon: <Hand className="w-5 h-5" /> },
    { name: 'Train', path: '/train', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <header className="fixed top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Hand className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-medium">ASL Gesture Grove</h1>
          </motion.div>
        </Link>
        
        <nav>
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={cn(
                    "px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
                    location.pathname === item.path 
                      ? "bg-primary text-white" 
                      : "hover:bg-secondary"
                  )}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.name}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
