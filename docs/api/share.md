# Share API

> 社交分享管理

## 模块概览

Share 模块提供了完整的 社交分享管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import share from '../modules/share.js';

// 检查模块支持性
const supported = await share.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await share.checkPermission();
if (permission !== 'granted') {
  const result = await share.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AuthOptions

**类型**: `Object`

授权认证参数

### GeoPosition

**类型**: `Object`

位置信息（将废弃）

### ShareMessageExtra

**类型**: `Object`

分享消息扩展信息

### WeixinMiniProgramOptions

**类型**: `Object`

微信小程序参数

### WeixinCustomerServiceOptions

**类型**: `Object`

微信客服参数

### ShareMessage

**类型**: `Object`

分享消息对象

### ShareService

**类型**: `Object`

分享服务对象

## 方法

### HTML5+ Share 模块 ES Module 封装

HTML5+ Share 模块 ES Module 封装

### 享错误码常量

分享错误码常量

### 享服务标识常量

分享服务标识常量

### 享消息类型常量

分享消息类型常量

### 信分享场景常量

微信分享场景常量

### 享接口模式常量

分享接口模式常量

### 信小程序版本类型常量

微信小程序版本类型常量

### 取分享服务成功回调函数

获取分享服务成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| services | `ShareService[]` | - 分享服务列表 |

### 权认证成功回调函数

授权认证成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| service | `ShareService` | - 授权认证的分享服务对象 |

### 享操作成功回调函数

分享操作成功回调函数

### 享操作失败回调函数

分享操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Share 模块类

HTML5+ Share 模块类

### 始化Share模块

初始化Share模块

**返回值**: `Promise<void>` - */

### catch()

获取分享服务

**返回值**: `Promise<ShareService[]>` - 分享服务列表

**示例**:

```javascript
```javascript
```

### 用系统分享

使用系统分享

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `ShareMessage` | - 要分享的消息对象 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取分享服务对象

获取分享服务对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 分享服务ID |

**返回值**: `Promise<ShareService>` - 分享服务对象

**示例**:

```javascript
```javascript
```

### 建分享服务对象

创建分享服务对象

### _createServiceObject()

授权认证操作

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCallback | `AuthorizeSuccessCallback` | - 成功回调 |
| errorCallback | `ShareErrorCallback` | - 失败回调 |
| options | `AuthOptions` | - 授权参数 |

### catch()

取消授权认证

### if()

发送分享

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `ShareMessage` | - 分享消息 |
| successCallback | `ShareSuccessCallback` | - 成功回调 |
| errorCallback | `ShareErrorCallback` | - 失败回调 |

### if()

调用微信小程序

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `WeixinMiniProgramOptions` | - 小程序参数 |
| successCallback | `ShareSuccessCallback` | - 成功回调 |
| errorCallback | `ShareErrorCallback` | - 失败回调 |

### if()

打开微信客服

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `WeixinCustomerServiceOptions` | - 客服参数 |
| successCallback | `ShareSuccessCallback` | - 成功回调 |
| errorCallback | `ShareErrorCallback` | - 失败回调 |

### 准化分享服务列表

标准化分享服务列表

### 准化分享消息

标准化分享消息

### 断设备是否支持Share功能

判断设备是否支持Share功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 除服务缓存

清除服务缓存

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 量授权多个分享服务

批量授权多个分享服务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceIds | `string[]` | - 分享服务ID数组 |
| options | `AuthOptions` | - 授权参数 |

**返回值**: `Promise<ShareService[]>` - 授权成功的分享服务列表

**示例**:

```javascript
```javascript
```

### 取指定分享服务的授权状态

获取指定分享服务的授权状态

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 分享服务ID |

**返回值**: `Promise<boolean>` - 是否已授权

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import share from '../modules/share.js';

try {
  // 基本操作
  const result = await share.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeShareOperation() {
  try {
    // 检查支持性
    const supported = await share.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await share.checkPermission();
    if (permission !== 'granted') {
      const result = await share.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await share.someMethod();
    return result;

  } catch (error) {
    console.error('Share 操作失败:', error);
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

