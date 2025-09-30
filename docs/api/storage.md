# Storage API

> 本地存储管理

## 模块概览

Storage 模块提供了完整的 本地存储管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import storage from '../modules/storage.js';

// 检查模块支持性
const supported = await storage.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await storage.checkPermission();
if (permission !== 'granted') {
  const result = await storage.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 方法

### HTML5+ Storage 模块 ES Module 封装

HTML5+ Storage 模块 ES Module 封装

### 储错误码常量

存储错误码常量

### HTML5+ Storage 模块类

HTML5+ Storage 模块类

### 始化Storage模块

初始化Storage模块

**返回值**: `Promise<void>` - */

### catch()

设置存储项

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| key | `string` | - 键名 |
| value | `string|number|boolean` | - 键值 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

获取存储项

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| key | `string` | - 键名 |

**返回值**: `Promise<string|null>` - *

**示例**:

```javascript
```javascript
```

### catch()

删除存储项

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| key | `string` | - 键名 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 空所有存储

清空所有存储

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取存储项数量

获取存储项数量

**返回值**: `Promise<number>` - *

**示例**:

```javascript
```javascript
```

### 取所有键名

获取所有键名

**返回值**: `Promise<string[]>` - *

**示例**:

```javascript
```javascript
```

### 据索引获取键名

根据索引获取键名

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| index | `number` | - 索引 |

**返回值**: `Promise<string|null>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持Storage功能

判断设备是否支持Storage功能

**返回值**: `Promise<boolean>` - *

**示例**:

```javascript
```javascript
```

### 查存储权限状态

检查存储权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求存储权限

请求存储权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import storage from '../modules/storage.js';

try {
  // 基本操作
  const result = await storage.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeStorageOperation() {
  try {
    // 检查支持性
    const supported = await storage.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await storage.checkPermission();
    if (permission !== 'granted') {
      const result = await storage.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await storage.someMethod();
    return result;

  } catch (error) {
    console.error('Storage 操作失败:', error);
    // 根据错误类型进行相应处理
    return null;
  }
}
```

## 最佳实践

1. **权限检查**: 在使用任何功能前，先检查设备支持性和权限状态
2. **错误处理**: 使用 try-catch 处理所有异步操作
3. **资源清理**: 确保及时释放占用的资源
4. **性能优化**: 避免频繁调用，合理使用缓存

## 注意事项

- 确保在 HTML5+ 环境或兼容的浏览器环境中使用
- 部分功能可能需要用户授权
- 在浏览器环境中，某些功能可能被降级或不可用
- 请参考具体方法的详细文档了解限制条件

