# Руководство по структуре сущностей

## 📋 Структура сущности

Каждая сущность должна иметь следующую структуру:

```
src/entities/{entity-name}/
├── {entity-name}-types.ts
├── {entity-name}-keys.ts
├── {entity-name}-requests.ts
├── {entity-name}-api.ts
├── index.ts
└── README.md
```

## 📁 Файлы и их назначение

### 1. `{entity-name}-types.ts`

**Назначение:** Все типы и интерфейсы для сущности

**Структура:**

```typescript
import type { PaginatedResponse } from '@/shared/types'

// ==============================
// ПАРАМЕТРЫ ЗАПРОСОВ
// ==============================

/** Параметры для запросов {entity-name} */
export interface {EntityName}Params {
  page?: number
  limit?: number
  // другие параметры
}

// ==============================
// ОСНОВНЫЕ ТИПЫ
// ==============================

/** Основная сущность {entity-name} */
export interface {EntityName} {
  id: string
  createdAt: Date
  updatedAt: Date

  // Основные поля
  name: string
  description?: string

  // Дополнительные поля
  status: string
  userId: string
}

// ==============================
// ДОПОЛНИТЕЛЬНЫЕ ТИПЫ
// ==============================

/** Создание {entity-name} */
export interface Create{EntityName}Dto {
  name: string
  description?: string
  status?: string
}

/** Обновление {entity-name} */
export interface Update{EntityName}Dto {
  name?: string
  description?: string
  status?: string
}
```

**Правила:**

- Группируйте интерфейсы по назначению с явными разделителями (`// ==============================`)
- Краткие комментарии для каждого интерфейса
- Если интерфейс имеет много свойств, группируйте их пустыми строками
- Используйте общий `PaginatedResponse<T>` для пагинированных ответов

### 2. `{entity-name}-keys.ts`

**Назначение:** Query keys для TanStack Query

**Структура:**

```typescript
import type { {EntityName}Params } from './{entity-name}-types'

export const {entityName}Keys = {
  root: ['{entity-name}'] as const,

  all: () => [...{entityName}Keys.root, 'list'] as const,
  lists: () => [...{entityName}Keys.all()] as const,
  list: (filters: {EntityName}Params) => [...{entityName}Keys.lists(), { filters }] as const,

  details: () => [...{entityName}Keys.root, 'detail'] as const,
  detail: (id: string) => [...{entityName}Keys.details(), id] as const,
} as const
```

**Правила:**

- Группируйте ключи по назначению пустыми строками
- Никаких комментариев в файле
- Используйте camelCase для имен ключей
- Первый элемент всегда `root`

### 3. `{entity-name}-requests.ts`

**Назначение:** Внутренний класс HTTP запросов (не экспортируется из модуля)

**Структура:**

```typescript
import { apiRoutes, axiosClient } from '@/shared/api'
import type { PaginatedResponse } from '@/shared/types'
import type {
  {EntityName},
  {EntityName}Params,
  Create{EntityName}Dto,
  Update{EntityName}Dto,
} from './{entity-name}-types'

/**
 * Класс запросов {EntityName}
 * Содержит все HTTP методы для операций с {entity-name}
 */
class {EntityName}Requests {
  /**
   * Найти {entity-name} по ID
   */
  async findById(id: string): Promise<{EntityName}> {
    const response = await axiosClient.get<{EntityName}>(apiRoutes.{entityName}.findOne(id))
    return response.data
  }

  /**
   * Найти много {entity-name}s с пагинацией и фильтрацией
   */
  async findMany(params?: {EntityName}Params): Promise<PaginatedResponse<{EntityName}>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await axiosClient.get<PaginatedResponse<{EntityName}>>(
      `${apiRoutes.{entityName}.findMany}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Создать новый {entity-name}
   */
  async create(data: Create{EntityName}Dto): Promise<{EntityName}> {
    const response = await axiosClient.post<{EntityName}>(apiRoutes.{entityName}.create, data)
    return response.data
  }

  /**
   * Обновить {entity-name}
   */
  async update(id: string, data: Update{EntityName}Dto): Promise<{EntityName}> {
    const response = await axiosClient.patch<{EntityName}>(
      apiRoutes.{entityName}.update(id),
      data,
    )
    return response.data
  }

  /**
   * Удалить {entity-name}
   */
  async delete(id: string): Promise<void> {
    await axiosClient.delete(apiRoutes.{entityName}.delete(id))
  }
}

export const {entityName}Requests = new {EntityName}Requests()
```

**Правила:**

- Краткий JSDoc без примеров
- Краткий комментарий для каждой функции
- Не экспортируется из индекса модуля
- Используется только внутренне

### 4. `{entity-name}-api.ts`

**Назначение:** Публичный API класс с HTTP методами и query options

**Структура:**

```typescript
import { {entityName}Keys } from './{entity-name}-keys'
import { {entityName}Requests } from './{entity-name}-requests'
import type { PaginatedResponse } from '@/shared/types'
import type { {EntityName}, {EntityName}Params } from './{entity-name}-types'

/**
 * API класс для {entity-name}
 * Содержит HTTP методы и query options
 */
class {EntityName}Api {
  findById = {entityName}Requests.findById
  findMany: (params?: {EntityName}Params) => Promise<PaginatedResponse<{EntityName}>> =
    {entityName}Requests.findMany
  create = {entityName}Requests.create
  update = {entityName}Requests.update
  delete = {entityName}Requests.delete

  /**
   * Query options для поиска {entity-name} по ID
   */
  findByIdOptions(id: string) {
    return {
      queryKey: {entityName}Keys.detail(id),
      queryFn: () => this.findById(id),
      enabled: !!id,
    }
  }

  /**
   * Query options для поиска многих {entity-name}s
   */
  findManyOptions(params?: {EntityName}Params) {
    return {
      queryKey: {entityName}Keys.list(params || {}),
      queryFn: () => this.findMany(params),
    }
  }
}

export const {entityName}Api = new {EntityName}Api()
```

**Правила:**

- Краткий JSDoc без примеров
- Краткий комментарий для каждой функции
- Только query options (без mutation options)
- Именование: `{request}Options`
- Делегирует HTTP методы к классу requests

### 5. `index.ts`

**Назначение:** Публичный API сущности

**Структура:**

```typescript
export * from './{entity-name}-types'
export * from './{entity-name}-keys'
export * from './{entity-name}-api'
```

**Правила:**

- Никаких комментариев в файле
- Только экспорт публичного API
- Не экспортировать `{entity-name}-requests.ts`

### 6. `README.md`

**Назначение:** Документация для сущности

**Структура:**

````markdown
# Сущность {Entity-Name}

## Описание

Сущность для работы с {entity-name}s в приложении. Предоставляет API методы, query keys и функции запросов для управления {entity-name}s с пагинацией, фильтрацией и CRUD операциями.

## API методы

### HTTP методы ({entityName}Api)

- `{entityName}Api.findById(id: string)` - Найти {entity-name} по ID
- `{entityName}Api.findMany(params?: {EntityName}Params)` - Найти много {entity-name}s с пагинацией и фильтрацией
- `{entityName}Api.create(data: Create{EntityName}Dto)` - Создать новый {entity-name}
- `{entityName}Api.update(id: string, data: Update{EntityName}Dto)` - Обновить {entity-name}
- `{entityName}Api.delete(id: string)` - Удалить {entity-name}

### Query Options ({entityName}Api)

- `{entityName}Api.findByIdOptions(id: string)` - Query options для поиска по ID
- `{entityName}Api.findManyOptions(params?: {EntityName}Params)` - Query options для поиска многих

**Примечание:** Mutation options обрабатываются в кастомных хуках, а не в API классе.

## Примеры использования

### В компонентах

```typescript
import { useQuery } from '@tanstack/react-query'
import { {entityName}Api } from '@/entities/{entity-name}'

// Использование query options
const { data: {entityName}, isLoading } = useQuery({entityName}Api.findByIdOptions(id))

// Прямой HTTP вызов
const {entityName} = await {entityName}Api.findById(id)
```
````

### В хуках

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { {entityName}Api, {entityName}Keys } from '@/entities/{entity-name}'

const queryClient = useQueryClient()

// Использование {entityName}Api напрямую в кастомных хуках
const create{EntityName}Mutation = useMutation({
  mutationFn: {entityName}Api.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
  },
})
```

## Типы

- `{EntityName}` - Основной тип сущности
- `{EntityName}Params` - Параметры запросов
- `Create{EntityName}Dto` - Данные для создания
- `Update{EntityName}Dto` - Данные для обновления

**Примечание:** Для пагинированных ответов используйте `PaginatedResponse<{EntityName}>` из `@/shared/types`.

## Структура файлов

```
entities/{entity-name}/
├── {entity-name}-types.ts      // Все типы и интерфейсы
├── {entity-name}-keys.ts       // TanStack Query keys
├── {entity-name}-requests.ts   // HTTP методы (класс {EntityName}Requests)
├── {entity-name}-api.ts        // API класс с query options
├── index.ts                   // Экспорты публичного API
└── README.md                  // Документация
```

## Архитектура

- **`{EntityName}Requests`** - Внутренний класс только с HTTP методами
- **`{EntityName}Api`** - Публичный API класс, который делегирует к {EntityName}Requests + предоставляет query options
- **Query options** - Только для запросов (findById, findMany), мутации обрабатываются в кастомных хуках
- **Типы** - Используйте общий `PaginatedResponse<T>` для пагинированных ответов

````

## 📝 Соглашения именования

### Именование файлов (kebab-case)

- `{entity-name}-types.ts` - все типы и интерфейсы
- `{entity-name}-keys.ts` - TanStack Query keys
- `{entity-name}-requests.ts` - HTTP методы (внутренние)
- `{entity-name}-api.ts` - публичный API класс

### Именование функций (camelCase)

- `findById` - поиск по ID
- `findMany` - поиск многих с пагинацией
- `create` - создание
- `update` - обновление
- `delete` - удаление

### Именование типов (PascalCase)

- `{EntityName}` - основная сущность
- `{EntityName}Params` - параметры запросов
- `Create{EntityName}Dto` - данные для создания
- `Update{EntityName}Dto` - данные для обновления

## 🔄 Инвалидация запросов

### Кастомные хуки для мутаций

Мутации должны обрабатываться в кастомных хуках с правильной инвалидацией:

```typescript
const useCreate{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

const useUpdate{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => {entityName}Api.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.detail(id) })
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}

const useDelete{EntityName} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: {entityName}Api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {entityName}Keys.all() })
    },
  })
}
````

## 🎯 Лучшие практики

1. **Единый источник истины**: Только `{EntityName}Api` экспортируется, `{EntityName}Requests` внутренний
2. **Типобезопасность**: Все методы должны быть полностью типизированы
3. **Обработка ошибок**: Используйте общую обработку ошибок из `@/shared/api`
4. **Кэширование**: Используйте подходящие query keys для эффективного кэширования
5. **Документация**: Документируйте все публичные методы и типы
6. **Консистентность**: Следуйте той же структуре для всех сущностей
7. **Тестирование**: Напишите тесты для всех API методов и query options
8. **Разделение**: Query options только для запросов, мутации в кастомных хуках
9. **Переиспользование**: Используйте общий `PaginatedResponse<T>` для пагинированных ответов
10. **Чистый код**: Краткие комментарии, сгруппированные интерфейсы, никаких лишних экспортов

## 📚 Связанная документация

- [Руководство по хукам функций](./features-hooks-guide.md)
- [Структура проекта](./project-structure.md)
- [Стандарты кода](../code-standards.md)
