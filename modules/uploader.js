/**
 * HTML5+ Uploader 模块 ES Module 封装
 *
 * 该模块提供了文件上传功能管理，包括创建上传任务、管理上传状态、添加文件和数据等
 * 遵循HTML5+官方API规范，支持Promise-based操作和事件监听
 */

/**
 * 上传错误码常量
 */
export const UploaderErrorCode = {
    NOT_AVAILABLE: 1001,       // 上传功能不可用
    INVALID_URL: 1002,          // 无效的URL地址
    FILE_NOT_FOUND: 1003,      // 文件不存在
    NETWORK_ERROR: 1004,        // 网络错误
    TIMEOUT: 1005,              // 操作超时
    SERVER_ERROR: 1006,         // 服务器错误
    PERMISSION_DENIED: 1007,   // 权限被拒绝
    TASK_NOT_FOUND: 1008,      // 任务不存在
    INVALID_PARAMETER: 1009,   // 无效参数
    UNKNOWN_ERROR: 1099         // 未知错误
};

/**
 * 上传任务事件类型
 */
export const UploadEventType = {
    STATE_CHANGED: 'statechanged'  // 上传任务状态变化事件
};

/**
 * 上传任务状态常量
 */
export const UploadState = {
    UNDEFINED: undefined,     // 上传任务未开始
    PENDING: 0,                // 上传任务开始调度
    SENDING: 1,                // 上传任务开始请求
    CONNECTED: 2,              // 上传任务请求已经建立
    UPLOADING: 3,              // 上传任务提交数据
    COMPLETED: 4,              // 上传任务已完成
    PAUSED: 5,                 // 上传任务已暂停
    ALL: -1                    // 枚举任务状态（用于clear和enumerate操作）
};

/**
 * 上传任务选项
 * @typedef {Object} UploadOptions
 * @property {number} [blocksize] - 【已废弃】分块上传大小，单位字节，默认102400
 * @property {number} [chunkSize] - 分块上传大小，单位Kb，设置小于等于0则不分块，默认不分块
 * @property {string} [method='POST'] - 网络请求类型，仅支持POST
 * @property {number} [priority=0] - 上传任务优先级，数值越大优先级越高
 * @property {number} [retry=3] - 上传任务重试次数
 * @property {number} [retryInterval=30] - 上传任务重试间隔时间，单位秒
 * @property {number} [timeout=120] - 上传任务超时时间，单位秒
 */

/**
 * 上传文件选项
 * @typedef {Object} UploadFileOptions
 * @property {string} [key] - 文件键名，默认为文件名称
 * @property {string} [name] - 文件名称，默认为路径中的名称
 * @property {string} [mime] - 文件类型，默认根据文件后缀生成
 */

/**
 * 上传任务信息
 * @typedef {Object} UploadTaskInfo
 * @property {string} id - 上传任务标识
 * @property {string} url - 上传服务器地址
 * @property {number} state - 上传任务状态
 * @property {number} uploadedSize - 已上传数据大小
 * @property {number} totalSize - 总数据大小
 * @property {string} responseText - 服务器返回数据
 */

/**
 * 上传任务完成回调函数
 * @callback UploadCompletedCallback
 * @param {UploadTask} task - 上传任务对象
 * @param {number} status - HTTP状态码
 */

/**
 * 上传任务状态变化回调函数
 * @callback UploadStateChangedCallback
 * @param {UploadTask} task - 上传任务对象
 * @param {number} status - HTTP状态码
 */

/**
 * 枚举上传任务回调函数
 * @callback UploadEnumerateCallback
 * @param {UploadTask[]} tasks - 上传任务数组
 */

/**
 * 上传任务类
 */
class UploadTask {
    constructor(nativeTask) {
        this._nativeTask = nativeTask;
        this._eventListeners = new Map();
        this._isDestroyed = false;

        // 代理原生任务的属性
        this._proxyProperties();
    }

    /**
     * 代理原生任务的属性
     * @private
     */
    _proxyProperties() {
        if (!this._nativeTask) return;

        // 只读属性
        Object.defineProperties(this, {
            id: {
                get: () => this._nativeTask.id || '',
                enumerable: true
            },
            url: {
                get: () => this._nativeTask.url || '',
                enumerable: true
            },
            state: {
                get: () => this._nativeTask.state || UploadState.UNDEFINED,
                enumerable: true
            },
            options: {
                get: () => this._nativeTask.options || {},
                enumerable: true
            },
            responseText: {
                get: () => this._nativeTask.responseText || '',
                enumerable: true
            },
            uploadedSize: {
                get: () => this._nativeTask.uploadedSize || 0,
                enumerable: true
            },
            totalSize: {
                get: () => this._nativeTask.totalSize || 0,
                enumerable: true
            }
        });
    }

    /**
     * 添加上传文件
     * @param {string} path - 文件路径
     * @param {UploadFileOptions} options - 文件选项
     * @returns {boolean} 是否添加成功
     */
    addFile(path, options = {}) {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        if (!path || typeof path !== 'string') {
            throw new Error('文件路径不能为空且必须是字符串');
        }

        try {
            const fileOptions = {
                key: options.key || '',
                name: options.name || '',
                mime: options.mime || ''
            };

            return this._nativeTask.addFile(path, fileOptions);
        } catch (error) {
            console.error('添加上传文件失败:', error);
            throw new Error(`添加上传文件失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 添加上传数据
     * @param {string} key - 键名
     * @param {string} value - 键值
     * @returns {boolean} 是否添加成功
     */
    addData(key, value) {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        if (!key || typeof key !== 'string') {
            throw new Error('键名不能为空且必须是字符串');
        }

        if (value === undefined || value === null) {
            throw new Error('键值不能为undefined或null');
        }

        try {
            return this._nativeTask.addData(key, String(value));
        } catch (error) {
            console.error('添加上传数据失败:', error);
            throw new Error(`添加上传数据失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 开始上传任务
     */
    start() {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        try {
            this._nativeTask.start();
        } catch (error) {
            console.error('开始上传任务失败:', error);
            throw new Error(`开始上传任务失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 暂停上传任务
     */
    pause() {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        try {
            this._nativeTask.pause();
        } catch (error) {
            console.error('暂停上传任务失败:', error);
            throw new Error(`暂停上传任务失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 恢复上传任务
     */
    resume() {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        try {
            this._nativeTask.resume();
        } catch (error) {
            console.error('恢复上传任务失败:', error);
            throw new Error(`恢复上传任务失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 取消上传任务
     */
    abort() {
        if (this._isDestroyed) {
            return;
        }

        try {
            this._nativeTask.abort();
            this._destroy();
        } catch (error) {
            console.error('取消上传任务失败:', error);
            throw new Error(`取消上传任务失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 添加事件监听器
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     * @param {boolean} [capture=false] - 是否捕获
     */
    addEventListener(type, listener, capture = false) {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        if (typeof listener !== 'function') {
            throw new Error('监听器必须是一个函数');
        }

        if (!this._eventListeners.has(type)) {
            this._eventListeners.set(type, new Set());
        }

        this._eventListeners.get(type).add(listener);

        // 如果原生任务存在，添加事件监听
        if (this._nativeTask && typeof this._nativeTask.addEventListener === 'function') {
            try {
                this._nativeTask.addEventListener(type, (upload, status) => {
                    this._handleEvent(type, upload, status);
                }, capture);
            } catch (error) {
                console.warn('添加原生事件监听器失败:', error);
            }
        }
    }

    /**
     * 移除事件监听器
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     */
    removeEventListener(type, listener) {
        if (this._isDestroyed) {
            return;
        }

        if (this._eventListeners.has(type)) {
            this._eventListeners.get(type).delete(listener);
        }
    }

    /**
     * 处理事件
     * @private
     */
    _handleEvent(type, upload, status) {
        if (this._isDestroyed) {
            return;
        }

        const listeners = this._eventListeners.get(type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(this, status);
                } catch (error) {
                    console.error('执行事件监听器失败:', error);
                }
            });
        }
    }

    /**
     * 获取所有HTTP响应头
     * @returns {string} 响应头字符串
     */
    getAllResponseHeaders() {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        try {
            return this._nativeTask.getAllResponseHeaders() || '';
        } catch (error) {
            console.error('获取HTTP响应头失败:', error);
            return '';
        }
    }

    /**
     * 获取指定的HTTP响应头
     * @param {string} headerName - 头名称
     * @returns {string} 头值
     */
    getResponseHeader(headerName) {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        if (!headerName || typeof headerName !== 'string') {
            throw new Error('头名称不能为空且必须是字符串');
        }

        try {
            return this._nativeTask.getResponseHeader(headerName) || '';
        } catch (error) {
            console.error('获取HTTP响应头失败:', error);
            return '';
        }
    }

    /**
     * 设置HTTP请求头
     * @param {string} headerName - 头名称
     * @param {string} headerValue - 头值
     */
    setRequestHeader(headerName, headerValue) {
        if (this._isDestroyed) {
            throw new Error('上传任务已被销毁');
        }

        if (!headerName || typeof headerName !== 'string') {
            throw new Error('头名称不能为空且必须是字符串');
        }

        if (headerValue === undefined || headerValue === null) {
            throw new Error('头值不能为undefined或null');
        }

        try {
            this._nativeTask.setRequestHeader(headerName, String(headerValue));
        } catch (error) {
            console.error('设置HTTP请求头失败:', error);
            throw new Error(`设置HTTP请求头失败: ${error.message || '未知错误'}`);
        }
    }

    /**
     * 销毁任务
     * @private
     */
    _destroy() {
        this._isDestroyed = true;
        this._eventListeners.clear();
        this._nativeTask = null;
    }

    /**
     * 获取上传进度
     * @returns {number} 上传进度（0-100）
     */
    getProgress() {
        if (this._isDestroyed || !this._nativeTask) {
            return 0;
        }

        const { uploadedSize, totalSize } = this;
        if (totalSize <= 0) {
            return 0;
        }

        return Math.min(100, Math.round((uploadedSize / totalSize) * 100));
    }

    /**
     * 判断任务是否已完成
     * @returns {boolean} 是否已完成
     */
    isCompleted() {
        return this.state === UploadState.COMPLETED;
    }

    /**
     * 判断任务是否已暂停
     * @returns {boolean} 是否已暂停
     */
    isPaused() {
        return this.state === UploadState.PAUSED;
    }

    /**
     * 判断任务是否正在上传
     * @returns {boolean} 是否正在上传
     */
    isUploading() {
        const state = this.state;
        return state === UploadState.PENDING ||
               state === UploadState.SENDING ||
               state === UploadState.CONNECTED ||
               state === UploadState.UPLOADING;
    }
}

/**
 * HTML5+ Uploader 模块类
 */
class UploaderModule {
    constructor() {
        this.moduleName = 'Uploader';
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
        this._uploadTasks = new Map();
        this._nextTaskId = 1;
    }

    /**
     * 初始化Uploader模块
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
                if (typeof plus === 'undefined' || !plus.uploader) {
                    // 检查浏览器环境是否支持文件上传
                    if (typeof window !== 'undefined' && 'FormData' in window && 'XMLHttpRequest' in window) {
                        this._browserSupport = true;
                        console.log('Uploader模块将在浏览器环境中使用FormData API');
                    } else {
                        console.warn('设备不支持文件上传功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Uploader模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 创建上传任务
     * @param {string} url - 上传URL
     * @param {UploadOptions} [options] - 上传选项
     * @param {UploadCompletedCallback} [completedCallback] - 完成回调
     * @returns {Promise<UploadTask>} 上传任务对象
     */
    createUpload(url, options = {}, completedCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!url || typeof url !== 'string') {
                    throw new Error('URL地址不能为空且必须是字符串');
                }

                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    throw new Error('URL地址必须以http://或https://开头');
                }

                const uploadOptions = {
                    method: options.method || 'POST',
                    priority: options.priority || 0,
                    retry: options.retry || 3,
                    retryInterval: options.retryInterval || 30,
                    timeout: options.timeout || 120,
                    chunkSize: options.chunkSize || 0,
                    blocksize: options.blocksize || 0
                };

                let nativeTask;

                if (typeof plus !== 'undefined' && plus.uploader) {
                    // HTML5+环境
                    const callbackWrapper = (upload, status) => {
                        if (completedCallback) {
                            try {
                                completedCallback(upload, status);
                            } catch (error) {
                                console.error('执行完成回调失败:', error);
                            }
                        }
                    };

                    nativeTask = plus.uploader.createUpload(url, uploadOptions, callbackWrapper);
                } else if (this._browserSupport) {
                    // 浏览器环境
                    nativeTask = this._createBrowserUploadTask(url, uploadOptions, completedCallback);
                } else {
                    throw new Error('设备不支持文件上传功能');
                }

                const task = new UploadTask(nativeTask);
                const taskId = this._nextTaskId++;

                this._uploadTasks.set(taskId, task);
                task._taskId = taskId;

                resolve(task);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中创建上传任务
     * @private
     */
    _createBrowserUploadTask(url, options, completedCallback) {
        // 模拟上传任务对象
        const mockTask = {
            id: `browser_${Date.now()}`,
            url: url,
            state: UploadState.UNDEFINED,
            options: options,
            responseText: '',
            uploadedSize: 0,
            totalSize: 0,
            _xhr: null,
            _formData: null,
            _files: [],
            _data: [],

            addFile: function(path, fileOptions) {
                // 在浏览器环境中，path应该是File对象或文件选择器
                if (path instanceof File) {
                    this._files.push({
                        file: path,
                        options: fileOptions
                    });
                    this.totalSize += path.size;
                    return true;
                }
                return false;
            },

            addData: function(key, value) {
                if (!this._formData) {
                    this._formData = new FormData();
                }
                this._formData.append(key, value);
                this._data.push({ key, value });
                return true;
            },

            start: function() {
                if (this.state !== UploadState.UNDEFINED && this.state !== UploadState.PAUSED) {
                    return;
                }

                this.state = UploadState.PENDING;

                if (!this._formData) {
                    this._formData = new FormData();
                }

                // 添加文件到FormData
                this._files.forEach(fileInfo => {
                    const { file, options } = fileInfo;
                    const key = options.key || file.name;
                    const name = options.name || file.name;
                    this._formData.append(key, file, name);
                });

                const xhr = new XMLHttpRequest();
                this._xhr = xhr;

                xhr.upload.onprogress = (event) => {
                    this.uploadedSize = event.loaded;
                    this.state = UploadState.UPLOADING;
                };

                xhr.onload = () => {
                    this.state = UploadState.COMPLETED;
                    this.responseText = xhr.responseText;
                    if (completedCallback) {
                        completedCallback(this, xhr.status);
                    }
                };

                xhr.onerror = () => {
                    this.state = UploadState.COMPLETED;
                    if (completedCallback) {
                        completedCallback(this, 0);
                    }
                };

                xhr.ontimeout = () => {
                    this.state = UploadState.COMPLETED;
                    if (completedCallback) {
                        completedCallback(this, 0);
                    }
                };

                xhr.open(options.method || 'POST', url);
                xhr.timeout = (options.timeout || 120) * 1000;
                xhr.send(this._formData);
            },

            pause: function() {
                if (this.state === UploadState.UPLOADING) {
                    this.state = UploadState.PAUSED;
                    if (this._xhr) {
                        this._xhr.abort();
                    }
                }
            },

            resume: function() {
                if (this.state === UploadState.PAUSED) {
                    this.start();
                }
            },

            abort: function() {
                this.state = UploadState.COMPLETED;
                if (this._xhr) {
                    this._xhr.abort();
                }
            },

            addEventListener: function(type, listener) {
                // 简化的事件监听实现
                if (type === 'statechanged') {
                    this._stateChangeListener = listener;
                }
            },

            getAllResponseHeaders: function() {
                return this._xhr ? this._xhr.getAllResponseHeaders() : '';
            },

            getResponseHeader: function(name) {
                return this._xhr ? this._xhr.getResponseHeader(name) : '';
            },

            setRequestHeader: function(name, value) {
                if (this._xhr) {
                    this._xhr.setRequestHeader(name, value);
                }
            }
        };

        return mockTask;
    }

    /**
     * 清除上传任务
     * @param {number} [state] - 要清除的任务状态，默认清除所有任务
     * @returns {Promise<void>}
     */
    clear(state = UploadState.ALL) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.uploader) {
                    // HTML5+环境
                    plus.uploader.clear(state);
                }

                // 清除内部任务列表
                if (state === UploadState.ALL) {
                    this._uploadTasks.forEach(task => task.abort());
                    this._uploadTasks.clear();
                } else {
                    const tasksToRemove = [];
                    this._uploadTasks.forEach((task, taskId) => {
                        if (task.state === state) {
                            task.abort();
                            tasksToRemove.push(taskId);
                        }
                    });
                    tasksToRemove.forEach(taskId => this._uploadTasks.delete(taskId));
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 枚举上传任务
     * @param {number} [state] - 要枚举的任务状态，默认枚举所有任务
     * @returns {Promise<UploadTask[]>} 上传任务数组
     */
    enumerate(state = UploadState.ALL) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const tasks = [];

                if (typeof plus !== 'undefined' && plus.uploader) {
                    // HTML5+环境
                    return new Promise((resolveInner) => {
                        plus.uploader.enumerate((nativeTasks) => {
                            const filteredTasks = state === UploadState.ALL
                                ? nativeTasks
                                : nativeTasks.filter(task => task.state === state);

                            resolveInner(filteredTasks.map(nativeTask => new UploadTask(nativeTask)));
                        }, state);
                    });
                }

                // 浏览器环境或内部任务
                this._uploadTasks.forEach(task => {
                    if (state === UploadState.ALL || task.state === state) {
                        tasks.push(task);
                    }
                });

                resolve(tasks);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 开始所有上传任务
     * @returns {Promise<void>}
     */
    startAll() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.uploader) {
                    // HTML5+环境
                    plus.uploader.startAll();
                }

                // 启动内部所有未开始的任务
                this._uploadTasks.forEach(task => {
                    if (task.state === UploadState.UNDEFINED || task.state === UploadState.PAUSED) {
                        try {
                            task.start();
                        } catch (error) {
                            console.error('启动上传任务失败:', error);
                        }
                    }
                });

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前活跃的上传任务数量
     * @returns {number} 活跃任务数量
     */
    getActiveTaskCount() {
        let count = 0;
        this._uploadTasks.forEach(task => {
            if (task.isUploading()) {
                count++;
            }
        });
        return count;
    }

    /**
     * 获取所有上传任务
     * @returns {UploadTask[]} 所有上传任务
     */
    getAllTasks() {
        return Array.from(this._uploadTasks.values());
    }

    /**
     * 根据ID获取上传任务
     * @param {string|number} taskId - 任务ID
     * @returns {UploadTask|null} 上传任务
     */
    getTaskById(taskId) {
        return this._uploadTasks.get(String(taskId)) || null;
    }

    /**
     * 移除上传任务
     * @param {string|number} taskId - 任务ID
     * @returns {boolean} 是否移除成功
     */
    removeTask(taskId) {
        const task = this._uploadTasks.get(String(taskId));
        if (task) {
            task.abort();
            this._uploadTasks.delete(String(taskId));
            return true;
        }
        return false;
    }

    /**
     * 清理所有已完成或失败的任务
     * @returns {Promise<number>} 清理的任务数量
     */
    cleanupCompletedTasks() {
        return new Promise(async (resolve) => {
            await this.initialize();

            let cleanedCount = 0;
            const tasksToRemove = [];

            this._uploadTasks.forEach((task, taskId) => {
                if (task.isCompleted()) {
                    task.abort();
                    tasksToRemove.push(taskId);
                    cleanedCount++;
                }
            });

            tasksToRemove.forEach(taskId => this._uploadTasks.delete(taskId));
            resolve(cleanedCount);
        });
    }

    /**
     * 判断设备是否支持上传功能
     * @returns {Promise<boolean>} 是否支持
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.uploader) {
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

// 创建Uploader模块实例
const uploader = new UploaderModule();

// 导出模块
export default uploader;

// 导出类和常量
export { UploaderModule, UploadTask, UploaderErrorCode, UploadEventType, UploadState };

// 为了兼容性，也导出类作为默认导出的属性
uploader.UploaderModule = UploaderModule;
uploader.UploadTask = UploadTask;
uploader.UploaderErrorCode = UploaderErrorCode;
uploader.UploadEventType = UploadEventType;
uploader.UploadState = UploadState;