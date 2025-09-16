# Store Guide

## 📋 Overview

This guide explains how to create and use Zustand stores in the project for managing global state, especially for static reference data like languages, currencies, countries, etc.

**Important:** This project uses the Next.js App Router pattern with vanilla Zustand stores and Context Providers for SSR compatibility.

## 🏗️ Store Structure

```
src/features/{feature}/model/
├── {store-name}-store.ts          # Vanilla store definition
├── {store-name}-store-provider.tsx # Context Provider
├── use-{entity-name}s.ts          # Custom hook with TanStack Query
└── index.ts                       # Exports
```

## 📁 Files and Their Purpose

### 1. `{store-name}-store.ts`

**Purpose:** Vanilla Zustand store with persistence for static data (SSR-safe)

**Structure:**

```typescript
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import type { {EntityName} } from '@/entities/{entity-name}'

export type {EntityName}State = {
  {entityName}s: {EntityName}[]
}

export type {EntityName}Actions = {
  set{EntityName}s: ({entityName}s: {EntityName}[]) => void
  clear{EntityName}s: () => void
}

export type {EntityName}Store = {EntityName}State & {EntityName}Actions

const defaultInitState: {EntityName}State = {
  {entityName}s: [],
}

export const create{EntityName}Store = (
  initState: {EntityName}State = defaultInitState,
) => {
  return createStore<{EntityName}Store>()(
    persist(
      (set) => ({
        ...initState,
        set{EntityName}s: ({entityName}s) => set({ {entityName}s }),
        clear{EntityName}s: () => set({ {entityName}s: [] }),
      }),
      {
        name: 's4q-{entity-name}-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          {entityName}s: state.{entityName}s,
        }),
        skipHydration: true, // SSR-safe
      },
    ),
  )
}
```

**Rules:**

- Use `createStore` from `zustand/vanilla` for SSR compatibility
- Store only essential data (no loading states in store)
- Use `createJSONStorage` for localStorage access
- Always set `skipHydration: true` for SSR
- Export types separately for better TypeScript support

### 2. `{store-name}-store-provider.tsx`

**Purpose:** Context Provider for vanilla store (Next.js App Router compatible)

**Structure:**

```typescript
'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useStore } from 'zustand'
import { type {EntityName}Store, create{EntityName}Store } from './{store-name}-store'

export type {EntityName}StoreApi = ReturnType<typeof create{EntityName}Store>

export const {EntityName}StoreContext = createContext<{EntityName}StoreApi | undefined>(
  undefined,
)

export interface {EntityName}StoreProviderProps {
  children: ReactNode
}

export const {EntityName}StoreProvider = ({
  children,
}: {EntityName}StoreProviderProps) => {
  const storeRef = useRef<{EntityName}StoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = create{EntityName}Store()
  }

  // Hydrate store on client side
  useEffect(() => {
    if (storeRef.current && 'persist' in storeRef.current) {
      storeRef.current.persist.rehydrate()
    }
  }, [])

  return (
    <{EntityName}StoreContext.Provider value={storeRef.current}>
      {children}
    </{EntityName}StoreContext.Provider>
  )
}

export const use{EntityName}Store = <T,>(
  selector: (store: {EntityName}Store) => T,
): T => {
  const {entityName}StoreContext = useContext({EntityName}StoreContext)

  if (!{entityName}StoreContext) {
    throw new Error(
      `use{EntityName}Store must be used within {EntityName}StoreProvider`,
    )
  }

  return useStore({entityName}StoreContext, selector)
}
```

**Rules:**

- Use `useRef` to create store per-request
- Always hydrate on client side with `useEffect`
- Provide custom hook with selector for type safety
- Include error handling for missing provider

### 3. `use-{entity-name}s.ts`

**Purpose:** Custom hook combining store with TanStack Query

**Structure:**

```typescript
'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { {entityName}Api } from '@/entities/{entity-name}'
import { use{EntityName}Store } from './{store-name}-store-provider'

export const use{EntityName}s = () => {
  const { {entityName}s, set{EntityName}s } = use{EntityName}Store((state) => state)

  const { data, isLoading, error } = useQuery({
    ...{entityName}Api.findManyOptions({ isEnabled: true }),
    enabled: {entityName}s.length === 0, // Only fetch if not cached
    staleTime: Infinity, // Never stale - static data
    gcTime: Infinity, // Cache forever
  })

  // Cache data in store when fetched
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      set{EntityName}s(data.data)
    }
  }, [data, set{EntityName}s])

  return {
    {entityName}s: {entityName}s.length > 0 ? {entityName}s : data?.data || [],
    isLoading,
    isError: !!error,
    error,
  }
}
```

**Rules:**

- Only fetch if data not in store
- Cache fetched data in store
- Return cached data if available, otherwise fresh data
- Use infinite stale time for static data

### 4. `index.ts`

**Purpose:** Export all store-related files

**Structure:**

```typescript
export * from './{store-name}-store'
export * from './{store-name}-store-provider'
export * from './use-{entity-name}s'
```

## 🔄 Store Usage Patterns

### 1. Static Reference Data (Languages Example)

**Use for:** Languages, currencies, countries, categories

**Store Implementation:**

```typescript
// language-store.ts
export const createLanguageStore = (
  initState: LanguageState = defaultInitState,
) => {
  return createStore<LanguageStore>()(
    persist(
      set => ({
        ...initState,
        setLanguages: languages => set({ languages }),
        clearLanguages: () => set({ languages: [] }),
      }),
      {
        name: 's4q-language-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({ languages: state.languages }),
        skipHydration: true,
      },
    ),
  )
}
```

**Provider Setup:**

```typescript
// In app/layout.tsx or feature provider
<LanguageStoreProvider>
  <App />
</LanguageStoreProvider>
```

**Usage in Components:**

```typescript
// Component usage
const { languages, isLoading } = useLanguages()
```

### 2. User Preferences

**Use for:** Theme, language preference, settings

```typescript
// user-preferences-store.ts
export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    set => ({
      theme: 'light',
      language: 'en',
      notifications: true,
      setTheme: theme => set({ theme }),
      setLanguage: language => set({ language }),
      setNotifications: notifications => set({ notifications }),
    }),
    {
      name: 'user-preferences',
      partialize: state => state, // Persist all preferences
    },
  ),
)
```

### 3. UI State

**Use for:** Modals, sidebars, filters

```typescript
// ui-store.ts
export const useUIStore = create<UIStore>()(set => ({
  isSidebarOpen: false,
  activeModal: null,
  filters: {},
  setSidebarOpen: isOpen => set({ isSidebarOpen: isOpen }),
  setActiveModal: modal => set({ activeModal: modal }),
  setFilters: filters => set({ filters }),
}))
```

## 🎣 Hook Integration

### Query Hook with Store

```typescript
// use-languages.ts
export const useLanguages = () => {
  const {
    languages,
    isLoading: storeLoading,
    isLoaded,
    setLanguages,
    setLoading,
  } = useLanguageStore()

  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery({
    ...languageApi.findManyOptions({ isEnabled: true }),
    enabled: !isLoaded, // Only fetch if not already loaded
    staleTime: Infinity, // Never stale - static data
    cacheTime: Infinity, // Cache forever
    onSuccess: data => {
      setLanguages(data.data)
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    },
  })

  return {
    languages: isLoaded ? languages : data?.data || [],
    isLoading: storeLoading || (queryLoading && !isLoaded),
    isError: !!error,
    error,
    isLoaded,
  }
}
```

## 📋 Store Guidelines

### When to Use Stores

**✅ Use stores for:**

- **Static reference data** (languages, currencies, countries)
- **User preferences** (theme, language, settings)
- **UI state** that needs to persist across pages
- **Global state** that multiple components need
- **Data that rarely changes** but is accessed frequently

**❌ Don't use stores for:**

- **Server state** (use TanStack Query instead)
- **Form state** (use react-hook-form)
- **Component-specific state** (use useState)
- **Temporary UI state** (use useState)

### Store Naming Conventions

- **Store files:** `{entity-name}-store.ts`
- **Store hooks:** `use{EntityName}Store`
- **Store interfaces:** `{EntityName}Store`
- **Storage keys:** `{entity-name}-storage`

### State Structure

```typescript
interface {EntityName}Store {
  // Data (required)
  {entityName}s: {EntityName}[]

  // Loading states (required for async data)
  isLoading: boolean
  isLoaded: boolean

  // Actions (required)
  set{EntityName}s: ({entityName}s: {EntityName}[]) => void
  setLoading: (loading: boolean) => void
  setLoaded: (loaded: boolean) => void
  clear{EntityName}s: () => void

  // Optional computed values
  get{EntityName}ById: (id: string) => {EntityName} | undefined
  get{EntityName}sByCode: (code: string) => {EntityName}[]
}
```

## ⚡ Next.js App Router Compatibility

This project uses the Next.js App Router pattern for Zustand stores to ensure SSR compatibility and prevent hydration errors.

### Key Requirements:

1. **Vanilla Stores Only**
   - Use `createStore` from `zustand/vanilla`
   - Never use `create` from `zustand` directly

2. **Context Providers Required**
   - Each store needs a Context Provider
   - Store created per-request via `useRef`
   - Prevents global state sharing across requests

3. **SSR-Safe Persistence**
   - Always use `skipHydration: true`
   - Use `createJSONStorage(() => localStorage)`
   - Manual hydration in `useEffect`

4. **Client-Only Hydration**
   ```typescript
   useEffect(() => {
     if (storeRef.current && 'persist' in storeRef.current) {
       storeRef.current.persist.rehydrate()
     }
   }, [])
   ```

### Integration with App Providers:

```typescript
// app/providers/index.tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <LanguageStoreProvider>
        <AuthStoreProvider>
          {children}
        </AuthStoreProvider>
      </LanguageStoreProvider>
    </QueryProvider>
  )
}
```

### Benefits:

- ✅ No hydration errors
- ✅ SSR compatible
- ✅ Per-request store isolation
- ✅ Server caching friendly
- ✅ Follows Next.js best practices

## 🔧 Best Practices

### 1. Store Structure

```typescript
// ✅ Good - Store only essential data
export type LanguageState = {
  languages: Language[]
}

// ❌ Bad - Store loading states
export type LanguageState = {
  languages: Language[]
  isLoading: boolean  // Don't persist loading states
  isLoaded: boolean   // Don't persist loading states
}
```

### 2. Persistence Strategy

```typescript
// ✅ Good - Only persist data, not loading states
partialize: (state) => ({
  languages: state.languages,
}),

// ❌ Bad - Persist loading states
partialize: (state) => ({
  languages: state.languages,
  isLoading: state.isLoading,  // Don't persist
  isLoaded: state.isLoaded,    // Don't persist
}),
```

### 3. Loading States

```typescript
// ✅ Good - Clear loading states
interface LanguageStore {
  isLoading: boolean // Currently loading
  isLoaded: boolean // Has been loaded at least once
}

// ❌ Bad - Unclear loading state
interface LanguageStore {
  loading: boolean // What kind of loading?
}
```

### 3. Action Naming

```typescript
// ✅ Good - Clear action names
setLanguages: (languages) => set({ languages, isLoaded: true }),
clearLanguages: () => set({ languages: [], isLoaded: false }),

// ❌ Bad - Unclear action names
update: (data) => set({ languages: data }),
reset: () => set({ languages: [] }),
```

### 4. Type Safety

```typescript
// ✅ Good - Fully typed
interface LanguageStore {
  languages: Language[]
  setLanguages: (languages: Language[]) => void
}

// ❌ Bad - Any types
interface LanguageStore {
  languages: any[]
  setLanguages: (languages: any) => void
}
```

## 🚀 Usage Examples

### In Components

```typescript
import { useLanguages } from '@/features/language'

export const LanguageSelector = () => {
  const { languages, isLoading, isError } = useLanguages()

  if (isLoading) return <LanguageSkeleton />
  if (isError) return <LanguageError />
  if (!languages.length) return <LanguageEmpty />

  return (
    <Select>
      {languages.map(language => (
        <SelectItem key={language.id} value={language.code}>
          {language.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```

### In Custom Hooks

```typescript
import { useLanguageStore } from '@/shared/stores'

export const useLanguageById = (id: string) => {
  const { languages } = useLanguageStore()
  return languages.find(lang => lang.id === id)
}
```

### Direct Store Access

```typescript
import { useLanguageStore } from '@/shared/stores'

export const LanguageDebugger = () => {
  const { languages, isLoaded, clearLanguages } = useLanguageStore()

  return (
    <div>
      <p>Languages: {languages.length}</p>
      <p>Loaded: {isLoaded ? 'Yes' : 'No'}</p>
      <button onClick={clearLanguages}>Clear</button>
    </div>
  )
}
```

## 🧪 Testing Stores

```typescript
import { act, renderHook } from '@testing-library/react'
import { useLanguageStore } from '@/shared/stores'

describe('useLanguageStore', () => {
  beforeEach(() => {
    useLanguageStore.getState().clearLanguages()
  })

  it('should set languages', () => {
    const { result } = renderHook(() => useLanguageStore())

    act(() => {
      result.current.setLanguages([{ id: '1', name: 'English', code: 'en' }])
    })

    expect(result.current.languages).toHaveLength(1)
    expect(result.current.isLoaded).toBe(true)
  })
})
```

## 📚 Related Documentation

- [Features Hooks Guide](./features-hooks-guide.md)
- [Entity Structure Guide](./entity-structure-guide.md)
- [Project Structure](./project-structure.md)
- [Code Standards](../code-standards.md)

## 🎯 Summary

Stores are perfect for **static reference data** that:

- **Rarely changes** (languages, currencies)
- **Accessed frequently** (user preferences)
- **Needs persistence** (theme, language)
- **Shared across components** (UI state)

Use **TanStack Query** for server state, **react-hook-form** for form state, and **Zustand stores** for global client state! 🚀
