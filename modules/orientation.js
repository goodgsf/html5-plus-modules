/**
 * HTML5+ Orientation 模块 ES Module 封装
 *
 * 该模块提供了设备方向传感器管理功能，包括获取当前方向、监听方向变化等
 * 遵循HTML5+官方API规范
 */

/**
 * 方向错误码常量
 */
export const OrientationErrorCode = {
    NOT_AVAILABLE: 1001,     // 方向传感器不可用
    PERMISSION_DENIED: 1002,  // 权限被拒绝
    TIMEOUT: 1003,            // 操作超时
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * 设备方向信息
 * @typedef {Object} Rotation
 * @property {number} alpha - 以z方向为轴心的旋转角度（0-360）
 * @property {number} beta - 以x方向为轴心的旋转角度（-180到180）
 * @property {number} gamma - 以y方向为轴心的旋转角度（-180到180）
 * @property {number} magneticHeading - 设备方向与地球磁场北极方向的角度（0-360）
 * @property {number} trueHeading - 设备方向与地球真实北极方向的角度（0-360）
 * @property {number} headingAccuracy - 设备方向值的误差值（0-360）
 */

/**
 * 方向监听选项
 * @typedef {Object} OrientationOption
 * @property {number} frequency - 更新方向信息的时间间隔，单位ms，默认500ms
 */

/**
 * 获取方向信息成功的回调函数
 * @callback OrientationSuccessCallback
 * @param {Rotation} rotation - 设备方向信息
 */

/**
 * 获取方向信息失败的回调函数
 * @callback OrientationErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ Orientation 模块类
 */
class OrientationModule {
    constructor() {
        this.moduleName = 'Orientation';
        this._watchers = new Map();
        this._nextId = 1;
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化Orientation模块
     * @private
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this._initPromise) {
            return this._initPromise;
        }

        this._initPromise = new Promise((resolve, reject) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined' || !plus.orientation) {
                    // 检查浏览器环境是否支持DeviceOrientationEvent
                    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
                        this._browserSupport = true;
                        console.log('Orientation模块将在浏览器环境中使用DeviceOrientationEvent API');
                    } else {
                        console.warn('设备不支持方向传感器功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Orientation模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 获取当前设备的方向信息
     * @returns {Promise<Rotation>} 设备方向信息
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const orientation = await orientation.getCurrentOrientation();
     *   console.log('当前方向:', {
     *     alpha: orientation.alpha,
     *     beta: orientation.beta,
     *     gamma: orientation.gamma
     *   });
     * } catch (error) {
     *   console.error('获取方向信息失败:', error);
     * }
     *
     * // 回调方式调用
     * orientation.getCurrentOrientation()
     *   .then(orientation => {
     *     console.log('方向信息:', orientation);
     *   })
     *   .catch(error => {
     *     console.error('获取失败:', error);
     *   });
     * ```
     */
    getCurrentOrientation() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.orientation) {
                    // HTML5+环境
                    plus.orientation.getCurrentOrientation(
                        (rotation) => {
                            resolve(this._normalizeRotation(rotation));
                        },
                        (error) => {
                            reject(new Error(`获取方向信息失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境使用DeviceOrientationEvent
                    this._getCurrentOrientationBrowser(resolve, reject);
                } else {
                    throw new Error('设备不支持方向传感器功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中获取当前方向信息
     * @private
     */
    _getCurrentOrientationBrowser(resolve, reject) {
        let timeoutId;
        let handler;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (handler) window.removeEventListener('deviceorientation', handler);
        };

        // 设置超时
        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('获取方向信息超时'));
        }, 3000);

        // 监听设备方向事件
        handler = (event) => {
            cleanup();

            const rotation = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0,
                magneticHeading: event.webkitCompassHeading || 0,
                trueHeading: 0, // 浏览器环境通常不支持真实方向
                headingAccuracy: event.webkitCompassAccuracy || 0
            };

            resolve(this._normalizeRotation(rotation));
        };

        window.addEventListener('deviceorientation', handler);

        // 请求权限（iOS 13+需要）
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response !== 'granted') {
                        cleanup();
                        reject(new Error('设备方向权限被拒绝'));
                    }
                })
                .catch(() => {
                    // 权限请求失败，继续尝试获取
                });
        }
    }

    /**
     * 监听设备方向信息的变化
     * @param {OrientationSuccessCallback} successCallback - 成功回调函数
     * @param {OrientationErrorCallback} [errorCallback] - 失败回调函数
     * @param {OrientationOption} [options] - 监听选项
     * @returns {Promise<number>} 监听器ID
     *
     * @example
     * ```javascript
     * try {
     *   const watchId = await orientation.watchOrientation(
     *     (rotation) => {
     *       console.log('方向变化:', rotation);
     *     },
     *     (error) => {
     *       console.error('监听失败:', error);
     *     },
     *     { frequency: 1000 }
     *   );
     *   console.log('监听器ID:', watchId);
     *
     *   // 稍后停止监听
     *   // await orientation.clearWatch(watchId);
     * } catch (error) {
     *   console.error('启动监听失败:', error);
     * }
     * ```
     */
    watchOrientation(successCallback, errorCallback = null, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof successCallback !== 'function') {
                    throw new Error('successCallback参数必须是一个函数');
                }

                const frequency = options.frequency || 500;
                const watchId = this._nextId++;

                if (typeof plus !== 'undefined' && plus.orientation) {
                    // HTML5+环境
                    const plusWatchId = plus.orientation.watchOrientation(
                        (rotation) => {
                            successCallback(this._normalizeRotation(rotation));
                        },
                        (error) => {
                            if (errorCallback) {
                                errorCallback(new Error(`方向监听失败: ${error.message || '未知错误'}`));
                            }
                        },
                        { frequency }
                    );

                    this._watchers.set(watchId, {
                        id: plusWatchId,
                        type: 'plus',
                        callback: successCallback,
                        errorCallback
                    });

                    resolve(watchId);
                } else if (this._browserSupport) {
                    // 浏览器环境使用DeviceOrientationEvent
                    this._watchOrientationBrowser(watchId, successCallback, errorCallback, options);
                    resolve(watchId);
                } else {
                    throw new Error('设备不支持方向传感器功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中监听方向变化
     * @private
     */
    _watchOrientationBrowser(watchId, successCallback, errorCallback, options) {
        const frequency = options.frequency || 500;
        let lastUpdate = 0;
        let timeoutId;

        const handler = (event) => {
            const now = Date.now();
            if (now - lastUpdate < frequency) {
                return;
            }

            lastUpdate = now;

            const rotation = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0,
                magneticHeading: event.webkitCompassHeading || 0,
                trueHeading: 0,
                headingAccuracy: event.webkitCompassAccuracy || 0
            };

            try {
                successCallback(this._normalizeRotation(rotation));
            } catch (error) {
                console.error('方向回调函数执行失败:', error);
            }
        };

        const requestPermission = async () => {
            if (typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const response = await DeviceOrientationEvent.requestPermission();
                    if (response !== 'granted') {
                        if (errorCallback) {
                            errorCallback(new Error('设备方向权限被拒绝'));
                        }
                        return false;
                    }
                } catch (error) {
                    console.warn('权限请求失败:', error);
                }
            }
            return true;
        };

        const setupWatcher = async () => {
            const hasPermission = await requestPermission();
            if (!hasPermission) return;

            window.addEventListener('deviceorientation', handler);
        };

        setupWatcher();

        this._watchers.set(watchId, {
            type: 'browser',
            handler,
            callback: successCallback,
            errorCallback
        });
    }

    /**
     * 关闭监听设备方向信息
     * @param {number} watchId - 监听器ID
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await orientation.clearWatch(watchId);
     *   console.log('监听已停止');
     * } catch (error) {
     *   console.error('停止监听失败:', error);
     * }
     * ```
     */
    clearWatch(watchId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!watchId) {
                    throw new Error('watchId参数不能为空');
                }

                const watcher = this._watchers.get(watchId);
                if (!watcher) {
                    throw new Error('未找到指定的监听器');
                }

                if (watcher.type === 'plus') {
                    // HTML5+环境
                    plus.orientation.clearWatch(watcher.id);
                } else if (watcher.type === 'browser') {
                    // 浏览器环境
                    if (watcher.handler) {
                        window.removeEventListener('deviceorientation', watcher.handler);
                    }
                }

                this._watchers.delete(watchId);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 标准化方向数据
     * @private
     */
    _normalizeRotation(rotation) {
        return {
            alpha: this._normalizeAngle(rotation.alpha),
            beta: this._normalizeAngle(rotation.beta, -180, 180),
            gamma: this._normalizeAngle(rotation.gamma, -180, 180),
            magneticHeading: this._normalizeAngle(rotation.magneticHeading),
            trueHeading: this._normalizeAngle(rotation.trueHeading),
            headingAccuracy: this._normalizeAngle(rotation.headingAccuracy)
        };
    }

    /**
     * 标准化角度值
     * @private
     */
    _normalizeAngle(angle, min = 0, max = 360) {
        if (angle === undefined || angle === null || isNaN(angle)) {
            return 0;
        }

        let normalized = Number(angle);

        if (min === 0 && max === 360) {
            normalized = ((normalized % 360) + 360) % 360;
        } else if (min === -180 && max === 180) {
            normalized = ((normalized + 180) % 360) - 180;
        }

        return Math.max(min, Math.min(max, normalized));
    }

    /**
     * 获取当前活跃的监听器数量
     * @returns {number} 活跃监听器数量
     *
     * @example
     * ```javascript
     * const count = orientation.getActiveWatcherCount();
     * console.log('活跃监听器数量:', count);
     * ```
     */
    getActiveWatcherCount() {
        return this._watchers.size;
    }

    /**
     * 停止所有活跃的监听器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await orientation.clearAllWatches();
     *   console.log('所有监听器已停止');
     * } catch (error) {
     *   console.error('停止监听器失败:', error);
     * }
     * ```
     */
    clearAllWatches() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const clearPromises = Array.from(this._watchers.keys()).map(watchId =>
                    this.clearWatch(watchId).catch(error => {
                        console.error(`停止监听器 ${watchId} 失败:`, error);
                    })
                );

                await Promise.all(clearPromises);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 判断设备是否支持Orientation功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await orientation.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持方向传感器功能');
     *   } else {
     *     console.log('设备不支持方向传感器功能');
     *   }
     * } catch (error) {
     *   console.error('检查支持性失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.orientation) {
                    resolve(true);
                } else if (this._browserSupport) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 检查设备方向权限状态（仅iOS 13+）
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await orientation.checkPermission();
     *   console.log('权限状态:', permission);
     * } catch (error) {
     *   console.error('检查权限失败:', error);
     * }
     * ```
     */
    checkPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof DeviceOrientationEvent !== 'undefined' &&
                    typeof DeviceOrientationEvent.requestPermission === 'function') {
                    // iOS 13+ 设备，需要检查权限
                    // 注意：无法直接检查权限状态，只能通过请求来间接判断
                    resolve('prompt');
                } else if (this._browserSupport) {
                    // 其他浏览器环境，通常不需要权限
                    resolve('granted');
                } else if (typeof plus !== 'undefined' && plus.orientation) {
                    // HTML5+环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求设备方向权限（仅iOS 13+）
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await orientation.requestPermission();
     *   if (permission === 'granted') {
     *     console.log('权限已授予');
     *   } else {
     *     console.log('权限被拒绝');
     *   }
     * } catch (error) {
     *   console.error('请求权限失败:', error);
     * }
     * ```
     */
    requestPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof DeviceOrientationEvent !== 'undefined' &&
                    typeof DeviceOrientationEvent.requestPermission === 'function') {
                    // iOS 13+ 设备
                    const response = await DeviceOrientationEvent.requestPermission();
                    resolve(response);
                } else {
                    // 其他环境，默认已授权
                    resolve('granted');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Orientation模块实例
const orientation = new OrientationModule();

// 导出模块
export default orientation;

// 导出类和常量
export { OrientationModule, OrientationErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
orientation.OrientationModule = OrientationModule;
orientation.OrientationErrorCode = OrientationErrorCode;