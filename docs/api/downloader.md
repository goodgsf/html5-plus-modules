# Downloader API

> 文件下载管理

## 模块概览

Downloader 模块提供了完整的 文件下载管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import downloader from '../modules/downloader.js';

// 检查模块支持性
const supported = await downloader.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await downloader.checkPermission();
if (permission !== 'granted') {
  const result = await downloader.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### DownloadOptions

**类型**: `Object`

下载任务参数

### Download

**类型**: `Object`

下载任务对象

### DownloadResult

**类型**: `Object`

下载任务结果对象

## 方法

### HTML5+ Downloader 模块 ES Module 封装

HTML5+ Downloader 模块 ES Module 封装

### 载任务事件类型常量

下载任务事件类型常量

### 载任务状态常量

下载任务状态常量

### 载任务完成时的回调函数

下载任务完成时的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| download | `Download` | - 下载任务对象 |
| status | `number` | - 下载结果状态码 |

### 载任务状态变化回调函数

下载任务状态变化回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| download | `Download` | - 下载任务对象 |
| status | `number` | - 下载结果状态码 |

### 举下载任务回调函数

枚举下载任务回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| downloads | `Download[]` | - 枚举到的下载任务对象数组 |

### Downloader模块类

Downloader模块类

### catch()

新建下载任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 要下载文件资源地址 |
| [options] | `DownloadOptions` | - 下载任务的参数 |
| [completedCB] | `DownloadCompletedCallback` | - 下载任务完成回调函数 |

**返回值**: `Promise<Download>|Download` - 下载任务对象

**示例**:

```javascript
```javascript
```

### catch()

枚举下载任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| enumCB | `DownloadEnumerateCallback` | - 枚举下载任务回调函数 |
| [state] | `number` | - 枚举下载任务的状态 |

**返回值**: `Promise<Download[]>|void` - *

**示例**:

```javascript
```javascript
```

### catch()

清除下载任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [state] | `number` | - 清除下载任务的状态 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### catch()

开始所有下载任务

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 装下载任务对象，添加额外功能

包装下载任务对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| download | `Object` | - 下载任务对象 |

### 断设备是否支持下载功能

判断设备是否支持下载功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前活跃的下载任务信息

获取当前活跃的下载任务信息

**返回值**: `Array<Object>` - 活跃下载任务信息数组

**示例**:

```javascript
```javascript
```

### 取所有存储的下载任务信息

获取所有存储的下载任务信息

**返回值**: `Array<Object>` - 下载任务信息数组

**示例**:

```javascript
```javascript
```

### 取下载任务状态名称

获取下载任务状态名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| state | `number` | - 下载任务状态常量 |

**返回值**: `string` - 下载任务状态名称

**示例**:

```javascript
```javascript
```

### 式化文件大小

格式化文件大小

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| bytes | `number` | - 字节数 |

**返回值**: `string` - 格式化后的大小

**示例**:

```javascript
```javascript
```

### 建下载任务参数

创建下载任务参数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 选项参数 |

**返回值**: `DownloadOptions` - 下载任务参数

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import downloader from '../modules/downloader.js';

try {
  // 基本操作
  const result = await downloader.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeDownloaderOperation() {
  try {
    // 检查支持性
    const supported = await downloader.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await downloader.checkPermission();
    if (permission !== 'granted') {
      const result = await downloader.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await downloader.someMethod();
    return result;

  } catch (error) {
    console.error('Downloader 操作失败:', error);
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

