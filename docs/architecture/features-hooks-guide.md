# Руководство по кастомным хукам для функций

> **Примечание:** Для полной структуры функций см. [Руководство по структуре функций](./feature-structure-guide.md)

## 🔄 Кастомные хуки в функциях

### 1. Query хуки (для получения данных)

#### Принципы создания query хуков

**✅ Правильно - хуки только для данных:**

```typescript
// use-category-children.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryApi, type CategoryChildrenParams } from '@/entities/category'

export const useCategoryChildren = (params?: CategoryChildrenParams) => {
  return useQuery({
    ...categoryApi.getCategoryChildrenQueryOptions(params),
  })
}

// Компонент с UI логикой
export const CategoryList = ({ params }: Props) => {
  const { data, isLoading, isError } = useCategoryChildren(params)

  if (isLoading) return <CategorySkeleton />
  if (isError) return <CategoryError />
  if (!data?.length) return <CategoryEmpty />

  return (
    <div>
      {data.map(category => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}
```

**❌ Неправильно - смешивание данных и UI логики:**

```typescript
// ❌ Не делайте так
export const useCategoryChildren = (params?: CategoryChildrenParams) => {
  const { data, isLoading, isError } = useQuery({
    ...categoryApi.getCategoryChildrenQueryOptions(params),
  })

  // ❌ UI логика в хуке
  if (isLoading) return <CategorySkeleton />
  if (isError) return <CategoryError />
  if (!data?.length) return <CategoryEmpty />

  return data
}
```

#### Структура Query хука

```typescript
// use-{feature}-data.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { {entityName}Api, type {EntityName}Params } from '@/entities/{entity-name}'

/**
 * Хук для получения данных {feature}
 *
 * @param params - Параметры запроса
 * @returns Результат запроса с данными, состояниями загрузки и ошибки
 */
export const use{Feature}Data = (params?: {EntityName}Params) => {
  return useQuery({
    ...{entityName}Api.get{EntityName}sQueryOptions(params),
  })
}
```

### 2. Mutation хуки (для изменения данных)

#### Принципы создания mutation хуков

**✅ Правильно - хуки с правильной обработкой ошибок и коллбэками:**

```typescript
// use-create-category.ts
'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryApi, categoryKeys } from '@/entities/category'
import { logError } from '@/shared/utils'

// use-create-category.ts

// use-create-category.ts

// use-create-category.ts

// use-create-category.ts

interface UseCreateCategoryOptions {
  onSuccess?: (data: Category) => void
  onError?: (error: Error, variables: CreateCategoryDto) => void
  onSettled?: () => void
}

/**
 * Хук для создания новой категории
 *
 * @param options - Опции коллбэков для жизненного цикла мутации
 * @returns Объект мутации с методами и состояниями
 */
export const useCreateCategory = (options: UseCreateCategoryOptions = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryApi.create,

    // Логика повторных попыток
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, variables, context) => {
      // Toast уведомление об успехе
      toast.success('Категория успешно создана')

      // Инвалидация связанных запросов
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })

      // Вызов коллбэка успеха
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Логирование ошибки
      logError('❌ [useCreateCategory] Ошибка создания:', error)

      // Toast уведомление об ошибке
      toast.error('Не удалось создать категорию. Попробуйте снова.')

      // Вызов коллбэка ошибки
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Вызов коллбэка завершения
      options.onSettled?.()
    },
  })
}
```

#### Структура Mutation хука

```typescript
// use-create-{feature}.ts
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { {entityName}Api, {entityName}Keys } from '@/entities/{entity-name}'
import { logError } from '@/shared/utils'

interface UseCreate{Feature}Options {
  onSuccess?: (data: {EntityName}) => void
  onError?: (error: Error, variables: Create{EntityName}Dto) => void
  onSettled?: () => void
}

/**
 * Хук для создания нового {feature}
 *
 * @param options - Опции коллбэков для жизненного цикла мутации
 * @returns Объект мутации с методами и состояниями
 */
export const useCreate{Feature} = (options: UseCreate{Feature}Options = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.create,

    // Логика повторных попыток
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, variables, context) => {
      // Toast уведомление об успехе
      toast.success('{Feature} успешно создан')

      // Инвалидация связанных запросов
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })

      // Вызов коллбэка успеха
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Логирование ошибки
      logError('❌ [useCreate{Feature}] Ошибка создания:', error)

      // Toast уведомление об ошибке
      toast.error('Не удалось создать {feature}. Попробуйте снова.')

      // Вызов коллбэка ошибки
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Вызов коллбэка завершения
      options.onSettled?.()
    },
  })
}
```

### 3. Toast уведомления

#### Принципы toast уведомлений

- **Успешные операции**: Используйте `toast.success()` с описательным сообщением
- **Ошибки операций**: Используйте `toast.error()` с полезным сообщением об ошибке
- **Предупреждения**: Используйте `toast.warning()` для некритичных проблем
- **Все сообщения должны быть на русском языке**

```typescript
// ✅ Правильно - Toast уведомления
onSuccess: (data) => {
  toast.success('Пользователь успешно создан')
  // ... другая логика
},

onError: (error) => {
  toast.error('Не удалось создать пользователя. Попробуйте снова.')
  // ... другая логика
},

onSettled: () => {
  toast.warning('Операция завершена с предупреждениями')
  // ... другая логика
}
```

### 4. Коллбэки

#### Принципы коллбэков

- **onSuccess**: Вызывается при успехе мутации, получает данные и переменные
- **onError**: Вызывается при ошибке мутации, получает ошибку и переменные
- **onSettled**: Вызывается при завершении мутации (успех или ошибка)
- **Все коллбэки опциональны и могут быть переопределены**

```typescript
// ✅ Правильно - Использование коллбэков
const createUserMutation = useCreateUser({
  onSuccess: user => {
    console.log('Пользователь создан:', user)
    router.push(`/users/${user.id}`)
  },
  onError: (error, userData) => {
    console.error('Не удалось создать пользователя:', error)
    // Кастомная обработка ошибок
  },
  onSettled: () => {
    console.log('Операция создания пользователя завершена')
    // Логика очистки
  },
})
```

### 5. Логика повторных попыток

#### Принципы логики повторных попыток

- **Query хуки**: Обычно не нуждаются в retry (TanStack Query обрабатывает это)
- **Mutation хуки**: Используйте retry для сетевых ошибок, не для ошибок бизнес-логики
- **Задержка retry**: Используйте экспоненциальную задержку

```typescript
// ✅ Правильно - Логика повторных попыток
return useMutation({
  mutationFn: api.create,

  // Конфигурация retry
  retry: 2, // Повторить до 2 раз
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Экспоненциальная задержка

  onError: (error) => {
    // Повторять только при сетевых ошибках, не при ошибках бизнес-логики
    if (error.status === 500) {
      // Будет повторять
    } else if (error.status === 400) {
      // Не будет повторять - ошибка бизнес-логики
    }
  },
})
```

### 6. Оптимистичные обновления

#### Принципы оптимистичных обновлений

- **Используйте для отзывчивости UI**: Обновляйте UI немедленно, откатывайте при ошибке
- **Предоставляйте механизм отката**: Сохраняйте предыдущее состояние для отката
- **Обрабатывайте крайние случаи**: Учитывайте, что происходит, если оптимистичное обновление не удается

```typescript
// ✅ Правильно - Оптимистичные обновления
return useMutation({
  mutationFn: api.update,

  onMutate: async (newData) => {
    // Отменить исходящие запросы
    await queryClient.cancelQueries({ queryKey: {entityName}Keys.detail(newData.id) })

    // Снимок предыдущего значения
    const previousData = queryClient.getQueryData({entityName}Keys.detail(newData.id))

    // Оптимистично обновить
    queryClient.setQueryData({entityName}Keys.detail(newData.id), newData)

    // Вернуть контекст для отката
    return { previousData }
  },

  onError: (error, newData, context) => {
    // Откат при ошибке
    if (context?.previousData) {
      queryClient.setQueryData({entityName}Keys.detail(newData.id), context.previousData)
    }
  },

  onSettled: (data, error, newData) => {
    // Всегда перезапрашивать после ошибки или успеха
    queryClient.invalidateQueries({ queryKey: {entityName}Keys.detail(newData.id) })
  },
})
```

## 📋 Чеклист для Mutation хуков

### Обязательные элементы:

- [ ] **JSDoc документация** с описанием и типами параметров
- [ ] **Toast уведомления** для состояний успеха и ошибки
- [ ] **Опции коллбэков** (onSuccess, onError, onSettled)
- [ ] **Логика повторных попыток** с экспоненциальной задержкой
- [ ] **Логирование ошибок** с помощью logError helper
- [ ] **Инвалидация запросов** для связанных запросов
- [ ] **Типобезопасность** для всех параметров и возвращаемых значений

### Опциональные элементы:

- [ ] **Оптимистичные обновления** для лучшего UX
- [ ] **Управление состояниями загрузки**
- [ ] **Кастомная обработка ошибок** для конкретных случаев
- [ ] **Навигация** после успешных операций

## 🎯 Лучшие практики

1. **Разделение ответственности**: Держите логику данных в хуках, UI логику в компонентах
2. **Обработка ошибок**: Всегда предоставляйте осмысленные сообщения об ошибках
3. **Обратная связь с пользователем**: Используйте toast уведомления для всех операций
4. **Типобезопасность**: Полностью типизируйте все хуки и их параметры
5. **Документация**: Документируйте все публичные хуки с JSDoc
6. **Тестирование**: Напишите тесты для всех кастомных хуков
7. **Производительность**: Используйте подходящие стратегии кэширования и инвалидации
8. **Доступность**: Убедитесь, что сообщения об ошибках доступны
9. **Консистентность**: Следуйте одинаковым паттернам во всех хуках
10. **Коллбэки**: Предоставляйте гибкую систему коллбэков для кастомизации

## 📚 Связанная документация

- [Руководство по структуре сущностей](./entity-structure-guide.md)
- [Структура проекта](./project-structure.md)
- [Стандарты кода](../code-standards.md)
