# Bluetooth API

> 蓝牙通信管理

## 模块概览

Bluetooth 模块提供了完整的 蓝牙通信管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import bluetooth from '../modules/bluetooth.js';

// 检查模块支持性
const supported = await bluetooth.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await bluetooth.checkPermission();
if (permission !== 'granted') {
  const result = await bluetooth.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### BluetoothDeviceInfo

**类型**: `Object`

蓝牙设备信息

### BluetoothService

**类型**: `Object`

蓝牙设备服务信息

### BluetoothCharacteristic

**类型**: `Object`

蓝牙设备特征值

### BluetoothCharacteristicProperties

**类型**: `Object`

蓝牙设备特征值支持的操作类型

### BluetoothAdapterState

**类型**: `Object`

蓝牙适配器状态

### BluetoothOptions

**类型**: `Object`

蓝牙操作参数

## 方法

### HTML5+ Bluetooth 模块 ES Module 封装

HTML5+ Bluetooth 模块 ES Module 封装

### 功回调函数

成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 操作结果 |

### 败回调函数

失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### 作完成回调函数

操作完成回调函数

### 牙适配器状态变化事件回调函数

蓝牙适配器状态变化事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| state | `BluetoothAdapterState` | - 蓝牙适配器状态 |

### 牙设备发现事件回调函数

蓝牙设备发现事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| device | `BluetoothDeviceInfo` | - 发现的蓝牙设备 |

### 牙设备连接状态变化事件回调函数

蓝牙设备连接状态变化事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| connection | `Object` | - 连接状态信息 |

### 牙特征值变化事件回调函数

蓝牙特征值变化事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| change | `Object` | - 特征值变化信息 |

### 牙设备信号强度回调函数

蓝牙设备信号强度回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| rssiInfo | `Object` | - 信号强度信息 |

### Bluetooth模块类

Bluetooth模块类

### 始化蓝牙模块

初始化蓝牙模块

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### catch()

关闭蓝牙模块

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 取本机蓝牙适配器状态

获取本机蓝牙适配器状态

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.success] | `function` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<BluetoothAdapterState>|void` - *

**示例**:

```javascript
```javascript
```

### 始搜索附近的蓝牙设备

开始搜索附近的蓝牙设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.allowDuplicatesKey=false] | `boolean` | - 是否允许重复上报设备 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 止搜索附近的蓝牙设备

停止搜索附近的蓝牙设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 取已搜索到的蓝牙设备

获取已搜索到的蓝牙设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<BluetoothDeviceInfo[]>|void` - *

**示例**:

```javascript
```javascript
```

### 接低功耗蓝牙设备

连接低功耗蓝牙设备

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| deviceId | `string` | - 蓝牙设备ID |
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 开与低功耗蓝牙设备的连接

断开与低功耗蓝牙设备的连接

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| deviceId | `string` | - 蓝牙设备ID |
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 取蓝牙设备的所有服务

获取蓝牙设备的所有服务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| deviceId | `string` | - 蓝牙设备ID |
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<BluetoothService[]>|void` - *

**示例**:

```javascript
```javascript
```

### 取蓝牙设备指定服务中所有特征值

获取蓝牙设备指定服务中所有特征值

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| deviceId | `string` | - 蓝牙设备ID |
| serviceId | `string` | - 服务UUID |
| options | `Object` | - 配置参数 |
| [options.success] | `BluetoothSuccessCallback` | - 成功回调 |
| [options.fail] | `BluetoothFailCallback` | - 失败回调 |
| [options.complete] | `BluetoothCompleteCallback` | - 完成回调 |

**返回值**: `Promise<BluetoothCharacteristic[]>|void` - *

**示例**:

```javascript
```javascript
```

### 听蓝牙适配器状态变化

监听蓝牙适配器状态变化

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `BluetoothAdapterStateChangeCallback` | - 状态变化回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 听搜索到新设备的事件

监听搜索到新设备的事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `BluetoothDeviceFoundCallback` | - 设备发现回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 听低功耗蓝牙设备连接状态变化事件

监听低功耗蓝牙设备连接状态变化事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `BLEConnectionStateChangeCallback` | - 连接状态变化回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持蓝牙功能

判断设备是否支持蓝牙功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前已连接的设备列表

获取当前已连接的设备列表

**返回值**: `Array<Object>` - 已连接设备信息数组

**示例**:

```javascript
```javascript
```

### 取当前已发现的设备列表

获取当前已发现的设备列表

**返回值**: `Array<Object>` - 已发现设备信息数组

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import bluetooth from '../modules/bluetooth.js';

try {
  // 基本操作
  const result = await bluetooth.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeBluetoothOperation() {
  try {
    // 检查支持性
    const supported = await bluetooth.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await bluetooth.checkPermission();
    if (permission !== 'granted') {
      const result = await bluetooth.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await bluetooth.someMethod();
    return result;

  } catch (error) {
    console.error('Bluetooth 操作失败:', error);
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

