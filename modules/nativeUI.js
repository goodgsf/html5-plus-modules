/**
 * HTML5+ NativeUI 模块 ES Module 封装
 *
 * 该模块提供了对设备原生用户界面控件的管理能力
 * 支持对话框、选择器、等待对话框、提示消息、图片预览等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 原生UI错误代码常量
 * @readonly
 * @enum {number}
 */
export const NativeUIErrorCode = {
    INVALID_PARAMETER: 1,       // 无效的参数
    UI_CREATE_FAILED: 2,        // UI创建失败
    OPERATION_FAILED: 3,        // 操作失败
    PERMISSION_DENIED: 4,      // 权限拒绝
    UNKNOWN_ERROR: 5            // 未知错误
};

/**
 * 动作表项类型
 * @typedef {Object} ActionSheetItem
 * @property {string} title - 按钮标题
 * @property {string} [style] - 按钮样式
 */

/**
 * 动作表样式配置对象
 * @typedef {Object} ActionSheetStyles
 * @property {string} [title] - 动作表的标题
 * @property {boolean} [cancel] - 是否显示取消按钮
 * @property {string} [cancelTitle] - 取消按钮标题
 * @property {Array<ActionSheetItem>} buttons - 按钮组
 * @property {boolean} [popover] - 是否在弹出区域中显示
 */

/**
 * 确认对话框样式配置对象
 * @typedef {Object} ConfirmStyles
 * @property {string} [title] - 确认对话框的标题
 * @property {string} [buttons] - 确认对话框的按钮组
 * @property {boolean} [verticalAlign] - 是否垂直对齐
 */

/**
 * 日期选择器样式配置对象
 * @typedef {Object} PickDateStyles
 * @property {string} [title] - 日期选择器的标题
 * @property {string} [date] - 日期选择器的日期
 * @property {string} [minDate] - 日期选择器的最小日期
 * @property {string} [maxDate] - 日期选择器的最大日期
 * @property {string} [popover] - 是否在弹出区域中显示
 * @property {number} [height] - 日期选择器的高度
 */

/**
 * 时间选择器样式配置对象
 * @typedef {Object} PickTimeStyles
 * @property {string} [title] - 时间选择器的标题
 * @property {string} [time] - 时间选择器的时间
 * @property {string} [popover] - 是否在弹出区域中显示
 * @property {number} [height] - 时间选择器的高度
 * @property {boolean} [is24Hour] - 是否为24小时制
 * @property {number} [minuteStep] - 分钟步进值
 */

/**
 * 等待对话框样式配置对象
 * @typedef {Object} WaitingStyles
 * @property {string} [size] - 等待对话框的尺寸
 * @property {string} [padding] - 等待对话框的内边距
 * @property {number} [spacing] - 等待对话框的间距
 * @property {number} [borderRadius] - 等待对话框的圆角
 * @property {string} [background] - 等待对话框的背景颜色
 * @property {string} [color] - 等待对话框的文字颜色
 * @property {string} [backdrop] - 等待对话框的背景遮罩
 * @property {boolean} [modal] - 是否模态显示
 * @property {boolean} [padlock] - 是否显示锁屏图标
 * @property {number} [round] - 等待对话框的圆角
 * @property {number} [loadingDisplay] - 等待对话框的加载显示
 */

/**
 * 提示消息样式配置对象
 * @typedef {Object} ToastStyles
 * @property {string} [type] - 提示消息的类型
 * @property {string} [align] - 提示消息的对齐方式
 * @property {number} [duration] - 提示消息的显示时长
 * @property {string} [verticalAlign] - 提示消息的垂直对齐方式
 * @property {string} [icon] - 提示消息的图标
 * @property {string} [iconWidth] - 提示消息的图标宽度
 * @property {string} [iconHeight] - 提示消息的图标高度
 * @property {string} [richText] - 提示消息的富文本内容
 * @property {number} [padding] - 提示消息的内边距
 * @property {string} [background] - 提示消息的背景颜色
 * @property {string} [color] - 提示消息的文字颜色
 * @property {number} [borderRadius] - 提示消息的圆角
 * @property {number} [borderWidth] - 提示消息的边框宽度
 * @property {string} [borderColor] - 提示消息的边框颜色
 * @property {number} [fontSize] - 提示消息的字体大小
 * @property {number} [lineHeight] - 提示消息的行高
 * @property {number} [margin] - 提示消息的外边距
 * @property {number} [radius] - 提示消息的圆角
 * @property {number} [opacity] - 提示消息的透明度
 */

/**
 * 图片预览样式配置对象
 * @typedef {Object} PreviewImageStyles
 * @property {string} [background] - 图片预览的背景颜色
 * @property {number} [current] - 当前显示的图片索引
 * @property {number} [indicator] - 指示器样式
 * @property {boolean} [loop] - 是否循环显示
 * @property {number} [indicatorColor] - 指示器颜色
 * @property {number} [indicatorActiveColor] - 指示器激活颜色
 * @property {number} [longPressAction] - 长按操作
 */

/**
 * 提示回调函数
 * @callback AlertCallback
 * @param {number} index - 用户点击的按钮索引
 */

/**
 * 确认回调函数
 * @callback ConfirmCallback
 * @param {number} index - 用户点击的按钮索引
 */

/**
 * 输入回调函数
 * @callback PromptCallback
 * @param {Object} event - 输入事件对象
 * @property {number} event.index - 用户点击的按钮索引
 * @property {string} event.value - 用户输入的值
 */

/**
 * 动作表回调函数
 * @callback ActionSheetCallback
 * @param {number} index - 用户点击的按钮索引
 */

/**
 * 日期选择成功回调函数
 * @callback PickDateSuccessCallback
 * @param {string} date - 用户选择的日期
 */

/**
 * 时间选择成功回调函数
 * @callback PickTimeSuccessCallback
 * @param {string} time - 用户选择的时间
 */

/**
 * 日期时间选择失败回调函数
 * @callback PickDatetimeErrorCallback
 * @param {Object} error - 错误信息
 * @property {number} error.code - 错误代码
 * @property {string} error.message - 错误描述信息
 */

/**
 * 成功回调函数
 * @callback SuccessCallback
 * @param {*} result - 操作结果
 */

/**
 * 失败回调函数
 * @callback ErrorCallback
 * @param {Object} error - 错误信息
 * @property {number} error.code - 错误代码
 * @property {string} error.message - 错误描述信息
 */

/**
 * NativeUI模块类
 */
class NativeUIModule {
    constructor() {
        this.activeWaitingDialogs = new Map(); // 存储活跃的等待对话框
        this.currentToast = null; // 当前显示的提示消息
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.nativeUI) {
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
     * 验证消息内容
     * @private
     * @param {string} message - 消息内容
     * @returns {boolean} 是否有效
     */
    validateMessage(message) {
        return typeof message === 'string' && message.trim() !== '';
    }

    /**
     * 验证回调函数
     * @private
     * @param {function} callback - 回调函数
     * @returns {boolean} 是否有效
     */
    validateCallback(callback) {
        return typeof callback === 'function';
    }

    /**
     * 显示系统提示对话框
     * @param {string} message - 提示对话框上显示的内容
     * @param {AlertCallback} [alertCB] - 提示对话框上关闭后的回调函数
     * @param {string} [title] - 提示对话框上显示的标题
     * @param {string} [buttonCapture] - 提示对话框上按钮显示的内容
     * @returns {Promise<number>} 返回Promise，用户点击按钮时触发
     * @throws {Error} 如果显示失败
     */
    alert(message, alertCB, title, buttonCapture) {
        // 如果只传入了alertCB且不是函数，则支持Promise方式
        if (typeof alertCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.alert(message, resolve, alertCB, buttonCapture);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!this.validateMessage(message)) {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '消息内容不能为空'
                );
            }

            plus.nativeUI.alert(message, alertCB, title, buttonCapture);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (alertCB) {
                    alertCB(-1);
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示提示对话框失败: ${error.message || '未知错误'}`
            );

            if (alertCB) {
                alertCB(-1);
            }
            throw formattedError;
        }
    }

    /**
     * 显示系统确认对话框
     * @param {string} message - 确认对话框上显示的内容
     * @param {ConfirmCallback} [confirmCB] - 确认对话框关闭后的回调函数
     * @param {ConfirmStyles} [styles] - 确认对话框的参数
     * @returns {Promise<number>} 返回Promise，用户点击按钮时触发
     * @throws {Error} 如果显示失败
     */
    confirm(message, confirmCB, styles) {
        // 如果只传入了confirmCB且不是函数，则支持Promise方式
        if (typeof confirmCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.confirm(message, resolve, confirmCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!this.validateMessage(message)) {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '消息内容不能为空'
                );
            }

            plus.nativeUI.confirm(message, confirmCB, styles);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (confirmCB) {
                    confirmCB(-1);
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示确认对话框失败: ${error.message || '未知错误'}`
            );

            if (confirmCB) {
                confirmCB(-1);
            }
            throw formattedError;
        }
    }

    /**
     * 显示系统输入对话框
     * @param {string} message - 输入对话框上显示的内容
     * @param {PromptCallback} [promptCB] - 输入对话框关闭后的回调函数
     * @param {string} [title] - 输入对话框上显示的标题
     * @param {string} [tip] - 输入对话框上编辑框显示的提示文字
     * @param {string[]} [buttons] - 输入对话框上显示的按钮数组
     * @returns {Promise<Object>} 返回Promise，用户点击按钮时触发
     * @throws {Error} 如果显示失败
     */
    prompt(message, promptCB, title, tip, buttons) {
        // 如果只传入了promptCB且不是函数，则支持Promise方式
        if (typeof promptCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.prompt(message, resolve, title, tip, promptCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!this.validateMessage(message)) {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '消息内容不能为空'
                );
            }

            plus.nativeUI.prompt(message, promptCB, title, tip, buttons);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (promptCB) {
                    promptCB({ index: -1, value: '' });
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示输入对话框失败: ${error.message || '未知错误'}`
            );

            if (promptCB) {
                promptCB({ index: -1, value: '' });
            }
            throw formattedError;
        }
    }

    /**
     * 显示系统动作按钮框
     * @param {ActionSheetStyles} actionsheetStyle - 动作按钮框的参数
     * @param {ActionSheetCallback} [actionsheetCallback] - 动作按钮框关闭后的回调函数
     * @returns {Promise<number>} 返回Promise，用户点击按钮时触发
     * @throws {Error} 如果显示失败
     */
    actionSheet(actionsheetStyle, actionsheetCallback) {
        // 如果只传入了actionsheetCallback且不是函数，则支持Promise方式
        if (typeof actionsheetCallback !== 'function') {
            return new Promise((resolve, reject) => {
                this.actionSheet(actionsheetStyle, resolve);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!actionsheetStyle || typeof actionsheetStyle !== 'object') {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '动作按钮框样式不能为空'
                );
            }

            plus.nativeUI.actionSheet(actionsheetStyle, actionsheetCallback);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (actionsheetCallback) {
                    actionsheetCallback(-1);
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示动作按钮框失败: ${error.message || '未知错误'}`
            );

            if (actionsheetCallback) {
                actionsheetCallback(-1);
            }
            throw formattedError;
        }
    }

    /**
     * 弹出系统日期选择对话框
     * @param {PickDateSuccessCallback} [successCB] - 日期选择操作成功的回调函数
     * @param {PickDatetimeErrorCallback} [errorCB] - 日期选择操作失败的回调函数
     * @param {PickDateStyles} [styles] - 日期选择对话框的参数
     * @returns {Promise<string>} 返回Promise，用户选择日期时触发
     * @throws {Error} 如果弹出失败
     */
    pickDate(successCB, errorCB, styles) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.pickDate(resolve, reject, successCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            plus.nativeUI.pickDate(successCB, errorCB, styles);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `弹出日期选择对话框失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 弹出系统时间选择对话框
     * @param {PickTimeSuccessCallback} [successCB] - 时间选择操作成功的回调函数
     * @param {PickDatetimeErrorCallback} [errorCB] - 时间选择操作失败的回调函数
     * @param {PickTimeStyles} [styles] - 时间选择对话框的参数
     * @returns {Promise<string>} 返回Promise，用户选择时间时触发
     * @throws {Error} 如果弹出失败
     */
    pickTime(successCB, errorCB, styles) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.pickTime(resolve, reject, successCB);
            });
        }

        try {
            this.checkPlusEnvironment();

            plus.nativeUI.pickTime(successCB, errorCB, styles);

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `弹出时间选择对话框失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 显示系统等待对话框
     * @param {string} [title] - 等待对话框上显示的标题
     * @param {WaitingStyles} [styles] - 等待对话框的参数
     * @returns {Object} 等待对话框对象
     * @throws {Error} 如果显示失败
     */
    showWaiting(title, styles) {
        try {
            this.checkPlusEnvironment();

            const waitingDialog = plus.nativeUI.showWaiting(title, styles);

            // 存储等待对话框引用
            const dialogId = Date.now().toString();
            this.activeWaitingDialogs.set(dialogId, waitingDialog);

            // 添加关闭回调
            waitingDialog.onclose = () => {
                this.activeWaitingDialogs.delete(dialogId);
            };

            return waitingDialog;

        } catch (error) {
            throw this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示等待对话框失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 关闭系统等待对话框
     * @param {Object} [waitingDialog] - 要关闭的等待对话框对象
     * @throws {Error} 如果关闭失败
     */
    closeWaiting(waitingDialog) {
        try {
            this.checkPlusEnvironment();

            if (waitingDialog) {
                waitingDialog.close();
                // 从活跃列表中移除
                for (const [dialogId, dialog] of this.activeWaitingDialogs) {
                    if (dialog === waitingDialog) {
                        this.activeWaitingDialogs.delete(dialogId);
                        break;
                    }
                }
            } else {
                // 关闭所有等待对话框
                for (const dialog of this.activeWaitingDialogs.values()) {
                    dialog.close();
                }
                this.activeWaitingDialogs.clear();
            }

        } catch (error) {
            throw this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `关闭等待对话框失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 显示系统提示消息
     * @param {string} message - 提示消息上显示的内容
     * @param {ToastStyles} [styles] - 提示消息的参数
     * @throws {Error} 如果显示失败
     */
    toast(message, styles) {
        try {
            this.checkPlusEnvironment();

            if (!this.validateMessage(message)) {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '消息内容不能为空'
                );
            }

            // 清除当前显示的提示消息
            if (this.currentToast) {
                this.currentToast.hide();
            }

            this.currentToast = plus.nativeUI.toast(message, styles);

        } catch (error) {
            throw this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `显示提示消息失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 隐藏系统提示消息
     * @throws {Error} 如果隐藏失败
     */
    hideToast() {
        try {
            this.checkPlusEnvironment();

            if (this.currentToast) {
                this.currentToast.hide();
                this.currentToast = null;
            }

        } catch (error) {
            throw this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `隐藏提示消息失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 预览图片
     * @param {string[]} urls - 要预览的图片地址列表
     * @param {PreviewImageStyles} [styles] - 预览图片的参数
     * @throws {Error} 如果预览失败
     */
    previewImage(urls, styles) {
        try {
            this.checkPlusEnvironment();

            if (!Array.isArray(urls) || urls.length === 0) {
                throw this.createError(
                    NativeUIErrorCode.INVALID_PARAMETER,
                    '图片地址列表不能为空'
                );
            }

            for (const url of urls) {
                if (typeof url !== 'string' || url.trim() === '') {
                    throw this.createError(
                        NativeUIErrorCode.INVALID_PARAMETER,
                        '图片地址不能为空'
                    );
                }
            }

            plus.nativeUI.previewImage(urls, styles);

        } catch (error) {
            throw this.createError(
                NativeUIErrorCode.OPERATION_FAILED,
                `预览图片失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 简化的提示对话框方法，自动处理错误
     * @param {string} message - 提示消息内容
     * @param {string} [title] - 对话框标题
     * @param {string} [buttonText] - 按钮文本
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickAlert(message, title, buttonText) {
        try {
            await this.alert(message, null, title, buttonText);
            return true;
        } catch (error) {
            console.warn('显示提示对话框失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的确认对话框方法，自动处理错误
     * @param {string} message - 确认消息内容
     * @param {string} [title] - 对话框标题
     * @param {string[]} [buttons] - 按钮数组
     * @returns {Promise<number|null>} 用户点击的按钮索引，失败返回null
     */
    async quickConfirm(message, title, buttons) {
        try {
            const styles = { title, buttons };
            return await this.confirm(message, null, styles);
        } catch (error) {
            console.warn('显示确认对话框失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的输入对话框方法，自动处理错误
     * @param {string} message - 输入提示内容
     * @param {string} [title] - 对话框标题
     * @param {string} [tip] - 输入提示
     * @param {string[]} [buttons] - 按钮数组
     * @returns {Promise<Object|null>} 用户输入结果，失败返回null
     */
    async quickPrompt(message, title, tip, buttons) {
        try {
            return await this.prompt(message, null, title, tip, buttons);
        } catch (error) {
            console.warn('显示输入对话框失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的日期选择方法，自动处理错误
     * @param {PickDateStyles} [styles] - 日期选择样式
     * @returns {Promise<string|null>} 用户选择的日期，失败返回null
     */
    async quickPickDate(styles) {
        try {
            return await this.pickDate(null, null, styles);
        } catch (error) {
            console.warn('选择日期失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的时间选择方法，自动处理错误
     * @param {PickTimeStyles} [styles] - 时间选择样式
     * @returns {Promise<string|null>} 用户选择的时间，失败返回null
     */
    async quickPickTime(styles) {
        try {
            return await this.pickTime(null, null, styles);
        } catch (error) {
            console.warn('选择时间失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的等待对话框方法，自动处理错误
     * @param {string} [title] - 等待标题
     * @param {WaitingStyles} [styles] - 等待样式
     * @returns {Object|null} 等待对话框对象，失败返回null
     */
    quickShowWaiting(title, styles) {
        try {
            return this.showWaiting(title, styles);
        } catch (error) {
            console.warn('显示等待对话框失败:', error.message);
            return null;
        }
    }

    /**
     * 简化的提示消息方法，自动处理错误
     * @param {string} message - 提示消息内容
     * @param {ToastStyles} [styles] - 提示样式
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickToast(message, styles) {
        try {
            this.toast(message, styles);
            return true;
        } catch (error) {
            console.warn('显示提示消息失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的图片预览方法，自动处理错误
     * @param {string[]} urls - 图片地址列表
     * @param {PreviewImageStyles} [styles] - 预览样式
     * @returns {boolean} 成功返回true，失败返回false
     */
    quickPreviewImage(urls, styles) {
        try {
            this.previewImage(urls, styles);
            return true;
        } catch (error) {
            console.warn('预览图片失败:', error.message);
            return false;
        }
    }

    /**
     * 判断设备是否支持原生UI功能
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
     * 获取当前活跃的等待对话框数量
     * @returns {number} 活跃等待对话框数量
     */
    getActiveWaitingDialogsCount() {
        return this.activeWaitingDialogs.size;
    }

    /**
     * 关闭所有活跃的等待对话框
     */
    closeAllWaitingDialogs() {
        for (const dialog of this.activeWaitingDialogs.values()) {
            try {
                dialog.close();
            } catch (error) {
                console.warn('关闭等待对话框失败:', error.message);
            }
        }
        this.activeWaitingDialogs.clear();
    }

    /**
     * 获取当前提示消息状态
     * @returns {boolean} 当前是否有显示的提示消息
     */
    hasActiveToast() {
        return this.currentToast !== null;
    }
}

// 创建NativeUI模块实例
const nativeUI = new NativeUIModule();

// 导出模块
export default nativeUI;

// 导出常量
export { NativeUIErrorCode };