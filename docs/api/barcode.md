# Barcode API

> 条码/二维码扫描

## 模块概览

Barcode 模块提供了完整的 条码/二维码扫描 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import barcode from '../modules/barcode.js';

// 检查模块支持性
const supported = await barcode.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await barcode.checkPermission();
if (permission !== 'granted') {
  const result = await barcode.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### BarcodeStyles

**类型**: `Object`

条码识别控件样式

### BarcodeOptions

**类型**: `Object`

条码识别控件扫描参数

### Barcode

**类型**: `Object`

扫码识别控件对象

### BarcodeResult

**类型**: `Object`

条码识别结果对象

## 方法

### HTML5+ Barcode 模块 ES Module 封装

HTML5+ Barcode 模块 ES Module 封装

### 码类型常量

条码类型常量

### 码识别成功回调函数

扫码识别成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 识别到的条码类型 |
| code | `string` | - 识别到的条码数据 |
| [file] | `string` | - 扫码成功的截图文件路径（可选） |
| [charset] | `string` | - 识别到原始数据的字符集类型（可选） |

### 码识别错误回调函数

扫码识别错误回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Barcode模块类

Barcode模块类

### 码识别图片中的条码

扫码识别图片中的条码

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 要扫码的图片路径 |
| successCB | `BarcodeSuccessCallback` | - 扫码识别成功回调函数 |
| [errorCB] | `BarcodeErrorCallback` | - 扫码识别失败回调函数 |
| [filters] | `number[]` | - 条码类型过滤器数组 |
| [autoDecodeCharset] | `boolean` | - 自动解码字符集 |

**返回值**: `Promise<BarcodeResult>|void` - 扫码识别结果

**示例**:

```javascript
```javascript
```

### 建扫码识别控件对象

创建扫码识别控件对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 扫码识别控件的标识 |
| [filters] | `number[]` | - 条码类型过滤器数组 |
| [styles] | `BarcodeStyles` | - 扫码识别控件样式 |
| [autoDecodeCharset] | `boolean` | - 自动解码字符集 |

**返回值**: `Promise<Barcode>|Barcode` - 扫码识别控件对象

**示例**:

```javascript
```javascript
```

### 找扫码识别控件对象

查找扫码识别控件对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 扫码识别控件的标识 |

**返回值**: `Barcode|null` - 扫码识别控件对象

**示例**:

```javascript
```javascript
```

### 装条码控件对象，添加额外功能

包装条码控件对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| barcode | `Object` | - 条码控件对象 |
| id | `string` | - 控件标识 |

### 断设备是否支持条码识别功能

判断设备是否支持条码识别功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前活跃的条码控件信息

获取当前活跃的条码控件信息

**返回值**: `Array<Object>` - 活跃条码控件信息数组

**示例**:

```javascript
```javascript
```

### 闭所有活跃的条码控件

关闭所有活跃的条码控件

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取条码类型名称

获取条码类型名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 条码类型常量 |

**返回值**: `string` - 条码类型名称

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import barcode from '../modules/barcode.js';

try {
  // 基本操作
  const result = await barcode.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeBarcodeOperation() {
  try {
    // 检查支持性
    const supported = await barcode.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await barcode.checkPermission();
    if (permission !== 'granted') {
      const result = await barcode.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await barcode.someMethod();
    return result;

  } catch (error) {
    console.error('Barcode 操作失败:', error);
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

