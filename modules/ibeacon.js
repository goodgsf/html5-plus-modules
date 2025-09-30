/**
 * HTML5+ iBeacon 模块 ES Module 封装
 *
 * 该模块提供了对设备iBeacon功能的访问能力
 * 支持搜索附近的iBeacon设备、监听设备更新、获取设备信息等功能
 * 遵循HTML5+官方API规范
 */

/**
 * iBeacon错误代码常量
 * @readonly
 * @enum {number}
 */
export const IBeaconErrorCode = {
    BLUETOOTH_UNAVAILABLE: 1,      // 蓝牙不可用
    LOCATION_UNAVAILABLE: 2,      // 位置服务不可用
    PERMISSION_DENIED: 3,         // 用户拒绝授权
    DEVICE_NOT_SUPPORTED: 4,       // 设备不支持iBeacon
    DISCOVERY_ALREADY_STARTED: 5,  // 搜索已经开始
    DISCOVERY_NOT_STARTED: 6,      // 搜索未开始
    UNKNOWN_ERROR: 7               // 未知错误
};

/**
 * iBeacon设备信息
 * @typedef {Object} IBeaconInfo
 * @property {string} uuid - iBeacon设备广播的uuid
 * @property {string} major - iBeacon设备的主id
 * @property {string} minor - iBeacon设备的次id
 * @property {number} proximity - iBeacon设备的距离
 * @property {number} accuracy - iBeacon设备的距离精度信息
 * @property {number} rssi - iBeacon设备的信号强度
 */

/**
 * iBeacon设备列表事件
 * @typedef {Object} IBeaconListEvent
 * @property {IBeaconInfo[]} beacons - iBeacon设备列表信息
 */

/**
 * iBeacon服务状态事件
 * @typedef {Object} IBeaconServiceEvent
 * @property {boolean} available - iBeacon服务目前是否可用
 * @property {boolean} discovering - 是否处于搜索iBeacon设备状态
 */

/**
 * iBeacon搜索参数
 * @typedef {Object} BeaconDiscoveryOptions
 * @property {string[]} [uuids] - 要搜索设备的uuid数组
 * @property {boolean} [ignoreBluetoothAvailable=false] - 是否校验蓝牙开关
 */

/**
 * iBeacon操作参数
 * @typedef {Object} IBeaconOptions
 * @property {Function} [success] - 成功回调函数
 * @property {Function} [fail] - 失败回调函数
 * @property {Function} [complete] - 操作完成回调函数
 */

/**
 * iBeacon成功回调函数
 * @callback IBeaconSuccessCallback
 * @param {Object} event - 回调参数
 */

/**
 * iBeacon失败回调函数
 * @callback IBeaconFailCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * iBeacon操作完成回调函数
 * @callback IBeaconCompleteCallback
 * @param {Object} event - 回调参数
 */

/**
 * iBeacon设备更新回调函数
 * @callback IBeaconUpdateCallback
 * @param {IBeaconListEvent} event - 设备信息
 */

/**
 * iBeacon服务状态变化回调函数
 * @callback IBeaconServiceChangeCallback
 * @param {IBeaconServiceEvent} event - 服务状态信息
 */

/**
 * iBeacon模块类
 */
class IBeaconModule {
    constructor() {
        this.isDiscovering = false;
        this.updateCallback = null;
        this.serviceChangeCallback = null;
        this.discoveryOptions = null;
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.ibeacon) {
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
     * 格式化iBeacon设备信息
     * @private
     * @param {Object} nativeBeacon - 原生iBeacon设备信息
     * @returns {IBeaconInfo} 格式化后的设备信息
     */
    formatBeaconInfo(nativeBeacon) {
        return {
            uuid: nativeBeacon.uuid,
            major: nativeBeacon.major,
            minor: nativeBeacon.minor,
            proximity: nativeBeacon.proximity,
            accuracy: nativeBeacon.accuracy,
            rssi: nativeBeacon.rssi
        };
    }

    /**
     * 格式化设备列表
     * @private
     * @param {Object} event - 原生事件对象
     * @returns {IBeaconListEvent} 格式化后的设备列表事件
     */
    formatBeaconListEvent(event) {
        const beacons = event.beacons || [];
        const formattedBeacons = beacons.map(beacon => this.formatBeaconInfo(beacon));

        return {
            beacons: formattedBeacons
        };
    }

    /**
     * 格式化服务状态事件
     * @private
     * @param {Object} event - 原生事件对象
     * @returns {IBeaconServiceEvent} 格式化后的服务状态事件
     */
    formatServiceEvent(event) {
        return {
            available: event.available,
            discovering: event.discovering
        };
    }

    /**
     * 开始搜索附近的iBeacon设备
     * @param {BeaconDiscoveryOptions} [options={}] - 搜索参数
     * @param {IBeaconSuccessCallback} [successFn] - 成功回调函数
     * @param {IBeaconFailCallback} [errorFn] - 失败回调函数
     * @param {IBeaconCompleteCallback} [completeFn] - 操作完成回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果搜索失败
     */
    async startBeaconDiscovery(options = {}, successFn, errorFn, completeFn) {
        try {
            this.checkPlusEnvironment();

            if (this.isDiscovering) {
                throw this.createError(
                    IBeaconErrorCode.DISCOVERY_ALREADY_STARTED,
                    'iBeacon搜索已经开始'
                );
            }

            const discoveryOptions = {
                uuids: options.uuids || [],
                ignoreBluetoothAvailable: options.ignoreBluetoothAvailable || false
            };

            return new Promise((resolve, reject) => {
                const wrappedOptions = {
                    uuids: discoveryOptions.uuids,
                    ignoreBluetoothAvailable: discoveryOptions.ignoreBluetoothAvailable,
                    success: (event) => {
                        this.isDiscovering = true;
                        this.discoveryOptions = discoveryOptions;

                        if (successFn) {
                            successFn(event);
                        }
                        resolve();

                        if (completeFn) {
                            completeFn(event);
                        }
                    },
                    fail: (error) => {
                        const formattedError = this.createError(
                            error.code || IBeaconErrorCode.UNKNOWN_ERROR,
                            error.message || '搜索iBeacon设备失败'
                        );

                        if (errorFn) {
                            errorFn(formattedError);
                        }
                        reject(formattedError);

                        if (completeFn) {
                            completeFn(error);
                        }
                    }
                };

                plus.ibeacon.startBeaconDiscovery(wrappedOptions);
            });

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorFn) {
                    errorFn(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `搜索iBeacon设备失败: ${error.message || '未知错误'}`
            );

            if (errorFn) {
                errorFn(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 停止搜索附近的iBeacon设备
     * @param {IBeaconSuccessCallback} [successFn] - 成功回调函数
     * @param {IBeaconFailCallback} [errorFn] - 失败回调函数
     * @param {IBeaconCompleteCallback} [completeFn] - 操作完成回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果停止失败
     */
    async stopBeaconDiscovery(successFn, errorFn, completeFn) {
        try {
            this.checkPlusEnvironment();

            if (!this.isDiscovering) {
                throw this.createError(
                    IBeaconErrorCode.DISCOVERY_NOT_STARTED,
                    'iBeacon搜索未开始'
                );
            }

            return new Promise((resolve, reject) => {
                const wrappedOptions = {
                    success: (event) => {
                        this.isDiscovering = false;
                        this.discoveryOptions = null;

                        if (successFn) {
                            successFn(event);
                        }
                        resolve();

                        if (completeFn) {
                            completeFn(event);
                        }
                    },
                    fail: (error) => {
                        const formattedError = this.createError(
                            error.code || IBeaconErrorCode.UNKNOWN_ERROR,
                            error.message || '停止搜索iBeacon设备失败'
                        );

                        if (errorFn) {
                            errorFn(formattedError);
                        }
                        reject(formattedError);

                        if (completeFn) {
                            completeFn(error);
                        }
                    }
                };

                plus.ibeacon.stopBeaconDiscovery(wrappedOptions);
            });

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorFn) {
                    errorFn(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `停止搜索iBeacon设备失败: ${error.message || '未知错误'}`
            );

            if (errorFn) {
                errorFn(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 获取已搜索到的iBeacon设备
     * @param {IBeaconSuccessCallback} [successFn] - 成功回调函数
     * @param {IBeaconFailCallback} [errorFn] - 失败回调函数
     * @param {IBeaconCompleteCallback} [completeFn] - 操作完成回调函数
     * @returns {Promise<IBeaconListEvent>} 返回设备列表
     * @throws {Error} 如果获取失败
     */
    async getBeacons(successFn, errorFn, completeFn) {
        try {
            this.checkPlusEnvironment();

            if (!this.isDiscovering) {
                throw this.createError(
                    IBeaconErrorCode.DISCOVERY_NOT_STARTED,
                    'iBeacon搜索未开始，请先调用startBeaconDiscovery'
                );
            }

            return new Promise((resolve, reject) => {
                const wrappedOptions = {
                    success: (event) => {
                        const formattedEvent = this.formatBeaconListEvent(event);

                        if (successFn) {
                            successFn(formattedEvent);
                        }
                        resolve(formattedEvent);

                        if (completeFn) {
                            completeFn(formattedEvent);
                        }
                    },
                    fail: (error) => {
                        const formattedError = this.createError(
                            error.code || IBeaconErrorCode.UNKNOWN_ERROR,
                            error.message || '获取iBeacon设备失败'
                        );

                        if (errorFn) {
                            errorFn(formattedError);
                        }
                        reject(formattedError);

                        if (completeFn) {
                            completeFn(error);
                        }
                    }
                };

                plus.ibeacon.getBeacons(wrappedOptions);
            });

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorFn) {
                    errorFn(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `获取iBeacon设备失败: ${error.message || '未知错误'}`
            );

            if (errorFn) {
                errorFn(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 监听iBeacon设备更新
     * @param {IBeaconUpdateCallback} updateCallback - 设备更新回调函数
     * @throws {Error} 如果监听失败
     */
    onBeaconUpdate(updateCallback) {
        try {
            this.checkPlusEnvironment();

            if (typeof updateCallback !== 'function') {
                throw new Error('设备更新回调函数不能为空');
            }

            this.updateCallback = updateCallback;

            plus.ibeacon.onBeaconUpdate((event) => {
                const formattedEvent = this.formatBeaconListEvent(event);
                if (this.updateCallback) {
                    this.updateCallback(formattedEvent);
                }
            });

        } catch (error) {
            throw this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `监听iBeacon设备更新失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 监听iBeacon服务状态变化
     * @param {IBeaconServiceChangeCallback} changeCallback - 服务状态变化回调函数
     * @throws {Error} 如果监听失败
     */
    onBeaconServiceChange(changeCallback) {
        try {
            this.checkPlusEnvironment();

            if (typeof changeCallback !== 'function') {
                throw new Error('服务状态变化回调函数不能为空');
            }

            this.serviceChangeCallback = changeCallback;

            plus.ibeacon.onBeaconServiceChange((event) => {
                const formattedEvent = this.formatServiceEvent(event);
                if (this.serviceChangeCallback) {
                    this.serviceChangeCallback(formattedEvent);
                }

                // 更新内部状态
                this.isDiscovering = formattedEvent.discovering;
            });

        } catch (error) {
            throw this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `监听iBeacon服务状态变化失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 取消监听iBeacon设备更新
     */
    offBeaconUpdate() {
        this.updateCallback = null;
    }

    /**
     * 取消监听iBeacon服务状态变化
     */
    offBeaconServiceChange() {
        this.serviceChangeCallback = null;
    }

    /**
     * 获取当前iBeacon服务状态
     * @returns {Promise<IBeaconServiceEvent>} 返回服务状态
     * @throws {Error} 如果获取失败
     */
    async getBeaconServiceStatus() {
        try {
            this.checkPlusEnvironment();

            return new Promise((resolve, reject) => {
                // 设置临时监听器获取状态
                const tempCallback = (event) => {
                    const formattedEvent = this.formatServiceEvent(event);
                    resolve(formattedEvent);
                    // 移除临时监听器
                    plus.ibeacon.onBeaconServiceChange(() => {});
                };

                this.onBeaconServiceChange(tempCallback);

                // 超时处理
                setTimeout(() => {
                    this.offBeaconServiceChange();
                    reject(this.createError(
                        IBeaconErrorCode.UNKNOWN_ERROR,
                        '获取iBeacon服务状态超时'
                    ));
                }, 3000);
            });

        } catch (error) {
            throw this.createError(
                IBeaconErrorCode.UNKNOWN_ERROR,
                `获取iBeacon服务状态失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 简化的搜索方法，自动处理错误
     * @param {BeaconDiscoveryOptions} [options={}] - 搜索参数
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickStartDiscovery(options = {}) {
        try {
            await this.startBeaconDiscovery(options);
            return true;
        } catch (error) {
            console.warn('搜索iBeacon设备失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的停止搜索方法，自动处理错误
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickStopDiscovery() {
        try {
            await this.stopBeaconDiscovery();
            return true;
        } catch (error) {
            console.warn('停止搜索iBeacon设备失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的获取设备列表方法，自动处理错误
     * @returns {Promise<IBeaconInfo[]|null>} 成功返回设备列表，失败返回null
     */
    async quickGetBeacons() {
        try {
            const result = await this.getBeacons();
            return result.beacons;
        } catch (error) {
            console.warn('获取iBeacon设备失败:', error.message);
            return null;
        }
    }

    /**
     * 判断设备是否支持iBeacon
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
     * 获取当前搜索状态
     * @returns {boolean} 是否正在搜索
     */
    isDiscoveringNow() {
        return this.isDiscovering;
    }
}

// 创建iBeacon模块实例
const ibeacon = new IBeaconModule();

// 导出模块
export default ibeacon;

// 导出常量
export { IBeaconErrorCode };