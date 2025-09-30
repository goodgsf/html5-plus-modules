/**
 * HTML5+ Geolocation 模块 ES Module 封装
 *
 * 该模块提供了对设备地理位置信息的访问能力
 * 支持获取当前位置、监听位置变化、坐标转换等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 地理位置错误代码常量
 * @readonly
 * @enum {number}
 */
export const GeolocationErrorCode = {
    PERMISSION_DENIED: 1,        // 用户拒绝授权获取地理位置信息
    POSITION_UNAVAILABLE: 2,     // 设备无法获取有效的地理位置信息
    TIMEOUT: 3,                  // 获取地理位置信息超时
    UNKNOWN_ERROR: 4             // 未知错误
};

/**
 * 坐标系统类型
 * @readonly
 * @enum {string}
 */
export const CoordinatesType = {
    WGS84: 'wgs84',      // WGS84坐标系，标准GPS坐标
    GCJ02: 'gcj02',      // GCJ02坐标系，国测局坐标
    BD09: 'bd09',        // BD09坐标系，百度地图使用的坐标
    BD09LL: 'bd09ll'     // BD09LL坐标系，百度地图使用的经纬度坐标
};

/**
 * 地理位置信息提供者
 * @readonly
 * @enum {string}
 */
export const GeolocationProvider = {
    SYSTEM: 'system',    // 系统提供者
    BAIDU: 'baidu',      // 百度地图提供者
    AMAP: 'amap'         // 高德地图提供者
};

/**
 * 地理位置坐标信息
 * @typedef {Object} Coordinates
 * @property {number} latitude - 纬度，浮点数，范围-90~90
 * @property {number} longitude - 经度，浮点数，范围-180~180
 * @property {number} [altitude] - 海拔高度，单位米（如果设备支持）
 * @property {number} accuracy - 精确度，单位米
 * @property {number} [altitudeAccuracy] - 海拔精确度，单位米（如果设备支持）
 * @property {number} [heading] - 设备移动方向，单位度，范围0~359.99（如果设备支持）
 * @property {number} [speed] - 设备移动速度，单位米/秒（如果设备支持）
 */

/**
 * 地理位置地址信息
 * @typedef {Object} Address
 * @property {string} [country] - 国家
 * @property {string} [province] - 省份
 * @property {string} [city] - 城市
 * @property {string} [district] - 区县
 * @property {string} [street] - 街道
 * @property {string} [streetNum] - 门牌号
 * @property {string} [postalCode] - 邮政编码
 * @property {string} [cityCode] - 城市代码
 * @property {string} [adCode] - 区域代码
 */

/**
 * 地理位置信息
 * @typedef {Object} Position
 * @property {Coordinates} coords - 坐标信息
 * @property {Address} [addresses] - 地址信息（如果支持地址解析）
 * @property {number} timestamp - 获取到位置信息的时间戳
 * @property {string} [coordsType] - 坐标系类型
 */

/**
 * 地理位置监听器参数
 * @typedef {Object} PositionOptions
 * @property {boolean} [enableHighAccuracy=false] - 是否要求高精度的地理位置信息
 * @property {number} [timeout=Infinity] - 获取地理位置信息的超时时间，单位毫秒
 * @property {number} [maximumAge=0] - 缓存地理位置信息的最大时间，单位毫秒
 * @property {string} [coordsType='wgs84'] - 指定坐标系类型
 * @property {string} [provider='system'] - 指定位置信息提供者
 * @property {boolean} [geocode=true] - 是否解析地址信息
 */

/**
 * 地理位置信息获取成功的回调函数
 * @callback GeolocationSuccessCallback
 * @param {Position} position - 地理位置信息
 */

/**
 * 地理位置信息获取失败的回调函数
 * @callback GeolocationErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误代码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Geolocation模块类
 */
class GeolocationModule {
    constructor() {
        this.activeWatchers = new Map(); // 存储活跃的监听器
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.geolocation) {
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
     * 格式化位置选项参数
     * @private
     * @param {PositionOptions} options - 选项参数
     * @returns {Object} 格式化后的选项
     */
    formatOptions(options = {}) {
        const formattedOptions = {
            enableHighAccuracy: options.enableHighAccuracy || false,
            timeout: options.timeout !== undefined ? options.timeout : Infinity,
            maximumAge: options.maximumAge !== undefined ? options.maximumAge : 0,
            coordsType: options.coordsType || CoordinatesType.WGS84,
            provider: options.provider || GeolocationProvider.SYSTEM,
            geocode: options.geocode !== false
        };

        return formattedOptions;
    }

    /**
     * 格式化位置信息
     * @private
     * @param {Object} nativePosition - 原生位置信息
     * @returns {Position} 格式化后的位置信息
     */
    formatPosition(nativePosition) {
        return {
            coords: {
                latitude: nativePosition.coords.latitude,
                longitude: nativePosition.coords.longitude,
                altitude: nativePosition.coords.altitude,
                accuracy: nativePosition.coords.accuracy,
                altitudeAccuracy: nativePosition.coords.altitudeAccuracy,
                heading: nativePosition.coords.heading,
                speed: nativePosition.coords.speed
            },
            addresses: nativePosition.addresses,
            timestamp: nativePosition.timestamp || Date.now(),
            coordsType: nativePosition.coordsType || 'wgs84'
        };
    }

    /**
     * 获取当前设备的地理位置信息
     * @param {GeolocationSuccessCallback} successCB - 成功回调函数
     * @param {GeolocationErrorCallback} [errorCB] - 失败回调函数
     * @param {PositionOptions} [options={}] - 获取位置信息的参数
     * @returns {Promise<Position>} 返回位置信息的Promise
     * @throws {Error} 如果获取失败
     */
    getCurrentPosition(successCB, errorCB, options = {}) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.getCurrentPosition(resolve, reject, successCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            const formattedOptions = this.formatOptions(options);

            // 调用原生API
            plus.geolocation.getCurrentPosition(
                (position) => {
                    const formattedPosition = this.formatPosition(position);
                    successCB(formattedPosition);
                },
                (error) => {
                    if (errorCB) {
                        errorCB(error);
                    }
                },
                formattedOptions
            );
        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: GeolocationErrorCode.UNKNOWN_ERROR,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 监听设备地理位置变化信息
     * @param {GeolocationSuccessCallback} successCB - 成功回调函数
     * @param {GeolocationErrorCallback} [errorCB] - 失败回调函数
     * @param {PositionOptions} [options={}] - 监听位置信息的参数
     * @returns {number|Promise<number>} 用于标识地理位置监听器，可通过clearWatch方法取消监听
     * @throws {Error} 如果监听失败
     */
    watchPosition(successCB, errorCB, options = {}) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.watchPosition(successCB, reject, successCB).then(resolve).catch(reject);
            });
        }

        try {
            this.checkPlusEnvironment();

            // 检查回调函数
            if (typeof successCB !== 'function') {
                throw new Error('成功回调函数不能为空');
            }

            const formattedOptions = this.formatOptions(options);

            // 调用原生API
            const watchId = plus.geolocation.watchPosition(
                (position) => {
                    const formattedPosition = this.formatPosition(position);
                    successCB(formattedPosition);
                },
                (error) => {
                    if (errorCB) {
                        errorCB(error);
                    }
                },
                formattedOptions
            );

            // 存储监听器信息
            this.activeWatchers.set(watchId, {
                successCB: successCB,
                errorCB: errorCB,
                options: formattedOptions,
                startTime: Date.now()
            });

            return watchId;
        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: GeolocationErrorCode.UNKNOWN_ERROR,
                    message: error.message
                });
                return -1;
            } else {
                throw error;
            }
        }
    }

    /**
     * 关闭监听设备地理位置信息
     * @param {number} watchId - 需要取消的地理位置监听器标识
     * @returns {Promise<void>|void}
     * @throws {Error} 如果参数错误或关闭失败
     */
    clearWatch(watchId) {
        // 如果没有传入watchId，支持Promise方式
        if (typeof watchId === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('watchId参数不能为空'));
            });
        }

        try {
            this.checkPlusEnvironment();

            // 检查watchId是否有效
            if (typeof watchId !== 'number' || watchId < 0) {
                throw new Error('无效的watchId');
            }

            // 检查监听器是否存在
            if (!this.activeWatchers.has(watchId)) {
                // 即使不存在，也尝试调用原生API清理
                plus.geolocation.clearWatch(watchId);
                return;
            }

            // 调用原生API
            plus.geolocation.clearWatch(watchId);

            // 从活跃监听器中移除
            this.activeWatchers.delete(watchId);

        } catch (error) {
            throw error;
        }
    }

    /**
     * 判断设备是否支持地理位置服务
     * @returns {Promise<boolean>} 返回是否支持的Promise
     */
    isSupported() {
        return new Promise((resolve) => {
            try {
                if (typeof plus === 'undefined') {
                    resolve(false);
                    return;
                }

                resolve(!!plus.geolocation);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的监听器信息
     * @returns {Array<Object>} 活跃监听器信息数组
     */
    getActiveWatchers() {
        const watchers = [];
        const currentTime = Date.now();

        this.activeWatchers.forEach((watcher, watchId) => {
            watchers.push({
                watchId: watchId,
                options: watcher.options,
                startTime: watcher.startTime,
                runTime: currentTime - watcher.startTime
            });
        });

        return watchers;
    }

    /**
     * 关闭所有活跃的监听器
     * @returns {Promise<void>}
     */
    clearAllWatches() {
        return new Promise((resolve, reject) => {
            try {
                const watchIds = Array.from(this.activeWatchers.keys());
                const promises = [];

                watchIds.forEach(watchId => {
                    promises.push(this.clearWatch(watchId));
                });

                Promise.all(promises).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 坐标转换
     * @param {number} latitude - 纬度
     * @param {number} longitude - 经度
     * @param {string} fromCoordsType - 源坐标系类型
     * @param {string} toCoordsType - 目标坐标系类型
     * @returns {Promise<Object>} 转换后的坐标信息
     * @throws {Error} 如果转换失败
     */
    convertCoordinates(latitude, longitude, fromCoordsType, toCoordsType) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                // 调用原生API
                plus.geolocation.convertCoordinates(
                    latitude,
                    longitude,
                    (result) => {
                        resolve({
                            coords: result.coords,
                            coordsType: result.coordsType,
                            timestamp: result.timestamp || Date.now()
                        });
                    },
                    (error) => {
                        reject(this.createError(
                            error.code || GeolocationErrorCode.UNKNOWN_ERROR,
                            error.message || '坐标转换失败'
                        ));
                    },
                    {
                        from: fromCoordsType,
                        to: toCoordsType
                    }
                );
            } catch (error) {
                reject(this.createError(
                    GeolocationErrorCode.UNKNOWN_ERROR,
                    `坐标转换失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 简化的位置获取方法，自动处理错误
     * @param {PositionOptions} [options={}] - 获取位置信息的参数
     * @returns {Promise<Position|null>} 成功返回位置信息，失败返回null
     */
    async quickGetPosition(options = {}) {
        try {
            return await this.getCurrentPosition(null, null, options);
        } catch (error) {
            console.warn('获取位置信息失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的位置监听方法，自动处理错误
     * @param {GeolocationSuccessCallback} successCB - 成功回调函数
     * @param {PositionOptions} [options={}] - 监听位置信息的参数
     * @returns {Promise<number|null>} 成功返回监听器ID，失败返回null
     */
    async quickWatchPosition(successCB, options = {}) {
        try {
            return await this.watchPosition(successCB, null, options);
        } catch (error) {
            console.warn('监听位置信息失败:', error.message);
            return null;
        }
    }
}

// 创建Geolocation模块实例
const geolocation = new GeolocationModule();

// 导出模块
export default geolocation;

// 导出常量
export { GeolocationErrorCode, CoordinatesType, GeolocationProvider };