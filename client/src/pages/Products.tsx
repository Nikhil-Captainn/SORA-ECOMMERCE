import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Grid, List, Filter } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchFilters } from '@/types';

export default function Products() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters: SearchFilters = {};
    
    if (urlParams.get('search')) {
      newFilters.query = urlParams.get('search') || '';
    }
    if (urlParams.get('category')) {
      newFilters.category = urlParams.get('category') || '';
    }
    
    setFilters(newFilters);
  }, [location]);

  const { data: products, isLoading } = useProducts(filters);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="pt-20" data-testid="page-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our complete collection of premium gifts
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="glass-card p-6 rounded-2xl mb-8" data-testid="search-filters">
          {/* Search Bar */}
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
              Search Products
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search for gifts, occasions, or categories..."
              value={filters.query || ''}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="w-full"
              data-testid="input-search"
            />
          </div>

          {/* Filter Toggle Button - Mobile */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>

          {/* Filter Controls */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Category</Label>
              <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="birthday">Birthday Gifts</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="festivals">Festivals</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="flowers">Flowers</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="chocolates">Chocolates</SelectItem>
                  <SelectItem value="spa">Spa & Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Price Range</Label>
              <Select value={filters.priceRange || 'all'} onValueChange={(value) => updateFilter('priceRange', value === 'all' ? '' : value)}>
                <SelectTrigger data-testid="select-price">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-500">$200 - $500</SelectItem>
                  <SelectItem value="500">Over $500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Sort By</Label>
              <Select value={filters.sortBy || 'popular'} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Most Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Availability</Label>
              <Select value={filters.availability || 'all'} onValueChange={(value) => updateFilter('availability', value === 'all' ? '' : value)}>
                <SelectTrigger data-testid="select-availability">
                  <SelectValue placeholder="All Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in-stock">In Stock Only</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center gap-1" data-testid="filter-query">
                  Search: "{filters.query}"
                  <button onClick={() => updateFilter('query', '')} className="ml-1 hover:bg-destructive/20 rounded-full">×</button>
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1" data-testid="filter-category">
                  Category: {filters.category}
                  <button onClick={() => updateFilter('category', '')} className="ml-1 hover:bg-destructive/20 rounded-full">×</button>
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1" data-testid="filter-price-range">
                  Price: ${filters.priceRange}
                  <button onClick={() => updateFilter('priceRange', '')} className="ml-1 hover:bg-destructive/20 rounded-full">×</button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-clear-filters"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Search Results 
              <span className="text-muted-foreground ml-2" data-testid="text-results-count">
                ({products?.length || 0} items found)
              </span>
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              data-testid="button-grid-view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              data-testid="button-list-view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-shimmer" data-testid="product-skeleton">
                <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`} data-testid="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" data-testid="no-results">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse our categories
            </p>
            <Button onClick={clearFilters} className="btn-primary" data-testid="button-clear-search">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
