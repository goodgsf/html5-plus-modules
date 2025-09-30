/**
 * HTML5+ Camera 模块 ES Module 封装
 *
 * 该模块提供了摄像头管理功能，支持拍照和摄像操作
 * 遵循HTML5+官方API规范
 */

/**
 * 摄像头常量
 */
export const CameraType = {
    MAIN: 1,     // 主摄像头
    AUXILIARY: 2  // 辅摄像头
};

/**
 * 图片格式常量
 */
export const ImageFormat = {
    JPG: 'jpg',
    PNG: 'png',
    BMP: 'bmp'
};

/**
 * 视频格式常量
 */
export const VideoFormat = {
    MP4: 'mp4',
    '3GP': '3gp',
    AVI: 'avi'
};

/**
 * 摄像头选项参数
 * @typedef {Object} CameraOptions
 * @property {string} [filename] - 拍照或摄像文件保存的路径
 * @property {string} [format] - 拍照或摄像的文件格式
 * @property {string} [resolution] - 拍照或摄像使用的分辨率
 * @property {number} [videoMaximumDuration] - 视频最大长度（秒）
 * @property {boolean} [optimize] - 是否优化图片（自动调整方向）
 * @property {Object} [crop] - 配置裁剪图片
 * @property {Object} [popover] - 拍照或摄像界面弹出指示区域
 */

/**
 * 裁剪图片设置项
 * @typedef {Object} CameraCropStyles
 * @property {number} quality - 裁剪后保存图片的质量（1-100）
 * @property {number} width - 裁剪的宽度（px）
 * @property {number} height - 裁剪的高度（px）
 * @property {boolean} [resize] - 是否将图片保存为指定的宽高像素
 * @property {boolean} [saveToAlbum] - 裁剪后的图片是否保存到相册中
 */

/**
 * 弹出位置参数
 * @typedef {Object} PopPosition
 * @property {string} [top] - 距离容器顶部的距离
 * @property {string} [left] - 距离容器左侧的距离
 * @property {string} [width] - 指示区域的宽度
 * @property {string} [height] - 指示区域的高度
 */

/**
 * 摄像头操作成功回调函数
 * @callback CameraSuccessCallback
 * @param {string} capturedFile - 拍照或摄像操作保存的文件路径
 */

/**
 * 摄像头操作失败回调函数
 * @callback CameraErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 摄像头对象
 * @typedef {Object} Camera
 * @property {string[]} supportedImageResolutions - 摄像头支持的拍照分辨率
 * @property {string[]} supportedVideoResolutions - 摄像头支持的摄像分辨率
 * @property {string[]} supportedImageFormats - 摄像头支持的拍照文件格式
 * @property {string[]} supportedVideoFormats - 摄像头支持的摄像文件格式
 * @property {function} captureImage - 进行拍照操作
 * @property {function} startVideoCapture - 调用摄像头进行摄像操作
 * @property {function} stopVideoCapture - 结束摄像操作
 */

/**
 * 摄像头操作结果对象
 * @typedef {Object} CameraResult
 * @property {string} path - 拍照或摄像操作保存的文件路径
 */

/**
 * Camera模块类
 */
class CameraModule {
    constructor() {
        this.cameras = new Map(); // 存储摄像头对象
    }

    /**
     * 获取摄像头管理对象
     * @param {number} [index] - 要获取摄像头的索引值，1表示主摄像头，2表示辅摄像头
     * @returns {Promise<Camera>|Camera} 摄像头对象
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const camera = await camera.getCamera(1);
     *   console.log('主摄像头获取成功');
     *   console.log('支持的拍照分辨率:', camera.supportedImageResolutions);
     *   console.log('支持的拍照格式:', camera.supportedImageFormats);
     * } catch (error) {
     *   console.error('获取摄像头失败:', error);
     * }
     * ```
     */
    getCamera(index) {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查摄像头模块是否可用
            if (!plus.camera) {
                throw new Error('设备不支持摄像头功能');
            }

            // 获取摄像头对象
            const camera = plus.camera.getCamera(index);
            const cameraId = 'camera_' + (index || 1) + '_' + Date.now();

            // 存储摄像头
            this.cameras.set(cameraId, camera);

            // 添加包装方法
            this.wrapCamera(camera, cameraId);

            return camera;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 包装摄像头对象，添加额外功能
     * @param {Object} camera - 摄像头对象
     * @param {string} cameraId - 摄像头ID
     */
    wrapCamera(camera, cameraId) {
        const originalCaptureImage = camera.captureImage;
        const originalStartVideoCapture = camera.startVideoCapture;
        const originalStopVideoCapture = camera.stopVideoCapture;

        // 包装captureImage方法
        camera.captureImage = function(successCB, errorCB, options) {
            try {
                // Promise支持
                if (typeof successCB !== 'function') {
                    return new Promise((resolve, reject) => {
                        originalCaptureImage.call(
                            camera,
                            resolve,
                            reject,
                            successCB
                        );
                    });
                }

                // 调用原生方法
                originalCaptureImage.call(
                    camera,
                    successCB,
                    errorCB || null,
                    options || {}
                );

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
        };

        // 包装startVideoCapture方法
        camera.startVideoCapture = function(successCB, errorCB, options) {
            try {
                // Promise支持
                if (typeof successCB !== 'function') {
                    return new Promise((resolve, reject) => {
                        originalStartVideoCapture.call(
                            camera,
                            resolve,
                            reject,
                            successCB
                        );
                    });
                }

                // 调用原生方法
                originalStartVideoCapture.call(
                    camera,
                    successCB,
                    errorCB || null,
                    options || {}
                );

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
        };

        // 包装stopVideoCapture方法
        camera.stopVideoCapturePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalStopVideoCapture.call(camera);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加销毁方法
        camera.destroy = function() {
            try {
                // 从存储中移除
                if (this.cameras.has(cameraId)) {
                    this.cameras.delete(cameraId);
                }
            } catch (error) {
                console.error('销毁摄像头失败:', error);
            }
        }.bind(this);
    }

    /**
     * 判断设备是否支持摄像头功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await camera.isSupported();
     * if (isSupported) {
     *   console.log('设备支持摄像头功能');
     * } else {
     *   console.log('设备不支持摄像头功能');
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

                resolve(!!plus.camera);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的摄像头信息
     * @returns {Array<Object>} 活跃摄像头信息数组
     *
     * @example
     * ```javascript
     * const activeCameras = camera.getActiveCameras();
     * console.log('活跃摄像头数量:', activeCameras.length);
     * activeCameras.forEach(camera => {
     *   console.log('摄像头ID:', camera.cameraId);
     * });
     * ```
     */
    getActiveCameras() {
        const cameras = [];
        this.cameras.forEach((camera, cameraId) => {
            cameras.push({
                cameraId: cameraId,
                supportedImageResolutions: camera.supportedImageResolutions || [],
                supportedVideoResolutions: camera.supportedVideoResolutions || [],
                supportedImageFormats: camera.supportedImageFormats || [],
                supportedVideoFormats: camera.supportedVideoFormats || []
            });
        });
        return cameras;
    }

    /**
     * 关闭所有活跃的摄像头
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await camera.closeAllCameras();
     * console.log('所有摄像头已关闭');
     * ```
     */
    closeAllCameras() {
        return new Promise((resolve, reject) => {
            try {
                this.cameras.clear();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取摄像头类型名称
     * @param {number} type - 摄像头类型常量
     * @returns {string} 摄像头类型名称
     *
     * @example
     * ```javascript
     * const typeName = camera.getTypeName(camera.MAIN);
     * console.log('摄像头类型:', typeName); // 输出: 主摄像头
     * ```
     */
    getTypeName(type) {
        const typeNames = {
            [CameraType.MAIN]: '主摄像头',
            [CameraType.AUXILIARY]: '辅摄像头'
        };

        return typeNames[type] || '未知类型';
    }

    /**
     * 获取图片格式名称
     * @param {string} format - 图片格式常量
     * @returns {string} 图片格式名称
     *
     * @example
     * ```javascript
     * const formatName = camera.getImageFormatName('jpg');
     * console.log('图片格式:', formatName); // 输出: JPEG格式
     * ```
     */
    getImageFormatName(format) {
        const formatNames = {
            [ImageFormat.JPG]: 'JPEG格式',
            [ImageFormat.PNG]: 'PNG格式',
            [ImageFormat.BMP]: 'BMP格式'
        };

        return formatNames[format] || '未知格式';
    }

    /**
     * 获取视频格式名称
     * @param {string} format - 视频格式常量
     * @returns {string} 视频格式名称
     *
     * @example
     * ```javascript
     * const formatName = camera.getVideoFormatName('mp4');
     * console.log('视频格式:', formatName); // 输出: MP4格式
     * ```
     */
    getVideoFormatName(format) {
        const formatNames = {
            [VideoFormat.MP4]: 'MP4格式',
            [VideoFormat['3GP']]: '3GP格式',
            [VideoFormat.AVI]: 'AVI格式'
        };

        return formatNames[format] || '未知格式';
    }
}

// 创建Camera模块实例
const camera = new CameraModule();

// 导出模块
export default camera;

// 导出常量
export { CameraType, ImageFormat, VideoFormat };

// 也可以导出类以便创建多个实例
export { CameraModule };