# Fingerprint API

> 指纹识别管理

## 模块概览

Fingerprint 模块提供了完整的 指纹识别管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import fingerprint from '../modules/fingerprint.js';

// 检查模块支持性
const supported = await fingerprint.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await fingerprint.checkPermission();
if (permission !== 'granted') {
  const result = await fingerprint.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AuthenticateOptions

**类型**: `Object`

指纹识别认证参数

### FingerprintError

**类型**: `Object`

指纹识别错误信息

## 方法

### HTML5+ Fingerprint 模块 ES Module 封装

HTML5+ Fingerprint 模块 ES Module 封装

### 纹识别错误代码常量

指纹识别错误代码常量

### 纹识别认证成功的回调函数

指纹识别认证成功的回调函数

### 纹识别认证失败的回调函数

指纹识别认证失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `FingerprintError` | - 错误信息 |

### Fingerprint模块类

Fingerprint模块类

### 查HTML5+环境是否可用

检查HTML5+环境是否可用

### 建错误对象

创建错误对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| code | `number` | - 错误代码 |
| message | `string` | - 错误描述信息 |

**返回值**: `FingerprintError` - 错误对象

### 前设备环境是否支持指纹识别

当前设备环境是否支持指纹识别

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 前设备是否设置密码锁屏

当前设备是否设置密码锁屏

**返回值**: `Promise<boolean>` - 已设置密码锁屏返回true，否则返回false

### 前设备是否已经录入指纹

当前设备是否已经录入指纹

**返回值**: `Promise<boolean>` - 已录入指纹返回true，否则返回false

### 纹识别认证

指纹识别认证

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successFn | `FingerprintSuccessCallback` | - 成功回调函数 |
| errorFn | `FingerprintErrorCallback` | - 失败回调函数 |
| [options={}] | `AuthenticateOptions` | - 认证选项 |

**返回值**: `Promise<string>` - 返回认证ID

### 消指纹识别认证

取消指纹识别认证

**返回值**: `Promise<void>` - *

### 除回调函数

清除回调函数

### 取设备指纹识别的完整状态信息

获取设备指纹识别的完整状态信息

**返回值**: `Promise<Object>` - 包含支持状态、锁屏状态、指纹录入状态等

### 化的指纹识别方法，自动检查设备状态

简化的指纹识别方法，自动检查设备状态

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `AuthenticateOptions` | - 认证选项 |

**返回值**: `Promise<boolean>` - 认证成功返回true，失败返回false

## 使用示例

### 基本用法

```javascript
import fingerprint from '../modules/fingerprint.js';

try {
  // 基本操作
  const result = await fingerprint.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeFingerprintOperation() {
  try {
    // 检查支持性
    const supported = await fingerprint.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await fingerprint.checkPermission();
    if (permission !== 'granted') {
      const result = await fingerprint.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await fingerprint.someMethod();
    return result;

  } catch (error) {
    console.error('Fingerprint 操作失败:', error);
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

