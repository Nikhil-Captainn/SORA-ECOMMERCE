// D:\Gift Shop E-Commerce\SoraGold\SoraGold\client\src\components\layout\Footer.tsx
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Globe, ShieldCheck, LifeBuoy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { firestoreService } from '@/lib/firebase';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect non-existent pages to the homepage
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // Only redirect if the link is not already pointing to an existing major section
    if (href !== '/' && href !== '/products' && href !== '/contact' && href !== '/about' && href !== '/terms' && href !== '/privacy' && href !== '/faqs') {
      e.preventDefault();
      // For demonstration, we'll just redirect to home
      window.location.href = '/';
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      await firestoreService.addSubscriber(email);
      toast({
        title: "Subscribed Successfully!",
        description: "You've been added to our newsletter list.",
      });
      setEmail(''); // Clear the input field
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const policyInfoLinks = [
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' }, // Added Terms of Use
    { href: '/disclaimer', label: 'Disclaimer' },
  ];

  const aboutCompanyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Sora Team' }, // Renamed to Sora Team
    { href: '/careers', label: 'Careers' },
    { href: '/testimonials', label: 'Testimonials' }, // Added Testimonials
    { href: '/news', label: 'News Room' }, // Added News Room
    { href: '/blog', label: 'Blog' },
  ];

  const soraBusinessLinks = [ // Adapted from FNP Business
    { href: '/decoration-services', label: 'Decoration Services' },
    { href: '/corporate-service', label: 'Corporate Service' },
    { href: '/affiliate-program', label: 'Affiliate Program' },
    { href: '/retail-stores', label: 'Retail Stores' },
    { href: '/franchise', label: 'Franchise' },
  ];

  const needHelpLinks = [
    { href: '/contact', label: 'Contact Us' },
    { href: '/faqs', label: 'FAQs' },
  ];

  const internationalPresenceLinks = [ // For future expansion, redirects to home for now
    { href: '/', label: 'Sketch and Photo Frame' },
    { href: '/', label: 'Expenssive Gift Mug' },
    { href: '/', label: 'Mirror Led Photo Frame' },
    { href: '/', label: 'Spotify Song Code Keychain With Your Photo' },
  ];

  return (
    <footer className="bg-card border-t border-border text-foreground" data-testid="footer">
      {/* Top Banner Section */}
      <div className="bg-background border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Globe className="w-6 h-6 text-primary mb-2" />
            <span className="font-semibold text-sm md:text-base">Worldwide Delivery</span>
            <span className="text-xs text-muted-foreground">We deliver gifts to over 70 countries</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-primary mb-2" />
            <span className="font-semibold text-sm md:text-base">100% Safe & Secure Payments</span>
            <span className="text-xs text-muted-foreground">Pay using secure payment methods</span>
          </div>
          <div className="flex flex-col items-center">
            <LifeBuoy className="w-6 h-6 text-primary mb-2" />
            <span className="font-semibold text-sm md:text-base">Dedicated Help Center</span>
            <span className="text-xs text-muted-foreground">Chat With Us</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Policy Info Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Policy Info</h3>
            <ul className="space-y-2">
              {policyInfoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a onClick={(e) => handleLinkClick(e, link.href)} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Company Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">About Company</h3>
            <ul className="space-y-2">
              {aboutCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a onClick={(e) => handleLinkClick(e, link.href)} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sora Business Column (adapted from FNP Business) */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Sora Business</h3>
            <ul className="space-y-2">
              {soraBusinessLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a onClick={(e) => handleLinkClick(e, link.href)} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Need Help? Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Need Help?</h3>
            <ul className="space-y-2">
              {needHelpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a onClick={(e) => handleLinkClick(e, link.href)} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* International Presence Column */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Personliase Gift</h3>
            <ul className="space-y-2">
              {internationalPresenceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a onClick={(e) => handleLinkClick(e, link.href)} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Now Column */}
          <div className="md:col-span-1">
            <h3 className="font-serif font-bold text-lg mb-4">Subscribe Now</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get updates on promotions and offers coupons.
            </p>
            <form onSubmit={handleSubscribe} className="flex w-full items-center">
              <Input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="rounded-r-none border-r-0"
                data-testid="input-newsletter-email" 
              />
              <Button type="submit" className="rounded-l-none" disabled={loading} data-testid="button-subscribe">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Contact Info & Copyright */}
        <div className="border-t border-border pt-8 mt-8 text-sm">
          <div className="text-center text-muted-foreground mb-4">
            <p className="font-bold text-foreground">Sora Gift Store | Regd. Office: 52-A, Main Highway 55, Cotton Market, Fetri, Nagpur, Maharashtra, India</p>
            <p className="mt-1">Telephone No.: +91 8055967807 | E-mail: support@soragold.com</p>
            <p className="mt-1">Founder: Nikhil Rathod</p>
             <Link href="/csr">
                <a onClick={(e) => handleLinkClick(e, '/csr')} className="text-primary hover:underline mt-2 inline-block">
                    Corporate Social Responsibility (CSR) Policy
                </a>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-4">
            {/* Social Icons - Bottom Left */}
            <div className="flex space-x-4 mb-4 md:mb-0 order-2 md:order-1">
                <a href="https://www.instagram.com/suprisesnrosesindia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/suprisesnrosesindia" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <Twitter className="w-4 h-4" />
                </a>
            </div>

            {/* Copyright - Centered */}
            <p className="text-muted-foreground text-center order-1 md:order-2 mb-4 md:mb-0">
              © 1994-{currentYear} SoraGold.com. All rights reserved.
            </p>

            {/* Payment Icons - Bottom Right (Placeholder) */}
            <div className="flex items-center space-x-2 order-3 md:order-3">
              {/* You can add actual payment method images here */}
              <span className="text-muted-foreground text-xs">Payment Methods: VISA, UPI, MC, AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}