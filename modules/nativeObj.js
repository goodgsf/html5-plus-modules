/**
 * HTML5+ NativeObj 模块 ES Module 封装
 *
 * 该模块提供了对原生对象的管理能力
 * 支持位图操作、原生视图控件、图片轮播、动画和绘图等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 动画选项配置对象
 * @typedef {Object} AnimationOptions
 * @property {string} [type] - 动画类型
 * @property {number} [duration] - 动画持续时间，单位毫秒
 * @property {number} [delay] - 动画延迟时间，单位毫秒
 * @property {number} [frames] - 动画帧数
 * @property {string} [timingFunction] - 动画时间函数
 * @property {Object} [styles] - 动画样式
 */

/**
 * 动画视图样式配置对象
 * @typedef {Object} AnimationViewStyles
 * @property {string} id - 动画视图标识
 * @property {number} left - 距离容器左侧的距离
 * @property {number} top - 距离容器顶部的距离
 * @property {number} width - 动画视图的宽度
 * @property {number} height - 动画视图的高度
 * @property {number} [frames] - 动画帧数
 * @property {AnimationOptions} [options] - 动画选项
 */

/**
 * 位置对象
 * @typedef {Object} Position
 * @property {number} left - 距离容器左侧的距离
 * @property {number} top - 距离容器顶部的距离
 * @property {number} width - 宽度
 * @property {number} height - 高度
 */

/**
 * 矩形区域对象
 * @typedef {Object} Rect
 * @property {number} x - X坐标
 * @property {number} y - Y坐标
 * @property {number} width - 宽度
 * @property {number} height - 高度
 */

/**
 * 文本样式对象
 * @typedef {Object} TextStyles
 * @property {string} [color='#000000'] - 文本颜色
 * @property {string} [size='16px'] - 文本大小
 * @property {string} [align='left'] - 文本对齐方式
 * @property {string} [weight='normal'] - 文本粗细
 * @property {string} [style='normal'] - 文本样式
 * @property {string} [family='sans-serif'] - 文本字体
 * @property {string} [lineHeight='normal'] - 行高
 * @property {number} [overflow='ellipsis'] - 文本溢出处理方式
 */

/**
 * 矩形样式对象
 * @typedef {Object} RectStyles
 * @property {string} [color='#000000'] - 填充颜色
 * @property {string} [borderColor='#000000'] - 边框颜色
 * @property {number} [borderWidth=1] - 边框宽度
 * @property {number} [radius=0] - 圆角半径
 */

/**
 * 视图样式对象
 * @typedef {Object} ViewStyles
 * @property {string} id - 视图标识
 * @property {number} left - 距离容器左侧的距离
 * @property {number} top - 距离容器顶部的距离
 * @property {number} width - 视图宽度
 * @property {number} height - 视图高度
 * @property {string} [backgroundColor] - 背景颜色
 * @property {number} [opacity=1] - 透明度
 * @property {number} [radius=0] - 圆角半径
 * @property {boolean} [visible=true] - 是否可见
 */

/**
 * 图片样式对象
 * @typedef {Object} ImageStyles
 * @property {string} id - 图片标识
 * @property {number} left - 距离容器左侧的距离
 * @property {number} top - 距离容器顶部的距离
 * @property {number} width - 图片宽度
 * @property {number} height - 图片高度
 * @property {string} [mode='aspectFit'] - 图片缩放模式
 */

/**
 * 图片轮播样式对象
 * @typedef {Object} ImageSliderStyles
 * @property {string} id - 轮播控件标识
 * @property {number} left - 距离容器左侧的距离
 * @property {number} top - 距离容器顶部的距离
 * @property {number} width - 轮播控件宽度
 * @property {number} height - 轮播控件高度
 * @property {number} [interval=3000] - 轮播间隔时间
 * @property {boolean} [loop=true] - 是否循环轮播
 * @property {boolean} [autoPlay=true] - 是否自动播放
 */

/**
 * 原生对象错误代码常量
 * @readonly
 * @enum {number}
 */
export const NativeObjErrorCode = {
    INVALID_BITMAP: 1,           // 无效的位图对象
    INVALID_VIEW: 2,             // 无效的视图对象
    INVALID_IMAGE: 3,            // 无效的图片对象
    INVALID_SLIDER: 4,           // 无效的轮播控件对象
    INVALID_OPERATION: 5,        // 无效的操作
    LOAD_FAILED: 6,               // 加载失败
    SAVE_FAILED: 7,               // 保存失败
    DRAW_FAILED: 8,               // 绘制失败
    ANIMATION_FAILED: 9,         // 动画失败
    OUT_OF_MEMORY: 10,            // 内存不足
    PERMISSION_DENIED: 11,        // 权限拒绝
    UNKNOWN_ERROR: 12             // 未知错误
};

/**
 * 图片缩放模式常量
 * @readonly
 * @enum {string}
 */
export const ImageMode = {
    ASPECT_FIT: 'aspectFit',       // 保持纵横比缩放图片，使图片的长边能完全显示出来
    ASPECT_FILL: 'aspectFill',     // 保持纵横比缩放图片，使图片的短边能完全显示出来
    STRETCH: 'stretch'            // 不保持纵横比，拉伸图片以填满容器
};

/**
 * 文本对齐方式常量
 * @readonly
 * @enum {string}
 */
export const TextAlign = {
    LEFT: 'left',                 // 左对齐
    CENTER: 'center',             // 居中对齐
    RIGHT: 'right'                // 右对齐
};

/**
 * 文本溢出处理方式常量
 * @readonly
 * @enum {string}
 */
export const TextOverflow = {
    CLIP: 'clip',                 // 裁剪文本
    ELLIPSIS: 'ellipsis',         // 用省略号替代超出部分
    BREAK: 'break'                // 强制换行
};

/**
 * 位图成功回调函数
 * @callback BitmapSuccessCallback
 * @param {Object} bitmap - 位图对象
 */

/**
 * 位图操作成功回调函数
 * @callback BitmapOperationSuccessCallback
 */

/**
 * 位图操作失败回调函数
 * @callback BitmapErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 视图成功回调函数
 * @callback ViewSuccessCallback
 * @param {Object} view - 视图对象
 */

/**
 * 视图操作成功回调函数
 * @callback ViewOperationSuccessCallback
 */

/**
 * 视图操作失败回调函数
 * @callback ViewErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 位图对象类
 */
class Bitmap {
    /**
     * 创建位图对象
     * @param {Object} nativeBitmap - 原生位图对象
     */
    constructor(nativeBitmap) {
        this._bitmap = nativeBitmap;
    }

    /**
     * 加载图片
     * @param {string} path - 图片路径
     * @param {BitmapSuccessCallback} [successCB] - 成功回调函数
     * @param {BitmapErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<Bitmap>} 返回位图对象
     * @throws {Error} 如果加载失败
     */
    load(path, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.load(path, resolve, reject);
            });
        }

        try {
            if (!path || typeof path !== 'string') {
                throw {
                    code: NativeObjErrorCode.INVALID_BITMAP,
                    message: '图片路径不能为空'
                };
            }

            this._bitmap.load(path,
                (bitmap) => {
                    if (successCB) {
                        successCB(new Bitmap(bitmap));
                    }
                },
                errorCB
            );

        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: error.code || NativeObjErrorCode.LOAD_FAILED,
                    message: error.message || '加载图片失败'
                });
            }
            throw error;
        }
    }

    /**
     * 加载Base64图片数据
     * @param {string} data - Base64图片数据
     * @param {BitmapSuccessCallback} [successCB] - 成功回调函数
     * @param {BitmapErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<Bitmap>} 返回位图对象
     * @throws {Error} 如果加载失败
     */
    loadBase64Data(data, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.loadBase64Data(data, resolve, reject);
            });
        }

        try {
            if (!data || typeof data !== 'string') {
                throw {
                    code: NativeObjErrorCode.INVALID_BITMAP,
                    message: 'Base64数据不能为空'
                };
            }

            this._bitmap.loadBase64Data(data,
                (bitmap) => {
                    if (successCB) {
                        successCB(new Bitmap(bitmap));
                    }
                },
                errorCB
            );

        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: error.code || NativeObjErrorCode.LOAD_FAILED,
                    message: error.message || '加载Base64图片失败'
                });
            }
            throw error;
        }
    }

    /**
     * 清除位图内容
     * @throws {Error} 如果清除失败
     */
    clear() {
        try {
            this._bitmap.clear();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '清除位图失败'
            };
        }
    }

    /**
     * 回收位图资源
     * @throws {Error} 如果回收失败
     */
    recycle() {
        try {
            this._bitmap.recycle();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '回收位图资源失败'
            };
        }
    }

    /**
     * 保存位图到文件
     * @param {string} path - 保存路径
     * @param {Object} [options] - 保存选项
     * @param {string} [options.format='png'] - 保存格式
     * @param {number} [options.quality=100] - 保存质量
     * @param {BitmapOperationSuccessCallback} [successCB] - 成功回调函数
     * @param {BitmapErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果保存失败
     */
    save(path, options = {}, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.save(path, options, resolve, reject);
            });
        }

        try {
            if (!path || typeof path !== 'string') {
                throw {
                    code: NativeObjErrorCode.INVALID_BITMAP,
                    message: '保存路径不能为空'
                };
            }

            this._bitmap.save(path, options, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: error.code || NativeObjErrorCode.SAVE_FAILED,
                    message: error.message || '保存位图失败'
                });
            }
            throw error;
        }
    }

    /**
     * 获取位图的Base64数据
     * @returns {string} Base64数据
     * @throws {Error} 如果获取失败
     */
    toBase64Data() {
        try {
            return this._bitmap.toBase64Data();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '获取Base64数据失败'
            };
        }
    }
}

/**
 * 视图对象类
 */
class View {
    /**
     * 创建视图对象
     * @param {Object} nativeView - 原生视图对象
     */
    constructor(nativeView) {
        this._view = nativeView;
    }

    /**
     * 显示视图
     * @throws {Error} 如果显示失败
     */
    show() {
        try {
            this._view.show();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '显示视图失败'
            };
        }
    }

    /**
     * 关闭视图
     * @throws {Error} 如果关闭失败
     */
    close() {
        try {
            this._view.close();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '关闭视图失败'
            };
        }
    }

    /**
     * 绘制标签
     * @param {Array} tags - 标签数组
     * @throws {Error} 如果绘制失败
     */
    draw(tags) {
        try {
            if (!Array.isArray(tags)) {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '标签必须是数组'
                };
            }
            this._view.draw(tags);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.DRAW_FAILED,
                message: '绘制标签失败'
            };
        }
    }

    /**
     * 绘制矩形
     * @param {RectStyles} styles - 矩形样式
     * @param {Position} position - 位置信息
     * @throws {Error} 如果绘制失败
     */
    drawRect(styles, position) {
        try {
            if (!styles || typeof styles !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '矩形样式不能为空'
                };
            }
            if (!position || typeof position !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '位置信息不能为空'
                };
            }
            this._view.drawRect(styles, position);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.DRAW_FAILED,
                message: '绘制矩形失败'
            };
        }
    }

    /**
     * 绘制文本
     * @param {string} text - 文本内容
     * @param {Position} position - 位置信息
     * @param {TextStyles} styles - 文本样式
     * @throws {Error} 如果绘制失败
     */
    drawText(text, position, styles) {
        try {
            if (!text || typeof text !== 'string') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '文本内容不能为空'
                };
            }
            if (!position || typeof position !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '位置信息不能为空'
                };
            }
            if (!styles || typeof styles !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '文本样式不能为空'
                };
            }
            this._view.drawText(text, position, styles);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.DRAW_FAILED,
                message: '绘制文本失败'
            };
        }
    }

    /**
     * 绘制位图
     * @param {Bitmap} bitmap - 位图对象
     * @param {Rect} src - 源矩形区域
     * @param {Position} position - 目标位置
     * @throws {Error} 如果绘制失败
     */
    drawBitmap(bitmap, src, position) {
        try {
            if (!bitmap || !(bitmap instanceof Bitmap)) {
                throw {
                    code: NativeObjErrorCode.INVALID_BITMAP,
                    message: '位图对象无效'
                };
            }
            if (!src || typeof src !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '源矩形区域不能为空'
                };
            }
            if (!position || typeof position !== 'object') {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '目标位置不能为空'
                };
            }
            this._view.drawBitmap(bitmap._bitmap, src, position);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.DRAW_FAILED,
                message: '绘制位图失败'
            };
        }
    }
}

/**
 * 图片轮播控件类
 */
class ImageSlider extends View {
    /**
     * 创建图片轮播控件对象
     * @param {Object} nativeImageSlider - 原生图片轮播控件对象
     */
    constructor(nativeImageSlider) {
        super(nativeImageSlider);
        this._slider = nativeImageSlider;
    }

    /**
     * 添加图片到轮播控件
     * @param {Array} images - 图片路径数组
     * @throws {Error} 如果添加失败
     */
    addImages(images) {
        try {
            if (!Array.isArray(images)) {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '图片路径必须是数组'
                };
            }
            this._slider.addImages(images);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '添加图片失败'
            };
        }
    }

    /**
     * 获取当前显示的图片索引
     * @returns {number} 当前图片索引
     * @throws {Error} 如果获取失败
     */
    currentImageIndex() {
        try {
            return this._slider.currentImageIndex();
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '获取当前图片索引失败'
            };
        }
    }

    /**
     * 设置轮播控件的图片
     * @param {Array} images - 图片路径数组
     * @throws {Error} 如果设置失败
     */
    setImages(images) {
        try {
            if (!Array.isArray(images)) {
                throw {
                    code: NativeObjErrorCode.INVALID_OPERATION,
                    message: '图片路径必须是数组'
                };
            }
            this._slider.setImages(images);
        } catch (error) {
            throw {
                code: NativeObjErrorCode.INVALID_OPERATION,
                message: '设置图片失败'
            };
        }
    }
}

/**
 * NativeObj模块类
 */
class NativeObjModule {
    constructor() {
        this.activeBitmaps = new Map(); // 存储活跃的位图对象
        this.activeViews = new Map(); // 存储活跃的视图对象
        this.activeSliders = new Map(); // 存储活跃的轮播控件对象
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.nativeObj) {
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
     * 创建位图对象
     * @param {number} width - 位图宽度
     * @param {number} height - 位图高度
     * @returns {Bitmap} 位图对象
     * @throws {Error} 如果创建失败
     */
    createBitmap(width, height) {
        try {
            this.checkPlusEnvironment();

            if (typeof width !== 'number' || width <= 0) {
                throw this.createError(
                    NativeObjErrorCode.INVALID_BITMAP,
                    '位图宽度必须大于0'
                );
            }

            if (typeof height !== 'number' || height <= 0) {
                throw this.createError(
                    NativeObjErrorCode.INVALID_BITMAP,
                    '位图高度必须大于0'
                );
            }

            const bitmap = new plus.nativeObj.Bitmap(`bitmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            const wrapperBitmap = new Bitmap(bitmap);

            // 存储位图引用
            const bitmapId = Date.now().toString();
            this.activeBitmaps.set(bitmapId, wrapperBitmap);

            return wrapperBitmap;

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                NativeObjErrorCode.INVALID_BITMAP,
                `创建位图失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 创建视图对象
     * @param {ViewStyles} styles - 视图样式
     * @returns {View} 视图对象
     * @throws {Error} 如果创建失败
     */
    createView(styles) {
        try {
            this.checkPlusEnvironment();

            if (!styles || typeof styles !== 'object') {
                throw this.createError(
                    NativeObjErrorCode.INVALID_VIEW,
                    '视图样式不能为空'
                );
            }

            if (!styles.id || typeof styles.id !== 'string') {
                throw this.createError(
                    NativeObjErrorCode.INVALID_VIEW,
                    '视图标识不能为空'
                );
            }

            const view = new plus.nativeObj.View(styles.id, styles);
            const wrapperView = new View(view);

            // 存储视图引用
            this.activeViews.set(styles.id, wrapperView);

            return wrapperView;

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                NativeObjErrorCode.INVALID_VIEW,
                `创建视图失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 创建图片轮播控件对象
     * @param {ImageSliderStyles} styles - 轮播控件样式
     * @returns {ImageSlider} 图片轮播控件对象
     * @throws {Error} 如果创建失败
     */
    createImageSlider(styles) {
        try {
            this.checkPlusEnvironment();

            if (!styles || typeof styles !== 'object') {
                throw this.createError(
                    NativeObjErrorCode.INVALID_SLIDER,
                    '轮播控件样式不能为空'
                );
            }

            if (!styles.id || typeof styles.id !== 'string') {
                throw this.createError(
                    NativeObjErrorCode.INVALID_SLIDER,
                    '轮播控件标识不能为空'
                );
            }

            const slider = new plus.nativeObj.ImageSlider(styles.id, styles);
            const wrapperSlider = new ImageSlider(slider);

            // 存储轮播控件引用
            this.activeSliders.set(styles.id, wrapperSlider);

            return wrapperSlider;

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                NativeObjErrorCode.INVALID_SLIDER,
                `创建图片轮播控件失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 简化的创建位图方法，自动处理错误
     * @param {number} width - 位图宽度
     * @param {number} height - 位图高度
     * @returns {Bitmap|null} 成功返回位图对象，失败返回null
     */
    quickCreateBitmap(width, height) {
        try {
            return this.createBitmap(width, height);
        } catch (error) {
            console.warn('创建位图失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的创建视图方法，自动处理错误
     * @param {ViewStyles} styles - 视图样式
     * @returns {View|null} 成功返回视图对象，失败返回null
     */
    quickCreateView(styles) {
        try {
            return this.createView(styles);
        } catch (error) {
            console.warn('创建视图失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的创建图片轮播控件方法，自动处理错误
     * @param {ImageSliderStyles} styles - 轮播控件样式
     * @returns {ImageSlider|null} 成功返回轮播控件对象，失败返回null
     */
    quickCreateImageSlider(styles) {
        try {
            return this.createImageSlider(styles);
        } catch (error) {
            console.warn('创建图片轮播控件失败:', error.message);
            return null;
        }
    }

    /**
     * 判断设备是否支持原生对象功能
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

    /**
     * 获取当前活跃的位图数量
     * @returns {number} 活跃位图数量
     */
    getActiveBitmapsCount() {
        return this.activeBitmaps.size;
    }

    /**
     * 获取当前活跃的视图数量
     * @returns {number} 活跃视图数量
     */
    getActiveViewsCount() {
        return this.activeViews.size;
    }

    /**
     * 获取当前活跃的轮播控件数量
     * @returns {number} 活跃轮播控件数量
     */
    getActiveSlidersCount() {
        return this.activeSliders.size;
    }

    /**
     * 清理所有活跃对象
     */
    clearAllActiveObjects() {
        // 清理位图
        for (const bitmap of this.activeBitmaps.values()) {
            try {
                bitmap.recycle();
            } catch (error) {
                console.warn('回收位图资源失败:', error.message);
            }
        }
        this.activeBitmaps.clear();

        // 清理视图
        for (const view of this.activeViews.values()) {
            try {
                view.close();
            } catch (error) {
                console.warn('关闭视图失败:', error.message);
            }
        }
        this.activeViews.clear();

        // 清理轮播控件
        for (const slider of this.activeSliders.values()) {
            try {
                slider.close();
            } catch (error) {
                console.warn('关闭轮播控件失败:', error.message);
            }
        }
        this.activeSliders.clear();
    }
}

// 创建NativeObj模块实例
const nativeObj = new NativeObjModule();

// 导出模块
export default nativeObj;

// 导出常量和类
export {
    Bitmap,
    View,
    ImageSlider,
    NativeObjErrorCode,
    ImageMode,
    TextAlign,
    TextOverflow
};