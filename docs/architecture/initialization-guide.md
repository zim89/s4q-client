# App Initialization Guide

## 📋 Overview

This guide explains how to initialize global data (like languages, user preferences) when the app starts, ensuring data is available throughout the application.

## 🚀 Initialization Strategies

### 1. Provider Pattern (Recommended)

**Use for:** Global data that needs to be available everywhere

```typescript
// features/language/providers/language-provider.tsx
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { isLoading, isError } = useLanguages()

  return <>{children}</>
}

// app/providers/index.tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthStoreProvider>{children}</AuthStoreProvider>
      </LanguageProvider>
    </QueryProvider>
  )
}
```

**Advantages:**

- ✅ Automatic initialization
- ✅ Data available everywhere
- ✅ Clean separation of concerns
- ✅ Easy to test

### 2. Hook in Layout

**Use for:** Page-specific data

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppProviders>
          <LanguageInitializer />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}

// components/language-initializer.tsx
export const LanguageInitializer = () => {
  useLanguages() // Triggers loading
  return null
}
```

### 3. Lazy Initialization

**Use for:** Data that's not critical for initial render

```typescript
// hooks/use-language-selector.ts
export const useLanguageSelector = () => {
  const { languages, isLoading } = useLanguages()

  // Only load when component mounts
  useEffect(() => {
    if (!isLoaded) {
      // Trigger loading
    }
  }, [isLoaded])

  return { languages, isLoading }
}
```

## 🏗️ Implementation Patterns

### Static Reference Data

**Languages, currencies, countries**

```typescript
// ✅ Good - Provider pattern
export const LanguageProvider = ({ children }) => {
  useLanguages() // Auto-loads on mount
  return <>{children}</>
}

// ✅ Good - Store with persistence
const useLanguageStore = create(
  persist(
    (set) => ({
      languages: [],
      isLoaded: false,
      setLanguages: (languages) => set({ languages, isLoaded: true }),
    }),
    { name: 'language-storage' }
  )
)
```

### User-Specific Data

**User profile, preferences**

```typescript
// ✅ Good - Auth-dependent loading
export const UserDataProvider = ({ children }) => {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load user-specific data
    }
  }, [user])

  return <>{children}</>
}
```

### Critical App Data

**App config, feature flags**

```typescript
// ✅ Good - Blocking initialization
export const AppInitializer = ({ children }) => {
  const { data: config, isLoading } = useQuery({
    queryKey: ['app-config'],
    queryFn: fetchAppConfig,
  })

  if (isLoading) return <AppLoadingScreen />
  if (!config) return <AppErrorScreen />

  return <>{children}</>
}
```

## 📋 Best Practices

### 1. Provider Order

```typescript
// ✅ Correct order
<QueryProvider>           // 1. Query client first
  <LanguageProvider>      // 2. Static data
    <AuthProvider>        // 3. User data
      <ThemeProvider>     // 4. UI state
        {children}
      </ThemeProvider>
    </AuthProvider>
  </LanguageProvider>
</QueryProvider>
```

### 2. Error Handling

```typescript
export const LanguageProvider = ({ children }) => {
  const { isError, error } = useLanguages()

  if (isError) {
    console.error('Failed to load languages:', error)
    // Don't block app - languages are not critical
  }

  return <>{children}</>
}
```

### 3. Loading States

```typescript
export const LanguageProvider = ({ children }) => {
  const { isLoading } = useLanguages()

  // Optional: Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}
```

### 4. Conditional Loading

```typescript
export const ConditionalProvider = ({ children }) => {
  const { user } = useAuth()

  return (
    <QueryProvider>
      {user ? (
        <UserDataProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </UserDataProvider>
      ) : (
        <LanguageProvider>
          {children}
        </LanguageProvider>
      )}
    </QueryProvider>
  )
}
```

## 🎯 When to Use Each Pattern

### Provider Pattern

- ✅ **Global static data** (languages, currencies)
- ✅ **App-wide state** (theme, notifications)
- ✅ **Critical data** (user permissions)

### Hook in Layout

- ✅ **Page-specific data** (dashboard stats)
- ✅ **Optional features** (analytics, tracking)

### Lazy Initialization

- ✅ **Heavy data** (large lists, complex objects)
- ✅ **User-triggered data** (search results, filters)

## 🧪 Testing Initialization

```typescript
// Test provider initialization
describe('LanguageProvider', () => {
  it('should load languages on mount', async () => {
    render(
      <QueryClient client={queryClient}>
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      </QueryClient>
    )

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument()
    })
  })
})
```

## 📚 Related Documentation

- [Store Guide](./store-guide.md)
- [Features Hooks Guide](./features-hooks-guide.md)
- [Project Structure](./project-structure.md)

## 🎯 Summary

**Use Provider Pattern** for global data that needs to be available everywhere. This ensures:

- **Automatic initialization** on app startup
- **Data persistence** across page navigation
- **Clean architecture** with separation of concerns
- **Easy testing** and debugging

For languages and other static reference data, the Provider Pattern is perfect! 🚀
