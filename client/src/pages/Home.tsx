import React from 'react';
import { Link } from 'wouter';
import { Gift, Users, Globe, Star } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { SparkleBackground } from '@/components/animations/SparkleBackground';
import { ConfettiBackground } from '@/components/animations/ConfettiBackground';

export default function Home() {
  const { data: featuredProducts, isLoading } = useProducts();

  const categories = [
    {
      id: 'birthday',
      name: 'Birthday Gifts',
      description: 'Celebrate special moments',
      icon: '🎂',
      productCount: '120+ items',
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      description: 'Love & Romance',
      icon: '💝',
      productCount: '85+ items',
    },
    {
      id: 'festivals',
      name: 'Festivals',
      description: 'Traditional celebrations',
      icon: '🌸',
      productCount: '200+ items',
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional gifting',
      icon: '💼',
      productCount: '75+ items',
    },
  ];

  const stats = [
    { icon: Gift, value: '500+', label: 'Unique Gifts' },
    { icon: Users, value: '10K+', label: 'Happy Customers' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: Star, value: '4.9★', label: 'Average Rating' },
  ];

  return (
    <div className="relative" data-testid="page-home">
      <SparkleBackground />
      <ConfettiBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient pt-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="animate-float inline-block mb-6">
              <div className="text-6xl mb-4">🎁</div>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 animate-shimmer">
              Magical Gifts for<br/>
              <span className="text-primary">Every Celebration</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover premium, handcrafted gifts that create unforgettable moments and spread joy to your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <Button className="btn-primary px-8 py-4 text-lg font-semibold" data-testid="button-explore-collection">
                  Explore Collection
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                className="glass-card px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200"
                data-testid="button-gift-finder"
              >
                Gift Finder
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="glass-card p-6 rounded-xl animate-float" 
                style={{ animationDelay: `${(index + 1) * 0.5}s` }}
                data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-muted/30" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">Find the perfect gift for every occasion</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <div className="glass-card product-card p-6 rounded-2xl text-center group cursor-pointer" data-testid={`category-${category.id}`}>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <div className="text-primary font-semibold group-hover:underline">
                    {category.productCount}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Handpicked premium gifts that create magical moments</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-shimmer" data-testid="product-skeleton">
                  <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button 
                variant="outline" 
                className="glass-card px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200"
                data-testid="button-view-all-products"
              >
                View All Products →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
