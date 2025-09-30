/**
 * HTML5+ Messaging 模块 ES Module 封装
 *
 * 该模块提供了对设备通讯功能的管理能力
 * 支持短信、彩信、邮件发送等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 消息类型常量
 * @readonly
 * @enum {number}
 */
export const MessageType = {
    SMS: 1,        // 简单短信类型
    MMS: 2,        // 彩信类型
    EMAIL: 3       // 邮件类型
};

/**
 * 消息体内容类型常量
 * @readonly
 * @enum {string}
 */
export const BodyType = {
    TEXT: 'text',    // 文本内容
    HTML: 'html'     // HTML内容
};

/**
 * 消息错误代码常量
 * @readonly
 * @enum {number}
 */
export const MessagingErrorCode = {
    INVALID_MESSAGE_TYPE: 1,      // 无效的消息类型
    INVALID_RECIPIENT: 2,         // 无效的收件人
    INVALID_ATTACHMENT: 3,        // 无效的附件
    SEND_FAILED: 4,               // 发送失败
    NETWORK_ERROR: 5,             // 网络错误
    PERMISSION_DENIED: 6,         // 权限拒绝
    SERVICE_UNAVAILABLE: 7,       // 服务不可用
    UNKNOWN_ERROR: 8              // 未知错误
};

/**
 * 消息对象配置
 * @typedef {Object} MessageOptions
 * @property {string[]} [to] - 收件人列表
 * @property {string[]} [cc] - 抄送人列表（仅邮件有效）
 * @property {string[]} [bcc] - 暗送人列表（仅邮件有效）
 * @property {string} [subject] - 消息主题（仅邮件有效）
 * @property {string} [body] - 消息内容
 * @property {string} [bodyType='text'] - 消息内容类型
 * @property {boolean} [silent=false] - 是否静默发送（仅短信有效）
 * @property {string[]} [attachments] - 附件列表（仅邮件有效）
 */

/**
 * 消息发送成功回调函数
 * @callback MessageSendSuccessCallback
 */

/**
 * 消息发送失败回调函数
 * @callback MessageErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Messaging模块类
 */
class MessagingModule {
    constructor() {
        this.activeMessages = new Map(); // 存储活跃的消息
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.messaging) {
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
     * 验证消息类型
     * @private
     * @param {number} type - 消息类型
     * @returns {boolean} 是否有效
     */
    validateMessageType(type) {
        const validTypes = Object.values(MessageType);
        return validTypes.includes(type);
    }

    /**
     * 验证收件人地址
     * @private
     * @param {string[]} recipients - 收件人列表
     * @param {number} messageType - 消息类型
     * @returns {boolean} 是否有效
     */
    validateRecipients(recipients, messageType) {
        if (!Array.isArray(recipients) || recipients.length === 0) {
            return false;
        }

        for (const recipient of recipients) {
            if (typeof recipient !== 'string' || recipient.trim() === '') {
                return false;
            }

            // 根据消息类型验证地址格式
            if (messageType === MessageType.EMAIL) {
                // 简单的邮箱格式验证
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(recipient)) {
                    return false;
                }
            } else if (messageType === MessageType.SMS || messageType === MessageType.MMS) {
                // 简单的手机号格式验证
                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(recipient.replace(/\s+/g, ''))) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 验证附件路径
     * @private
     * @param {string[]} attachments - 附件列表
     * @returns {boolean} 是否有效
     */
    validateAttachments(attachments) {
        if (!Array.isArray(attachments)) {
            return false;
        }

        for (const attachment of attachments) {
            if (typeof attachment !== 'string' || attachment.trim() === '') {
                return false;
            }
        }

        return true;
    }

    /**
     * 创建消息对象
     * @param {number} type - 消息类型
     * @param {MessageOptions} [options={}] - 消息配置选项
     * @returns {Object} 消息对象
     * @throws {Error} 如果创建失败
     */
    createMessage(type, options = {}) {
        try {
            this.checkPlusEnvironment();

            if (!this.validateMessageType(type)) {
                throw this.createError(
                    MessagingErrorCode.INVALID_MESSAGE_TYPE,
                    '无效的消息类型'
                );
            }

            // 创建原生消息对象
            const message = plus.messaging.createMessage(type);

            // 应用配置选项
            if (options.to && Array.isArray(options.to)) {
                if (!this.validateRecipients(options.to, type)) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_RECIPIENT,
                        '无效的收件人地址'
                    );
                }
                message.to = options.to;
            }

            if (options.cc && Array.isArray(options.cc)) {
                if (type !== MessageType.EMAIL) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_RECIPIENT,
                        '抄送功能仅支持邮件类型'
                    );
                }
                message.cc = options.cc;
            }

            if (options.bcc && Array.isArray(options.bcc)) {
                if (type !== MessageType.EMAIL) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_RECIPIENT,
                        '暗送功能仅支持邮件类型'
                    );
                }
                message.bcc = options.bcc;
            }

            if (options.subject && typeof options.subject === 'string') {
                if (type !== MessageType.EMAIL) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_MESSAGE_TYPE,
                        '主题功能仅支持邮件类型'
                    );
                }
                message.subject = options.subject;
            }

            if (options.body && typeof options.body === 'string') {
                message.body = options.body;
            }

            if (options.bodyType) {
                if (options.bodyType !== BodyType.TEXT && options.bodyType !== BodyType.HTML) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_MESSAGE_TYPE,
                        '无效的消息体类型'
                    );
                }
                message.bodyType = options.bodyType;
            }

            if (typeof options.silent === 'boolean') {
                if (type !== MessageType.SMS) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_MESSAGE_TYPE,
                        '静默发送仅支持短信类型'
                    );
                }
                message.silent = options.silent;
            }

            // 存储消息引用
            const messageId = Date.now().toString();
            this.activeMessages.set(messageId, message);

            // 添加辅助方法
            message.addAttachment = (url) => {
                if (type !== MessageType.EMAIL) {
                    throw this.createError(
                        MessagingErrorCode.INVALID_ATTACHMENT,
                        '添加附件仅支持邮件类型'
                    );
                }

                if (typeof url !== 'string' || url.trim() === '') {
                    throw this.createError(
                        MessagingErrorCode.INVALID_ATTACHMENT,
                        '附件地址不能为空'
                    );
                }

                plus.messaging.Message.prototype.addAttachment.call(message, url);
            };

            return message;

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                MessagingErrorCode.UNKNOWN_ERROR,
                `创建消息失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 发送消息
     * @param {Object} message - 消息对象
     * @param {MessageSendSuccessCallback} [successCB] - 成功回调函数
     * @param {MessageErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果发送失败
     */
    sendMessage(message, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.sendMessage(message, resolve, reject);
            });
        }

        try {
            this.checkPlusEnvironment();

            if (!message || typeof message !== 'object') {
                throw this.createError(
                    MessagingErrorCode.INVALID_MESSAGE_TYPE,
                    '消息对象不能为空'
                );
            }

            plus.messaging.sendMessage(
                message,
                () => {
                    if (successCB) {
                        successCB();
                    }
                },
                (error) => {
                    const formattedError = this.createError(
                        MessagingErrorCode.SEND_FAILED,
                        error.message || '发送消息失败'
                    );

                    if (errorCB) {
                        errorCB(formattedError);
                    }
                }
            );

        } catch (error) {
            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                if (errorCB) {
                    errorCB(error);
                }
                throw error;
            }

            const formattedError = this.createError(
                MessagingErrorCode.UNKNOWN_ERROR,
                `发送消息失败: ${error.message || '未知错误'}`
            );

            if (errorCB) {
                errorCB(formattedError);
            }
            throw formattedError;
        }
    }

    /**
     * 创建并发送短信
     * @param {string[]} recipients - 收件人列表
     * @param {string} body - 短信内容
     * @param {boolean} [silent=false] - 是否静默发送
     * @param {MessageSendSuccessCallback} [successCB] - 成功回调函数
     * @param {MessageErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果发送失败
     */
    sendSMS(recipients, body, silent = false, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.sendSMS(recipients, body, silent, resolve, reject);
            });
        }

        try {
            const message = this.createMessage(MessageType.SMS, {
                to: recipients,
                body: body,
                silent: silent
            });

            return this.sendMessage(message, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB(error);
            }
            throw error;
        }
    }

    /**
     * 创建并发送彩信
     * @param {string[]} recipients - 收件人列表
     * @param {string} body - 彩信内容
     * @param {string[]} [attachments] - 附件列表
     * @param {MessageSendSuccessCallback} [successCB] - 成功回调函数
     * @param {MessageErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果发送失败
     */
    sendMMS(recipients, body, attachments, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.sendMMS(recipients, body, attachments, resolve, reject);
            });
        }

        try {
            const options = {
                to: recipients,
                body: body
            };

            const message = this.createMessage(MessageType.MMS, options);

            // 添加附件
            if (attachments && Array.isArray(attachments)) {
                for (const attachment of attachments) {
                    message.addAttachment(attachment);
                }
            }

            return this.sendMessage(message, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB(error);
            }
            throw error;
        }
    }

    /**
     * 创建并发送邮件
     * @param {string[]} recipients - 收件人列表
     * @param {string} subject - 邮件主题
     * @param {string} body - 邮件内容
     * @param {Object} [options={}] - 邮件选项
     * @param {string[]} [options.cc] - 抄送列表
     * @param {string[]} [options.bcc] - 暗送列表
     * @param {string} [options.bodyType='text'] - 内容类型
     * @param {string[]} [options.attachments] - 附件列表
     * @param {MessageSendSuccessCallback} [successCB] - 成功回调函数
     * @param {MessageErrorCallback} [errorCB] - 失败回调函数
     * @returns {Promise<void>} 返回Promise
     * @throws {Error} 如果发送失败
     */
    sendEmail(recipients, subject, body, options = {}, successCB, errorCB) {
        // 如果只传入了successCB且不是函数，则支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.sendEmail(recipients, subject, body, options, resolve, reject);
            });
        }

        try {
            const emailOptions = {
                to: recipients,
                subject: subject,
                body: body,
                bodyType: options.bodyType || BodyType.TEXT,
                cc: options.cc,
                bcc: options.bcc
            };

            const message = this.createMessage(MessageType.EMAIL, emailOptions);

            // 添加附件
            if (options.attachments && Array.isArray(options.attachments)) {
                for (const attachment of options.attachments) {
                    message.addAttachment(attachment);
                }
            }

            return this.sendMessage(message, successCB, errorCB);

        } catch (error) {
            if (errorCB) {
                errorCB(error);
            }
            throw error;
        }
    }

    /**
     * 简化的短信发送方法，自动处理错误
     * @param {string[]} recipients - 收件人列表
     * @param {string} body - 短信内容
     * @param {boolean} [silent=false] - 是否静默发送
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickSendSMS(recipients, body, silent = false) {
        try {
            await this.sendSMS(recipients, body, silent);
            return true;
        } catch (error) {
            console.warn('发送短信失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的彩信发送方法，自动处理错误
     * @param {string[]} recipients - 收件人列表
     * @param {string} body - 彩信内容
     * @param {string[]} [attachments] - 附件列表
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickSendMMS(recipients, body, attachments) {
        try {
            await this.sendMMS(recipients, body, attachments);
            return true;
        } catch (error) {
            console.warn('发送彩信失败:', error.message);
            return false;
        }
    }

    /**
     * 简化的邮件发送方法，自动处理错误
     * @param {string[]} recipients - 收件人列表
     * @param {string} subject - 邮件主题
     * @param {string} body - 邮件内容
     * @param {Object} [options={}] - 邮件选项
     * @returns {Promise<boolean>} 成功返回true，失败返回false
     */
    async quickSendEmail(recipients, subject, body, options = {}) {
        try {
            await this.sendEmail(recipients, subject, body, options);
            return true;
        } catch (error) {
            console.warn('发送邮件失败:', error.message);
            return false;
        }
    }

    /**
     * 判断设备是否支持消息功能
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
     * 获取当前活跃消息数量
     * @returns {number} 活跃消息数量
     */
    getActiveMessagesCount() {
        return this.activeMessages.size;
    }

    /**
     * 清理活跃消息
     */
    clearActiveMessages() {
        this.activeMessages.clear();
    }
}

// 创建Messaging模块实例
const messaging = new MessagingModule();

// 导出模块
export default messaging;

// 导出常量（兼容HTML5+官方命名）
export {
    MessageType,
    BodyType,
    MessagingErrorCode,
    // 兼容HTML5+官方常量名
    MessageType as TYPE_SMS,
    MessageType as TYPE_MMS,
    MessageType as TYPE_EMAIL
};