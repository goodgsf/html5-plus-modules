/**
 * HTML5+ Maps 模块 ES Module 封装
 *
 * 该模块提供了对地图控件的访问能力
 * 支持创建地图控件、添加标记、路线规划、地理编码等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 地图类型常量
 * @readonly
 * @enum {string}
 */
export const MapType = {
    STANDARD: 'standard',      // 标准地图
    SATELLITE: 'satellite',     // 卫星地图
    NIGHT: 'night',            // 夜间地图
    NAVIGATION: 'navigation',  // 导航地图
    TRAFFIC: 'traffic'          // 实时交通地图
};

/**
 * 检索策略类型常量
 * @readonly
 * @enum {number}
 */
export const SearchPolicy = {
    TRANSIT: 1,                 // 公交检索策略
    DRIVING: 2,                 // 驾车检索策略
    WALKING: 3,                 // 步行检索策略
    RIDING: 4                   // 骑行检索策略
};

/**
 * 地图错误代码常量
 * @readonly
 * @enum {number}
 */
export const MapsErrorCode = {
    MAP_NOT_CREATED: 1,         // 地图未创建
    INVALID_COORDINATES: 2,     // 无效的坐标
    NETWORK_ERROR: 3,          // 网络错误
    PERMISSION_DENIED: 4,      // 权限拒绝
    SEARCH_FAILED: 5,           // 搜索失败
    ROUTE_PLANNING_FAILED: 6,   // 路线规划失败
    GEOCODE_FAILED: 7,         // 地理编码失败
    OVERLAY_ERROR: 8,          // 覆盖物操作错误
    UNKNOWN_ERROR: 9            // 未知错误
};

/**
 * 坐标系类型常量
 * @readonly
 * @enum {number}
 */
export const CoordinateSystem = {
    WGS84: 0,                   // WGS84坐标系（GPS坐标系）
    GCJ02: 1,                   // GCJ02坐标系（国测局坐标系）
    BD09: 2                     // BD09坐标系（百度坐标系）
};

/**
 * 地图点坐标对象
 * @typedef {Object} Point
 * @property {number} lng - 经度
 * @property {number} lat - 纬度
 */

/**
 * 地理区域对象
 * @typedef {Object} Bounds
 * @property {Point} southwest - 西南角坐标
 * @property {Point} northeast - 东北角坐标
 */

/**
 * 地图样式配置对象
 * @typedef {Object} MapStyles
 * @property {string} id - 地图控件标识
 * @property {number} top - 控件距离容器顶部的距离
 * @property {number} left - 控件距离容器左侧的距离
 * @property {number} width - 控件的宽度
 * @property {number} height - 控件的高度
 * @property {string} [center] - 地图中心点坐标，格式为"纬度,经度"
 * @property {number} [zoom=12] - 地图缩放级别
 * @property {string} [mapType='standard'] - 地图类型
 * @property {boolean} [zoomControls=true] - 是否显示缩放控件
 * @property {boolean} [trafficEnabled=false] - 是否显示实时路况
 * @property {boolean} [baiduTrafficEnabled=false] - 是否显示百度实时路况
 * @property {string} [position] - 地图控件的位置
 */

/**
 * 地理编码转换参数对象
 * @typedef {Object} GeocodeOptions
 * @property {string} address - 要转换的地址
 * @property {number} [coordsType=0] - 坐标系类型
 */

/**
 * 坐标转换参数对象
 * @typedef {Object} CoordinateConvertOptions
 * @property {Point} point - 要转换的坐标点
 * @property {number} from - 源坐标系类型
 * @property {number} to - 目标坐标系类型
 */

/**
 * 地图位置对象
 * @typedef {Object} Position
 * @property {Point} point - 位置坐标
 * @property {string} address - 位置地址
 * @property {string} name - 位置名称
 * @property {string} city - 所在城市
 * @property {string} district - 所在区域
 * @property {string} phone - 联系电话
 * @property {string} postcode - 邮政编码
 */

/**
 * 兴趣点搜索结果对象
 * @typedef {Object} SearchPoiResult
 * @property {Position[]} currentPosition - 当前位置信息
 * @property {Position[]} poiList - 兴趣点列表
 * @property {number} totalNumber - 总结果数量
 * @property {number} currentPage - 当前页码
 * @property {number} pageSize - 每页数量
 */

/**
 * 路线搜索结果对象
 * @typedef {Object} SearchRouteResult
 * @property {Object} route - 路线信息
 * @property {string} start - 起点信息
 * @property {string} end - 终点信息
 * @property {number} distance - 总距离，单位米
 * @property {number} duration - 预计时间，单位秒
 */

/**
 * 地理编码回调函数
 * @callback GeocodeCallback
 * @param {Point} point - 地理编码后的坐标点
 */

/**
 * 坐标转换回调函数
 * @callback CoordinateConvertCallback
 * @param {Point} point - 转换后的坐标点
 */

/**
 * 距离计算回调函数
 * @callback DistanceCalculateCallback
 * @param {number} distance - 计算出的距离，单位米
 */

/**
 * 地理区域面积计算回调函数
 * @callback AreaCalculateCallback
 * @param {number} area - 计算出的面积，单位平方米
 */

/**
 * 用户位置回调函数
 * @callback UserLocationCallback
 * @param {Point} point - 用户当前位置坐标
 */

/**
 * 地图点击事件回调函数
 * @callback ClickEventHandler
 * @param {Point} point - 点击的坐标点
 */

/**
 * 地图状态变化回调函数
 * @callback StatusChangedEventHandler
 * @param {Object} status - 地图状态信息
 */

/**
 * 覆盖物点击事件回调函数
 * @callback OverlayClickEventHandler
 * @param {Object} overlay - 被点击的覆盖物对象
 */

/**
 * 覆盖物拖拽事件回调函数
 * @callback OverlayDragEventHandler
 * @param {Object} overlay - 被拖拽的覆盖物对象
 */

/**
 * 兴趣点搜索回调函数
 * @callback PoiSearchCallback
 * @param {SearchPoiResult} result - 搜索结果
 */

/**
 * 路线搜索回调函数
 * @callback RouteSearchCallback
 * @param {SearchRouteResult} result - 搜索结果
 */

/**
 * 成功回调函数
 * @callback SuccessCallback
 * @param {*} result - 操作结果
 */

/**
 * 失败回调函数
 * @callback ErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Maps模块类
 */
class MapsModule {
    constructor() {
        this.activeMaps = new Map(); // 存储活跃的地图实例
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.maps) {
            throw new Error('HTML5+ 环境不可用，请确保在HTML5+环境中运行');
        }
    }

    /**
     * 创建错误对象
     * @private
     * @param {number} code - 错误代码
     * @param {string} message - 错误描述信息
     * @returns {Object} 错误对象
     */
    createError(code, message) {
        return {
            code,
            message
        };
    }

    /**
     * 格式化坐标点
     * @private
     * @param {Point} point - 坐标点
     * @returns {Point} 格式化后的坐标点
     */
    formatPoint(point) {
        return {
            lng: point.lng,
            lat: point.lat
        };
    }

    /**
     * 创建Point对象
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     * @returns {Point} 坐标点对象
     */
    createPoint(lng, lat) {
        return new plus.maps.Point(lng, lat);
    }

    /**
     * 创建Bounds对象
     * @param {Point} southwest - 西南角坐标
     * @param {Point} northeast - 东北角坐标
     * @returns {Bounds} 地理区域对象
     */
    createBounds(southwest, northeast) {
        return new plus.maps.Bounds(southwest, northeast);
    }

    /**
     * 调用系统第三方程序进行导航
     * @param {Point} dst - 导航目的地坐标
     * @param {string} des - 导航目的地描述
     * @param {Point} [src] - 导航起始地坐标
     * @throws {Error} 如果调用失败
     */
    openSysMap(dst, des, src) {
        try {
            this.checkPlusEnvironment();

            if (!dst || typeof dst.lng !== 'number' || typeof dst.lat !== 'number') {
                throw this.createError(
                    MapsErrorCode.INVALID_COORDINATES,
                    '目的地坐标无效'
                );
            }

            if (!des || typeof des !== 'string') {
                throw new Error('目的地描述不能为空');
            }

            plus.maps.openSysMap(dst, des, src);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                MapsErrorCode.UNKNOWN_ERROR,
                `调用系统导航失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 创建Map对象
     * @param {string} id - 地图控件标识
     * @param {MapStyles} styles - 地图样式配置
     * @returns {Object} Map对象
     * @throws {Error} 如果创建失败
     */
    create(id, styles) {
        try {
            this.checkPlusEnvironment();

            if (!id || typeof id !== 'string') {
                throw new Error('地图控件标识不能为空');
            }

            if (!styles || typeof styles !== 'object') {
                throw new Error('地图样式配置不能为空');
            }

            const map = plus.maps.create(id, styles);
            this.activeMaps.set(id, map);

            return map;

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                MapsErrorCode.MAP_NOT_CREATED,
                `创建地图失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 查找已经创建的Map对象
     * @param {string} id - 地图控件标识
     * @returns {Object|null} Map对象，如果不存在则返回null
     */
    getMapById(id) {
        try {
            this.checkPlusEnvironment();
            return plus.maps.getMapById(id);
        } catch (error) {
            console.warn('获取地图对象失败:', error.message);
            return null;
        }
    }

    /**
     * 地理编码：将地址转换为坐标
     * @param {string} address - 要转换的地址
     * @param {GeocodeCallback} successCB - 成功回调函数
     * @param {ErrorCallback} [errorCB] - 失败回调函数
     * @param {number} [coordsType=0] - 坐标系类型
     * @returns {Promise<Point>} 返回坐标点
     * @throws {Error} 如果转换失败
     */
    geocode(address, successCB, errorCB, coordsType = 0) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.geocode(address, resolve, reject, successCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!address || typeof address !== 'string') {
                throw this.createError(
                    MapsErrorCode.GEOCODE_FAILED,
                    '地址不能为空'
                );
            }

            plus.maps.geocode(address,
                (point) => {
                    const formattedPoint = this.formatPoint(point);
                    if (successCB) {
                        successCB(formattedPoint);
                    }
                },
                errorCB,
                coordsType
            );

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                MapsErrorCode.GEOCODE_FAILED,
                `地理编码失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 反向地理编码：将坐标转换为地址
     * @param {Point} point - 要转换的坐标点
     * @param {GeocodeCallback} successCB - 成功回调函数
     * @param {ErrorCallback} [errorCB] - 失败回调函数
     * @param {number} [coordsType=0] - 坐标系类型
     * @returns {Promise<string>} 返回地址
     * @throws {Error} 如果转换失败
     */
    reverseGeocode(point, successCB, errorCB, coordsType = 0) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.reverseGeocode(point, resolve, reject, successCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!point || typeof point.lng !== 'number' || typeof point.lat !== 'number') {
                throw this.createError(
                    MapsErrorCode.INVALID_COORDINATES,
                    '坐标点无效'
                );
            }

            plus.maps.reverseGeocode(point, successCB, errorCB, coordsType);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                MapsErrorCode.GEOCODE_FAILED,
                `反向地理编码失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 坐标转换
     * @param {Point} point - 要转换的坐标点
     * @param {number} from - 源坐标系类型
     * @param {number} to - 目标坐标系类型
     * @param {CoordinateConvertCallback} successCB - 成功回调函数
     * @param {ErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<Point>} 返回转换后的坐标点
     * @throws {Error} 如果转换失败
     */
    convertCoordinates(point, from, to, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.convertCoordinates(point, from, to, resolve, reject);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!point || typeof point.lng !== 'number' || typeof point.lat !== 'number') {
                throw this.createError(
                    MapsErrorCode.INVALID_COORDINATES,
                    '坐标点无效'
                );
            }

            plus.maps.convertCoordinates(point, from, to, successCB, errorCB);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                MapsErrorCode.UNKNOWN_ERROR,
                `坐标转换失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 计算两点间距离
     * @param {Point} point1 - 第一个坐标点
     * @param {Point} point2 - 第二个坐标点
     * @returns {Promise<number>} 返回距离，单位米
     * @throws {Error} 如果计算失败
     */
    calculateDistance(point1, point2) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!point1 || typeof point1.lng !== 'number' || typeof point1.lat !== 'number') {
                    throw this.createError(
                        MapsErrorCode.INVALID_COORDINATES,
                        '第一个坐标点无效'
                    );
                }

                if (!point2 || typeof point2.lng !== 'number' || typeof point2.lat !== 'number') {
                    throw this.createError(
                        MapsErrorCode.INVALID_COORDINATES,
                        '第二个坐标点无效'
                    );
                }

                plus.maps.calculateDistance(
                    point1,
                    point2,
                    (distance) => resolve(distance),
                    (error) => reject(this.createError(
                        MapsErrorCode.UNKNOWN_ERROR,
                        error.message || '距离计算失败'
                    ))
                );

            } catch (error) {
                // 如果是自定义错误，直接抛出
                if (error.code && error.message) {
                    reject(error);
                    return;
                }

                reject(this.createError(
                    MapsErrorCode.UNKNOWN_ERROR,
                    `距离计算失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 获取当前用户位置
     * @returns {Promise<Point>} 返回用户当前位置坐标
     * @throws {Error} 如果获取失败
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                plus.maps.getCurrentPosition(
                    (point) => {
                        resolve(this.formatPoint(point));
                    },
                    (error) => reject(this.createError(
                        MapsErrorCode.PERMISSION_DENIED,
                        error.message || '获取用户位置失败'
                    ))
                );

            } catch (error) {
                reject(this.createError(
                    MapsErrorCode.UNKNOWN_ERROR,
                    `获取用户位置失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 简化的系统导航调用方法，自动处理错误
     * @param {Point} dst - 导航目的地坐标
     * @param {string} des - 导航目的地描述
     * @param {Point} [src] - 导航起始地坐标
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickOpenSysMap(dst, des, src) {
        try {
            this.openSysMap(dst, des, src);
            return true;
        } catch (error) {
            console.warn('调用系统导航失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的地理编码方法，自动处理错误
     * @param {string} address - 要转换的地址
     * @returns {Promise<Point|null>} 成功返回坐标点，失败返回null
     */
    async quickGeocode(address) {
        try {
            return await this.geocode(address);
        } catch (error) {
            console.warn('地理编码失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的反向地理编码方法，自动处理错误
     * @param {Point} point - 要转换的坐标点
     * @returns {Promise<string|null>} 成功返回地址，失败返回null
     */
    async quickReverseGeocode(point) {
        try {
            return await this.reverseGeocode(point);
        } catch (error) {
            console.warn('反向地理编码失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的获取用户位置方法，自动处理错误
     * @returns {Promise<Point|null>} 成功返回坐标点，失败返回null
     */
    async quickGetCurrentPosition() {
        try {
            return await this.getCurrentPosition();
        } catch (error) {
            console.warn('获取用户位置失败:', error.message);
            return null;
        }
    }

    /**
     * 判断设备是否支持地图功能
     * @returns {Promise<boolean>} 支持返回true，否则返回false
     */
    async isSupported() {
        try {
            this.checkPlusEnvironment();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取当前活跃的地图数量
     * @returns {number} 活跃地图数量
     */
    getActiveMapsCount() {
        return this.activeMaps.size;
    }

    /**
     * 获取所有活跃地图的ID列表
     * @returns {string[]} 地图ID列表
     */
    getActiveMapIds() {
        return Array.from(this.activeMaps.keys());
    }
}

// 创建Maps模块实例
const maps = new MapsModule();

// 导出模块
export default maps;

// 导出常量
export { MapType, SearchPolicy, MapsErrorCode, CoordinateSystem };