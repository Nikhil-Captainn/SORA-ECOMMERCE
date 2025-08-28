import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-20" data-testid="cart-signin-required">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 opacity-50">🔒</div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view and manage your shopping cart.
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

  if (items.length === 0) {
    return (
      <div className="pt-20" data-testid="cart-empty">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/products">
              <Button variant="ghost" size="icon" className="mr-4" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-foreground">Shopping Cart</h1>
          </div>

          {/* Empty State */}
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">🛒</div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover our premium gifts and add them to your cart
            </p>
            <Link href="/products">
              <Button className="btn-primary" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="pt-20" data-testid="page-cart">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/products">
              <Button variant="ghost" size="icon" className="mr-4" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground" data-testid="text-cart-items">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
            data-testid="button-clear-cart"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="glass-card p-6 rounded-2xl"
                data-testid={`cart-item-${item.productId}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`}>
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                      data-testid="img-cart-item"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2" data-testid="text-cart-item-name">
                            {item.product?.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.product?.description}
                        </p>
                        
                        {/* Tags */}
                        {item.product?.tags && item.product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive ml-4"
                        data-testid="button-remove-item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-semibold text-primary" data-testid="text-cart-item-price">
                          ${item.product?.price}
                        </span>
                        {item.product?.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8"
                          data-testid="button-decrease-quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="px-3 py-1 bg-background border rounded min-w-[2.5rem] text-center" data-testid="text-quantity">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8"
                          disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                          data-testid="button-increase-quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">Item total:</span>
                      <span className="font-semibold text-foreground" data-testid="text-item-total">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="text-center pt-6">
              <Link href="/products">
                <Button variant="outline" className="px-8" data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl sticky top-24" data-testid="order-summary">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items):</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>Shipping:</span>
                    {shipping === 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400">Free shipping!</span>
                    )}
                  </div>
                  <span data-testid="text-shipping">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Add ${(75 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="text-total">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/checkout">
                  <Button className="btn-primary w-full py-3 font-semibold" data-testid="button-checkout">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="text-center">
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full" data-testid="button-view-wishlist">
                      <Heart className="w-4 h-4 mr-2" />
                      View Wishlist
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
