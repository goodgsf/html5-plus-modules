# Device API

> 设备信息管理

## 模块概览

Device 模块提供了完整的 设备信息管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import device from '../modules/device.js';

// 检查模块支持性
const supported = await device.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await device.checkPermission();
if (permission !== 'granted') {
  const result = await device.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### DeviceInfo

**类型**: `Object`

设备信息对象

### AnonymousIdResult

**类型**: `Object`

匿名设备标识符结果

### ScreenInfo

**类型**: `Object`

屏幕信息对象

### OSInfo

**类型**: `Object`

操作系统信息对象

## 方法

### HTML5+ Device 模块 ES Module 封装

HTML5+ Device 模块 ES Module 封装

### 络连接类型常量

网络连接类型常量

### 幕方向常量

屏幕方向常量

### 备操作成功回调函数

设备操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 操作结果 |

### 备操作失败回调函数

设备操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |

### 备操作完成回调函数

设备操作完成回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 操作结果 |

### Device模块类

Device模块类

### catch()

获取设备信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options] | `Object` | - 选项参数 |
| [options.success] | `DeviceSuccessCallback` | - 获取设备信息成功回调 |
| [options.fail] | `DeviceErrorCallback` | - 获取设备信息失败回调 |
| [options.complete] | `DeviceCompleteCallback` | - 获取设备信息操作完成回调 |

**返回值**: `Promise<DeviceInfo>|void` - 设备信息

**示例**:

```javascript
```javascript
```

### 取匿名设备标识符

获取匿名设备标识符

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options] | `Object` | - 选项参数 |
| [options.success] | `DeviceSuccessCallback` | - 获取成功回调 |
| [options.fail] | `DeviceErrorCallback` | - 获取失败回调 |
| [options.complete] | `DeviceCompleteCallback` | - 获取操作完成回调 |

**返回值**: `Promise<AnonymousIdResult>|void` - 匿名设备标识符

**示例**:

```javascript
```javascript
```

### 取开发者匿名设备标识符

获取开发者匿名设备标识符

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options] | `Object` | - 选项参数 |
| [options.success] | `DeviceSuccessCallback` | - 获取成功回调 |
| [options.fail] | `DeviceErrorCallback` | - 获取失败回调 |
| [options.complete] | `DeviceCompleteCallback` | - 获取操作完成回调 |

**返回值**: `Promise<AnonymousIdResult>|void` - 开发者匿名设备标识符

### 取应用匿名设备标识符

获取应用匿名设备标识符

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options] | `Object` | - 选项参数 |
| [options.success] | `DeviceSuccessCallback` | - 获取成功回调 |
| [options.fail] | `DeviceErrorCallback` | - 获取失败回调 |
| [options.complete] | `DeviceCompleteCallback` | - 获取操作完成回调 |

**返回值**: `Promise<AnonymousIdResult>|void` - 应用匿名设备标识符

### 取DCloud匿名设备标识符

获取DCloud匿名设备标识符

**返回值**: `string` - DCloud匿名设备标识符

**示例**:

```javascript
```javascript
```

### 取设备的系统音量

获取设备的系统音量

**返回值**: `number` - 系统音量值（0-1）

**示例**:

```javascript
```javascript
```

### 置设备的系统音量

设置设备的系统音量

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| volume | `number` | - 音量值（0-1） |

**示例**:

```javascript
```javascript
```

### 取程序是否一直保持唤醒状态

获取程序是否一直保持唤醒状态

**返回值**: `boolean` - 是否保持唤醒状态

**示例**:

```javascript
```javascript
```

### 置应用是否保持唤醒状态

设置应用是否保持唤醒状态

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| lock | `boolean` | - 是否保持唤醒状态 |

**示例**:

```javascript
```javascript
```

### catch()

发出蜂鸣声

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [times=1] | `number` | - 蜂鸣声重复次数 |

**示例**:

```javascript
```javascript
```

### catch()

拨打电话

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| number | `string` | - 电话号码 |
| [confirm=true] | `boolean` | - 是否需要用户确认 |

**示例**:

```javascript
```javascript
```

### catch()

设备振动

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [milliseconds=500] | `number` | - 振动持续时间（毫秒） |

**示例**:

```javascript
```javascript
```

### catch()

获取屏幕信息

**返回值**: `ScreenInfo` - 屏幕信息

**示例**:

```javascript
```javascript
```

### catch()

获取屏幕亮度

**返回值**: `number` - 屏幕亮度（0-1）

**示例**:

```javascript
```javascript
```

### catch()

设置屏幕亮度

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| brightness | `number` | - 屏幕亮度（0-1，-1表示与系统保持一致） |

**示例**:

```javascript
```javascript
```

### catch()

锁定屏幕方向

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| orientation | `string` | - 屏幕方向 |

**示例**:

```javascript
```javascript
```

### 除锁定屏幕方向

解除锁定屏幕方向

**示例**:

```javascript
```javascript
```

### 取当前屏幕信息

获取当前屏幕信息

**返回值**: `ScreenInfo` - 当前屏幕信息

**示例**:

```javascript
```javascript
```

### 取设备当前连接的网络类型

获取设备当前连接的网络类型

**返回值**: `number` - 网络类型常量

**示例**:

```javascript
```javascript
```

### 取当前网络是否设置代理

获取当前网络是否设置代理

**返回值**: `boolean` - 是否设置代理

**示例**:

```javascript
```javascript
```

### catch()

获取操作系统信息

**返回值**: `OSInfo` - 操作系统信息

**示例**:

```javascript
```javascript
```

### catch()

获取显示区域信息

**返回值**: `Object` - 显示区域信息

**示例**:

```javascript
```javascript
```

### 断设备是否支持device功能

判断设备是否支持device功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取网络类型名称

获取网络类型名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 网络类型常量 |

**返回值**: `string` - 网络类型名称

**示例**:

```javascript
```javascript
```

### 取屏幕方向名称

获取屏幕方向名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| orientation | `string` | - 屏幕方向常量 |

**返回值**: `string` - 屏幕方向名称

**示例**:

```javascript
```javascript
```

### 取设备的基本属性（已废弃的API）

获取设备的基本属性（已废弃的API）

**返回值**: `Object` - 设备属性

## 使用示例

### 基本用法

```javascript
import device from '../modules/device.js';

try {
  // 基本操作
  const result = await device.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeDeviceOperation() {
  try {
    // 检查支持性
    const supported = await device.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await device.checkPermission();
    if (permission !== 'granted') {
      const result = await device.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await device.someMethod();
    return result;

  } catch (error) {
    console.error('Device 操作失败:', error);
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

