/**
 * HTML5+ Key 模块 ES Module 封装
 *
 * 该模块提供了对设备按键事件的管理能力
 * 支持监听音量键、菜单键、返回键等设备按键事件
 * 支持软键盘的显示和隐藏控制
 * 遵循HTML5+官方API规范
 */

/**
 * 按键类型常量
 * @readonly
 * @enum {string}
 */
export const KeyType = {
    BACK_BUTTON: 'backbutton',        // 设备"返回"按钮按键事件
    MENU_BUTTON: 'menubutton',        // 设备"菜单"按钮按键事件
    VOLUME_UP: 'volumeup',           // 设备"音量+"按钮按键事件
    VOLUME_DOWN: 'volumedown',       // 设备"音量-"按钮按键事件
    SEARCH_BUTTON: 'searchbutton',   // 设备"搜索"按钮按键事件
    HOME_BUTTON: 'homebutton'        // 设备"Home"按钮按键事件
};

/**
 * 按键错误代码常量
 * @readonly
 * @enum {number}
 */
export const KeyErrorCode = {
    INVALID_KEY_TYPE: 1,           // 无效的按键类型
    LISTENER_ALREADY_EXISTS: 2,   // 监听器已存在
    LISTENER_NOT_FOUND: 3,         // 监听器未找到
    KEYBOARD_ERROR: 4,             // 软键盘操作错误
    UNKNOWN_ERROR: 5               // 未知错误
};

/**
 * 辅助输入类型常量
 * @readonly
 * @enum {number}
 */
export const AssistantType = {
    NORMAL: 0,                     // 普通输入模式
    NUMBER: 1,                     // 数字输入模式
    PHONE: 2,                      // 电话号码输入模式
    URL: 3,                        // URL输入模式
    EMAIL: 4                       // 邮箱输入模式
};

/**
 * 按键事件对象
 * @typedef {Object} KeyEvent
 * @property {number} keyCode - 触发按键事件的键值
 * @property {string} keyType - 按键类型
 * @property {number} timestamp - 事件发生时间戳
 */

/**
 * 按键事件回调函数
 * @callback KeyEventCallback
 * @param {KeyEvent} event - 按键事件对象
 */

/**
 * Key模块类
 */
class KeyModule {
    constructor() {
        this.eventListeners = new Map(); // 存储事件监听器
        this.volumeButtonEnabled = true; // 音量键是否启用
        this.currentAssistantType = AssistantType.NORMAL; // 当前输入类型
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.key) {
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
     * 格式化按键事件
     * @private
     * @param {Object} nativeEvent - 原生按键事件
     * @returns {KeyEvent} 格式化后的按键事件
     */
    formatKeyEvent(nativeEvent) {
        let keyType = 'unknown';

        // 根据keyCode判断按键类型
        switch (nativeEvent.keyCode) {
            case 4:  // Android返回键
                keyType = KeyType.BACK_BUTTON;
                break;
            case 82: // Android菜单键
                keyType = KeyType.MENU_BUTTON;
                break;
            case 24: // Android音量+
                keyType = KeyType.VOLUME_UP;
                break;
            case 25: // Android音量-
                keyType = KeyType.VOLUME_DOWN;
                break;
            case 84: // Android搜索键
                keyType = KeyType.SEARCH_BUTTON;
                break;
            case 3:  // Android Home键
                keyType = KeyType.HOME_BUTTON;
                break;
            default:
                keyType = `key_${nativeEvent.keyCode}`;
        }

        return {
            keyCode: nativeEvent.keyCode,
            keyType: keyType,
            timestamp: Date.now()
        };
    }

    /**
     * 验证按键类型
     * @private
     * @param {string} eventType - 按键事件类型
     * @returns {boolean} 是否有效
     */
    validateEventType(eventType) {
        const validTypes = Object.values(KeyType);
        return validTypes.includes(eventType);
    }

    /**
     * 添加按键事件监听器
     * @param {string} eventType - 要监听的按键事件类型
     * @param {KeyEventCallback} listener - 监听按键事件发生时调用的回调函数
     * @param {boolean} [capture=false] - 捕获按键事件流顺序，暂作为保留参数
     * @throws {Error} 如果添加失败
     */
    addEventListener(eventType, listener, capture = false) {
        try {
            this.checkPlusEnvironment();

            if (!this.validateEventType(eventType)) {
                throw this.createError(
                    KeyErrorCode.INVALID_KEY_TYPE,
                    '无效的按键事件类型'
                );
            }

            if (typeof listener !== 'function') {
                throw new Error('监听回调函数必须是一个函数');
            }

            // 包装回调函数
            const wrappedListener = (nativeEvent) => {
                const formattedEvent = this.formatKeyEvent(nativeEvent);
                listener(formattedEvent);
            };

            // 存储监听器信息
            if (!this.eventListeners.has(eventType)) {
                this.eventListeners.set(eventType, new Set());
            }
            this.eventListeners.get(eventType).add({
                original: listener,
                wrapped: wrappedListener
            });

            // 调用原生API
            plus.key.addEventListener(eventType, wrappedListener, capture);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                KeyErrorCode.UNKNOWN_ERROR,
                `添加按键事件监听器失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 移除按键事件监听器
     * @param {string} eventType - 要移除的按键事件类型
     * @param {KeyEventCallback} listener - 要移除的监听回调函数
     * @throws {Error} 如果移除失败
     */
    removeEventListener(eventType, listener) {
        try {
            this.checkPlusEnvironment();

            if (!this.validateEventType(eventType)) {
                throw this.createError(
                    KeyErrorCode.INVALID_KEY_TYPE,
                    '无效的按键事件类型'
                );
            }

            if (typeof listener !== 'function') {
                throw new Error('监听回调函数必须是一个函数');
            }

            const listeners = this.eventListeners.get(eventType);
            if (!listeners) {
                throw this.createError(
                    KeyErrorCode.LISTENER_NOT_FOUND,
                    '未找到指定的事件监听器'
                );
            }

            // 查找并移除监听器
            let listenerFound = false;
            for (const listenerInfo of listeners) {
                if (listenerInfo.original === listener) {
                    plus.key.removeEventListener(eventType, listenerInfo.wrapped);
                    listeners.delete(listenerInfo);
                    listenerFound = true;
                    break;
                }
            }

            if (!listenerFound) {
                throw this.createError(
                    KeyErrorCode.LISTENER_NOT_FOUND,
                    '未找到指定的事件监听器'
                );
            }

            // 如果该事件类型没有监听器了，删除Map中的记录
            if (listeners.size === 0) {
                this.eventListeners.delete(eventType);
            }

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                KeyErrorCode.UNKNOWN_ERROR,
                `移除按键事件监听器失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 显示软键盘
     * @throws {Error} 如果显示失败
     */
    showSoftKeybord() {
        try {
            this.checkPlusEnvironment();
            plus.key.showSoftKeybord();
        } catch (error) {
            throw this.createError(
                KeyErrorCode.KEYBOARD_ERROR,
                `显示软键盘失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 隐藏软键盘
     * @throws {Error} 如果隐藏失败
     */
    hideSoftKeybord() {
        try {
            this.checkPlusEnvironment();
            plus.key.hideSoftKeybord();
        } catch (error) {
            throw this.createError(
                KeyErrorCode.KEYBOARD_ERROR,
                `隐藏软键盘失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 设置音量键是否生效
     * @param {boolean} enabled - 是否生效
     * @throws {Error} 如果设置失败
     */
    setVolumeButtonEnabled(enabled) {
        try {
            this.checkPlusEnvironment();

            if (typeof enabled !== 'boolean') {
                throw new Error('enabled参数必须是布尔值');
            }

            plus.key.setVolumeButtonEnabled(enabled);
            this.volumeButtonEnabled = enabled;

        } catch (error) {
            throw this.createError(
                KeyErrorCode.UNKNOWN_ERROR,
                `设置音量键状态失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 设置辅助输入类型
     * @param {number} type - 辅助输入类型
     * @throws {Error} 如果设置失败
     */
    setAssistantType(type) {
        try {
            this.checkPlusEnvironment();

            if (typeof type !== 'number' || type < 0 || type > 4) {
                throw new Error('无效的辅助输入类型');
            }

            plus.key.setAssistantType(type);
            this.currentAssistantType = type;

        } catch (error) {
            throw this.createError(
                KeyErrorCode.UNKNOWN_ERROR,
                `设置辅助输入类型失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 监听返回键事件
     * @param {KeyEventCallback} callback - 返回键按下时的回调函数
     * @param {boolean} [preventDefault=false] - 是否阻止默认行为
     * @throws {Error} 如果监听失败
     */
    onBackButton(callback, preventDefault = false) {
        const wrappedCallback = (event) => {
            if (preventDefault) {
                // 阻止默认行为（如退出应用）
                event.preventDefault && event.preventDefault();
            }
            callback(event);
        };

        this.addEventListener(KeyType.BACK_BUTTON, wrappedCallback);
    }

    /**
     * 监听菜单键事件
     * @param {KeyEventCallback} callback - 菜单键按下时的回调函数
     * @param {boolean} [preventDefault=false] - 是否阻止默认行为
     * @throws {Error} 如果监听失败
     */
    onMenuButton(callback, preventDefault = false) {
        const wrappedCallback = (event) => {
            if (preventDefault) {
                event.preventDefault && event.preventDefault();
            }
            callback(event);
        };

        this.addEventListener(KeyType.MENU_BUTTON, wrappedCallback);
    }

    /**
     * 监听音量增加键事件
     * @param {KeyEventCallback} callback - 音量增加键按下时的回调函数
     * @param {boolean} [preventDefault=false] - 是否阻止默认行为
     * @throws {Error} 如果监听失败
     */
    onVolumeUp(callback, preventDefault = false) {
        const wrappedCallback = (event) => {
            if (preventDefault && this.volumeButtonEnabled) {
                // 如果要阻止默认行为，先临时禁用音量键
                this.setVolumeButtonEnabled(false);
                callback(event);
                // 恢复音量键状态
                setTimeout(() => {
                    this.setVolumeButtonEnabled(true);
                }, 100);
            } else {
                callback(event);
            }
        };

        this.addEventListener(KeyType.VOLUME_UP, wrappedCallback);
    }

    /**
     * 监听音量减少键事件
     * @param {KeyEventCallback} callback - 音量减少键按下时的回调函数
     * @param {boolean} [preventDefault=false] - 是否阻止默认行为
     * @throws {Error} 如果监听失败
     */
    onVolumeDown(callback, preventDefault = false) {
        const wrappedCallback = (event) => {
            if (preventDefault && this.volumeButtonEnabled) {
                // 如果要阻止默认行为，先临时禁用音量键
                this.setVolumeButtonEnabled(false);
                callback(event);
                // 恢复音量键状态
                setTimeout(() => {
                    this.setVolumeButtonEnabled(true);
                }, 100);
            } else {
                callback(event);
            }
        };

        this.addEventListener(KeyType.VOLUME_DOWN, wrappedCallback);
    }

    /**
     * 监听Home键事件（部分设备支持）
     * @param {KeyEventCallback} callback - Home键按下时的回调函数
     * @throws {Error} 如果监听失败
     */
    onHomeButton(callback) {
        this.addEventListener(KeyType.HOME_BUTTON, callback);
    }

    /**
     * 监听搜索键事件（部分设备支持）
     * @param {KeyEventCallback} callback - 搜索键按下时的回调函数
     * @throws {Error} 如果监听失败
     */
    onSearchButton(callback) {
        this.addEventListener(KeyType.SEARCH_BUTTON, callback);
    }

    /**
     * 移除所有按键事件监听器
     */
    removeAllEventListeners() {
        try {
            this.checkPlusEnvironment();

            for (const [eventType, listeners] of this.eventListeners) {
                for (const listenerInfo of listeners) {
                    plus.key.removeEventListener(eventType, listenerInfo.wrapped);
                }
            }

            this.eventListeners.clear();

        } catch (error) {
            throw this.createError(
                KeyErrorCode.UNKNOWN_ERROR,
                `移除所有按键事件监听器失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 获取指定事件类型的监听器数量
     * @param {string} eventType - 事件类型
     * @returns {number} 监听器数量
     */
    getEventListenerCount(eventType) {
        const listeners = this.eventListeners.get(eventType);
        return listeners ? listeners.size : 0;
    }

    /**
     * 获取所有事件类型及其监听器数量
     * @returns {Object} 事件类型和监听器数量的映射
     */
    getAllEventListeners() {
        const result = {};
        for (const [eventType, listeners] of this.eventListeners) {
            result[eventType] = listeners.size;
        }
        return result;
    }

    /**
     * 获取当前音量键状态
     * @returns {boolean} 音量键是否启用
     */
    isVolumeButtonEnabled() {
        return this.volumeButtonEnabled;
    }

    /**
     * 获取当前辅助输入类型
     * @returns {number} 当前输入类型
     */
    getCurrentAssistantType() {
        return this.currentAssistantType;
    }

    /**
     * 简化的显示软键盘方法，自动处理错误
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickShowSoftKeyboard() {
        try {
            this.showSoftKeybord();
            return true;
        } catch (error) {
            console.warn('显示软键盘失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的隐藏软键盘方法，自动处理错误
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickHideSoftKeyboard() {
        try {
            this.hideSoftKeybord();
            return true;
        } catch (error) {
            console.warn('隐藏软键盘失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的返回键监听方法，自动处理错误
     * @param {function} callback - 回调函数
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickOnBackButton(callback) {
        try {
            this.onBackButton(callback);
            return true;
        } catch (error) {
            console.warn('监听返回键失败:', error.message);
            return false;
        }
    }

    /**
     * 判断设备是否支持Key功能
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
}

// 创建Key模块实例
const key = new KeyModule();

// 导出模块
export default key;

// 导出常量
export { KeyType, KeyErrorCode, AssistantType };