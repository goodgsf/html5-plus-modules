# IBeacon API

> iBeacon设备管理

## 模块概览

IBeacon 模块提供了完整的 iBeacon设备管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import ibeacon from '../modules/ibeacon.js';

// 检查模块支持性
const supported = await ibeacon.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await ibeacon.checkPermission();
if (permission !== 'granted') {
  const result = await ibeacon.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### IBeaconInfo

**类型**: `Object`

iBeacon设备信息

### IBeaconListEvent

**类型**: `Object`

iBeacon设备列表事件

### IBeaconServiceEvent

**类型**: `Object`

iBeacon服务状态事件

### BeaconDiscoveryOptions

**类型**: `Object`

iBeacon搜索参数

### IBeaconOptions

**类型**: `Object`

iBeacon操作参数

## 方法

### HTML5+ iBeacon 模块 ES Module 封装

HTML5+ iBeacon 模块 ES Module 封装

### iBeacon错误代码常量

iBeacon错误代码常量

### iBeacon成功回调函数

iBeacon成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 回调参数 |

### iBeacon失败回调函数

iBeacon失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### iBeacon操作完成回调函数

iBeacon操作完成回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 回调参数 |

### iBeacon设备更新回调函数

iBeacon设备更新回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `IBeaconListEvent` | - 设备信息 |

### iBeacon服务状态变化回调函数

iBeacon服务状态变化回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `IBeaconServiceEvent` | - 服务状态信息 |

### iBeacon模块类

iBeacon模块类

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

### 式化iBeacon设备信息

格式化iBeacon设备信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeBeacon | `Object` | - 原生iBeacon设备信息 |

**返回值**: `IBeaconInfo` - 格式化后的设备信息

### 式化设备列表

格式化设备列表

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 原生事件对象 |

**返回值**: `IBeaconListEvent` - 格式化后的设备列表事件

### 式化服务状态事件

格式化服务状态事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 原生事件对象 |

**返回值**: `IBeaconServiceEvent` - 格式化后的服务状态事件

### 始搜索附近的iBeacon设备

开始搜索附近的iBeacon设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `BeaconDiscoveryOptions` | - 搜索参数 |
| [successFn] | `IBeaconSuccessCallback` | - 成功回调函数 |
| [errorFn] | `IBeaconFailCallback` | - 失败回调函数 |
| [completeFn] | `IBeaconCompleteCallback` | - 操作完成回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 止搜索附近的iBeacon设备

停止搜索附近的iBeacon设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `IBeaconSuccessCallback` | - 成功回调函数 |
| [errorFn] | `IBeaconFailCallback` | - 失败回调函数 |
| [completeFn] | `IBeaconCompleteCallback` | - 操作完成回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 取已搜索到的iBeacon设备

获取已搜索到的iBeacon设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `IBeaconSuccessCallback` | - 成功回调函数 |
| [errorFn] | `IBeaconFailCallback` | - 失败回调函数 |
| [completeFn] | `IBeaconCompleteCallback` | - 操作完成回调函数 |

**返回值**: `Promise<IBeaconListEvent>` - 返回设备列表

### catch()

监听iBeacon设备更新

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| updateCallback | `IBeaconUpdateCallback` | - 设备更新回调函数 |

### catch()

监听iBeacon服务状态变化

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| changeCallback | `IBeaconServiceChangeCallback` | - 服务状态变化回调函数 |

### 消监听iBeacon设备更新

取消监听iBeacon设备更新

### 消监听iBeacon服务状态变化

取消监听iBeacon服务状态变化

### 取当前iBeacon服务状态

获取当前iBeacon服务状态

**返回值**: `Promise<IBeaconServiceEvent>` - 返回服务状态

### 化的搜索方法，自动处理错误

简化的搜索方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `BeaconDiscoveryOptions` | - 搜索参数 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 化的停止搜索方法，自动处理错误

简化的停止搜索方法，自动处理错误

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 化的获取设备列表方法，自动处理错误

简化的获取设备列表方法，自动处理错误

**返回值**: `Promise<IBeaconInfo[]|null>` - 成功返回设备列表，失败返回null

### 断设备是否支持iBeacon

判断设备是否支持iBeacon

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 取当前搜索状态

获取当前搜索状态

**返回值**: `boolean` - 是否正在搜索

## 使用示例

### 基本用法

```javascript
import ibeacon from '../modules/ibeacon.js';

try {
  // 基本操作
  const result = await ibeacon.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeIBeaconOperation() {
  try {
    // 检查支持性
    const supported = await ibeacon.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await ibeacon.checkPermission();
    if (permission !== 'granted') {
      const result = await ibeacon.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await ibeacon.someMethod();
    return result;

  } catch (error) {
    console.error('IBeacon 操作失败:', error);
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

