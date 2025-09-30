# Gallery API

> 图库管理

## 模块概览

Gallery 模块提供了完整的 图库管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import gallery from '../modules/gallery.js';

// 检查模块支持性
const supported = await gallery.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await gallery.checkPermission();
if (permission !== 'granted') {
  const result = await gallery.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### GallerySaveEvent

**类型**: `Object`

保存图片到相册成功事件

### GalleryOptions

**类型**: `Object`

从相册中选择文件的参数

### GalleryCropStyles

**类型**: `Object`

裁剪图片设置项

### PopPosition

**类型**: `Object`

弹出界面指示位置

### GalleryMultiplePickEvent

**类型**: `Object`

相册选择成功事件（多选）

## 方法

### HTML5+ Gallery 模块 ES Module 封装

HTML5+ Gallery 模块 ES Module 封装

### 册选择文件过滤类型

相册选择文件过滤类型

### 选系统相册文件成功的回调函数

单选系统相册文件成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| file | `string` | - 选择的文件路径 |

### 选系统相册文件成功的回调函数

多选系统相册文件成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `GalleryMultiplePickEvent` | - 多选返回数据 |

### 作系统相册成功的回调函数

操作系统相册成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `GallerySaveEvent` | - 保存成功事件对象 |

### 统相册操作失败的回调函数

系统相册操作失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Gallery模块类

Gallery模块类

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

### 式化选项参数

格式化选项参数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `GalleryOptions` | - 选项参数 |

**返回值**: `Object` - 格式化后的选项

### 系统相册选择文件（图片或视频）

从系统相册选择文件（图片或视频）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successFn | `GalleryPickSuccessCallback|GalleryMultiplePickSuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |
| [options={}] | `GalleryOptions` | - 选择文件的参数 |

**返回值**: `Promise<string|GalleryMultiplePickEvent>` - 返回选择的文件路径或文件数组

### 存文件到系统相册中

保存文件到系统相册中

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 要保存的文件路径 |
| [successFn] | `GallerySuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<GallerySaveEvent>` - 返回保存成功事件

### 相册选择单个图片

从相册选择单个图片

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `GalleryPickSuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<string>` - 返回选择的图片路径

### 相册选择单个视频

从相册选择单个视频

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `GalleryPickSuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<string>` - 返回选择的视频路径

### 相册选择多个图片

从相册选择多个图片

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `GalleryMultiplePickSuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<GalleryMultiplePickEvent>` - 返回选择的图片数组

### 相册选择多个视频

从相册选择多个视频

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successFn] | `GalleryMultiplePickSuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<GalleryMultiplePickEvent>` - 返回选择的视频数组

### 存图片到相册

保存图片到相册

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 图片路径 |
| [successFn] | `GallerySuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<GallerySaveEvent>` - 返回保存成功事件

### 存视频到相册

保存视频到相册

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 视频路径 |
| [successFn] | `GallerySuccessCallback` | - 成功回调函数 |
| [errorFn] | `GalleryErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<GallerySaveEvent>` - 返回保存成功事件

### 化的图片选择方法，自动处理错误

简化的图片选择方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<string|null>` - 成功返回图片路径，失败返回null

### 化的多图片选择方法，自动处理错误

简化的多图片选择方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<string[]|null>` - 成功返回图片路径数组，失败返回null

### 化的视频选择方法，自动处理错误

简化的视频选择方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options={}] | `GalleryOptions` | - 选择参数 |

**返回值**: `Promise<string|null>` - 成功返回视频路径，失败返回null

### 化的保存方法，自动处理错误

简化的保存方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 文件路径 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

## 使用示例

### 基本用法

```javascript
import gallery from '../modules/gallery.js';

try {
  // 基本操作
  const result = await gallery.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeGalleryOperation() {
  try {
    // 检查支持性
    const supported = await gallery.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await gallery.checkPermission();
    if (permission !== 'granted') {
      const result = await gallery.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await gallery.someMethod();
    return result;

  } catch (error) {
    console.error('Gallery 操作失败:', error);
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

