# Camera API

> 相机功能管理

## 模块概览

Camera 模块提供了完整的 相机功能管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import camera from '../modules/camera.js';

// 检查模块支持性
const supported = await camera.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await camera.checkPermission();
if (permission !== 'granted') {
  const result = await camera.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### CameraOptions

**类型**: `Object`

摄像头选项参数

### CameraCropStyles

**类型**: `Object`

裁剪图片设置项

### PopPosition

**类型**: `Object`

弹出位置参数

### Camera

**类型**: `Object`

摄像头对象

### CameraResult

**类型**: `Object`

摄像头操作结果对象

## 方法

### HTML5+ Camera 模块 ES Module 封装

HTML5+ Camera 模块 ES Module 封装

### 像头常量

摄像头常量

### 片格式常量

图片格式常量

### 频格式常量

视频格式常量

### 像头操作成功回调函数

摄像头操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| capturedFile | `string` | - 拍照或摄像操作保存的文件路径 |

### 像头操作失败回调函数

摄像头操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Camera模块类

Camera模块类

### 取摄像头管理对象

获取摄像头管理对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [index] | `number` | - 要获取摄像头的索引值，1表示主摄像头，2表示辅摄像头 |

**返回值**: `Promise<Camera>|Camera` - 摄像头对象

**示例**:

```javascript
```javascript
```

### 装摄像头对象，添加额外功能

包装摄像头对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| camera | `Object` | - 摄像头对象 |
| cameraId | `string` | - 摄像头ID |

### 断设备是否支持摄像头功能

判断设备是否支持摄像头功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前活跃的摄像头信息

获取当前活跃的摄像头信息

**返回值**: `Array<Object>` - 活跃摄像头信息数组

**示例**:

```javascript
```javascript
```

### 闭所有活跃的摄像头

关闭所有活跃的摄像头

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取摄像头类型名称

获取摄像头类型名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 摄像头类型常量 |

**返回值**: `string` - 摄像头类型名称

**示例**:

```javascript
```javascript
```

### 取图片格式名称

获取图片格式名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| format | `string` | - 图片格式常量 |

**返回值**: `string` - 图片格式名称

**示例**:

```javascript
```javascript
```

### 取视频格式名称

获取视频格式名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| format | `string` | - 视频格式常量 |

**返回值**: `string` - 视频格式名称

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import camera from '../modules/camera.js';

try {
  // 基本操作
  const result = await camera.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeCameraOperation() {
  try {
    // 检查支持性
    const supported = await camera.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await camera.checkPermission();
    if (permission !== 'granted') {
      const result = await camera.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await camera.someMethod();
    return result;

  } catch (error) {
    console.error('Camera 操作失败:', error);
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

