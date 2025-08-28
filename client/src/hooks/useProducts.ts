import { useQuery } from '@tanstack/react-query';
import { Product, SearchFilters } from '@/types';

// Mock data for demonstration - in real app this would come from Firebase
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Luxury Chocolate Collection',
    description: 'Handcrafted Belgian chocolates in elegant packaging',
    price: 89.99,
    originalPrice: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'],
    categoryId: 'chocolates',
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 127,
    tags: ['Bestseller'],
    features: ['Belgian chocolate', 'Elegant packaging', 'Perfect for gifts'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Royal Rose Bouquet',
    description: 'Fresh roses with premium packaging and care card',
    price: 64.99,
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    images: ['https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'],
    categoryId: 'flowers',
    inStock: true,
    stockQuantity: 25,
    rating: 4.6,
    reviewCount: 89,
    tags: ['Premium'],
    features: ['Fresh flowers', 'Premium packaging', 'Care instructions'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Elegant Jewelry Set',
    description: 'Sterling silver necklace and earrings with personalization',
    price: 149.99,
    originalPrice: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'],
    categoryId: 'jewelry',
    inStock: true,
    stockQuantity: 15,
    rating: 4.9,
    reviewCount: 203,
    tags: ['Limited'],
    features: ['Sterling silver', 'Personalization available', 'Gift box included'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Luxury Spa Collection',
    description: 'Complete aromatherapy and wellness gift basket',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'],
    categoryId: 'spa',
    inStock: true,
    stockQuantity: 30,
    rating: 4.4,
    reviewCount: 45,
    tags: ['New'],
    features: ['Aromatherapy products', 'Wellness items', 'Beautiful basket'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export function useProducts(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];

      if (filters?.query) {
        const query = filters.query.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (filters?.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.categoryId === filters.category
        );
      }

      if (filters?.priceRange && filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          filteredProducts = filteredProducts.filter(product =>
            product.price >= min && product.price <= max
          );
        } else {
          filteredProducts = filteredProducts.filter(product =>
            product.price >= min
          );
        }
      }

      if (filters?.availability && filters.availability !== 'all') {
        switch (filters.availability) {
          case 'in-stock':
            filteredProducts = filteredProducts.filter(product => product.inStock);
            break;
          case 'low-stock':
            filteredProducts = filteredProducts.filter(product => 
              product.inStock && product.stockQuantity <= 10
            );
            break;
        }
      }

      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            filteredProducts.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          default:
            // 'popular' or default
            filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
        }
      }

      return filteredProducts;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    },
  });
}
