# Uploader API

> 文件上传管理

## 模块概览

Uploader 模块提供了完整的 文件上传管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import uploader from '../modules/uploader.js';

// 检查模块支持性
const supported = await uploader.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await uploader.checkPermission();
if (permission !== 'granted') {
  const result = await uploader.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### UploadOptions

**类型**: `Object`

上传任务选项

### UploadFileOptions

**类型**: `Object`

上传文件选项

### UploadTaskInfo

**类型**: `Object`

上传任务信息

## 方法

### HTML5+ Uploader 模块 ES Module 封装

HTML5+ Uploader 模块 ES Module 封装

### 传错误码常量

上传错误码常量

### 传任务事件类型

上传任务事件类型

### 传任务状态常量

上传任务状态常量

### 传任务完成回调函数

上传任务完成回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| task | `UploadTask` | - 上传任务对象 |
| status | `number` | - HTTP状态码 |

### 传任务状态变化回调函数

上传任务状态变化回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| task | `UploadTask` | - 上传任务对象 |
| status | `number` | - HTTP状态码 |

### 举上传任务回调函数

枚举上传任务回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| tasks | `UploadTask[]` | - 上传任务数组 |

### 传任务类

上传任务类

### constructor()

代理原生任务的属性

### catch()

添加上传文件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 文件路径 |
| options | `UploadFileOptions` | - 文件选项 |

**返回值**: `boolean` - 是否添加成功

### catch()

添加上传数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| key | `string` | - 键名 |
| value | `string` | - 键值 |

**返回值**: `boolean` - 是否添加成功

### catch()

开始上传任务

### catch()

暂停上传任务

### catch()

恢复上传任务

### catch()

取消上传任务

### 加事件监听器

添加事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 事件类型 |
| listener | `Function` | - 监听器函数 |
| [capture=false] | `boolean` | - 是否捕获 |

### 除事件监听器

移除事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 事件类型 |
| listener | `Function` | - 监听器函数 |

### 理事件

处理事件

### 取所有HTTP响应头

获取所有HTTP响应头

**返回值**: `string` - 响应头字符串

### 取指定的HTTP响应头

获取指定的HTTP响应头

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| headerName | `string` | - 头名称 |

**返回值**: `string` - 头值

### catch()

设置HTTP请求头

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| headerName | `string` | - 头名称 |
| headerValue | `string` | - 头值 |

### 毁任务

销毁任务

### 取上传进度

获取上传进度

**返回值**: `number` - 上传进度（0-100）

### 断任务是否已完成

判断任务是否已完成

**返回值**: `boolean` - 是否已完成

### 断任务是否已暂停

判断任务是否已暂停

**返回值**: `boolean` - 是否已暂停

### 断任务是否正在上传

判断任务是否正在上传

**返回值**: `boolean` - 是否正在上传

### HTML5+ Uploader 模块类

HTML5+ Uploader 模块类

### 始化Uploader模块

初始化Uploader模块

**返回值**: `Promise<void>` - */

### 建上传任务

创建上传任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 上传URL |
| [options] | `UploadOptions` | - 上传选项 |
| [completedCallback] | `UploadCompletedCallback` | - 完成回调 |

**返回值**: `Promise<UploadTask>` - 上传任务对象

### 浏览器环境中创建上传任务

在浏览器环境中创建上传任务

### 除上传任务

清除上传任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [state] | `number` | - 要清除的任务状态，默认清除所有任务 |

**返回值**: `Promise<void>` - */

### 举上传任务

枚举上传任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [state] | `number` | - 要枚举的任务状态，默认枚举所有任务 |

**返回值**: `Promise<UploadTask[]>` - 上传任务数组

### 始所有上传任务

开始所有上传任务

**返回值**: `Promise<void>` - */

### 取当前活跃的上传任务数量

获取当前活跃的上传任务数量

**返回值**: `number` - 活跃任务数量

### 取所有上传任务

获取所有上传任务

**返回值**: `UploadTask[]` - 所有上传任务

### 据ID获取上传任务

根据ID获取上传任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| taskId | `string|number` | - 任务ID |

**返回值**: `UploadTask|null` - 上传任务

### 除上传任务

移除上传任务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| taskId | `string|number` | - 任务ID |

**返回值**: `boolean` - 是否移除成功

### 理所有已完成或失败的任务

清理所有已完成或失败的任务

**返回值**: `Promise<number>` - 清理的任务数量

### 断设备是否支持上传功能

判断设备是否支持上传功能

**返回值**: `Promise<boolean>` - 是否支持

## 使用示例

### 基本用法

```javascript
import uploader from '../modules/uploader.js';

try {
  // 基本操作
  const result = await uploader.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeUploaderOperation() {
  try {
    // 检查支持性
    const supported = await uploader.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await uploader.checkPermission();
    if (permission !== 'granted') {
      const result = await uploader.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await uploader.someMethod();
    return result;

  } catch (error) {
    console.error('Uploader 操作失败:', error);
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

