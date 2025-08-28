import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, Heart, Star, ShoppingBag, Minus, Plus, Share2, Shield, Truck, RotateCcw } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (isLoading) {
    return (
      <div className="pt-20" data-testid="loading-product">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-full h-96 bg-muted rounded-lg animate-shimmer"></div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-20 bg-muted rounded-lg animate-shimmer"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-shimmer"></div>
              <div className="h-6 bg-muted rounded w-3/4 animate-shimmer"></div>
              <div className="h-12 bg-muted rounded animate-shimmer"></div>
              <div className="h-32 bg-muted rounded animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20" data-testid="product-not-found">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="btn-primary" data-testid="button-back-to-products">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    addItem(product, quantity);
    toast({
      title: 'Added to cart!',
      description: `${quantity} ${product.name} added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-current text-primary opacity-50" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }

    return stars;
  };

  const images = product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="pt-20" data-testid="page-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl glass-card">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover"
                data-testid="img-product-main"
              />
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground" data-testid="badge-product-tag">
                    {product.tags[0]}
                  </Badge>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" data-testid="badge-out-of-stock">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-full h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4" data-testid="rating-product">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-foreground" data-testid="text-price">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through" data-testid="text-original-price">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-secondary font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.inStock 
                  ? `In Stock (${product.stockQuantity} available)` 
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 bg-background border rounded min-w-[3rem] text-center" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    disabled={!product.inStock}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn-primary flex-1"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={`px-4 ${isWishlisted ? 'text-secondary border-secondary' : ''}`}
                  data-testid="button-wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-xs font-semibold">Secure Payment</div>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-xs font-semibold">Free Shipping</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-xs font-semibold">Easy Returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-bold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Features & Benefits:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-serif font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Product ID:</span>
                        <span className="text-muted-foreground">{product.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Category:</span>
                        <span className="text-muted-foreground capitalize">{product.categoryId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Stock Quantity:</span>
                        <span className="text-muted-foreground">{product.stockQuantity}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Rating:</span>
                        <span className="text-muted-foreground">{product.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Reviews:</span>
                        <span className="text-muted-foreground">{product.reviewCount}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="font-medium">Tags:</span>
                        <span className="text-muted-foreground">{product.tags.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-lg font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4 opacity-50">💬</div>
                  <p>Reviews are coming soon! Be the first to review this product.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
