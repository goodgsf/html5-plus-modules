# NativeUI API

> 原生UI组件管理

## 模块概览

NativeUI 模块提供了完整的 原生UI组件管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import nativeUI from '../modules/nativeUI.js';

// 检查模块支持性
const supported = await nativeUI.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await nativeUI.checkPermission();
if (permission !== 'granted') {
  const result = await nativeUI.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ActionSheetItem

**类型**: `Object`

动作表项类型

### ActionSheetStyles

**类型**: `Object`

动作表样式配置对象

### ConfirmStyles

**类型**: `Object`

确认对话框样式配置对象

### PickDateStyles

**类型**: `Object`

日期选择器样式配置对象

### PickTimeStyles

**类型**: `Object`

时间选择器样式配置对象

### WaitingStyles

**类型**: `Object`

等待对话框样式配置对象

### ToastStyles

**类型**: `Object`

提示消息样式配置对象

### PreviewImageStyles

**类型**: `Object`

图片预览样式配置对象

## 方法

### HTML5+ NativeUI 模块 ES Module 封装

HTML5+ NativeUI 模块 ES Module 封装

### 生UI错误代码常量

原生UI错误代码常量

### 示回调函数

提示回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| index | `number` | - 用户点击的按钮索引 |

### 认回调函数

确认回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| index | `number` | - 用户点击的按钮索引 |

### 入回调函数

输入回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `Object` | - 输入事件对象 |

### 作表回调函数

动作表回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| index | `number` | - 用户点击的按钮索引 |

### 期选择成功回调函数

日期选择成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| date | `string` | - 用户选择的日期 |

### 间选择成功回调函数

时间选择成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| time | `string` | - 用户选择的时间 |

### 期时间选择失败回调函数

日期时间选择失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |

### 功回调函数

成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `*` | - 操作结果 |

### 败回调函数

失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |

### NativeUI模块类

NativeUI模块类

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

### 证消息内容

验证消息内容

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 消息内容 |

**返回值**: `boolean` - 是否有效

### 证回调函数

验证回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `function` | - 回调函数 |

**返回值**: `boolean` - 是否有效

### 示系统提示对话框

显示系统提示对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 提示对话框上显示的内容 |
| [alertCB] | `AlertCallback` | - 提示对话框上关闭后的回调函数 |
| [title] | `string` | - 提示对话框上显示的标题 |
| [buttonCapture] | `string` | - 提示对话框上按钮显示的内容 |

**返回值**: `Promise<number>` - 返回Promise，用户点击按钮时触发

### 示系统确认对话框

显示系统确认对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 确认对话框上显示的内容 |
| [confirmCB] | `ConfirmCallback` | - 确认对话框关闭后的回调函数 |
| [styles] | `ConfirmStyles` | - 确认对话框的参数 |

**返回值**: `Promise<number>` - 返回Promise，用户点击按钮时触发

### 示系统输入对话框

显示系统输入对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 输入对话框上显示的内容 |
| [promptCB] | `PromptCallback` | - 输入对话框关闭后的回调函数 |
| [title] | `string` | - 输入对话框上显示的标题 |
| [tip] | `string` | - 输入对话框上编辑框显示的提示文字 |
| [buttons] | `string[]` | - 输入对话框上显示的按钮数组 |

**返回值**: `Promise<Object>` - 返回Promise，用户点击按钮时触发

### 示系统动作按钮框

显示系统动作按钮框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| actionsheetStyle | `ActionSheetStyles` | - 动作按钮框的参数 |
| [actionsheetCallback] | `ActionSheetCallback` | - 动作按钮框关闭后的回调函数 |

**返回值**: `Promise<number>` - 返回Promise，用户点击按钮时触发

### 出系统日期选择对话框

弹出系统日期选择对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successCB] | `PickDateSuccessCallback` | - 日期选择操作成功的回调函数 |
| [errorCB] | `PickDatetimeErrorCallback` | - 日期选择操作失败的回调函数 |
| [styles] | `PickDateStyles` | - 日期选择对话框的参数 |

**返回值**: `Promise<string>` - 返回Promise，用户选择日期时触发

### 出系统时间选择对话框

弹出系统时间选择对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [successCB] | `PickTimeSuccessCallback` | - 时间选择操作成功的回调函数 |
| [errorCB] | `PickDatetimeErrorCallback` | - 时间选择操作失败的回调函数 |
| [styles] | `PickTimeStyles` | - 时间选择对话框的参数 |

**返回值**: `Promise<string>` - 返回Promise，用户选择时间时触发

### 示系统等待对话框

显示系统等待对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [title] | `string` | - 等待对话框上显示的标题 |
| [styles] | `WaitingStyles` | - 等待对话框的参数 |

**返回值**: `Object` - 等待对话框对象

### 闭系统等待对话框

关闭系统等待对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [waitingDialog] | `Object` | - 要关闭的等待对话框对象 |

### 示系统提示消息

显示系统提示消息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 提示消息上显示的内容 |
| [styles] | `ToastStyles` | - 提示消息的参数 |

### 藏系统提示消息

隐藏系统提示消息

### catch()

预览图片

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| urls | `string[]` | - 要预览的图片地址列表 |
| [styles] | `PreviewImageStyles` | - 预览图片的参数 |

### 化的提示对话框方法，自动处理错误

简化的提示对话框方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 提示消息内容 |
| [title] | `string` | - 对话框标题 |
| [buttonText] | `string` | - 按钮文本 |

**返回值**: `Promise<boolean>` - 成功返回true，失败返回false

### 化的确认对话框方法，自动处理错误

简化的确认对话框方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 确认消息内容 |
| [title] | `string` | - 对话框标题 |
| [buttons] | `string[]` | - 按钮数组 |

**返回值**: `Promise<number|null>` - 用户点击的按钮索引，失败返回null

### 化的输入对话框方法，自动处理错误

简化的输入对话框方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 输入提示内容 |
| [title] | `string` | - 对话框标题 |
| [tip] | `string` | - 输入提示 |
| [buttons] | `string[]` | - 按钮数组 |

**返回值**: `Promise<Object|null>` - 用户输入结果，失败返回null

### 化的日期选择方法，自动处理错误

简化的日期选择方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [styles] | `PickDateStyles` | - 日期选择样式 |

**返回值**: `Promise<string|null>` - 用户选择的日期，失败返回null

### 化的时间选择方法，自动处理错误

简化的时间选择方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [styles] | `PickTimeStyles` | - 时间选择样式 |

**返回值**: `Promise<string|null>` - 用户选择的时间，失败返回null

### 化的等待对话框方法，自动处理错误

简化的等待对话框方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [title] | `string` | - 等待标题 |
| [styles] | `WaitingStyles` | - 等待样式 |

**返回值**: `Object|null` - 等待对话框对象，失败返回null

### 化的提示消息方法，自动处理错误

简化的提示消息方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| message | `string` | - 提示消息内容 |
| [styles] | `ToastStyles` | - 提示样式 |

**返回值**: `boolean` - 成功返回true，失败返回false

### 化的图片预览方法，自动处理错误

简化的图片预览方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| urls | `string[]` | - 图片地址列表 |
| [styles] | `PreviewImageStyles` | - 预览样式 |

**返回值**: `boolean` - 成功返回true，失败返回false

### 断设备是否支持原生UI功能

判断设备是否支持原生UI功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 取当前活跃的等待对话框数量

获取当前活跃的等待对话框数量

**返回值**: `number` - 活跃等待对话框数量

### 闭所有活跃的等待对话框

关闭所有活跃的等待对话框

### 取当前提示消息状态

获取当前提示消息状态

**返回值**: `boolean` - 当前是否有显示的提示消息

## 使用示例

### 基本用法

```javascript
import nativeUI from '../modules/nativeUI.js';

try {
  // 基本操作
  const result = await nativeUI.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeNativeUIOperation() {
  try {
    // 检查支持性
    const supported = await nativeUI.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await nativeUI.checkPermission();
    if (permission !== 'granted') {
      const result = await nativeUI.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await nativeUI.someMethod();
    return result;

  } catch (error) {
    console.error('NativeUI 操作失败:', error);
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

