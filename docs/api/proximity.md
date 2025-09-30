# Proximity API

> 接近传感器管理

## 模块概览

Proximity 模块提供了完整的 接近传感器管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import proximity from '../modules/proximity.js';

// 检查模块支持性
const supported = await proximity.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await proximity.checkPermission();
if (permission !== 'granted') {
  const result = await proximity.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ProximityDistance

**类型**: `Object`

设备距离信息

### ProximityOption

**类型**: `Object`

距离监听选项

## 方法

### HTML5+ Proximity 模块 ES Module 封装

HTML5+ Proximity 模块 ES Module 封装

### 离错误码常量

距离错误码常量

### 取距离信息成功的回调函数

获取距离信息成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| proximity | `ProximityDistance` | - 设备距离信息 |

### 取距离信息失败的回调函数

获取距离信息失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Proximity 模块类

HTML5+ Proximity 模块类

### 始化Proximity模块

初始化Proximity模块

**返回值**: `Promise<void>` - */

### 取当前设备的距离信息

获取当前设备的距离信息

**返回值**: `Promise<ProximityDistance>` - 设备距离信息

**示例**:

```javascript
```javascript
```

### 浏览器环境中获取当前距离信息

在浏览器环境中获取当前距离信息

### 听设备距离信息的变化

监听设备距离信息的变化

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCallback | `ProximitySuccessCallback` | - 成功回调函数 |
| [errorCallback] | `ProximityErrorCallback` | - 失败回调函数 |
| [options] | `ProximityOption` | - 监听选项 |

**返回值**: `Promise<number>` - 监听器ID

**示例**:

```javascript
```javascript
```

### 浏览器环境中监听距离变化

在浏览器环境中监听距离变化

### 闭监听设备距离信息

关闭监听设备距离信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| watchId | `number` | - 监听器ID |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 准化距离数据

标准化距离数据

### 准化距离值

标准化距离值

### 取当前活跃的监听器数量

获取当前活跃的监听器数量

**返回值**: `number` - 活跃监听器数量

**示例**:

```javascript
```javascript
```

### 止所有活跃的监听器

停止所有活跃的监听器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持Proximity功能

判断设备是否支持Proximity功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 查设备距离感应器权限状态

检查设备距离感应器权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求设备距离感应器权限

请求设备距离感应器权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import proximity from '../modules/proximity.js';

try {
  // 基本操作
  const result = await proximity.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeProximityOperation() {
  try {
    // 检查支持性
    const supported = await proximity.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await proximity.checkPermission();
    if (permission !== 'granted') {
      const result = await proximity.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await proximity.someMethod();
    return result;

  } catch (error) {
    console.error('Proximity 操作失败:', error);
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

