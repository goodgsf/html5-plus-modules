# NativeObj API

> 原生对象管理

## 模块概览

NativeObj 模块提供了完整的 原生对象管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import nativeObj from '../modules/nativeObj.js';

// 检查模块支持性
const supported = await nativeObj.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await nativeObj.checkPermission();
if (permission !== 'granted') {
  const result = await nativeObj.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AnimationOptions

**类型**: `Object`

动画选项配置对象

### AnimationViewStyles

**类型**: `Object`

动画视图样式配置对象

### Position

**类型**: `Object`

位置对象

### Rect

**类型**: `Object`

矩形区域对象

### TextStyles

**类型**: `Object`

文本样式对象

### RectStyles

**类型**: `Object`

矩形样式对象

### ViewStyles

**类型**: `Object`

视图样式对象

### ImageStyles

**类型**: `Object`

图片样式对象

### ImageSliderStyles

**类型**: `Object`

图片轮播样式对象

## 方法

### HTML5+ NativeObj 模块 ES Module 封装

HTML5+ NativeObj 模块 ES Module 封装

### 生对象错误代码常量

原生对象错误代码常量

### 片缩放模式常量

图片缩放模式常量

### 本对齐方式常量

文本对齐方式常量

### 本溢出处理方式常量

文本溢出处理方式常量

### 图成功回调函数

位图成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| bitmap | `Object` | - 位图对象 |

### 图操作成功回调函数

位图操作成功回调函数

### 图操作失败回调函数

位图操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### 图成功回调函数

视图成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| view | `Object` | - 视图对象 |

### 图操作成功回调函数

视图操作成功回调函数

### 图操作失败回调函数

视图操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### 图对象类

位图对象类

### 建位图对象

创建位图对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeBitmap | `Object` | - 原生位图对象 |

### catch()

加载图片

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 图片路径 |
| [successCB] | `BitmapSuccessCallback` | - 成功回调函数 |
| [errorCB] | `BitmapErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<Bitmap>` - 返回位图对象

### 载Base64图片数据

加载Base64图片数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| data | `string` | - Base64图片数据 |
| [successCB] | `BitmapSuccessCallback` | - 成功回调函数 |
| [errorCB] | `BitmapErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<Bitmap>` - 返回位图对象

### 除位图内容

清除位图内容

### catch()

回收位图资源

### 存位图到文件

保存位图到文件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 保存路径 |
| [options] | `Object` | - 保存选项 |
| [options.format='png'] | `string` | - 保存格式 |
| [options.quality=100] | `number` | - 保存质量 |
| [successCB] | `BitmapOperationSuccessCallback` | - 成功回调函数 |
| [errorCB] | `BitmapErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - 返回Promise

### 取位图的Base64数据

获取位图的Base64数据

**返回值**: `string` - Base64数据

### 图对象类

视图对象类

### 建视图对象

创建视图对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeView | `Object` | - 原生视图对象 |

### catch()

显示视图

### catch()

关闭视图

### catch()

绘制标签

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| tags | `Array` | - 标签数组 |

### catch()

绘制矩形

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `RectStyles` | - 矩形样式 |
| position | `Position` | - 位置信息 |

### catch()

绘制文本

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| text | `string` | - 文本内容 |
| position | `Position` | - 位置信息 |
| styles | `TextStyles` | - 文本样式 |

### catch()

绘制位图

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| bitmap | `Bitmap` | - 位图对象 |
| src | `Rect` | - 源矩形区域 |
| position | `Position` | - 目标位置 |

### 片轮播控件类

图片轮播控件类

### 建图片轮播控件对象

创建图片轮播控件对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeImageSlider | `Object` | - 原生图片轮播控件对象 |

### 加图片到轮播控件

添加图片到轮播控件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| images | `Array` | - 图片路径数组 |

### 取当前显示的图片索引

获取当前显示的图片索引

**返回值**: `number` - 当前图片索引

### 置轮播控件的图片

设置轮播控件的图片

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| images | `Array` | - 图片路径数组 |

### NativeObj模块类

NativeObj模块类

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

### 建位图对象

创建位图对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| width | `number` | - 位图宽度 |
| height | `number` | - 位图高度 |

**返回值**: `Bitmap` - 位图对象

### 建视图对象

创建视图对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `ViewStyles` | - 视图样式 |

**返回值**: `View` - 视图对象

### 建图片轮播控件对象

创建图片轮播控件对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `ImageSliderStyles` | - 轮播控件样式 |

**返回值**: `ImageSlider` - 图片轮播控件对象

### 化的创建位图方法，自动处理错误

简化的创建位图方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| width | `number` | - 位图宽度 |
| height | `number` | - 位图高度 |

**返回值**: `Bitmap|null` - 成功返回位图对象，失败返回null

### 化的创建视图方法，自动处理错误

简化的创建视图方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `ViewStyles` | - 视图样式 |

**返回值**: `View|null` - 成功返回视图对象，失败返回null

### 化的创建图片轮播控件方法，自动处理错误

简化的创建图片轮播控件方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `ImageSliderStyles` | - 轮播控件样式 |

**返回值**: `ImageSlider|null` - 成功返回轮播控件对象，失败返回null

### 断设备是否支持原生对象功能

判断设备是否支持原生对象功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 取当前活跃的位图数量

获取当前活跃的位图数量

**返回值**: `number` - 活跃位图数量

### 取当前活跃的视图数量

获取当前活跃的视图数量

**返回值**: `number` - 活跃视图数量

### 取当前活跃的轮播控件数量

获取当前活跃的轮播控件数量

**返回值**: `number` - 活跃轮播控件数量

### 理所有活跃对象

清理所有活跃对象

## 使用示例

### 基本用法

```javascript
import nativeObj from '../modules/nativeObj.js';

try {
  // 基本操作
  const result = await nativeObj.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeNativeObjOperation() {
  try {
    // 检查支持性
    const supported = await nativeObj.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await nativeObj.checkPermission();
    if (permission !== 'granted') {
      const result = await nativeObj.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await nativeObj.someMethod();
    return result;

  } catch (error) {
    console.error('NativeObj 操作失败:', error);
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

