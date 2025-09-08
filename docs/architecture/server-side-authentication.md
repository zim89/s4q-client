# 🔐 **Серверная аутентификация и получение данных**

## 🎯 **Общие принципы**

### **1. Проверка аутентификации на сервере**

Для корректной работы с приватными/публичными эндпоинтами на сервере необходимо
проверять наличие **обоих** токенов:

- `userId` - ID пользователя
- `accessToken` - токен доступа

```typescript
// ✅ Правильно - проверяем оба токена
const authStatus = await getAuthStatusFromCookies();
const isAuthenticated = authStatus.isAuthenticated; // true только если есть оба токена

// ❌ Неправильно - проверяем только userId
const userId = await getUserIdFromCookies();
const isAuthenticated = !!userId; // может быть true даже без access token
```

### **2. Получение данных агента**

В зависимости от статуса аутентификации используются разные эндпоинты:

```typescript
// Публичный эндпоинт (для неавторизованных пользователей)
GET / public / agents / { id };
// Возвращает: базовую информацию об агенте

// Приватный эндпоинт (для авторизованных пользователей)
GET / agents / { id };
// Возвращает: полную информацию + приватные данные
```

## 🔧 **Утилиты для серверной аутентификации**

### **1. `getAuthStatusFromCookies()`**

Основная функция для проверки аутентификации на сервере:

```typescript
import { getAuthStatusFromCookies } from '@/shared/utils'

const authStatus = await getAuthStatusFromCookies()

// Результат:
{
  isAuthenticated: boolean    // true если есть оба токена
  userId?: number            // ID пользователя (если аутентифицирован)
  accessToken?: string       // Access token (если аутентифицирован)
}
```

### **2. `isUserAuthenticated()`**

Быстрая проверка аутентификации:

```typescript
import { isUserAuthenticated } from "@/shared/utils";

const isAuth = await isUserAuthenticated(); // boolean
```

### **3. `getUserIdFromCookies()` (устаревшая)**

Для обратной совместимости:

```typescript
import { getUserIdFromCookies } from "@/shared/utils";

const userId = await getUserIdFromCookies(); // number | undefined
```

## 📝 **Примеры использования**

### **1. Серверный компонент для агента**

```typescript
// src/screens/agent/ui/agent-details.server.tsx
export const AgentDetailsServer = async ({ agentId }: Props) => {
  // Получаем статус аутентификации
  const authStatus = await getAuthStatusFromCookies()

  const queryClient = new QueryClient()

  try {
    // Префетчим данные агента с учетом аутентификации
    await queryClient.prefetchQuery({
      ...agentApi.getAgentByIdQueryOptions(
        Number(agentId),
        authStatus.isAuthenticated
      ),
      meta: { timeout: 5000 },
    })

    // Дополнительные запросы...
  } catch (error) {
    logError('Prefetch failed:', error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AgentDetails agentId={agentId} />
    </HydrationBoundary>
  )
}
```

### **2. Middleware для защиты роутов**

```typescript
// src/middleware.ts
import { getAuthStatusFromCookies } from "@/shared/utils";

export async function middleware(request: NextRequest) {
  const authStatus = await getAuthStatusFromCookies();

  // Защищаем приватные роуты
  if (
    request.nextUrl.pathname.startsWith("/profile") &&
    !authStatus.isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

### **3. API Route с проверкой аутентификации**

```typescript
// src/app/api/agents/[id]/route.ts
import { getAuthStatusFromCookies } from "@/shared/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const authStatus = await getAuthStatusFromCookies();

  try {
    // Используем соответствующий эндпоинт
    const agent = await agentApi.getAgentById(
      Number(params.id),
      authStatus.isAuthenticated,
    );

    return Response.json(agent);
  } catch (error) {
    return Response.json({ error: "Agent not found" }, { status: 404 });
  }
}
```

## 🚀 **Лучшие практики**

### **1. Всегда проверяйте оба токена**

```typescript
// ✅ Правильно
const authStatus = await getAuthStatusFromCookies();
if (authStatus.isAuthenticated) {
  // Пользователь точно аутентифицирован
}

// ❌ Неправильно
const userId = await getUserIdFromCookies();
if (userId) {
  // Может быть userId без access token
}
```

### **2. Используйте правильные эндпоинты**

```typescript
// ✅ Правильно - передаем статус аутентификации
const agent = await agentApi.getAgentById(agentId, authStatus.isAuthenticated);

// ❌ Неправильно - не передаем статус
const agent = await agentApi.getAgentById(agentId);
```

### **3. Обрабатывайте ошибки**

```typescript
try {
  const authStatus = await getAuthStatusFromCookies();
  // Логика...
} catch (error) {
  // Логируем ошибку, но не прерываем рендеринг
  logError("Auth check failed:", error);
  // Fallback к неавторизованному состоянию
  const authStatus = { isAuthenticated: false };
}
```

### **4. Кэширование и производительность**

```typescript
// Используйте кэширование для частых проверок
const authStatus = await getAuthStatusFromCookies();

// Настройте QueryClient для серверного рендеринга
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      retry: 1,
      gcTime: 10 * 60 * 1000, // 10 минут
    },
  },
});
```

## 🔒 **Безопасность**

### **1. Валидация токенов**

- Проверяйте формат и длину токенов
- Валидируйте userId (должен быть положительным числом)
- Обрабатывайте случаи с поврежденными куки

### **2. Обработка ошибок**

- Не раскрывайте детали ошибок аутентификации
- Логируйте подозрительную активность
- Предоставляйте fallback для неавторизованных пользователей

### **3. CORS и безопасность**

- Настройте правильные CORS заголовки
- Используйте `httpOnly` куки для токенов
- Проверяйте `SameSite` атрибуты

## 📋 **Чек-лист**

- [ ] Используйте `getAuthStatusFromCookies()` для проверки аутентификации
- [ ] Проверяйте наличие **обоих** токенов (userId + accessToken)
- [ ] Передавайте `isAuthenticated` в API методы
- [ ] Обрабатывайте ошибки аутентификации
- [ ] Используйте правильные эндпоинты (публичные/приватные)
- [ ] Настройте кэширование для производительности
- [ ] Логируйте ошибки для отладки
- [ ] Предоставляйте fallback для неавторизованных пользователей

## 🎯 **Заключение**

Правильная серверная аутентификация обеспечивает:

- **Безопасность** - корректная проверка токенов
- **Производительность** - использование правильных эндпоинтов
- **UX** - получение соответствующих данных для пользователя
- **Надежность** - обработка ошибок и fallback логика
