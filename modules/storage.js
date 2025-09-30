/**
 * HTML5+ Storage 模块 ES Module 封装
 *
 * 该模块提供了本地存储功能，支持键值对存储
 * 遵循HTML5+官方API规范
 */

/**
 * 存储错误码常量
 */
export const StorageErrorCode = {
    NOT_AVAILABLE: 1001,      // 存储功能不可用
    PERMISSION_DENIED: 1002,  // 权限被拒绝
    QUOTA_EXCEEDED: 1003,     // 存储配额超出
    TIMEOUT: 1004,            // 操作超时
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * HTML5+ Storage 模块类
 */
class StorageModule {
    constructor() {
        this.moduleName = 'Storage';
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化Storage模块
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
                if (typeof plus === 'undefined' || !plus.storage) {
                    // 检查浏览器环境是否支持localStorage
                    if (typeof window !== 'undefined' && window.localStorage) {
                        this._browserSupport = true;
                        console.log('Storage模块将在浏览器环境中使用localStorage API');
                    } else {
                        console.warn('设备不支持存储功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Storage模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 设置存储项
     * @param {string} key - 键名
     * @param {string|number|boolean} value - 键值
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await storage.setItem('username', '张三');
     * await storage.setItem('age', 25);
     * await storage.setItem('isLoggedIn', true);
     * ```
     */
    async setItem(key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!key || typeof key !== 'string') {
                    throw new Error('键名必须是非空字符串');
                }

                if (value === undefined || value === null) {
                    throw new Error('值不能为undefined或null');
                }

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    plus.storage.setItem(key, String(value));
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    try {
                        window.localStorage.setItem(key, String(value));
                        resolve();
                    } catch (error) {
                        if (error.name === 'QuotaExceededError') {
                            throw new Error('存储配额已超出');
                        }
                        throw error;
                    }
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`设置存储项失败: ${error.message}`));
            }
        });
    }

    /**
     * 获取存储项
     * @param {string} key - 键名
     * @returns {Promise<string|null>}
     *
     * @example
     * ```javascript
     * const username = await storage.getItem('username');
     * const age = await storage.getItem('age');
     * const isLoggedIn = await storage.getItem('isLoggedIn');
     * ```
     */
    async getItem(key) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!key || typeof key !== 'string') {
                    throw new Error('键名必须是非空字符串');
                }

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    const value = plus.storage.getItem(key);
                    resolve(value);
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    const value = window.localStorage.getItem(key);
                    resolve(value);
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`获取存储项失败: ${error.message}`));
            }
        });
    }

    /**
     * 删除存储项
     * @param {string} key - 键名
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await storage.removeItem('old_data');
     * ```
     */
    async removeItem(key) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!key || typeof key !== 'string') {
                    throw new Error('键名必须是非空字符串');
                }

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    plus.storage.removeItem(key);
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    window.localStorage.removeItem(key);
                    resolve();
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`删除存储项失败: ${error.message}`));
            }
        });
    }

    /**
     * 清空所有存储
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await storage.clear();
     * ```
     */
    async clear() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    plus.storage.clear();
                    resolve();
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    window.localStorage.clear();
                    resolve();
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`清空存储失败: ${error.message}`));
            }
        });
    }

    /**
     * 获取存储项数量
     * @returns {Promise<number>}
     *
     * @example
     * ```javascript
     * const count = await storage.getLength();
     * console.log(`存储了 ${count} 个项目`);
     * ```
     */
    async getLength() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    const length = plus.storage.getLength();
                    resolve(length);
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    const length = window.localStorage.length;
                    resolve(length);
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`获取存储长度失败: ${error.message}`));
            }
        });
    }

    /**
     * 获取所有键名
     * @returns {Promise<string[]>}
     *
     * @example
     * ```javascript
     * const keys = await storage.getAllKeys();
     * console.log('所有键:', keys);
     * ```
     */
    async getAllKeys() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    const keys = plus.storage.getAllKeys();
                    resolve(keys);
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    const keys = [];
                    for (let i = 0; i < window.localStorage.length; i++) {
                        const key = window.localStorage.key(i);
                        if (key) {
                            keys.push(key);
                        }
                    }
                    resolve(keys);
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`获取所有键失败: ${error.message}`));
            }
        });
    }

    /**
     * 根据索引获取键名
     * @param {number} index - 索引
     * @returns {Promise<string|null>}
     *
     * @example
     * ```javascript
     * const key = await storage.key(0);
     * console.log('第一个键:', key);
     * ```
     */
    async key(index) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof index !== 'number' || index < 0) {
                    throw new Error('索引必须是非负数');
                }

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    const key = plus.storage.key(index);
                    resolve(key);
                } else if (this._browserSupport) {
                    // 浏览器环境使用localStorage
                    const key = window.localStorage.key(index);
                    resolve(key);
                } else {
                    throw new Error('设备不支持存储功能');
                }
            } catch (error) {
                reject(new Error(`获取键失败: ${error.message}`));
            }
        });
    }

    // 同步方法（兼容性）
    setItemSync(key, value) {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (!key || typeof key !== 'string') {
                throw new Error('键名必须是非空字符串');
            }

            if (value === undefined || value === null) {
                throw new Error('值不能为undefined或null');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                plus.storage.setItem(key, String(value));
            } else if (this._browserSupport) {
                window.localStorage.setItem(key, String(value));
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`设置存储项失败: ${error.message}`);
        }
    }

    getItemSync(key) {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (!key || typeof key !== 'string') {
                throw new Error('键名必须是非空字符串');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                return plus.storage.getItem(key);
            } else if (this._browserSupport) {
                return window.localStorage.getItem(key);
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`获取存储项失败: ${error.message}`);
        }
    }

    removeItemSync(key) {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (!key || typeof key !== 'string') {
                throw new Error('键名必须是非空字符串');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                plus.storage.removeItem(key);
            } else if (this._browserSupport) {
                window.localStorage.removeItem(key);
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`删除存储项失败: ${error.message}`);
        }
    }

    clearSync() {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                plus.storage.clear();
            } else if (this._browserSupport) {
                window.localStorage.clear();
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`清空存储失败: ${error.message}`);
        }
    }

    getLengthSync() {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                return plus.storage.getLength();
            } else if (this._browserSupport) {
                return window.localStorage.length;
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`获取存储长度失败: ${error.message}`);
        }
    }

    getAllKeysSync() {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                return plus.storage.getAllKeys();
            } else if (this._browserSupport) {
                const keys = [];
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key) {
                        keys.push(key);
                    }
                }
                return keys;
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`获取所有键失败: ${error.message}`);
        }
    }

    keySync(index) {
        try {
            if (!this._isInitialized) {
                throw new Error('模块未初始化');
            }

            if (typeof index !== 'number' || index < 0) {
                throw new Error('索引必须是非负数');
            }

            if (typeof plus !== 'undefined' && plus.storage) {
                return plus.storage.key(index);
            } else if (this._browserSupport) {
                return window.localStorage.key(index);
            } else {
                throw new Error('设备不支持存储功能');
            }
        } catch (error) {
            throw new Error(`获取键失败: ${error.message}`);
        }
    }

    /**
     * 判断设备是否支持Storage功能
     * @returns {Promise<boolean>}
     *
     * @example
     * ```javascript
     * const isSupported = await storage.isSupported();
     * if (isSupported) {
     *   console.log('设备支持存储功能');
     * } else {
     *   console.log('设备不支持存储功能');
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
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
     * 检查存储权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * const permission = await storage.checkPermission();
     * console.log('权限状态:', permission);
     * ```
     */
    checkPermission() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                resolve('denied');
            }
        });
    }

    /**
     * 请求存储权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * const permission = await storage.requestPermission();
     * if (permission === 'granted') {
     *   console.log('权限已授予');
     * } else {
     *   console.log('权限被拒绝');
     * }
     * ```
     */
    requestPermission() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.storage) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                resolve('denied');
            }
        });
    }
}

// 创建Storage模块实例
const storage = new StorageModule();

// 导出模块
export default storage;

// 导出类和常量
export { StorageModule, StorageErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
storage.StorageModule = StorageModule;
storage.StorageErrorCode = StorageErrorCode;