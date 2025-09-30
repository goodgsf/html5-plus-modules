/**
 * HTML5+ Events 模块 ES Module 封装
 *
 * 该模块提供了系统事件监听功能，支持应用生命周期事件、网络状态变化等
 * 遵循HTML5+官方API规范
 */

/**
 * 事件类型常量
 */
export const EventType = {
    PLUS_READY: 'plusready',           // HTML5+环境准备完成事件
    PAUSE: 'pause',                   // 应用进入后台事件
    RESUME: 'resume',                 // 应用恢复前台事件
    NET_CHANGE: 'netchange',           // 网络状态变化事件
    NEW_INTENT: 'newintent',          // 新意图事件
    PLUS_SCROLL_BOTTOM: 'plusscrollbottom', // 滚动到底部事件
    ERROR: 'error',                   // 错误事件
    BACKGROUND: 'background',         // 应用进入后台事件
    FOREGROUND: 'foreground',         // 应用恢复前台事件
    TRIM_MEMORY: 'trimmemory',        // 内存不足事件
    SPLASH_CLOSED: 'splashclosed',    // 启动界面关闭事件
    KEYBOARD_CHANGE: 'keyboardchange', // 虚拟键盘状态变化事件
    UI_STYLE_CHANGE: 'uistylechange'  // 系统UI风格变化事件
};

/**
 * 网络连接类型常量
 */
export const NetworkType = {
    UNKNOWN: 'unknown',     // 未知网络
    ETHERNET: 'ethernet',   // 以太网
    WIFI: 'wifi',          // WiFi网络
    CELLULAR_2G: '2g',     // 2G网络
    CELLULAR_3G: '3g',     // 3G网络
    CELLULAR_4G: '4g',     // 4G网络
    CELLULAR_5G: '5g',     // 5G网络
    NONE: 'none'           // 无网络连接
};

/**
 * 事件监听器回调函数
 * @callback EventListenerCallback
 * @param {Event} event - 事件对象
 */

/**
 * 事件对象
 * @typedef {Object} Event
 * @property {string} type - 事件类型
 * @property {any} [target] - 事件目标对象
 * @property {any} [currentTarget] - 当前处理事件的对象
 * @property {boolean} [bubbles] - 事件是否冒泡
 * @property {boolean} [cancelable] - 事件是否可取消
 * @property {any} [detail] - 事件详细信息
 */

/**
 * 网络状态变化事件
 * @typedef {Object} NetworkChangeEvent
 * @property {string} type - 事件类型（"netchange"）
 * @property {boolean} connected - 是否连接网络
 * @property {string} type - 网络类型
 */

/**
 * 键盘状态变化事件
 * @typedef {Object} KeyboardChangeEvent
 * @property {string} type - 事件类型（"keyboardchange"）
 * @property {boolean} keyboardVisible - 虚拟键盘是否可见
 * @property {number} keyboardHeight - 虚拟键盘高度
 */

/**
 * UI风格变化事件
 * @typedef {Object} UIStyleChangeEvent
 * @property {string} type - 事件类型（"uistylechange"）
 * @property {string} uiStyle - UI风格类型
 */

/**
 * 错误事件
 * @typedef {Object} ErrorEvent
 * @property {string} type - 事件类型（"error"）
 * @property {string} message - 错误消息
 * @property {number} code - 错误代码
 */

/**
 * Events模块类
 */
class EventsModule {
    constructor() {
        this.listeners = new Map(); // 存储事件监听器
        this.onceListeners = new Map(); // 存储一次性事件监听器
        this.networkState = null; // 当前网络状态
        this.isInitialized = false; // 是否已初始化
    }

    /**
     * 初始化事件模块
     * @returns {Promise<void>}
     * @private
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 监听系统事件
            this.setupSystemEvents();

            this.isInitialized = true;

        } catch (error) {
            console.error('Events模块初始化失败:', error);
            throw error;
        }
    }

    /**
     * 设置系统事件监听
     * @private
     */
    setupSystemEvents() {
        // 监听网络状态变化
        document.addEventListener(EventType.NET_CHANGE, (event) => {
            this.networkState = this.getCurrentNetworkState();
            this.emit(EventType.NET_CHANGE, this.networkState);
        });

        // 监听键盘状态变化
        document.addEventListener(EventType.KEYBOARD_CHANGE, (event) => {
            const keyboardState = {
                keyboardVisible: event.keyboardVisible,
                keyboardHeight: event.keyboardHeight
            };
            this.emit(EventType.KEYBOARD_CHANGE, keyboardState);
        });

        // 监听UI风格变化
        document.addEventListener(EventType.UI_STYLE_CHANGE, (event) => {
            const uiStyleState = {
                uiStyle: event.uiStyle
            };
            this.emit(EventType.UI_STYLE_CHANGE, uiStyleState);
        });

        // 监听应用生命周期事件
        document.addEventListener(EventType.PAUSE, () => {
            this.emit(EventType.PAUSE, {});
        });

        document.addEventListener(EventType.RESUME, () => {
            this.emit(EventType.RESUME, {});
        });

        document.addEventListener(EventType.BACKGROUND, () => {
            this.emit(EventType.BACKGROUND, {});
        });

        document.addEventListener(EventType.FOREGROUND, () => {
            this.emit(EventType.FOREGROUND, {});
        });

        // 监听错误事件
        document.addEventListener(EventType.ERROR, (event) => {
            const errorState = {
                message: event.message,
                code: event.code
            };
            this.emit(EventType.ERROR, errorState);
        });
    }

    /**
     * 添加事件监听器
     * @param {string} type - 事件类型
     * @param {EventListenerCallback} listener - 事件监听器函数
     * @param {boolean} [useCapture] - 是否在捕获阶段处理事件
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await events.addEventListener('plusready', (event) => {
     *     console.log('HTML5+环境准备完成');
     *   });
     *   console.log('事件监听器添加成功');
     * } catch (error) {
     *   console.error('添加事件监听器失败:', error);
     * }
     * ```
     */
    addEventListener(type, listener, useCapture = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof listener !== 'function') {
                    throw new Error('监听器必须是函数');
                }

                // 检查事件类型是否支持
                if (!this.isEventTypeSupported(type)) {
                    throw new Error(`不支持的事件类型: ${type}`);
                }

                // 添加到原生事件监听
                document.addEventListener(type, listener, useCapture);

                // 存储监听器引用
                if (!this.listeners.has(type)) {
                    this.listeners.set(type, new Set());
                }
                this.listeners.get(type).add(listener);

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 添加一次性事件监听器
     * @param {string} type - 事件类型
     * @param {EventListenerCallback} listener - 事件监听器函数
     * @param {boolean} [useCapture] - 是否在捕获阶段处理事件
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await events.addOnceEventListener('splashclosed', (event) => {
     *     console.log('启动界面关闭');
     *   });
     *   console.log('一次性事件监听器添加成功');
     * } catch (error) {
     *   console.error('添加一次性事件监听器失败:', error);
     * }
     * ```
     */
    addOnceEventListener(type, listener, useCapture = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof listener !== 'function') {
                    throw new Error('监听器必须是函数');
                }

                // 检查事件类型是否支持
                if (!this.isEventTypeSupported(type)) {
                    throw new Error(`不支持的事件类型: ${type}`);
                }

                // 创建一次性监听器包装器
                const onceWrapper = (event) => {
                    listener(event);
                    this.removeEventListener(type, onceWrapper, useCapture);
                };

                // 添加到原生事件监听
                document.addEventListener(type, onceWrapper, useCapture);

                // 存储监听器引用
                if (!this.onceListeners.has(type)) {
                    this.onceListeners.set(type, new Set());
                }
                this.onceListeners.get(type).add(onceWrapper);

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 移除事件监听器
     * @param {string} type - 事件类型
     * @param {EventListenerCallback} listener - 事件监听器函数
     * @param {boolean} [useCapture] - 是否在捕获阶段处理事件
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await events.removeEventListener('netchange', networkListener);
     *   console.log('事件监听器移除成功');
     * } catch (error) {
     *   console.error('移除事件监听器失败:', error);
     * }
     * ```
     */
    removeEventListener(type, listener, useCapture = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof listener !== 'function') {
                    throw new Error('监听器必须是函数');
                }

                // 从原生事件监听中移除
                document.removeEventListener(type, listener, useCapture);

                // 从存储中移除
                if (this.listeners.has(type)) {
                    this.listeners.get(type).delete(listener);
                }

                if (this.onceListeners.has(type)) {
                    this.onceListeners.get(type).delete(listener);
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 分发自定义事件
     * @param {string} type - 事件类型
     * @param {any} data - 事件数据
     * @returns {Promise<void>}
     * @private
     */
    emit(type, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const event = {
                    type: type,
                    detail: data,
                    bubbles: true,
                    cancelable: true,
                    timestamp: Date.now()
                };

                // 通知所有监听器
                if (this.listeners.has(type)) {
                    this.listeners.get(type).forEach(listener => {
                        try {
                            listener(event);
                        } catch (error) {
                            console.error(`事件监听器执行错误 (${type}):`, error);
                        }
                    });
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前网络状态
     * @returns {Promise<Object>} 网络状态对象
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const networkState = await events.getCurrentNetworkState();
     *   console.log('网络类型:', networkState.type);
     *   console.log('是否连接:', networkState.connected);
     * } catch (error) {
     *   console.error('获取网络状态失败:', error);
     * }
     * ```
     */
    getCurrentNetworkState() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let networkType = NetworkType.UNKNOWN;
                let connected = false;

                try {
                    // 检查HTML5+环境是否可用
                    if (typeof plus !== 'undefined' && plus.networkinfo) {
                        networkType = plus.networkinfo.getCurrentType();
                        connected = networkType !== NetworkType.NONE;
                    } else {
                        // 浏览器环境下的网络状态检测
                        if (navigator.onLine) {
                            connected = true;
                            // 简单的网络类型检测
                            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                            if (connection) {
                                const effectiveType = connection.effectiveType;
                                if (effectiveType === '4g') {
                                    networkType = NetworkType.CELLULAR_4G;
                                } else if (effectiveType === '3g') {
                                    networkType = NetworkType.CELLULAR_3G;
                                } else if (effectiveType === '2g') {
                                    networkType = NetworkType.CELLULAR_2G;
                                } else {
                                    networkType = NetworkType.WIFI;
                                }
                            } else {
                                networkType = NetworkType.WIFI;
                            }
                        } else {
                            networkType = NetworkType.NONE;
                        }
                    }
                } catch (error) {
                    networkType = NetworkType.UNKNOWN;
                    connected = false;
                }

                const networkState = {
                    type: networkType,
                    connected: connected,
                    timestamp: Date.now()
                };

                this.networkState = networkState;
                resolve(networkState);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前键盘状态
     * @returns {Promise<Object>} 键盘状态对象
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const keyboardState = await events.getCurrentKeyboardState();
     *   console.log('键盘是否可见:', keyboardState.keyboardVisible);
     *   console.log('键盘高度:', keyboardState.keyboardHeight);
     * } catch (error) {
     *   console.error('获取键盘状态失败:', error);
     * }
     * ```
     */
    getCurrentKeyboardState() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let keyboardVisible = false;
                let keyboardHeight = 0;

                try {
                    // 检查HTML5+环境是否可用
                    if (typeof plus !== 'undefined' && plus.key) {
                        keyboardVisible = plus.key.isVisible();
                        keyboardHeight = plus.key.getHeight();
                    }
                } catch (error) {
                    // 默认值
                    keyboardVisible = false;
                    keyboardHeight = 0;
                }

                const keyboardState = {
                    keyboardVisible: keyboardVisible,
                    keyboardHeight: keyboardHeight,
                    timestamp: Date.now()
                };

                resolve(keyboardState);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前UI风格
     * @returns {Promise<Object>} UI风格对象
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const uiStyle = await events.getCurrentUIStyle();
     *   console.log('UI风格:', uiStyle.uiStyle);
     * } catch (error) {
     *   console.error('获取UI风格失败:', error);
     * }
     * ```
     */
    getCurrentUIStyle() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let uiStyle = 'light';

                try {
                    // 检查HTML5+环境是否可用
                    if (typeof plus !== 'undefined' && plus.os) {
                        // 简单的UI风格检测
                        if (plus.os.name === 'iOS') {
                            uiStyle = 'ios';
                        } else if (plus.os.name === 'Android') {
                            uiStyle = 'android';
                        }
                    }
                } catch (error) {
                    // 默认值
                    uiStyle = 'light';
                }

                const uiStyleState = {
                    uiStyle: uiStyle,
                    timestamp: Date.now()
                };

                resolve(uiStyleState);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 等待特定事件
     * @param {string} type - 事件类型
     * @param {number} [timeout] - 超时时间（毫秒）
     * @returns {Promise<Event>} 事件对象
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const event = await events.waitForEvent('plusready', 5000);
     *   console.log('等待到事件:', event.type);
     * } catch (error) {
     *   console.error('等待事件超时:', error);
     * }
     * ```
     */
    waitForEvent(type, timeout = 30000) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!this.isEventTypeSupported(type)) {
                    throw new Error(`不支持的事件类型: ${type}`);
                }

                let timer = null;
                let listener = null;

                // 设置超时
                if (timeout > 0) {
                    timer = setTimeout(() => {
                        if (listener) {
                            this.removeEventListener(type, listener);
                        }
                        reject(new Error(`等待事件超时: ${type}`));
                    }, timeout);
                }

                // 添加监听器
                listener = (event) => {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    resolve(event);
                };

                await this.addEventListener(type, listener);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 等待HTML5+环境准备完成
     * @param {number} [timeout] - 超时时间（毫秒）
     * @returns {Promise<Event>} 事件对象
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await events.waitForPlusReady(5000);
     *   console.log('HTML5+环境已准备完成');
     * } catch (error) {
     *   console.error('HTML5+环境准备超时:', error);
     * }
     * ```
     */
    waitForPlusReady(timeout = 30000) {
        return this.waitForEvent(EventType.PLUS_READY, timeout);
    }

    /**
     * 移除所有事件监听器
     * @param {string} [type] - 事件类型，如果为空则移除所有监听器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await events.removeAllEventListeners('netchange');
     *   console.log('所有网络变化事件监听器已移除');
     * } catch (error) {
     *   console.error('移除事件监听器失败:', error);
     * }
     * ```
     */
    removeAllEventListeners(type) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (type) {
                    // 移除特定类型的所有监听器
                    if (this.listeners.has(type)) {
                        const listeners = this.listeners.get(type);
                        listeners.forEach(listener => {
                            document.removeEventListener(type, listener);
                        });
                        this.listeners.delete(type);
                    }

                    if (this.onceListeners.has(type)) {
                        const onceListeners = this.onceListeners.get(type);
                        onceListeners.forEach(listener => {
                            document.removeEventListener(type, listener);
                        });
                        this.onceListeners.delete(type);
                    }
                } else {
                    // 移除所有监听器
                    this.listeners.forEach((listeners, eventType) => {
                        listeners.forEach(listener => {
                            document.removeEventListener(eventType, listener);
                        });
                    });
                    this.listeners.clear();

                    this.onceListeners.forEach((listeners, eventType) => {
                        listeners.forEach(listener => {
                            document.removeEventListener(eventType, listener);
                        });
                    });
                    this.onceListeners.clear();
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 检查事件类型是否支持
     * @param {string} type - 事件类型
     * @returns {boolean} 是否支持
     * @private
     */
    isEventTypeSupported(type) {
        const supportedEvents = [
            EventType.PLUS_READY,
            EventType.PAUSE,
            EventType.RESUME,
            EventType.NET_CHANGE,
            EventType.NEW_INTENT,
            EventType.PLUS_SCROLL_BOTTOM,
            EventType.ERROR,
            EventType.BACKGROUND,
            EventType.FOREGROUND,
            EventType.TRIM_MEMORY,
            EventType.SPLASH_CLOSED,
            EventType.KEYBOARD_CHANGE,
            EventType.UI_STYLE_CHANGE
        ];

        return supportedEvents.includes(type);
    }

    /**
     * 获取事件类型名称
     * @param {string} type - 事件类型常量
     * @returns {string} 事件类型名称
     *
     * @example
     * ```javascript
     * const typeName = events.getEventTypeName('plusready');
     * console.log('事件类型:', typeName); // 输出: HTML5+环境准备完成事件
     * ```
     */
    getEventTypeName(type) {
        const typeNames = {
            [EventType.PLUS_READY]: 'HTML5+环境准备完成事件',
            [EventType.PAUSE]: '应用进入后台事件',
            [EventType.RESUME]: '应用恢复前台事件',
            [EventType.NET_CHANGE]: '网络状态变化事件',
            [EventType.NEW_INTENT]: '新意图事件',
            [EventType.PLUS_SCROLL_BOTTOM]: '滚动到底部事件',
            [EventType.ERROR]: '错误事件',
            [EventType.BACKGROUND]: '应用进入后台事件',
            [EventType.FOREGROUND]: '应用恢复前台事件',
            [EventType.TRIM_MEMORY]: '内存不足事件',
            [EventType.SPLASH_CLOSED]: '启动界面关闭事件',
            [EventType.KEYBOARD_CHANGE]: '虚拟键盘状态变化事件',
            [EventType.UI_STYLE_CHANGE]: '系统UI风格变化事件'
        };

        return typeNames[type] || '未知事件类型';
    }

    /**
     * 获取网络类型名称
     * @param {string} type - 网络类型常量
     * @returns {string} 网络类型名称
     *
     * @example
     * ```javascript
     * const typeName = events.getNetworkTypeName('wifi');
     * console.log('网络类型:', typeName); // 输出: WiFi网络
     * ```
     */
    getNetworkTypeName(type) {
        const typeNames = {
            [NetworkType.UNKNOWN]: '未知网络',
            [NetworkType.ETHERNET]: '以太网',
            [NetworkType.WIFI]: 'WiFi网络',
            [NetworkType.CELLULAR_2G]: '2G网络',
            [NetworkType.CELLULAR_3G]: '3G网络',
            [NetworkType.CELLULAR_4G]: '4G网络',
            [NetworkType.CELLULAR_5G]: '5G网络',
            [NetworkType.NONE]: '无网络连接'
        };

        return typeNames[type] || '未知网络类型';
    }

    /**
     * 判断设备是否支持事件功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const isSupported = await events.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持事件功能');
     *   } else {
     *     console.log('设备不支持事件功能');
     *   }
     * } catch (error) {
     *   console.error('检查事件支持失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise((resolve) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined') {
                    resolve(false);
                    return;
                }

                // 检查基础事件支持
                resolve(typeof document.addEventListener === 'function');
            } catch (error) {
                resolve(false);
            }
        });
    }
}

// 创建Events模块实例
const events = new EventsModule();

// 导出模块
export default events;

// 导出常量
export { EventType, NetworkType };

// 也可以导出类以便创建多个实例
export { EventsModule };