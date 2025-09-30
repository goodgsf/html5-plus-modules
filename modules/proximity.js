/**
 * HTML5+ Proximity 模块 ES Module 封装
 *
 * 该模块提供了设备距离感应器管理功能，包括获取当前距离、监听距离变化等
 * 遵循HTML5+官方API规范
 */

/**
 * 距离错误码常量
 */
export const ProximityErrorCode = {
    NOT_AVAILABLE: 1001,     // 距离感应器不可用
    PERMISSION_DENIED: 1002, // 权限被拒绝
    TIMEOUT: 1003,           // 操作超时
    UNKNOWN_ERROR: 1099      // 未知错误
};

/**
 * 设备距离信息
 * @typedef {Object} ProximityDistance
 * @property {number} distance - 设备距离物体的距离，单位厘米
 * @property {boolean} isNear - 是否靠近物体
 * @property {number} threshold - 靠近检测的阈值，单位厘米
 */

/**
 * 距离监听选项
 * @typedef {Object} ProximityOption
 * @property {number} frequency - 更新距离信息的时间间隔，单位ms，默认500ms
 */

/**
 * 获取距离信息成功的回调函数
 * @callback ProximitySuccessCallback
 * @param {ProximityDistance} proximity - 设备距离信息
 */

/**
 * 获取距离信息失败的回调函数
 * @callback ProximityErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ Proximity 模块类
 */
class ProximityModule {
    constructor() {
        this.moduleName = 'Proximity';
        this._watchers = new Map();
        this._nextId = 1;
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化Proximity模块
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
                if (typeof plus === 'undefined' || !plus.proximity) {
                    // 检查浏览器环境是否支持距离感应器
                    if (typeof window !== 'undefined' && 'ProximitySensor' in window) {
                        this._browserSupport = true;
                        console.log('Proximity模块将在浏览器环境中使用ProximitySensor API');
                    } else if (typeof window !== 'undefined' && 'DeviceProximityEvent' in window) {
                        this._browserSupport = true;
                        console.log('Proximity模块将在浏览器环境中使用DeviceProximityEvent API');
                    } else {
                        console.warn('设备不支持距离感应器功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Proximity模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 获取当前设备的距离信息
     * @returns {Promise<ProximityDistance>} 设备距离信息
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const proximity = await proximity.getCurrentProximity();
     *   console.log('当前距离:', {
     *     distance: proximity.distance,
     *     isNear: proximity.isNear,
     *     threshold: proximity.threshold
     *   });
     * } catch (error) {
     *   console.error('获取距离信息失败:', error);
     * }
     *
     * // 回调方式调用
     * proximity.getCurrentProximity()
     *   .then(proximity => {
     *     console.log('距离信息:', proximity);
     *   })
     *   .catch(error => {
     *     console.error('获取失败:', error);
     *   });
     * ```
     */
    getCurrentProximity() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.proximity) {
                    // HTML5+环境
                    plus.proximity.getCurrentDistance(
                        (distance) => {
                            resolve(this._normalizeDistance(distance));
                        },
                        (error) => {
                            reject(new Error(`获取距离信息失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境使用DeviceProximityEvent
                    this._getCurrentProximityBrowser(resolve, reject);
                } else {
                    throw new Error('设备不支持距离感应器功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中获取当前距离信息
     * @private
     */
    _getCurrentProximityBrowser(resolve, reject) {
        let timeoutId;
        let handler;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (handler) window.removeEventListener('deviceproximity', handler);
        };

        // 设置超时
        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('获取距离信息超时'));
        }, 3000);

        // 监听设备距离事件
        handler = (event) => {
            cleanup();

            const distance = {
                distance: event.distance || 0,
                isNear: (event.distance || 0) < (event.min || 10),
                threshold: event.min || 10
            };

            resolve(this._normalizeDistance(distance));
        };

        window.addEventListener('deviceproximity', handler);

        // 尝试使用ProximitySensor API（如果可用）
        if (typeof ProximitySensor !== 'undefined') {
            try {
                const sensor = new ProximitySensor();
                sensor.addEventListener('reading', () => {
                    cleanup();
                    const distance = {
                        distance: sensor.distance || 0,
                        isNear: sensor.near || false,
                        threshold: 10
                    };
                    resolve(this._normalizeDistance(distance));
                });
                sensor.start();
            } catch (error) {
                console.warn('ProximitySensor API调用失败，继续使用事件监听');
            }
        }
    }

    /**
     * 监听设备距离信息的变化
     * @param {ProximitySuccessCallback} successCallback - 成功回调函数
     * @param {ProximityErrorCallback} [errorCallback] - 失败回调函数
     * @param {ProximityOption} [options] - 监听选项
     * @returns {Promise<number>} 监听器ID
     *
     * @example
     * ```javascript
     * try {
     *   const watchId = await proximity.watchProximity(
     *     (proximity) => {
     *       console.log('距离变化:', proximity);
     *     },
     *     (error) => {
     *       console.error('监听失败:', error);
     *     },
     *     { frequency: 1000 }
     *   );
     *   console.log('监听器ID:', watchId);
     *
     *   // 稍后停止监听
     *   // await proximity.clearWatch(watchId);
     * } catch (error) {
     *   console.error('启动监听失败:', error);
     * }
     * ```
     */
    watchProximity(successCallback, errorCallback = null, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof successCallback !== 'function') {
                    throw new Error('successCallback参数必须是一个函数');
                }

                const frequency = options.frequency || 500;
                const watchId = this._nextId++;

                if (typeof plus !== 'undefined' && plus.proximity) {
                    // HTML5+环境
                    const plusWatchId = plus.proximity.watchProximity(
                        (distance) => {
                            successCallback(this._normalizeDistance(distance));
                        },
                        (error) => {
                            if (errorCallback) {
                                errorCallback(new Error(`距离监听失败: ${error.message || '未知错误'}`));
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
                    // 浏览器环境使用DeviceProximityEvent
                    this._watchProximityBrowser(watchId, successCallback, errorCallback, options);
                    resolve(watchId);
                } else {
                    throw new Error('设备不支持距离感应器功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中监听距离变化
     * @private
     */
    _watchProximityBrowser(watchId, successCallback, errorCallback, options) {
        const frequency = options.frequency || 500;
        let lastUpdate = 0;

        const handler = (event) => {
            const now = Date.now();
            if (now - lastUpdate < frequency) {
                return;
            }

            lastUpdate = now;

            const distance = {
                distance: event.distance || 0,
                isNear: (event.distance || 0) < (event.min || 10),
                threshold: event.min || 10
            };

            try {
                successCallback(this._normalizeDistance(distance));
            } catch (error) {
                console.error('距离回调函数执行失败:', error);
            }
        };

        // 尝试使用ProximitySensor API
        if (typeof ProximitySensor !== 'undefined') {
            try {
                const sensor = new ProximitySensor();
                sensor.addEventListener('reading', () => {
                    const now = Date.now();
                    if (now - lastUpdate < frequency) return;
                    lastUpdate = now;

                    const distance = {
                        distance: sensor.distance || 0,
                        isNear: sensor.near || false,
                        threshold: 10
                    };
                    successCallback(this._normalizeDistance(distance));
                });
                sensor.start();

                this._watchers.set(watchId, {
                    type: 'sensor',
                    sensor: sensor,
                    callback: successCallback,
                    errorCallback
                });
                return;
            } catch (error) {
                console.warn('ProximitySensor API调用失败，继续使用事件监听');
            }
        }

        // 使用事件监听
        window.addEventListener('deviceproximity', handler);
        this._watchers.set(watchId, {
            type: 'browser',
            handler,
            callback: successCallback,
            errorCallback
        });
    }

    /**
     * 关闭监听设备距离信息
     * @param {number} watchId - 监听器ID
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await proximity.clearWatch(watchId);
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
                    plus.proximity.clearWatch(watcher.id);
                } else if (watcher.type === 'browser') {
                    // 浏览器环境
                    if (watcher.handler) {
                        window.removeEventListener('deviceproximity', watcher.handler);
                    }
                } else if (watcher.type === 'sensor') {
                    // ProximitySensor环境
                    if (watcher.sensor) {
                        watcher.sensor.stop();
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
     * 标准化距离数据
     * @private
     */
    _normalizeDistance(distance) {
        return {
            distance: this._normalizeDistanceValue(distance.distance),
            isNear: !!distance.isNear,
            threshold: this._normalizeDistanceValue(distance.threshold)
        };
    }

    /**
     * 标准化距离值
     * @private
     */
    _normalizeDistanceValue(value) {
        if (value === undefined || value === null || isNaN(value)) {
            return 0;
        }
        return Math.max(0, Number(value));
    }

    /**
     * 获取当前活跃的监听器数量
     * @returns {number} 活跃监听器数量
     *
     * @example
     * ```javascript
     * const count = proximity.getActiveWatcherCount();
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
     *   await proximity.clearAllWatches();
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
     * 判断设备是否支持Proximity功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await proximity.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持距离感应器功能');
     *   } else {
     *     console.log('设备不支持距离感应器功能');
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

                if (typeof plus !== 'undefined' && plus.proximity) {
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
     * 检查设备距离感应器权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await proximity.checkPermission();
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

                if (typeof plus !== 'undefined' && plus.proximity) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境
                    if (typeof navigator !== 'undefined' && navigator.permissions) {
                        try {
                            const permission = await navigator.permissions.query({ name: 'proximity' });
                            resolve(permission.state);
                        } catch (error) {
                            // 浏览器不支持proximity权限查询
                            resolve('granted');
                        }
                    } else {
                        resolve('granted');
                    }
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求设备距离感应器权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await proximity.requestPermission();
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

                if (typeof plus !== 'undefined' && plus.proximity) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境通常不需要权限请求
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Proximity模块实例
const proximity = new ProximityModule();

// 导出模块
export default proximity;

// 导出类和常量
export { ProximityModule, ProximityErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
proximity.ProximityModule = ProximityModule;
proximity.ProximityErrorCode = ProximityErrorCode;