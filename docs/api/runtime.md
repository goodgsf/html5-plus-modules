# Runtime API

> 运行时环境管理

## 模块概览

Runtime 模块提供了完整的 运行时环境管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import runtime from '../modules/runtime.js';

// 检查模块支持性
const supported = await runtime.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await runtime.checkPermission();
if (permission !== 'granted') {
  const result = await runtime.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### PrivacyStatus

**类型**: `Object`

隐私状态类型

### ApplicationInfo

**类型**: `Object`

应用信息

### RuntimeProperties

**类型**: `Object`

运行时属性

### InstallOptions

**类型**: `Object`

应用安装选项

### URLOptions

**类型**: `Object`

URL打开选项

## 方法

### HTML5+ Runtime 模块 ES Module 封装

HTML5+ Runtime 模块 ES Module 封装

### 行时错误码常量

运行时错误码常量

### 私同意状态回调函数

隐私同意状态回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| status | `PrivacyStatus` | - 隐私状态信息 |

### 私同意失败回调函数

隐私同意失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Runtime 模块类

HTML5+ Runtime 模块类

### 始化Runtime模块

初始化Runtime模块

**返回值**: `Promise<void>` - */

### catch()

获取应用ID

**返回值**: `Promise<string>` - 应用ID

**示例**:

```javascript
```javascript
```

### 取应用启动参数

获取应用启动参数

**返回值**: `Promise<Array<string>>` - 启动参数数组

**示例**:

```javascript
```javascript
```

### 取应用渠道号

获取应用渠道号

**返回值**: `Promise<string>` - 渠道号

**示例**:

```javascript
```javascript
```

### 取应用版本号

获取应用版本号

**返回值**: `Promise<string>` - 版本号

**示例**:

```javascript
```javascript
```

### 取应用版本代码

获取应用版本代码

**返回值**: `Promise<string>` - 版本代码

**示例**:

```javascript
```javascript
```

### 取应用内部版本号

获取应用内部版本号

**返回值**: `Promise<string>` - 内部版本号

**示例**:

```javascript
```javascript
```

### 取uni-app版本号

获取uni-app版本号

**返回值**: `Promise<string>` - uni-app版本号

**示例**:

```javascript
```javascript
```

### catch()

获取启动来源

**返回值**: `Promise<string>` - 启动来源

**示例**:

```javascript
```javascript
```

### catch()

获取应用来源

**返回值**: `Promise<string>` - 应用来源

**示例**:

```javascript
```javascript
```

### catch()

获取启动加载时间

**返回值**: `Promise<number>` - 启动加载时间（毫秒）

**示例**:

```javascript
```javascript
```

### catch()

获取进程ID

**返回值**: `Promise<number>` - 进程ID

**示例**:

```javascript
```javascript
```

### catch()

获取启动时间

**返回值**: `Promise<number>` - 启动时间（毫秒）

**示例**:

```javascript
```javascript
```

### 取是否恢复模式

获取是否恢复模式

**返回值**: `Promise<boolean>` - 是否恢复模式

**示例**:

```javascript
```javascript
```

### catch()

同意隐私政策

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

不同意隐私政策

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 查是否同意隐私政策

检查是否同意隐私政策

**返回值**: `Promise<boolean>` - 是否同意隐私政策

**示例**:

```javascript
```javascript
```

### if()

显示隐私政策对话框

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| successCallback | `PrivacyStatusCallback` | - 成功回调函数 |
| errorCallback | `PrivacyErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

获取运行时属性

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| name | `string` | - 属性名称 |

**返回值**: `Promise<any>` - 属性值

**示例**:

```javascript
```javascript
```

### 取所有运行时属性

获取所有运行时属性

**返回值**: `Promise<RuntimeProperties>` - 运行时属性对象

**示例**:

```javascript
```javascript
```

### if()

安装应用

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| path | `string` | - 应用文件路径 |
| [options] | `InstallOptions` | - 安装选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

退出应用

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

### 置应用图标角标数字

设置应用图标角标数字

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| number | `number` | - 角标数字 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 开URL地址

打开URL地址

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - URL地址 |
| [options] | `URLOptions` | - 打开选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

打开网页

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 网页URL地址 |
| [options] | `URLOptions` | - 打开选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

打开文件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| filepath | `string` | - 文件路径 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

处理直达页面

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| url | `string` | - 直达页面URL |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 动其他应用

启动其他应用

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| appid | `string` | - 应用ID |
| [extras] | `any` | - 扩展参数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 查应用是否存在

检查应用是否存在

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| appid | `string` | - 应用ID |

**返回值**: `Promise<boolean>` - 是否存在

**示例**:

```javascript
```javascript
```

### 查是否自定义启动路径

检查是否自定义启动路径

**返回值**: `Promise<boolean>` - 是否自定义启动路径

**示例**:

```javascript
```javascript
```

### catch()

获取应用信息

**返回值**: `Promise<ApplicationInfo>` - 应用信息

**示例**:

```javascript
```javascript
```

### 断设备是否支持Runtime功能

判断设备是否支持Runtime功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### catch()

清除隐私政策缓存

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

清除属性缓存

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import runtime from '../modules/runtime.js';

try {
  // 基本操作
  const result = await runtime.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeRuntimeOperation() {
  try {
    // 检查支持性
    const supported = await runtime.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await runtime.checkPermission();
    if (permission !== 'granted') {
      const result = await runtime.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await runtime.someMethod();
    return result;

  } catch (error) {
    console.error('Runtime 操作失败:', error);
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

