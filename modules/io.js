/**
 * HTML5+ IO 模块 ES Module 封装
 *
 * 该模块提供了对本地文件系统的访问能力
 * 支持目录浏览、文件读取、文件写入、文件信息获取等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 文件系统类型常量
 * @readonly
 * @enum {number}
 */
export const FileSystemType = {
    PRIVATE_WWW: 0,         // 应用私有资源目录，仅应用自身可读
    PRIVATE_DOC: 1,         // 应用私有文档目录，仅应用自身可读写
    PUBLIC_DOCUMENTS: 2,    // 应用公共文档目录，多应用时都可读写
    PUBLIC_DOWNLOADS: 3    // 应用公共下载目录，多应用时都可读写
};

/**
 * URL类型常量
 * @readonly
 * @enum {string}
 */
export const URLType = {
    RELATIVE: '_www',           // 相对路径URL，以"_"开头
    LOCAL: 'file://',          // 本地绝对路径URL，以"file://"开头
    REMOTE: 'http'             // 网络路径URL，以"http://"或"https://"开头
};

/**
 * IO错误代码常量
 * @readonly
 * @enum {number}
 */
export const IOErrorCode = {
    NOT_FOUND_ERR: 1,              // 文件或目录不存在
    SECURITY_ERR: 2,               // 安全错误，没有访问权限
    ABORT_ERR: 3,                  // 操作被中止
    NOT_READABLE_ERR: 4,           // 文件不可读
    ENCODING_ERR: 5,               // 编码错误
    NO_MODIFICATION_ALLOWED_ERR: 6, // 不允许修改
    INVALID_STATE_ERR: 7,          // 无效状态
    SYNTAX_ERR: 8,                 // 语法错误
    INVALID_MODIFICATION_ERR: 9,   // 无效修改
    QUOTA_EXCEEDED_ERR: 10,        // 配额超出
    TYPE_MISMATCH_ERR: 11,         // 类型不匹配
    PATH_EXISTS_ERR: 12            // 路径已存在
};

/**
 * 文件操作标志
 * @typedef {Object} Flags
 * @property {boolean} [create=false] - 如果文件或目录不存在则创建
 * @property {boolean} [exclusive=false] - 如果文件或目录已存在则返回错误
 */

/**
 * 文件或目录的元数据
 * @typedef {Object} Metadata
 * @property {number} modificationTime - 最后修改时间，时间戳
 * @property {number} [size] - 文件大小，单位字节
 * @property {number} [directoryCount] - 目录数（仅对目录有效）
 * @property {number} [fileCount] - 文件数（仅对目录有效）
 */

/**
 * 文件信息对象
 * @typedef {Object} FileInfo
 * @property {string} name - 文件名
 * @property {string} fullPath - 完整路径
 * @property {boolean} isFile - 是否为文件
 * @property {boolean} isDirectory - 是否为目录
 * @property {Metadata} metadata - 元数据信息
 */

/**
 * 音频文件信息对象
 * @typedef {Object} AudioInfo
 * @property {string} format - 音频格式
 * @property {number} duration - 音频时长，单位秒
 * @property {number} size - 文件大小，单位字节
 * @property {number} channels - 声道数
 * @property {number} sampleRate - 采样率
 * @property {number} bitRate - 比特率
 */

/**
 * 图片文件信息对象
 * @typedef {Object} ImageInfo
 * @property {string} format - 图片格式
 * @property {number} width - 图片宽度，单位像素
 * @property {number} height - 图片高度，单位像素
 * @property {number} size - 文件大小，单位字节
 * @property {number} orientation - 图片方向
 */

/**
 * 视频文件信息对象
 * @typedef {Object} VideoInfo
 * @property {string} format - 视频格式
 * @property {number} duration - 视频时长，单位秒
 * @property {number} size - 文件大小，单位字节
 * @property {number} width - 视频宽度，单位像素
 * @property {number} height - 视频高度，单位像素
 * @property {number} fps - 帧率
 * @property {number} bitRate - 比特率
 */

/**
 * 文件事件对象
 * @typedef {Object} FileEvent
 * @property {string} target - 事件目标
 * @property {string} type - 事件类型
 * @property {*} result - 事件结果
 */

/**
 * 文件系统成功回调函数
 * @callback FileSystemSuccessCallback
 * @param {Object} filesystem - 文件系统对象
 */

/**
 * 文件解析成功回调函数
 * @callback FileResolveSuccessCallback
 * @param {Object} entry - 文件或目录对象
 */

/**
 * 元数据成功回调函数
 * @callback MetadataSuccessCallback
 * @param {Metadata} metadata - 元数据信息
 */

/**
 * 文件条目成功回调函数
 * @callback EntrySuccessCallback
 * @param {Object} entry - 文件或目录对象
 */

/**
 * 文件条目列表成功回调函数
 * @callback EntrysSuccessCallback
 * @param {Array<Object>} entries - 文件或目录对象数组
 */

/**
 * 文件写入成功回调函数
 * @callback FileWriterSuccessCallback
 * @param {Object} writer - 文件写入对象
 */

/**
 * 文件成功回调函数
 * @callback FileSuccessCallback
 * @param {Object} file - 文件对象
 */

/**
 * IO操作成功回调函数
 * @callback IOSuccessCallback
 * @param {*} result - 操作结果
 */

/**
 * IO操作失败回调函数
 * @callback IOFailCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * IO操作完成回调函数
 * @callback IOCompleteCallback
 * @param {*} result - 操作结果
 */

/**
 * IO模块类
 */
class IOModule {
    constructor() {
        this.currentOperations = new Map(); // 存储当前操作
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.io) {
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
     * 格式化元数据
     * @private
     * @param {Object} nativeMetadata - 原生元数据
     * @returns {Metadata} 格式化后的元数据
     */
    formatMetadata(nativeMetadata) {
        return {
            modificationTime: nativeMetadata.modificationTime,
            size: nativeMetadata.size,
            directoryCount: nativeMetadata.directoryCount,
            fileCount: nativeMetadata.fileCount
        };
    }

    /**
     * 格式化文件信息
     * @private
     * @param {Object} nativeInfo - 原生文件信息
     * @returns {FileInfo} 格式化后的文件信息
     */
    formatFileInfo(nativeInfo) {
        return {
            name: nativeInfo.name,
            fullPath: nativeInfo.fullPath,
            isFile: nativeInfo.isFile,
            isDirectory: nativeInfo.isDirectory,
            metadata: this.formatMetadata(nativeInfo.metadata || {})
        };
    }

    /**
     * 格式化音频信息
     * @private
     * @param {Object} nativeInfo - 原生音频信息
     * @returns {AudioInfo} 格式化后的音频信息
     */
    formatAudioInfo(nativeInfo) {
        return {
            format: nativeInfo.format,
            duration: nativeInfo.duration,
            size: nativeInfo.size,
            channels: nativeInfo.channels,
            sampleRate: nativeInfo.sampleRate,
            bitRate: nativeInfo.bitRate
        };
    }

    /**
     * 格式化图片信息
     * @private
     * @param {Object} nativeInfo - 原生图片信息
     * @returns {ImageInfo} 格式化后的图片信息
     */
    formatImageInfo(nativeInfo) {
        return {
            format: nativeInfo.format,
            width: nativeInfo.width,
            height: nativeInfo.height,
            size: nativeInfo.size,
            orientation: nativeInfo.orientation
        };
    }

    /**
     * 格式化视频信息
     * @private
     * @param {Object} nativeInfo - 原生视频信息
     * @returns {VideoInfo} 格式化后的视频信息
     */
    formatVideoInfo(nativeInfo) {
        return {
            format: nativeInfo.format,
            duration: nativeInfo.duration,
            size: nativeInfo.size,
            width: nativeInfo.width,
            height: nativeInfo.height,
            fps: nativeInfo.fps,
            bitRate: nativeInfo.bitRate
        };
    }

    /**
     * 请求本地文件系统对象
     * @param {number} type - 文件系统类型
     * @param {FileSystemSuccessCallback} successCB - 成功回调函数
     * @param {IOFailCallback} [errorCB] - 失败回调函数
     * @returns {Promise<Object>} 返回文件系统对象
     * @throws {Error} 如果请求失败
     */
    requestFileSystem(type, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.requestFileSystem(type, resolve, reject);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (typeof type !== 'number' || type < 0 || type > 3) {
                throw this.createError(
                    IOErrorCode.INVALID_STATE_ERR,
                    '无效的文件系统类型'
                );
            }

            plus.io.requestFileSystem(type, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    error.message || '请求文件系统失败'
                ));
            } else {
                throw error;
            }
        }
    }

    /**
     * 通过URL参数获取目录对象或文件对象
     * @param {string} url - 要解析的URL地址
     * @param {FileResolveSuccessCallback} successCB - 成功回调函数
     * @param {IOFailCallback} [errorCB] - 失败回调函数
     * @returns {Promise<Object>} 返回文件或目录对象
     * @throws {Error} 如果解析失败
     */
    resolveLocalFileSystemURL(url, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.resolveLocalFileSystemURL(url, resolve, reject);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!url || typeof url !== 'string') {
                throw this.createError(
                    IOErrorCode.SYNTAX_ERR,
                    'URL地址不能为空'
                );
            }

            plus.io.resolveLocalFileSystemURL(url, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    error.message || '解析URL失败'
                ));
            } else {
                throw error;
            }
        }
    }

    /**
     * 将本地URL路径转换成平台绝对路径
     * @param {string} url - 要转换的本地URL地址
     * @returns {Promise<string>} 返回平台绝对路径
     * @throws {Error} 如果转换失败
     */
    convertLocalFileSystemURL(url) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!url || typeof url !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        'URL地址不能为空'
                    );
                }

                const result = plus.io.convertLocalFileSystemURL(url);
                resolve(result);

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    error.message || '转换URL失败'
                ));
            }
        });
    }

    /**
     * 将平台绝对路径转换成本地URL路径
     * @param {string} path - 要转换的平台绝对路径
     * @returns {Promise<string>} 返回本地URL路径
     * @throws {Error} 如果转换失败
     */
    convertAbsoluteFileSystem(path) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!path || typeof path !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        '路径不能为空'
                    );
                }

                const result = plus.io.convertAbsoluteFileSystem(path);
                resolve(result);

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    error.message || '转换路径失败'
                ));
            }
        });
    }

    /**
     * 获取音频文件信息
     * @param {string} path - 音频文件路径
     * @returns {Promise<AudioInfo>} 返回音频文件信息
     * @throws {Error} 如果获取失败
     */
    getAudioInfo(path) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!path || typeof path !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        '文件路径不能为空'
                    );
                }

                plus.io.getAudioInfo(
                    path,
                    (info) => {
                        resolve(this.formatAudioInfo(info));
                    },
                    (error) => {
                        reject(this.createError(
                            error.code || IOErrorCode.UNKNOWN_ERROR,
                            error.message || '获取音频文件信息失败'
                        ));
                    }
                );

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    `获取音频文件信息失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 获取文件信息
     * @param {string} path - 文件路径
     * @returns {Promise<FileInfo>} 返回文件信息
     * @throws {Error} 如果获取失败
     */
    getFileInfo(path) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!path || typeof path !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        '文件路径不能为空'
                    );
                }

                plus.io.getFileInfo(
                    path,
                    (info) => {
                        resolve(this.formatFileInfo(info));
                    },
                    (error) => {
                        reject(this.createError(
                            error.code || IOErrorCode.UNKNOWN_ERROR,
                            error.message || '获取文件信息失败'
                        ));
                    }
                );

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    `获取文件信息失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 获取图片信息
     * @param {string} path - 图片文件路径
     * @returns {Promise<ImageInfo>} 返回图片文件信息
     * @throws {Error} 如果获取失败
     */
    getImageInfo(path) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!path || typeof path !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        '文件路径不能为空'
                    );
                }

                plus.io.getImageInfo(
                    path,
                    (info) => {
                        resolve(this.formatImageInfo(info));
                    },
                    (error) => {
                        reject(this.createError(
                            error.code || IOErrorCode.UNKNOWN_ERROR,
                            error.message || '获取图片信息失败'
                        ));
                    }
                );

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    `获取图片信息失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 获取视频文件信息
     * @param {string} path - 视频文件路径
     * @returns {Promise<VideoInfo>} 返回视频文件信息
     * @throws {Error} 如果获取失败
     */
    getVideoInfo(path) {
        return new Promise((resolve, reject) => {
            try {
                this.checkPlusEnvironment();

                if (!path || typeof path !== 'string') {
                    throw this.createError(
                        IOErrorCode.SYNTAX_ERR,
                        '文件路径不能为空'
                    );
                }

                plus.io.getVideoInfo(
                    path,
                    (info) => {
                        resolve(this.formatVideoInfo(info));
                    },
                    (error) => {
                        reject(this.createError(
                            error.code || IOErrorCode.UNKNOWN_ERROR,
                            error.message || '获取视频文件信息失败'
                        ));
                    }
                );

            } catch (error) {
                reject(this.createError(
                    error.code || IOErrorCode.UNKNOWN_ERROR,
                    `获取视频文件信息失败: ${error.message || '未知错误'}`
                ));
            }
        });
    }

    /**
     * 简化的获取文件信息方法，自动处理错误
     * @param {string} path - 文件路径
     * @returns {Promise<FileInfo|null>} 成功返回文件信息，失败返回null
     */
    async quickGetFileInfo(path) {
        try {
            return await this.getFileInfo(path);
        } catch (error) {
            console.warn('获取文件信息失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的获取图片信息方法，自动处理错误
     * @param {string} path - 图片文件路径
     * @returns {Promise<ImageInfo|null>} 成功返回图片信息，失败返回null
     */
    async quickGetImageInfo(path) {
        try {
            return await this.getImageInfo(path);
        } catch (error) {
            console.warn('获取图片信息失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的获取音频信息方法，自动处理错误
     * @param {string} path - 音频文件路径
     * @returns {Promise<AudioInfo|null>} 成功返回音频信息，失败返回null
     */
    async quickGetAudioInfo(path) {
        try {
            return await this.getAudioInfo(path);
        } catch (error) {
            console.warn('获取音频信息失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的获取视频信息方法，自动处理错误
     * @param {string} path - 视频文件路径
     * @returns {Promise<VideoInfo|null>} 成功返回视频信息，失败返回null
     */
    async quickGetVideoInfo(path) {
        try {
            return await this.getVideoInfo(path);
        } catch (error) {
            console.warn('获取视频信息失败:', error.message);
            return null;
        }
    }

    /**
     * 判断设备是否支持IO功能
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

// 创建IO模块实例
const io = new IOModule();

// 导出模块
export default io;

// 导出常量
export { FileSystemType, URLType, IOErrorCode };