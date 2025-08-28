import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { User, Heart, Package, Settings, LogOut, Edit, Moon, Sun, Star, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function Account() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Parse URL hash for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'orders', 'wishlist', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Mock data - in real app this would come from Firebase
  const mockOrders: Order[] = [
    {
      id: '12034',
      date: '2024-01-15',
      status: 'delivered',
      total: 189.97,
      items: [
        {
          id: '1',
          name: 'Luxury Chocolate Collection',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
          quantity: 2,
          price: 89.99,
        },
        {
          id: '2',
          name: 'Royal Rose Bouquet',
          image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=100&h=100&fit=crop',
          quantity: 1,
          price: 64.99,
        },
      ],
    },
    {
      id: '11987',
      date: '2024-01-10',
      status: 'shipped',
      total: 124.98,
      items: [
        {
          id: '3',
          name: 'Elegant Jewelry Set',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop',
          quantity: 1,
          price: 149.99,
        },
      ],
    },
  ];

  const mockWishlist: WishlistItem[] = [
    {
      id: '2',
      name: 'Royal Rose Bouquet',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=100&h=100&fit=crop',
      inStock: true,
    },
    {
      id: '4',
      name: 'Luxury Spa Collection',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100&h=100&fit=crop',
      inStock: true,
    },
  ];

  if (!user) {
    return (
      <div className="pt-20" data-testid="account-signin-required">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 opacity-50">🔒</div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to access your account.
          </p>
          <Link href="/">
            <Button className="btn-primary" data-testid="button-back-to-home">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500 text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'processing':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="pt-20" data-testid="page-account">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-destructive hover:text-destructive"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2" data-testid="tab-orders">
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2" data-testid="tab-wishlist">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2" data-testid="tab-settings">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="glass-card p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl text-primary-foreground mb-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-24 h-24 rounded-full object-cover"
                        data-testid="img-user-avatar"
                      />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground" data-testid="text-user-name">
                    {user.displayName || 'User'}
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-user-email">{user.email}</p>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-total-orders">
                      {mockOrders.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary" data-testid="text-wishlist-items">
                      {mockWishlist.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Wishlist Items</div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="w-full"
                  data-testid="button-edit-profile"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-bold mb-6">Profile Information</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-display-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-zip"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleProfileSave}
                        className="btn-primary flex-1"
                        data-testid="button-save-profile"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-serif font-bold mb-6">Order History</h3>
              
              {mockOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📦</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No orders yet</h4>
                  <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                  <Link href="/products">
                    <Button className="btn-primary" data-testid="button-start-shopping">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-6" data-testid={`order-${order.id}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">Order #{order.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)} data-testid="badge-order-status">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="text-lg font-semibold text-foreground mt-1" data-testid="text-order-total">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              data-testid="img-order-item"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground" data-testid="text-item-name">
                                {item.name}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} • ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm" data-testid="button-view-order">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm" data-testid="button-reorder">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-serif font-bold mb-6">Your Wishlist</h3>
              
              {mockWishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">💖</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No items in wishlist</h4>
                  <p className="text-muted-foreground mb-6">Save items you love to buy them later</p>
                  <Link href="/products">
                    <Button className="btn-primary" data-testid="button-browse-products">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockWishlist.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4" data-testid={`wishlist-item-${item.id}`}>
                      <Link href={`/products/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-lg mb-4 hover:scale-105 transition-transform duration-200"
                          data-testid="img-wishlist-item"
                        />
                      </Link>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground line-clamp-2" data-testid="text-wishlist-item-name">
                            {item.name}
                          </h4>
                          <p className="text-primary font-semibold" data-testid="text-wishlist-item-price">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            className="btn-primary flex-1"
                            disabled={!item.inStock}
                            data-testid="button-add-to-cart-wishlist"
                          >
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            data-testid="button-remove-wishlist"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-xl font-serif font-bold mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <h4 className="font-semibold">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                    data-testid="button-toggle-dark-mode"
                  >
                    {isDarkMode ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your orders and promotions
                    </p>
                  </div>
                  <Button variant="outline" data-testid="button-email-settings">
                    Manage
                  </Button>
                </div>

                {/* Privacy Settings */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Control how your data is used and shared
                    </p>
                  </div>
                  <Button variant="outline" data-testid="button-privacy-settings">
                    Configure
                  </Button>
                </div>

                {/* Change Password */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Change Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your account password for security
                    </p>
                  </div>
                  <Button variant="outline" data-testid="button-change-password">
                    Change
                  </Button>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                  <div>
                    <h4 className="font-semibold text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" data-testid="button-delete-account">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
