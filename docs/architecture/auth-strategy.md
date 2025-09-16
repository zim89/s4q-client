# Стратегия реализации системы аутентификации

## Обзор архитектуры

### Структура папок

```
src/
├── entities/auth/           # API типы, функции и query keys
│   ├── auth.api.ts         # API методы
│   ├── auth.types.ts       # TypeScript типы
│   └── query-keys.ts       # Auth query keys
├── features/auth/           # Бизнес-логика auth
│   └── model/
│       ├── store/          # Zustand store
│       │   ├── auth-store.ts
│       │   └── auth-store-provider.tsx
│       ├── use-auth-store.tsx
│       ├── use-auth-status.ts
│       ├── use-require-auth.tsx
│       ├── use-login.ts
│       ├── use-register.ts
│       ├── use-google-auth.ts
│       ├── use-refresh-token.ts
│       ├── use-logout.ts
│       └── index.ts
├── shared/
│   ├── api/                # Axios + interceptors
│   ├── constants/          # queryParamKeys, persistKeys
│   └── utils/              # auth-cookies
└── middleware.ts           # Route protection
```

## Этапы внедрения

### Этап 1: Управление куками

**Цель:** Централизованное управление auth куками с поддержкой мультидоменности

**Созданные файлы:**

- `src/shared/utils/auth-cookies.ts`
- `src/shared/constants/persist-keys.ts`

**Ключевые решения:**

```typescript
// Доменно-специфичные ключи
const accessTokenStorage = createCookieStorage(
  getDomainSpecificKey(persistKeys.accessToken, appConfig.country),
)

// Безопасные атрибуты кук
const secureAuthCookieAttrs = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
}
```

**API:**

```typescript
authCookies.set({ accessToken, refreshToken, userId })
authCookies.getAccessToken()
authCookies.clear()
authCookies.hasAuth()
```

**⚠️ Важно: Правильное удаление куки с доменом**

При удалении куки необходимо передавать те же атрибуты, что и при установке:

```typescript
// ✅ ПРАВИЛЬНО - передаем атрибуты при удалении
Cookies.remove(key, cookieAttrs)

// ❌ НЕПРАВИЛЬНО - без атрибутов не работает на продакшене
Cookies.remove(key)
```

Это критично для продакшена, где используется `NEXT_PUBLIC_COOKIE_DOMAIN`.

### Этап 2: Интерцепторы Axios

**Цель:** Автоматическое обновление токенов и обработка 401 ошибок

**Созданные файлы:**

- `src/shared/api/auth-interceptors.ts`

**Ключевые решения:**

```typescript
// Очередь для параллельных запросов при refresh
let isRefreshing = false
const failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: Error) => void
}> = []

// Request interceptor - добавляет Authorization header
setupRequestInterceptor(axiosInstance)

// Response interceptor - обрабатывает 401 и refresh
setupResponseInterceptor(axiosInstance)
```

**⚠️ Важно: Избегание циклических зависимостей**

В интерцепторах **НЕ используйте** `authApi` для refresh токена, так как это
создает циклическую зависимость:

```typescript
// ❌ НЕПРАВИЛЬНО - создает цикл
import { authApi } from '@/entities/auth'

const response = await authApi.refreshToken()
```

```typescript
// ✅ ПРАВИЛЬНО - прямой fetch без цикла
import { apiRoutes } from './api-routes'

const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_URL}${apiRoutes.auth.refresh}`,
  {},
  { withCredentials: true },
)
```

**Циклическая зависимость:**

```
auth-interceptors.ts → authApi → axios → auth-interceptors.ts
```

**Логика refresh:**

1. Перехват 401 ошибки
2. Попытка refresh токена (прямой fetch)
3. Обновление кук
4. Повтор запроса
5. Очистка при критической ошибке

### 🔄 **Схема обработки 401 ошибок (на примере)**

**Сценарий:** Пользователь делает запрос на приватный эндпоинт агента, но токен
истек

#### Шаг 1: Исходный запрос

```typescript
// Пользователь запрашивает приватные данные агента
agentApi.getAgentById(123) // GET /agents/123
```

#### Шаг 2: Сервер возвращает 401

```typescript
// Сервер: "Токен истек"
HTTP 401 Unauthorized
{
  "message": "jwt expired"
}
```

#### Шаг 3: Interceptor перехватывает ошибку

```typescript
// Response interceptor проверяет:
shouldRefreshToken(error) // true - 401 ошибка
originalRequest._isRetry // false - первый раз
```

#### Шаг 4: Автоматический refresh токена

```typescript
// Interceptor автоматически (прямой fetch без authApi):
const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BASE_URL}${apiRoutes.auth.refresh}`,
  {}, // refresh token отправляется в куки
  { withCredentials: true },
)

// Обновляет токены в куки
authCookies.accessToken.set(response.data.accessToken)
authCookies.refreshToken.set(response.data.refreshToken)
```

#### Шаг 5: Повтор оригинального запроса

```typescript
// С новым токеном повторяет запрос:
originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
return axiosInstance.request(originalRequest);
```

#### Шаг 6: Успешный ответ

```typescript
// Пользователь получает данные без перелогина
HTTP 200 OK
{
  "data": {
    "id": 123,
    "name": "AI Assistant",
    "privateData": "..." // приватные данные
  }
}
```

### 🎯 **Обработка параллельных запросов**

**Сценарий:** Несколько запросов одновременно при истекшем токене

```typescript
// Запрос 1: agentApi.getAgentById(123)
// Запрос 2: agentApi.getUserAgents()
// Запрос 3: agentApi.toggleFavorite(456)

// Все три запроса получают 401 одновременно
```

**Решение через очередь:**

```typescript
if (isRefreshing) {
  // Запросы 2 и 3 добавляются в очередь
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
}

// Только запрос 1 делает refresh
// После успешного refresh все запросы выполняются
processQueue(null, newAccessToken);
```

### 🚨 **Критические ошибки refresh**

**Сценарий:** Refresh токен тоже истек или недействителен

```typescript
// Refresh запрос возвращает ошибку:
HTTP 401 Unauthorized
{
  "message": "Invalid refresh token"
}
```

**Автоматическая очистка:**

```typescript
if (isCriticalRefreshError(refreshError)) {
  // Очищаем все куки
  authCookies.accessToken.clear()
  authCookies.refreshToken.clear()
  authCookies.userId.clear()

  // Редирект на логин
  window.location.href = '/login'
}
```

### ✅ **Преимущества схемы**

1. **Прозрачность** - пользователь не замечает refresh
2. **Автоматичность** - не нужно обрабатывать в каждом запросе
3. **Очередь** - параллельные запросы не конфликтуют
4. **Fallback** - при критических ошибках редирект на логин
5. **Синхронизация** - куки и store всегда в актуальном состоянии

### Этап 3: Промежуточное ПО (Middleware)

**Цель:** Защита приватных роутов на уровне Next.js

**Обновленный файл:**

- `src/middleware.ts`

**Ключевые решения:**

```typescript
const PRIVATE_ROUTES = ["/profile", "/dashboard"];

const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Проверка в middleware
if (isPrivateRoute(pathname)) {
  const { accessToken } = getAuthTokens(request);
  if (!accessToken || !isTokenValid(accessToken)) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}&expired=true`, request.url),
    );
  }
}
```

### Этап 4: Zustand Store (Клиентский стейт)

**Цель:** Синхронизация клиентского состояния с куками

**Созданные файлы:**

- `src/features/auth/model/store/auth-store.ts`
- `src/features/auth/model/store/auth-store-provider.tsx`
- `src/features/auth/model/use-auth-store.tsx`

**Ключевые решения:**

```typescript
interface AuthState {
  userId: number | null
  accessToken: string | null
  myFavoriteAgentIds: number[]
}

interface AuthActions {
  setAuth: (auth: {
    userId: number
    accessToken: string
    myFavoriteAgentIds?: number[]
  }) => void
  updateAccessToken: (accessToken: string) => void
  updateMyFavoriteAgentIds: (myFavoriteAgentIds: number[]) => void
  logout: () => void
}

// Вычисляемые свойства
interface AuthComputed {
  isAuthenticated: boolean
}
```

**Синхронизация с куками:**

```typescript
setAuth: ({ userId, accessToken, myFavoriteAgentIds = [] }) => {
  // Сохраняем в куки для SSR/миддлвар
  authCookies.accessToken.set(accessToken)
  authCookies.userId.set(String(userId))

  // Сохраняем в стейт для клиента
  set({
    userId,
    accessToken,
    myFavoriteAgentIds,
  })
}
```

**Persist конфигурация:**

```typescript
persist: {
  name: persistKeys.authStore,
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({
    userId: state.userId,
    accessToken: state.accessToken,
    myFavoriteAgentIds: state.myFavoriteAgentIds,
  }),
  onRehydrateStorage: () => state => {
    // При восстановлении из localStorage синхронизируем с куки
    if (state?.accessToken && state?.userId) {
      authCookies.accessToken.set(state.accessToken)
      authCookies.userId.set(String(state.userId))
    }
  }
}
```

### Этап 5: Хуки аутентификации

**Цель:** React хуки для управления аутентификацией с TanStack Query

**Созданные файлы:**

- `src/features/auth/model/use-auth-store.tsx` - доступ к store
- `src/features/auth/model/use-auth-status.ts` - мониторинг состояния
- `src/features/auth/model/use-require-auth.tsx` - защита функциональности
- `src/features/auth/model/use-login.ts` - вход с rollback
- `src/features/auth/model/use-register.ts` - регистрация с автологином
- `src/features/auth/model/use-google-auth.ts` - Google авторизация
- `src/features/auth/model/use-refresh-token.ts` - обновление токена
- `src/features/auth/model/use-logout.ts` - выход с очисткой кэша

**Ключевые решения:**

#### useAuthStore

```typescript
// Доступ к auth store
const { userId, accessToken, isAuthenticated } = useAuthStore(state => ({
  userId: state.userId,
  accessToken: state.accessToken,
  isAuthenticated: state.isAuthenticated,
}))
```

#### useAuthStatus

```typescript
// Мониторинг состояния аутентификации
const { isAuthenticated, userId, authStatus, isLoading } = useAuthStatus();

// Query для проверки валидности токена
const { data: authStatus } = useQuery({
  queryKey: authQueryKeys.status(),
  queryFn: async () => ({
    isValid: isAuthenticated,
    userId,
    hasToken: !!accessToken,
  }),
  enabled: isAuthenticated,
});
```

#### useRequireAuth

```typescript
// Защита функциональности
const { requireAuth } = useRequireAuth({
  onAuthSuccess: () => console.log('Auth successful'),
  onAuthCancel: () => console.log('Auth cancelled'),
  redirect: '/profile', // опционально
  showModal: true, // опционально
})

const handleFavoriteClick = () => {
  requireAuth(() => {
    // Код выполнится только после авторизации
    addToFavorites(agentId)
  })
}
```

#### useLogin

```typescript
const [redirect] = useQueryState(queryParamKeys.redirect)

onSuccess: response => {
  setAuth({
    userId: response.data.user.id,
    accessToken: response.data.accessToken,
    myFavoriteAgentIds: response.data.user.myFavoriteAgentIds || [],
  })

  toast.success('Вход выполнен успешно!')

  // Инвалидируем связанные запросы
  queryClient.invalidateQueries({ queryKey: userQueryKeys.root() })
  queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })

  router.push(redirect || '/')
}
```

#### useRegister

```typescript
onSuccess: response => {
  // Сохраняем данные аутентификации в стейт (нет подтверждения почты)
  setAuth({
    userId: response.data.user.id,
    accessToken: response.data.accessToken,
    myFavoriteAgentIds: response.data.user.myFavoriteAgentIds || [],
  })

  toast.success('Регистрация прошла успешно! Добро пожаловать!')

  router.push(redirect || '/')
}
```

#### useGoogleAuth

```typescript
onSuccess: ({ data }) => {
  toast.success('Вход через Google выполнен успешно!')

  setAuth({
    userId: data.user.id,
    accessToken: data.accessToken,
    myFavoriteAgentIds: data.user.myFavoriteAgentIds,
  })

  // Обрабатываем редирект после успешной авторизации
  if (nextUrl) {
    router.replace(target)
    clearRedirect()
  } else {
    router.replace(appRoutes.profile.index)
  }
}
```

#### useLogout

```typescript
onSuccess: () => {
  logout() // очищает store и куки

  toast.success('Выход выполнен успешно')

  // Инвалидируем все связанные запросы
  queryClient.invalidateQueries({ queryKey: userQueryKeys.root() })
  queryClient.invalidateQueries({ queryKey: authQueryKeys.root })

  router.push('/')
}
```

### Этап 6: Ключи для кэширования

**Цель:** Единообразная структура query keys для всех сущностей

**Обновленные файлы:**

- `src/entities/auth/query-keys.ts`
- `src/entities/user/user.qkeys.ts`
- `src/entities/agent/agent.qkeys.ts`
- `src/entities/review/query-keys.ts`
- `src/entities/category/query-keys.ts`

**Ключевые решения:**

#### Единая структура для всех ключей

```typescript
// Стандартная структура для всех сущностей
export const entityKeys = {
  root: ['entity'] as const, // Базовый ключ (не функция)
  lists: () => [...entityKeys.root, 'list'] as const,
  byId: (id: number) => [...entityKeys.root, 'by-id', id] as const,
  // ... другие ключи
}
```

#### Auth Query Keys

```typescript
export const authQueryKeys = {
  root: ['auth'] as const,
  status: () => [...authQueryKeys.root, 'status'] as const,
  validate: () => [...authQueryKeys.root, 'validate'] as const,
  login: () => [...authQueryKeys.root, 'login'] as const,
  register: () => [...authQueryKeys.root, 'register'] as const,
  google: () => [...authQueryKeys.root, 'google'] as const,
  refresh: () => [...authQueryKeys.root, 'refresh'] as const,
  logout: () => [...authQueryKeys.root, 'logout'] as const,
} as const
```

#### User Query Keys

```typescript
export const userQueryKeys = {
  root: ['user'] as const,
  lists: () => [...userQueryKeys.root, 'list'] as const,
  profile: () => [...userQueryKeys.root, 'profile'] as const,
  user: (userId: number) =>
    [...userQueryKeys.root, 'user-details', userId] as const,
  settings: (userId: number) =>
    [...userQueryKeys.root, 'settings', userId] as const,
  stats: (userId: number) => [...userQueryKeys.root, 'stats', userId] as const,
  activity: (userId: number) =>
    [...userQueryKeys.root, 'activity', userId] as const,
} as const
```

### Этап 7: URL параметры

**Цель:** Централизованное управление query параметрами

**Созданные файлы:**

- `src/shared/constants/query-param-keys.ts`

**Ключевые решения:**

```typescript
export const queryParamKeys = {
  redirect: 'redirect',
} as const

export type QueryParamKey = (typeof queryParamKeys)[keyof typeof queryParamKeys]
```

## Дополнительные улучшения

### Утилита SSR Prefetch

**Файл:** `src/shared/api/prefetch-utils.ts`

**Цель:** Унификация SSR prefetch логики

```typescript
export async function createServerPrefetchClient<TData = unknown>(
  queryOptions: FetchQueryOptions<TData>,
  config: PrefetchConfig = {}
) {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(queryOptions)

  return {
    dehydratedState: dehydrate(queryClient),
    HydrationBoundary: ({ children }: { children: React.ReactNode }) => (
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    ),
  }
}
```

## Константы и типы

### Persist Keys

```typescript
export const persistKeys = {
  accessToken: 'fdout_at',
  authStore: 'fdout_auth_store',
  userId: 'fdout_user_id',
} as const
```

### Auth Types

```typescript
interface User extends BaseEntity {
  id: number
  email: string
  firstName: string
  lastName: string
  myFavoriteAgentIds: number[]
  // ... другие поля
}

interface AuthResponse {
  user: User
  accessToken: string
  isNewUser: boolean
}

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}
```

### Toast сообщения (Русский язык)

```typescript
// Успешные операции
toast.success('Вход выполнен успешно!')
toast.success('Регистрация прошла успешно! Добро пожаловать!')
toast.success('Вход через Google выполнен успешно!')
toast.success('Выход выполнен успешно')

// Ошибки
toast.error('Ошибка входа. Проверьте данные и попробуйте снова.')
toast.error('Ошибка регистрации. Попробуйте снова.')
toast.error('Ошибка входа через Google. Попробуйте снова.')

// Предупреждения
toast.warning('Выход выполнен (с предупреждением)')
```

## Рекомендации для других проектов

### 1. Порядок внедрения

1. Управление куками (база)
2. Интерцепторы Axios (автоматизация)
3. Middleware (защита)
4. Store (клиентский стейт)
5. Хуки (React интеграция)
6. Query Params (URL управление)

### 2. Ключевые принципы

- **Централизация** - все auth логика в одном месте
- **Типобезопасность** - TypeScript везде
- **Единообразие** - одинаковая структура query keys
- **Безопасность** - `httpOnly`, `secure`, `sameSite`
- **Синхронизация** - store ↔ cookies ↔ interceptors
- **Локализация** - все сообщения на русском языке

### 3. Технологический стек

- **Next.js** - middleware, SSR
- **TanStack Query** - мутации и кэширование
- **Zustand** - клиентский стейт
- **Axios** - HTTP клиент с интерцепторами
- **Cookies** - серверный доступ к токенам

### 4. Паттерны

- **Provider Pattern** - AuthStoreProvider
- **Hook Pattern** - useAuthStore, useAuthStatus, useRequireAuth, useLogin,
  useRegister, useLogout
- **Interceptor Pattern** - автоматический refresh
- **Middleware Pattern** - защита роутов
- **Store Pattern** - Zustand с вычисляемыми свойствами
- **Query Keys Pattern** - единообразная структура ключей

## Известные проблемы и решения

### Проблема удаления куки на продакшене

**Проблема:** На локальном хосте при логауте куки корректно удалялись, но на
продакшене - нет.

**Причина:** В функции `createCookieStorage` при удалении куки не передавались
атрибуты домена, которые использовались при установке.

**Решение:** Обновлена функция `createCookieStorage` в
`src/shared/utils/cookie-storage.utils.ts`:

```typescript
// Было
clear() {
  Cookies.remove(key) // Без атрибутов
}

// Стало
clear() {
  Cookies.remove(key, cookieAttrs) // С атрибутами
}
```

**Результат:** Куки теперь корректно удаляются как на локальном хосте, так и на
продакшене.

## Заключение

Данная стратегия обеспечивает:

- ✅ Полную типизацию TypeScript
- ✅ Автоматическое обновление токенов через interceptors
- ✅ Защиту приватных роутов через middleware
- ✅ Синхронизацию клиент/сервер через cookies
- ✅ Единообразную структуру query keys
- ✅ Локализованные сообщения на русском языке
- ✅ Масштабируемость и переиспользование
- ✅ Современные паттерны React/Next.js
- ✅ Корректную работу с куки на всех доменах
