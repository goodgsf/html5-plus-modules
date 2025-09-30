# Statistic API

> 统计分析管理

## 模块概览

Statistic 模块提供了完整的 统计分析管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import statistic from '../modules/statistic.js';

// 检查模块支持性
const supported = await statistic.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await statistic.checkPermission();
if (permission !== 'granted') {
  const result = await statistic.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### StatisticEventData

**类型**: `Object`

统计事件数据

### StatisticOptions

**类型**: `Object`

统计事件选项

## 方法

### HTML5+ Statistic 模块 ES Module 封装

HTML5+ Statistic 模块 ES Module 封装

### 计错误码常量

统计错误码常量

### 计事件回调函数

统计事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [error] | `Error` | - 错误信息 |

### HTML5+ Statistic 模块类

HTML5+ Statistic 模块类

### 始化Statistic模块

初始化Statistic模块

**返回值**: `Promise<void>` - */

### 发统计事件

触发统计事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 事件ID |
| [data] | `Object|string` | - 事件数据 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中触发事件

在浏览器环境中触发事件

### 确持续事件统计

精确持续事件统计

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 事件ID |
| duration | `number` | - 持续时间（毫秒） |
| [data] | `Object|string` | - 事件数据 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中处理持续事件

在浏览器环境中处理持续事件

### 始持续事件（过期API，不推荐使用）

开始持续事件（过期API，不推荐使用）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 事件ID |
| [label] | `string` | - 事件标签 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中开始持续事件

在浏览器环境中开始持续事件

### 束持续事件（过期API，不推荐使用）

结束持续事件（过期API，不推荐使用）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 事件ID |
| [label] | `string` | - 事件标签 |

**返回值**: `Promise<number>` - 持续时间（毫秒）

**示例**:

```javascript
```javascript
```

### 浏览器环境中结束持续事件

在浏览器环境中结束持续事件

### 证事件ID

验证事件ID

### 准化事件数据

标准化事件数据

### catch()

处理事件队列

### 理单个事件

处理单个事件

### catch()

发送自定义事件

### 置调试模式

设置调试模式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| enabled | `boolean` | - 是否启用调试模式 |

**示例**:

```javascript
```javascript
```

### 加事件处理器

添加事件处理器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| handler | `function` | - 事件处理器函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 除事件处理器

移除事件处理器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| handler | `function` | - 事件处理器函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取当前事件队列状态

获取当前事件队列状态

**返回值**: `Promise<{queueLength: number, isProcessing: boolean` - >} 队列状态

**示例**:

```javascript
```javascript
```

### 空事件队列

清空事件队列

**返回值**: `Promise<number>` - 清空的事件数量

**示例**:

```javascript
```javascript
```

### 取当前活跃的持续事件

获取当前活跃的持续事件

**返回值**: `Promise<Array<{id: string, label: string, startTime: number` - >>} 活跃事件列表

**示例**:

```javascript
```javascript
```

### 断设备是否支持统计功能

判断设备是否支持统计功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import statistic from '../modules/statistic.js';

try {
  // 基本操作
  const result = await statistic.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeStatisticOperation() {
  try {
    // 检查支持性
    const supported = await statistic.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await statistic.checkPermission();
    if (permission !== 'granted') {
      const result = await statistic.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await statistic.someMethod();
    return result;

  } catch (error) {
    console.error('Statistic 操作失败:', error);
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

