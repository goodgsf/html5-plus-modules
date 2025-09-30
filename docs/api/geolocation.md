# Geolocation API

> 地理位置定位

## 模块概览

Geolocation 模块提供了完整的 地理位置定位 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import geolocation from '../modules/geolocation.js';

// 检查模块支持性
const supported = await geolocation.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await geolocation.checkPermission();
if (permission !== 'granted') {
  const result = await geolocation.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### Coordinates

**类型**: `Object`

地理位置坐标信息

### Address

**类型**: `Object`

地理位置地址信息

### Position

**类型**: `Object`

地理位置信息

### PositionOptions

**类型**: `Object`

地理位置监听器参数

## 方法

### HTML5+ Geolocation 模块 ES Module 封装

HTML5+ Geolocation 模块 ES Module 封装

### 理位置错误代码常量

地理位置错误代码常量

### 标系统类型

坐标系统类型

### 理位置信息提供者

地理位置信息提供者

### 理位置信息获取成功的回调函数

地理位置信息获取成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| position | `Position` | - 地理位置信息 |

### 理位置信息获取失败的回调函数

地理位置信息获取失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误代码 |
| error.message | `string` | - 错误描述信息 |

### Geolocation模块类

Geolocation模块类

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

### 式化位置选项参数

格式化位置选项参数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `PositionOptions` | - 选项参数 |

**返回值**: `Object` - 格式化后的选项

### 式化位置信息

格式化位置信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativePosition | `Object` | - 原生位置信息 |

**返回值**: `Position` - 格式化后的位置信息

### 取当前设备的地理位置信息

获取当前设备的地理位置信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCB | `GeolocationSuccessCallback` | - 成功回调函数 |
| [errorCB] | `GeolocationErrorCallback` | - 失败回调函数 |
| [options={}] | `PositionOptions` | - 获取位置信息的参数 |

**返回值**: `Promise<Position>` - 返回位置信息的Promise

### 听设备地理位置变化信息

监听设备地理位置变化信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCB | `GeolocationSuccessCallback` | - 成功回调函数 |
| [errorCB] | `GeolocationErrorCallback` | - 失败回调函数 |
| [options={}] | `PositionOptions` | - 监听位置信息的参数 |

**返回值**: `number|Promise<number>` - 用于标识地理位置监听器，可通过clearWatch方法取消监听

### 闭监听设备地理位置信息

关闭监听设备地理位置信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| watchId | `number` | - 需要取消的地理位置监听器标识 |

**返回值**: `Promise<void>|void` - *

### 断设备是否支持地理位置服务

判断设备是否支持地理位置服务

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

### 取当前活跃的监听器信息

获取当前活跃的监听器信息

**返回值**: `Array<Object>` - 活跃监听器信息数组

### 闭所有活跃的监听器

关闭所有活跃的监听器

**返回值**: `Promise<void>` - */

### catch()

坐标转换

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| latitude | `number` | - 纬度 |
| longitude | `number` | - 经度 |
| fromCoordsType | `string` | - 源坐标系类型 |
| toCoordsType | `string` | - 目标坐标系类型 |

**返回值**: `Promise<Object>` - 转换后的坐标信息

### 化的位置获取方法，自动处理错误

简化的位置获取方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `PositionOptions` | - 获取位置信息的参数 |

**返回值**: `Promise<Position|null>` - 成功返回位置信息，失败返回null

### 化的位置监听方法，自动处理错误

简化的位置监听方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCB | `GeolocationSuccessCallback` | - 成功回调函数 |
| [options={}] | `PositionOptions` | - 监听位置信息的参数 |

**返回值**: `Promise<number|null>` - 成功返回监听器ID，失败返回null

## 使用示例

### 基本用法

```javascript
import geolocation from '../modules/geolocation.js';

try {
  // 基本操作
  const result = await geolocation.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeGeolocationOperation() {
  try {
    // 检查支持性
    const supported = await geolocation.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await geolocation.checkPermission();
    if (permission !== 'granted') {
      const result = await geolocation.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await geolocation.someMethod();
    return result;

  } catch (error) {
    console.error('Geolocation 操作失败:', error);
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

