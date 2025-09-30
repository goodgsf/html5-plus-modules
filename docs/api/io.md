# IO API

> 文件系统操作

## 模块概览

IO 模块提供了完整的 文件系统操作 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import io from '../modules/io.js';

// 检查模块支持性
const supported = await io.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await io.checkPermission();
if (permission !== 'granted') {
  const result = await io.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### Flags

**类型**: `Object`

文件操作标志

### Metadata

**类型**: `Object`

文件或目录的元数据

### FileInfo

**类型**: `Object`

文件信息对象

### AudioInfo

**类型**: `Object`

音频文件信息对象

### ImageInfo

**类型**: `Object`

图片文件信息对象

### VideoInfo

**类型**: `Object`

视频文件信息对象

### FileEvent

**类型**: `Object`

文件事件对象

## 方法

### HTML5+ IO 模块 ES Module 封装

HTML5+ IO 模块 ES Module 封装

### 件系统类型常量

文件系统类型常量

### URL类型常量

URL类型常量

### IO错误代码常量

IO错误代码常量

### 件系统成功回调函数

文件系统成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| filesystem | `Object` | - 文件系统对象 |

### 件解析成功回调函数

文件解析成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| entry | `Object` | - 文件或目录对象 |

### 数据成功回调函数

元数据成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| metadata | `Metadata` | - 元数据信息 |

### 件条目成功回调函数

文件条目成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| entry | `Object` | - 文件或目录对象 |

### 件条目列表成功回调函数

文件条目列表成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| entries | `Array<Object>` | - 文件或目录对象数组 |

### 件写入成功回调函数

文件写入成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| writer | `Object` | - 文件写入对象 |

### 件成功回调函数

文件成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| file | `Object` | - 文件对象 |

### IO操作成功回调函数

IO操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `*` | - 操作结果 |

### IO操作失败回调函数

IO操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### IO操作完成回调函数

IO操作完成回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `*` | - 操作结果 |

### IO模块类

IO模块类

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

### 式化元数据

格式化元数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeMetadata | `Object` | - 原生元数据 |

**返回值**: `Metadata` - 格式化后的元数据

### 式化文件信息

格式化文件信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeInfo | `Object` | - 原生文件信息 |

**返回值**: `FileInfo` - 格式化后的文件信息

### 式化音频信息

格式化音频信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeInfo | `Object` | - 原生音频信息 |

**返回值**: `AudioInfo` - 格式化后的音频信息

### 式化图片信息

格式化图片信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeInfo | `Object` | - 原生图片信息 |

**返回值**: `ImageInfo` - 格式化后的图片信息

### 式化视频信息

格式化视频信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeInfo | `Object` | - 原生视频信息 |

**返回值**: `VideoInfo` - 格式化后的视频信息

### 求本地文件系统对象

请求本地文件系统对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 文件系统类型 |
| successCB | `FileSystemSuccessCallback` | - 成功回调函数 |
| [errorCB] | `IOFailCallback` | - 失败回调函数 |

**返回值**: `Promise<Object>` - 返回文件系统对象

### 过URL参数获取目录对象或文件对象

通过URL参数获取目录对象或文件对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 要解析的URL地址 |
| successCB | `FileResolveSuccessCallback` | - 成功回调函数 |
| [errorCB] | `IOFailCallback` | - 失败回调函数 |

**返回值**: `Promise<Object>` - 返回文件或目录对象

### 本地URL路径转换成平台绝对路径

将本地URL路径转换成平台绝对路径

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 要转换的本地URL地址 |

**返回值**: `Promise<string>` - 返回平台绝对路径

### 平台绝对路径转换成本地URL路径

将平台绝对路径转换成本地URL路径

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 要转换的平台绝对路径 |

**返回值**: `Promise<string>` - 返回本地URL路径

### catch()

获取音频文件信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 音频文件路径 |

**返回值**: `Promise<AudioInfo>` - 返回音频文件信息

### catch()

获取文件信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 文件路径 |

**返回值**: `Promise<FileInfo>` - 返回文件信息

### catch()

获取图片信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 图片文件路径 |

**返回值**: `Promise<ImageInfo>` - 返回图片文件信息

### catch()

获取视频文件信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 视频文件路径 |

**返回值**: `Promise<VideoInfo>` - 返回视频文件信息

### 化的获取文件信息方法，自动处理错误

简化的获取文件信息方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 文件路径 |

**返回值**: `Promise<FileInfo|null>` - 成功返回文件信息，失败返回null

### 化的获取图片信息方法，自动处理错误

简化的获取图片信息方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 图片文件路径 |

**返回值**: `Promise<ImageInfo|null>` - 成功返回图片信息，失败返回null

### 化的获取音频信息方法，自动处理错误

简化的获取音频信息方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 音频文件路径 |

**返回值**: `Promise<AudioInfo|null>` - 成功返回音频信息，失败返回null

### 化的获取视频信息方法，自动处理错误

简化的获取视频信息方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 视频文件路径 |

**返回值**: `Promise<VideoInfo|null>` - 成功返回视频信息，失败返回null

### 断设备是否支持IO功能

判断设备是否支持IO功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

## 使用示例

### 基本用法

```javascript
import io from '../modules/io.js';

try {
  // 基本操作
  const result = await io.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeIOOperation() {
  try {
    // 检查支持性
    const supported = await io.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await io.checkPermission();
    if (permission !== 'granted') {
      const result = await io.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await io.someMethod();
    return result;

  } catch (error) {
    console.error('IO 操作失败:', error);
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

