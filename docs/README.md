# HTML5+ ES 模块集合 API 文档

欢迎使用 HTML5+ ES 模块集合的详细 API 文档！

## 目录结构

- [快速开始](#快速开始)
- [模块概述](#模块概述)
- [API 参考文档](#api-参考文档)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 快速开始

### 基本导入

```javascript
// 导入整个模块集合
import * as html5plus from '../index.js';

// 按需导入特定模块
import { storage, device, camera } from '../index.js';

// 或者直接导入模块文件
import storage from '../modules/storage.js';
```

### 异步操作

所有模块的异步操作都返回 Promise，推荐使用 async/await：

```javascript
async function getUserData() {
  try {
    // 设置用户信息
    await storage.setItem('username', '张三');
    await storage.setItem('age', '25');

    // 获取用户信息
    const username = await storage.getItem('username');
    const age = await storage.getItem('age');

    return { username, age };
  } catch (error) {
    console.error('操作失败:', error);
    return null;
  }
}
```

## 模块概述

### 核心模块

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **device** | 设备信息管理 | 获取设备信息、系统信息、屏幕信息 |
| **runtime** | 运行时环境 | 应用运行时信息、环境检测 |
| **storage** | 本地存储 | 键值对存储、数据持久化 |
| **events** | 事件系统 | 事件监听、事件分发 |

### 网络通信

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **net** | 网络请求 | HTTP/HTTPS 请求、文件下载 |
| **downloader** | 文件下载 | 大文件下载、断点续传 |
| **uploader** | 文件上传 | 文件上传、上传任务管理 |

### 多媒体

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **camera** | 相机功能 | 拍照、录制视频、图像处理 |
| **audio** | 音频功能 | 音频播放、录制、格式转换 |
| **video** | 视频功能 | 视频播放、录制、直播推流 |
| **gallery** | 图库管理 | 图片选择、图片管理 |

### 传感器

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **accelerometer** | 加速度传感器 | 设备加速度监测、运动检测 |
| **orientation** | 方向传感器 | 设备方向检测、屏幕旋转 |
| **proximity** | 接近传感器 | 距离检测、接近状态 |
| **geolocation** | 地理位置定位 | GPS定位、位置追踪 |

### 用户界面

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **nativeUI** | 原生 UI 组件 | 原生对话框、提示框、菜单 |
| **nativeObj** | 原生对象 | 原生视图、位图操作 |
| **webview** | WebView 窗口管理 | 网页容器、窗口控制 |

### 数据处理

| 模块 | 描述 | 主要功能 |
|------|------|----------|
| **sqlite** | SQLite 数据库 | 数据库操作、事务处理 |
| **io** | 文件系统操作 | 文件读写、目录管理 |
| **zip** | 压缩解压缩 | 文件压缩、解压缩 |

## API 参考文档

点击下面的链接查看各个模块的详细 API 文档：

### 核心模块
- [Device API](./api/device.md) - 设备信息管理
- [Runtime API](./api/runtime.md) - 运行时环境
- [Storage API](./api/storage.md) - 本地存储
- [Events API](./api/events.md) - 事件系统

### 网络通信
- [Net API](./api/net.md) - 网络请求
- [Downloader API](./api/downloader.md) - 文件下载
- [Uploader API](./api/uploader.md) - 文件上传

### 多媒体
- [Camera API](./api/camera.md) - 相机功能
- [Audio API](./api/audio.md) - 音频功能
- [Video API](./api/video.md) - 视频功能
- [Gallery API](./api/gallery.md) - 图库管理

### 传感器
- [Accelerometer API](./api/accelerometer.md) - 加速度传感器
- [Orientation API](./api/orientation.md) - 方向传感器
- [Proximity API](./api/proximity.md) - 接近传感器
- [Geolocation API](./api/geolocation.md) - 地理位置定位

### 用户界面
- [NativeUI API](./api/nativeUI.md) - 原生 UI 组件
- [NativeObj API](./api/nativeObj.md) - 原生对象
- [WebView API](./api/webview.md) - WebView 窗口管理

### 数据处理
- [SQLite API](./api/sqlite.md) - SQLite 数据库
- [IO API](./api/io.md) - 文件系统操作
- [ZIP API](./api/zip.md) - 压缩解压缩

### 应用功能
- [Contacts API](./api/contacts.md) - 联系人管理
- [Messaging API](./api/messaging.md) - 短信功能
- [Share API](./api/share.md) - 社交分享
- [Payment API](./api/payment.md) - 支付功能
- [Push API](./api/push.md) - 推送通知

### 系统功能
- [Bluetooth API](./api/bluetooth.md) - 蓝牙通信
- [Fingerprint API](./api/fingerprint.md) - 指纹识别
- [Barcode API](./api/barcode.md) - 条码扫描
- [iBeacon API](./api/ibeacon.md) - iBeacon 设备
- [Key API](./api/key.md) - 按键事件
- [Speech API](./api/speech.md) - 语音识别/合成

### 开发工具
- [Navigator API](./api/navigator.md) - 页面导航
- [OAuth API](./api/oauth.md) - OAuth 认证
- [Statistic API](./api/statistic.md) - 统计分析
- [Maps API](./api/maps.md) - 地图服务
- [Ad API](./api/ad.md) - 广告功能

## 使用示例

### 基本存储操作

```javascript
import storage from '../modules/storage.js';

// 存储数据
await storage.setItem('username', '张三');
await storage.setItem('preferences', JSON.stringify({
  theme: 'dark',
  language: 'zh-CN'
}));

// 获取数据
const username = await storage.getItem('username');
const preferences = JSON.parse(await storage.getItem('preferences'));

// 获取所有键
const keys = await storage.getAllKeys();
console.log('存储的键:', keys);

// 删除数据
await storage.removeItem('username');

// 清空存储
await storage.clear();
```

### 网络请求

```javascript
import net from '../modules/net.js';

// GET 请求
const response = await net.get('https://api.example.com/users');
console.log('用户数据:', response.data);

// POST 请求
const result = await net.post('https://api.example.com/login', {
  username: 'user',
  password: 'pass'
});
console.log('登录结果:', result);

// 上传文件
const uploadTask = await uploader.createUpload('https://api.example.com/upload', {
  file: '_doc/avatar.jpg',
  name: 'avatar'
});
uploadTask.addEventListener('statechanged', (task, status) => {
  console.log('上传进度:', task.uploadedSize, '/', task.totalSize);
});
await uploadTask.start();
```

### 相机拍照

```javascript
import camera from '../modules/camera.js';

// 拍照
try {
  const image = await camera.captureImage({
    filename: '_doc/camera/',
    resolution: 'high',
    format: 'jpg'
  });
  console.log('照片路径:', image.path);

  // 可以使用 io 模块保存到其他位置
} catch (error) {
  console.error('拍照失败:', error);
}

// 从图库选择
try {
  const images = await camera.pickImage({
    multiple: true,
    maximum: 5,
    filename: '_doc/gallery/'
  });
  console.log('选择的图片:', images);
} catch (error) {
  console.error('选择图片失败:', error);
}
```

### 地理位置定位

```javascript
import geolocation from '../modules/geolocation.js';

// 获取当前位置
try {
  const position = await geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });

  console.log('经度:', position.coords.longitude);
  console.log('纬度:', position.coords.latitude);
  console.log('精度:', position.coords.accuracy);
} catch (error) {
  console.error('定位失败:', error);
}

// 监听位置变化
const watchId = await geolocation.watchPosition(
  (position) => {
    console.log('位置更新:', position.coords);
  },
  (error) => {
    console.error('位置监听错误:', error);
  },
  {
    enableHighAccuracy: true,
    frequency: 5000
  }
);

// 停止监听
await geolocation.clearWatch(watchId);
```

## 最佳实践

### 错误处理

```javascript
// 使用 try-catch 处理错误
async function safeOperation() {
  try {
    const result = await someModule.someMethod();
    return result;
  } catch (error) {
    console.error('操作失败:', error);
    // 根据错误类型进行相应处理
    if (error.message.includes('权限')) {
      // 处理权限错误
    } else if (error.message.includes('网络')) {
      // 处理网络错误
    }
    return null;
  }
}
```

### 权限检查

```javascript
async function requestCameraPermission() {
  const supported = await camera.isSupported();
  if (!supported) {
    console.log('设备不支持相机功能');
    return false;
  }

  const permission = await camera.checkPermission();
  if (permission !== 'granted') {
    const result = await camera.requestPermission();
    return result === 'granted';
  }
  return true;
}
```

### 资源清理

```javascript
// 使用 try-finally 确保资源清理
async function useResource() {
  let resource = null;
  try {
    resource = await createResource();
    const result = await resource.doWork();
    return result;
  } finally {
    if (resource) {
      await resource.cleanup();
    }
  }
}
```

## 常见问题

### Q: 如何检查模块是否可用？

```javascript
const supported = await module.isSupported();
if (!supported) {
  console.log('当前环境不支持此模块');
  return;
}
```

### Q: 如何处理权限问题？

```javascript
const permission = await module.checkPermission();
if (permission !== 'granted') {
  const result = await module.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

### Q: 在浏览器环境中如何使用？

大部分模块都支持浏览器环境，会自动降级到相应的 Web API：

```javascript
// 在浏览器中使用存储模块
// 会自动使用 localStorage
await storage.setItem('key', 'value');
const value = await storage.getItem('key');
```

### Q: 如何调试模块？

```javascript
// 启用详细日志
TestConfig.VERBOSE = true;

// 使用开发工具
console.log('模块状态:', module);

// 捕获所有错误
process.on('unhandledRejection', (error) => {
  console.error('未处理的 Promise 拒绝:', error);
});
```

## 更新日志

### v1.0.0
- 初始版本发布
- 包含 37 个核心模块
- 完整的测试覆盖
- 详细的 API 文档

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系开发团队。