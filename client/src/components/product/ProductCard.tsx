import React from 'react';
import { Link } from 'wouter';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView, onToggleWishlist }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-current text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-current text-primary opacity-50" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-muted-foreground" />);
    }

    return stars;
  };

  const getBadgeColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'bestseller':
        return 'bg-secondary text-secondary-foreground';
      case 'premium':
        return 'bg-primary text-primary-foreground';
      case 'limited':
        return 'bg-accent text-accent-foreground';
      case 'new':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="glass-card product-card rounded-2xl overflow-hidden group cursor-pointer" data-testid={`card-product-${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image w-full h-64 object-cover"
            data-testid="img-product"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleQuickView}
              className="glass-card text-white hover:bg-white/20"
              data-testid="button-quick-view"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleToggleWishlist}
              className="glass-card text-white hover:bg-white/20 animate-heartbeat"
              data-testid="button-wishlist"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Badge */}
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-4 left-4">
              <Badge 
                className={getBadgeColor(product.tags[0])}
                data-testid="badge-product-tag"
              >
                {product.tags[0]}
              </Badge>
            </div>
          )}

          {/* Stock indicator */}
          {!product.inStock && (
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" data-testid="badge-out-of-stock">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2" data-testid="text-product-name">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2" data-testid="text-product-description">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3" data-testid="rating-product">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-muted-foreground text-xs ml-2" data-testid="text-review-count">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-foreground">
              <span data-testid="text-price">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through ml-2" data-testid="text-original-price">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary px-4 py-2 text-sm font-semibold"
              data-testid="button-add-to-cart"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
