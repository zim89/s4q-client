# Back/Forward Cache (bfcache) Optimization Guide

## 🎯 Цель

Оптимизировать Back/Forward Cache для улучшения производительности навигации и пользовательского опыта.

## 🔍 Что такое Back/Forward Cache?

**Back/Forward Cache (bfcache)** - это механизм браузера, который сохраняет состояние страницы в памяти при навигации. Когда пользователь нажимает "Назад" или "Вперед", страница загружается мгновенно из кэша.

### Преимущества:

- ⚡ **Мгновенная навигация** - страница загружается за 0ms
- 🔄 **Сохранение состояния** - формы, скролл позиция, состояние компонентов
- 📱 **Экономия трафика** - не нужно повторно загружать ресурсы
- 🎯 **Лучший UX** - плавная навигация

## ❌ Проблемы, которые блокируют bfcache

### 1. Cache-Control: no-store

```
Pages with cache-control:no-store header cannot enter back/forward cache.
```

**Причина:** Сервер отправляет заголовок, запрещающий кэширование.

**Решение:**

- Убрать `no-store` из заголовков
- Использовать `public, max-age=300` для статических страниц
- Добавить мета-теги в HTML

### 2. WebSocket соединения

```
Pages with WebSocket cannot enter back/forward cache.
Back/forward cache is disabled because WebSocket has been used.
```

**Причина:** WebSocket соединения несовместимы с bfcache.

**Решение:**

- Закрывать WebSocket при `pagehide`
- Переподключать при `pageshow`
- Использовать Server-Sent Events вместо WebSocket где возможно

### 3. Другие блокирующие факторы:

- `unload` события
- `beforeunload` события
- IndexedDB с незавершенными транзакциями
- BroadcastChannel API
- SharedWorker

## 🔧 Реализованные решения

### 1. Мета-теги в Layout

```html
<!-- Оптимизация Back/Forward Cache -->
<meta name="back-forward-cache" content="enabled" />
<meta name="cache-control" content="public, max-age=300" />
```

### 2. Утилиты для работы с bfcache

```typescript
// src/shared/utils/bfcache.utils.ts
export const setupBFCacheHandlers = () => {
  // Обработка восстановления из bfcache
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      console.log('🔄 Страница восстановлена из bfcache')
      // Обновляем данные если нужно
    }
  })

  // Обработка сохранения в bfcache
  window.addEventListener('pagehide', event => {
    if (event.persisted) {
      console.log('💾 Страница сохранена в bfcache')
    }
  })
}
```

### 3. Интеграция в AppProviders

```typescript
// src/app/providers/index.tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    setupBFCacheHandlers()
  }, [])

  return (
    <QueryProvider>
      {/* ... */}
    </QueryProvider>
  )
}
```

## 📊 Мониторинг bfcache

### 1. Проверка поддержки

```typescript
import { getBFCacheInfo, supportsBFCache } from '@/shared/utils'

// Проверяем поддержку
const isSupported = supportsBFCache()

// Получаем информацию
const info = getBFCacheInfo()
console.log(info)
```

### 2. DevTools

В Chrome DevTools:

1. Откройте **Application** tab
2. Перейдите в **Back/forward cache**
3. Проверьте статус для каждой страницы

### 3. Lighthouse

Lighthouse показывает проблемы с bfcache в разделе **Opportunities**:

- "Page prevented back/forward cache restoration"
- Список причин блокировки

## 🎯 Лучшие практики

### 1. Избегайте блокирующих факторов

```typescript
// ❌ Плохо - блокирует bfcache
window.addEventListener('beforeunload', () => {
  // Сохранение данных
})

// ✅ Хорошо - используйте pagehide
window.addEventListener('pagehide', event => {
  if (!event.persisted) {
    // Сохраняем только при реальном закрытии
  }
})
```

### 2. Правильная обработка событий

```typescript
// Обработка восстановления из bfcache
window.addEventListener('pageshow', event => {
  if (event.persisted) {
    // Обновляем данные
    refreshUserData()
    updateTimestamp()
  }
})
```

### 3. Оптимизация для мобильных устройств

```typescript
// Проверяем поддержку на мобильных
const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent)
const supportsBFCache = 'onpageshow' in window

if (isMobile && supportsBFCache) {
  // Дополнительная оптимизация для мобильных
}
```

## 🧪 Тестирование

### 1. Ручное тестирование

1. Откройте страницу
2. Перейдите на другую страницу
3. Нажмите "Назад"
4. Проверьте, что страница загрузилась мгновенно

### 2. DevTools тестирование

1. Откройте DevTools
2. Перейдите в **Application** → **Back/forward cache**
3. Нажмите **Test back/forward cache**
4. Проверьте результат

### 3. Lighthouse тестирование

```bash
npm run lighthouse http://localhost:3000/warsaw/beauty-1
```

Проверьте раздел **Opportunities** на наличие проблем с bfcache.

## 📈 Ожидаемые улучшения

После оптимизации bfcache:

- ⚡ **Навигация "Назад/Вперед"** - мгновенная загрузка
- 📱 **Мобильная производительность** - особенно важно для медленных соединений
- 🎯 **Улучшенный UX** - плавная навигация
- 📊 **Лучшие метрики** - улучшение Core Web Vitals

## 🔍 Отладка

### Проблемы и решения:

1. **Страница не кэшируется**
   - Проверьте заголовки Cache-Control
   - Убедитесь, что нет WebSocket соединений
   - Проверьте DevTools на блокирующие факторы

2. **Состояние не сохраняется**
   - Используйте `pagehide` вместо `beforeunload`
   - Сохраняйте состояние в localStorage/sessionStorage
   - Обновляйте данные при `pageshow`

3. **Проблемы с аутентификацией**
   - Проверяйте токены при восстановлении
   - Обновляйте заголовки авторизации
   - Используйте refresh token при необходимости
