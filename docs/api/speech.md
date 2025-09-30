# Speech API

> 语音识别与合成

## 模块概览

Speech 模块提供了完整的 语音识别与合成 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import speech from '../modules/speech.js';

// 检查模块支持性
const supported = await speech.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await speech.checkPermission();
if (permission !== 'granted') {
  const result = await speech.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### SpeechRecognizeOptions

**类型**: `Object`

语音识别选项

### SpeechEventType

**类型**: `string`

语音识别事件类型

### SpeechRecognizeEvent

**类型**: `Object`

语音识别事件

## 方法

### HTML5+ Speech 模块 ES Module 封装

HTML5+ Speech 模块 ES Module 封装

### 音识别错误码常量

语音识别错误码常量

### 音识别成功回调函数

语音识别成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `string` | - 识别结果 |

### 音识别事件回调函数

语音识别事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `SpeechRecognizeEvent` | - 语音识别事件 |

### 音识别错误回调函数

语音识别错误回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Speech 模块类

HTML5+ Speech 模块类

### 始化Speech模块

初始化Speech模块

**返回值**: `Promise<void>` - */

### catch()

开始语音识别

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [options] | `SpeechRecognizeOptions` | - 语音识别选项 |
| [successCallback] | `RecognitionSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `RecognitionErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中开始语音识别

在浏览器环境中开始语音识别

### catch()

停止语音识别

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 加语音识别事件监听器

添加语音识别事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `SpeechEventType` | - 事件类型 |
| listener | `RecognitionEventCallback` | - 事件监听器 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 除语音识别事件监听器

移除语音识别事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `SpeechEventType` | - 事件类型 |
| listener | `RecognitionEventCallback` | - 事件监听器 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取当前语音识别状态

获取当前语音识别状态

**返回值**: `Promise<boolean>` - 是否正在识别中

**示例**:

```javascript
```javascript
```

### 取当前语音识别选项

获取当前语音识别选项

**返回值**: `Promise<SpeechRecognizeOptions>` - 当前识别选项

**示例**:

```javascript
```javascript
```

### 取支持的语音识别引擎列表

获取支持的语音识别引擎列表

**返回值**: `Promise<string[]>` - 引擎列表

**示例**:

```javascript
```javascript
```

### 准化语音识别选项

标准化语音识别选项

### 送事件到监听器

发送事件到监听器

### 加标点符号

添加标点符号

### 射浏览器错误码

映射浏览器错误码

### 断设备是否支持语音识别功能

判断设备是否支持语音识别功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 查语音识别权限状态

检查语音识别权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求语音识别权限

请求语音识别权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import speech from '../modules/speech.js';

try {
  // 基本操作
  const result = await speech.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeSpeechOperation() {
  try {
    // 检查支持性
    const supported = await speech.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await speech.checkPermission();
    if (permission !== 'granted') {
      const result = await speech.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await speech.someMethod();
    return result;

  } catch (error) {
    console.error('Speech 操作失败:', error);
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

