/**
 * HTML5+ Audio 模块 ES Module 封装
 *
 * 该模块提供了音频录制和播放功能，遵循HTML5+官方API规范
 * 支持录音、播放、暂停、倍速播放等完整音频操作
 */

/**
 * 音频输出线路常量
 */
export const AudioRoute = {
    ROUTE_SPEAKER: 'speaker',    // 设备的扬声器音频输出线路
    ROUTE_EARPIECE: 'earpiece'   // 设备听筒音频输出线路
};

/**
 * 音频播放事件类型
 * @typedef {string} AudioPlayerEvent
 * @property {string} 'play' - 播放事件
 * @property {string} 'pause' - 暂停事件
 * @property {string} 'ended' - 结束事件
 * @property {string} 'error' - 错误事件
 * @property {string} 'timeupdate' - 播放位置更新事件
 * @property {string} 'progress' - 缓冲进度事件
 * @property {string} 'canplay' - 可以播放事件
 */

/**
 * 音频播放对象的参数
 * @typedef {Object} AudioPlayerStyles
 * @property {string} [src] - 音频文件地址
 * @property {boolean} [autoplay] - 是否自动播放，默认false
 * @property {boolean} [loop] - 是否循环播放，默认false
 * @property {number} [volume] - 音量大小，范围0-1，默认1
 * @property {number} [playbackRate] - 播放速度，默认1
 */

/**
 * 音频录制的参数
 * @typedef {Object} AudioRecorderStyles
 * @property {string} [filename] - 录音文件名
 * @property {string} [format] - 录音格式，如'mp3'、'wav'等
 * @property {number} [samplerate] - 采样率，如8000、11025、16000等
 * @property {number} [channels] - 声道数，1为单声道，2为立体声
 */

/**
 * 录音操作成功回调
 * @callback RecordSuccessCallback
 * @param {string} filename - 录音文件路径
 */

/**
 * 播放音频文件操作成功回调
 * @callback PlaySuccessCallback
 */

/**
 * 音频操作失败回调
 * @callback AudioErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 事件回调函数
 * @callback EventCallback
 * @param {Object} event - 事件对象
 * @param {string} event.type - 事件类型
 * @param {*} event.data - 事件数据
 */

/**
 * Audio模块类
 */
class AudioModule {
    constructor() {
        this.players = new Map(); // 存储播放器实例
        this.recorders = new Map(); // 存储录音器实例
    }

    /**
     * 获取当前设备的录音对象
     * @returns {Promise<AudioRecorder>|AudioRecorder} 录音对象
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const recorder = await audio.getRecorder();
     *   console.log('录音对象创建成功');
     *   console.log('支持的采样率:', recorder.supportedSamplerates);
     *   console.log('支持的格式:', recorder.supportedFormats);
     * } catch (error) {
     *   console.error('获取录音对象失败:', error);
     * }
     * ```
     */
    getRecorder() {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查音频模块是否可用
            if (!plus.audio) {
                throw new Error('设备不支持音频模块');
            }

            // 获取录音对象
            const recorder = plus.audio.getRecorder();
            const recorderId = 'recorder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储录音器
            this.recorders.set(recorderId, recorder);

            // 添加包装方法
            this.wrapAudioRecorder(recorder, recorderId);

            return recorder;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 创建音频播放器对象
     * @param {AudioPlayerStyles} [styles] - 音频播放对象的参数
     * @returns {Promise<AudioPlayer>|AudioPlayer} 音频播放器对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const player = await audio.createPlayer({
     *     src: '/audio/test.mp3',
     *     autoplay: false,
     *     loop: false,
     *     volume: 0.8
     *   });
     *   console.log('音频播放器创建成功');
     * } catch (error) {
     *   console.error('创建音频播放器失败:', error);
     * }
     * ```
     */
    createPlayer(styles) {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查音频模块是否可用
            if (!plus.audio) {
                throw new Error('设备不支持音频模块');
            }

            // 创建播放器
            const player = plus.audio.createPlayer(styles || {});
            const playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储播放器
            this.players.set(playerId, player);

            // 添加包装方法
            this.wrapAudioPlayer(player, playerId);

            return player;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 包装录音器对象，添加额外功能
     * @param {Object} recorder - 录音器对象
     * @param {string} recorderId - 录音器ID
     */
    wrapAudioRecorder(recorder, recorderId) {
        const originalRecord = recorder.record;
        const originalStop = recorder.stop;

        // 包装record方法
        recorder.record = function(filename, styles, successCB, errorCB) {
            try {
                // 参数处理
                let finalFilename = filename;
                let finalStyles = styles;
                let finalSuccessCB = successCB;
                let finalErrorCB = errorCB;

                // 如果第一个参数不是字符串，重新组织参数
                if (typeof filename !== 'string') {
                    finalStyles = filename;
                    finalSuccessCB = styles;
                    finalErrorCB = successCB;
                    finalFilename = undefined;
                }

                // 如果styles是函数，重新组织参数
                if (typeof finalStyles === 'function') {
                    finalErrorCB = finalSuccessCB;
                    finalSuccessCB = finalStyles;
                    finalStyles = undefined;
                }

                // Promise支持
                if (typeof finalSuccessCB !== 'function') {
                    return new Promise((resolve, reject) => {
                        originalRecord.call(
                            recorder,
                            finalFilename,
                            finalStyles,
                            resolve,
                            reject
                        );
                    });
                }

                // 调用原生方法
                originalRecord.call(
                    recorder,
                    finalFilename,
                    finalStyles,
                    finalSuccessCB,
                    finalErrorCB
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

        // 包装stop方法
        recorder.stopPromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalStop.call(recorder);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加销毁方法
        recorder.destroy = function() {
            try {
                // 从存储中移除
                if (this.recorders.has(recorderId)) {
                    this.recorders.delete(recorderId);
                }
            } catch (error) {
                console.error('销毁录音器失败:', error);
            }
        }.bind(this);
    }

    /**
     * 包装播放器对象，添加额外功能
     * @param {Object} player - 播放器对象
     * @param {string} playerId - 播放器ID
     */
    wrapAudioPlayer(player, playerId) {
        // 为所有方法添加Promise支持
        const methodsToWrap = [
            'play', 'pause', 'resume', 'stop', 'seekTo', 'getPosition',
            'getDuration', 'isPaused', 'getBuffered', 'close'
        ];

        methodsToWrap.forEach(methodName => {
            const originalMethod = player[methodName];
            if (typeof originalMethod === 'function') {
                player[methodName + 'Promise'] = function(...args) {
                    return new Promise((resolve, reject) => {
                        try {
                            const result = originalMethod.apply(player, args);
                            if (result !== undefined) {
                                resolve(result);
                            } else {
                                resolve();
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                };
            }
        });

        // 包装setRoute方法
        const originalSetRoute = player.setRoute;
        player.setRoutePromise = function(route) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetRoute.call(player, route);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装setSessionCategory方法
        const originalSetSessionCategory = player.setSessionCategory;
        player.setSessionCategoryPromise = function(category) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetSessionCategory.call(player, category);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装setStyles方法
        const originalSetStyles = player.setStyles;
        player.setStylesPromise = function(styles) {
            return new Promise((resolve, reject) => {
                try {
                    originalSetStyles.call(player, styles);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装getStyles方法
        const originalGetStyles = player.getStyles;
        player.getStylesPromise = function(key) {
            return new Promise((resolve, reject) => {
                try {
                    const result = originalGetStyles.call(player, key);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装playbackRate方法
        const originalPlaybackRate = player.playbackRate;
        player.playbackRatePromise = function(rate) {
            return new Promise((resolve, reject) => {
                try {
                    originalPlaybackRate.call(player, rate);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装addEventListener方法
        const originalAddEventListener = player.addEventListener;
        player.addEventListenerPromise = function(event, callback) {
            return new Promise((resolve, reject) => {
                try {
                    originalAddEventListener.call(player, event, callback);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装removeEventListener方法
        const originalRemoveEventListener = player.removeEventListener;
        player.removeEventListenerPromise = function(event, callback) {
            return new Promise((resolve, reject) => {
                try {
                    originalRemoveEventListener.call(player, event, callback);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加销毁方法
        player.destroy = function() {
            try {
                // 从存储中移除
                if (this.players.has(playerId)) {
                    this.players.delete(playerId);
                }
                // 调用原生关闭方法
                if (typeof player.close === 'function') {
                    player.close();
                }
            } catch (error) {
                console.error('销毁播放器失败:', error);
            }
        }.bind(this);
    }

    /**
     * 判断设备是否支持音频功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await audio.isSupported();
     * if (isSupported) {
     *   console.log('设备支持音频功能');
     * } else {
     *   console.log('设备不支持音频功能');
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

                resolve(!!plus.audio);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前活跃的播放器信息
     * @returns {Array<Object>} 活跃播放器信息数组
     *
     * @example
     * ```javascript
     * const activePlayers = audio.getActivePlayers();
     * console.log('活跃播放器数量:', activePlayers.length);
     * ```
     */
    getActivePlayers() {
        const players = [];
        this.players.forEach((player, playerId) => {
            players.push({
                playerId: playerId,
                isPaused: typeof player.isPaused === 'function' ? player.isPaused() : true
            });
        });
        return players;
    }

    /**
     * 获取当前活跃的录音器信息
     * @returns {Array<Object>} 活跃录音器信息数组
     *
     * @example
     * ```javascript
     * const activeRecorders = audio.getActiveRecorders();
     * console.log('活跃录音器数量:', activeRecorders.length);
     * ```
     */
    getActiveRecorders() {
        const recorders = [];
        this.recorders.forEach((recorder, recorderId) => {
            recorders.push({
                recorderId: recorderId,
                supportedSamplerates: recorder.supportedSamplerates || [],
                supportedFormats: recorder.supportedFormats || []
            });
        });
        return recorders;
    }

    /**
     * 关闭所有活跃的播放器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await audio.closeAllPlayers();
     * console.log('所有播放器已关闭');
     * ```
     */
    closeAllPlayers() {
        return new Promise((resolve, reject) => {
            try {
                const playerIds = Array.from(this.players.keys());
                const promises = [];

                playerIds.forEach(playerId => {
                    const player = this.players.get(playerId);
                    if (player && typeof player.close === 'function') {
                        promises.push(player.closePromise());
                    }
                });

                Promise.all(promises).then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 销毁所有活跃的录音器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await audio.destroyAllRecorders();
     * console.log('所有录音器已销毁');
     * ```
     */
    destroyAllRecorders() {
        return new Promise((resolve, reject) => {
            try {
                this.recorders.clear();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Audio模块实例
const audio = new AudioModule();

// 导出模块
export default audio;

// 导出常量
export { AudioRoute };

// 也可以导出类以便创建多个实例
export { AudioModule };