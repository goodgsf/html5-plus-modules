# OAuth API

> OAuth认证管理

## 模块概览

OAuth 模块提供了完整的 OAuth认证管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import oauth from '../modules/oauth.js';

// 检查模块支持性
const supported = await oauth.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await oauth.checkPermission();
if (permission !== 'granted') {
  const result = await oauth.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AppleInfo

**类型**: `Object`

苹果认证信息

### AuthOptions

**类型**: `Object`

认证选项

### AuthInfo

**类型**: `Object`

认证信息

### UserInfo

**类型**: `Object`

用户信息

### AuthService

**类型**: `Object`

认证服务对象

### UniverifyOptions

**类型**: `Object`

一键登录选项

## 方法

### HTML5+ OAuth 模块 ES Module 封装

HTML5+ OAuth 模块 ES Module 封装

### 证服务类型常量

认证服务类型常量

### 证服务错误码常量

认证服务错误码常量

### 取认证服务成功的回调函数

获取认证服务成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| services | `AuthService[]` | - 认证服务列表 |

### 取认证服务失败的回调函数

获取认证服务失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| code | `number` | - 错误码 |
| message | `string` | - 错误信息 |

### 证成功的回调函数

认证成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| authInfo | `AuthInfo` | - 认证信息 |

### 证失败的回调函数

认证失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| code | `number` | - 错误码 |
| message | `string` | - 错误信息 |

### 取用户信息成功的回调函数

获取用户信息成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| userInfo | `UserInfo` | - 用户信息 |

### 取用户信息失败的回调函数

获取用户信息失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| code | `number` | - 错误码 |
| message | `string` | - 错误信息 |

### HTML5+ OAuth 认证模块类

HTML5+ OAuth 认证模块类

### 始化OAuth模块

初始化OAuth模块

**返回值**: `Promise<void>` - */

### 存认证服务信息

缓存认证服务信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| services | `AuthService[]` | - 认证服务列表 |

### 取认证服务列表

获取认证服务列表

**返回值**: `Promise<AuthService[]>` - 认证服务列表

**示例**:

```javascript
```javascript
```

### 行认证授权

执行认证授权

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识（如：'weixin', 'qq', 'apple'） |
| options | `AuthOptions` | - 认证选项 |

**返回值**: `Promise<AuthInfo>` - 认证信息

**示例**:

```javascript
```javascript
```

### 录认证（简化版授权）

登录认证（简化版授权）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |
| options | `AuthOptions` | - 认证选项 |

**返回值**: `Promise<AuthInfo>` - 认证信息

**示例**:

```javascript
```javascript
```

### 出认证

登出认证

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

获取用户信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |

**返回值**: `Promise<UserInfo>` - 用户信息

**示例**:

```javascript
```javascript
```

### 键登录（运营商认证）

一键登录（运营商认证）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `UniverifyOptions` | - 一键登录选项 |

**返回值**: `Promise<AuthInfo>` - 认证信息

**示例**:

```javascript
```javascript
```

### 查指定认证服务是否已安装

检查指定认证服务是否已安装

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |

**返回值**: `Promise<boolean>` - 是否已安装

**示例**:

```javascript
```javascript
```

### 查指定认证服务是否已认证

检查指定认证服务是否已认证

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |

**返回值**: `Promise<boolean>` - 是否已认证

**示例**:

```javascript
```javascript
```

### catch()

获取认证结果

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| serviceId | `string` | - 服务标识 |

**返回值**: `Promise<Object>` - 认证结果

**示例**:

```javascript
```javascript
```

### 断设备是否支持OAuth功能

判断设备是否支持OAuth功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 除所有认证缓存

清除所有认证缓存

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import oauth from '../modules/oauth.js';

try {
  // 基本操作
  const result = await oauth.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeOAuthOperation() {
  try {
    // 检查支持性
    const supported = await oauth.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await oauth.checkPermission();
    if (permission !== 'granted') {
      const result = await oauth.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await oauth.someMethod();
    return result;

  } catch (error) {
    console.error('OAuth 操作失败:', error);
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

