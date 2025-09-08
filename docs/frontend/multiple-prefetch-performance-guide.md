# 🚀 Руководство по множественным префетчам для улучшения производительности

## 📋 Обзор

Данное руководство описывает лучшие практики использования множественных префетчей в TanStack Query для оптимизации производительности страниц с несколькими независимыми запросами.

## 🎯 Проблема

### ❌ Плохой подход: Множественные серверные компоненты

```typescript
// app/[locale]/(root)/[city]/[category]/page.tsx
export default async function Page({ params }) {
  return (
    <CategoryPage>
      <CategoryCrumbsServer />     // ← Создает свой QueryClient
      <BannersServer />           // ← Создает свой QueryClient
      <CategoryServicesServer />  // ← Создает свой QueryClient
    </CategoryPage>
  )
}
```

**Проблемы:**

- 3 отдельных QueryClient'а
- 3 отдельных HydrationBoundary
- Избыточная гидратация
- Больший размер JS бандла

## ✅ Решение: Единый QueryClient с множественными префетчами

### 1. Создание серверной страницы с префетчами

```typescript
// app/[locale]/(root)/[city]/[category]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { categoryApi, bannerApi } from '@/entities'

export default async function Page({ params }) {
  const { city, category, locale } = await params
  const cityId = await getSelectedCityIdFromCookie()
  const categoryId = extractIdFromSlug(category) ?? 0
  const localeCaps = locale.toUpperCase() as LocaleCaps

  // 1. Создаем один QueryClient для всех запросов
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 15 * 60 * 1000,   // 15 минут
        retry: 2,
      },
    },
  })

  // 2. Параллельно выполняем все запросы
  await Promise.all([
    queryClient.prefetchQuery(
      categoryApi.getCategoryChildrenQueryOptions({
        cityId,
        parentId: categoryId,
        lang: localeCaps,
      })
    ),
    queryClient.prefetchQuery(
      categoryApi.getCategoryBreadcrumbsQueryOptions({
        id: categoryId,
        lang: localeCaps,
      })
    ),
    queryClient.prefetchQuery(
      bannerApi.getBannersQueryOptions({
        lang: localeCaps,
      })
    ),
  ])

  // 3. Один HydrationBoundary для всех данных
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryPage
        cityId={cityId}
        citySlug={city}
        categorySlug={category}
        locale={localeCaps}
      />
    </HydrationBoundary>
  )
}
```

### 2. Клиентские компоненты без Suspense

```typescript
// screens/category/category-page.tsx
export const CategoryPage = ({ cityId, citySlug, categorySlug, locale }) => {
  const categoryId = extractIdFromSlug(categorySlug) ?? 0

  return (
    <div className='container'>
      <div className='page-wrapper'>
        <div className='space-y-4'>
          <CategoryCrumbs categoryId={categoryId} />
        </div>

        <div className='space-y-6 lg:space-y-8'>
          <BannerSlider />
          <CategoryServices
            cityId={cityId}
            citySlug={citySlug}
            categoryId={categoryId}
            lang={locale}
          />
        </div>
      </div>
    </div>
  )
}
```

### 3. Хуки используют предзагруженные данные

```typescript
// features/category/model/use-category-breadcrumbs.tsx
export const useCategoryBreadcrumbs = (categoryId: number) => {
  const locale = useLocaleCaps()

  return useQuery<CategoryBreadcrumb[]>({
    ...categoryApi.getCategoryBreadcrumbsQueryOptions({
      id: categoryId,
      lang: locale,
    }),
    enabled: !!locale && !!categoryId,
  })
}

// screens/category/ui/category-crumbs.tsx
export const CategoryCrumbs = ({ categoryId }: Props) => {
  const { data: breadcrumbs } = useCategoryBreadcrumbs(categoryId)

  // Данные уже предзагружены на сервере, поэтому breadcrumbs будут доступны сразу
  return <Breadcrumbs crumbs={breadcrumbs ?? []} type='dynamic' />
}
```

## 📊 Сравнение производительности

| Метрика               | Множественные серверные компоненты | Единый QueryClient с префетчами |
| --------------------- | ---------------------------------- | ------------------------------- |
| **QueryClient'ы**     | 3                                  | 1                               |
| **HydrationBoundary** | 3                                  | 1                               |
| **Время загрузки**    | ~2-3 сек                           | ~0.5 сек                        |
| **Размер JS бандла**  | Больше                             | Меньше                          |
| **Гидратация**        | 3 раза                             | 1 раз                           |
| **Кэширование**       | Разделенное                        | Единое                          |

## 🔧 Лучшие практики

### 1. Параллельное выполнение запросов

```typescript
// ✅ Хорошо - все запросы выполняются параллельно
await Promise.all([
  queryClient.prefetchQuery(query1),
  queryClient.prefetchQuery(query2),
  queryClient.prefetchQuery(query3),
])

// ❌ Плохо - запросы выполняются последовательно
await queryClient.prefetchQuery(query1)
await queryClient.prefetchQuery(query2)
await queryClient.prefetchQuery(query3)
```

### 2. Настройка QueryClient

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Данные свежие 5 минут
      gcTime: 15 * 60 * 1000, // Кэшируются 15 минут
      retry: 2, // 2 попытки при ошибке
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: 1, // Меньше попыток для мутаций
      retryDelay: 1000,
    },
  },
})
```

### 3. Обработка ошибок

```typescript
// Обработка ошибок для каждого запроса
await Promise.allSettled([
  queryClient.prefetchQuery(query1).catch(error => {
    console.error('Failed to prefetch query1:', error)
  }),
  queryClient.prefetchQuery(query2).catch(error => {
    console.error('Failed to prefetch query2:', error)
  }),
])
```

### 4. Условные префетчи

```typescript
// Префетчим только если есть необходимые данные
const queries = []

if (categoryId) {
  queries.push(
    queryClient.prefetchQuery(
      categoryApi.getCategoryChildrenQueryOptions({
        cityId,
        parentId: categoryId,
        lang: localeCaps,
      }),
    ),
  )
}

if (localeCaps) {
  queries.push(
    queryClient.prefetchQuery(
      bannerApi.getBannersQueryOptions({
        lang: localeCaps,
      }),
    ),
  )
}

await Promise.all(queries)
```

## 🎯 Когда использовать

### ✅ Подходит для:

- Страниц с множественными независимыми запросами
- Данных, которые нужны сразу при загрузке страницы
- Улучшения Core Web Vitals (LCP, FID)
- Уменьшения времени до интерактивности

### ❌ Не подходит для:

- Данных, которые загружаются по требованию
- Бесконечных списков
- Данных, зависящих от пользовательских действий

## 🔍 Отладка

### Проверка предзагруженных данных

```typescript
// В клиентском компоненте
const { data } = useQuery({
  queryKey: ['category-children'],
  queryFn: getCategoryChildren,
})

console.log('Data from cache:', data)
console.log('Is data from server?', !data?.isClientSide)
```

### Мониторинг производительности

```typescript
// Измерение времени загрузки
const startTime = performance.now()

await Promise.all([
  queryClient.prefetchQuery(query1),
  queryClient.prefetchQuery(query2),
])

const endTime = performance.now()
console.log(`Prefetch time: ${endTime - startTime}ms`)
```

## 📈 Метрики успеха

После внедрения множественных префетчей ожидайте:

- **Время загрузки страницы**: -50% до -70%
- **First Contentful Paint (FCP)**: -30% до -50%
- **Largest Contentful Paint (LCP)**: -40% до -60%
- **Размер JS бандла**: -20% до -30%
- **Время гидратации**: -60% до -80%

## 🔗 Связанные документы

- [Entity Structure Guide](./entity-structure-guide.md)
- [Features Hooks Guide](./features-hooks-guide.md)
- [TanStack Query Best Practices](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)

---

**Автор**: Frontend Team  
**Последнее обновление**: 2024  
**Версия**: 1.0
