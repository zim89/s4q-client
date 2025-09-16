# Руководство по структуре функций

## 📋 Структура функции

Каждая функция должна иметь следующую структуру:

```
src/features/{feature-name}/
├── model/                    # Бизнес-логика
│   ├── {feature}-store.ts   # Zustand store
│   ├── use-{feature}-data.ts
│   ├── use-{feature}-list.ts
│   ├── use-create-{feature}.ts
│   ├── use-update-{feature}.ts
│   ├── use-delete-{feature}.ts
│   └── index.ts
├── lib/                     # Константы и хелперы
│   ├── constants.ts
│   ├── utils.ts
│   ├── validations.ts
│   └── index.ts
├── ui/                      # UI компоненты
│   ├── {feature}-component.tsx
│   ├── {feature}-form.tsx
│   ├── {feature}-list.tsx
│   └── index.ts
└── index.ts                 # Публичный API
```

## 📁 Папки и их назначение

### 1. `model/` - Бизнес-логика

**Назначение:** Содержит всю бизнес-логику функции

**Структура:**

- `{feature}-store.ts` - Zustand store для управления состоянием
- `use-{feature}-data.ts` - React хуки для получения данных
- `use-{feature}-list.ts` - React хуки для работы со списками
- `use-create-{feature}.ts` - React хуки для создания
- `use-update-{feature}.ts` - React хуки для обновления
- `use-delete-{feature}.ts` - React хуки для удаления
- `index.ts` - Экспорты из model

**Правила:**

- Только бизнес-логика, без UI
- Хуки для работы с API и состоянием
- Store для глобального состояния функции
- Никаких UI компонентов
- **Все файлы в одной папке** - не создавайте подпапки в model

### 2. `lib/` - Константы и хелперы

**Назначение:** Константы, утилиты, валидации и другие вспомогательные функции

**Структура:**

```typescript
// constants.ts
export const FEATURE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_ITEMS: 100,
} as const

// utils.ts
export const formatFeatureData = (data: any) => {
  // Утилиты для работы с данными функции
}

// validations.ts
export const validateFeatureInput = (input: any) => {
  // Валидации для функции
}
```

**Правила:**

- Константы, специфичные для функции
- Утилиты для обработки данных
- Валидации и схемы
- Хелперы для работы с API

### 3. `ui/` - UI компоненты

**Назначение:** React компоненты для отображения

**Структура:**

```typescript
// {feature}-component.tsx
export const FeatureComponent = () => {
  // Основной компонент функции
}

// {feature}-form.tsx
export const FeatureForm = () => {
  // Форма для создания/редактирования
}

// {feature}-list.tsx
export const FeatureList = () => {
  // Список элементов функции
}
```

**Правила:**

- Только UI компоненты
- Используют хуки из `model/`
- Используют константы из `lib/`
- Никакой бизнес-логики

### 4. `index.ts` - Публичный API

**Назначение:** Единая точка входа для функции

**Структура:**

```typescript
// Экспорты из всех папок
export * from './model'
export * from './ui'
export * from './lib'
```

**Правила:**

- Экспортирует только публичный API
- Скрывает внутреннюю структуру
- Обеспечивает удобный импорт

## 🔄 Кастомные хуки в функциях

### 1. Query хуки (для получения данных)

#### Принципы создания query хуков

**✅ Правильно - хуки только для данных:**

```typescript
// model/use-{feature}-data.ts
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

**❌ Неправильно - смешивание данных и UI логики:**

```typescript
// ❌ Не делайте так
export const use{Feature}Data = (params?: {EntityName}Params) => {
  const { data, isLoading, isError } = useQuery({
    ...{entityName}Api.get{EntityName}sQueryOptions(params),
  })

  // ❌ UI логика в хуке
  if (isLoading) return <FeatureSkeleton />
  if (isError) return <FeatureError />
  if (!data?.length) return <FeatureEmpty />

  return data
}
```

### 2. Mutation хуки (для изменения данных)

#### Принципы создания mutation хуков

**✅ Правильно - хуки с правильной обработкой ошибок и коллбэками:**

```typescript
// model/use-create-{feature}.ts
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

### 3. Store хуки (для управления состоянием)

#### Принципы создания store хуков

**✅ Правильно - простой доступ к store:**

```typescript
// model/use-{feature}-store.ts
'use client'

import { use{Feature}Store } from './{feature}-store'

/**
 * Хук для доступа к store {feature}
 *
 * @param selector - Селектор для получения части состояния
 * @returns Выбранная часть состояния
 */
export const use{Feature}Store = <T>(selector: (state: {Feature}State) => T) => {
  return use{Feature}Store(selector)
}
```

### 4. Toast уведомления

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

### 5. Коллбэки

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

### 6. Логика повторных попыток

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

### 7. Оптимистичные обновления

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

## 📋 Чеклист для функций

### Обязательные элементы:

- [ ] **Правильная структура папок** (model, lib, ui, index.ts)
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

1. **Разделение ответственности**: Держите логику данных в model, UI в ui, константы в lib
2. **Плоская структура model**: Все файлы model в одной папке, без подпапок
3. **Обработка ошибок**: Всегда предоставляйте осмысленные сообщения об ошибках
4. **Обратная связь с пользователем**: Используйте toast уведомления для всех операций
5. **Типобезопасность**: Полностью типизируйте все хуки и их параметры
6. **Документация**: Документируйте все публичные хуки с JSDoc
7. **Тестирование**: Напишите тесты для всех кастомных хуков
8. **Производительность**: Используйте подходящие стратегии кэширования и инвалидации
9. **Доступность**: Убедитесь, что сообщения об ошибках доступны
10. **Консистентность**: Следуйте одинаковым паттернам во всех функциях
11. **Коллбэки**: Предоставляйте гибкую систему коллбэков для кастомизации

## 🔄 Структура model

### Принципы организации

**Все файлы model в одной папке:**

- Не создавайте подпапки `hooks/` и `store/`
- Все хуки и store в корне `model/`
- Простая и понятная структура

**Пример правильной структуры:**

```
src/features/{feature-name}/model/
├── {feature}-store.ts        # Zustand store
├── use-{feature}-data.ts     # Хук для получения данных
├── use-{feature}-list.ts     # Хук для работы со списками
├── use-create-{feature}.ts   # Хук для создания
├── use-update-{feature}.ts   # Хук для обновления
├── use-delete-{feature}.ts   # Хук для удаления
└── index.ts                  # Экспорты
```

### Преимущества плоской структуры:

- ✅ **Простота навигации** - все файлы на одном уровне
- ✅ **Меньше index.ts** - только один index.ts в model
- ✅ **Прямые импорты** - `import { useStore } from './store'`
- ✅ **Проще рефакторинг** - меньше мест для изменений
- ✅ **Единообразие** - одинаковая структура для всех функций

## 📝 Соглашения именования

### Именование файлов (kebab-case)

- `use-{feature}-data.ts` - хуки для получения данных
- `use-create-{feature}.ts` - хуки для создания
- `use-update-{feature}.ts` - хуки для обновления
- `use-delete-{feature}.ts` - хуки для удаления
- `{feature}-store.ts` - Zustand store
- `{feature}-component.tsx` - UI компоненты

### Именование функций (camelCase)

- `use{Feature}Data` - получение данных
- `useCreate{Feature}` - создание
- `useUpdate{Feature}` - обновление
- `useDelete{Feature}` - удаление
- `use{Feature}Store` - доступ к store

### Именование типов (PascalCase)

- `{Feature}State` - состояние store
- `Use{Feature}Options` - опции хуков
- `{Feature}Component` - компоненты

## 🔄 Инвалидация запросов

### Кастомные хуки для мутаций

Мутации должны обрабатываться в кастомных хуках с правильной инвалидацией:

```typescript
// model/use-create-{feature}.ts
const useCreate{Feature} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

// model/use-update-{feature}.ts
const useUpdate{Feature} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => {entityName}Api.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.detail(id) })
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

// model/use-delete-{feature}.ts
const useDelete{Feature} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}
```

## 📚 Связанная документация

- [Руководство по структуре сущностей](./entity-structure-guide.md)
- [Структура проекта](./project-structure.md)
- [Стандарты кода](../code-standards.md)
