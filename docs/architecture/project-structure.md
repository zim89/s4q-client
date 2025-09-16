# Структура проекта FindOut Client

## Обзор архитектуры

Проект построен на принципах Feature-Sliced Design (FSD) с адаптацией для Next.js и специфики проекта.

## Корневая структура

```
space4quizlet/
├── docs/                    # Документация проекта
│   ├── auth-strategy.md    # Стратегия реализации аутентификации
│   └── project-structure.md # Структура проекта
├── public/                  # Статические файлы
│   ├── file.svg
│   ├── globe.svg
│   ├── icons/
│   │   ├── award-default.svg
│   │   ├── cert-default.svg
│   │   ├── graduation-cap-default.svg
│   │   ├── head-side-brain-default.svg
│   │   └── webcam-default.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                     # Исходный код
├── tools/                   # Инструменты разработки
│   └── eslint/
│       ├── custom-config.ts
│       └── rules/
│           ├── no-console.ts
│           └── index.ts
├── .eslintrc.json          # Конфигурация ESLint
├── .gitignore              # Правила игнорирования Git
├── next.config.js          # Конфигурация Next.js
├── package.json            # Зависимости проекта
├── postcss.config.js       # Конфигурация PostCSS
├── tailwind.config.js      # Конфигурация Tailwind CSS
└── tsconfig.json           # Конфигурация TypeScript
```

## Структура исходного кода (src/)

```
src/
├── app/                     # Next.js App Router
│   ├── (admin)/            # Группа роутов админки
│   │   └── admin/
│   │       └── page.tsx
│   ├── (auth)/             # Группа роутов аутентификации
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   ├── (base)/             # Базовая группа роутов
│   │   └── page.tsx
│   ├── (workspace)/        # Группа роутов рабочего пространства
│   │   └── workspace/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── favicon.ico
│   ├── globals.css         # Глобальные стили
│   └── layout.tsx          # Корневой layout
├── entities/               # Бизнес-сущности
│   ├── auth/              # Сущность аутентификации
│   │   ├── auth.api.ts
│   │   ├── auth.qkeys.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── user/              # Сущность пользователя
│       ├── user.api.ts
│       ├── user.qkeys.ts
│       ├── user.types.ts
│       └── index.ts
├── features/              # Бизнес-функции
│   ├── auth/              # Функция аутентификации
│   │   ├── model/
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   ├── use-register.ts
│   │   │   │   ├── use-logout.ts
│   │   │   │   ├── use-refresh.ts
│   │   │   │   └── index.ts
│   │   │   ├── store/
│   │   │   │   ├── auth-store.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── user/              # Функция пользователя
│       ├── model/
│       │   ├── hooks/
│       │   │   ├── use-user-profile.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── ui/
│       │   ├── user-profile.tsx
│       │   └── index.ts
│       └── index.ts
├── screens/               # Компоненты страниц
│   ├── auth/              # Страницы аутентификации
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── workspace/         # Страницы рабочего пространства
│       ├── page.tsx
│       ├── layout.tsx
│       └── ui/
│           ├── workspace-sidebar.tsx
│           ├── workspace-header.tsx
│           └── index.ts
├── shared/                # Общие ресурсы
│   ├── api/               # Конфигурация API
│   │   ├── axios.ts
│   │   ├── query-client.ts
│   │   └── index.ts
│   ├── components/        # Общие компоненты
│   │   ├── ui/            # UI компоненты
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── config/            # Конфигурация
│   │   ├── app-config.ts
│   │   ├── app-routes.ts
│   │   └── index.ts
│   ├── constants/         # Константы
│   │   ├── api-endpoints.ts
│   │   ├── query-params.ts
│   │   └── index.ts
│   ├── hooks/             # Общие хуки
│   │   ├── use-local-storage.ts
│   │   └── index.ts
│   ├── lib/               # Утилиты
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── index.ts
│   ├── types/             # Общие типы
│   │   ├── common.ts
│   │   └── index.ts
│   └── utils/             # Утилитарные функции
│       ├── auth-cookies.ts
│       ├── logger.ts
│       └── index.ts
└── widgets/               # Сложные UI блоки
    ├── header/
    │   ├── header.tsx
    │   └── index.ts
    └── sidebar/
        ├── sidebar.tsx
        └── index.ts
```

## Описание слоев

### 1. App Layer (`src/app/`)

- **Назначение**: Конфигурация Next.js App Router
- **Содержит**: Группы роутов, layouts, страницы
- **Правила**: Только логика роутинга, без бизнес-логики

### 2. Pages Layer (`src/screens/`)

- **Назначение**: Компоненты уровня страниц
- **Содержит**: Компоненты страниц, layouts
- **Правила**: Композиция функций и виджетов

### 3. Widgets Layer (`src/widgets/`)

- **Назначение**: Сложные UI блоки
- **Содержит**: Композитные компоненты
- **Правила**: Объединяют несколько функций

### 4. Features Layer (`src/features/`)

- **Назначение**: Бизнес-функции
- **Содержит**: Логику функций, хуки, компоненты
- **Правила**: Самодостаточная бизнес-логика

### 5. Entities Layer (`src/entities/`)

- **Назначение**: Бизнес-сущности
- **Содержит**: API методы, типы, query keys
- **Правила**: Чистая бизнес-логика, без UI

### 6. Shared Layer (`src/shared/`)

- **Назначение**: Общие ресурсы
- **Содержит**: Общие компоненты, утилиты, конфигурации
- **Правила**: Переиспользуемые во всех слоях

## Правила импортов

### Порядок импортов

1. **React и внешние библиотеки**
2. **Общие модули**
3. **Сущности**
4. **Функции**
5. **Локальные импорты**

### Пример

```typescript
// 1. React и внешние библиотеки
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
// 4. Функции
import { useAuth } from '@/features/auth'
// 3. Сущности
import { authApi } from '@/entities/auth'
// 2. Общие модули
import { Button } from '@/shared/components/ui/button'
import { logError } from '@/shared/utils'
// 5. Локальные импорты
import { workspaceData } from '../lib'
import { NavMain } from './nav-main'
```

## Соглашения именования файлов

### Файлы и папки

- **Используйте kebab-case**: `user-profile.tsx`, `auth-store.ts`
- **Все в нижнем регистре**: `button.tsx`, `input.tsx`
- **Разделяйте слова дефисами**: `use-user-profile.ts`

### Компоненты

- **Используйте PascalCase**: `UserProfile`, `AuthStore`
- **Описательные имена**: `LoginForm`, `UserCard`

### Функции и переменные

- **Используйте camelCase**: `getUserById`, `isLoading`
- **Описательные имена**: `handleSubmit`, `validateEmail`

## Лучшие практики

### 1. Изоляция слоев

- **Не импортируйте из вышестоящих слоев**: Features не могут импортировать из Pages
- **Используйте shared слой**: Общая функциональность идет в shared
- **Независимость сущностей**: Сущности не зависят от других слоев

### 2. Структура компонентов

- **Единая ответственность**: Один компонент, одна цель
- **Композиция вместо наследования**: Объединяйте маленькие компоненты
- **Интерфейс props**: Используйте тип `Props` для props компонента

### 3. Управление состоянием

- **Локальное состояние**: Используйте `useState` для состояния компонента
- **Глобальное состояние**: Используйте Zustand для состояния приложения
- **Состояние сервера**: Используйте TanStack Query для данных API

### 4. Обработка ошибок

- **Error boundaries**: Ловите и обрабатывайте ошибки gracefully
- **Toast уведомления**: Предоставляйте обратную связь пользователю
- **Логирование**: Используйте структурированное логирование для отладки

### 5. Производительность

- **Разделение кода**: Ленивая загрузка компонентов когда возможно
- **Мемоизация**: Используйте `useMemo` и `useCallback` уместно
- **Оптимизация запросов**: Используйте правильные query keys и кэширование

## Связанная документация

- [Руководство по структуре сущностей](./entity-structure-guide.md)
- [Руководство по хукам функций](./features-hooks-guide.md)
- [Стандарты кода](../code-standards.md)
