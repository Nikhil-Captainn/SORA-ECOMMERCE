export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  images: string[];
  categoryId?: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  firebaseUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  user?: User;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface SearchFilters {
  category?: string;
  priceRange?: string;
  sortBy?: string;
  availability?: string;
  query?: string;
}
