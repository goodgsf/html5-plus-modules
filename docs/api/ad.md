# Ad API

> 广告功能管理

## 模块概览

Ad 模块提供了完整的 广告功能管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import ad from '../modules/ad.js';

// 检查模块支持性
const supported = await ad.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await ad.checkPermission();
if (permission !== 'granted') {
  const result = await ad.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### AdViewStyles

**类型**: `Object`

广告控件样式

### InterstitialAdStyles

**类型**: `Object`

插屏广告样式

### FullScreenVideoAdStyles

**类型**: `Object`

全屏视频广告样式

### RewardedVideoAdStyles

**类型**: `Object`

激励视频广告样式

### AdsOptions

**类型**: `Object`

获取信息流广告的参数

### ContentOptions

**类型**: `Object`

内容联盟的参数

### AdData

**类型**: `Object`

信息流广告数据对象

### RewardVideoAdUrlCallbackDatas

**类型**: `Object`

激励视频服务器回调数据

## 方法

### HTML5+ Ad 模块 ES Module 封装

HTML5+ Ad 模块 ES Module 封装

### 告操作成功回调函数

广告操作成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| [result] | `*` | - 操作结果 |

### 告操作错误回调函数

广告操作错误回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| error | `Object` | - 错误信息 |
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### 取信息流广告成功回调函数

获取信息流广告成功回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| ads | `AdData[]` | - 信息流广告数据数组 |

### 听广告渲染完成事件回调函数

监听广告渲染完成事件回调函数

### 听点击关闭广告事件回调函数

监听点击关闭广告事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 关闭结果 |

### 听关闭广告事件回调函数

监听关闭广告事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 关闭结果 |

### 听关闭全屏或激励视频广告事件回调函数

监听关闭全屏或激励视频广告事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `Object` | - 关闭结果 |

### Ad模块类

Ad模块类

### catch()

创建广告控件

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `AdViewStyles` | - 广告控件样式 |

**返回值**: `Promise<AdView>|AdView` - 广告控件对象

**示例**:

```javascript
```javascript
```

### 建插屏广告对象

创建插屏广告对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `InterstitialAdStyles` | - 插屏广告样式 |

**返回值**: `Promise<InterstitialAd>|InterstitialAd` - 插屏广告对象

**示例**:

```javascript
```javascript
```

### 建全屏视频广告对象

创建全屏视频广告对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `FullScreenVideoAdStyles` | - 全屏视频广告样式 |

**返回值**: `Promise<FullScreenVideoAd>|FullScreenVideoAd` - 全屏视频广告对象

**示例**:

```javascript
```javascript
```

### 建激励视频广告对象

创建激励视频广告对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| styles | `RewardedVideoAdStyles` | - 激励视频广告样式 |

**返回值**: `Promise<RewardedVideoAd>|RewardedVideoAd` - 激励视频广告对象

**示例**:

```javascript
```javascript
```

### 取信息流广告数据

获取信息流广告数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `AdsOptions` | - 获取信息流广告的参数 |
| successCB | `GetAdsSuccessCallback` | - 成功回调函数 |
| [errorCB] | `AdErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<AdData[]>|void` - 信息流广告数据数组

**示例**:

```javascript
```javascript
```

### catch()

释放广告数据

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| adData | `AdData` | - 需要释放的广告数据 |

**示例**:

```javascript
```javascript
```

### catch()

显示内容联盟页面

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| options | `ContentOptions` | - 内容联盟参数 |
| successCB | `AdSuccessCallback` | - 成功回调函数 |
| [errorCB] | `AdErrorCallback` | - 错误回调函数 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 置是否开启个性化推荐广告

设置是否开启个性化推荐广告

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| enable | `boolean` | - 是否开启个性化推荐广告 |

**返回值**: `Promise<void>|void` - *

**示例**:

```javascript
```javascript
```

### 取是否开启个性化推荐广告

获取是否开启个性化推荐广告

**返回值**: `Promise<boolean>|boolean` - 是否开启个性化推荐广告

**示例**:

```javascript
```javascript
```

### 断设备是否支持广告功能

判断设备是否支持广告功能

**返回值**: `Promise<boolean>` - 返回是否支持的Promise

**示例**:

```javascript
```javascript
```

### 装广告控件对象，添加额外功能

包装广告控件对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| adView | `Object` | - 广告控件对象 |
| adId | `string` | - 广告ID |

### 装插屏广告对象，添加额外功能

包装插屏广告对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| interstitialAd | `Object` | - 插屏广告对象 |
| adId | `string` | - 广告ID |

### 装全屏视频广告对象，添加额外功能

包装全屏视频广告对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| fullScreenVideoAd | `Object` | - 全屏视频广告对象 |
| adId | `string` | - 广告ID |

### 装激励视频广告对象，添加额外功能

包装激励视频广告对象，添加额外功能

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| rewardedVideoAd | `Object` | - 激励视频广告对象 |
| adId | `string` | - 广告ID |

## 使用示例

### 基本用法

```javascript
import ad from '../modules/ad.js';

try {
  // 基本操作
  const result = await ad.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeAdOperation() {
  try {
    // 检查支持性
    const supported = await ad.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await ad.checkPermission();
    if (permission !== 'granted') {
      const result = await ad.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await ad.someMethod();
    return result;

  } catch (error) {
    console.error('Ad 操作失败:', error);
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

