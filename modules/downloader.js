/**
 * HTML5+ Downloader 模块 ES Module 封装
 *
 * 该模块提供了网络文件下载任务管理功能，支持从服务器下载各种文件
 * 遵循HTML5+官方API规范
 */

/**
 * 下载任务事件类型常量
 */
export const DownloadEventType = {
    STATE_CHANGED: 'statechanged'  // 下载任务状态变化事件
};

/**
 * 下载任务状态常量
 */
export const DownloadState = {
    UNDEFINED: undefined,  // 下载任务未开始
    SCHEDULED: 0,          // 下载任务开始调度
    REQUESTING: 1,        // 下载任务开始请求
    REQUESTED: 2,         // 下载任务请求已经接收
    DOWNLOADING: 3,       // 下载任务接收数据
    COMPLETED: 4,         // 下载任务已完成
    PAUSED: 5,            // 下载任务已暂停
    ENUMERATE: -1         // 枚举任务状态
};

/**
 * 下载任务参数
 * @typedef {Object} DownloadOptions
 * @property {string} [method] - 网络请求类型，支持"GET"、"POST"，默认"GET"
 * @property {string} [data] - POST请求时提交的数据
 * @property {string} [filename] - 下载文件保存的路径
 * @property {number} [priority] - 下载任务的优先级，数值越大优先级越高，默认0
 * @property {number} [timeout] - 下载任务超时时间，单位秒，默认120
 * @property {number} [retry] - 下载任务重试次数，默认3次
 * @property {number} [retryInterval] - 下载任务重试间隔时间，单位秒，默认30
 */

/**
 * 下载任务完成时的回调函数
 * @callback DownloadCompletedCallback
 * @param {Download} download - 下载任务对象
 * @param {number} status - 下载结果状态码
 */

/**
 * 下载任务状态变化回调函数
 * @callback DownloadStateChangedCallback
 * @param {Download} download - 下载任务对象
 * @param {number} status - 下载结果状态码
 */

/**
 * 枚举下载任务回调函数
 * @callback DownloadEnumerateCallback
 * @param {Download[]} downloads - 枚举到的下载任务对象数组
 */

/**
 * 下载任务对象
 * @typedef {Object} Download
 * @property {string} id - 下载任务的标识
 * @property {string} url - 下载文件的地址
 * @property {number} state - 任务的状态
 * @property {DownloadOptions} options - 下载任务的参数
 * @property {string} filename - 下载的文件名称
 * @property {number} downloadedSize - 已完成下载文件的大小
 * @property {number} totalSize - 下载任务文件的总大小
 * @property {function} abort - 取消下载任务
 * @property {function} addEventListener - 添加下载任务事件监听器
 * @property {function} getAllResponseHeaders - 获取下载请求HTTP响应头部信息
 * @property {function} getResponseHeader - 获取下载请求指定的HTTP响应头部的值
 * @property {function} pause - 暂停下载任务
 * @property {function} resume - 恢复暂停的下载任务
 * @property {function} setRequestHeader - 设置下载请求的HTTP头数据
 * @property {function} start - 开始下载任务
 */

/**
 * 下载任务结果对象
 * @typedef {Object} DownloadResult
 * @property {string} id - 下载任务的标识
 * @property {string} url - 下载文件的地址
 * @property {string} filename - 下载的文件路径
 * @property {number} status - 下载结果状态码
 * @property {number} downloadedSize - 已下载文件大小
 * @property {number} totalSize - 文件总大小
 */

/**
 * Downloader模块类
 */
class DownloaderModule {
    constructor() {
        this.downloads = new Map(); // 存储下载任务
        this.activeDownloads = new Map(); // 活跃下载任务状态跟踪
    }

    /**
     * 新建下载任务
     * @param {string} url - 要下载文件资源地址
     * @param {DownloadOptions} [options] - 下载任务的参数
     * @param {DownloadCompletedCallback} [completedCB] - 下载任务完成回调函数
     * @returns {Promise<Download>|Download} 下载任务对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const download = await downloader.createDownload(
     *     'http://www.abc.com/a.doc',
     *     { filename: '_downloads/test.doc' }
     *   );
     *   console.log('下载任务创建成功');
     *   await download.startPromise();
     * } catch (error) {
     *   console.error('创建下载任务失败:', error);
     * }
     * ```
     */
    createDownload(url, options, completedCB) {
        // 如果只传入了url且没有options，支持Promise方式
        if (typeof options !== 'object' || options === null) {
            completedCB = options;
            options = {};
        }

        if (typeof completedCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.createDownload(url, options, resolve);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查下载模块是否可用
            if (!plus.downloader) {
                throw new Error('设备不支持下载功能');
            }

            // 检查url参数
            if (!url || typeof url !== 'string') {
                throw new Error('下载地址不能为空');
            }

            // 创建下载任务
            const download = plus.downloader.createDownload(url, options, (download, status) => {
                // 下载完成回调
                if (completedCB) {
                    completedCB(download, status);
                }

                // 从活跃任务中移除
                if (this.activeDownloads.has(download.id)) {
                    this.activeDownloads.delete(download.id);
                }
            });

            // 存储下载任务
            this.downloads.set(download.id, download);

            // 添加包装方法
            this.wrapDownload(download);

            return download;

        } catch (error) {
            if (completedCB) {
                completedCB(null, -1);
            } else {
                throw error;
            }
        }
    }

    /**
     * 枚举下载任务
     * @param {DownloadEnumerateCallback} enumCB - 枚举下载任务回调函数
     * @param {number} [state] - 枚举下载任务的状态
     * @returns {Promise<Download[]>|void}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const tasks = await downloader.enumerateDownloads();
     *   console.log('未完成任务数量:', tasks.length);
     * } catch (error) {
     *   console.error('枚举下载任务失败:', error);
     * }
     * ```
     */
    enumerateDownloads(enumCB, state) {
        // 如果只传入了enumCB，支持Promise方式
        if (typeof enumCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.enumerateDownloads(resolve, enumCB);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查下载模块是否可用
            if (!plus.downloader) {
                throw new Error('设备不支持下载功能');
            }

            // 枚举下载任务
            plus.downloader.enumerate((downloads) => {
                // 为每个下载任务添加包装方法
                downloads.forEach(download => {
                    if (!this.downloads.has(download.id)) {
                        this.downloads.set(download.id, download);
                        this.wrapDownload(download);
                    }
                });

                if (enumCB) {
                    enumCB(downloads);
                }
            }, state || undefined);

        } catch (error) {
            if (enumCB) {
                enumCB([]);
            } else {
                throw error;
            }
        }
    }

    /**
     * 清除下载任务
     * @param {number} [state] - 清除下载任务的状态
     * @returns {Promise<void>|void}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await downloader.clearDownloads();
     *   console.log('下载任务已清除');
     * } catch (error) {
     *   console.error('清除下载任务失败:', error);
     * }
     * ```
     */
    clearDownloads(state) {
        // 支持Promise方式
        if (arguments.length === 0 || typeof state !== 'function') {
            return new Promise((resolve, reject) => {
                try {
                    if (typeof plus === 'undefined') {
                        throw new Error('HTML5+ 环境不可用');
                    }

                    if (!plus.downloader) {
                        throw new Error('设备不支持下载功能');
                    }

                    plus.downloader.clear(state);

                    // 清理存储的下载任务
                    if (state === undefined) {
                        this.downloads.clear();
                        this.activeDownloads.clear();
                    }

                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }

        // 传统回调方式
        try {
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            if (!plus.downloader) {
                throw new Error('设备不支持下载功能');
            }

            plus.downloader.clear(state);

            // 清理存储的下载任务
            if (state === undefined) {
                this.downloads.clear();
                this.activeDownloads.clear();
            }

        } catch (error) {
            console.error('清除下载任务失败:', error);
        }
    }

    /**
     * 开始所有下载任务
     * @returns {Promise<void>|void}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await downloader.startAllDownloads();
     *   console.log('所有下载任务已开始');
     * } catch (error) {
     *   console.error('开始所有下载任务失败:', error);
     * }
     * ```
     */
    startAllDownloads() {
        // 支持Promise方式
        if (arguments.length === 0) {
            return new Promise((resolve, reject) => {
                try {
                    if (typeof plus === 'undefined') {
                        throw new Error('HTML5+ 环境不可用');
                    }

                    if (!plus.downloader) {
                        throw new Error('设备不支持下载功能');
                    }

                    plus.downloader.startAll();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }

        // 传统方式
        try {
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            if (!plus.downloader) {
                throw new Error('设备不支持下载功能');
            }

            plus.downloader.startAll();

        } catch (error) {
            console.error('开始所有下载任务失败:', error);
        }
    }

    /**
     * 包装下载任务对象，添加额外功能
     * @param {Object} download - 下载任务对象
     */
    wrapDownload(download) {
        const originalAbort = download.abort;
        const originalStart = download.start;
        const originalPause = download.pause;
        const originalResume = download.resume;
        const originalSetRequestHeader = download.setRequestHeader;
        const originalAddEventListener = download.addEventListener;

        // 包装abort方法
        download.abortPromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalAbort.call(download);
                    // 从存储中移除
                    if (this.downloads.has(download.id)) {
                        this.downloads.delete(download.id);
                    }
                    if (this.activeDownloads.has(download.id)) {
                        this.activeDownloads.delete(download.id);
                    }
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }.bind(this));
        };

        // 包装start方法
        download.startPromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalStart.call(download);
                    // 添加到活跃任务
                    this.activeDownloads.set(download.id, download);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }.bind(this));
        };

        // 包装pause方法
        download.pausePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalPause.call(download);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装resume方法
        download.resumePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalResume.call(download);
                    // 添加到活跃任务
                    this.activeDownloads.set(download.id, download);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }.bind(this));
        };

        // 包装setRequestHeader方法
        download.setRequestHeaderPromise = function(headerName, headerValue) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetRequestHeader.call(download, headerName, headerValue);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装addEventListener方法
        download.addEventListenerPromise = function(type, listener, capture) {
            return new Promise((resolve, reject) => {
                try {
                    originalAddEventListener.call(download, type, listener, capture);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加下载进度监听
        download.onProgress = function(callback) {
            return new Promise((resolve) => {
                const progressListener = (download, status) => {
                    if (download.state === DownloadState.DOWNLOADING) {
                        const progress = {
                            id: download.id,
                            url: download.url,
                            state: download.state,
                            downloadedSize: download.downloadedSize || 0,
                            totalSize: download.totalSize || 0,
                            percentage: download.totalSize > 0
                                ? Math.round((download.downloadedSize || 0) / download.totalSize * 100)
                                : 0,
                            status: status
                        };
                        callback(progress);
                    }
                };

                download.addEventListener(DownloadEventType.STATE_CHANGED, progressListener, false);
                resolve();
            });
        };
    }

    /**
     * 判断设备是否支持下载功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await downloader.isSupported();
     * if (isSupported) {
     *   console.log('设备支持下载功能');
     * } else {
     *   console.log('设备不支持下载功能');
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

                resolve(!!plus.downloader);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的下载任务信息
     * @returns {Array<Object>} 活跃下载任务信息数组
     *
     * @example
     * ```javascript
     * const activeDownloads = downloader.getActiveDownloads();
     * console.log('活跃下载任务数量:', activeDownloads.length);
     * activeDownloads.forEach(task => {
     *   console.log('任务ID:', task.id);
     *   console.log('下载进度:', task.percentage + '%');
     * });
     * ```
     */
    getActiveDownloads() {
        const downloads = [];
        this.activeDownloads.forEach((download, id) => {
            downloads.push({
                id: id,
                url: download.url,
                state: download.state,
                downloadedSize: download.downloadedSize || 0,
                totalSize: download.totalSize || 0,
                percentage: download.totalSize > 0
                    ? Math.round((download.downloadedSize || 0) / download.totalSize * 100)
                    : 0,
                filename: download.filename || ''
            });
        });
        return downloads;
    }

    /**
     * 获取所有存储的下载任务信息
     * @returns {Array<Object>} 下载任务信息数组
     *
     * @example
     * ```javascript
     * const allDownloads = downloader.getAllDownloads();
     * console.log('所有下载任务数量:', allDownloads.length);
     * ```
     */
    getAllDownloads() {
        const downloads = [];
        this.downloads.forEach((download, id) => {
            downloads.push({
                id: id,
                url: download.url,
                state: download.state,
                downloadedSize: download.downloadedSize || 0,
                totalSize: download.totalSize || 0,
                percentage: download.totalSize > 0
                    ? Math.round((download.downloadedSize || 0) / download.totalSize * 100)
                    : 0,
                filename: download.filename || '',
                isActive: this.activeDownloads.has(id)
            });
        });
        return downloads;
    }

    /**
     * 获取下载任务状态名称
     * @param {number} state - 下载任务状态常量
     * @returns {string} 下载任务状态名称
     *
     * @example
     * ```javascript
     * const stateName = downloader.getStateName(downloader.DownloadState.DOWNLOADING);
     * console.log('下载状态:', stateName); // 输出: 下载任务接收数据
     * ```
     */
    getStateName(state) {
        const stateNames = {
            [DownloadState.UNDEFINED]: '下载任务未开始',
            [DownloadState.SCHEDULED]: '下载任务开始调度',
            [DownloadState.REQUESTING]: '下载任务开始请求',
            [DownloadState.REQUESTED]: '下载任务请求已经接收',
            [DownloadState.DOWNLOADING]: '下载任务接收数据',
            [DownloadState.COMPLETED]: '下载任务已完成',
            [DownloadState.PAUSED]: '下载任务已暂停',
            [DownloadState.ENUMERATE]: '枚举任务状态'
        };

        return stateNames[state] || '未知状态';
    }

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     *
     * @example
     * ```javascript
     * const size = downloader.formatFileSize(1024 * 1024);
     * console.log('文件大小:', size); // 输出: 1MB
     * ```
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 创建下载任务参数
     * @param {Object} options - 选项参数
     * @returns {DownloadOptions} 下载任务参数
     *
     * @example
     * ```javascript
     * const downloadOptions = downloader.createDownloadOptions({
     *   method: 'POST',
     *   data: JSON.stringify({name: 'test'}),
     *   filename: '_downloads/test.json',
     *   priority: 1,
     *   timeout: 60
     * });
     * ```
     */
    createDownloadOptions(options) {
        return {
            method: options && options.method || 'GET',
            data: options && options.data || undefined,
            filename: options && options.filename || undefined,
            priority: options && typeof options.priority === 'number' ? options.priority : 0,
            timeout: options && typeof options.timeout === 'number' ? options.timeout : 120,
            retry: options && typeof options.retry === 'number' ? options.retry : 3,
            retryInterval: options && typeof options.retryInterval === 'number' ? options.retryInterval : 30
        };
    }
}

// 创建Downloader模块实例
const downloader = new DownloaderModule();

// 导出模块
export default downloader;

// 导出常量
export { DownloadEventType, DownloadState };

// 也可以导出类以便创建多个实例
export { DownloaderModule };