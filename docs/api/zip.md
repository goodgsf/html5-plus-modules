# Zip API

> 压缩解压缩管理

## 模块概览

Zip 模块提供了完整的 压缩解压缩管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import zip from '../modules/zip.js';

// 检查模块支持性
const supported = await zip.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await zip.checkPermission();
if (permission !== 'granted') {
  const result = await zip.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### CompressImageOptions

**类型**: `Object`

图片压缩选项

### CompressVideoOptions

**类型**: `Object`

视频压缩选项

### ClipImageOptions

**类型**: `Object`

图片裁剪选项

### CompressImageResult

**类型**: `Object`

图片压缩成功结果

### CompressVideoResult

**类型**: `Object`

视频压缩成功结果

## 方法

### HTML5+ Zip 模块 ES Module 封装

HTML5+ Zip 模块 ES Module 封装

### Zip模块错误码常量

Zip模块错误码常量

### Zip操作成功回调函数

Zip操作成功回调函数

### Zip操作失败回调函数

Zip操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### 片压缩成功回调函数

图片压缩成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `CompressImageResult` | - 压缩结果 |

### 频压缩成功回调函数

视频压缩成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `CompressVideoResult` | - 压缩结果 |

### HTML5+ Zip 模块类

HTML5+ Zip 模块类

### 始化Zip模块

初始化Zip模块

**返回值**: `Promise<void>` - */

### 缩生成Zip文件

压缩生成Zip文件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| src | `string` | - 要压缩的源文件路径，支持文件路径或目录 |
| zipfile | `string` | - 压缩后保存的Zip文件路径 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中压缩文件

在浏览器环境中压缩文件

### 压缩Zip文件

解压缩Zip文件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| zipfile | `string` | - 需解压Zip文件路径 |
| target | `string` | - 解压Zip文件的目标路径 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中解压文件

在浏览器环境中解压文件

### 片压缩转换

图片压缩转换

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `CompressImageOptions` | - 图片压缩转换的参数 |

**返回值**: `Promise<CompressImageResult>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中压缩图片

在浏览器环境中压缩图片

### 析尺寸值

解析尺寸值

### catch()

视频压缩

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `CompressVideoOptions` | - 视频压缩的参数 |

**返回值**: `Promise<CompressVideoResult>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持Zip功能

判断设备是否支持Zip功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 断设备是否支持图片压缩功能

判断设备是否支持图片压缩功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 断设备是否支持视频压缩功能

判断设备是否支持视频压缩功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 查Zip权限状态

检查Zip权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求Zip权限

请求Zip权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import zip from '../modules/zip.js';

try {
  // 基本操作
  const result = await zip.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeZipOperation() {
  try {
    // 检查支持性
    const supported = await zip.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await zip.checkPermission();
    if (permission !== 'granted') {
      const result = await zip.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await zip.someMethod();
    return result;

  } catch (error) {
    console.error('Zip 操作失败:', error);
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

