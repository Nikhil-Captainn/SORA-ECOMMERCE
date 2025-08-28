# Sora Gift Store - Replit Guide

## Overview

Sora Gift Store is a premium e-commerce web application for magical gift experiences. Built with modern web technologies, it features a sophisticated React frontend with a Node.js/Express backend, designed for selling luxury gifts across various categories like birthdays, anniversaries, festivals, and corporate gifting. The application emphasizes premium aesthetics with golden/burgundy theming, smooth animations, and a comprehensive shopping experience including cart management, user authentication, and checkout processes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using golden (#FFD700), burgundy (#AC1C1C), and cream (#F5EBDD) color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interface elements
- **State Management**: React Context API for global state (Auth, Cart, Theme) with React Query for server state management
- **Typography**: Playfair Display for headings (premium serif) and Montserrat for body text (clean sans-serif)

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **API Design**: RESTful API structure with `/api` prefix routing
- **Development**: Vite for fast development and hot module replacement
- **Build System**: ESBuild for production builds with platform-specific optimizations
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Local Storage**: Browser localStorage for cart persistence and user preferences

### Authentication and Authorization
- **Primary Auth**: Firebase Authentication for secure user management
- **Auth Methods**: Email/password authentication and Google OAuth integration
- **Session Handling**: Firebase auth state management with persistent sessions
- **User Data**: Hybrid approach combining Firebase user data with local PostgreSQL user profiles

### Design System and Theming
- **Dark Mode**: Complete dark/light theme system with CSS custom properties
- **Animations**: Custom sparkle and confetti background animations that work in both themes
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Component Variants**: Class Variance Authority (CVA) for consistent component styling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client for database connections
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect support
- **@tanstack/react-query**: Server state management and caching
- **firebase/auth**: Authentication services and Google OAuth provider

### UI and Styling
- **@radix-ui/***: Comprehensive collection of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional className utility

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for server development
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **drizzle-zod**: Schema validation integration

### Additional Features
- **date-fns**: Date manipulation utilities
- **embla-carousel-react**: Carousel/slider components
- **cmdk**: Command palette functionality