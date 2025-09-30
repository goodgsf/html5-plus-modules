/**
 * HTML5+ Video 模块 ES Module 封装
 *
 * 该模块提供了视频播放和直播推流功能，包括创建视频播放器、直播推流器
 * 以及相关的控制和事件监听功能。遵循HTML5+官方API规范。
 */

/**
 * 视频播放器错误码常量
 */
export const VideoPlayerErrorCode = {
    NOT_AVAILABLE: 1001,        // 视频播放功能不可用
    INVALID_URL: 1002,          // 无效的视频URL
    PLAY_ERROR: 1003,           // 播放失败
    NETWORK_ERROR: 1004,        // 网络错误
    DECODE_ERROR: 1005,         // 解码错误
    PERMISSION_DENIED: 1006,   // 权限被拒绝
    TIMEOUT: 1007,              // 操作超时
    UNKNOWN_ERROR: 1099         // 未知错误
};

/**
 * 直播推流错误码常量
 */
export const LivePusherErrorCode = {
    NOT_AVAILABLE: 1101,        // 直播推流功能不可用
    INVALID_URL: 1102,          // 无效的推流URL
    PUSH_ERROR: 1103,           // 推流失败
    NETWORK_ERROR: 1104,        // 网络错误
    ENCODE_ERROR: 1105,         // 编码错误
    CAMERA_ERROR: 1106,         // 摄像头错误
    MICROPHONE_ERROR: 1107,     // 麦克风错误
    PERMISSION_DENIED: 1108,    // 权限被拒绝
    TIMEOUT: 1109,              // 操作超时
    UNKNOWN_ERROR: 1199         // 未知错误
};

/**
 * 视频播放器配置选项
 * @typedef {Object} VideoPlayerStyles
 * @property {string} [width] - 播放器宽度，支持百分比、像素值
 * @property {string} [height] - 播放器高度，支持百分比、像素值
 * @property {string} [top] - 播放器上边距，支持像素值
 * @property {string} [left] - 播放器左边距，支持像素值
 * @property {string} [position] - 播放器位置，static、absolute、relative、fixed
 * @property {boolean} [controls=true] - 是否显示播放控件
 * @property {boolean} [autoplay=false] - 是否自动播放
 * @property {boolean} [loop=false] - 是否循环播放
 * @property {boolean} [muted=false] - 是否静音
 * @property {string} [poster] - 视频封面图URL
 * @property {string} [objectFit=contain] - 视频填充模式，contain、cover、fill
 */

/**
 * 直播推流器配置选项
 * @typedef {Object} LivePusherStyles
 * @property {string} [width] - 推流器宽度，支持百分比、像素值
 * @property {string} [height] - 推流器高度，支持百分比、像素值
 * @property {string} [top] - 推流器上边距，支持像素值
 * @property {string} [left] - 推流器左边距，支持像素值
 * @property {string} [position] - 推流器位置，static、absolute、relative、fixed
 * @property {boolean} [muted=false] - 是否静音
 * @property {boolean} [enableCamera=true] - 是否启用摄像头
 * @property {boolean} [autoFocus=true] - 是否自动对焦
 * @property {string} [beauty] - 美颜级别，off、low、medium、high
 * @property {string} [whiteness] - 美白级别，0-1
 * @property {string} [aspect] - 视频宽高比，3:4、9:16
 * @property {string} [minBitrate] - 最小码率
 * @property {string} [maxBitrate] - 最大码率
 * @property {string} [audioQuality] - 音频质量，low、medium、high
 * @property {boolean} [waitingImage] - 是否显示等待图片
 * @property {boolean} [onlyPushType] - 是否只推送指定类型
 * @property {string} [url] - 推流地址
 * @property {string} [mode] - 推流模式，RTC、Live
 */

/**
 * 视频播放器事件类型
 * @typedef {Object} VideoPlayerEventType
 * @property {string} PLAY - 播放事件
 * @property {string} PAUSE - 暂停事件
 * @property {string} STOPPED - 停止事件
 * @property {string} ENDED - 播放结束事件
 * @property {string} ERROR - 播放错误事件
 * @property {string} LOADED_METADATA - 元数据加载完成事件
 * @property {string} TIME_UPDATE - 播放时间更新事件
 * @property {string} FULLSCREEN_CHANGE - 全屏状态改变事件
 * @property {string} SEEKING - 跳转中事件
 * @property {string} SEEKED - 跳转完成事件
 */

/**
 * 直播推流器事件类型
 * @typedef {Object} LivePusherEventType
 * @property {string} STATE_CHANGED - 状态改变事件
 * @property {string} NET_STATUS - 网络状态事件
 * @property {string} ERROR - 错误事件
 * @property {string} START - 开始推流事件
 * @property {string} STOP - 停止推流事件
 * @property {string} PAUSE - 暂停推流事件
 * @property {string} RESUME - 恢复推流事件
 */

/**
 * 视频播放器事件信息
 * @typedef {Object} VideoPlayerEvent
 * @property {string} type - 事件类型
 * @property {number} target - 触发事件的目标对象
 * @property {number} [currentTime] - 当前播放时间
 * @property {number} [duration] - 视频总时长
 * @property {string} [message] - 错误消息
 * @property {number} [code] - 错误码
 */

/**
 * 直播推流器事件信息
 * @typedef {Object} LivePusherEvent
 * @property {string} type - 事件类型
 * @property {number} target - 触发事件的目标对象
 * @property {string} [state] - 当前状态
 * @property {string} [message] - 状态描述
 * @property {number} [code] - 错误码
 */

/**
 * 视频播放器信息
 * @typedef {Object} VideoPlayerInfo
 * @property {number} id - 播放器ID
 * @property {string} src - 视频源地址
 * @property {number} duration - 视频总时长
 * @property {number} currentTime - 当前播放时间
 * @property {number} buffered - 缓冲时长
 * @property {boolean} paused - 是否暂停
 * @property {boolean} seeking - 是否跳转中
 * @property {boolean} ended - 是否播放结束
 * @property {number} playbackRate - 播放速率
 * @property {number} volume - 音量
 * @property {boolean} muted - 是否静音
 * @property {boolean} fullscreen - 是否全屏
 */

/**
 * 直播推流器信息
 * @typedef {Object} LivePusherInfo
 * @property {number} id - 推流器ID
 * @property {string} url - 推流地址
 * @property {string} state - 推流状态
 * @property {boolean} pushing - 是否正在推流
 * @property {boolean} paused - 是否暂停
 * @property {string} camera} - 当前摄像头
 * @property {boolean} muted - 是否静音
 * @property {string} beauty - 美颜级别
 * @property {number} whiteness - 美白级别
 */

/**
 * 视频播放器事件回调函数
 * @callback VideoPlayerEventCallback
 * @param {VideoPlayerEvent} event - 事件信息
 */

/**
 * 直播推流器事件回调函数
 * @callback LivePusherEventCallback
 * @param {LivePusherEvent} event - 事件信息
 */

/**
 * 视频播放器类
 */
class VideoPlayer {
    constructor(nativePlayer) {
        this._nativePlayer = nativePlayer;
        this._eventListeners = new Map();
        this._isDestroyed = false;
        this._proxyProperties();
    }

    /**
     * 代理原生播放器属性
     * @private
     */
    _proxyProperties() {
        // 代理基本属性
        this._defineProxyProperty('id');
        this._defineProxyProperty('src');
        this._defineProxyProperty('duration');
        this._defineProxyProperty('currentTime');
        this._defineProxyProperty('buffered');
        this._defineProxyProperty('paused');
        this._defineProxyProperty('seeking');
        this._defineProxyProperty('ended');
        this._defineProxyProperty('playbackRate');
        this._defineProxyProperty('volume');
        this._defineProxyProperty('muted');
        this._defineProxyProperty('fullscreen');
    }

    /**
     * 定义代理属性
     * @private
     */
    _defineProxyProperty(propertyName) {
        Object.defineProperty(this, propertyName, {
            get: () => {
                if (this._isDestroyed) {
                    throw new Error('视频播放器已被销毁');
                }
                return this._nativePlayer[propertyName];
            },
            set: (value) => {
                if (this._isDestroyed) {
                    throw new Error('视频播放器已被销毁');
                }
                this._nativePlayer[propertyName] = value;
            },
            enumerable: true,
            configurable: true
        });
    }

    /**
     * 播放视频
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.play();
     *   console.log('视频开始播放');
     * } catch (error) {
     *   console.error('播放失败:', error);
     * }
     * ```
     */
    play() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                this._nativePlayer.play(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`播放失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`播放异常: ${error.message}`));
            }
        });
    }

    /**
     * 暂停播放
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.pause();
     *   console.log('视频已暂停');
     * } catch (error) {
     *   console.error('暂停失败:', error);
     * }
     * ```
     */
    pause() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                this._nativePlayer.pause(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`暂停失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`暂停异常: ${error.message}`));
            }
        });
    }

    /**
     * 停止播放
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.stop();
     *   console.log('视频已停止');
     * } catch (error) {
     *   console.error('停止失败:', error);
     * }
     * ```
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                this._nativePlayer.stop(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`停止失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`停止异常: ${error.message}`));
            }
        });
    }

    /**
     * 跳转到指定位置
     * @param {number} position - 跳转位置，单位秒
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.seek(30);
     *   console.log('已跳转到30秒位置');
     * } catch (error) {
     *   console.error('跳转失败:', error);
     * }
     * ```
     */
    seek(position) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            if (position === undefined || position === null || isNaN(position)) {
                reject(new Error('position参数必须是数字'));
                return;
            }

            try {
                this._nativePlayer.seek(position, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`跳转失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`跳转异常: ${error.message}`));
            }
        });
    }

    /**
     * 关闭播放器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.close();
     *   console.log('播放器已关闭');
     * } catch (error) {
     *   console.error('关闭失败:', error);
     * }
     * ```
     */
    close() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                resolve();
                return;
            }

            try {
                // 清理所有事件监听器
                this._eventListeners.clear();

                this._nativePlayer.close(() => {
                    this._isDestroyed = true;
                    resolve();
                }, (error) => {
                    this._isDestroyed = true;
                    reject(new Error(`关闭失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                this._isDestroyed = true;
                reject(new Error(`关闭异常: ${error.message}`));
            }
        });
    }

    /**
     * 设置播放器样式
     * @param {VideoPlayerStyles} styles - 样式配置
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.setStyles({
     *     width: '100%',
     *     height: '200px',
     *     controls: true,
     *     autoplay: false
     *   });
     *   console.log('样式设置成功');
     * } catch (error) {
     *   console.error('设置样式失败:', error);
     * }
     * ```
     */
    setStyles(styles) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            if (!styles || typeof styles !== 'object') {
                reject(new Error('styles参数必须是对象'));
                return;
            }

            try {
                this._nativePlayer.setStyles(styles, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`设置样式失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`设置样式异常: ${error.message}`));
            }
        });
    }

    /**
     * 请求全屏
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.requestFullscreen();
     *   console.log('已进入全屏模式');
     * } catch (error) {
     *   console.error('进入全屏失败:', error);
     * }
     * ```
     */
    requestFullscreen() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                this._nativePlayer.requestFullscreen(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`请求全屏失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`请求全屏异常: ${error.message}`));
            }
        });
    }

    /**
     * 退出全屏
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.exitFullscreen();
     *   console.log('已退出全屏模式');
     * } catch (error) {
     *   console.error('退出全屏失败:', error);
     * }
     * ```
     */
    exitFullscreen() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                this._nativePlayer.exitFullscreen(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`退出全屏失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`退出全屏异常: ${error.message}`));
            }
        });
    }

    /**
     * 设置播放速率
     * @param {number} rate - 播放速率，0.5-2.0
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await videoPlayer.playbackRate(1.5);
     *   console.log('播放速率设置为1.5倍');
     * } catch (error) {
     *   console.error('设置播放速率失败:', error);
     * }
     * ```
     */
    playbackRate(rate) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            if (rate === undefined || rate === null || isNaN(rate)) {
                reject(new Error('rate参数必须是数字'));
                return;
            }

            if (rate < 0.5 || rate > 2.0) {
                reject(new Error('播放速率必须在0.5-2.0之间'));
                return;
            }

            try {
                this._nativePlayer.playbackRate(rate, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`设置播放速率失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`设置播放速率异常: ${error.message}`));
            }
        });
    }

    /**
     * 添加事件监听器
     * @param {string} event - 事件类型
     * @param {VideoPlayerEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * videoPlayer.addEventListener('play', (event) => {
     *   console.log('视频开始播放:', event);
     * });
     *
     * videoPlayer.addEventListener('error', (event) => {
     *   console.error('播放错误:', event);
     * });
     * ```
     */
    addEventListener(event, callback) {
        if (this._isDestroyed) {
            throw new Error('视频播放器已被销毁');
        }

        if (!event || typeof event !== 'string') {
            throw new Error('event参数不能为空且必须是字符串');
        }

        if (typeof callback !== 'function') {
            throw new Error('callback参数必须是函数');
        }

        // 添加到事件监听器映射
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, new Set());
        }
        this._eventListeners.get(event).add(callback);

        // 包装回调函数以符合原生API期望
        const wrappedCallback = (nativeEvent) => {
            if (this._isDestroyed) return;

            const event = {
                type: nativeEvent.type || 'unknown',
                target: nativeEvent.target || this.id,
                currentTime: nativeEvent.currentTime,
                duration: nativeEvent.duration,
                message: nativeEvent.message,
                code: nativeEvent.code
            };

            try {
                callback(event);
            } catch (error) {
                console.error('视频播放器事件回调执行失败:', error);
            }
        };

        // 保存包装后的回调函数，以便后续移除
        if (!this._nativePlayer._wrappedCallbacks) {
            this._nativePlayer._wrappedCallbacks = new Map();
        }
        this._nativePlayer._wrappedCallbacks.set(callback, wrappedCallback);

        // 添加到原生播放器
        this._nativePlayer.addEventListener(event, wrappedCallback);
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件类型
     * @param {VideoPlayerEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * const handlePlay = (event) => {
     *   console.log('视频开始播放:', event);
     * };
     *
     * videoPlayer.addEventListener('play', handlePlay);
     * // 稍后移除监听器
     * videoPlayer.removeEventListener('play', handlePlay);
     * ```
     */
    removeEventListener(event, callback) {
        if (this._isDestroyed) {
            return;
        }

        if (!event || typeof event !== 'string') {
            throw new Error('event参数不能为空且必须是字符串');
        }

        if (typeof callback !== 'function') {
            throw new Error('callback参数必须是函数');
        }

        // 从事件监听器映射中移除
        if (this._eventListeners.has(event)) {
            this._eventListeners.get(event).delete(callback);
            if (this._eventListeners.get(event).size === 0) {
                this._eventListeners.delete(event);
            }
        }

        // 从原生播放器移除
        if (this._nativePlayer._wrappedCallbacks && this._nativePlayer._wrappedCallbacks.has(callback)) {
            const wrappedCallback = this._nativePlayer._wrappedCallbacks.get(callback);
            this._nativePlayer.removeEventListener(event, wrappedCallback);
            this._nativePlayer._wrappedCallbacks.delete(callback);
        }
    }

    /**
     * 获取播放器信息
     * @returns {Promise<VideoPlayerInfo>}
     *
     * @example
     * ```javascript
     * try {
     *   const info = await videoPlayer.getInfo();
     *   console.log('播放器信息:', info);
     * } catch (error) {
     *   console.error('获取信息失败:', error);
     * }
     * ```
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('视频播放器已被销毁'));
                return;
            }

            try {
                const info = {
                    id: this._nativePlayer.id,
                    src: this._nativePlayer.src,
                    duration: this._nativePlayer.duration,
                    currentTime: this._nativePlayer.currentTime,
                    buffered: this._nativePlayer.buffered,
                    paused: this._nativePlayer.paused,
                    seeking: this._nativePlayer.seeking,
                    ended: this._nativePlayer.ended,
                    playbackRate: this._nativePlayer.playbackRate,
                    volume: this._nativePlayer.volume,
                    muted: this._nativePlayer.muted,
                    fullscreen: this._nativePlayer.fullscreen
                };

                resolve(info);
            } catch (error) {
                reject(new Error(`获取播放器信息失败: ${error.message}`));
            }
        });
    }
}

/**
 * 直播推流器类
 */
class LivePusher {
    constructor(nativePusher) {
        this._nativePusher = nativePusher;
        this._eventListeners = new Map();
        this._isDestroyed = false;
        this._proxyProperties();
    }

    /**
     * 代理原生推流器属性
     * @private
     */
    _proxyProperties() {
        // 代理基本属性
        this._defineProxyProperty('id');
        this._defineProxyProperty('url');
        this._defineProxyProperty('state');
        this._defineProxyProperty('pushing');
        this._defineProxyProperty('paused');
        this._defineProxyProperty('camera');
        this._defineProxyProperty('muted');
        this._defineProxyProperty('beauty');
        this._defineProxyProperty('whiteness');
    }

    /**
     * 定义代理属性
     * @private
     */
    _defineProxyProperty(propertyName) {
        Object.defineProperty(this, propertyName, {
            get: () => {
                if (this._isDestroyed) {
                    throw new Error('直播推流器已被销毁');
                }
                return this._nativePusher[propertyName];
            },
            set: (value) => {
                if (this._isDestroyed) {
                    throw new Error('直播推流器已被销毁');
                }
                this._nativePusher[propertyName] = value;
            },
            enumerable: true,
            configurable: true
        });
    }

    /**
     * 开始推流
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.start();
     *   console.log('推流已开始');
     * } catch (error) {
     *   console.error('推流失败:', error);
     * }
     * ```
     */
    start() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.start(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`推流失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`推流异常: ${error.message}`));
            }
        });
    }

    /**
     * 停止推流
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.stop();
     *   console.log('推流已停止');
     * } catch (error) {
     *   console.error('停止推流失败:', error);
     * }
     * ```
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.stop(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`停止推流失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`停止推流异常: ${error.message}`));
            }
        });
    }

    /**
     * 暂停推流
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.pause();
     *   console.log('推流已暂停');
     * } catch (error) {
     *   console.error('暂停推流失败:', error);
     * }
     * ```
     */
    pause() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.pause(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`暂停推流失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`暂停推流异常: ${error.message}`));
            }
        });
    }

    /**
     * 恢复推流
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.resume();
     *   console.log('推流已恢复');
     * } catch (error) {
     *   console.error('恢复推流失败:', error);
     * }
     * ```
     */
    resume() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.resume(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`恢复推流失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`恢复推流异常: ${error.message}`));
            }
        });
    }

    /**
     * 切换摄像头
     * @param {string} camera - 摄像头位置，front、back
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.switchCamera('front');
     *   console.log('已切换到前置摄像头');
     * } catch (error) {
     *   console.error('切换摄像头失败:', error);
     * }
     * ```
     */
    switchCamera(camera) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            if (!camera || typeof camera !== 'string') {
                reject(new Error('camera参数不能为空且必须是字符串'));
                return;
            }

            if (camera !== 'front' && camera !== 'back') {
                reject(new Error('camera参数必须是front或back'));
                return;
            }

            try {
                this._nativePusher.switchCamera(camera, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`切换摄像头失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`切换摄像头异常: ${error.message}`));
            }
        });
    }

    /**
     * 快照
     * @returns {Promise<string>} 快照图片路径
     *
     * @example
     * ```javascript
     * try {
     *   const snapshotPath = await livePusher.snapshot();
     *   console.log('快照已保存:', snapshotPath);
     * } catch (error) {
     *   console.error('快照失败:', error);
     * }
     * ```
     */
    snapshot() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.snapshot((path) => {
                    resolve(path);
                }, (error) => {
                    reject(new Error(`快照失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`快照异常: ${error.message}`));
            }
        });
    }

    /**
     * 预览
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.preview();
     *   console.log('预览已开始');
     * } catch (error) {
     *   console.error('预览失败:', error);
     * }
     * ```
     */
    preview() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                this._nativePusher.preview(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`预览失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`预览异常: ${error.message}`));
            }
        });
    }

    /**
     * 关闭推流器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.close();
     *   console.log('推流器已关闭');
     * } catch (error) {
     *   console.error('关闭失败:', error);
     * }
     * ```
     */
    close() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                resolve();
                return;
            }

            try {
                // 清理所有事件监听器
                this._eventListeners.clear();

                this._nativePusher.close(() => {
                    this._isDestroyed = true;
                    resolve();
                }, (error) => {
                    this._isDestroyed = true;
                    reject(new Error(`关闭失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                this._isDestroyed = true;
                reject(new Error(`关闭异常: ${error.message}`));
            }
        });
    }

    /**
     * 设置推流器样式
     * @param {LivePusherStyles} styles - 样式配置
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await livePusher.setStyles({
     *     width: '100%',
     *     height: '200px',
     *     beauty: 'medium',
     *     aspect: '9:16'
     *   });
     *   console.log('样式设置成功');
     * } catch (error) {
     *   console.error('设置样式失败:', error);
     * }
     * ```
     */
    setStyles(styles) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            if (!styles || typeof styles !== 'object') {
                reject(new Error('styles参数必须是对象'));
                return;
            }

            try {
                this._nativePusher.setStyles(styles, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`设置样式失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`设置样式异常: ${error.message}`));
            }
        });
    }

    /**
     * 添加事件监听器
     * @param {string} event - 事件类型
     * @param {LivePusherEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * livePusher.addEventListener('statechange', (event) => {
     *   console.log('状态改变:', event);
     * });
     *
     * livePusher.addEventListener('error', (event) => {
     *   console.error('推流错误:', event);
     * });
     * ```
     */
    addEventListener(event, callback) {
        if (this._isDestroyed) {
            throw new Error('直播推流器已被销毁');
        }

        if (!event || typeof event !== 'string') {
            throw new Error('event参数不能为空且必须是字符串');
        }

        if (typeof callback !== 'function') {
            throw new Error('callback参数必须是函数');
        }

        // 添加到事件监听器映射
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, new Set());
        }
        this._eventListeners.get(event).add(callback);

        // 包装回调函数以符合原生API期望
        const wrappedCallback = (nativeEvent) => {
            if (this._isDestroyed) return;

            const event = {
                type: nativeEvent.type || 'unknown',
                target: nativeEvent.target || this.id,
                state: nativeEvent.state,
                message: nativeEvent.message,
                code: nativeEvent.code
            };

            try {
                callback(event);
            } catch (error) {
                console.error('直播推流器事件回调执行失败:', error);
            }
        };

        // 保存包装后的回调函数，以便后续移除
        if (!this._nativePusher._wrappedCallbacks) {
            this._nativePusher._wrappedCallbacks = new Map();
        }
        this._nativePusher._wrappedCallbacks.set(callback, wrappedCallback);

        // 添加到原生推流器
        this._nativePusher.addEventListener(event, wrappedCallback);
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件类型
     * @param {LivePusherEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * const handleStateChange = (event) => {
     *   console.log('状态改变:', event);
     * };
     *
     * livePusher.addEventListener('statechange', handleStateChange);
     * // 稍后移除监听器
     * livePusher.removeEventListener('statechange', handleStateChange);
     * ```
     */
    removeEventListener(event, callback) {
        if (this._isDestroyed) {
            return;
        }

        if (!event || typeof event !== 'string') {
            throw new Error('event参数不能为空且必须是字符串');
        }

        if (typeof callback !== 'function') {
            throw new Error('callback参数必须是函数');
        }

        // 从事件监听器映射中移除
        if (this._eventListeners.has(event)) {
            this._eventListeners.get(event).delete(callback);
            if (this._eventListeners.get(event).size === 0) {
                this._eventListeners.delete(event);
            }
        }

        // 从原生推流器移除
        if (this._nativePusher._wrappedCallbacks && this._nativePusher._wrappedCallbacks.has(callback)) {
            const wrappedCallback = this._nativePusher._wrappedCallbacks.get(callback);
            this._nativePusher.removeEventListener(event, wrappedCallback);
            this._nativePusher._wrappedCallbacks.delete(callback);
        }
    }

    /**
     * 获取推流器信息
     * @returns {Promise<LivePusherInfo>}
     *
     * @example
     * ```javascript
     * try {
     *   const info = await livePusher.getInfo();
     *   console.log('推流器信息:', info);
     * } catch (error) {
     *   console.error('获取信息失败:', error);
     * }
     * ```
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('直播推流器已被销毁'));
                return;
            }

            try {
                const info = {
                    id: this._nativePusher.id,
                    url: this._nativePusher.url,
                    state: this._nativePusher.state,
                    pushing: this._nativePusher.pushing,
                    paused: this._nativePusher.paused,
                    camera: this._nativePusher.camera,
                    muted: this._nativePusher.muted,
                    beauty: this._nativePusher.beauty,
                    whiteness: this._nativePusher.whiteness
                };

                resolve(info);
            } catch (error) {
                reject(new Error(`获取推流器信息失败: ${error.message}`));
            }
        });
    }
}

/**
 * HTML5+ Video 模块类
 */
class VideoModule {
    constructor() {
        this.moduleName = 'Video';
        this._videoPlayers = new Map();
        this._livePushers = new Map();
        this._nextId = 1;
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化Video模块
     * @private
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this._initPromise) {
            return this._initPromise;
        }

        this._initPromise = new Promise((resolve, reject) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined' || !plus.video) {
                    // 检查浏览器环境是否支持视频功能
                    if (typeof window !== 'undefined' && 'HTMLVideoElement' in window) {
                        this._browserSupport = true;
                        console.log('Video模块将在浏览器环境中使用HTML5 Video API');
                    } else {
                        console.warn('设备不支持视频功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Video模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 创建视频播放器
     * @param {string} url - 视频URL
     * @param {VideoPlayerStyles} [styles] - 播放器样式
     * @returns {Promise<VideoPlayer>} 视频播放器对象
     *
     * @example
     * ```javascript
     * try {
     *   const videoPlayer = await video.createVideoPlayer(
     *     'https://example.com/video.mp4',
     *     {
     *       width: '100%',
     *       height: '200px',
     *       controls: true,
     *       autoplay: false
     *     }
     *   );
     *   console.log('视频播放器创建成功:', videoPlayer.id);
     * } catch (error) {
     *   console.error('创建播放器失败:', error);
     * }
     * ```
     */
    createVideoPlayer(url, styles = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!url || typeof url !== 'string') {
                    throw new Error('url参数不能为空且必须是字符串');
                }

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    plus.video.createVideoPlayer(url, styles,
                        (nativePlayer) => {
                            const videoPlayer = new VideoPlayer(nativePlayer);
                            this._videoPlayers.set(nativePlayer.id, videoPlayer);
                            resolve(videoPlayer);
                        },
                        (error) => {
                            reject(new Error(`创建视频播放器失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境
                    this._createVideoPlayerBrowser(url, styles, resolve, reject);
                } else {
                    throw new Error('设备不支持视频播放功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中创建视频播放器
     * @private
     */
    _createVideoPlayerBrowser(url, styles, resolve, reject) {
        try {
            const videoElement = document.createElement('video');
            videoElement.src = url;
            videoElement.id = `video_${this._nextId++}`;

            // 应用样式
            if (styles) {
                Object.assign(videoElement.style, {
                    width: styles.width || '100%',
                    height: styles.height || '200px',
                    position: styles.position || 'static',
                    top: styles.top || 'auto',
                    left: styles.left || 'auto',
                    objectFit: styles.objectFit || 'contain'
                });

                if (styles.controls !== undefined) {
                    videoElement.controls = styles.controls;
                }
                if (styles.autoplay !== undefined) {
                    videoElement.autoplay = styles.autoplay;
                }
                if (styles.loop !== undefined) {
                    videoElement.loop = styles.loop;
                }
                if (styles.muted !== undefined) {
                    videoElement.muted = styles.muted;
                }
                if (styles.poster) {
                    videoElement.poster = styles.poster;
                }
            }

            // 创建模拟的原生播放器对象
            const nativePlayer = {
                id: videoElement.id,
                src: url,
                element: videoElement,
                duration: 0,
                currentTime: 0,
                buffered: 0,
                paused: true,
                seeking: false,
                ended: false,
                playbackRate: 1.0,
                volume: 1.0,
                muted: false,
                fullscreen: false,
                play: (success, error) => {
                    try {
                        videoElement.play()
                            .then(() => success && success())
                            .catch(err => error && error(err));
                    } catch (err) {
                        error && error(err);
                    }
                },
                pause: (success, error) => {
                    try {
                        videoElement.pause();
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                stop: (success, error) => {
                    try {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                seek: (position, success, error) => {
                    try {
                        videoElement.currentTime = position;
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                close: (success, error) => {
                    try {
                        videoElement.pause();
                        videoElement.remove();
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                setStyles: (newStyles, success, error) => {
                    try {
                        Object.assign(videoElement.style, {
                            width: newStyles.width || videoElement.style.width,
                            height: newStyles.height || videoElement.style.height,
                            position: newStyles.position || videoElement.style.position,
                            top: newStyles.top || videoElement.style.top,
                            left: newStyles.left || videoElement.style.left,
                            objectFit: newStyles.objectFit || videoElement.style.objectFit
                        });
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                requestFullscreen: (success, error) => {
                    try {
                        if (videoElement.requestFullscreen) {
                            videoElement.requestFullscreen();
                        }
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                exitFullscreen: (success, error) => {
                    try {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        }
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                playbackRate: (rate, success, error) => {
                    try {
                        videoElement.playbackRate = rate;
                        success && success();
                    } catch (err) {
                        error && error(err);
                    }
                },
                addEventListener: (event, callback) => {
                    videoElement.addEventListener(event, callback);
                },
                removeEventListener: (event, callback) => {
                    videoElement.removeEventListener(event, callback);
                }
            };

            // 监听视频事件
            videoElement.addEventListener('loadedmetadata', () => {
                nativePlayer.duration = videoElement.duration;
            });

            videoElement.addEventListener('timeupdate', () => {
                nativePlayer.currentTime = videoElement.currentTime;
                nativePlayer.buffered = videoElement.buffered.length > 0 ?
                    videoElement.buffered.end(0) - videoElement.currentTime : 0;
            });

            videoElement.addEventListener('play', () => {
                nativePlayer.paused = false;
            });

            videoElement.addEventListener('pause', () => {
                nativePlayer.paused = true;
            });

            videoElement.addEventListener('seeking', () => {
                nativePlayer.seeking = true;
            });

            videoElement.addEventListener('seeked', () => {
                nativePlayer.seeking = false;
            });

            videoElement.addEventListener('ended', () => {
                nativePlayer.ended = true;
            });

            videoElement.addEventListener('volumechange', () => {
                nativePlayer.volume = videoElement.volume;
                nativePlayer.muted = videoElement.muted;
            });

            document.body.appendChild(videoElement);

            const videoPlayer = new VideoPlayer(nativePlayer);
            this._videoPlayers.set(nativePlayer.id, videoPlayer);
            resolve(videoPlayer);

        } catch (error) {
            reject(new Error(`浏览器环境创建视频播放器失败: ${error.message}`));
        }
    }

    /**
     * 创建直播推流器
     * @param {string} url - 推流URL
     * @param {LivePusherStyles} [styles] - 推流器样式
     * @returns {Promise<LivePusher>} 直播推流器对象
     *
     * @example
     * ```javascript
     * try {
     *   const livePusher = await video.createLivePusher(
     *     'rtmp://example.com/live/stream',
     *     {
     *       width: '100%',
     *       height: '200px',
     *       beauty: 'medium',
     *       aspect: '9:16'
     *     }
     *   );
     *   console.log('直播推流器创建成功:', livePusher.id);
     * } catch (error) {
     *   console.error('创建推流器失败:', error);
     * }
     * ```
     */
    createLivePusher(url, styles = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!url || typeof url !== 'string') {
                    throw new Error('url参数不能为空且必须是字符串');
                }

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    plus.video.createLivePusher(url, styles,
                        (nativePusher) => {
                            const livePusher = new LivePusher(nativePusher);
                            this._livePushers.set(nativePusher.id, livePusher);
                            resolve(livePusher);
                        },
                        (error) => {
                            reject(new Error(`创建直播推流器失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else {
                    // 浏览器环境暂不支持直播推流
                    throw new Error('浏览器环境暂不支持直播推流功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 根据ID获取视频播放器
     * @param {number} id - 视频播放器ID
     * @returns {Promise<VideoPlayer>} 视频播放器对象
     *
     * @example
     * ```javascript
     * try {
     *   const videoPlayer = await video.getVideoPlayerById(1);
     *   if (videoPlayer) {
     *     console.log('找到视频播放器:', videoPlayer.id);
     *   } else {
     *     console.log('未找到指定的视频播放器');
     *   }
     * } catch (error) {
     *   console.error('获取播放器失败:', error);
     * }
     * ```
     */
    getVideoPlayerById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id && id !== 0) {
                    throw new Error('id参数不能为空');
                }

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    plus.video.getVideoPlayerById(id,
                        (nativePlayer) => {
                            if (!nativePlayer) {
                                resolve(null);
                                return;
                            }

                            // 检查是否已创建对应的VideoPlayer对象
                            let videoPlayer = this._videoPlayers.get(id);
                            if (!videoPlayer) {
                                videoPlayer = new VideoPlayer(nativePlayer);
                                this._videoPlayers.set(id, videoPlayer);
                            }
                            resolve(videoPlayer);
                        },
                        (error) => {
                            reject(new Error(`获取视频播放器失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境
                    const videoPlayer = this._videoPlayers.get(id);
                    resolve(videoPlayer || null);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 根据ID获取直播推流器
     * @param {number} id - 直播推流器ID
     * @returns {Promise<LivePusher>} 直播推流器对象
     *
     * @example
     * ```javascript
     * try {
     *   const livePusher = await video.getLivePusherById(1);
     *   if (livePusher) {
     *     console.log('找到直播推流器:', livePusher.id);
     *   } else {
     *     console.log('未找到指定的直播推流器');
     *   }
     * } catch (error) {
     *   console.error('获取推流器失败:', error);
     * }
     * ```
     */
    getLivePusherById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id && id !== 0) {
                    throw new Error('id参数不能为空');
                }

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    plus.video.getLivePusherById(id,
                        (nativePusher) => {
                            if (!nativePusher) {
                                resolve(null);
                                return;
                            }

                            // 检查是否已创建对应的LivePusher对象
                            let livePusher = this._livePushers.get(id);
                            if (!livePusher) {
                                livePusher = new LivePusher(nativePusher);
                                this._livePushers.set(id, livePusher);
                            }
                            resolve(livePusher);
                        },
                        (error) => {
                            reject(new Error(`获取直播推流器失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else {
                    // 浏览器环境暂不支持
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前活跃的视频播放器数量
     * @returns {number} 活跃播放器数量
     *
     * @example
     * ```javascript
     * const count = video.getActiveVideoPlayerCount();
     * console.log('活跃视频播放器数量:', count);
     * ```
     */
    getActiveVideoPlayerCount() {
        return this._videoPlayers.size;
    }

    /**
     * 获取当前活跃的直播推流器数量
     * @returns {number} 活跃推流器数量
     *
     * @example
     * ```javascript
     * const count = video.getActiveLivePusherCount();
     * console.log('活跃直播推流器数量:', count);
     * ```
     */
    getActiveLivePusherCount() {
        return this._livePushers.size;
    }

    /**
     * 关闭所有视频播放器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await video.closeAllVideoPlayers();
     *   console.log('所有视频播放器已关闭');
     * } catch (error) {
     *   console.error('关闭播放器失败:', error);
     * }
     * ```
     */
    closeAllVideoPlayers() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const closePromises = Array.from(this._videoPlayers.values()).map(player =>
                    player.close().catch(error => {
                        console.error(`关闭视频播放器 ${player.id} 失败:`, error);
                    })
                );

                await Promise.all(closePromises);
                this._videoPlayers.clear();
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 关闭所有直播推流器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await video.closeAllLivePushers();
     *   console.log('所有直播推流器已关闭');
     * } catch (error) {
     *   console.error('关闭推流器失败:', error);
     * }
     * ```
     */
    closeAllLivePushers() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const closePromises = Array.from(this._livePushers.values()).map(pusher =>
                    pusher.close().catch(error => {
                        console.error(`关闭直播推流器 ${pusher.id} 失败:`, error);
                    })
                );

                await Promise.all(closePromises);
                this._livePushers.clear();
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 判断设备是否支持视频播放功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await video.isVideoPlayerSupported();
     *   if (isSupported) {
     *     console.log('设备支持视频播放功能');
     *   } else {
     *     console.log('设备不支持视频播放功能');
     *   }
     * } catch (error) {
     *   console.error('检查支持性失败:', error);
     * }
     * ```
     */
    isVideoPlayerSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    resolve(true);
                } else if (this._browserSupport) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 判断设备是否支持直播推流功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await video.isLivePusherSupported();
     *   if (isSupported) {
     *     console.log('设备支持直播推流功能');
     *   } else {
     *     console.log('设备不支持直播推流功能');
     *   }
     * } catch (error) {
     *   console.error('检查支持性失败:', error);
     * }
     * ```
     */
    isLivePusherSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 检查视频播放权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await video.checkVideoPlayerPermission();
     *   console.log('权限状态:', permission);
     * } catch (error) {
     *   console.error('检查权限失败:', error);
     * }
     * ```
     */
    checkVideoPlayerPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 检查直播推流权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await video.checkLivePusherPermission();
     *   console.log('权限状态:', permission);
     * } catch (error) {
     *   console.error('检查权限失败:', error);
     * }
     * ```
     */
    checkLivePusherPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求视频播放权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await video.requestVideoPlayerPermission();
     *   if (permission === 'granted') {
     *     console.log('权限已授予');
     *   } else {
     *     console.log('权限被拒绝');
     *   }
     * } catch (error) {
     *   console.error('请求权限失败:', error);
     * }
     * ```
     */
    requestVideoPlayerPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境通常不需要权限请求
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求直播推流权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await video.requestLivePusherPermission();
     *   if (permission === 'granted') {
     *     console.log('权限已授予');
     *   } else {
     *     console.log('权限被拒绝');
     *   }
     * } catch (error) {
     *   console.error('请求权限失败:', error);
     * }
     * ```
     */
    requestLivePusherPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.video) {
                    // HTML5+环境
                    resolve('granted');
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Video模块实例
const video = new VideoModule();

// 导出模块
export default video;

// 导出类和常量
export { VideoModule, VideoPlayer, LivePusher, VideoPlayerErrorCode, LivePusherErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
video.VideoModule = VideoModule;
video.VideoPlayer = VideoPlayer;
video.LivePusher = LivePusher;
video.VideoPlayerErrorCode = VideoPlayerErrorCode;
video.LivePusherErrorCode = LivePusherErrorCode;