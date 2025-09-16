# Таблица карточек с серверной пагинацией

Это руководство объясняет, как использовать компонент Cards Table с серверной пагинацией, сортировкой и фильтрацией.

## Обзор

Таблица карточек построена с использованием TanStack Table с компонентами shadcn/ui и предоставляет:

- **Серверная пагинация** - Загружает данные только для текущей страницы
- **Серверная сортировка** - Сортировка обрабатывается API
- **Серверная фильтрация** - Поиск обрабатывается API
- **Управление состоянием URL** - Состояние таблицы синхронизировано с параметрами URL
- **Адаптивный дизайн** - Работает на всех размерах экрана

## Компоненты

### Основные компоненты

- **`CardsTable`** - Основной компонент таблицы со всей функциональностью
- **`cardsTableColumns`** - Определения колонок с сортировкой и действиями
- **`CardsTablePagination`** - Компонент управления пагинацией

### Структура файлов

```
src/features/card/ui/
├── cards-table.tsx              # Основной компонент таблицы
├── cards-table-columns.tsx      # Определения колонок
├── cards-table-pagination.tsx   # Компонент пагинации
└── index.ts                     # Экспорты
```

## Использование

### Базовое использование

```tsx
import { CardsTable } from '@/features/card'

export const MyPage = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Флешкарты</h1>
        <p className='text-muted-foreground'>
          Управляйте своей коллекцией флешкарт
        </p>
      </div>
      <CardsTable />
    </div>
  )
}
```

### Параметры URL

Таблица автоматически управляет этими параметрами URL:

- **`page`** - Номер текущей страницы (по умолчанию: 1)
- **`limit`** - Элементов на странице (по умолчанию: 10)
- **`search`** - Поисковый запрос
- **`sort`** - Поле сортировки (например, 'term', 'createdAt')
- **`order`** - Порядок сортировки ('asc' или 'desc')

Пример URL: `/cards?page=2&limit=20&search=hello&sort=term&order=asc`

## Функции

### 1. Пагинация

- **Выбор размера страницы**: 10, 20, 25, 30, 40, 50 элементов на странице
- **Навигация**: Кнопки первой, предыдущей, следующей, последней страницы
- **Счетчик страниц**: Показывает текущую страницу и общее количество страниц
- **Счетчик выбора**: Показывает количество выбранных строк

### 2. Сортировка

Сортируемые колонки:

- **Термин** - Сортировка по полю `term`
- **Создано** - Сортировка по полю `createdAt`

Нажмите на заголовки колонок для переключения сортировки (asc → desc → none).

### 3. Поиск

- **Глобальный поиск** - Поиск по всем полям карточки
- **В реальном времени** - Поиск обновляется при вводе
- **Синхронизация URL** - Поисковый запрос сохраняется в URL

### 4. Отображение колонок

Показываемые колонки:

- **Термин** - Основной контент с сортировкой
- **Часть речи** - Бейдж с частью речи
- **Сложность** - Цветной бейдж сложности
- **Транскрипция** - Фонетическая транскрипция
- **Тип** - Бейдж Глобальная/Личная
- **Создано** - Дата создания с сортировкой
- **Действия** - Выпадающее меню с действиями

### 5. Действия

Каждая строка имеет выпадающее меню с:

- **Копировать ID карточки** - Копировать ID карточки в буфер обмена
- **Просмотр деталей** - Просмотр деталей карточки (заглушка)
- **Редактировать карточку** - Редактировать карточку (заглушка)
- **Удалить карточку** - Удалить карточку (заглушка)

## Интеграция с API

### Поток данных

1. **Параметры URL** читаются с помощью `nuqs`
2. **Параметры** передаются в хук `useFindCards`
3. **API вызов** выполняется с серверной пагинацией
4. **Данные** отображаются в таблице
5. **Взаимодействие пользователя** обновляет параметры URL
6. **Новый API вызов** запускается автоматически

### Требуемый формат ответа API

API должен возвращать данные в этом формате:

```typescript
interface PaginatedResponse<Card> {
  data: Card[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

### Параметры API

Таблица отправляет эти параметры в API:

```typescript
interface CardParams {
  page?: number // Текущая страница (начиная с 1)
  limit?: number // Элементов на странице
  search?: string // Поисковый запрос
  sort?: CardSortField // Поле сортировки
  order?: SortOrder // Порядок сортировки ('asc' | 'desc')
}
```

## Кастомизация

### Добавление новых колонок

1. **Определите колонку** в `cardsTableColumns`:

```tsx
{
  accessorKey: 'newField',
  header: 'Новая колонка',
  cell: ({ row }) => {
    const value = row.getValue('newField')
    return <div>{value}</div>
  },
}
```

2. **Добавьте сортировку** если нужно:

```tsx
{
  accessorKey: 'newField',
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Новая колонка
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  // ... определение ячейки
}
```

### Кастомизация действий

Измените выпадающее меню действий в `cardsTableColumns`:

```tsx
{
  id: 'actions',
  cell: ({ row }) => {
    const card = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleCustomAction(card)}>
            Кастомное действие
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
```

### Стилизация

Таблица использует классы Tailwind CSS и может быть кастомизирована:

```tsx
// Кастомная обертка таблицы
<div className="w-full border rounded-lg">
  <CardsTable />
</div>

// Кастомное состояние загрузки
if (isLoading) {
  return <CustomLoadingComponent />
}
```

## Производительность

### Оптимизации

- **Серверная пагинация** - Загружает только данные текущей страницы
- **Debounced поиск** - Поиск задерживается для избежания избыточных API вызовов
- **URL состояние** - Состояние сохраняется в URL, нет ненужных перерендеров
- **Мемоизированные колонки** - Определения колонок мемоизированы

### Лучшие практики

1. **Используйте подходящие размеры страниц** - Не устанавливайте слишком большие размеры страниц
2. **Реализуйте debouncing поиска** - Избегайте API вызовов при каждом нажатии клавиши
3. **Кэшируйте ответы API** - Используйте TanStack Query для кэширования
4. **Оптимизируйте рендеринг колонок** - Используйте `useMemo` для сложных рендереров ячеек

## Устранение неполадок

### Частые проблемы

1. **Таблица не обновляется** - Проверьте, обновляются ли параметры URL
2. **Сортировка не работает** - Убедитесь, что API поддерживает поле сортировки
3. **Проблемы с пагинацией** - Проверьте, правильно ли установлен `pageCount`
4. **Поиск не работает** - Убедитесь, что API поддерживает параметр поиска

### Режим отладки

Добавьте логирование отладки, чтобы увидеть, какие параметры отправляются:

```tsx
useEffect(() => {
  console.log('Параметры таблицы:', params)
}, [params])
```

## Примеры

### Полный пример страницы

```tsx
'use client'

import { Plus } from 'lucide-react'
import { CardsTable } from '@/features/card'
import { Button } from '@/shared/components/ui/button'

export const CardsPage = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Флешкарты</h1>
          <p className='text-muted-foreground'>
            Управляйте своей коллекцией флешкарт
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Добавить карточку
        </Button>
      </div>
      <CardsTable />
    </div>
  )
}
```

### Кастомное состояние загрузки

```tsx
import { CardsTable } from '@/features/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export const CardsPageWithCustomLoading = () => {
  return (
    <div className='container py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Флешкарты</h1>
        <p className='text-muted-foreground'>
          Управляйте своей коллекцией флешкарт
        </p>
      </div>
      <Suspense fallback={<CardsTableSkeleton />}>
        <CardsTable />
      </Suspense>
    </div>
  )
}

const CardsTableSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-10 w-full' />
    <Skeleton className='h-64 w-full' />
    <Skeleton className='h-10 w-full' />
  </div>
)
```

## Связанная документация

- [Документация TanStack Table](https://tanstack.com/table/latest)
- [shadcn/ui Data Table](https://ui.shadcn.com/docs/components/data-table)
- [Документация nuqs](https://nuqs.47ng.com/)
- [Документация сущности Card](../entities/card/README.md)
