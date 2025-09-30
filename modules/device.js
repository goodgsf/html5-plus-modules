/**
 * HTML5+ Device 模块 ES Module 封装
 *
 * 该模块提供了设备信息管理功能，包括设备标识、屏幕信息、网络信息、系统信息等
 * 遵循HTML5+官方API规范
 */

/**
 * 网络连接类型常量
 */
export const ConnectionType = {
    UNKNOW: 0,      // 网络连接状态未知
    NONE: 1,        // 未连接网络
    ETHERNET: 2,    // 有线网络
    WIFI: 3,        // 无线WIFI网络
    CELL2G: 4,      // 蜂窝移动2G网络
    CELL3G: 5,      // 蜂窝移动3G网络
    CELL4G: 6,      // 蜂窝移动4G网络
    CELL5G: 7       // 蜂窝移动5G网络
};

/**
 * 屏幕方向常量
 */
export const ScreenOrientation = {
    PORTRAIT_PRIMARY: 'portrait-primary',           // 竖屏正方向
    PORTRAIT_SECONDARY: 'portrait-secondary',     // 竖屏反方向
    LANDSCAPE_PRIMARY: 'landscape-primary',       // 横屏正方向
    LANDSCAPE_SECONDARY: 'landscape-secondary',   // 横屏反方向
    PORTRAIT: 'portrait',                         // 竖屏正方向或反方向
    LANDSCAPE: 'landscape'                        // 横屏正方向或反方向
};

/**
 * 设备信息对象
 * @typedef {Object} DeviceInfo
 * @property {string} [imei] - 设备的国际移动设备身份码
 * @property {string[]} [imsi] - 设备的国际移动用户识别码
 * @property {string} [uuid] - 设备的唯一标识
 */

/**
 * 匿名设备标识符结果
 * @typedef {Object} AnonymousIdResult
 * @property {string} oaid - 匿名设备标识符
 * @property {string} vaid - 开发者匿名设备标识符
 * @property {string} aaid - 应用匿名设备标识符
 */

/**
 * 屏幕信息对象
 * @typedef {Object} ScreenInfo
 * @property {number} height - 屏幕物理分辨率高度
 * @property {number} width - 屏幕物理分辨率宽度
 * @property {number} resolutionHeight - 屏幕逻辑分辨率高度
 * @property {number} resolutionWidth - 屏幕逻辑分辨率宽度
 * @property {number} dpiX - 设备屏幕水平方向的密度
 * @property {number} dpiY - 设备屏幕垂直方向的密度
 * @property {number} scale - 逻辑分辨率与物理分辨率的缩放比例
 */

/**
 * 操作系统信息对象
 * @typedef {Object} OSInfo
 * @property {string} language - 系统语言信息
 * @property {string} name - 系统的名称
 * @property {string} vendor - 系统的供应商信息
 * @property {string} version - 系统版本信息
 */

/**
 * 设备操作成功回调函数
 * @callback DeviceSuccessCallback
 * @param {Object} result - 操作结果
 */

/**
 * 设备操作失败回调函数
 * @callback DeviceErrorCallback
 * @param {Object} error - 错误信息
 * @property {number} error.code - 错误编码
 * @property {string} error.message - 错误描述信息
 */

/**
 * 设备操作完成回调函数
 * @callback DeviceCompleteCallback
 * @param {Object} result - 操作结果
 */

/**
 * Device模块类
 */
class DeviceModule {
    constructor() {
        this.isWakelockEnabled = false;
    }

    /**
     * 获取设备信息
     * @param {Object} [options] - 选项参数
     * @param {DeviceSuccessCallback} [options.success] - 获取设备信息成功回调
     * @param {DeviceErrorCallback} [options.fail] - 获取设备信息失败回调
     * @param {DeviceCompleteCallback} [options.complete] - 获取设备信息操作完成回调
     * @returns {Promise<DeviceInfo>|void} 设备信息
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const deviceInfo = await device.getInfo();
     *   console.log('设备信息:', deviceInfo);
     * } catch (error) {
     *   console.error('获取设备信息失败:', error);
     * }
     * ```
     */
    getInfo(options) {
        // 如果没有传入options或options中没有success回调，支持Promise方式
        if (!options || typeof options.success !== 'function') {
            return new Promise((resolve, reject) => {
                this.getInfo({
                    success: resolve,
                    fail: reject
                });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查设备模块是否可用
            if (!plus.device) {
                throw new Error('设备不支持Device功能');
            }

            // 调用原生API
            plus.device.getInfo({
                success: options.success,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取匿名设备标识符
     * @param {Object} [options] - 选项参数
     * @param {DeviceSuccessCallback} [options.success] - 获取成功回调
     * @param {DeviceErrorCallback} [options.fail] - 获取失败回调
     * @param {DeviceCompleteCallback} [options.complete] - 获取操作完成回调
     * @returns {Promise<AnonymousIdResult>|void} 匿名设备标识符
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const result = await device.getOAID();
     *   console.log('OAID:', result.oaid);
     * } catch (error) {
     *   console.error('获取OAID失败:', error);
     * }
     * ```
     */
    getOAID(options) {
        if (!options || typeof options.success !== 'function') {
            return new Promise((resolve, reject) => {
                this.getOAID({
                    success: resolve,
                    fail: reject
                });
            });
        }

        try {
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            if (!plus.device) {
                throw new Error('设备不支持Device功能');
            }

            plus.device.getOAID({
                success: options.success,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取开发者匿名设备标识符
     * @param {Object} [options] - 选项参数
     * @param {DeviceSuccessCallback} [options.success] - 获取成功回调
     * @param {DeviceErrorCallback} [options.fail] - 获取失败回调
     * @param {DeviceCompleteCallback} [options.complete] - 获取操作完成回调
     * @returns {Promise<AnonymousIdResult>|void} 开发者匿名设备标识符
     */
    getVAID(options) {
        if (!options || typeof options.success !== 'function') {
            return new Promise((resolve, reject) => {
                this.getVAID({
                    success: resolve,
                    fail: reject
                });
            });
        }

        try {
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            if (!plus.device) {
                throw new Error('设备不支持Device功能');
            }

            plus.device.getVAID({
                success: options.success,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取应用匿名设备标识符
     * @param {Object} [options] - 选项参数
     * @param {DeviceSuccessCallback} [options.success] - 获取成功回调
     * @param {DeviceErrorCallback} [options.fail] - 获取失败回调
     * @param {DeviceCompleteCallback} [options.complete] - 获取操作完成回调
     * @returns {Promise<AnonymousIdResult>|void} 应用匿名设备标识符
     */
    getAAID(options) {
        if (!options || typeof options.success !== 'function') {
            return new Promise((resolve, reject) => {
                this.getAAID({
                    success: resolve,
                    fail: reject
                });
            });
        }

        try {
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            if (!plus.device) {
                throw new Error('设备不支持Device功能');
            }

            plus.device.getAAID({
                success: options.success,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取DCloud匿名设备标识符
     * @returns {string} DCloud匿名设备标识符
     *
     * @example
     * ```javascript
     * const deviceId = device.getDeviceId();
     * console.log('设备ID:', deviceId);
     * ```
     */
    getDeviceId() {
        try {
            if (typeof plus === 'undefined') {
                return '';
            }

            if (!plus.device || typeof plus.device.getDeviceId !== 'function') {
                return '';
            }

            return plus.device.getDeviceId();

        } catch (error) {
            console.error('获取设备ID失败:', error);
            return '';
        }
    }

    /**
     * 获取设备的系统音量
     * @returns {number} 系统音量值（0-1）
     *
     * @example
     * ```javascript
     * const volume = device.getVolume();
     * console.log('系统音量:', volume);
     * ```
     */
    getVolume() {
        try {
            if (typeof plus === 'undefined') {
                return 0;
            }

            if (!plus.device || typeof plus.device.getVolume !== 'function') {
                return 0;
            }

            return plus.device.getVolume();

        } catch (error) {
            console.error('获取音量失败:', error);
            return 0;
        }
    }

    /**
     * 设置设备的系统音量
     * @param {number} volume - 音量值（0-1）
     *
     * @example
     * ```javascript
     * device.setVolume(0.5);
     * console.log('音量已设置为50%');
     * ```
     */
    setVolume(volume) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.device || typeof plus.device.setVolume !== 'function') {
                return;
            }

            plus.device.setVolume(volume);

        } catch (error) {
            console.error('设置音量失败:', error);
        }
    }

    /**
     * 获取程序是否一直保持唤醒状态
     * @returns {boolean} 是否保持唤醒状态
     *
     * @example
     * ```javascript
     * const isWakelock = device.isWakelock();
     * console.log('是否保持唤醒:', isWakelock);
     * ```
     */
    isWakelock() {
        try {
            if (typeof plus === 'undefined') {
                return false;
            }

            if (!plus.device || typeof plus.device.isWakelock !== 'function') {
                return false;
            }

            return plus.device.isWakelock();

        } catch (error) {
            console.error('获取唤醒状态失败:', error);
            return false;
        }
    }

    /**
     * 设置应用是否保持唤醒状态
     * @param {boolean} lock - 是否保持唤醒状态
     *
     * @example
     * ```javascript
     * device.setWakelock(true);
     * console.log('已设置屏幕常亮');
     * ```
     */
    setWakelock(lock) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.device || typeof plus.device.setWakelock !== 'function') {
                return;
            }

            plus.device.setWakelock(lock);
            this.isWakelockEnabled = !!lock;

        } catch (error) {
            console.error('设置唤醒状态失败:', error);
        }
    }

    /**
     * 发出蜂鸣声
     * @param {number} [times=1] - 蜂鸣声重复次数
     *
     * @example
     * ```javascript
     * device.beep(3);
     * console.log('发出3次蜂鸣声');
     * ```
     */
    beep(times = 1) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.device || typeof plus.device.beep !== 'function') {
                return;
            }

            plus.device.beep(times);

        } catch (error) {
            console.error('发出蜂鸣声失败:', error);
        }
    }

    /**
     * 拨打电话
     * @param {string} number - 电话号码
     * @param {boolean} [confirm=true] - 是否需要用户确认
     *
     * @example
     * ```javascript
     * device.dial('10086', false);
     * console.log('正在拨打10086');
     * ```
     */
    dial(number, confirm = true) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.device || typeof plus.device.dial !== 'function') {
                return;
            }

            plus.device.dial(number, confirm);

        } catch (error) {
            console.error('拨打电话失败:', error);
        }
    }

    /**
     * 设备振动
     * @param {number} [milliseconds=500] - 振动持续时间（毫秒）
     *
     * @example
     * ```javascript
     * device.vibrate(2000);
     * console.log('设备振动2秒');
     * ```
     */
    vibrate(milliseconds = 500) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.device || typeof plus.device.vibrate !== 'function') {
                return;
            }

            plus.device.vibrate(milliseconds);

        } catch (error) {
            console.error('设备振动失败:', error);
        }
    }

    /**
     * 获取屏幕信息
     * @returns {ScreenInfo} 屏幕信息
     *
     * @example
     * ```javascript
     * const screenInfo = device.getScreenInfo();
     * console.log('屏幕信息:', screenInfo);
     * ```
     */
    getScreenInfo() {
        try {
            const info = {
                width: 0,
                height: 0,
                resolutionWidth: 0,
                resolutionHeight: 0,
                dpiX: 0,
                dpiY: 0,
                scale: 1
            };

            if (typeof plus === 'undefined') {
                return info;
            }

            if (plus.screen) {
                info.width = plus.screen.width || 0;
                info.height = plus.screen.height || 0;
                info.resolutionWidth = plus.screen.resolutionWidth || 0;
                info.resolutionHeight = plus.screen.resolutionHeight || 0;
                info.dpiX = plus.screen.dpiX || 0;
                info.dpiY = plus.screen.dpiY || 0;
                info.scale = plus.screen.scale || 1;
            }

            return info;

        } catch (error) {
            console.error('获取屏幕信息失败:', error);
            return {
                width: 0,
                height: 0,
                resolutionWidth: 0,
                resolutionHeight: 0,
                dpiX: 0,
                dpiY: 0,
                scale: 1
            };
        }
    }

    /**
     * 获取屏幕亮度
     * @returns {number} 屏幕亮度（0-1）
     *
     * @example
     * ```javascript
     * const brightness = device.getBrightness();
     * console.log('屏幕亮度:', brightness);
     * ```
     */
    getBrightness() {
        try {
            if (typeof plus === 'undefined') {
                return 0.5;
            }

            if (!plus.screen || typeof plus.screen.getBrightness !== 'function') {
                return 0.5;
            }

            return plus.screen.getBrightness();

        } catch (error) {
            console.error('获取屏幕亮度失败:', error);
            return 0.5;
        }
    }

    /**
     * 设置屏幕亮度
     * @param {number} brightness - 屏幕亮度（0-1，-1表示与系统保持一致）
     *
     * @example
     * ```javascript
     * device.setBrightness(0.8);
     * console.log('屏幕亮度已设置为80%');
     * ```
     */
    setBrightness(brightness) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.screen || typeof plus.screen.setBrightness !== 'function') {
                return;
            }

            plus.screen.setBrightness(brightness);

        } catch (error) {
            console.error('设置屏幕亮度失败:', error);
        }
    }

    /**
     * 锁定屏幕方向
     * @param {string} orientation - 屏幕方向
     *
     * @example
     * ```javascript
     * device.lockOrientation(device.ScreenOrientation.LANDSCAPE_PRIMARY);
     * console.log('已锁定为横屏方向');
     * ```
     */
    lockOrientation(orientation) {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.screen || typeof plus.screen.lockOrientation !== 'function') {
                return;
            }

            plus.screen.lockOrientation(orientation);

        } catch (error) {
            console.error('锁定屏幕方向失败:', error);
        }
    }

    /**
     * 解除锁定屏幕方向
     *
     * @example
     * ```javascript
     * device.unlockOrientation();
     * console.log('已解除屏幕方向锁定');
     * ```
     */
    unlockOrientation() {
        try {
            if (typeof plus === 'undefined') {
                return;
            }

            if (!plus.screen || typeof plus.screen.unlockOrientation !== 'function') {
                return;
            }

            plus.screen.unlockOrientation();

        } catch (error) {
            console.error('解除屏幕方向锁定失败:', error);
        }
    }

    /**
     * 获取当前屏幕信息
     * @returns {ScreenInfo} 当前屏幕信息
     *
     * @example
     * ```javascript
     * const currentSize = device.getCurrentScreenSize();
     * console.log('当前屏幕尺寸:', currentSize);
     * ```
     */
    getCurrentScreenSize() {
        try {
            if (typeof plus === 'undefined') {
                return {
                    width: 0,
                    height: 0,
                    resolutionWidth: 0,
                    resolutionHeight: 0
                };
            }

            if (!plus.screen || typeof plus.screen.getCurrentSize !== 'function') {
                return {
                    width: 0,
                    height: 0,
                    resolutionWidth: 0,
                    resolutionHeight: 0
                };
            }

            return plus.screen.getCurrentSize();

        } catch (error) {
            console.error('获取当前屏幕尺寸失败:', error);
            return {
                width: 0,
                height: 0,
                resolutionWidth: 0,
                resolutionHeight: 0
            };
        }
    }

    /**
     * 获取设备当前连接的网络类型
     * @returns {number} 网络类型常量
     *
     * @example
     * ```javascript
     * const networkType = device.getCurrentNetworkType();
     * const typeName = device.getNetworkTypeName(networkType);
     * console.log('网络类型:', typeName);
     * ```
     */
    getCurrentNetworkType() {
        try {
            if (typeof plus === 'undefined') {
                return ConnectionType.NONE;
            }

            if (!plus.networkinfo || typeof plus.networkinfo.getCurrentType !== 'function') {
                return ConnectionType.NONE;
            }

            return plus.networkinfo.getCurrentType();

        } catch (error) {
            console.error('获取网络类型失败:', error);
            return ConnectionType.NONE;
        }
    }

    /**
     * 获取当前网络是否设置代理
     * @returns {boolean} 是否设置代理
     *
     * @example
     * ```javascript
     * const hasProxy = device.isNetworkProxy();
     * console.log('是否设置代理:', hasProxy);
     * ```
     */
    isNetworkProxy() {
        try {
            if (typeof plus === 'undefined') {
                return false;
            }

            if (!plus.networkinfo || typeof plus.networkinfo.isSetProxy !== 'function') {
                return false;
            }

            return plus.networkinfo.isSetProxy();

        } catch (error) {
            console.error('获取代理状态失败:', error);
            return false;
        }
    }

    /**
     * 获取操作系统信息
     * @returns {OSInfo} 操作系统信息
     *
     * @example
     * ```javascript
     * const osInfo = device.getOSInfo();
     * console.log('操作系统信息:', osInfo);
     * ```
     */
    getOSInfo() {
        try {
            const info = {
                language: '',
                name: '',
                vendor: '',
                version: ''
            };

            if (typeof plus === 'undefined') {
                return info;
            }

            if (plus.os) {
                info.language = plus.os.language || '';
                info.name = plus.os.name || '';
                info.vendor = plus.os.vendor || '';
                info.version = plus.os.version || '';
            }

            return info;

        } catch (error) {
            console.error('获取操作系统信息失败:', error);
            return {
                language: '',
                name: '',
                vendor: '',
                version: ''
            };
        }
    }

    /**
     * 获取显示区域信息
     * @returns {Object} 显示区域信息
     *
     * @example
     * ```javascript
     * const displayInfo = device.getDisplayInfo();
     * console.log('显示区域信息:', displayInfo);
     * ```
     */
    getDisplayInfo() {
        try {
            const info = {
                resolutionWidth: 0,
                resolutionHeight: 0
            };

            if (typeof plus === 'undefined') {
                return info;
            }

            if (plus.display) {
                info.resolutionWidth = plus.display.resolutionWidth || 0;
                info.resolutionHeight = plus.display.resolutionHeight || 0;
            }

            return info;

        } catch (error) {
            console.error('获取显示区域信息失败:', error);
            return {
                resolutionWidth: 0,
                resolutionHeight: 0
            };
        }
    }

    /**
     * 判断设备是否支持device功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await device.isSupported();
     * if (isSupported) {
     *   console.log('设备支持Device功能');
     * } else {
     *   console.log('设备不支持Device功能');
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

                resolve(!!plus.device);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取网络类型名称
     * @param {number} type - 网络类型常量
     * @returns {string} 网络类型名称
     *
     * @example
     * ```javascript
     * const typeName = device.getNetworkTypeName(device.ConnectionType.WIFI);
     * console.log('网络类型:', typeName); // 输出: 无线WIFI网络
     * ```
     */
    getNetworkTypeName(type) {
        const typeNames = {
            [ConnectionType.UNKNOW]: '网络连接状态未知',
            [ConnectionType.NONE]: '未连接网络',
            [ConnectionType.ETHERNET]: '有线网络',
            [ConnectionType.WIFI]: '无线WIFI网络',
            [ConnectionType.CELL2G]: '蜂窝移动2G网络',
            [ConnectionType.CELL3G]: '蜂窝移动3G网络',
            [ConnectionType.CELL4G]: '蜂窝移动4G网络',
            [ConnectionType.CELL5G]: '蜂窝移动5G网络'
        };

        return typeNames[type] || '未知网络类型';
    }

    /**
     * 获取屏幕方向名称
     * @param {string} orientation - 屏幕方向常量
     * @returns {string} 屏幕方向名称
     *
     * @example
     * ```javascript
     * const orientationName = device.getScreenOrientationName(device.ScreenOrientation.LANDSCAPE_PRIMARY);
     * console.log('屏幕方向:', orientationName); // 输出: 横屏正方向
     * ```
     */
    getScreenOrientationName(orientation) {
        const orientationNames = {
            [ScreenOrientation.PORTRAIT_PRIMARY]: '竖屏正方向',
            [ScreenOrientation.PORTRAIT_SECONDARY]: '竖屏反方向',
            [ScreenOrientation.LANDSCAPE_PRIMARY]: '横屏正方向',
            [ScreenOrientation.LANDSCAPE_SECONDARY]: '横屏反方向',
            [ScreenOrientation.PORTRAIT]: '竖屏',
            [ScreenOrientation.LANDSCAPE]: '横屏'
        };

        return orientationNames[orientation] || '未知方向';
    }

    /**
     * 获取设备的基本属性（已废弃的API）
     * @returns {Object} 设备属性
     */
    getLegacyDeviceInfo() {
        try {
            const info = {
                imei: '',
                imsi: [],
                model: '',
                vendor: '',
                uuid: ''
            };

            if (typeof plus === 'undefined') {
                return info;
            }

            if (plus.device) {
                info.imei = plus.device.imei || '';
                info.imsi = plus.device.imsi || [];
                info.model = plus.device.model || '';
                info.vendor = plus.device.vendor || '';
                info.uuid = plus.device.uuid || '';
            }

            return info;

        } catch (error) {
            console.error('获取设备信息失败:', error);
            return {
                imei: '',
                imsi: [],
                model: '',
                vendor: '',
                uuid: ''
            };
        }
    }
}

// 创建Device模块实例
const device = new DeviceModule();

// 导出模块
export default device;

// 导出常量
export { ConnectionType, ScreenOrientation };

// 也可以导出类以便创建多个实例
export { DeviceModule };