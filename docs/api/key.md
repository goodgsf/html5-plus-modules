# Key API

> 按键事件管理

## 模块概览

Key 模块提供了完整的 按键事件管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import key from '../modules/key.js';

// 检查模块支持性
const supported = await key.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await key.checkPermission();
if (permission !== 'granted') {
  const result = await key.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### KeyEvent

**类型**: `Object`

按键事件对象

## 方法

### HTML5+ Key 模块 ES Module 封装

HTML5+ Key 模块 ES Module 封装

### 键类型常量

按键类型常量

### 键错误代码常量

按键错误代码常量

### 助输入类型常量

辅助输入类型常量

### 键事件回调函数

按键事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| event | `KeyEvent` | - 按键事件对象 |

### Key模块类

Key模块类

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

### 式化按键事件

格式化按键事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| nativeEvent | `Object` | - 原生按键事件 |

**返回值**: `KeyEvent` - 格式化后的按键事件

### 证按键类型

验证按键类型

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| eventType | `string` | - 按键事件类型 |

**返回值**: `boolean` - 是否有效

### 加按键事件监听器

添加按键事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| eventType | `string` | - 要监听的按键事件类型 |
| listener | `KeyEventCallback` | - 监听按键事件发生时调用的回调函数 |
| [capture=false] | `boolean` | - 捕获按键事件流顺序，暂作为保留参数 |

### 除按键事件监听器

移除按键事件监听器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| eventType | `string` | - 要移除的按键事件类型 |
| listener | `KeyEventCallback` | - 要移除的监听回调函数 |

### catch()

显示软键盘

### catch()

隐藏软键盘

### 置音量键是否生效

设置音量键是否生效

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| enabled | `boolean` | - 是否生效 |

### catch()

设置辅助输入类型

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 辅助输入类型 |

### 听返回键事件

监听返回键事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - 返回键按下时的回调函数 |
| [preventDefault=false] | `boolean` | - 是否阻止默认行为 |

### 听菜单键事件

监听菜单键事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - 菜单键按下时的回调函数 |
| [preventDefault=false] | `boolean` | - 是否阻止默认行为 |

### 听音量增加键事件

监听音量增加键事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - 音量增加键按下时的回调函数 |
| [preventDefault=false] | `boolean` | - 是否阻止默认行为 |

### 听音量减少键事件

监听音量减少键事件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - 音量减少键按下时的回调函数 |
| [preventDefault=false] | `boolean` | - 是否阻止默认行为 |

### 听Home键事件（部分设备支持）

监听Home键事件（部分设备支持）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - Home键按下时的回调函数 |

### 听搜索键事件（部分设备支持）

监听搜索键事件（部分设备支持）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `KeyEventCallback` | - 搜索键按下时的回调函数 |

### catch()

移除所有按键事件监听器

### 取指定事件类型的监听器数量

获取指定事件类型的监听器数量

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| eventType | `string` | - 事件类型 |

**返回值**: `number` - 监听器数量

### 取所有事件类型及其监听器数量

获取所有事件类型及其监听器数量

**返回值**: `Object` - 事件类型和监听器数量的映射

### 取当前音量键状态

获取当前音量键状态

**返回值**: `boolean` - 音量键是否启用

### 取当前辅助输入类型

获取当前辅助输入类型

**返回值**: `number` - 当前输入类型

### 化的显示软键盘方法，自动处理错误

简化的显示软键盘方法，自动处理错误

**返回值**: `boolean` - 成功返回true，失败返回false

### 化的隐藏软键盘方法，自动处理错误

简化的隐藏软键盘方法，自动处理错误

**返回值**: `boolean` - 成功返回true，失败返回false

### 化的返回键监听方法，自动处理错误

简化的返回键监听方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| callback | `function` | - 回调函数 |

**返回值**: `boolean` - 成功返回true，失败返回false

### 断设备是否支持Key功能

判断设备是否支持Key功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

## 使用示例

### 基本用法

```javascript
import key from '../modules/key.js';

try {
  // 基本操作
  const result = await key.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeKeyOperation() {
  try {
    // 检查支持性
    const supported = await key.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await key.checkPermission();
    if (permission !== 'granted') {
      const result = await key.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await key.someMethod();
    return result;

  } catch (error) {
    console.error('Key 操作失败:', error);
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

