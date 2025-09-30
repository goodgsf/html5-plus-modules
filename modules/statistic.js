/**
 * HTML5+ Statistic 模块 ES Module 封装
 *
 * 该模块提供了统计功能管理，包括触发事件、持续事件统计等
 * 遵循HTML5+官方API规范
 */

/**
 * 统计错误码常量
 */
export const StatisticErrorCode = {
    NOT_AVAILABLE: 1001,      // 统计功能不可用
    INVALID_EVENT_ID: 1002,  // 无效的事件ID
    INVALID_DURATION: 1003,   // 无效的持续时间
    INVALID_DATA: 1004,       // 无效的数据
    EVENT_TOO_LONG: 1005,    // 事件ID过长
    DATA_TOO_LONG: 1006,      // 数据过长
    TOO_MANY_KEYS: 1007,     // 键值对过多
    KEY_TOO_LONG: 1008,      // 键过长
    VALUE_TOO_LONG: 1009,    // 值过长
    PERMISSION_DENIED: 1010, // 权限被拒绝
    TIMEOUT: 1011,           // 操作超时
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * 统计事件数据
 * @typedef {Object} StatisticEventData
 * @property {string} id - 事件ID
 * @property {Object|string} [data] - 事件数据
 * @property {number} [duration] - 持续时间（毫秒）
 * @property {string} [label] - 事件标签
 */

/**
 * 统计事件选项
 * @typedef {Object} StatisticOptions
 * @property {string} id - 事件ID
 * @property {Object|string} [data] - 事件数据
 * @property {number} [duration] - 持续时间（毫秒）
 * @property {string} [label] - 事件标签
 */

/**
 * 统计事件回调函数
 * @callback StatisticCallback
 * @param {Error} [error] - 错误信息
 */

/**
 * HTML5+ Statistic 模块类
 */
class StatisticModule {
    constructor() {
        this.moduleName = 'Statistic';
        this._events = new Map();
        this._eventTimers = new Map();
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
        this._eventQueue = [];
        this._isProcessing = false;
    }

    /**
     * 初始化Statistic模块
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
                if (typeof plus === 'undefined' || !plus.statistic) {
                    // 浏览器环境使用模拟统计功能
                    this._browserSupport = true;
                    console.log('Statistic模块将在浏览器环境中使用模拟统计功能');
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Statistic模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 触发统计事件
     * @param {string} id - 事件ID
     * @param {Object|string} [data] - 事件数据
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 触发简单事件
     * await statistic.eventTrig('button_click');
     *
     * // 触发带数据的事件
     * await statistic.eventTrig('purchase', {
     *   type: 'book',
     *   quantity: 3,
     *   price: 29.99
     * });
     *
     * // 使用字符串数据
     * await statistic.eventTrig('page_view', 'home_page');
     * ```
     */
    eventTrig(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id || typeof id !== 'string') {
                    throw new Error('id参数必须是非空字符串');
                }

                // 验证事件ID
                this._validateEventId(id);

                // 验证数据
                const normalizedData = this._normalizeEventData(data);

                if (typeof plus !== 'undefined' && plus.statistic) {
                    // HTML5+环境
                    plus.statistic.eventTrig(id, normalizedData);
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用模拟统计
                    this._eventTrigBrowser(id, normalizedData);
                    resolve();
                } else {
                    throw new Error('设备不支持统计功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中触发事件
     * @private
     */
    _eventTrigBrowser(id, data) {
        try {
            // 在浏览器环境中，我们将事件存储到队列中
            const event = {
                id,
                data,
                timestamp: Date.now(),
                type: 'trigger'
            };

            this._eventQueue.push(event);
            this._processEventQueue();

            // 如果配置了调试模式，输出事件信息
            if (this._debugMode) {
                console.log('[Statistic] Event triggered:', event);
            }

            // 触发自定义事件
            this._emitCustomEvent('statistic:event', event);

        } catch (error) {
            console.error('浏览器环境事件触发失败:', error);
        }
    }

    /**
     * 精确持续事件统计
     * @param {string} id - 事件ID
     * @param {number} duration - 持续时间（毫秒）
     * @param {Object|string} [data] - 事件数据
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 统计音乐播放时长
     * await statistic.eventDuration('music_play', 120000, {
     *   type: 'pop',
     *   artist: 'JJLin'
     * });
     *
     * // 统计页面停留时间
     * await statistic.eventDuration('page_stay', 5000, 'product_detail');
     * ```
     */
    eventDuration(id, duration, data) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id || typeof id !== 'string') {
                    throw new Error('id参数必须是非空字符串');
                }

                if (typeof duration !== 'number' || duration < 0) {
                    throw new Error('duration参数必须是大于等于0的数字');
                }

                // 验证事件ID
                this._validateEventId(id);

                // 验证持续时间范围
                if (duration > 2147483647) {
                    throw new Error('duration参数不能超过2147483647毫秒');
                }

                // 验证数据
                const normalizedData = this._normalizeEventData(data);

                if (typeof plus !== 'undefined' && plus.statistic) {
                    // HTML5+环境
                    plus.statistic.eventDuration(id, duration, normalizedData);
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用模拟统计
                    this._eventDurationBrowser(id, duration, normalizedData);
                    resolve();
                } else {
                    throw new Error('设备不支持统计功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中处理持续事件
     * @private
     */
    _eventDurationBrowser(id, duration, data) {
        try {
            const event = {
                id,
                duration,
                data,
                timestamp: Date.now(),
                type: 'duration'
            };

            this._eventQueue.push(event);
            this._processEventQueue();

            if (this._debugMode) {
                console.log('[Statistic] Duration event:', event);
            }

            this._emitCustomEvent('statistic:duration', event);

        } catch (error) {
            console.error('浏览器环境持续事件处理失败:', error);
        }
    }

    /**
     * 开始持续事件（过期API，不推荐使用）
     * @param {string} id - 事件ID
     * @param {string} [label] - 事件标签
     * @returns {Promise<void>}
     *
     * @deprecated 建议使用eventDuration方法
     *
     * @example
     * ```javascript
     * // 开始事件
     * await statistic.eventStart('video_play', 'tutorial');
     *
     * // 稍后结束事件
     * await statistic.eventEnd('video_play', 'tutorial');
     * ```
     */
    eventStart(id, label) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id || typeof id !== 'string') {
                    throw new Error('id参数必须是非空字符串');
                }

                // 验证事件ID
                this._validateEventId(id);

                const startTime = Date.now();
                const eventKey = label ? `${id}_${label}` : id;

                // 检查是否已经有同名事件在进行中
                if (this._eventTimers.has(eventKey)) {
                    throw new Error(`事件 "${eventKey}" 已经在进行中`);
                }

                if (typeof plus !== 'undefined' && plus.statistic) {
                    // HTML5+环境
                    plus.statistic.eventStart(id, label);
                    this._eventTimers.set(eventKey, startTime);
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用模拟统计
                    this._eventStartBrowser(id, label, startTime);
                    resolve();
                } else {
                    throw new Error('设备不支持统计功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中开始持续事件
     * @private
     */
    _eventStartBrowser(id, label, startTime) {
        try {
            const eventKey = label ? `${id}_${label}` : id;
            this._eventTimers.set(eventKey, startTime);

            const event = {
                id,
                label,
                startTime,
                timestamp: Date.now(),
                type: 'start'
            };

            this._eventQueue.push(event);
            this._processEventQueue();

            if (this._debugMode) {
                console.log('[Statistic] Event started:', event);
            }

            this._emitCustomEvent('statistic:start', event);

        } catch (error) {
            console.error('浏览器环境事件开始失败:', error);
        }
    }

    /**
     * 结束持续事件（过期API，不推荐使用）
     * @param {string} id - 事件ID
     * @param {string} [label] - 事件标签
     * @returns {Promise<number>} 持续时间（毫秒）
     *
     * @deprecated 建议使用eventDuration方法
     *
     * @example
     * ```javascript
     * // 结束事件并获取持续时间
     * const duration = await statistic.eventEnd('video_play', 'tutorial');
     * console.log('视频播放时长:', duration, '毫秒');
     * ```
     */
    eventEnd(id, label) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id || typeof id !== 'string') {
                    throw new Error('id参数必须是非空字符串');
                }

                const eventKey = label ? `${id}_${label}` : id;
                const startTime = this._eventTimers.get(eventKey);

                if (!startTime) {
                    throw new Error(`未找到正在进行的 "${eventKey}" 事件`);
                }

                const duration = Date.now() - startTime;

                if (typeof plus !== 'undefined' && plus.statistic) {
                    // HTML5+环境
                    plus.statistic.eventEnd(id, label);
                    this._eventTimers.delete(eventKey);
                    resolve(duration);
                } else if (this._browserSupport) {
                    // 浏览器环境使用模拟统计
                    this._eventEndBrowser(id, label, startTime, duration);
                    this._eventTimers.delete(eventKey);
                    resolve(duration);
                } else {
                    throw new Error('设备不支持统计功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中结束持续事件
     * @private
     */
    _eventEndBrowser(id, label, startTime, duration) {
        try {
            const event = {
                id,
                label,
                startTime,
                duration,
                endTime: Date.now(),
                timestamp: Date.now(),
                type: 'end'
            };

            this._eventQueue.push(event);
            this._processEventQueue();

            if (this._debugMode) {
                console.log('[Statistic] Event ended:', event);
            }

            this._emitCustomEvent('statistic:end', event);

        } catch (error) {
            console.error('浏览器环境事件结束失败:', error);
        }
    }

    /**
     * 验证事件ID
     * @private
     */
    _validateEventId(id) {
        if (id.length > 128) {
            throw new Error('事件ID长度不能超过128个字节');
        }

        // 检查特殊字符
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
        if (invalidChars.test(id)) {
            throw new Error('事件ID不能包含特殊字符');
        }
    }

    /**
     * 标准化事件数据
     * @private
     */
    _normalizeEventData(data) {
        if (data === undefined || data === null) {
            return undefined;
        }

        if (typeof data === 'string') {
            if (data.length > 256) {
                throw new Error('字符串数据长度不能超过256个字节');
            }
            return data;
        }

        if (typeof data === 'object') {
            const keys = Object.keys(data);
            if (keys.length > 10) {
                throw new Error('键值对数据不能超过10个键');
            }

            const normalizedData = {};
            for (const [key, value] of Object.entries(data)) {
                // 验证key
                if (key.length > 128) {
                    throw new Error('键长度不能超过128个字节');
                }

                // 验证value
                const stringValue = String(value);
                if (stringValue.length > 256) {
                    throw new Error('值长度不能超过256个字节');
                }

                normalizedData[key] = stringValue;
            }

            return normalizedData;
        }

        throw new Error('数据必须是对象或字符串类型');
    }

    /**
     * 处理事件队列
     * @private
     */
    async _processEventQueue() {
        if (this._isProcessing || this._eventQueue.length === 0) {
            return;
        }

        this._isProcessing = true;

        try {
            while (this._eventQueue.length > 0) {
                const event = this._eventQueue.shift();
                await this._handleEvent(event);
            }
        } catch (error) {
            console.error('处理事件队列时出错:', error);
        } finally {
            this._isProcessing = false;
        }
    }

    /**
     * 处理单个事件
     * @private
     */
    async _handleEvent(event) {
        try {
            // 这里可以添加自定义的事件处理逻辑
            // 例如发送到分析服务器、存储到本地等

            if (this._eventHandlers) {
                for (const handler of this._eventHandlers) {
                    try {
                        await handler(event);
                    } catch (error) {
                        console.error('事件处理器执行失败:', error);
                    }
                }
            }
        } catch (error) {
            console.error('处理事件失败:', error);
        }
    }

    /**
     * 发送自定义事件
     * @private
     */
    _emitCustomEvent(eventName, data) {
        if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
            try {
                const event = new CustomEvent(eventName, {
                    detail: data,
                    bubbles: true,
                    cancelable: true
                });
                window.dispatchEvent(event);
            } catch (error) {
                console.error('发送自定义事件失败:', error);
            }
        }
    }

    /**
     * 设置调试模式
     * @param {boolean} enabled - 是否启用调试模式
     *
     * @example
     * ```javascript
     * // 启用调试模式
     * statistic.setDebugMode(true);
     *
     * // 禁用调试模式
     * statistic.setDebugMode(false);
     * ```
     */
    setDebugMode(enabled) {
        this._debugMode = Boolean(enabled);
    }

    /**
     * 添加事件处理器
     * @param {function} handler - 事件处理器函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 添加事件处理器
     * await statistic.addEventListener((event) => {
     *   console.log('收到统计事件:', event);
     *   // 可以在这里发送到自己的分析服务器
     * });
     * ```
     */
    addEventListener(handler) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof handler !== 'function') {
                    throw new Error('handler参数必须是函数');
                }

                if (!this._eventHandlers) {
                    this._eventHandlers = new Set();
                }

                this._eventHandlers.add(handler);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 移除事件处理器
     * @param {function} handler - 事件处理器函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 移除事件处理器
     * await statistic.removeEventListener(eventHandler);
     * ```
     */
    removeEventListener(handler) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof handler !== 'function') {
                    throw new Error('handler参数必须是函数');
                }

                if (this._eventHandlers) {
                    this._eventHandlers.delete(handler);
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前事件队列状态
     * @returns {Promise<{queueLength: number, isProcessing: boolean}>} 队列状态
     *
     * @example
     * ```javascript
     * const status = await statistic.getQueueStatus();
     * console.log('队列长度:', status.queueLength);
     * console.log('是否正在处理:', status.isProcessing);
     * ```
     */
    getQueueStatus() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();
                resolve({
                    queueLength: this._eventQueue.length,
                    isProcessing: this._isProcessing
                });
            } catch (error) {
                resolve({
                    queueLength: 0,
                    isProcessing: false
                });
            }
        });
    }

    /**
     * 清空事件队列
     * @returns {Promise<number>} 清空的事件数量
     *
     * @example
     * ```javascript
     * const count = await statistic.clearQueue();
     * console.log('清空了', count, '个事件');
     * ```
     */
    clearQueue() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();
                const count = this._eventQueue.length;
                this._eventQueue.length = 0;
                resolve(count);
            } catch (error) {
                resolve(0);
            }
        });
    }

    /**
     * 获取当前活跃的持续事件
     * @returns {Promise<Array<{id: string, label: string, startTime: number}>>} 活跃事件列表
     *
     * @example
     * ```javascript
     * const activeEvents = await statistic.getActiveEvents();
     * console.log('活跃的持续事件:', activeEvents);
     * ```
     */
    getActiveEvents() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();
                const activeEvents = [];

                for (const [eventKey, startTime] of this._eventTimers.entries()) {
                    const [id, label] = eventKey.split('_', 1);
                    activeEvents.push({
                        id,
                        label: label || undefined,
                        startTime
                    });
                }

                resolve(activeEvents);
            } catch (error) {
                resolve([]);
            }
        });
    }

    /**
     * 判断设备是否支持统计功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await statistic.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持统计功能');
     *   } else {
     *     console.log('设备不支持统计功能');
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

                if (typeof plus !== 'undefined' && plus.statistic) {
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
}

// 创建Statistic模块实例
const statistic = new StatisticModule();

// 导出模块
export default statistic;

// 导出类和常量
export { StatisticModule, StatisticErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
statistic.StatisticModule = StatisticModule;
statistic.StatisticErrorCode = StatisticErrorCode;