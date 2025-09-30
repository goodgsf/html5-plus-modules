# Messaging API

> 短信功能管理

## 模块概览

Messaging 模块提供了完整的 短信功能管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import messaging from '../modules/messaging.js';

// 检查模块支持性
const supported = await messaging.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await messaging.checkPermission();
if (permission !== 'granted') {
  const result = await messaging.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### MessageOptions

**类型**: `Object`

消息对象配置

## 方法

### HTML5+ Messaging 模块 ES Module 封装

HTML5+ Messaging 模块 ES Module 封装

### 息类型常量

消息类型常量

### 息体内容类型常量

消息体内容类型常量

### 息错误代码常量

消息错误代码常量

### 息发送成功回调函数

消息发送成功回调函数

### 息发送失败回调函数

消息发送失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Messaging模块类

Messaging模块类

### 查HTML5+环境是否可用

检查HTML5+环境是否可用

### 建错误对象

创建错误对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| code | `number` | - 错误代码 |
| message | `string` | - 错误描述信息 |

**返回值**: `Object` - 错误对象

### 证消息类型

验证消息类型

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 消息类型 |

**返回值**: `boolean` - 是否有效

### 证收件人地址

验证收件人地址

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| messageType | `number` | - 消息类型 |

**返回值**: `boolean` - 是否有效

### 证附件路径

验证附件路径

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| attachments | `string[]` | - 附件列表 |

**返回值**: `boolean` - 是否有效

### 建消息对象

创建消息对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 消息类型 |
| [options={}] | `MessageOptions` | - 消息配置选项 |

**返回值**: `Object` - 消息对象

### 送消息

发送消息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `Object` | - 消息对象 |
| [successCB] | `MessageSendSuccessCallback` | - 成功回调函数 |
| [errorCB] | `MessageErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 建并发送短信

创建并发送短信

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| body | `string` | - 短信内容 |
| [silent=false] | `boolean` | - 是否静默发送 |
| [successCB] | `MessageSendSuccessCallback` | - 成功回调函数 |
| [errorCB] | `MessageErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 建并发送彩信

创建并发送彩信

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| body | `string` | - 彩信内容 |
| [attachments] | `string[]` | - 附件列表 |
| [successCB] | `MessageSendSuccessCallback` | - 成功回调函数 |
| [errorCB] | `MessageErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 建并发送邮件

创建并发送邮件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| subject | `string` | - 邮件主题 |
| body | `string` | - 邮件内容 |
| [options={}] | `Object` | - 邮件选项 |
| [options.cc] | `string[]` | - 抄送列表 |
| [options.bcc] | `string[]` | - 暗送列表 |
| [options.bodyType='text'] | `string` | - 内容类型 |
| [options.attachments] | `string[]` | - 附件列表 |
| [successCB] | `MessageSendSuccessCallback` | - 成功回调函数 |
| [errorCB] | `MessageErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 化的短信发送方法，自动处理错误

简化的短信发送方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| body | `string` | - 短信内容 |
| [silent=false] | `boolean` | - 是否静默发送 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 化的彩信发送方法，自动处理错误

简化的彩信发送方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| body | `string` | - 彩信内容 |
| [attachments] | `string[]` | - 附件列表 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 化的邮件发送方法，自动处理错误

简化的邮件发送方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recipients | `string[]` | - 收件人列表 |
| subject | `string` | - 邮件主题 |
| body | `string` | - 邮件内容 |
| [options={}] | `Object` | - 邮件选项 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 断设备是否支持消息功能

判断设备是否支持消息功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 取当前活跃消息数量

获取当前活跃消息数量

**返回值**: `number` - 活跃消息数量

### 理活跃消息

清理活跃消息

## 使用示例

### 基本用法

```javascript
import messaging from '../modules/messaging.js';

try {
  // 基本操作
  const result = await messaging.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeMessagingOperation() {
  try {
    // 检查支持性
    const supported = await messaging.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await messaging.checkPermission();
    if (permission !== 'granted') {
      const result = await messaging.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await messaging.someMethod();
    return result;

  } catch (error) {
    console.error('Messaging 操作失败:', error);
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

