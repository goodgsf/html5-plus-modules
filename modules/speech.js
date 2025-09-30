/**
 * HTML5+ Speech 模块 ES Module 封装
 *
 * 该模块提供了语音识别管理功能，包括开始语音识别、停止语音识别、监听语音事件等
 * 遵循HTML5+官方API规范
 */

/**
 * 语音识别错误码常量
 */
export const SpeechErrorCode = {
    NOT_AVAILABLE: 1001,      // 语音识别不可用
    PERMISSION_DENIED: 1002, // 权限被拒绝
    TIMEOUT: 1003,            // 操作超时
    NETWORK_ERROR: 1004,      // 网络错误
    ENGINE_ERROR: 1005,       // 引擎错误
    USER_CANCELLED: 1006,     // 用户取消
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * 语音识别选项
 * @typedef {Object} SpeechRecognizeOptions
 * @property {boolean} [continue=false] - 是否持续语音识别
 * @property {string} [engine] - 语音识别引擎
 * @property {string} [lang='zh-cn'] - 识别语言，zh-cn：中文，en-us：英文
 * @property {number} [nbest=1] - 返回的候选结果数量
 * @property {boolean} [punctuation=false] - 是否识别标点符号
 * @property {number} [timeout=0] - 语音识别超时时间，单位毫秒，0表示不限制
 * @property {boolean} [userInterface=true] - 是否显示用户界面
 */

/**
 * 语音识别事件类型
 * @typedef {string} SpeechEventType
 * @property {'start'} START - 开始语音识别
 * @property {'volumeChange'} VOLUME_CHANGE - 音量变化
 * @property {'recognizing'} RECOGNIZING - 识别中
 * @property {'recognition'} RECOGNITION - 识别完成
 * @property {'end'} END - 结束语音识别
 * @property {'error'} ERROR - 识别错误
 */

/**
 * 语音识别事件
 * @typedef {Object} SpeechRecognizeEvent
 * @property {SpeechEventType} type - 事件类型
 * @property {string} partialResult - 部分识别结果（recognizing事件）
 * @property {string} result - 识别结果（recognition事件）
 * @property {number} volume - 音量值（volumeChange事件）
 * @property {SpeechErrorCode} errorCode - 错误码（error事件）
 * @property {string} errorMessage - 错误信息（error事件）
 */

/**
 * 语音识别成功回调函数
 * @callback RecognitionSuccessCallback
 * @param {string} result - 识别结果
 */

/**
 * 语音识别事件回调函数
 * @callback RecognitionEventCallback
 * @param {SpeechRecognizeEvent} event - 语音识别事件
 */

/**
 * 语音识别错误回调函数
 * @callback RecognitionErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ Speech 模块类
 */
class SpeechModule {
    constructor() {
        this.moduleName = 'Speech';
        this._listeners = new Map();
        this._nextId = 1;
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
        this._isRecognizing = false;
        this._currentOptions = null;
    }

    /**
     * 初始化Speech模块
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
                if (typeof plus === 'undefined' || !plus.speech) {
                    // 检查浏览器环境是否支持Web Speech API
                    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
                        this._browserSupport = true;
                        console.log('Speech模块将在浏览器环境中使用webkitSpeechRecognition API');
                    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
                        this._browserSupport = true;
                        console.log('Speech模块将在浏览器环境中使用SpeechRecognition API');
                    } else {
                        console.warn('设备不支持语音识别功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('Speech模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 开始语音识别
     * @param {SpeechRecognizeOptions} [options] - 语音识别选项
     * @param {RecognitionSuccessCallback} [successCallback] - 成功回调函数
     * @param {RecognitionErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<void>}

     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await speech.startRecognize({
     *     lang: 'zh-cn',
     *     continue: true,
     *     punctuation: true
     *   });
     *   console.log('语音识别已开始');
     * } catch (error) {
     *   console.error('开始语音识别失败:', error);
     * }
     *
     * // 回调方式调用
     * speech.startRecognize(
     *   { lang: 'zh-cn' },
     *   (result) => {
     *     console.log('识别结果:', result);
     *   },
     *   (error) => {
     *     console.error('识别失败:', error);
     *   }
     * );
     * ```
     */
    startRecognize(options = {}, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (this._isRecognizing) {
                    throw new Error('语音识别正在进行中');
                }

                // 标准化选项
                const normalizedOptions = this._normalizeOptions(options);
                this._currentOptions = normalizedOptions;

                if (typeof plus !== 'undefined' && plus.speech) {
                    // HTML5+环境
                    plus.speech.startRecognize(
                        normalizedOptions,
                        (result) => {
                            if (successCallback) {
                                successCallback(result);
                            }
                            this._emitEvent({
                                type: 'recognition',
                                result: result
                            });
                        },
                        (error) => {
                            const speechError = new Error(`语音识别失败: ${error.message || '未知错误'}`);
                            if (errorCallback) {
                                errorCallback(speechError);
                            }
                            this._emitEvent({
                                type: 'error',
                                errorCode: error.code || SpeechErrorCode.UNKNOWN_ERROR,
                                errorMessage: error.message || '未知错误'
                            });
                            reject(speechError);
                        }
                    );

                    this._isRecognizing = true;
                    this._emitEvent({ type: 'start' });
                    resolve();

                } else if (this._browserSupport) {
                    // 浏览器环境使用Web Speech API
                    this._startRecognizeBrowser(normalizedOptions, successCallback, errorCallback, resolve, reject);
                } else {
                    throw new Error('设备不支持语音识别功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中开始语音识别
     * @private
     */
    _startRecognizeBrowser(options, successCallback, errorCallback, resolve, reject) {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                throw new Error('浏览器不支持语音识别功能');
            }

            const recognition = new SpeechRecognition();
            recognition.lang = options.lang || 'zh-CN';
            recognition.continuous = options.continue || false;
            recognition.interimResults = true;
            recognition.maxAlternatives = options.nbest || 1;

            recognition.onstart = () => {
                this._isRecognizing = true;
                this._currentRecognition = recognition;
                this._emitEvent({ type: 'start' });
                resolve();
            };

            recognition.onresult = (event) => {
                let finalResult = '';
                let interimResult = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalResult += transcript;
                    } else {
                        interimResult += transcript;
                    }
                }

                if (interimResult) {
                    this._emitEvent({
                        type: 'recognizing',
                        partialResult: interimResult
                    });
                }

                if (finalResult) {
                    const result = options.punctuation ? this._addPunctuation(finalResult) : finalResult;
                    if (successCallback) {
                        successCallback(result);
                    }
                    this._emitEvent({
                        type: 'recognition',
                        result: result
                    });
                }
            };

            recognition.onerror = (event) => {
                this._isRecognizing = false;
                this._currentRecognition = null;

                const error = new Error(`语音识别失败: ${event.error}`);
                if (errorCallback) {
                    errorCallback(error);
                }
                this._emitEvent({
                    type: 'error',
                    errorCode: this._mapBrowserError(event.error),
                    errorMessage: event.error
                });
                reject(error);
            };

            recognition.onend = () => {
                this._isRecognizing = false;
                this._currentRecognition = null;
                this._emitEvent({ type: 'end' });
            };

            recognition.onsoundstart = () => {
                this._emitEvent({ type: 'volumeChange', volume: 50 });
            };

            recognition.onsoundend = () => {
                this._emitEvent({ type: 'volumeChange', volume: 0 });
            };

            recognition.start();

        } catch (error) {
            reject(error);
        }
    }

    /**
     * 停止语音识别
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await speech.stopRecognize();
     *   console.log('语音识别已停止');
     * } catch (error) {
     *   console.error('停止语音识别失败:', error);
     * }
     * ```
     */
    stopRecognize() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!this._isRecognizing) {
                    resolve();
                    return;
                }

                if (typeof plus !== 'undefined' && plus.speech) {
                    // HTML5+环境
                    plus.speech.stopRecognize();
                    this._isRecognizing = false;
                    this._emitEvent({ type: 'end' });
                    resolve();

                } else if (this._browserSupport && this._currentRecognition) {
                    // 浏览器环境
                    this._currentRecognition.stop();
                    this._isRecognizing = false;
                    this._currentRecognition = null;
                    this._emitEvent({ type: 'end' });
                    resolve();

                } else {
                    resolve();
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 添加语音识别事件监听器
     * @param {SpeechEventType} event - 事件类型
     * @param {RecognitionEventCallback} listener - 事件监听器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await speech.addEventListener('recognition', (event) => {
     *     console.log('识别结果:', event.result);
     *   });
     *
     *   await speech.addEventListener('error', (event) => {
     *     console.error('识别错误:', event.errorMessage);
     *   });
     * } catch (error) {
     *   console.error('添加监听器失败:', error);
     * }
     * ```
     */
    addEventListener(event, listener) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!event || typeof listener !== 'function') {
                    throw new Error('event和listener参数不能为空');
                }

                if (!this._listeners.has(event)) {
                    this._listeners.set(event, new Set());
                }

                this._listeners.get(event).add(listener);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 移除语音识别事件监听器
     * @param {SpeechEventType} event - 事件类型
     * @param {RecognitionEventCallback} listener - 事件监听器
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await speech.removeEventListener('recognition', recognitionListener);
     *   console.log('监听器已移除');
     * } catch (error) {
     *   console.error('移除监听器失败:', error);
     * }
     * ```
     */
    removeEventListener(event, listener) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!event || typeof listener !== 'function') {
                    throw new Error('event和listener参数不能为空');
                }

                const eventListeners = this._listeners.get(event);
                if (eventListeners) {
                    eventListeners.delete(listener);
                    if (eventListeners.size === 0) {
                        this._listeners.delete(event);
                    }
                }

                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前语音识别状态
     * @returns {Promise<boolean>} 是否正在识别中
     *
     * @example
     * ```javascript
     * try {
     *   isRecognizing = await speech.isRecognizing();
     *   console.log('是否正在识别:', isRecognizing);
     * } catch (error) {
     *   console.error('获取识别状态失败:', error);
     * }
     * ```
     */
    isRecognizing() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();
                resolve(this._isRecognizing);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前语音识别选项
     * @returns {Promise<SpeechRecognizeOptions>} 当前识别选项
     *
     * @example
     * ```javascript
     * try {
     *   const options = await speech.getCurrentOptions();
     *   console.log('当前识别选项:', options);
     * } catch (error) {
     *   console.error('获取识别选项失败:', error);
     * }
     * ```
     */
    getCurrentOptions() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();
                resolve(this._currentOptions || {});
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取支持的语音识别引擎列表
     * @returns {Promise<string[]>} 引擎列表
     *
     * @example
     * ```javascript
     * try {
     *   const engines = await speech.getEngines();
     *   console.log('支持的引擎:', engines);
     * } catch (error) {
     *   console.error('获取引擎列表失败:', error);
     * }
     * ```
     */
    getEngines() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.speech) {
                    // HTML5+环境
                    if (plus.speech.getEngines) {
                        plus.speech.getEngines((engines) => {
                            resolve(engines || []);
                        }, (error) => {
                            reject(new Error(`获取引擎列表失败: ${error.message || '未知错误'}`));
                        });
                    } else {
                        resolve(['default']); // 默认引擎
                    }
                } else {
                    // 浏览器环境
                    resolve(['browser']);
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 标准化语音识别选项
     * @private
     */
    _normalizeOptions(options) {
        return {
            continue: Boolean(options.continue),
            engine: options.engine || 'default',
            lang: options.lang || 'zh-cn',
            nbest: Math.max(1, parseInt(options.nbest) || 1),
            punctuation: Boolean(options.punctuation),
            timeout: Math.max(0, parseInt(options.timeout) || 0),
            userInterface: options.userInterface !== false
        };
    }

    /**
     * 发送事件到监听器
     * @private
     */
    _emitEvent(event) {
        const listeners = this._listeners.get(event.type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(event);
                } catch (error) {
                    console.error('语音识别事件监听器执行失败:', error);
                }
            });
        }
    }

    /**
     * 添加标点符号
     * @private
     */
    _addPunctuation(text) {
        // 简单的标点符号添加逻辑
        return text.replace(/\s+([.!?])/g, '$1')
                  .replace(/([。！？])\s*([a-zA-Z])/g, '$1 $2')
                  .trim();
    }

    /**
     * 映射浏览器错误码
     * @private
     */
    _mapBrowserError(browserError) {
        const errorMap = {
            'no-speech': SpeechErrorCode.NETWORK_ERROR,
            'audio-capture': SpeechErrorCode.ENGINE_ERROR,
            'not-allowed': SpeechErrorCode.PERMISSION_DENIED,
            'service-not-allowed': SpeechErrorCode.NOT_AVAILABLE,
            'bad-grammar': SpeechErrorCode.ENGINE_ERROR,
            'language-not-supported': SpeechErrorCode.ENGINE_ERROR
        };
        return errorMap[browserError] || SpeechErrorCode.UNKNOWN_ERROR;
    }

    /**
     * 判断设备是否支持语音识别功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await speech.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持语音识别功能');
     *   } else {
     *     console.log('设备不支持语音识别功能');
     *   }
     * } catch (error) {
     *   console.error('检查支持性失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.speech) {
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
     * 检查语音识别权限状态
     * @returns {Promise<string>} 权限状态：'granted'、'denied'、'prompt'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await speech.checkPermission();
     *   console.log('权限状态:', permission);
     * } catch (error) {
     *   console.error('检查权限失败:', error);
     * }
     * ```
     */
    checkPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.speech) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境
                    if (typeof navigator !== 'undefined' && navigator.permissions) {
                        try {
                            const permission = await navigator.permissions.query({ name: 'microphone' });
                            resolve(permission.state);
                        } catch (error) {
                            // 浏览器不支持microphone权限查询
                            resolve('granted');
                        }
                    } else {
                        resolve('granted');
                    }
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 请求语音识别权限
     * @returns {Promise<string>} 权限状态：'granted' 或 'denied'
     *
     * @example
     * ```javascript
     * try {
     *   const permission = await speech.requestPermission();
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
    requestPermission() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.speech) {
                    // HTML5+环境
                    resolve('granted');
                } else if (this._browserSupport) {
                    // 浏览器环境请求麦克风权限
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        stream.getTracks().forEach(track => track.stop());
                        resolve('granted');
                    } catch (error) {
                        resolve('denied');
                    }
                } else {
                    resolve('denied');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Speech模块实例
const speech = new SpeechModule();

// 导出模块
export default speech;

// 导出类和常量
export { SpeechModule, SpeechErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
speech.SpeechModule = SpeechModule;
speech.SpeechErrorCode = SpeechErrorCode;