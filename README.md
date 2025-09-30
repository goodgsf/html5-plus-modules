# HTML5+ ES 模块集合

> 完整的 HTML5+ API 封装，支持现代 ES 模块标准

## 项目简介

本项目是 HTML5+ 规范的完整 ES 模块实现，提供了 37 个核心模块的封装，涵盖了移动应用开发中的各种功能需求。

## 特性

- 📦 **ES 模块标准** - 完全遵循 ES Module 规范
- 🔄 **Promise 化** - 所有异步操作都返回 Promise
- 🌐 **环境兼容** - 支持 HTML5+ 和浏览器双环境
- 🛡️ **错误处理** - 统一的错误处理机制
- 📚 **完整文档** - 详细的 JSDoc 文档和 API 文档
- 🧪 **全面测试** - 完整的测试用例覆盖
- 🔧 **构建工具** - 支持开发和生产构建
- 📊 **类型支持** - 完整的 TypeScript 类型定义

## 快速开始

### 安装

```bash
npm install html5-plus-modules
```

### 基本使用

```javascript
// 导入整个模块集合
import * as goodgsf from 'html5-plus-modules';

// 或者按需导入
import { storage, device, camera } from 'html5-plus-modules';

// 使用存储模块
try {
  await storage.setItem('user_token', 'abc123');
  const token = await storage.getItem('user_token');
  console.log(token); // 'abc123'
} catch (error) {
  console.error('存储操作失败:', error);
}
```

## 模块列表

### 核心模块
- **device** - 设备信息管理
- **runtime** - 运行时环境
- **storage** - 本地存储
- **events** - 事件系统

### 网络通信
- **net** - 网络请求
- **downloader** - 文件下载
- **uploader** - 文件上传
- **websocket** - WebSocket 通信

### 多媒体
- **camera** - 相机功能
- **audio** - 音频播放/录制
- **video** - 视频播放/录制
- **gallery** - 图库管理

### 传感器
- **accelerometer** - 加速度传感器
- **orientation** - 方向传感器
- **proximity** - 接近传感器
- **geolocation** - 地理位置定位

### 用户界面
- **nativeUI** - 原生 UI 组件
- **nativeObj** - 原生对象
- **webview** - WebView 窗口管理

### 数据处理
- **sqlite** - SQLite 数据库
- **io** - 文件系统操作
- **zip** - 压缩解压缩

### 应用功能
- **contacts** - 联系人管理
- **messaging** - 短信功能
- **share** - 社交分享
- **payment** - 支付功能
- **push** - 推送通知

### 系统功能
- **bluetooth** - 蓝牙通信
- **nfc** - NFC 功能
- **fingerprint** - 指纹识别
- **barcode** - 条码扫描
- **ibeacon** - iBeacon 设备
- **key** - 按键事件
- **speech** - 语音识别/合成

### 开发工具
- **console** - 控制台
- **navigator** - 页面导航
- **oauth** - OAuth 认证
- **statistic** - 统计分析
- **maps** - 地图服务
- **ad** - 广告功能

## API 文档

详细的 API 文档请参考 [docs/](docs/) 目录。

### 示例：存储模块

```javascript
import storage from 'html5-plus-modules/storage';

// 存储数据
await storage.setItem('username', '张三');
await storage.setItem('age', 25);

// 获取数据
const username = await storage.getItem('username');
const age = await storage.getItem('age');

// 获取所有键
const keys = await storage.getAllKeys();
console.log(keys); // ['username', 'age']

// 删除数据
await storage.removeItem('username');

// 清空存储
await storage.clear();
```

### 示例：相机模块

```javascript
import camera from 'html5-plus-modules/camera';

// 拍照
try {
  const image = await camera.captureImage({
    filename: '_doc/camera/',
    resolution: 'high'
  });
  console.log('照片路径:', image.path);
} catch (error) {
  console.error('拍照失败:', error);
}

// 从图库选择
try {
  const image = await camera.pickImage({
    multiple: false,
    maximum: 1
  });
  console.log('选择图片:', image);
} catch (error) {
  console.error('选择图片失败:', error);
}
```

## 开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 克隆项目

```bash
git clone https://github.com/goodgsf/html5-plus-modules.git
cd html5-plus-modules
npm install
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定模块测试
npm run test:module storage

# 运行测试并生成 JSON 报告
npm run test:report
```

### 构建

```bash
# 开发构建
npm run build

# 生产构建
node scripts/build.js --prod --minify

# 清理构建
node scripts/build.js --clean
```

## 项目结构

```
html5-plus-modules/
├── modules/              # 所有模块实现
│   ├── accelerometer.js  # 加速度传感器
│   ├── ad.js           # 广告功能
│   ├── audio.js        # 音频功能
│   ├── ...             # 其他模块
│   └── zip.js          # 压缩功能
├── test/               # 测试文件
│   ├── modules/        # 模块测试
│   ├── test-config.js  # 测试配置
│   └── test-runner.js  # 测试运行器
├── docs/               # API 文档
├── scripts/            # 构建脚本
├── index.js            # 主入口文件
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 测试覆盖

项目包含完整的测试用例，覆盖了：

- ✅ 基本功能测试
- ✅ 错误处理测试
- ✅ 边界条件测试
- ✅ 并发操作测试
- ✅ 环境兼容性测试
- ✅ 权限检查测试

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发规范

- 遵循 ES6+ 语法标准
- 使用 async/await 处理异步操作
- 编写完整的 JSDoc 文档
- 为新功能编写测试用例
- 遵循项目的代码风格

## 版本历史

- **1.0.0** - 初始版本，包含 37 个核心模块

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 支持

如果您在使用过程中遇到问题，请：

1. 查看 [docs/](docs/) 中的文档
2. 搜索现有的 [Issues](https://github.com/goodgsf/html5-plus-modules/issues)
3. 创建新的 Issue 描述问题

## 鸣谢

感谢所有为此项目做出贡献的开发者。

---

**HTML5+ ES 模块集合** - 让移动应用开发更简单！ 🚀