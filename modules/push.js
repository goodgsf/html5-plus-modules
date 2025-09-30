/**
 * HTML5+ Push 模块 ES Module 封装
 *
 * 该模块提供了推送消息管理功能，包括在线/离线消息推送、本地消息创建、事件监听等
 * 遵循HTML5+官方API规范
 */

/**
 * 推送错误码常量
 */
export const PushErrorCode = {
    NOT_AVAILABLE: 1001,     // 推送服务不可用
    PERMISSION_DENIED: 1002, // 权限被拒绝
    TIMEOUT: 1003,           // 操作超时
    INVALID_CLIENT_INFO: 1004, // 客户端信息无效
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * 推送事件类型常量
 */
export const PushEventType = {
    RECEIVE: 'receive',       // 接收到推送消息事件
    CLICK: 'click'           // 点击推送消息事件
};

/**
 * 客户端推送标识信息
 * @typedef {Object} ClientInfo
 * @property {string} id - 推送通道标识
 * @property {string} token - 设备令牌
 * @property {string} clientid - 推送服务令牌
 * @property {string} appid - 第三方推送服务的应用标识
 * @property {string} appkey - 第三方推送服务器的应用键值
 */

/**
 * 推送消息对象
 * @typedef {Object} PushMessage
 * @property {string} title - 推送消息标题
 * @property {string} content - 推送消息内容
 * @property {Object|string} payload - 推送消息承载的数据
 * @property {Object} aps - Apple APNS推送协议数据（仅iOS）
 */

/**
 * 消息选项
 * @typedef {Object} MessageOptions
 * @property {string} appid - 要启动流应用的appid
 * @property {boolean} cover - 是否覆盖上一次提示的消息
 * @property {number} delay - 提示消息延迟显示的时间（秒）
 * @property {string} icon - 推送消息的图标
 * @property {string} sound - 推送消息的提示音
 * @property {string} title - 推送消息的标题
 * @property {string} subtitle - 推送消息的副标题
 * @property {Date} when - 消息上显示的提示时间
 */

/**
 * 客户端接收到推送消息的回调函数
 * @callback PushReceiveCallback
 * @param {string|PushMessage} message - 接收到的推送信息
 */

/**
 * 用户点击推送消息事件的回调函数
 * @callback PushClickCallback
 * @param {string|PushMessage} message - 用户点击的推送信息
 */

/**
 * 获取客户端推送标识信息成功的回调函数
 * @callback ClientInfoSuccessCallback
 * @param {ClientInfo} info - 客户端推送标识信息
 */

/**
 * 获取客户端推送标识信息失败的回调函数
 * @callback ClientInfoErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ Push 模块类
 */
class PushModule {
    constructor() {
        this.moduleName = 'Push';
        this._listeners = new Map();
        this._isInitialized = false;
        this._initPromise = null;
        this._autoNotification = true;
        this._clientInfo = null;
    }

    /**
     * 初始化Push模块
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
                if (typeof plus === 'undefined' || !plus.push) {
                    // 检查浏览器环境是否支持推送
                    if (typeof window !== 'undefined' && 'PushManager' in window) {
                        console.log('Push模块将在浏览器环境中使用PushManager API');
                    } else if (typeof window !== 'undefined' && 'Notification' in window) {
                        console.log('Push模块将在浏览器环境中使用Notification API');
                    } else {
                        console.warn('设备不支持推送功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Push模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 添加推送消息事件监听器
     * @param {string} event - 事件类型（'receive'或'click'）
     * @param {PushReceiveCallback|PushClickCallback} listener - 事件监听器回调函数
     * @param {boolean} [capture=false] - 是否捕获事件
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 监听接收消息事件
     * await push.addEventListener('receive', (message) => {
     *   console.log('收到推送消息:', message);
     * });
     *
     * // 监听点击消息事件
     * await push.addEventListener('click', (message) => {
     *   console.log('用户点击了消息:', message);
     * });
     * ```
     */
    addEventListener(event, listener, capture = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!event || typeof listener !== 'function') {
                    throw new Error('event和listener参数不能为空');
                }

                if (event !== PushEventType.RECEIVE && event !== PushEventType.CLICK) {
                    throw new Error(`不支持的事件类型: ${event}`);
                }

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    plus.push.addEventListener(event, (msg) => {
                        this._normalizeMessage(msg).then(normalizedMsg => {
                            listener(normalizedMsg);
                        }).catch(error => {
                            console.error('消息标准化失败:', error);
                            listener(msg);
                        });
                    }, capture);
                } else {
                    // 浏览器环境
                    this._addEventListenerBrowser(event, listener, capture);
                }

                // 保存监听器
                if (!this._listeners.has(event)) {
                    this._listeners.set(event, new Set());
                }
                this._listeners.get(event).add(listener);

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中添加事件监听器
     * @private
     */
    _addEventListenerBrowser(event, listener, capture) {
        if (event === PushEventType.CLICK) {
            // 浏览器环境下监听Notification点击
            if ('Notification' in window) {
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'notificationclick') {
                        listener(event.data.message);
                    }
                });
            }
        } else if (event === PushEventType.RECEIVE) {
            // 浏览器环境下监听推送消息
            if ('PushManager' in window) {
                navigator.serviceWorker.addEventListener('push', (event) => {
                    const message = event.data ? event.data.text() : '';
                    listener(message);
                });
            }
        }
    }

    /**
     * 清空所有推送消息
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await push.clear();
     * console.log('所有推送消息已清空');
     * ```
     */
    clear() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    plus.push.clear();
                } else {
                    // 浏览器环境 - 清空所有通知
                    if ('Notification' in window && Notification.permission === 'granted') {
                        // 尝试关闭所有通知（浏览器可能不支持）
                        console.warn('浏览器环境不支持清空所有推送消息');
                    }
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 创建本地消息
     * @param {string} content - 消息显示的内容
     * @param {Object|string} [payload] - 消息承载的数据
     * @param {MessageOptions} [options] - 创建消息的额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await push.createMessage('这是一个本地消息',
     *   { type: 'local', id: 123 },
     *   { title: '本地通知', delay: 5 }
     * );
     * ```
     */
    createMessage(content, payload = null, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!content) {
                    throw new Error('content参数不能为空');
                }

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    plus.push.createMessage(content, payload, options);
                } else {
                    // 浏览器环境使用Notification API
                    this._createMessageBrowser(content, payload, options);
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中创建本地消息
     * @private
     */
    _createMessageBrowser(content, payload, options) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notificationOptions = {
                body: content,
                data: payload || {},
                icon: options.icon || undefined,
                badge: options.icon || undefined,
                tag: payload ? String(payload.id || Date.now()) : undefined,
                renotify: !!options.cover,
                requireInteraction: false
            };

            if (options.title) {
                notificationOptions.title = options.title;
            }

            if (options.sound && options.sound !== 'none') {
                notificationOptions.sound = options.sound;
            }

            // 延迟显示
            if (options.delay && options.delay > 0) {
                setTimeout(() => {
                    new Notification(options.title || '推送消息', notificationOptions);
                }, options.delay * 1000);
            } else {
                new Notification(options.title || '推送消息', notificationOptions);
            }
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            // 请求权限
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this._createMessageBrowser(content, payload, options);
                }
            });
        }
    }

    /**
     * 获取所有推送消息
     * @returns {Promise<PushMessage[]>} 推送消息数组
     *
     * @example
     * ```javascript
     * const messages = await push.getAllMessages();
     * console.log('所有推送消息:', messages);
     * ```
     */
    getAllMessages() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    const messages = plus.push.getAllMessage();
                    const normalizedMessages = await Promise.all(
                        messages.map(msg => this._normalizeMessage(msg))
                    );
                    resolve(normalizedMessages);
                } else {
                    // 浏览器环境无法获取系统消息中心的消息列表
                    resolve([]);
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取客户端推送标识信息
     * @returns {Promise<ClientInfo>} 客户端推送标识信息
     *
     * @example
     * ```javascript
     * const clientInfo = await push.getClientInfo();
     * console.log('客户端信息:', clientInfo);
     * ```
     */
    getClientInfo() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (this._clientInfo) {
                    resolve(this._clientInfo);
                    return;
                }

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    const info = plus.push.getClientInfo();
                    this._clientInfo = this._normalizeClientInfo(info);
                    resolve(this._clientInfo);
                } else {
                    // 浏览器环境
                    const browserInfo = await this._getBrowserClientInfo();
                    this._clientInfo = browserInfo;
                    resolve(browserInfo);
                }

            } catch (error) {
                reject(new Error(`获取客户端信息失败: ${error.message}`));
            }
        });
    }

    /**
     * 异步获取客户端推送标识信息
     * @returns {Promise<ClientInfo>} 客户端推送标识信息
     *
     * @example
     * ```javascript
     * try {
     *   const clientInfo = await push.getClientInfoAsync();
     *   console.log('客户端信息:', clientInfo);
     * } catch (error) {
     *   console.error('获取失败:', error);
     * }
     * ```
     */
    getClientInfoAsync() {
        return this.getClientInfo();
    }

    /**
     * 在浏览器环境中获取客户端信息
     * @private
     */
    async _getBrowserClientInfo() {
        const clientInfo = {
            id: 'browser',
            token: '',
            clientid: '',
            appid: '',
            appkey: ''
        };

        try {
            // 尝试获取Service Worker注册信息
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    clientInfo.clientid = registration.scope;
                }
            }

            // 获取浏览器信息
            clientInfo.token = navigator.userAgent;

        } catch (error) {
            console.warn('获取浏览器客户端信息失败:', error);
        }

        return clientInfo;
    }

    /**
     * 设置程序是否将消息显示在系统消息中心
     * @param {boolean} notify - 是否自动提示推送消息
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 关闭自动显示
     * await push.setAutoNotification(false);
     *
     * // 开启自动显示
     * await push.setAutoNotification(true);
     * ```
     */
    setAutoNotification(notify) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                this._autoNotification = Boolean(notify);

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    plus.push.setAutoNotification(this._autoNotification);
                } else {
                    // 浏览器环境
                    console.log(`浏览器环境下自动通知设置为: ${this._autoNotification}`);
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 删除推送消息
     * @param {PushMessage} message - 要删除的消息对象
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * const messages = await push.getAllMessages();
     * if (messages.length > 0) {
     *   await push.remove(messages[0]);
     *   console.log('消息已删除');
     * }
     * ```
     */
    remove(message) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!message) {
                    throw new Error('message参数不能为空');
                }

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    plus.push.remove(message);
                } else {
                    // 浏览器环境 - 尝试关闭特定的通知
                    console.warn('浏览器环境不支持删除单条推送消息');
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 标准化消息数据
     * @private
     */
    async _normalizeMessage(message) {
        if (typeof message === 'string') {
            try {
                return JSON.parse(message);
            } catch {
                return {
                    content: message,
                    payload: message,
                    title: '',
                    aps: undefined
                };
            }
        }

        return {
            title: message.title || '',
            content: message.content || '',
            payload: message.payload || {},
            aps: message.aps
        };
    }

    /**
     * 标准化客户端信息
     * @private
     */
    _normalizeClientInfo(info) {
        return {
            id: info.id || '',
            token: info.token || '',
            clientid: info.clientid || '',
            appid: info.appid || '',
            appkey: info.appkey || ''
        };
    }

    /**
     * 判断设备是否支持推送功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await push.isSupported();
     * if (isSupported) {
     *   console.log('设备支持推送功能');
     * } else {
     *   console.log('设备不支持推送功能');
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.push) {
                    resolve(true);
                } else if ('PushManager' in window || 'Notification' in window) {
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
     * 检查推送权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * const permission = await push.checkPermission();
     * console.log('权限状态:', permission);
     * ```
     */
    checkPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    resolve('granted');
                } else if ('Notification' in window) {
                    // 浏览器环境
                    resolve(Notification.permission);
                } else if ('permissions' in navigator) {
                    // 使用Permissions API
                    const permission = await navigator.permissions.query({ name: 'notifications' });
                    resolve(permission.state);
                } else {
                    resolve('prompt');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求推送权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * const permission = await push.requestPermission();
     * if (permission === 'granted') {
     *   console.log('权限已授予');
     * } else {
     *   console.log('权限被拒绝');
     * }
     * ```
     */
    requestPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.push) {
                    // HTML5+环境
                    resolve('granted');
                } else if ('Notification' in window) {
                    // 浏览器环境
                    const permission = await Notification.requestPermission();
                    resolve(permission);
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前自动通知设置状态
     * @returns {boolean} 是否自动显示推送消息
     *
     * @example
     * ```javascript
     * const autoNotification = push.getAutoNotificationStatus();
     * console.log('自动通知状态:', autoNotification);
     * ```
     */
    getAutoNotificationStatus() {
        return this._autoNotification;
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件类型
     * @param {Function} listener - 监听器函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * function messageHandler(message) {
     *   console.log('收到消息:', message);
     * }
     *
     * // 添加监听器
     * await push.addEventListener('receive', messageHandler);
     *
     * // 移除监听器
     * await push.removeEventListener('receive', messageHandler);
     * ```
     */
    removeEventListener(event, listener) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!event || typeof listener !== 'function') {
                    throw new Error('event和listener参数不能为空');
                }

                if (this._listeners.has(event)) {
                    this._listeners.get(event).delete(listener);
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Push模块实例
const push = new PushModule();

// 导出模块
export default push;

// 导出类和常量
export { PushModule, PushErrorCode, PushEventType };

// 为了兼容性，也导出类作为默认导出的属性
push.PushModule = PushModule;
push.PushErrorCode = PushErrorCode;
push.PushEventType = PushEventType;