/**
 * HTML5+ Gallery 模块 ES Module 封装
 *
 * 该模块提供了对系统相册的访问能力
 * 支持从相册中选择图片或视频文件、保存图片或视频文件到相册等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 相册选择文件过滤类型
 * @readonly
 * @enum {string}
 */
export const GalleryFilter = {
    IMAGE: 'image',     // 仅可选择图片文件
    VIDEO: 'video',     // 仅可选择视频文件
    NONE: 'none'        // 不过滤，可选择图片或视频文件
};

/**
 * 保存图片到相册成功事件
 * @typedef {Object} GallerySaveEvent
 * @property {string} path - 保存到相册的文件路径
 */

/**
 * 从相册中选择文件的参数
 * @typedef {Object} GalleryOptions
 * @property {boolean} [animation=true] - 是否显示系统相册文件选择界面的动画
 * @property {string} [confirmText] - 确认按钮文字
 * @property {Object} [crop] - 配置裁剪图片
 * @property {boolean} [editable=true] - 是否支持编辑图片
 * @property {string} [filename] - 选择文件保存的路径
 * @property {string} [filter='image'] - 相册中选择文件类型过滤器
 * @property {number} [maximum] - 最多选择的图片数量
 * @property {boolean} [multiple=false] - 是否支持多选图片
 * @property {boolean} [permissionAlert=false] - 是否检测权限
 * @property {Object} [popover] - 相册选择界面弹出指示区域
 * @property {string[]} [selected] - 已选择的图片路径列表
 * @property {boolean} [system=false] - 是否使用系统相册文件选择界面
 * @property {Function} [onmaxed] - 超过最多选择图片数量事件
 */

/**
 * 裁剪图片设置项
 * @typedef {Object} GalleryCropStyles
 * @property {number} [quality=80] - 裁剪后保存图片的质量
 * @property {number} width - 裁剪的宽度
 * @property {number} height - 裁剪的高度
 * @property {boolean} [resize=true] - 是否将图片保存为指定的宽高像素
 * @property {boolean} [saveToAlbum=false] - 裁剪后的图片是否保存到相册中
 */

/**
 * 弹出界面指示位置
 * @typedef {Object} PopPosition
 * @property {string} [top] - 指示区域距离容器顶部的距离
 * @property {string} [left] - 指示区域距离容器左侧的距离
 * @property {string} [width] - 指示区域的宽度
 * @property {string} [height] - 指示区域的高度
 */

/**
 * 相册选择成功事件（多选）
 * @typedef {Object} GalleryMultiplePickEvent
 * @property {string[]} files - 选择的文件路径数组
 */

/**
 * 单选系统相册文件成功的回调函数
 * @callback GalleryPickSuccessCallback
 * @param {string} file - 选择的文件路径
 */

/**
 * 多选系统相册文件成功的回调函数
 * @callback GalleryMultiplePickSuccessCallback
 * @param {GalleryMultiplePickEvent} event - 多选返回数据
 */

/**
 * 操作系统相册成功的回调函数
 * @callback GallerySuccessCallback
 * @param {GallerySaveEvent} event - 保存成功事件对象
 */

/**
 * 系统相册操作失败的回调函数
 * @callback GalleryErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Gallery模块类
 */
class GalleryModule {
    constructor() {
        this.currentOperation = null;
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.gallery) {
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
     * 格式化选项参数
     * @private
     * @param {GalleryOptions} options - 选项参数
     * @returns {Object} 格式化后的选项
     */
    formatOptions(options = {}) {
        const formattedOptions = {
            animation: options.animation !== false,
            filter: options.filter || GalleryFilter.IMAGE,
            multiple: options.multiple || false,
            system: options.system || false
        };

        // 可选参数
        if (options.confirmText) formattedOptions.confirmText = options.confirmText;
        if (options.crop) formattedOptions.crop = options.crop;
        if (options.editable !== undefined) formattedOptions.editable = options.editable;
        if (options.filename) formattedOptions.filename = options.filename;
        if (options.maximum !== undefined) formattedOptions.maximum = options.maximum;
        if (options.permissionAlert !== undefined) formattedOptions.permissionAlert = options.permissionAlert;
        if (options.popover) formattedOptions.popover = options.popover;
        if (options.selected) formattedOptions.selected = options.selected;
        if (options.onmaxed) formattedOptions.onmaxed = options.onmaxed;

        return formattedOptions;
    }

    /**
     * 从系统相册选择文件（图片或视频）
     * @param {GalleryPickSuccessCallback|GalleryMultiplePickSuccessCallback} successFn - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @param {GalleryOptions} [options={}] - 选择文件的参数
     * @returns {Promise<string|GalleryMultiplePickEvent>} 返回选择的文件路径或文件数组
     * @throws {Error} 如果选择失败
     */
    async pick(successFn, errorFn, options = {}) {
        try {
            this.checkPlusEnvironment();

            return new Promise((resolve, reject) => {
                const formattedOptions = this.formatOptions(options);

                // 包装成功回调
                const wrappedSuccess = (result) => {
                    if (formattedOptions.multiple) {
                        // 多选返回格式：{files: [path1, path2, ...]}
                        const event = {
                            files: Array.isArray(result) ? result : [result]
                        };

                        if (successFn) {
                            successFn(event);
                        }
                        resolve(event);
                    } else {
                        // 单选返回格式：path
                        const path = typeof result === 'string' ? result : (result.files?.[0] || result);

                        if (successFn) {
                            successFn(path);
                        }
                        resolve(path);
                    }
                };

                // 包装错误回调
                const wrappedError = (error) => {
                    const formattedError = this.createError(
                        error.code || -1,
                        error.message || '相册选择失败'
                    );

                    if (errorFn) {
                        errorFn(formattedError);
                    }
                    reject(formattedError);
                };

                // 调用原生方法
                plus.gallery.pick(wrappedSuccess, wrappedError, formattedOptions);
            });

        } catch (error) {
            throw this.createError(
                -1,
                `相册选择失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 保存文件到系统相册中
     * @param {string} path - 要保存的文件路径
     * @param {GallerySuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @returns {Promise<GallerySaveEvent>} 返回保存成功事件
     * @throws {Error} 如果保存失败
     */
    async save(path, successFn, errorFn) {
        try {
            this.checkPlusEnvironment();

            if (!path || typeof path !== 'string') {
                throw this.createError(-1, '文件路径不能为空');
            }

            return new Promise((resolve, reject) => {
                // 包装成功回调
                const wrappedSuccess = (event) => {
                    const saveEvent = {
                        path: event.path || path
                    };

                    if (successFn) {
                        successFn(saveEvent);
                    }
                    resolve(saveEvent);
                };

                // 包装错误回调
                const wrappedError = (error) => {
                    const formattedError = this.createError(
                        error.code || -1,
                        error.message || '保存到相册失败'
                    );

                    if (errorFn) {
                        errorFn(formattedError);
                    }
                    reject(formattedError);
                };

                // 调用原生方法
                plus.gallery.save(path, wrappedSuccess, wrappedError);
            });

        } catch (error) {
            throw this.createError(
                -1,
                `保存到相册失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 从相册选择单个图片
     * @param {GalleryPickSuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<string>} 返回选择的图片路径
     */
    async pickImage(successFn, errorFn, options = {}) {
        return this.pick(successFn, errorFn, {
            ...options,
            filter: GalleryFilter.IMAGE,
            multiple: false
        });
    }

    /**
     * 从相册选择单个视频
     * @param {GalleryPickSuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<string>} 返回选择的视频路径
     */
    async pickVideo(successFn, errorFn, options = {}) {
        return this.pick(successFn, errorFn, {
            ...options,
            filter: GalleryFilter.VIDEO,
            multiple: false
        });
    }

    /**
     * 从相册选择多个图片
     * @param {GalleryMultiplePickSuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<GalleryMultiplePickEvent>} 返回选择的图片数组
     */
    async pickMultipleImages(successFn, errorFn, options = {}) {
        return this.pick(successFn, errorFn, {
            ...options,
            filter: GalleryFilter.IMAGE,
            multiple: true
        });
    }

    /**
     * 从相册选择多个视频
     * @param {GalleryMultiplePickSuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<GalleryMultiplePickEvent>} 返回选择的视频数组
     */
    async pickMultipleVideos(successFn, errorFn, options = {}) {
        return this.pick(successFn, errorFn, {
            ...options,
            filter: GalleryFilter.VIDEO,
            multiple: true
        });
    }

    /**
     * 保存图片到相册
     * @param {string} path - 图片路径
     * @param {GallerySuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @returns {Promise<GallerySaveEvent>} 返回保存成功事件
     */
    async saveImage(path, successFn, errorFn) {
        return this.save(path, successFn, errorFn);
    }

    /**
     * 保存视频到相册
     * @param {string} path - 视频路径
     * @param {GallerySuccessCallback} [successFn] - 成功回调函数
     * @param {GalleryErrorCallback} [errorFn] - 失败回调函数
     * @returns {Promise<GallerySaveEvent>} 返回保存成功事件
     */
    async saveVideo(path, successFn, errorFn) {
        return this.save(path, successFn, errorFn);
    }

    /**
     * 简化的图片选择方法，自动处理错误
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<string|null>} 成功返回图片路径，失败返回null
     */
    async quickPickImage(options = {}) {
        try {
            return await this.pickImage(null, null, options);
        } catch (error) {
            console.warn('选择图片失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的多图片选择方法，自动处理错误
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<string[]|null>} 成功返回图片路径数组，失败返回null
     */
    async quickPickMultipleImages(options = {}) {
        try {
            const result = await this.pickMultipleImages(null, null, options);
            return result.files;
        } catch (error) {
            console.warn('选择多张图片失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的视频选择方法，自动处理错误
     * @param {GalleryOptions} [options={}] - 选择参数
     * @returns {Promise<string|null>} 成功返回视频路径，失败返回null
     */
    async quickPickVideo(options = {}) {
        try {
            return await this.pickVideo(null, null, options);
        } catch (error) {
            console.warn('选择视频失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的保存方法，自动处理错误
     * @param {string} path - 文件路径
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickSave(path) {
        try {
            await this.save(path, null, null);
            return true;
        } catch (error) {
            console.warn('保存到相册失败:', error.message);
            return false;
        }
    }
}

// 创建模块实例
const gallery = new GalleryModule();

// 导出模块实例和常量
export { gallery as default };
export { gallery };
export { GalleryFilter };