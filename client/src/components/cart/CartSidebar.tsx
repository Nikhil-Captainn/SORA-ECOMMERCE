import React from 'react';
import { Link } from 'wouter';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    totalItems, 
    subtotal 
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
        data-testid="cart-backdrop"
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border transform transition-transform duration-300 z-50 shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} data-testid="cart-sidebar">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-foreground flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shopping Cart
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-close-cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {totalItems > 0 && (
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-cart-items">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
        
        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-6xl mb-4 opacity-50">🛒</div>
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-empty-cart">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Discover our premium gifts and add them to your cart
            </p>
            <Link href="/products">
              <Button 
                onClick={() => setIsOpen(false)}
                className="btn-primary"
                data-testid="button-shop-now"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 glass-card p-4 rounded-lg" data-testid={`cart-item-${item.productId}`}>
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    data-testid="img-cart-item"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate" data-testid="text-cart-item-name">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm text-primary font-semibold" data-testid="text-cart-item-price">
                      ${item.product?.price}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8"
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 py-1 bg-background rounded min-w-[2rem] text-center" data-testid="text-quantity">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8"
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive"
                    data-testid="button-remove-item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 bg-card">
              <div className="space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal:</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-foreground font-semibold text-lg">
                  <span>Total:</span>
                  <span data-testid="text-total">${subtotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <Button 
                    className="btn-primary w-full py-3 font-semibold"
                    onClick={() => setIsOpen(false)}
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    data-testid="button-view-cart"
                  >
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
