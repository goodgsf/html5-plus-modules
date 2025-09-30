# SQLite API

> SQLite数据库管理

## 模块概览

SQLite 模块提供了完整的 SQLite数据库管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import sqlite from '../modules/sqlite.js';

// 检查模块支持性
const supported = await sqlite.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await sqlite.checkPermission();
if (permission !== 'granted') {
  const result = await sqlite.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### DatabaseOptions

**类型**: `Object`

数据库操作选项

### QueryResult

**类型**: `Object`

数据库查询结果

### ExecuteSQLOptions

**类型**: `Object`

SQL执行选项

### TransactionOptions

**类型**: `Object`

事务选项

## 方法

### HTML5+ SQLite 模块 ES Module 封装

HTML5+ SQLite 模块 ES Module 封装

### SQLite错误码常量

SQLite错误码常量

### SQLite操作成功回调函数

SQLite操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [result] | `Object|QueryResult|Array<Object>` | - 操作结果 |

### SQLite操作失败回调函数

SQLite操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ SQLite 模块类

HTML5+ SQLite 模块类

### 始化SQLite模块

初始化SQLite模块

**返回值**: `Promise<void>` - */

### catch()

打开数据库

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `DatabaseOptions` | - 数据库选项 |
| [successCallback] | `SQLiteSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `SQLiteErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中打开数据库

在浏览器环境中打开数据库

### 断数据库是否打开

判断数据库是否打开

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `DatabaseOptions` | - 数据库选项 |

**返回值**: `Promise<boolean>` - 是否已打开

**示例**:

```javascript
```javascript
```

### catch()

关闭数据库

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `DatabaseOptions` | - 数据库选项 |
| [successCallback] | `SQLiteSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `SQLiteErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### catch()

执行事务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `TransactionOptions` | - 事务选项 |
| [successCallback] | `SQLiteSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `SQLiteErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中执行事务

在浏览器环境中执行事务

### 行SQL语句（增删改操作）

执行SQL语句（增删改操作）

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `ExecuteSQLOptions` | - SQL执行选项 |
| [successCallback] | `SQLiteSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `SQLiteErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<QueryResult>` - *

**示例**:

```javascript
```javascript
```

### 浏览器环境中执行SQL

在浏览器环境中执行SQL

### 行查询SQL语句

执行查询SQL语句

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `ExecuteSQLOptions` | - SQL执行选项 |
| [successCallback] | `SQLiteSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `SQLiteErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<Array<Object>>` - 查询结果数组

**示例**:

```javascript
```javascript
```

### 浏览器环境中执行查询SQL

在浏览器环境中执行查询SQL

### 取当前打开的数据库列表

获取当前打开的数据库列表

**返回值**: `Promise<Array<{name: string, path: string` - >>} 数据库列表

**示例**:

```javascript
```javascript
```

### 闭所有打开的数据库

关闭所有打开的数据库

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持SQLite功能

判断设备是否支持SQLite功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取数据库版本信息

获取数据库版本信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `DatabaseOptions` | - 数据库选项 |

**返回值**: `Promise<string>` - 数据库版本

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import sqlite from '../modules/sqlite.js';

try {
  // 基本操作
  const result = await sqlite.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeSQLiteOperation() {
  try {
    // 检查支持性
    const supported = await sqlite.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await sqlite.checkPermission();
    if (permission !== 'granted') {
      const result = await sqlite.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await sqlite.someMethod();
    return result;

  } catch (error) {
    console.error('SQLite 操作失败:', error);
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

