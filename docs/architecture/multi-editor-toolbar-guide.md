# Multi-Editor Toolbar Architecture Guide

## Overview

This guide explains how to implement a single toolbar that controls multiple Tiptap editors on the same page. This is useful for scenarios like split-pane editors, tabbed editors, or any interface where multiple text editors need to share the same formatting controls.

## Problem Statement

When you have multiple editors on a page, each with its own toolbar, you face several issues:

- **UI Clutter**: Multiple toolbars take up valuable screen space
- **Inconsistency**: Different editors might have different formatting states
- **User Confusion**: Users don't know which editor the toolbar controls
- **Code Duplication**: Each editor needs its own toolbar component

## Solution: Shared Toolbar Architecture

The solution is to have a single toolbar that dynamically controls the currently active editor.

## Architecture Patterns

### 1. Context-Based Approach (Recommended)

This is the most React-friendly and scalable approach.

#### Core Components

**EditorContext.tsx**

```typescript
import { createContext, useContext, useState, ReactNode } from 'react'
import { Editor } from '@tiptap/react'

interface EditorContextType {
  activeEditor: Editor | null
  setActiveEditor: (editor: Editor | null) => void
  editors: Editor[]
  registerEditor: (editor: Editor) => void
  unregisterEditor: (editor: Editor) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return context
}

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null)
  const [editors, setEditors] = useState<Editor[]>([])

  const registerEditor = (editor: Editor) => {
    setEditors(prev => [...prev, editor])
    // Set as active if no active editor
    if (!activeEditor) {
      setActiveEditor(editor)
    }
  }

  const unregisterEditor = (editor: Editor) => {
    setEditors(prev => {
      const newEditors = prev.filter(e => e !== editor)
      // If we're removing the active editor, switch to another one
      if (activeEditor === editor) {
        setActiveEditor(newEditors[0] || null)
      }
      return newEditors
    })
  }

  return (
    <EditorContext.Provider value={{
      activeEditor,
      setActiveEditor,
      editors,
      registerEditor,
      unregisterEditor
    }}>
      {children}
    </EditorContext.Provider>
  )
}
```

**TextEditor.tsx (Modified)**

```typescript
import { useEditor } from '@tiptap/react'
import { useEditorContext } from './EditorContext'

export const TextEditor = ({ content, onChange, placeholder }) => {
  const { registerEditor, unregisterEditor, setActiveEditor } = useEditorContext()

  const editor = useEditor({
    extensions: [/* your extensions */],
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    onFocus: () => setActiveEditor(editor),
    onDestroy: () => unregisterEditor(editor)
  })

  useEffect(() => {
    if (editor) {
      registerEditor(editor)
      return () => unregisterEditor(editor)
    }
  }, [editor, registerEditor, unregisterEditor])

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
    </div>
  )
}
```

**EditorToolbar.tsx (Modified)**

```typescript
import { useEditorContext } from './EditorContext'

export const EditorToolbar = () => {
  const { activeEditor } = useEditorContext()

  if (!activeEditor) {
    return <div>No active editor</div>
  }

  return (
    <div className="toolbar">
      {/* All your toolbar buttons using activeEditor */}
      <button onClick={() => activeEditor.chain().focus().toggleBold().run()}>
        Bold
      </button>
      {/* ... other buttons */}
    </div>
  )
}
```

**Usage Example**

```typescript
// App.tsx
export default function App() {
  return (
    <EditorProvider>
      <div className="app">
        <EditorToolbar />
        <div className="editors">
          <TextEditor content="Editor 1" />
          <TextEditor content="Editor 2" />
        </div>
      </div>
    </EditorProvider>
  )
}
```

### 2. Ref-Based Approach

For simpler cases where you have a fixed number of editors.

```typescript
const EditorManager = () => {
  const editor1Ref = useRef<Editor>(null)
  const editor2Ref = useRef<Editor>(null)
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null)

  const handleEditorFocus = (editor: Editor) => {
    setActiveEditor(editor)
  }

  return (
    <div>
      <EditorToolbar editor={activeEditor} />
      <TextEditor
        ref={editor1Ref}
        onFocus={() => handleEditorFocus(editor1Ref.current!)}
      />
      <TextEditor
        ref={editor2Ref}
        onFocus={() => handleEditorFocus(editor2Ref.current!)}
      />
    </div>
  )
}
```

### 3. State Lifting Approach

When you have a parent component that manages all editors.

```typescript
const ParentComponent = () => {
  const [editor1, setEditor1] = useState<Editor | null>(null)
  const [editor2, setEditor2] = useState<Editor | null>(null)
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null)

  return (
    <div>
      <EditorToolbar editor={activeEditor} />
      <TextEditor
        onEditorReady={setEditor1}
        onFocus={() => setActiveEditor(editor1)}
      />
      <TextEditor
        onEditorReady={setEditor2}
        onFocus={() => setActiveEditor(editor2)}
      />
    </div>
  )
}
```

### 4. Event-Based Approach

For more complex scenarios with many editors.

```typescript
// EditorEventBus.ts
class EditorEventBus {
  private listeners = new Map<string, Function[]>()

  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data))
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }
}

export const editorEventBus = new EditorEventBus()

// TextEditor.tsx
const editor = useEditor({
  onFocus: () => editorEventBus.emit('editor-focused', editor),
})

// EditorToolbar.tsx
const [activeEditor, setActiveEditor] = useState<Editor | null>(null)

useEffect(() => {
  const handleEditorFocus = (editor: Editor) => {
    setActiveEditor(editor)
  }

  editorEventBus.on('editor-focused', handleEditorFocus)
  return () => editorEventBus.off('editor-focused', handleEditorFocus)
}, [])
```

## Implementation Steps

### Step 1: Choose Your Approach

- **Context-based**: Best for complex apps with many editors
- **Ref-based**: Good for simple cases with 2-3 editors
- **State lifting**: When you have a clear parent-child relationship
- **Event-based**: For decoupled components

### Step 2: Create the Context (if using Context approach)

1. Create `EditorContext.tsx` with the context and provider
2. Add the provider to your app root
3. Create `useEditorContext` hook

### Step 3: Modify TextEditor Component

1. Add editor registration/unregistration logic
2. Add focus handling to set active editor
3. Ensure proper cleanup on unmount

### Step 4: Update EditorToolbar

1. Remove `editor` prop dependency
2. Use context or state to get active editor
3. Add fallback UI when no editor is active

### Step 5: Add Visual Indicators

1. Highlight the active editor
2. Show which editor is being controlled
3. Add smooth transitions

## Best Practices

### 1. Visual Feedback

```typescript
// Highlight active editor
<div className={`editor ${isActive ? 'active' : ''}`}>
  <EditorContent editor={editor} />
</div>

// CSS
.editor.active {
  border: 2px solid #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
```

### 2. Error Handling

```typescript
const EditorToolbar = () => {
  const { activeEditor } = useEditorContext()

  if (!activeEditor) {
    return (
      <div className="toolbar-disabled">
        <span>No active editor</span>
      </div>
    )
  }

  if (activeEditor.isDestroyed) {
    return (
      <div className="toolbar-error">
        <span>Editor is not available</span>
      </div>
    )
  }

  // ... rest of toolbar
}
```

### 3. Performance Optimization

```typescript
// Memoize toolbar to prevent unnecessary re-renders
const EditorToolbar = memo(() => {
  const { activeEditor } = useEditorContext()

  // ... toolbar implementation
})

// Use useCallback for editor actions
const handleBold = useCallback(() => {
  activeEditor?.chain().focus().toggleBold().run()
}, [activeEditor])
```

### 4. Accessibility

```typescript
// Add ARIA labels
<button
  onClick={handleBold}
  aria-label="Toggle bold"
  aria-pressed={activeEditor?.isActive('bold')}
>
  Bold
</button>
```

## Common Issues and Solutions

### Issue 1: Toolbar doesn't update when switching editors

**Solution**: Ensure `setActiveEditor` is called on focus events

### Issue 2: Memory leaks from unregistered editors

**Solution**: Always unregister editors in cleanup functions

### Issue 3: Multiple toolbars appearing

**Solution**: Use context to ensure only one toolbar instance

### Issue 4: Editor state not syncing

**Solution**: Use the same editor instance for both toolbar and content

## Testing

### Unit Tests

```typescript
// Test context provider
test('should register and unregister editors', () => {
  const { result } = renderHook(() => useEditorContext(), {
    wrapper: EditorProvider
  })

  const mockEditor = createMockEditor()
  result.current.registerEditor(mockEditor)
  expect(result.current.editors).toContain(mockEditor)
})

// Test toolbar with active editor
test('should render toolbar when editor is active', () => {
  const mockEditor = createMockEditor()
  render(
    <EditorProvider>
      <EditorToolbar />
    </EditorProvider>
  )
  // ... test implementation
})
```

### Integration Tests

```typescript
// Test editor switching
test('should switch active editor on focus', async () => {
  render(
    <EditorProvider>
      <EditorToolbar />
      <TextEditor id="editor1" />
      <TextEditor id="editor2" />
    </EditorProvider>
  )

  // Focus first editor
  fireEvent.focus(screen.getByTestId('editor1'))
  expect(screen.getByText('Editor 1 is active')).toBeInTheDocument()

  // Focus second editor
  fireEvent.focus(screen.getByTestId('editor2'))
  expect(screen.getByText('Editor 2 is active')).toBeInTheDocument()
})
```

## Migration Guide

### From Single Editor to Multi-Editor

1. **Wrap your app** with `EditorProvider`
2. **Update TextEditor** to use context instead of local state
3. **Modify EditorToolbar** to get editor from context
4. **Add visual indicators** for active editor
5. **Test thoroughly** with multiple editors

### Example Migration

```typescript
// Before
const App = () => (
  <div>
    <EditorToolbar editor={editor} />
    <TextEditor />
  </div>
)

// After
const App = () => (
  <EditorProvider>
    <div>
      <EditorToolbar />
      <TextEditor />
      <TextEditor />
    </div>
  </EditorProvider>
)
```

## Conclusion

The Context-based approach is recommended for most use cases as it provides:

- Clean separation of concerns
- Easy scalability
- Type safety
- React best practices

Choose the approach that best fits your specific use case and complexity requirements.
