import React from 'react';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-2xl animate-sparkle">✨</div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary">Sora</h1>
                <p className="text-sm text-muted-foreground -mt-1">Gift Store for All</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Creating magical moments through premium gifts that celebrate life's special occasions. 
              Handcrafted with love, delivered with care.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors duration-200"
                data-testid="link-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors duration-200"
                data-testid="link-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors duration-200"
                data-testid="link-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/gift-cards', label: 'Gift Cards' },
                { href: '/bulk-orders', label: 'Bulk Orders' },
                { href: '/track-order', label: 'Track Order' },
                { href: '/returns', label: 'Return Policy' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-serif font-bold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                { href: '/help', label: 'Help Center' },
                { href: '/shipping', label: 'Shipping Info' },
                { href: '/size-guide', label: 'Size Guide' },
                { href: '/care', label: 'Care Instructions' },
                { href: '/faq', label: 'FAQs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <p className="text-muted-foreground text-sm flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  <span data-testid="text-phone">+1 (555) 123-4567</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  <span data-testid="text-email">hello@soragifts.com</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0" data-testid="text-copyright">
            © {currentYear} Sora Gift Store. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/cookies', label: 'Cookie Policy' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
                data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
