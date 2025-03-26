
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Image, 
  Star, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';

const AdminNav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Settings },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Contacts', path: '/admin/contacts', icon: MessageSquare },
    { name: 'Logos', path: '/admin/logos', icon: Image },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="block lg:hidden absolute top-4 right-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-full bg-white shadow-md"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-white h-screen shadow-soft fixed left-0 top-0 overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all-smooth ${
                      isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-all-smooth"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-40 shadow-xl transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
        
        <nav className="py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all-smooth ${
                      isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-all-smooth"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNav;
