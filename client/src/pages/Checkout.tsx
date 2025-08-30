// D:\Gift Shop E-Commerce\SoraGold\SoraGold\client\src\pages\Checkout.tsx

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet'; // New import for page title

// You will need to install this package
import axios from 'axios';

// Declare a global type for the Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'review'>('shipping');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', // Changed to India for Razorpay currency
  });

  // Your Razorpay key ID
  const RAZORPAY_KEY_ID = 'rzp_live_RBb0XWBixI5BZR';

  const tax = subtotal * 0.08;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  // Function to load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load. Are you online?"));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user || !user.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with the payment.",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      await loadRazorpayScript();
      
      // Call your backend API to create a new order
      const orderResponse = await axios.post('/api/payment/create-order', {
        amount: Math.round(total * 100), // Convert to paise for Razorpay
      });

      if (!orderResponse.data || !orderResponse.data.id) {
        toast({
          title: "Payment Error",
          description: "Failed to create payment order on the server.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Sora Gift Store",
        description: "Purchase from Sora Gold",
        order_id: orderResponse.data.id,
        handler: async function (response: any) {
          // This function is called when the payment is successful
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          
          clearCart();
          setLocation('/account?tab=orders');
        },
        prefill: {
          name: shippingInfo.firstName + ' ' + shippingInfo.lastName,
          email: shippingInfo.email || user.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: "hsl(var(--primary))"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment failed", error);
      toast({
        title: "Payment Failed",
        description: "An error occurred during the payment process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-primary' : step === 'review' ? 'text-green-500' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'shipping' ? 'border-primary bg-primary text-primary-foreground' : step === 'review' ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'}`}>
          {step === 'review' ? <Check className="w-4 h-4" /> : '1'}
        </div>
        <span className="font-medium">Shipping</span>
      </div>
      
      <div className={`w-8 h-0.5 ${step === 'review' ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
      
      <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'review' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
          2
        </div>
        <span className="font-medium">Review & Payment</span>
      </div>
    </div>
  );

  return (
    <div className="pt-20" data-testid="page-checkout">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Helmet>
            <title>Checkout | Sora Gift Store</title>
        </Helmet>
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="mr-4" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-foreground">Checkout</h1>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="glass-card p-8 rounded-2xl" data-testid="shipping-form">
                <div className="flex items-center mb-6">
                  <Truck className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-serif font-bold">Shipping Information</h2>
                </div>
                
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      required
                      data-testid="input-address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        required
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        required
                        data-testid="input-state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        required
                        data-testid="input-zip"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                        required
                        data-testid="input-country"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="btn-primary w-full" data-testid="button-continue-payment">
                    Continue to Review
                  </Button>
                </form>
              </div>
            )}

            {step === 'review' && (
              <div className="glass-card p-8 rounded-2xl" data-testid="order-review">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-serif font-bold">Review Your Order & Payment</h2>
                </div>
                <div className="flex items-center space-x-2 my-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg">Payment Method: Razorpay</h3>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Order Items</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Information */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Shipping Information</h3>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('shipping')}
                    className="flex-1"
                    data-testid="button-back-shipping"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="btn-primary flex-1"
                    disabled={isProcessing}
                    data-testid="button-place-order"
                  >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24" data-testid="order-summary">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1 truncate">{item.product?.name} × {item.quantity}</span>
                    <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span data-testid="text-shipping">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-green-500" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}