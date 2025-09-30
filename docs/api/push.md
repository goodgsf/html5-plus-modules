# Push API

> 推送通知管理

## 模块概览

Push 模块提供了完整的 推送通知管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import push from '../modules/push.js';

// 检查模块支持性
const supported = await push.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await push.checkPermission();
if (permission !== 'granted') {
  const result = await push.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ClientInfo

**类型**: `Object`

客户端推送标识信息

### PushMessage

**类型**: `Object`

推送消息对象

### MessageOptions

**类型**: `Object`

消息选项

## 方法

### HTML5+ Push 模块 ES Module 封装

HTML5+ Push 模块 ES Module 封装

### 送错误码常量

推送错误码常量

### 送事件类型常量

推送事件类型常量

### 户端接收到推送消息的回调函数

客户端接收到推送消息的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string|PushMessage` | - 接收到的推送信息 |

### 户点击推送消息事件的回调函数

用户点击推送消息事件的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string|PushMessage` | - 用户点击的推送信息 |

### 取客户端推送标识信息成功的回调函数

获取客户端推送标识信息成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| info | `ClientInfo` | - 客户端推送标识信息 |

### 取客户端推送标识信息失败的回调函数

获取客户端推送标识信息失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Push 模块类

HTML5+ Push 模块类

### 始化Push模块

初始化Push模块

**返回值**: `Promise<void>` - */

### 加推送消息事件监听器

添加推送消息事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型（'receive'或'click'） |
| listener | `PushReceiveCallback|PushClickCallback` | - 事件监听器回调函数 |
| [capture=false] | `boolean` | - 是否捕获事件 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中添加事件监听器

在浏览器环境中添加事件监听器

### if()

清空所有推送消息

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 建本地消息

创建本地消息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| content | `string` | - 消息显示的内容 |
| [payload] | `Object|string` | - 消息承载的数据 |
| [options] | `MessageOptions` | - 创建消息的额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中创建本地消息

在浏览器环境中创建本地消息

### 取所有推送消息

获取所有推送消息

**返回值**: `Promise<PushMessage[]>` - 推送消息数组

**示例**:

```javascript
```javascript
```

### 取客户端推送标识信息

获取客户端推送标识信息

**返回值**: `Promise<ClientInfo>` - 客户端推送标识信息

**示例**:

```javascript
```javascript
```

### 步获取客户端推送标识信息

异步获取客户端推送标识信息

**返回值**: `Promise<ClientInfo>` - 客户端推送标识信息

**示例**:

```javascript
```javascript
```

### 浏览器环境中获取客户端信息

在浏览器环境中获取客户端信息

### 置程序是否将消息显示在系统消息中心

设置程序是否将消息显示在系统消息中心

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| notify | `boolean` | - 是否自动提示推送消息 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 除推送消息

删除推送消息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `PushMessage` | - 要删除的消息对象 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 准化消息数据

标准化消息数据

### 准化客户端信息

标准化客户端信息

### 断设备是否支持推送功能

判断设备是否支持推送功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 查推送权限状态

检查推送权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求推送权限

请求推送权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

### 取当前自动通知设置状态

获取当前自动通知设置状态

**返回值**: `boolean` - 是否自动显示推送消息

**示例**:

```javascript
```javascript
```

### 除事件监听器

移除事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| listener | `Function` | - 监听器函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import push from '../modules/push.js';

try {
  // 基本操作
  const result = await push.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safePushOperation() {
  try {
    // 检查支持性
    const supported = await push.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await push.checkPermission();
    if (permission !== 'granted') {
      const result = await push.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await push.someMethod();
    return result;

  } catch (error) {
    console.error('Push 操作失败:', error);
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

