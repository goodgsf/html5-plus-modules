# Contacts API

> 联系人管理

## 模块概览

Contacts 模块提供了完整的 联系人管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import contacts from '../modules/contacts.js';

// 检查模块支持性
const supported = await contacts.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await contacts.checkPermission();
if (permission !== 'granted') {
  const result = await contacts.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### ContactFindOption

**类型**: `Object`

联系人查找选项参数

### ContactFindFilter

**类型**: `Object`

联系人查找过滤器

### ContactField

**类型**: `Object`

联系人域数据对象

### ContactName

**类型**: `Object`

联系人名称对象

### ContactAddress

**类型**: `Object`

联系人地址对象

### ContactOrganization

**类型**: `Object`

联系人所属组织信息

### Contact

**类型**: `Object`

联系人对象

### AddressBook

**类型**: `Object`

通讯录对象

## 方法

### HTML5+ Contacts 模块 ES Module 封装

HTML5+ Contacts 模块 ES Module 封装

### 讯录类型常量

通讯录类型常量

### 系人域类型常量

联系人域类型常量

### 址类型常量

地址类型常量

### 辑运算符常量

逻辑运算符常量

### 讯录操作成功回调函数

通讯录操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| addressbook | `AddressBook` | - 获取到的通讯录对象 |

### 找联系人操作成功回调函数

查找联系人操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| contacts | `Contact[]` | - 数组，查找到的联系人对象 |

### 系人操作成功回调函数

联系人操作成功回调函数

### 系人操作失败回调函数

联系人操作失败回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Contacts模块类

Contacts模块类

### 取通讯录对象

获取通讯录对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 要获取的通讯录类型 |
| successCB | `AddressBookSuccessCallback` | - 获取通讯录对象成功回调 |
| [errorCB] | `ContactsErrorCallback` | - 获取通讯录对象失败回调 |

**返回值**: `Promise<AddressBook>|void` - 通讯录对象

**示例**:

```javascript
```javascript
```

### 装通讯录对象，添加额外功能

包装通讯录对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| addressBook | `Object` | - 通讯录对象 |
| addressBookId | `string` | - 通讯录ID |

### 装联系人对象，添加额外功能

包装联系人对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| contact | `Object` | - 联系人对象 |

### 断设备是否支持通讯录功能

判断设备是否支持通讯录功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 建联系人域数据对象

创建联系人域数据对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 联系人域类型 |
| value | `string` | - 联系人域值 |
| [preferred] | `boolean` | - 是否为首选项 |

**返回值**: `ContactField` - 联系人域数据对象

**示例**:

```javascript
```javascript
```

### 建联系人名称对象

创建联系人名称对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 名称选项 |
| [options.familyName] | `string` | - 姓 |
| [options.givenName] | `string` | - 名 |
| [options.middleName] | `string` | - 中间名 |
| [options.honorificPrefix] | `string` | - 前缀 |
| [options.honorificSuffix] | `string` | - 后缀 |

**返回值**: `ContactName` - 联系人名称对象

**示例**:

```javascript
```javascript
```

### 建联系人地址对象

创建联系人地址对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 地址选项 |
| [options.type] | `string` | - 地址类型 |
| [options.streetAddress] | `string` | - 街道地址 |
| [options.locality] | `string` | - 城市 |
| [options.region] | `string` | - 省份 |
| [options.country] | `string` | - 国家 |
| [options.postalCode] | `string` | - 邮政编码 |
| [options.preferred] | `boolean` | - 是否为首选项 |

**返回值**: `ContactAddress` - 联系人地址对象

**示例**:

```javascript
```javascript
```

### 建联系人所属组织信息

创建联系人所属组织信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `Object` | - 组织信息选项 |
| [options.type] | `string` | - 组织类型 |
| [options.name] | `string` | - 组织名称 |
| [options.department] | `string` | - 部门 |
| [options.title] | `string` | - 职位 |
| [options.preferred] | `boolean` | - 是否为首选项 |

**返回值**: `ContactOrganization` - 联系人所属组织信息

**示例**:

```javascript
```javascript
```

### 建联系人查找过滤器

创建联系人查找过滤器

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| field | `string` | - 匹配的联系人域 |
| value | `string` | - 匹配的联系人值 |
| [logic] | `string` | - 匹配的逻辑 |

**返回值**: `ContactFindFilter` - 联系人查找过滤器

**示例**:

```javascript
```javascript
```

### 取当前活跃的通讯录信息

获取当前活跃的通讯录信息

**返回值**: `Array<Object>` - 活跃通讯录信息数组

**示例**:

```javascript
```javascript
```

### 闭所有活跃的通讯录

关闭所有活跃的通讯录

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 取通讯录类型名称

获取通讯录类型名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `number` | - 通讯录类型常量 |

**返回值**: `string` - 通讯录类型名称

**示例**:

```javascript
```javascript
```

### 取联系人域类型名称

获取联系人域类型名称

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| type | `string` | - 联系人域类型常量 |

**返回值**: `string` - 联系人域类型名称

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import contacts from '../modules/contacts.js';

try {
  // 基本操作
  const result = await contacts.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeContactsOperation() {
  try {
    // 检查支持性
    const supported = await contacts.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await contacts.checkPermission();
    if (permission !== 'granted') {
      const result = await contacts.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await contacts.someMethod();
    return result;

  } catch (error) {
    console.error('Contacts 操作失败:', error);
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

