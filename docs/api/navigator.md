# Navigator API

> 页面导航管理

## 模块概览

Navigator 模块提供了完整的 页面导航管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import navigator from '../modules/navigator.js';

// 检查模块支持性
const supported = await navigator.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await navigator.checkPermission();
if (permission !== 'granted') {
  const result = await navigator.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ShortcutOptions

**类型**: `Object`

快捷方式选项

### PermissionResult

**类型**: `Object`

权限结果

### SafeAreaInsets

**类型**: `Object`

安全区域信息

### SignatureInfo

**类型**: `Object`

签名信息

### NetworkInfo

**类型**: `Object`

网络信息

## 方法

### HTML5+ Navigator 模块 ES Module 封装

HTML5+ Navigator 模块 ES Module 封装

### 限状态常量

权限状态常量

### 幕方向常量

屏幕方向常量

### UI风格常量

UI风格常量

### Navigator模块类

Navigator模块类

### 始化Navigator模块

初始化Navigator模块

**返回值**: `Promise<void>` - *

### 始化系统状态

初始化系统状态

### 置网络监听器

设置网络监听器

### 置UI风格监听器

设置UI风格监听器

### 建应用快捷方式

创建应用快捷方式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `ShortcutOptions` | - 快捷方式选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 查应用权限

检查应用权限

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| permission | `string` | - 权限名称 |

**返回值**: `Promise<PermissionResult>` - 权限结果

**示例**:

```javascript
```javascript
```

### 加载应用权限

预加载应用权限

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| permission | `string` | - 权限名称 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 求应用权限

请求应用权限

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| permission | `string` | - 权限名称 |

**返回值**: `Promise<PermissionResult>` - 权限结果

**示例**:

```javascript
```javascript
```

### 断应用是否显示 splash

判断应用是否显示 splash

**返回值**: `Promise<boolean>` - 是否显示 splash

**示例**:

```javascript
```javascript
```

### 闭应用 splash

关闭应用 splash

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断应用是否输出日志

判断应用是否输出日志

**返回值**: `Promise<boolean>` - 是否输出日志

**示例**:

```javascript
```javascript
```

### 断当前设备是否被root破解

判断当前设备是否被root破解

**返回值**: `Promise<boolean>` - 是否被root

**示例**:

```javascript
```javascript
```

### 断当前应用是否运行在模拟器中

判断当前应用是否运行在模拟器中

**返回值**: `Promise<boolean>` - 是否在模拟器中

**示例**:

```javascript
```javascript
```

### 置应用是否全屏显示

设置应用是否全屏显示

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| fullscreen | `boolean` | - 是否全屏 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 置应用是否输出日志

设置应用是否输出日志

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| enable | `boolean` | - 是否输出日志 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 置系统状态栏背景颜色

设置系统状态栏背景颜色

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| color | `string` | - 颜色值 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取系统状态栏背景颜色

获取系统状态栏背景颜色

**返回值**: `Promise<string>` - 状态栏背景颜色

**示例**:

```javascript
```javascript
```

### 置系统状态栏样式

设置系统状态栏样式

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| style | `string` | - 样式值 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取系统状态栏样式

获取系统状态栏样式

**返回值**: `Promise<string>` - 状态栏样式

**示例**:

```javascript
```javascript
```

### 取系统状态栏高度

获取系统状态栏高度

**返回值**: `Promise<number>` - 状态栏高度

**示例**:

```javascript
```javascript
```

### 断当前是否为沉浸式状态栏模式

判断当前是否为沉浸式状态栏模式

**返回值**: `Promise<boolean>` - 是否为沉浸式状态栏

**示例**:

```javascript
```javascript
```

### 置userAgent值

设置userAgent值

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| userAgent | `string` | - userAgent值 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取userAgent值

获取userAgent值

**返回值**: `Promise<string>` - userAgent值

**示例**:

```javascript
```javascript
```

### 置Cookie值

设置Cookie值

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - URL地址 |
| cookie | `string` | - Cookie值 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取Cookie值

获取Cookie值

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - URL地址 |

**返回值**: `Promise<string>` - Cookie值

**示例**:

```javascript
```javascript
```

### 除应用所有Cookie值

删除应用所有Cookie值

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 除应用Cookie

删除应用Cookie

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - URL地址 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 除应用所有会话期Cookie值

删除应用所有会话期Cookie值

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取应用的安全区域

获取应用的安全区域

**返回值**: `Promise<SafeAreaInsets>` - 安全区域信息

**示例**:

```javascript
```javascript
```

### 取应用的横竖屏状态

获取应用的横竖屏状态

**返回值**: `Promise<string>` - 横竖屏状态

**示例**:

```javascript
```javascript
```

### 取系统外观样式（暗黑模式）

获取系统外观样式（暗黑模式）

**返回值**: `Promise<string>` - 系统外观样式

**示例**:

```javascript
```javascript
```

### 取应用的签名标识

获取应用的签名标识

**返回值**: `Promise<SignatureInfo>` - 签名信息

**示例**:

```javascript
```javascript
```

### catch()

重置应用

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

重启应用

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

隐藏应用

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

显示应用

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

添加回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件名称 |
| callback | `Function` | - 回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

移除回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `string` | - 事件名称 |
| callback | `Function` | - 回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取当前网络状态

获取当前网络状态

**返回值**: `Promise<NetworkInfo>` - 网络状态对象

### 取当前UI风格

获取当前UI风格

**返回值**: `Promise<string>` - UI风格

### 取权限状态描述

获取权限状态描述

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| status | `string` | - 权限状态 |

**返回值**: `string` - 状态描述

### 发事件

分发事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 事件类型 |
| data | `any` | - 事件数据 |

**返回值**: `Promise<void>` - *

### 断设备是否支持Navigator功能

判断设备是否支持Navigator功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import navigator from '../modules/navigator.js';

try {
  // 基本操作
  const result = await navigator.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeNavigatorOperation() {
  try {
    // 检查支持性
    const supported = await navigator.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await navigator.checkPermission();
    if (permission !== 'granted') {
      const result = await navigator.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await navigator.someMethod();
    return result;

  } catch (error) {
    console.error('Navigator 操作失败:', error);
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

