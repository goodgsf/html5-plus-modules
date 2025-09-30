# WebView API

> WebView窗口管理

## 模块概览

WebView 模块提供了完整的 WebView窗口管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import webView from '../modules/webView.js';

// 检查模块支持性
const supported = await webView.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await webView.checkPermission();
if (permission !== 'granted') {
  const result = await webView.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AnimationTypeShow

**类型**: `Object`

WebView显示动画类型

### AnimationTypeClose

**类型**: `Object`

WebView关闭动画类型

### WebviewStyles

**类型**: `Object`

WebView窗口样式

### WebViewEventType

**类型**: `Object`

WebView窗口事件类型

### WebViewEvent

**类型**: `Object`

WebView窗口事件信息

### WebViewInfo

**类型**: `Object`

WebView窗口信息

## 方法

### HTML5+ WebView 模块 ES Module 封装

HTML5+ WebView 模块 ES Module 封装

### WebView模块错误码常量

WebView模块错误码常量

### WebView窗口事件回调函数

WebView窗口事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `WebViewEvent` | - 事件信息 |

### WebView窗口操作成功回调函数

WebView窗口操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `void` | - 操作结果 |

### WebView窗口操作失败回调函数

WebView窗口操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### WebView窗口对象类

WebView窗口对象类

### 理原生WebView属性

代理原生WebView属性

### 义代理属性

定义代理属性

### 加事件监听器

添加事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件类型 |
| callback | `WebViewEventCallback` | - 事件回调函数 |

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
| callback | `WebViewEventCallback` | - 事件回调函数 |

**示例**:

```javascript
```javascript
```

### 载URL页面

加载URL页面

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 页面URL |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

加载HTML数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 加载选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### WebView中执行JavaScript

在WebView中执行JavaScript

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| script | `string` | - JavaScript脚本 |

**返回值**: `Promise<string>` - 执行结果

**示例**:

```javascript
```javascript
```

### catch()

显示WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [aniShow] | `string` | - 显示动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [showedCB] | `Function` | - 显示完成回调 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

隐藏WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [aniClose] | `string` | - 关闭动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

关闭WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [aniClose] | `string` | - 关闭动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 退到上一个页面

后退到上一个页面

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 进到下一个页面

前进到下一个页面

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 新加载页面

重新加载页面

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [forced] | `boolean` | - 是否强制重新加载 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 止加载页面

停止加载页面

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 查是否可以后退

检查是否可以后退

**返回值**: `Promise<boolean>` - 是否可以后退

**示例**:

```javascript
```javascript
```

### 查是否可以前进

检查是否可以前进

**返回值**: `Promise<boolean>` - 是否可以前进

**示例**:

```javascript
```javascript
```

### catch()

获取WebView窗口信息

**返回值**: `Promise<WebViewInfo>` - *

**示例**:

```javascript
```javascript
```

### 置WebView窗口样式

设置WebView窗口样式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `WebviewStyles` | - 样式配置 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取WebView窗口样式

获取WebView窗口样式

**返回值**: `Promise<WebviewStyles>` - *

**示例**:

```javascript
```javascript
```

### HTML5+ WebView 模块类

HTML5+ WebView 模块类

### 始化WebView模块

初始化WebView模块

**返回值**: `Promise<void>` - */

### catch()

创建WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [url] | `string` | - 页面URL |
| [id] | `string` | - 窗口标识 |
| [styles] | `WebviewStyles` | - 窗口样式 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<WebViewObject>` - WebView窗口对象

**示例**:

```javascript
```javascript
```

### 浏览器环境中创建WebView窗口

在浏览器环境中创建WebView窗口

### catch()

创建并打开WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [url] | `string` | - 页面URL |
| [id] | `string` | - 窗口标识 |
| [styles] | `WebviewStyles` | - 窗口样式 |
| [extras] | `Object` | - 额外参数 |
| [showani] | `string` | - 显示动画类型 |

**返回值**: `Promise<WebViewObject>` - WebView窗口对象

**示例**:

```javascript
```javascript
```

### catch()

显示WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| webview | `WebViewObject|string` | - WebView窗口对象或ID |
| [aniShow] | `string` | - 显示动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [showedCB] | `Function` | - 显示完成回调 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

隐藏WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| webview | `WebViewObject|string` | - WebView窗口对象或ID |
| [aniClose] | `string` | - 关闭动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

关闭WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| webview | `WebViewObject|string` | - WebView窗口对象或ID |
| [aniClose] | `string` | - 关闭动画类型 |
| [duration] | `number` | - 动画持续时间 |
| [extras] | `Object` | - 额外参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 据ID获取WebView窗口

根据ID获取WebView窗口

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 窗口标识 |

**返回值**: `Promise<WebViewObject>` - WebView窗口对象

**示例**:

```javascript
```javascript
```

### catch()

获取当前WebView窗口

**返回值**: `Promise<WebViewObject>` - 当前WebView窗口对象

**示例**:

```javascript
```javascript
```

### catch()

获取所有WebView窗口

**返回值**: `Promise<WebViewObject[]>` - WebView窗口对象数组

**示例**:

```javascript
```javascript
```

### 取当前活跃的WebView窗口数量

获取当前活跃的WebView窗口数量

**返回值**: `number` - 活跃WebView窗口数量

**示例**:

```javascript
```javascript
```

### 闭所有WebView窗口

关闭所有WebView窗口

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持WebView功能

判断设备是否支持WebView功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### catch()

预加载URL

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 预加载的URL |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import webView from '../modules/webView.js';

try {
  // 基本操作
  const result = await webView.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeWebViewOperation() {
  try {
    // 检查支持性
    const supported = await webView.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await webView.checkPermission();
    if (permission !== 'granted') {
      const result = await webView.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await webView.someMethod();
    return result;

  } catch (error) {
    console.error('WebView 操作失败:', error);
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

