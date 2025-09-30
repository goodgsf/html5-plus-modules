/**
 * HTML5+ Fingerprint 模块 ES Module 封装
 *
 * 该模块提供了对设备指纹识别的访问能力
 * 可以进行指纹识别认证、设备支持状态检测等
 * 遵循HTML5+官方API规范
 */

/**
 * 指纹识别错误代码常量
 * @readonly
 * @enum {number}
 */
export const FingerprintErrorCode = {
    UNSUPPORT: 1,                    // 不支持指纹识别
    KEYGUARD_INSECURE: 2,            // 设备未设置密码锁屏
    FINGERPRINT_UNENROLLED: 3,       // 未录入指纹识别
    AUTHENTICATE_MISMATCH: 4,        // 指纹识别不匹配
    AUTHENTICATE_OVERLIMIT: 5,       // 指纹识别次数超过限制
    CANCEL: 6,                       // 取消指纹识别
    UNKNOWN_ERROR: 7                 // 未知错误
};

/**
 * 指纹识别认证参数
 * @typedef {Object} AuthenticateOptions
 * @property {string} [message] - 指纹识别过程中显示的提示信息
 */

/**
 * 指纹识别错误信息
 * @typedef {Object} FingerprintError
 * @property {number} code - 错误代码
 * @property {string} message - 错误描述信息
 */

/**
 * 指纹识别认证成功的回调函数
 * @callback FingerprintSuccessCallback
 */

/**
 * 指纹识别认证失败的回调函数
 * @callback FingerprintErrorCallback
 * @param {FingerprintError} error - 错误信息
 */

/**
 * Fingerprint模块类
 */
class FingerprintModule {
    constructor() {
        this.currentAuthenticateId = null;
        this.successCallback = null;
        this.errorCallback = null;
    }

    /**
     * 检查HTML5+环境是否可用
     * @private
     * @throws {Error} 如果HTML5+环境不可用
     */
    checkPlusEnvironment() {
        if (typeof plus === 'undefined' || !plus.fingerprint) {
            throw new Error('HTML5+ 环境不可用，请确保在HTML5+环境中运行');
        }
    }

    /**
     * 创建错误对象
     * @private
     * @param {number} code - 错误代码
     * @param {string} message - 错误描述信息
     * @returns {FingerprintError} 错误对象
     */
    createError(code, message) {
        return {
            code,
            message
        };
    }

    /**
     * 当前设备环境是否支持指纹识别
     * @returns {Promise<boolean>} 支持返回true，否则返回false
     * @throws {FingerprintError} 如果检查失败
     */
    async isSupport() {
        try {
            this.checkPlusEnvironment();
            return plus.fingerprint.isSupport();
        } catch (error) {
            throw this.createError(
                FingerprintErrorCode.UNSUPPORT,
                `检查指纹识别支持失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 当前设备是否设置密码锁屏
     * @returns {Promise<boolean>} 已设置密码锁屏返回true，否则返回false
     * @throws {FingerprintError} 如果检查失败
     */
    async isKeyguardSecure() {
        try {
            this.checkPlusEnvironment();
            return plus.fingerprint.isKeyguardSecure();
        } catch (error) {
            throw this.createError(
                FingerprintErrorCode.UNKNOWN_ERROR,
                `检查密码锁屏状态失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 当前设备是否已经录入指纹
     * @returns {Promise<boolean>} 已录入指纹返回true，否则返回false
     * @throws {FingerprintError} 如果检查失败
     */
    async isEnrolledFingerprints() {
        try {
            this.checkPlusEnvironment();
            return plus.fingerprint.isEnrolledFingerprints();
        } catch (error) {
            throw this.createError(
                FingerprintErrorCode.FINGERPRINT_UNENROLLED,
                `检查指纹录入状态失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 指纹识别认证
     * @param {FingerprintSuccessCallback} successFn - 成功回调函数
     * @param {FingerprintErrorCallback} errorFn - 失败回调函数
     * @param {AuthenticateOptions} [options={}] - 认证选项
     * @returns {Promise<string>} 返回认证ID
     * @throws {FingerprintError} 如果认证失败
     */
    async authenticate(successFn, errorFn, options = {}) {
        try {
            this.checkPlusEnvironment();

            // 检查设备支持状态
            const supported = await this.isSupport();
            if (!supported) {
                throw this.createError(FingerprintErrorCode.UNSUPPORT, '此设备不支持指纹识别');
            }

            const keyguardSecure = await this.isKeyguardSecure();
            if (!keyguardSecure) {
                throw this.createError(FingerprintErrorCode.KEYGUARD_INSECURE, '此设备未设置密码锁屏，无法使用指纹识别');
            }

            const enrolled = await this.isEnrolledFingerprints();
            if (!enrolled) {
                throw this.createError(FingerprintErrorCode.FINGERPRINT_UNENROLLED, '此设备未录入指纹，请到设置中开启');
            }

            // 生成认证ID
            const authenticateId = `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 保存回调函数
            this.currentAuthenticateId = authenticateId;
            this.successCallback = successFn;
            this.errorCallback = errorFn;

            // 调用原生认证方法
            plus.fingerprint.authenticate(
                () => {
                    if (this.currentAuthenticateId === authenticateId && this.successCallback) {
                        this.successCallback();
                        this.clearCallbacks();
                    }
                },
                (e) => {
                    if (this.currentAuthenticateId === authenticateId && this.errorCallback) {
                        let error = this.createError(FingerprintErrorCode.UNKNOWN_ERROR, '指纹识别失败');

                        // 转换错误代码
                        if (e && typeof e.code === 'number') {
                            switch (e.code) {
                                case 4: // AUTHENTICATE_MISMATCH
                                    error = this.createError(FingerprintErrorCode.AUTHENTICATE_MISMATCH, '指纹匹配失败，请重新输入');
                                    break;
                                case 5: // AUTHENTICATE_OVERLIMIT
                                    error = this.createError(FingerprintErrorCode.AUTHENTICATE_OVERLIMIT, '指纹识别失败次数超出限制，请使用其它方式进行认证');
                                    break;
                                case 6: // CANCEL
                                    error = this.createError(FingerprintErrorCode.CANCEL, '用户取消指纹识别');
                                    break;
                                default:
                                    error = this.createError(e.code, e.message || '指纹识别失败');
                            }
                        }

                        this.errorCallback(error);

                        // 对于非匹配失败错误，清除回调
                        if (error.code !== FingerprintErrorCode.AUTHENTICATE_MISMATCH) {
                            this.clearCallbacks();
                        }
                    }
                },
                {
                    message: options.message || '请验证指纹'
                }
            );

            return authenticateId;
        } catch (error) {
            this.clearCallbacks();

            // 如果是自定义错误，直接抛出
            if (error.code && error.message) {
                throw error;
            }

            throw this.createError(
                FingerprintErrorCode.UNKNOWN_ERROR,
                `指纹识别认证失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 取消指纹识别认证
     * @returns {Promise<void>}
     * @throws {FingerprintError} 如果取消失败
     */
    async cancel() {
        try {
            this.checkPlusEnvironment();
            plus.fingerprint.cancel();

            // 通知回调函数认证被取消
            if (this.currentAuthenticateId && this.errorCallback) {
                this.errorCallback(this.createError(FingerprintErrorCode.CANCEL, '用户取消指纹识别'));
            }

            this.clearCallbacks();
        } catch (error) {
            this.clearCallbacks();
            throw this.createError(
                FingerprintErrorCode.UNKNOWN_ERROR,
                `取消指纹识别失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 清除回调函数
     * @private
     */
    clearCallbacks() {
        this.currentAuthenticateId = null;
        this.successCallback = null;
        this.errorCallback = null;
    }

    /**
     * 获取设备指纹识别的完整状态信息
     * @returns {Promise<Object>} 包含支持状态、锁屏状态、指纹录入状态等
     * @throws {FingerprintError} 如果获取状态失败
     */
    async getFingerprintStatus() {
        try {
            const [supported, keyguardSecure, enrolled] = await Promise.all([
                this.isSupport(),
                this.isKeyguardSecure(),
                this.isEnrolledFingerprints()
            ]);

            const available = supported && keyguardSecure && enrolled;
            let message = '';

            if (!supported) {
                message = '此设备不支持指纹识别';
            } else if (!keyguardSecure) {
                message = '此设备未设置密码锁屏，无法使用指纹识别';
            } else if (!enrolled) {
                message = '此设备未录入指纹，请到设置中开启';
            } else {
                message = '此设备支持指纹识别';
            }

            return {
                supported,
                keyguardSecure,
                enrolled,
                available,
                message
            };
        } catch (error) {
            throw this.createError(
                FingerprintErrorCode.UNKNOWN_ERROR,
                `获取指纹状态失败: ${error.message || '未知错误'}`
            );
        }
    }

    /**
     * 简化的指纹识别方法，自动检查设备状态
     * @param {AuthenticateOptions} [options={}] - 认证选项
     * @returns {Promise<boolean>} 认证成功返回true，失败返回false
     * @throws {FingerprintError} 如果认证失败
     */
    async quickAuthenticate(options = {}) {
        try {
            return new Promise((resolve, reject) => {
                this.authenticate(
                    () => resolve(true),
                    (error) => {
                        // 对于匹配失败，不拒绝Promise，让用户可以重试
                        if (error.code === FingerprintErrorCode.AUTHENTICATE_MISMATCH) {
                            resolve(false);
                        } else {
                            reject(error);
                        }
                    },
                    options
                ).catch(reject);
            });
        } catch (error) {
            throw this.createError(
                FingerprintErrorCode.UNKNOWN_ERROR,
                `快速指纹认证失败: ${error.message || '未知错误'}`
            );
        }
    }
}

// 创建模块实例
const fingerprint = new FingerprintModule();

// 导出模块实例和常量
export { fingerprint as default };
export { fingerprint };
export { FingerprintErrorCode };