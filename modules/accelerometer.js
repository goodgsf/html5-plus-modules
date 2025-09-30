/**
 * HTML5+ Accelerometer 模块 ES Module 封装
 *
 * 该模块提供了对设备加速度传感器的访问能力
 * 可以获取设备在三维空间中的加速度信息
 * 遵循HTML5+官方API规范
 */

/**
 * 设备加速度信息对象
 * @typedef {Object} Acceleration
 * @property {number} xAxis - X轴加速度值，单位m/s²
 * @property {number} yAxis - Y轴加速度值，单位m/s²
 * @property {number} zAxis - Z轴加速度值，单位m/s²
 */

/**
 * 监听设备加速度感应器参数
 * @typedef {Object} AccelerometerOption
 * @property {number} [frequency] - 更新加速度信息间隔时间，单位ms，默认值为500ms
 */

/**
 * 获取设备加速度信息成功的回调函数
 * @callback AccelerometerSuccessCallback
 * @param {Acceleration} acceleration - 设备的加速度信息
 */

/**
 * 获取设备加速度信息失败的回调函数
 * @callback AccelerometerErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Accelerometer模块类
 */
class AccelerometerModule {
    constructor() {
        this.activeWatchers = new Map(); // 存储活跃的监听器
    }

    /**
     * 获取当前设备的加速度信息
     * @param {AccelerometerSuccessCallback} successCB - 获取设备加速度信息成功回调函数
     * @param {AccelerometerErrorCallback} [errorCB] - 获取设备加速度信息失败回调函数
     * @throws {Error} 如果设备不支持加速度传感器或参数错误
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const acceleration = await accelerometer.getCurrentAcceleration();
     *   console.log('X轴:', acceleration.xAxis);
     *   console.log('Y轴:', acceleration.yAxis);
     *   console.log('Z轴:', acceleration.zAxis);
     * } catch (error) {
     *   console.error('获取加速度失败:', error);
     * }
     *
     * // 回调方式调用
     * accelerometer.getCurrentAcceleration(
     *   (acceleration) => {
     *     console.log('X轴:', acceleration.xAxis);
     *     console.log('Y轴:', acceleration.yAxis);
     *     console.log('Z轴:', acceleration.zAxis);
     *   },
     *   (error) => {
     *     console.error('获取加速度失败:', error.message);
     *   }
     * );
     * ```
     */
    getCurrentAcceleration(successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.getCurrentAcceleration(resolve, reject);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查加速度传感器是否可用
            if (!plus.accelerometer) {
                throw new Error('设备不支持加速度传感器');
            }

            // 调用原生API
            plus.accelerometer.getCurrentAcceleration(
                (acceleration) => {
                    // 原生返回的Acceleration对象，直接传递给回调
                    successCB(acceleration);
                },
                (error) => {
                    if (errorCB) {
                        errorCB(error);
                    }
                }
            );
        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 监听设备加速度变化信息
     * @param {AccelerometerSuccessCallback} successCB - 成功回调函数
     * @param {AccelerometerErrorCallback} [errorCB] - 失败回调函数
     * @param {AccelerometerOption} [option] - 加速度信息参数
     * @returns {number|Promise<number>} 用于标识加速度信息监听器，可通过clearWatch方法取消监听
     * @throws {Error} 如果设备不支持加速度传感器或参数错误
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const watchId = await accelerometer.watchAcceleration(
     *     (acceleration) => {
     *       console.log('X轴:', acceleration.xAxis);
     *       console.log('Y轴:', acceleration.yAxis);
     *       console.log('Z轴:', acceleration.zAxis);
     *     },
     *     (error) => {
     *       console.error('监听失败:', error.message);
     *     },
     *     { frequency: 1000 } // 1秒更新一次
     *   );
     *   console.log('监听ID:', watchId);
     * } catch (error) {
     *   console.error('启动监听失败:', error);
     * }
     *
     * // 回调方式调用
     * const watchId = accelerometer.watchAcceleration(
     *   (acceleration) => {
     *     console.log('加速度变化:', acceleration);
     *   },
     *   (error) => {
     *     console.error('监听失败:', error);
     *   },
     *   { frequency: 500 }
     * );
     * ```
     */
    watchAcceleration(successCB, errorCB, option) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.watchAcceleration(successCB, reject, errorCB).then(resolve).catch(reject);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查加速度传感器是否可用
            if (!plus.accelerometer) {
                throw new Error('设备不支持加速度传感器');
            }

            // 检查回调函数
            if (typeof successCB !== 'function') {
                throw new Error('成功回调函数不能为空');
            }

            // 设置默认选项
            const options = option || {};
            if (!options.frequency || typeof options.frequency !== 'number') {
                options.frequency = 500; // 默认500ms
            }

            // 调用原生API
            const watchId = plus.accelerometer.watchAcceleration(
                (acceleration) => {
                    // 原生返回的Acceleration对象，直接传递给回调
                    successCB(acceleration);
                },
                (error) => {
                    if (errorCB) {
                        errorCB(error);
                    }
                },
                options
            );

            // 存储监听器信息
            this.activeWatchers.set(watchId, {
                successCB: successCB,
                errorCB: errorCB,
                option: options,
                startTime: Date.now()
            });

            return watchId;
        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: -1,
                    message: error.message
                });
                return -1;
            } else {
                throw error;
            }
        }
    }

    /**
     * 关闭监听设备加速度信息
     * @param {number} watchId - 需要取消的加速度监听器标识，调用watchAcceleration方法的返回值
     * @returns {Promise<void>|void}
     * @throws {Error} 如果参数错误或关闭失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await accelerometer.clearWatch(watchId);
     *   console.log('监听已关闭');
     * } catch (error) {
     *   console.error('关闭监听失败:', error);
     * }
     *
     * // 直接调用
     * accelerometer.clearWatch(watchId);
     * ```
     */
    clearWatch(watchId) {
        // 如果没有传入watchId，支持Promise方式
        if (typeof watchId === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('watchId参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查加速度传感器是否可用
            if (!plus.accelerometer) {
                throw new Error('设备不支持加速度传感器');
            }

            // 检查watchId是否有效
            if (typeof watchId !== 'number' || watchId < 0) {
                throw new Error('无效的watchId');
            }

            // 检查监听器是否存在
            if (!this.activeWatchers.has(watchId)) {
                // 即使不存在，也尝试调用原生API清理
                plus.accelerometer.clearWatch(watchId);
                return;
            }

            // 调用原生API
            plus.accelerometer.clearWatch(watchId);

            // 从活跃监听器中移除
            this.activeWatchers.delete(watchId);

        } catch (error) {
            throw error;
        }
    }

    /**
     * 判断设备是否支持加速度传感器
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await accelerometer.isSupported();
     * if (isSupported) {
     *   console.log('设备支持加速度传感器');
     * } else {
     *   console.log('设备不支持加速度传感器');
     * }
     * ```
     */
    isSupported() {
        return new Promise((resolve) => {
            try {
                if (typeof plus === 'undefined') {
                    resolve(false);
                    return;
                }

                resolve(!!plus.accelerometer);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的监听器信息
     * @returns {Array<Object>} 活跃监听器信息数组
     *
     * @example
     * ```javascript
     * const activeWatchers = accelerometer.getActiveWatchers();
     * console.log('活跃监听器数量:', activeWatchers.length);
     * activeWatchers.forEach(watcher => {
     *   console.log('监听器ID:', watcher.watchId, '运行时间:', watcher.runTime + 'ms');
     * });
     * ```
     */
    getActiveWatchers() {
        const watchers = [];
        const currentTime = Date.now();

        this.activeWatchers.forEach((watcher, watchId) => {
            watchers.push({
                watchId: watchId,
                option: watcher.option,
                startTime: watcher.startTime,
                runTime: currentTime - watcher.startTime
            });
        });

        return watchers;
    }

    /**
     * 关闭所有活跃的监听器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await accelerometer.clearAllWatches();
     * console.log('所有监听器已关闭');
     * ```
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
}

// 创建Accelerometer模块实例
const accelerometer = new AccelerometerModule();

// 导出模块
export default accelerometer;

// 也可以导出类以便创建多个实例
export { AccelerometerModule };