# Net API

> 网络请求管理

## 模块概览

Net 模块提供了完整的 网络请求管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import net from '../modules/net.js';

// 检查模块支持性
const supported = await net.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await net.checkPermission();
if (permission !== 'granted') {
  const result = await net.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ProgressEvent

**类型**: `Object`

网络请求进度事件

## 方法

### HTML5+ Net 模块 ES Module 封装

HTML5+ Net 模块 ES Module 封装

### HTTP请求状态常量

HTTP请求状态常量

### 应数据类型常量

响应数据类型常量

### 络请求状态变化的回调函数

网络请求状态变化的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| xhr | `XMLHttpRequest` | - XMLHttpRequest对象 |

### 络请求进度事件的回调函数

网络请求进度事件的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `ProgressEvent` | - 进度事件对象 |

### HTML5+ XMLHttpRequest 网络请求类

HTML5+ XMLHttpRequest 网络请求类

### 始化HTTP/HTTPS请求参数

初始化HTTP/HTTPS请求参数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| method | `string` | - HTTP方法（GET、POST、PUT、DELETE等） |
| url | `string` | - 请求的URL地址 |
| [async=true] | `boolean` | - 是否异步请求 |
| [user] | `string` | - 认证用户名 |
| [password] | `string` | - 认证密码 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 送HTTP请求

发送HTTP请求

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [data] | `string|ArrayBuffer|Blob|Document|FormData` | - 发送的数据 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 用HTML5+环境发送请求

使用HTML5+环境发送请求

### 用浏览器原生XMLHttpRequest发送请求

使用浏览器原生XMLHttpRequest发送请求

### 定HTML5+事件处理器

绑定HTML5+事件处理器

### 定浏览器事件处理器

绑定浏览器事件处理器

### 发事件

触发事件

### 发状态变化

触发状态变化

### 理错误

处理错误

### 消当前响应，关闭连接并且结束任何未决的网络活动

取消当前响应，关闭连接并且结束任何未决的网络活动

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 取HTTP响应头部信息

获取HTTP响应头部信息

**返回值**: `string` - 所有响应头部信息

**示例**:

```javascript
```javascript
```

### 取指定的HTTP响应头部的值

获取指定的HTTP响应头部的值

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| header | `string` | - 头部名称 |

**返回值**: `string` - 头部值

**示例**:

```javascript
```javascript
```

### 写服务器返回的MIME类型

重写服务器返回的MIME类型

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| mimeType | `string` | - MIME类型 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 定一个HTTP请求的Header

指定一个HTTP请求的Header

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| header | `string` | - 头部名称 |
| value | `string` | - 头部值 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 加事件监听器

添加事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 事件类型 |
| listener | `Function` | - 监听器函数 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 除事件监听器

移除事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 事件类型 |
| listener | `Function` | - 监听器函数 |

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持XMLHttpRequest功能

判断设备是否支持XMLHttpRequest功能

**返回值**: `boolean` - 是否支持

**示例**:

```javascript
```javascript
```

### Net模块类

Net模块类

### 建XMLHttpRequest对象

创建XMLHttpRequest对象

**返回值**: `XMLHttpRequest` - XMLHttpRequest对象

**示例**:

```javascript
```javascript
```

### 消所有活跃的请求

取消所有活跃的请求

**返回值**: `void` - *

**示例**:

```javascript
```javascript
```

### 取活跃请求数量

获取活跃请求数量

**返回值**: `number` - 活跃请求数量

**示例**:

```javascript
```javascript
```

### 断设备是否支持Net功能

判断设备是否支持Net功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import net from '../modules/net.js';

try {
  // 基本操作
  const result = await net.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeNetOperation() {
  try {
    // 检查支持性
    const supported = await net.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await net.checkPermission();
    if (permission !== 'granted') {
      const result = await net.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await net.someMethod();
    return result;

  } catch (error) {
    console.error('Net 操作失败:', error);
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

