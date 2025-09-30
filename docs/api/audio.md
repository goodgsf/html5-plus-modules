# Audio API

> 音频播放和录制管理

## 模块概览

Audio 模块提供了完整的 音频播放和录制管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import audio from '../modules/audio.js';

// 检查模块支持性
const supported = await audio.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await audio.checkPermission();
if (permission !== 'granted') {
  const result = await audio.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AudioPlayerEvent

**类型**: `string`

音频播放事件类型

### AudioPlayerStyles

**类型**: `Object`

音频播放对象的参数

### AudioRecorderStyles

**类型**: `Object`

音频录制的参数

## 方法

### HTML5+ Audio 模块 ES Module 封装

HTML5+ Audio 模块 ES Module 封装

### 频输出线路常量

音频输出线路常量

### 音操作成功回调

录音操作成功回调

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| filename | `string` | - 录音文件路径 |

### 放音频文件操作成功回调

播放音频文件操作成功回调

### 频操作失败回调

音频操作失败回调

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### 件回调函数

事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 事件对象 |
| event.type | `string` | - 事件类型 |
| event.data | `*` | - 事件数据 |

### Audio模块类

Audio模块类

### 取当前设备的录音对象

获取当前设备的录音对象

**返回值**: `Promise<AudioRecorder>|AudioRecorder` - 录音对象

**示例**:

```javascript
```javascript
```

### 建音频播放器对象

创建音频播放器对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [styles] | `AudioPlayerStyles` | - 音频播放对象的参数 |

**返回值**: `Promise<AudioPlayer>|AudioPlayer` - 音频播放器对象

**示例**:

```javascript
```javascript
```

### 装录音器对象，添加额外功能

包装录音器对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| recorder | `Object` | - 录音器对象 |
| recorderId | `string` | - 录音器ID |

### 装播放器对象，添加额外功能

包装播放器对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| player | `Object` | - 播放器对象 |
| playerId | `string` | - 播放器ID |

### 断设备是否支持音频功能

判断设备是否支持音频功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取当前活跃的播放器信息

获取当前活跃的播放器信息

**返回值**: `Array<Object>` - 活跃播放器信息数组

**示例**:

```javascript
```javascript
```

### 取当前活跃的录音器信息

获取当前活跃的录音器信息

**返回值**: `Array<Object>` - 活跃录音器信息数组

**示例**:

```javascript
```javascript
```

### 闭所有活跃的播放器

关闭所有活跃的播放器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 毁所有活跃的录音器

销毁所有活跃的录音器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import audio from '../modules/audio.js';

try {
  // 基本操作
  const result = await audio.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeAudioOperation() {
  try {
    // 检查支持性
    const supported = await audio.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await audio.checkPermission();
    if (permission !== 'granted') {
      const result = await audio.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await audio.someMethod();
    return result;

  } catch (error) {
    console.error('Audio 操作失败:', error);
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

