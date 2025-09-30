# Accelerometer API

> 加速度传感器管理

## 模块概览

Accelerometer 模块提供了完整的 加速度传感器管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import accelerometer from '../modules/accelerometer.js';

// 检查模块支持性
const supported = await accelerometer.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await accelerometer.checkPermission();
if (permission !== 'granted') {
  const result = await accelerometer.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### Acceleration

**类型**: `Object`

设备加速度信息对象

### AccelerometerOption

**类型**: `Object`

监听设备加速度感应器参数

## 方法

### HTML5+ Accelerometer 模块 ES Module 封装

HTML5+ Accelerometer 模块 ES Module 封装

### 取设备加速度信息成功的回调函数

获取设备加速度信息成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| acceleration | `Acceleration` | - 设备的加速度信息 |

### 取设备加速度信息失败的回调函数

获取设备加速度信息失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Accelerometer模块类

Accelerometer模块类

### 取当前设备的加速度信息

获取当前设备的加速度信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCB | `AccelerometerSuccessCallback` | - 获取设备加速度信息成功回调函数 |
| [errorCB] | `AccelerometerErrorCallback` | - 获取设备加速度信息失败回调函数 |

**示例**:

```javascript
```javascript
```

### 听设备加速度变化信息

监听设备加速度变化信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCB | `AccelerometerSuccessCallback` | - 成功回调函数 |
| [errorCB] | `AccelerometerErrorCallback` | - 失败回调函数 |
| [option] | `AccelerometerOption` | - 加速度信息参数 |

**返回值**: `number|Promise<number>` - 用于标识加速度信息监听器，可通过clearWatch方法取消监听

**示例**:

```javascript
```javascript
```

### 闭监听设备加速度信息

关闭监听设备加速度信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| watchId | `number` | - 需要取消的加速度监听器标识，调用watchAcceleration方法的返回值 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持加速度传感器

判断设备是否支持加速度传感器

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前活跃的监听器信息

获取当前活跃的监听器信息

**返回值**: `Array<Object>` - 活跃监听器信息数组

**示例**:

```javascript
```javascript
```

### 闭所有活跃的监听器

关闭所有活跃的监听器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import accelerometer from '../modules/accelerometer.js';

try {
  // 基本操作
  const result = await accelerometer.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeAccelerometerOperation() {
  try {
    // 检查支持性
    const supported = await accelerometer.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await accelerometer.checkPermission();
    if (permission !== 'granted') {
      const result = await accelerometer.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await accelerometer.someMethod();
    return result;

  } catch (error) {
    console.error('Accelerometer 操作失败:', error);
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

