# Payment API

> 支付功能管理

## 模块概览

Payment 模块提供了完整的 支付功能管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import payment from '../modules/payment.js';

// 检查模块支持性
const supported = await payment.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await payment.checkPermission();
if (permission !== 'granted') {
  const result = await payment.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### PaymentChannel

**类型**: `Object`

支付通道对象

### OrderStatementIAP

**类型**: `Object`

IAP订单数据对象

### PaymentResult

**类型**: `Object`

支付操作结果对象

### IAPProduct

**类型**: `Object`

IAP商品对象

### IAPProductInfo

**类型**: `Object`

购买IAP商品对象

### IAPTransaction

**类型**: `Object`

IAP交易信息对象

### GooglePayOptions

**类型**: `Object`

Google Pay选项对象

### RestoreOptions

**类型**: `Object`

恢复购买选项

## 方法

### HTML5+ Payment 模块 ES Module 封装

HTML5+ Payment 模块 ES Module 封装

### 付通道标识常量

支付通道标识常量

### 付错误码常量

支付错误码常量

### Google Pay环境类型

Google Pay环境类型

### Google Pay支付方式

Google Pay支付方式

### Google Pay卡网络类型

Google Pay卡网络类型

### Google Pay支付认证方式

Google Pay支付认证方式

### Google Pay账单地址格式

Google Pay账单地址格式

### IAP交易状态

IAP交易状态

### 取支付通道成功的回调函数

获取支付通道成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channels | `PaymentChannel[]` | - 支付通道列表 |

### 求支付商品列表成功的回调函数

请求支付商品列表成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| results | `IAPProduct[]` | - 商品信息数据 |

### 复购买成功的回调函数

恢复购买成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| results | `IAPTransaction[]` | - 已购买的非消耗性商品和订阅商品交易信息 |

### IAP支付操作成功的回调函数

IAP支付操作成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `IAPTransaction` | - 支付操作成功的信息 |

### 付操作成功的回调函数

支付操作成功的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `PaymentResult` | - 支付操作成功的信息 |

### 付操作失败的回调函数

支付操作失败的回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Error` | - 错误信息 |

### HTML5+ Payment 模块类

HTML5+ Payment 模块类

### 始化Payment模块

初始化Payment模块

**返回值**: `Promise<void>` - */

### 存支付通道信息

缓存支付通道信息

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channels | `PaymentChannel[]` | - 支付通道列表 |

### 装支付通道对象，添加Promise方法

包装支付通道对象，添加Promise方法

### 取支付通道列表

获取支付通道列表

**返回值**: `Promise<PaymentChannel[]>` - 支付通道列表

**示例**:

```javascript
```javascript
```

### 求支付操作

请求支付操作

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channel | `PaymentChannel|string` | - 支付通道或通道ID |
| statement | `string|OrderStatementIAP|Object` | - 支付订单信息 |
| [successCallback] | `PaymentSuccessCallback|IapPaymentSuccessCallback` | - 成功回调函数 |
| [errorCallback] | `PaymentErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<PaymentResult|IAPTransaction>` - 支付结果

**示例**:

```javascript
```javascript
```

### 取指定支付通道

获取指定支付通道

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |

**返回值**: `Promise<PaymentChannel>` - 支付通道对象

**示例**:

```javascript
```javascript
```

### 查支付通道是否可用

检查支付通道是否可用

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |

**返回值**: `Promise<boolean>` - 是否可用

**示例**:

```javascript
```javascript
```

### 装支付通道服务

安装支付通道服务

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### IAP服务器请求支付订单

向IAP服务器请求支付订单

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |
| productIds | `string[]` | - 商品ID列表 |

**返回值**: `Promise<IAPProduct[]>` - 商品信息列表

**示例**:

```javascript
```javascript
```

### 复已购买的非消耗性商品和订阅商品

恢复已购买的非消耗性商品和订阅商品

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |
| [options] | `RestoreOptions` | - 恢复选项 |

**返回值**: `Promise<IAPTransaction[]>` - 已购买商品交易信息

**示例**:

```javascript
```javascript
```

### 闭IAP订单

关闭IAP订单

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| channelId | `string` | - 支付通道ID |
| transaction | `IAPTransaction` | - 交易信息 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 查Google Pay是否可用

检查Google Pay是否可用

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `GooglePayOptions` | - Google Pay选项 |

**返回值**: `Promise<void>` - *

**示例**:

```javascript
```javascript
```

### 断设备是否支持Payment功能

判断设备是否支持Payment功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 取所有可用的支付通道ID

获取所有可用的支付通道ID

**返回值**: `Promise<string[]>` - 可用的支付通道ID列表

**示例**:

```javascript
```javascript
```

## 使用示例

### 基本用法

```javascript
import payment from '../modules/payment.js';

try {
  // 基本操作
  const result = await payment.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safePaymentOperation() {
  try {
    // 检查支持性
    const supported = await payment.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await payment.checkPermission();
    if (permission !== 'granted') {
      const result = await payment.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await payment.someMethod();
    return result;

  } catch (error) {
    console.error('Payment 操作失败:', error);
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

