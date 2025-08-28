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

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddressSame: true,
  });

  const [billingInfo, setBillingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  if (!user) {
    return (
      <div className="pt-20" data-testid="checkout-signin-required">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 opacity-50">🔒</div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to proceed with checkout.
          </p>
          <Link href="/cart">
            <Button className="btn-primary" data-testid="button-back-to-cart">
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20" data-testid="checkout-empty-cart">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 opacity-50">🛒</div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/products">
            <Button className="btn-primary" data-testid="button-shop-now">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tax = subtotal * 0.08;
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase. You will receive a confirmation email shortly.',
      });
      
      setLocation('/account?tab=orders');
    } catch (error) {
      toast({
        title: 'Order failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-primary' : step === 'payment' || step === 'review' ? 'text-green-500' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'shipping' ? 'border-primary bg-primary text-primary-foreground' : step === 'payment' || step === 'review' ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'}`}>
          {step === 'payment' || step === 'review' ? <Check className="w-4 h-4" /> : '1'}
        </div>
        <span className="font-medium">Shipping</span>
      </div>
      
      <div className={`w-8 h-0.5 ${step === 'payment' || step === 'review' ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
      
      <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary' : step === 'review' ? 'text-green-500' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : step === 'review' ? 'border-green-500 bg-green-500 text-white' : 'border-muted-foreground'}`}>
          {step === 'review' ? <Check className="w-4 h-4" /> : '2'}
        </div>
        <span className="font-medium">Payment</span>
      </div>
      
      <div className={`w-8 h-0.5 ${step === 'review' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
      
      <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 'review' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
          3
        </div>
        <span className="font-medium">Review</span>
      </div>
    </div>
  );

  return (
    <div className="pt-20" data-testid="page-checkout">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        data-testid="input-phone"
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Select 
                        value={shippingInfo.state} 
                        onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger data-testid="select-state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          {/* Add more states as needed */}
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>

                  <Button type="submit" className="btn-primary w-full" data-testid="button-continue-payment">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 'payment' && (
              <div className="glass-card p-8 rounded-2xl" data-testid="payment-form">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-serif font-bold">Payment Information</h2>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                      required
                      data-testid="input-name-on-card"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                      required
                      data-testid="input-card-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                        data-testid="input-expiry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                        required
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billingAddressSame"
                      checked={paymentInfo.billingAddressSame}
                      onCheckedChange={(checked) => setPaymentInfo(prev => ({ ...prev, billingAddressSame: checked as boolean }))}
                      data-testid="checkbox-billing-same"
                    />
                    <Label htmlFor="billingAddressSame">Billing address is the same as shipping address</Label>
                  </div>

                  {!paymentInfo.billingAddressSame && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-semibold">Billing Address</h3>
                      {/* Billing address form fields similar to shipping */}
                      <div>
                        <Label htmlFor="billingAddress">Billing Address *</Label>
                        <Input
                          id="billingAddress"
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
                          required={!paymentInfo.billingAddressSame}
                          data-testid="input-billing-address"
                        />
                      </div>
                      {/* Add more billing fields as needed */}
                    </div>
                  )}

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
                    <Button type="submit" className="btn-primary flex-1" data-testid="button-review-order">
                      Review Order
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 'review' && (
              <div className="glass-card p-8 rounded-2xl" data-testid="order-review">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-serif font-bold">Review Your Order</h2>
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

                {/* Payment Information */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                    <p>{paymentInfo.nameOnCard}</p>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit}>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('payment')}
                      className="flex-1"
                      data-testid="button-back-payment"
                    >
                      Back to Payment
                    </Button>
                    <Button 
                      type="submit" 
                      className="btn-primary flex-1"
                      disabled={isProcessing}
                      data-testid="button-place-order"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
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
