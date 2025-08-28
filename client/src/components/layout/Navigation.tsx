import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/account', label: 'Account' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 nav-blur" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
              <div className="text-2xl animate-sparkle">✨</div>
              <div>
                <h1 className="text-xl font-serif font-bold text-primary">Sora</h1>
                <p className="text-xs text-muted-foreground -mt-1">Gift Store for All</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors duration-200 ${
                    location === item.href
                      ? 'text-primary font-semibold'
                      : 'text-foreground hover:text-primary'
                  }`}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search gifts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 backdrop-blur-sm border-border"
                    data-testid="input-search"
                  />
                </div>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground hover:text-primary"
                data-testid="button-search-mobile"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-foreground hover:text-secondary"
                  data-testid="button-wishlist"
                >
                  <Heart className="w-5 h-5 animate-heartbeat" />
                  {user && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="text-wishlist-count">
                      3
                    </span>
                  )}
                </Button>
              </Link>

              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative text-foreground hover:text-primary"
                data-testid="button-cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="text-cart-count">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-foreground hover:text-primary"
                data-testid="button-dark-mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* User Profile */}
              {user ? (
                <Link href="/account">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:text-primary"
                    data-testid="button-profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-6 h-6 rounded-full"
                        data-testid="img-avatar"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-foreground hover:text-primary"
                  data-testid="button-login"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-foreground hover:text-primary"
                data-testid="button-menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search gifts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-mobile"
                    />
                  </div>
                </form>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      location === item.href
                        ? 'text-primary bg-accent/10'
                        : 'text-foreground hover:text-primary hover:bg-accent/5'
                    }`}
                    data-testid={`link-mobile-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
