# Video API

> 视频播放和录制管理

## 模块概览

Video 模块提供了完整的 视频播放和录制管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import video from '../modules/video.js';

// 检查模块支持性
const supported = await video.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await video.checkPermission();
if (permission !== 'granted') {
  const result = await video.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### VideoPlayerStyles

**类型**: `Object`

视频播放器配置选项

### LivePusherStyles

**类型**: `Object`

直播推流器配置选项

### VideoPlayerEventType

**类型**: `Object`

视频播放器事件类型

### LivePusherEventType

**类型**: `Object`

直播推流器事件类型

### VideoPlayerEvent

**类型**: `Object`

视频播放器事件信息

### LivePusherEvent

**类型**: `Object`

直播推流器事件信息

### VideoPlayerInfo

**类型**: `Object`

视频播放器信息

### LivePusherInfo

**类型**: `Object`

直播推流器信息

## 方法

### HTML5+ Video 模块 ES Module 封装

HTML5+ Video 模块 ES Module 封装

### 频播放器错误码常量

视频播放器错误码常量

### 播推流错误码常量

直播推流错误码常量

### 频播放器事件回调函数

视频播放器事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `VideoPlayerEvent` | - 事件信息 |

### 播推流器事件回调函数

直播推流器事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `LivePusherEvent` | - 事件信息 |

### 频播放器类

视频播放器类

### 理原生播放器属性

代理原生播放器属性

### 义代理属性

定义代理属性

### 放视频

播放视频

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 停播放

暂停播放

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 止播放

停止播放

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 转到指定位置

跳转到指定位置

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| position | `number` | - 跳转位置，单位秒 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

关闭播放器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 置播放器样式

设置播放器样式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `VideoPlayerStyles` | - 样式配置 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

请求全屏

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

退出全屏

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

设置播放速率

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| rate | `number` | - 播放速率，0.5-2.0 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 加事件监听器

添加事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| callback | `VideoPlayerEventCallback` | - 事件回调函数 |

**示例**:

```javascript
```javascript
```

### 除事件监听器

移除事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| callback | `VideoPlayerEventCallback` | - 事件回调函数 |

**示例**:

```javascript
```javascript
```

### catch()

获取播放器信息

**返回值**: `Promise<VideoPlayerInfo>` - *

**示例**:

```javascript
```javascript
```

### 播推流器类

直播推流器类

### 理原生推流器属性

代理原生推流器属性

### 义代理属性

定义代理属性

### 始推流

开始推流

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

停止推流

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

暂停推流

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

恢复推流

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

切换摄像头

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| camera | `string` | - 摄像头位置，front、back |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

快照

**返回值**: `Promise<string>` - 快照图片路径

**示例**:

```javascript
```javascript
```

### catch()

预览

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

关闭推流器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 置推流器样式

设置推流器样式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `LivePusherStyles` | - 样式配置 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 加事件监听器

添加事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| callback | `LivePusherEventCallback` | - 事件回调函数 |

**示例**:

```javascript
```javascript
```

### 除事件监听器

移除事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| callback | `LivePusherEventCallback` | - 事件回调函数 |

**示例**:

```javascript
```javascript
```

### catch()

获取推流器信息

**返回值**: `Promise<LivePusherInfo>` - *

**示例**:

```javascript
```javascript
```

### HTML5+ Video 模块类

HTML5+ Video 模块类

### 始化Video模块

初始化Video模块

**返回值**: `Promise<void>` - */

### catch()

创建视频播放器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 视频URL |
| [styles] | `VideoPlayerStyles` | - 播放器样式 |

**返回值**: `Promise<VideoPlayer>` - 视频播放器对象

**示例**:

```javascript
```javascript
```

### 浏览器环境中创建视频播放器

在浏览器环境中创建视频播放器

### 建直播推流器

创建直播推流器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 推流URL |
| [styles] | `LivePusherStyles` | - 推流器样式 |

**返回值**: `Promise<LivePusher>` - 直播推流器对象

**示例**:

```javascript
```javascript
```

### 据ID获取视频播放器

根据ID获取视频播放器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `number` | - 视频播放器ID |

**返回值**: `Promise<VideoPlayer>` - 视频播放器对象

**示例**:

```javascript
```javascript
```

### 据ID获取直播推流器

根据ID获取直播推流器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `number` | - 直播推流器ID |

**返回值**: `Promise<LivePusher>` - 直播推流器对象

**示例**:

```javascript
```javascript
```

### 取当前活跃的视频播放器数量

获取当前活跃的视频播放器数量

**返回值**: `number` - 活跃播放器数量

**示例**:

```javascript
```javascript
```

### 取当前活跃的直播推流器数量

获取当前活跃的直播推流器数量

**返回值**: `number` - 活跃推流器数量

**示例**:

```javascript
```javascript
```

### 闭所有视频播放器

关闭所有视频播放器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 闭所有直播推流器

关闭所有直播推流器

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持视频播放功能

判断设备是否支持视频播放功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 断设备是否支持直播推流功能

判断设备是否支持直播推流功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 查视频播放权限状态

检查视频播放权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 查直播推流权限状态

检查直播推流权限状态

**返回值**: `Promise<string>` - 权限状态：'granted'、'denied'、'prompt'

**示例**:

```javascript
```javascript
```

### 求视频播放权限

请求视频播放权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

### 求直播推流权限

请求直播推流权限

**返回值**: `Promise<string>` - 权限状态：'granted' 或 'denied'

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import video from '../modules/video.js';

try {
  // 基本操作
  const result = await video.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeVideoOperation() {
  try {
    // 检查支持性
    const supported = await video.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await video.checkPermission();
    if (permission !== 'granted') {
      const result = await video.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await video.someMethod();
    return result;

  } catch (error) {
    console.error('Video 操作失败:', error);
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

