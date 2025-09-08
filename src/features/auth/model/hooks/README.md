# Хуки аутентификации

Обновленные кастомные хуки аутентификации, соответствующие лучшим практикам TanStack Query.

## Доступные хуки

### `useLogin`

Хук для входа пользователя в систему.

**Особенности:**

- ✅ Retry логика (2 попытки)
- ✅ Оптимистичные обновления с rollback
- ✅ Инвалидация связанных запросов
- ✅ Отмена исходящих запросов
- ✅ Обработка ошибок с восстановлением состояния
- ✅ Toast уведомления на русском языке
- ✅ Поддержка callbacks (onSuccess, onError, onSettled)
- ✅ JSDoc документация

```typescript
const loginMutation = useLogin({
  onSuccess: data => console.log('Успешный вход:', data),
  onError: error => console.error('Ошибка входа:', error),
})

const handleLogin = () => {
  loginMutation.mutate({ email: 'user@example.com', password: 'password' })
}
```

### `useRegister`

Хук для регистрации нового пользователя.

**Особенности:**

- ✅ Retry логика (1 попытка)
- ✅ Инвалидация auth запросов
- ✅ Улучшенная обработка ошибок
- ✅ Toast уведомления на русском языке
- ✅ Поддержка callbacks (onSuccess, onError, onSettled)
- ✅ JSDoc документация

```typescript
const registerMutation = useRegister({
  onSuccess: data => console.log('Успешная регистрация:', data),
  onError: error => console.error('Ошибка регистрации:', error),
})

const handleRegister = () => {
  registerMutation.mutate({
    email: 'user@example.com',
    password: 'password',
    firstName: 'User',
    lastName: 'Name',
  })
}
```

### `useLogout`

Хук для выхода пользователя из системы.

**Особенности:**

- ✅ Без retry логики (не нужно повторять логаут)
- ✅ Очистка всего кэша
- ✅ Инвалидация всех связанных запросов
- ✅ Обработка ошибок с принудительной очисткой
- ✅ Toast уведомления на русском языке
- ✅ Поддержка callbacks (onSuccess, onError, onSettled)
- ✅ JSDoc документация

```typescript
const logoutMutation = useLogout({
  onSuccess: () => console.log('Успешный выход'),
  onError: error => console.error('Ошибка выхода:', error),
})

const handleLogout = () => {
  logoutMutation.mutate()
}
```

### `useRefreshToken`

Хук для обновления токенов аутентификации.

**Особенности:**

- ✅ Retry логика (3 попытки)
- ✅ Автоматический логаут при ошибке
- ✅ Обновление токенов в store и куки
- ✅ Toast уведомления на русском языке
- ✅ Поддержка callbacks (onSuccess, onError, onSettled)
- ✅ JSDoc документация

```typescript
const refreshMutation = useRefreshToken({
  onSuccess: data => console.log('Токен обновлен:', data),
  onError: error => console.error('Ошибка обновления токена:', error),
})

const handleRefresh = () => {
  refreshMutation.mutate()
}
```

### `useAuthStatus`

Хук для проверки статуса аутентификации пользователя.

**Особенности:**

- ✅ Вычисление статуса аутентификации на основе userId и accessToken
- ✅ Простой и быстрый доступ к статусу
- ✅ Не требует дополнительных запросов к серверу
- ✅ Автоматическое обновление при изменении состояния

```typescript
const { isAuthenticated, userId, hasToken } = useAuthStatus()
```

**Возвращаемые значения:**

- `isAuthenticated` - статус аутентификации (boolean)
- `userId` - ID пользователя (number | null)
- `hasToken` - наличие токена доступа (boolean)

**Случаи использования:**

1. **Защищенные роуты** - проверка доступа к страницам
2. **Условный рендеринг** - показ/скрытие элементов интерфейса
3. **Валидация токена** - проверка актуальности токена
4. **Навигация** - редирект на основе статуса

**Примеры использования:**

```typescript
// Защищенный роут
const ProtectedPage = () => {
  const { isAuthenticated } = useAuthStatus()

  if (!isAuthenticated) return <Redirect to="/login" />

  return <Dashboard />
}

// Условный рендеринг
const Header = () => {
  const { isAuthenticated } = useAuthStatus()

  return (
    <header>
      {isAuthenticated ? <UserMenu /> : <LoginButton />}
    </header>
  )
}

// Проверка наличия токена
const TokenValidator = () => {
  const { hasToken } = useAuthStatus()

  useEffect(() => {
    if (!hasToken) {
      showLoginModal()
    }
  }, [hasToken])

  return null
}
```

## Query Keys

Все хуки используют существующие query keys из `src/entities/auth/auth.qkeys.ts`:

```typescript
export const authKeys = {
  root: ['auth'] as const,
}
```

Для связанных запросов используются стандартные ключи: `['user']`, `['profile']`, `['favorites']`.

## Лучшие практики TanStack Query

### 1. Retry логика

- **Login**: 2 попытки с экспоненциальной задержкой
- **Register**: 1 попытка с фиксированной задержкой
- **Logout**: Без retry (не нужно повторять)
- **Refresh**: 3 попытки с экспоненциальной задержкой

### 2. Инвалидация кэша

- После успешных операций инвалидируются связанные запросы
- Используется `onSettled` для гарантированной инвалидации
- При логауте очищается весь кэш

### 3. Оптимистичные обновления

- `onMutate` для отмены исходящих запросов
- Сохранение предыдущего состояния для rollback
- Восстановление состояния при ошибках

### 4. Обработка ошибок

- Логирование ошибок в консоль
- Rollback состояния при ошибках
- Принудительная очистка при критических ошибках

### 5. Типизация

- Строгая типизация всех параметров и возвращаемых значений
- Типизированные query keys
- Совместимость с TypeScript

## Выбор между `useAuthStatus` и `useAuthStore`

### Когда использовать `useAuthStatus`:

✅ **Рекомендуется для:**

- Проверки статуса аутентификации в компонентах
- Условного рендеринга на основе статуса
- Защищенных роутов
- Простых проверок доступа

```typescript
// Защищенный роут
const ProtectedPage = () => {
  const { isAuthenticated } = useAuthStatus()

  if (!isAuthenticated) return <Navigate to="/login" />

  return <Dashboard />
}

// Условный рендеринг
const Header = () => {
  const { isAuthenticated } = useAuthStatus()

  return (
    <header>
      {isAuthenticated ? <UserMenu /> : <LoginButton />}
    </header>
  )
}
```

### Когда использовать `useAuthStore` напрямую:

✅ **Рекомендуется для:**

- Доступа к конкретным данным пользователя (userId, accessToken, etc.)
- Выполнения действий (setAuth, logout, updateTokens)
- Компонентов с высокой частотой рендера
- Когда нужны только базовые данные без вычислений

```typescript
// Доступ к данным пользователя
const UserProfile = () => {
  const userId = useAuthStore(state => state.userId)
  const favoriteServices = useAuthStore(state => state.favoriteServices)

  return <div>User ID: {userId}</div>
}

// Выполнение действий
const LogoutButton = () => {
  const logout = useAuthStore(state => state.logout)

  return <button onClick={logout}>Logout</button>
}
```

## Использование

```typescript
import {
  useAuthStatus,
  useLogin,
  useLogout,
  useRefreshToken,
  useRegister,
} from '@/features/auth'

// В компоненте
const MyComponent = () => {
  const loginMutation = useLogin({
    onSuccess: () => router.push('/dashboard'),
    onError: error => console.error('Login failed:', error),
  })

  const registerMutation = useRegister({
    onSuccess: () => toast.success('Регистрация успешна!'),
    onError: error => console.error('Registration failed:', error),
  })

  const logoutMutation = useLogout({
    onSuccess: () => router.push('/'),
    onError: error => console.error('Logout failed:', error),
  })

  const { isAuthenticated } = useAuthStatus()

  // ...
}
```

## 🚀 Лучшие практики

### Использование хуков

```typescript
// ✅ Правильно - с опциями
const loginMutation = useLogin({
  onSuccess: (data) => {
    // Дополнительная логика при успехе
    router.push('/dashboard')
  },
  onError: (error) => {
    // Дополнительная обработка ошибок
    analytics.track('login_error', { error: error.message })
  }
})

// ✅ Правильно - без опций
const loginMutation = useLogin()

// ❌ Неправильно - старый способ
const { login, isLoading } = useLogin()
```

### Retry логика

```typescript
// ✅ Для критических операций (вход, обновление токена)
retry: 2-3,
retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000)

// ✅ Для некритичных операций (регистрация, выход)
retry: 1,
retryDelay: 2000

// ✅ Для логаута
retry: false
```

### Toast уведомления

```typescript
// ✅ Успех
toast.success('Операция выполнена успешно')

// ✅ Ошибка
toast.error('Не удалось выполнить операцию. Попробуйте снова.')

// ✅ Предупреждение
toast.warning('Операция выполнена с предупреждениями')
```

### Callbacks

```typescript
// ✅ onSuccess - для дополнительной логики при успехе
onSuccess: data => {
  // Навигация, аналитика, обновление UI
  router.push('/dashboard')
  analytics.track('login_success')
}

// ✅ onError - для дополнительной обработки ошибок
onError: error => {
  // Логирование, аналитика, fallback логика
  logError('Login failed:', error)
  analytics.track('login_error', { error: error.message })
}

// ✅ onSettled - для логики, выполняемой всегда
onSettled: () => {
  // Очистка, сброс состояний, аналитика
  resetForm()
  analytics.track('login_completed')
}
```
