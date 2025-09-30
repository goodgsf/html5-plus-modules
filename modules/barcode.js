/**
 * HTML5+ Barcode 模块 ES Module 封装
 *
 * 该模块提供了条码（一维码和二维码）扫描识别功能
 * 支持常见的条码类型如QR码、EAN码、Code128等
 * 遵循HTML5+官方API规范
 */

/**
 * 条码类型常量
 */
export const BarcodeType = {
    QR: 0,           // QR二维码
    EAN13: 1,        // EAN条形码标准版
    EAN8: 2,         // ENA条形码简版
    AZTEC: 3,        // Aztec二维码
    DATAMATRIX: 4,   // Data Matrix二维码
    UPCA: 5,         // UPC条形码标准版
    UPCE: 6,         // UPC条形码缩短版
    CODABAR: 7,      // Codabar条形码
    CODE39: 8,       // Code39条形码
    CODE93: 9,       // Code93条形码
    CODE128: 10,     // Code128条形码
    ITF: 11,         // ITF条形码
    PDF417: 13       // PDF 417二维条码
};

/**
 * 条码识别控件样式
 * @typedef {Object} BarcodeStyles
 * @property {string} [background] - 条码识别控件背景颜色，默认红色
 * @property {string} [frameColor] - 扫码框颜色，默认红色
 * @property {string} [scanbarColor] - 扫码条颜色，默认红色
 * @property {string} [top] - 控件左上角的垂直偏移量，如"100px"、"10%"、"auto"
 * @property {string} [left] - 控件左上角的水平偏移量，如"100px"、"10%"、"auto"，默认"0px"
 * @property {string} [width] - 控件宽度，如"100px"、"10%"，默认"100%"
 * @property {string} [height] - 控件高度，如"100px"、"10%"，默认"100%"
 * @property {string} [position] - 布局模式，"static"（随窗口滚动）或"absolute"（不随窗口滚动），默认"static"
 */

/**
 * 条码识别控件扫描参数
 * @typedef {Object} BarcodeOptions
 * @property {boolean} [conserve] - 是否保存扫码成功时的截图，默认false
 * @property {string} [filename] - 保存图片的路径和名称，必须是.png格式
 * @property {boolean} [vibrate] - 扫码成功时是否震动提醒，默认true
 * @property {string} [sound] - 扫码成功时的提示音，"none"或"default"，默认"default"
 */

/**
 * 扫码识别成功回调函数
 * @callback BarcodeSuccessCallback
 * @param {number} type - 识别到的条码类型
 * @param {string} code - 识别到的条码数据
 * @param {string} [file] - 扫码成功的截图文件路径（可选）
 * @param {string} [charset] - 识别到原始数据的字符集类型（可选）
 */

/**
 * 扫码识别错误回调函数
 * @callback BarcodeErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 扫码识别控件对象
 * @typedef {Object} Barcode
 * @property {function} start - 开始扫码识别
 * @property {function} cancel - 取消扫码识别
 * @property {function} close - 关闭条码识别控件
 * @property {function} setFlash - 操作闪光灯
 * @property {function} setStyle - 设置扫码识别控件的样式
 * @property {BarcodeSuccessCallback} onmarked - 扫码识别成功事件
 * @property {BarcodeErrorCallback} onerror - 扫码识别错误事件
 */

/**
 * 条码识别结果对象
 * @typedef {Object} BarcodeResult
 * @property {number} type - 条码类型
 * @property {string} code - 条码数据内容
 * @property {string} [file] - 截图文件路径（可选）
 * @property {string} [charset] - 字符集类型（可选）
 */

/**
 * Barcode模块类
 */
class BarcodeModule {
    constructor() {
        this.barcodes = new Map(); // 存储条码识别控件
    }

    /**
     * 扫码识别图片中的条码
     * @param {string} path - 要扫码的图片路径
     * @param {BarcodeSuccessCallback} successCB - 扫码识别成功回调函数
     * @param {BarcodeErrorCallback} [errorCB] - 扫码识别失败回调函数
     * @param {number[]} [filters] - 条码类型过滤器数组
     * @param {boolean} [autoDecodeCharset] - 自动解码字符集
     * @returns {Promise<BarcodeResult>|void} 扫码识别结果
     * @throws {Error} 如果扫码识别失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const result = await barcode.scan('_www/barcode.png', null, null, [barcode.QR]);
     *   console.log('扫码成功:', result.type, result.code);
     * } catch (error) {
     *   console.error('扫码失败:', error);
     * }
     * ```
     */
    scan(path, successCB, errorCB, filters, autoDecodeCharset) {
        // 如果只传入了path且没有successCB，支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.scan(path, resolve, reject, errorCB, filters);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查条码模块是否可用
            if (!plus.barcode) {
                throw new Error('设备不支持条码识别功能');
            }

            // 检查路径参数
            if (!path || typeof path !== 'string') {
                throw new Error('图片路径不能为空');
            }

            // 调用原生API
            plus.barcode.scan(path, (type, code, file, charset) => {
                const result = {
                    type: type,
                    code: code,
                    file: file,
                    charset: charset
                };
                successCB(result);
            }, errorCB || null, filters, autoDecodeCharset);

        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 创建扫码识别控件对象
     * @param {string} id - 扫码识别控件的标识
     * @param {number[]} [filters] - 条码类型过滤器数组
     * @param {BarcodeStyles} [styles] - 扫码识别控件样式
     * @param {boolean} [autoDecodeCharset] - 自动解码字符集
     * @returns {Promise<Barcode>|Barcode} 扫码识别控件对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const barcode = await barcode.create('barcode', [barcode.QR], {
     *     top: '100px',
     *     left: '0px',
     *     width: '100%',
     *     height: '500px',
     *     position: 'static'
     *   });
     *   console.log('条码控件创建成功');
     * } catch (error) {
     *   console.error('创建条码控件失败:', error);
     * }
     * ```
     */
    create(id, filters, styles, autoDecodeCharset) {
        // 如果没有传入id，支持Promise方式
        if (typeof id === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('id参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查条码模块是否可用
            if (!plus.barcode) {
                throw new Error('设备不支持条码识别功能');
            }

            // 检查id参数
            if (!id || typeof id !== 'string') {
                throw new Error('控件标识不能为空');
            }

            // 创建条码识别控件
            const barcode = plus.barcode.create(id, filters || [], styles || {}, autoDecodeCharset || false);

            // 存储控件
            this.barcodes.set(id, barcode);

            // 添加包装方法
            this.wrapBarcode(barcode, id);

            return barcode;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 查找扫码识别控件对象
     * @param {string} id - 扫码识别控件的标识
     * @returns {Barcode|null} 扫码识别控件对象
     *
     * @example
     * ```javascript
     * const barcode = barcode.getBarcodeById('barcode');
     * if (barcode) {
     *   console.log('找到条码控件');
     *   barcode.start();
     * } else {
     *   console.log('未找到条码控件');
     * }
     * ```
     */
    getBarcodeById(id) {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                return null;
            }

            // 检查条码模块是否可用
            if (!plus.barcode) {
                return null;
            }

            // 调用原生API
            return plus.barcode.getBarcodeById(id);

        } catch (error) {
            console.error('查找条码控件失败:', error);
            return null;
        }
    }

    /**
     * 包装条码控件对象，添加额外功能
     * @param {Object} barcode - 条码控件对象
     * @param {string} id - 控件标识
     */
    wrapBarcode(barcode, id) {
        const originalStart = barcode.start;
        const originalCancel = barcode.cancel;
        const originalClose = barcode.close;
        const originalSetFlash = barcode.setFlash;
        const originalSetStyle = barcode.setStyle;

        // 包装start方法
        barcode.startPromise = function(options) {
            return new Promise((resolve, reject) => {
                try {
                    // 设置事件监听器
                    const originalOnmarked = barcode.onmarked;
                    const originalOnerror = barcode.onerror;

                    barcode.onmarked = function(type, code, file, charset) {
                        if (originalOnmarked) {
                            originalOnmarked(type, code, file, charset);
                        }
                        resolve({
                            type: type,
                            code: code,
                            file: file,
                            charset: charset
                        });
                    };

                    barcode.onerror = function(error) {
                        if (originalOnerror) {
                            originalOnerror(error);
                        }
                        reject(error);
                    };

                    // 调用原生方法
                    originalStart.call(barcode, options || {});

                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装cancel方法
        barcode.cancelPromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalCancel.call(barcode);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装close方法
        barcode.closePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    // 从存储中移除
                    if (this.barcodes.has(id)) {
                        this.barcodes.delete(id);
                    }
                    originalClose.call(barcode);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }.bind(this));
        };

        // 包装setFlash方法
        barcode.setFlashPromise = function(open) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetFlash.call(barcode, open);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装setStyle方法
        barcode.setStylePromise = function(styles) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetStyle.call(barcode, styles);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加事件监听Promise方法
        barcode.onmarkedPromise = function(callback) {
            return new Promise((resolve) => {
                barcode.onmarked = callback;
                resolve();
            });
        };

        barcode.onerrorPromise = function(callback) {
            return new Promise((resolve) => {
                barcode.onerror = callback;
                resolve();
            });
        };
    }

    /**
     * 判断设备是否支持条码识别功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await barcode.isSupported();
     * if (isSupported) {
     *   console.log('设备支持条码识别功能');
     * } else {
     *   console.log('设备不支持条码识别功能');
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

                resolve(!!plus.barcode);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的条码控件信息
     * @returns {Array<Object>} 活跃条码控件信息数组
     *
     * @example
     * ```javascript
     * const activeBarcodes = barcode.getActiveBarcodes();
     * console.log('活跃条码控件数量:', activeBarcodes.length);
     * activeBarcodes.forEach(barcode => {
     *   console.log('控件ID:', barcode.id);
     * });
     * ```
     */
    getActiveBarcodes() {
        const barcodes = [];
        this.barcodes.forEach((barcode, id) => {
            barcodes.push({
                id: id,
                isActive: typeof barcode.start === 'function'
            });
        });
        return barcodes;
    }

    /**
     * 关闭所有活跃的条码控件
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await barcode.closeAllBarcodes();
     * console.log('所有条码控件已关闭');
     * ```
     */
    closeAllBarcodes() {
        return new Promise((resolve, reject) => {
            try {
                const barcodeIds = Array.from(this.barcodes.keys());
                const promises = [];

                barcodeIds.forEach(id => {
                    const barcode = this.barcodes.get(id);
                    if (barcode && typeof barcode.close === 'function') {
                        promises.push(barcode.closePromise());
                    }
                });

                Promise.all(promises).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取条码类型名称
     * @param {number} type - 条码类型常量
     * @returns {string} 条码类型名称
     *
     * @example
     * ```javascript
     * const typeName = barcode.getTypeName(barcode.QR);
     * console.log('条码类型:', typeName); // 输出: QR二维码
     * ```
     */
    getTypeName(type) {
        const typeNames = {
            [BarcodeType.QR]: 'QR二维码',
            [BarcodeType.EAN13]: 'EAN条形码标准版',
            [BarcodeType.EAN8]: 'ENA条形码简版',
            [BarcodeType.AZTEC]: 'Aztec二维码',
            [BarcodeType.DATAMATRIX]: 'Data Matrix二维码',
            [BarcodeType.UPCA]: 'UPC条形码标准版',
            [BarcodeType.UPCE]: 'UPC条形码缩短版',
            [BarcodeType.CODABAR]: 'Codabar条形码',
            [BarcodeType.CODE39]: 'Code39条形码',
            [BarcodeType.CODE93]: 'Code93条形码',
            [BarcodeType.CODE128]: 'Code128条形码',
            [BarcodeType.ITF]: 'ITF条形码',
            [BarcodeType.PDF417]: 'PDF 417二维条码'
        };

        return typeNames[type] || '未知类型';
    }
}

// 创建Barcode模块实例
const barcode = new BarcodeModule();

// 导出模块
export default barcode;

// 导出常量
export { BarcodeType };

// 也可以导出类以便创建多个实例
export { BarcodeModule };