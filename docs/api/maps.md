# Maps API

> 地图服务管理

## 模块概览

Maps 模块提供了完整的 地图服务管理 功能，支持 HTML5+ 和浏览器双环境。

## 快速开始

```javascript
import maps from '../modules/maps.js';

// 检查模块支持性
const supported = await maps.isSupported();
if (!supported) {
  console.log('设备不支持此功能');
  return;
}

// 检查权限
const permission = await maps.checkPermission();
if (permission !== 'granted') {
  const result = await maps.requestPermission();
  if (result !== 'granted') {
    console.log('权限被拒绝');
    return;
  }
}
```

## 类型定义

### Point

**类型**: `Object`

地图点坐标对象

### Bounds

**类型**: `Object`

地理区域对象

### MapStyles

**类型**: `Object`

地图样式配置对象

### GeocodeOptions

**类型**: `Object`

地理编码转换参数对象

### CoordinateConvertOptions

**类型**: `Object`

坐标转换参数对象

### Position

**类型**: `Object`

地图位置对象

### SearchPoiResult

**类型**: `Object`

兴趣点搜索结果对象

### SearchRouteResult

**类型**: `Object`

路线搜索结果对象

## 方法

### HTML5+ Maps 模块 ES Module 封装

HTML5+ Maps 模块 ES Module 封装

### 图类型常量

地图类型常量

### 索策略类型常量

检索策略类型常量

### 图错误代码常量

地图错误代码常量

### 标系类型常量

坐标系类型常量

### 理编码回调函数

地理编码回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 地理编码后的坐标点 |

### 标转换回调函数

坐标转换回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 转换后的坐标点 |

### 离计算回调函数

距离计算回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| distance | `number` | - 计算出的距离，单位米 |

### 理区域面积计算回调函数

地理区域面积计算回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| area | `number` | - 计算出的面积，单位平方米 |

### 户位置回调函数

用户位置回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 用户当前位置坐标 |

### 图点击事件回调函数

地图点击事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 点击的坐标点 |

### 图状态变化回调函数

地图状态变化回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| status | `Object` | - 地图状态信息 |

### 盖物点击事件回调函数

覆盖物点击事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| overlay | `Object` | - 被点击的覆盖物对象 |

### 盖物拖拽事件回调函数

覆盖物拖拽事件回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| overlay | `Object` | - 被拖拽的覆盖物对象 |

### 趣点搜索回调函数

兴趣点搜索回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `SearchPoiResult` | - 搜索结果 |

### 线搜索回调函数

路线搜索回调函数

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| result | `SearchRouteResult` | - 搜索结果 |

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
| error.code | `number` | - 错误编码 |
| error.message | `string` | - 错误描述信息 |

### Maps模块类

Maps模块类

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

### 式化坐标点

格式化坐标点

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 坐标点 |

**返回值**: `Point` - 格式化后的坐标点

### 建Point对象

创建Point对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| lng | `number` | - 经度 |
| lat | `number` | - 纬度 |

**返回值**: `Point` - 坐标点对象

### 建Bounds对象

创建Bounds对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| southwest | `Point` | - 西南角坐标 |
| northeast | `Point` | - 东北角坐标 |

**返回值**: `Bounds` - 地理区域对象

### 用系统第三方程序进行导航

调用系统第三方程序进行导航

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| dst | `Point` | - 导航目的地坐标 |
| des | `string` | - 导航目的地描述 |
| [src] | `Point` | - 导航起始地坐标 |

### 建Map对象

创建Map对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 地图控件标识 |
| styles | `MapStyles` | - 地图样式配置 |

**返回值**: `Object` - Map对象

### 找已经创建的Map对象

查找已经创建的Map对象

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| id | `string` | - 地图控件标识 |

**返回值**: `Object|null` - Map对象，如果不存在则返回null

### 理编码：将地址转换为坐标

地理编码：将地址转换为坐标

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| address | `string` | - 要转换的地址 |
| successCB | `GeocodeCallback` | - 成功回调函数 |
| [errorCB] | `ErrorCallback` | - 失败回调函数 |
| [coordsType=0] | `number` | - 坐标系类型 |

**返回值**: `Promise<Point>` - 返回坐标点

### 向地理编码：将坐标转换为地址

反向地理编码：将坐标转换为地址

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 要转换的坐标点 |
| successCB | `GeocodeCallback` | - 成功回调函数 |
| [errorCB] | `ErrorCallback` | - 失败回调函数 |
| [coordsType=0] | `number` | - 坐标系类型 |

**返回值**: `Promise<string>` - 返回地址

### 标转换

坐标转换

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 要转换的坐标点 |
| from | `number` | - 源坐标系类型 |
| to | `number` | - 目标坐标系类型 |
| successCB | `CoordinateConvertCallback` | - 成功回调函数 |
| [errorCB] | `ErrorCallback` | - 失败回调函数 |

**返回值**: `Promise<Point>` - 返回转换后的坐标点

### 算两点间距离

计算两点间距离

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point1 | `Point` | - 第一个坐标点 |
| point2 | `Point` | - 第二个坐标点 |

**返回值**: `Promise<number>` - 返回距离，单位米

### 取当前用户位置

获取当前用户位置

**返回值**: `Promise<Point>` - 返回用户当前位置坐标

### 化的系统导航调用方法，自动处理错误

简化的系统导航调用方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| dst | `Point` | - 导航目的地坐标 |
| des | `string` | - 导航目的地描述 |
| [src] | `Point` | - 导航起始地坐标 |

**返回值**: `boolean` - 成功返回true，失败返回false

### 化的地理编码方法，自动处理错误

简化的地理编码方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| address | `string` | - 要转换的地址 |

**返回值**: `Promise<Point|null>` - 成功返回坐标点，失败返回null

### 化的反向地理编码方法，自动处理错误

简化的反向地理编码方法，自动处理错误

**参数**:

| 参数 | 类型 | 描述 |
|------|------|------|
| point | `Point` | - 要转换的坐标点 |

**返回值**: `Promise<string|null>` - 成功返回地址，失败返回null

### 化的获取用户位置方法，自动处理错误

简化的获取用户位置方法，自动处理错误

**返回值**: `Promise<Point|null>` - 成功返回坐标点，失败返回null

### 断设备是否支持地图功能

判断设备是否支持地图功能

**返回值**: `Promise<boolean>` - 支持返回true，否则返回false

### 取当前活跃的地图数量

获取当前活跃的地图数量

**返回值**: `number` - 活跃地图数量

### 取所有活跃地图的ID列表

获取所有活跃地图的ID列表

**返回值**: `string[]` - 地图ID列表

## 使用示例

### 基本用法

```javascript
import maps from '../modules/maps.js';

try {
  // 基本操作
  const result = await maps.someMethod();
  console.log('操作结果:', result);
} catch (error) {
  console.error('操作失败:', error);
}
```

### 错误处理

```javascript
async function safeMapsOperation() {
  try {
    // 检查支持性
    const supported = await maps.isSupported();
    if (!supported) {
      throw new Error('设备不支持此功能');
    }

    // 检查权限
    const permission = await maps.checkPermission();
    if (permission !== 'granted') {
      const result = await maps.requestPermission();
      if (result !== 'granted') {
        throw new Error('权限被拒绝');
      }
    }

    // 执行操作
    const result = await maps.someMethod();
    return result;

  } catch (error) {
    console.error('Maps 操作失败:', error);
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

