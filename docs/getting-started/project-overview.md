# 🚀 Project Overview

## 📋 Description

**Agent AI Market** is an AI agents marketplace built on modern technology stack
with focus on performance, SEO and user experience.

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - typed JavaScript
- **Tailwind CSS 4+** - utility CSS framework
- **TanStack Query** - state management and caching
- **Zustand** - lightweight state management

### Backend Integration

- **REST API** - for server interaction
- **Axios** - HTTP client
- **JWT** - authentication

### SEO and Performance

- **Server-Side Rendering (SSR)** - for SEO
- **Static Generation** - for static pages
- **JSON-LD** - structured data
- **Open Graph** - social networks

### Development Tools

- **ESLint** - code linting
- **Prettier** - code formatting
- **TypeScript** - type checking
- **Git** - version control

## 🏗️ Architecture

The project follows **Feature-Sliced Design (FSD)** methodology:

- **App Layer** - Next.js routing
- **Pages Layer** - page components
- **Widgets Layer** - complex UI blocks
- **Features Layer** - business features
- **Entities Layer** - business entities
- **Shared Layer** - shared resources

## 🎯 Key Features

- **AI Agent Marketplace** - browse and compare AI agents
- **User Authentication** - secure login and registration
- **Search and Filtering** - find agents by criteria
- **Responsive Design** - works on all devices
- **SEO Optimized** - search engine friendly
- **Performance Focused** - fast loading times

## 📱 Pages Structure

- **Home Page** - main landing page
- **Agent List** - browse all agents
- **Agent Detail** - individual agent page
- **Compare Page** - compare multiple agents
- **User Profile** - user account management
- **Authentication** - login and registration

## 🔧 Development Setup

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd agent-ai-market
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Configure environment variables
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **[Architecture Guide](../architecture/)** - architectural decisions
- **[Entity Structure](../architecture/entity-structure-guide.md)** - data layer
- **[Features Guide](../architecture/features-hooks-guide.md)** - business logic
- **[Code Standards](../code-standards.md)** - coding conventions

## 🚀 Deployment

The project is deployed on **Vercel** with automatic deployments from main branch.

### Environment Variables

- `NEXT_PUBLIC_API_URL` - API base URL
- `NEXT_PUBLIC_APP_URL` - application URL
- `NEXTAUTH_SECRET` - authentication secret
- `NEXTAUTH_URL` - authentication URL

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for Google ranking
- **Bundle Size**: Optimized with code splitting
- **Caching**: Efficient data caching with TanStack Query

## 🔒 Security

- **JWT Authentication** - secure token-based auth
- **CSRF Protection** - cross-site request forgery protection
- **XSS Prevention** - cross-site scripting prevention
- **HTTPS Only** - secure connections only

## 📈 SEO

- **Server-Side Rendering** - for search engine indexing
- **Structured Data** - JSON-LD for rich snippets
- **Meta Tags** - optimized for social sharing
- **Sitemap** - automatic sitemap generation
- **Robots.txt** - search engine directives

## 🤝 Contributing

1. **Fork Repository**
2. **Create Feature Branch**
3. **Make Changes**
4. **Write Tests**
5. **Submit Pull Request**

## 📞 Support

- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub discussions
- **Email**: Contact development team

---

**Last updated**: August 2025
