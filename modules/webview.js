/**
 * HTML5+ WebView 模块 ES Module 封装
 *
 * 该模块提供了Webview窗口管理功能，包括创建、显示、隐藏、关闭Webview窗口
 * 以及相关的控制和事件监听功能。遵循HTML5+官方API规范。
 */

/**
 * WebView模块错误码常量
 */
export const WebViewErrorCode = {
    NOT_AVAILABLE: 1001,        // WebView功能不可用
    INVALID_URL: 1002,          // 无效的URL
    INVALID_ID: 1003,            // 无效的窗口标识
    CREATE_ERROR: 1004,         // 创建窗口失败
    SHOW_ERROR: 1005,           // 显示窗口失败
    HIDE_ERROR: 1006,           // 隐藏窗口失败
    CLOSE_ERROR: 1007,          // 关闭窗口失败
    LOAD_ERROR: 1008,           // 加载页面失败
    NETWORK_ERROR: 1009,        // 网络错误
    TIMEOUT: 1010,              // 操作超时
    PERMISSION_DENIED: 1011,    // 权限被拒绝
    UNKNOWN_ERROR: 1099         // 未知错误
};

/**
 * WebView显示动画类型
 * @typedef {Object} AnimationTypeShow
 * @property {string} auto - 自动选择显示动画
 * @property {string} none - 无动画
 * @property {string} slide-in-right - 从右侧横向滑动显示
 * @property {string} slide-in-left - 从左侧横向滑动显示
 * @property {string} slide-in-top - 从上侧纵向滑动显示
 * @property {string} slide-in-bottom - 从下侧纵向滑动显示
 * @property {string} fade-in - 从透明到不透明逐渐显示
 * @property {string} zoom-out - 从小到大逐渐显示
 * @property {string} zoom-fade-in - 从小到大逐渐显示并且从透明到不透明
 * @property {string} pop-in - 从中间放大显示
 */

/**
 * WebView关闭动画类型
 * @typedef {Object} AnimationTypeClose
 * @property {string} auto - 自动选择关闭动画
 * @property {string} none - 无动画
 * @property {string} slide-out-right - 从右侧横向滑动关闭
 * @property {string} slide-out-left - 从左侧横向滑动关闭
 * @property {string} slide-out-top - 从上侧纵向滑动关闭
 * @property {string} slide-out-bottom - 从下侧纵向滑动关闭
 * @property {string} fade-out - 从不透明到透明逐渐关闭
 * @property {string} zoom-in - 从大到小逐渐关闭
 * @property {string} zoom-fade-out - 从大到小逐渐关闭并且从不透明到透明
 * @property {string} pop-out - 从中间缩小关闭
 */

/**
 * WebView窗口样式
 * @typedef {Object} WebviewStyles
 * @property {string} [background] - 窗口背景颜色
 * @property {string} [bottom] - 窗口垂直向上的偏移量
 * @property {string} [height] - 窗口高度
 * @property {string} [left] - 窗口水平向右的偏移量
 * @property {string} [margin] - 窗口边距
 * @property {string} [opacity] - 窗口不透明度
 * @property {string} [position] - 窗口排版位置
 * @property {string} [right] - 窗口水平向左的偏移量
 * @property {string} [top] - 窗口垂直向下的偏移量
 * @property {string} [width] - 窗口宽度
 * @property {string} [zindex] - 窗口堆叠顺序值
 * @property {boolean} [hardwareAccelerated] - 是否开启硬件加速
 * @property {boolean} [blockNetworkImage] - 是否阻塞网络图片的加载
 * @property {boolean} [popGesture] - 是否开启侧滑返回功能
 * @property {boolean} [scalable] - 是否开启用户缩放功能
 * @property {boolean} [bounce] - 是否开启窗口回弹效果
 */

/**
 * WebView窗口事件类型
 * @typedef {Object} WebViewEventType
 * @property {string} LOADED - 页面加载完成事件
 * @property {string} CLOSE - 窗口关闭事件
 * @property {string} ERROR - 页面加载错误事件
 * @property {string} SHOW - 窗口显示事件
 * @property {string} HIDE - 窗口隐藏事件
 * @property {string} BACK - 返回按键事件
 * @property {string} TITLE_UPDATE - 标题更新事件
 * @property {string} PULL_TO_REFRESH - 下拉刷新事件
 * @property {string} DRAG - 拖拽事件
 * @property {string} RENDERING - 渲染事件
 * @property {string} LOADING - 加载事件
 * @property {string} START - 开始事件
 * @property {string} END - 结束事件
 */

/**
 * WebView窗口事件信息
 * @typedef {Object} WebViewEvent
 * @property {string} type - 事件类型
 * @property {number} target - 触发事件的目标对象
 * @property {string} [url] - 当前页面URL
 * @property {string} [title] - 当前页面标题
 * @property {number} [progress] - 加载进度
 * @property {string} [message] - 错误消息
 * @property {number} [code] - 错误码
 */

/**
 * WebView窗口信息
 * @typedef {Object} WebViewInfo
 * @property {string} id - 窗口标识
 * @property {string} url - 窗口加载的页面URL
 * @property {string} title - 窗口标题
 * @property {boolean} visible - 窗口是否可见
 * @property {boolean} paused - 窗口是否暂停
 * @property {boolean} hardwareAccelerated - 是否开启硬件加速
 * @property {number} progress - 页面加载进度
 * @property {boolean} canBack - 是否可以后退
 * @property {boolean} canForward - 是否可以前进
 */

/**
 * WebView窗口事件回调函数
 * @callback WebViewEventCallback
 * @param {WebViewEvent} event - 事件信息
 */

/**
 * WebView窗口操作成功回调函数
 * @callback WebViewSuccessCallback
 * @param {void} result - 操作结果
 */

/**
 * WebView窗口操作失败回调函数
 * @callback WebViewErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * WebView窗口对象类
 */
class WebViewObject {
    constructor(nativeWebView) {
        this._nativeWebView = nativeWebView;
        this._eventListeners = new Map();
        this._isDestroyed = false;
        this._proxyProperties();
    }

    /**
     * 代理原生WebView属性
     * @private
     */
    _proxyProperties() {
        // 代理基本属性
        this._defineProxyProperty('id');
        this._defineProxyProperty('url');
        this._defineProxyProperty('title');
        this._defineProxyProperty('visible');
        this._defineProxyProperty('paused');
        this._defineProxyProperty('hardwareAccelerated');
        this._defineProxyProperty('progress');
        this._defineProxyProperty('canBack');
        this._defineProxyProperty('canForward');
    }

    /**
     * 定义代理属性
     * @private
     */
    _defineProxyProperty(propertyName) {
        Object.defineProperty(this, propertyName, {
            get: () => {
                if (this._isDestroyed) {
                    throw new Error('WebView窗口已被销毁');
                }
                return this._nativeWebView[propertyName];
            },
            enumerable: true,
            configurable: true
        });
    }

    /**
     * 添加事件监听器
     * @param {string} event - 事件类型
     * @param {WebViewEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * webview.addEventListener('loaded', (event) => {
     *   console.log('页面加载完成:', event);
     * });
     *
     * webview.addEventListener('error', (event) => {
     *   console.error('页面加载错误:', event);
     * });
     * ```
     */
    addEventListener(event, callback) {
        if (this._isDestroyed) {
            throw new Error('WebView窗口已被销毁');
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
                url: nativeEvent.url,
                title: nativeEvent.title,
                progress: nativeEvent.progress,
                message: nativeEvent.message,
                code: nativeEvent.code
            };

            try {
                callback(event);
            } catch (error) {
                console.error('WebView事件回调执行失败:', error);
            }
        };

        // 保存包装后的回调函数，以便后续移除
        if (!this._nativeWebView._wrappedCallbacks) {
            this._nativeWebView._wrappedCallbacks = new Map();
        }
        this._nativeWebView._wrappedCallbacks.set(callback, wrappedCallback);

        // 添加到原生WebView
        this._nativeWebView.addEventListener(event, wrappedCallback);
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件类型
     * @param {WebViewEventCallback} callback - 事件回调函数
     *
     * @example
     * ```javascript
     * const handleLoaded = (event) => {
     *   console.log('页面加载完成:', event);
     * };
     *
     * webview.addEventListener('loaded', handleLoaded);
     * // 稍后移除监听器
     * webview.removeEventListener('loaded', handleLoaded);
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

        // 从原生WebView移除
        if (this._nativeWebView._wrappedCallbacks && this._nativeWebView._wrappedCallbacks.has(callback)) {
            const wrappedCallback = this._nativeWebView._wrappedCallbacks.get(callback);
            this._nativeWebView.removeEventListener(event, wrappedCallback);
            this._nativeWebView._wrappedCallbacks.delete(callback);
        }
    }

    /**
     * 加载URL页面
     * @param {string} url - 页面URL
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.loadURL('https://example.com/page.html');
     *   console.log('页面加载开始');
     * } catch (error) {
     *   console.error('加载页面失败:', error);
     * }
     * ```
     */
    loadURL(url, extras = {}) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            if (!url || typeof url !== 'string') {
                reject(new Error('url参数不能为空且必须是字符串'));
                return;
            }

            try {
                this._nativeWebView.loadURL(url, extras,
                    () => {
                        resolve();
                    },
                    (error) => {
                        reject(new Error(`加载页面失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                reject(new Error(`加载页面异常: ${error.message}`));
            }
        });
    }

    /**
     * 加载HTML数据
     * @param {Object} options - 加载选项
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.loadData({
     *     content: '<html><body><h1>Hello World</h1></body></html>',
     *     baseURL: 'https://example.com'
     *   });
     *   console.log('HTML数据加载完成');
     * } catch (error) {
     *   console.error('加载HTML数据失败:', error);
     * }
     * ```
     */
    loadData(options) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            if (!options || typeof options !== 'object') {
                reject(new Error('options参数必须是对象'));
                return;
            }

            try {
                this._nativeWebView.loadData(options,
                    () => {
                        resolve();
                    },
                    (error) => {
                        reject(new Error(`加载HTML数据失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                reject(new Error(`加载HTML数据异常: ${error.message}`));
            }
        });
    }

    /**
     * 在WebView中执行JavaScript
     * @param {string} script - JavaScript脚本
     * @returns {Promise<string>} 执行结果
     *
     * @example
     * ```javascript
     * try {
     *   const result = await webview.evalJS('document.title');
     *   console.log('页面标题:', result);
     * } catch (error) {
     *   console.error('执行JavaScript失败:', error);
     * }
     * ```
     */
    evalJS(script) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            if (!script || typeof script !== 'string') {
                reject(new Error('script参数不能为空且必须是字符串'));
                return;
            }

            try {
                this._nativeWebView.evalJS(script,
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                        reject(new Error(`执行JavaScript失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                reject(new Error(`执行JavaScript异常: ${error.message}`));
            }
        });
    }

    /**
     * 显示WebView窗口
     * @param {string} [aniShow] - 显示动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Function} [showedCB] - 显示完成回调
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.show('slide-in-right', 300);
     *   console.log('窗口已显示');
     * } catch (error) {
     *   console.error('显示窗口失败:', error);
     * }
     * ```
     */
    show(aniShow, duration, showedCB, extras) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.show(aniShow, duration, showedCB, extras,
                    () => {
                        resolve();
                    },
                    (error) => {
                        reject(new Error(`显示窗口失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                reject(new Error(`显示窗口异常: ${error.message}`));
            }
        });
    }

    /**
     * 隐藏WebView窗口
     * @param {string} [aniClose] - 关闭动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.hide('slide-out-right', 300);
     *   console.log('窗口已隐藏');
     * } catch (error) {
     *   console.error('隐藏窗口失败:', error);
     * }
     * ```
     */
    hide(aniClose, duration, extras) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.hide(aniClose, duration, extras,
                    () => {
                        resolve();
                    },
                    (error) => {
                        reject(new Error(`隐藏窗口失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                reject(new Error(`隐藏窗口异常: ${error.message}`));
            }
        });
    }

    /**
     * 关闭WebView窗口
     * @param {string} [aniClose] - 关闭动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.close('slide-out-right', 300);
     *   console.log('窗口已关闭');
     * } catch (error) {
     *   console.error('关闭窗口失败:', error);
     * }
     * ```
     */
    close(aniClose, duration, extras) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                resolve();
                return;
            }

            try {
                // 清理所有事件监听器
                this._eventListeners.clear();

                this._nativeWebView.close(aniClose, duration, extras,
                    () => {
                        this._isDestroyed = true;
                        resolve();
                    },
                    (error) => {
                        this._isDestroyed = true;
                        reject(new Error(`关闭窗口失败: ${error.message || '未知错误'}`));
                    }
                );
            } catch (error) {
                this._isDestroyed = true;
                reject(new Error(`关闭窗口异常: ${error.message}`));
            }
        });
    }

    /**
     * 后退到上一个页面
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.back();
     *   console.log('已后退到上一个页面');
     * } catch (error) {
     *   console.error('后退失败:', error);
     * }
     * ```
     */
    back() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.back(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`后退失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`后退异常: ${error.message}`));
            }
        });
    }

    /**
     * 前进到下一个页面
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.forward();
     *   console.log('已前进到下一个页面');
     * } catch (error) {
     *   console.error('前进失败:', error);
     * }
     * ```
     */
    forward() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.forward(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`前进失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`前进异常: ${error.message}`));
            }
        });
    }

    /**
     * 重新加载页面
     * @param {boolean} [forced] - 是否强制重新加载
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.reload(true);
     *   console.log('页面已重新加载');
     * } catch (error) {
     *   console.error('重新加载失败:', error);
     * }
     * ```
     */
    reload(forced) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.reload(forced, () => {
                    resolve();
                }, (error) => {
                    reject(new Error(`重新加载失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`重新加载异常: ${error.message}`));
            }
        });
    }

    /**
     * 停止加载页面
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.stop();
     *   console.log('已停止加载页面');
     * } catch (error) {
     *   console.error('停止加载失败:', error);
     * }
     * ```
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                this._nativeWebView.stop(() => {
                    resolve();
                }, (error) => {
                    reject(new Error(`停止加载失败: ${error.message || '未知错误'}`));
                });
            } catch (error) {
                reject(new Error(`停止加载异常: ${error.message}`));
            }
        });
    }

    /**
     * 检查是否可以后退
     * @returns {Promise<boolean>} 是否可以后退
     *
     * @example
     * ```javascript
     * try {
     *   const canBack = await webview.canBack();
     *   console.log('是否可以后退:', canBack);
     * } catch (error) {
     *   console.error('检查后退状态失败:', error);
     * }
     * ```
     */
    canBack() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                const result = this._nativeWebView.canBack();
                resolve(result);
            } catch (error) {
                reject(new Error(`检查后退状态失败: ${error.message}`));
            }
        });
    }

    /**
     * 检查是否可以前进
     * @returns {Promise<boolean>} 是否可以前进
     *
     * @example
     * ```javascript
     * try {
     *   const canForward = await webview.canForward();
     *   console.log('是否可以前进:', canForward);
     * } catch (error) {
     *   console.error('检查前进状态失败:', error);
     * }
     * ```
     */
    canForward() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                const result = this._nativeWebView.canForward();
                resolve(result);
            } catch (error) {
                reject(new Error(`检查前进状态失败: ${error.message}`));
            }
        });
    }

    /**
     * 获取WebView窗口信息
     * @returns {Promise<WebViewInfo>}
     *
     * @example
     * ```javascript
     * try {
     *   const info = await webview.getInfo();
     *   console.log('WebView窗口信息:', info);
     * } catch (error) {
     *   console.error('获取信息失败:', error);
     * }
     * ```
     */
    getInfo() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                const info = {
                    id: this._nativeWebView.id,
                    url: this._nativeWebView.getURL(),
                    title: this._nativeWebView.getTitle(),
                    visible: this._nativeWebView.isVisible(),
                    paused: this._nativeWebView.isPause(),
                    hardwareAccelerated: this._nativeWebView.isHardwareAccelerated(),
                    progress: this._nativeWebView.progress,
                    canBack: this._nativeWebView.canBack(),
                    canForward: this._nativeWebView.canForward()
                };

                resolve(info);
            } catch (error) {
                reject(new Error(`获取WebView窗口信息失败: ${error.message}`));
            }
        });
    }

    /**
     * 设置WebView窗口样式
     * @param {WebviewStyles} styles - 样式配置
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webview.setStyle({
     *     width: '100%',
     *     height: '200px',
     *     background: '#ffffff'
     *   });
     *   console.log('样式设置成功');
     * } catch (error) {
     *   console.error('设置样式失败:', error);
     * }
     * ```
     */
    setStyle(styles) {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            if (!styles || typeof styles !== 'object') {
                reject(new Error('styles参数必须是对象'));
                return;
            }

            try {
                this._nativeWebView.setStyle(styles, () => {
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
     * 获取WebView窗口样式
     * @returns {Promise<WebviewStyles>}
     *
     * @example
     * ```javascript
     * try {
     *   const styles = await webview.getStyle();
     *   console.log('窗口样式:', styles);
     * } catch (error) {
     *   console.error('获取样式失败:', error);
     * }
     * ```
     */
    getStyle() {
        return new Promise((resolve, reject) => {
            if (this._isDestroyed) {
                reject(new Error('WebView窗口已被销毁'));
                return;
            }

            try {
                const styles = this._nativeWebView.getStyle();
                resolve(styles);
            } catch (error) {
                reject(new Error(`获取样式失败: ${error.message}`));
            }
        });
    }
}

/**
 * HTML5+ WebView 模块类
 */
class WebViewModule {
    constructor() {
        this.moduleName = 'WebView';
        this._webviews = new Map();
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化WebView模块
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
                if (typeof plus === 'undefined' || !plus.webview) {
                    // 检查浏览器环境是否支持WebView功能
                    if (typeof window !== 'undefined') {
                        this._browserSupport = true;
                        console.log('WebView模块将在浏览器环境中模拟');
                    } else {
                        console.warn('设备不支持WebView功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('WebView模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 创建WebView窗口
     * @param {string} [url] - 页面URL
     * @param {string} [id] - 窗口标识
     * @param {WebviewStyles} [styles] - 窗口样式
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<WebViewObject>} WebView窗口对象
     *
     * @example
     * ```javascript
     * try {
     *   const webview = await webView.create(
     *     'https://example.com/page.html',
     *     'my-webview',
     *     {
     *       width: '100%',
     *       height: '200px',
     *       background: '#ffffff'
     *     }
     *   );
     *   console.log('WebView窗口创建成功:', webview.id);
     * } catch (error) {
     *   console.error('创建WebView窗口失败:', error);
     * }
     * ```
     */
    create(url, id, styles, extras) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    const nativeWebView = plus.webview.create(url, id, styles, extras);
                    const webView = new WebViewObject(nativeWebView);
                    this._webviews.set(nativeWebView.id, webView);
                    resolve(webView);
                } else if (this._browserSupport) {
                    // 浏览器环境
                    this._createWebViewBrowser(url, id, styles, extras, resolve, reject);
                } else {
                    throw new Error('设备不支持WebView功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中创建WebView窗口
     * @private
     */
    _createWebViewBrowser(url, id, styles, extras, resolve, reject) {
        try {
            const iframe = document.createElement('iframe');
            if (url) {
                iframe.src = url;
            }
            iframe.id = id || `webview_${Date.now()}`;
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            // 应用样式
            if (styles) {
                Object.assign(iframe.style, {
                    width: styles.width || '100%',
                    height: styles.height || '100%',
                    background: styles.background || '#ffffff',
                    top: styles.top || 'auto',
                    left: styles.left || 'auto',
                    right: styles.right || 'auto',
                    bottom: styles.bottom || 'auto',
                    position: styles.position || 'static',
                    opacity: styles.opacity || 1,
                    zIndex: styles.zindex || 'auto',
                    margin: styles.margin || '0'
                });
            }

            // 创建模拟的原生WebView对象
            const nativeWebView = {
                id: iframe.id,
                element: iframe,
                url: url || '',
                title: '',
                visible: true,
                paused: false,
                hardwareAccelerated: false,
                progress: 0,
                canBack: false,
                canForward: false,
                addEventListener: (event, callback) => {
                    iframe.addEventListener(event, callback);
                },
                removeEventListener: (event, callback) => {
                    iframe.removeEventListener(event, callback);
                },
                loadURL: (newUrl, newExtras) => {
                    if (newUrl) {
                        iframe.src = newUrl;
                    }
                },
                loadData: (options) => {
                    if (options && options.content) {
                        iframe.srcdoc = options.content;
                    }
                },
                evalJS: (script) => {
                    try {
                        return iframe.contentWindow.eval(script);
                    } catch (error) {
                        return '';
                    }
                },
                show: (aniShow, duration, showedCB, extras) => {
                    iframe.style.display = 'block';
                    if (showedCB) showedCB();
                },
                hide: (aniClose, duration, extras) => {
                    iframe.style.display = 'none';
                },
                close: (aniClose, duration, extras) => {
                    iframe.remove();
                },
                back: () => {
                    if (iframe.contentWindow.history.length > 1) {
                        iframe.contentWindow.history.back();
                    }
                },
                forward: () => {
                    iframe.contentWindow.history.forward();
                },
                reload: (forced) => {
                    iframe.contentWindow.location.reload(forced);
                },
                stop: () => {
                    iframe.contentWindow.stop();
                },
                canBack: () => {
                    return iframe.contentWindow.history.length > 1;
                },
                canForward: () => {
                    return iframe.contentWindow.history.length > 1;
                },
                getURL: () => {
                    return iframe.src;
                },
                getTitle: () => {
                    return iframe.contentDocument ? iframe.contentDocument.title : '';
                },
                isVisible: () => {
                    return iframe.style.display !== 'none';
                },
                isPause: () => {
                    return false;
                },
                isHardwareAccelerated: () => {
                    return false;
                },
                getStyle: () => {
                    return {
                        width: iframe.style.width,
                        height: iframe.style.height,
                        background: iframe.style.background,
                        position: iframe.style.position,
                        top: iframe.style.top,
                        left: iframe.style.left,
                        opacity: iframe.style.opacity
                    };
                },
                setStyle: (newStyles) => {
                    if (newStyles) {
                        Object.assign(iframe.style, {
                            width: newStyles.width || iframe.style.width,
                            height: newStyles.height || iframe.style.height,
                            background: newStyles.background || iframe.style.background,
                            position: newStyles.position || iframe.style.position,
                            top: newStyles.top || iframe.style.top,
                            left: newStyles.left || iframe.style.left,
                            opacity: newStyles.opacity || iframe.style.opacity
                        });
                    }
                }
            };

            // 监听iframe事件
            iframe.addEventListener('load', () => {
                nativeWebView.progress = 100;
                nativeWebView.title = iframe.contentDocument ? iframe.contentDocument.title : '';
            });

            // 添加到文档中
            document.body.appendChild(iframe);

            const webView = new WebViewObject(nativeWebView);
            this._webviews.set(nativeWebView.id, webView);
            resolve(webView);

        } catch (error) {
            reject(new Error(`浏览器环境创建WebView窗口失败: ${error.message}`));
        }
    }

    /**
     * 创建并打开WebView窗口
     * @param {string} [url] - 页面URL
     * @param {string} [id] - 窗口标识
     * @param {WebviewStyles} [styles] - 窗口样式
     * @param {Object} [extras] - 额外参数
     * @param {string} [showani] - 显示动画类型
     * @returns {Promise<WebViewObject>} WebView窗口对象
     *
     * @example
     * ```javascript
     * try {
     *   const webview = await webView.open(
     *     'https://example.com/page.html',
     *     'my-webview',
     *     {
     *       width: '100%',
     *       height: '200px'
     *     },
     *     null,
     *     'slide-in-right'
     *   );
     *   console.log('WebView窗口创建并打开成功:', webview.id);
     * } catch (error) {
     *   console.error('创建并打开WebView窗口失败:', error);
     * }
     * ```
     */
    open(url, id, styles, extras, showani) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    plus.webview.open(url, id, styles, extras, showani,
                        (nativeWebView) => {
                            const webView = new WebViewObject(nativeWebView);
                            this._webviews.set(nativeWebView.id, webView);
                            resolve(webView);
                        },
                        (error) => {
                            reject(new Error(`创建并打开WebView窗口失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境
                    const webView = await this.create(url, id, styles, extras);
                    await webView.show(showani);
                    resolve(webView);
                } else {
                    throw new Error('设备不支持WebView功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 显示WebView窗口
     * @param {WebViewObject|string} webview - WebView窗口对象或ID
     * @param {string} [aniShow] - 显示动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Function} [showedCB] - 显示完成回调
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webView.show('my-webview', 'slide-in-right', 300);
     *   console.log('WebView窗口显示成功');
     * } catch (error) {
     *   console.error('显示WebView窗口失败:', error);
     * }
     * ```
     */
    show(webview, aniShow, duration, showedCB, extras) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let targetWebView = webview;
                if (typeof webview === 'string') {
                    targetWebView = await this.getWebviewById(webview);
                }

                if (!targetWebView) {
                    throw new Error('未找到指定的WebView窗口');
                }

                await targetWebView.show(aniShow, duration, showedCB, extras);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 隐藏WebView窗口
     * @param {WebViewObject|string} webview - WebView窗口对象或ID
     * @param {string} [aniClose] - 关闭动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webView.hide('my-webview', 'slide-out-right', 300);
     *   console.log('WebView窗口隐藏成功');
     * } catch (error) {
     *   console.error('隐藏WebView窗口失败:', error);
     * }
     * ```
     */
    hide(webview, aniClose, duration, extras) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let targetWebView = webview;
                if (typeof webview === 'string') {
                    targetWebView = await this.getWebviewById(webview);
                }

                if (!targetWebView) {
                    throw new Error('未找到指定的WebView窗口');
                }

                await targetWebView.hide(aniClose, duration, extras);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 关闭WebView窗口
     * @param {WebViewObject|string} webview - WebView窗口对象或ID
     * @param {string} [aniClose] - 关闭动画类型
     * @param {number} [duration] - 动画持续时间
     * @param {Object} [extras] - 额外参数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webView.close('my-webview', 'slide-out-right', 300);
     *   console.log('WebView窗口关闭成功');
     * } catch (error) {
     *   console.error('关闭WebView窗口失败:', error);
     * }
     * ```
     */
    close(webview, aniClose, duration, extras) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                let targetWebView = webview;
                if (typeof webview === 'string') {
                    targetWebView = await this.getWebviewById(webview);
                }

                if (!targetWebView) {
                    throw new Error('未找到指定的WebView窗口');
                }

                const webviewId = targetWebView.id;
                await targetWebView.close(aniClose, duration, extras);
                this._webviews.delete(webviewId);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 根据ID获取WebView窗口
     * @param {string} id - 窗口标识
     * @returns {Promise<WebViewObject>} WebView窗口对象
     *
     * @example
     * ```javascript
     * try {
     *   const webview = await webView.getWebviewById('my-webview');
     *   if (webview) {
     *     console.log('找到WebView窗口:', webview.id);
     *   } else {
     *     console.log('未找到指定的WebView窗口');
     *   }
     * } catch (error) {
     *   console.error('获取WebView窗口失败:', error);
     * }
     * ```
     */
    getWebviewById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!id) {
                    throw new Error('id参数不能为空');
                }

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    const nativeWebView = plus.webview.getWebviewById(id);
                    if (!nativeWebView) {
                        resolve(null);
                        return;
                    }

                    // 检查是否已创建对应的WebViewObject对象
                    let webView = this._webviews.get(id);
                    if (!webView) {
                        webView = new WebViewObject(nativeWebView);
                        this._webviews.set(id, webView);
                    }
                    resolve(webView);
                } else if (this._browserSupport) {
                    // 浏览器环境
                    const webView = this._webviews.get(id);
                    resolve(webView || null);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前WebView窗口
     * @returns {Promise<WebViewObject>} 当前WebView窗口对象
     *
     * @example
     * ```javascript
     * try {
     *   const webview = await webView.currentWebview();
     *   if (webview) {
     *     console.log('当前WebView窗口:', webview.id);
     *   } else {
     *     console.log('未获取到当前WebView窗口');
     *   }
     * } catch (error) {
     *   console.error('获取当前WebView窗口失败:', error);
     * }
     * ```
     */
    currentWebview() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    const nativeWebView = plus.webview.currentWebview();
                    if (!nativeWebView) {
                        resolve(null);
                        return;
                    }

                    // 检查是否已创建对应的WebViewObject对象
                    let webView = this._webviews.get(nativeWebView.id);
                    if (!webView) {
                        webView = new WebViewObject(nativeWebView);
                        this._webviews.set(nativeWebView.id, webView);
                    }
                    resolve(webView);
                } else if (this._browserSupport) {
                    // 浏览器环境返回主窗口
                    const mainWebViewId = 'main';
                    let webView = this._webviews.get(mainWebViewId);
                    if (!webView) {
                        // 创建主窗口的模拟对象
                        const nativeWebView = {
                            id: mainWebViewId,
                            url: window.location.href,
                            title: document.title,
                            visible: true,
                            paused: false,
                            hardwareAccelerated: false,
                            progress: 100,
                            canBack: window.history.length > 1,
                            canForward: false
                        };
                        webView = new WebViewObject(nativeWebView);
                        this._webviews.set(mainWebViewId, webView);
                    }
                    resolve(webView);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取所有WebView窗口
     * @returns {Promise<WebViewObject[]>} WebView窗口对象数组
     *
     * @example
     * ```javascript
     * try {
     *   const webviews = await webView.all();
     *   console.log('所有WebView窗口:', webviews.map(w => w.id));
     * } catch (error) {
     *   console.error('获取所有WebView窗口失败:', error);
     * }
     * ```
     */
    all() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    const nativeWebViews = plus.webview.all();
                    const webViews = nativeWebViews.map(nativeWebView => {
                        // 检查是否已创建对应的WebViewObject对象
                        let webView = this._webviews.get(nativeWebView.id);
                        if (!webView) {
                            webView = new WebViewObject(nativeWebView);
                            this._webviews.set(nativeWebView.id, webView);
                        }
                        return webView;
                    });
                    resolve(webViews);
                } else if (this._browserSupport) {
                    // 浏览器环境
                    const webViews = Array.from(this._webviews.values());
                    resolve(webViews);
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取当前活跃的WebView窗口数量
     * @returns {number} 活跃WebView窗口数量
     *
     * @example
     * ```javascript
     * const count = webView.getActiveWebViewCount();
     * console.log('活跃WebView窗口数量:', count);
     * ```
     */
    getActiveWebViewCount() {
        return this._webviews.size;
    }

    /**
     * 关闭所有WebView窗口
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webView.closeAllWebViews();
     *   console.log('所有WebView窗口已关闭');
     * } catch (error) {
     *   console.error('关闭WebView窗口失败:', error);
     * }
     * ```
     */
    closeAllWebViews() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const closePromises = Array.from(this._webviews.values()).map(webview =>
                    webview.close().catch(error => {
                        console.error(`关闭WebView窗口 ${webview.id} 失败:`, error);
                    })
                );

                await Promise.all(closePromises);
                this._webviews.clear();
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 判断设备是否支持WebView功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await webView.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持WebView功能');
     *   } else {
     *     console.log('设备不支持WebView功能');
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

                if (typeof plus !== 'undefined' && plus.webview) {
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
     * 预加载URL
     * @param {string} url - 预加载的URL
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await webView.prefetchURL('https://example.com/page.html');
     *   console.log('URL预加载成功');
     * } catch (error) {
     *   console.error('预加载URL失败:', error);
     * }
     * ```
     */
    prefetchURL(url) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!url || typeof url !== 'string') {
                    throw new Error('url参数不能为空且必须是字符串');
                }

                if (typeof plus !== 'undefined' && plus.webview) {
                    // HTML5+环境
                    plus.webview.prefetchURL(url,
                        () => {
                            resolve();
                        },
                        (error) => {
                            reject(new Error(`预加载URL失败: ${error.message || '未知错误'}`));
                        }
                    );
                } else if (this._browserSupport) {
                    // 浏览器环境使用预加载
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = url;
                    document.head.appendChild(link);
                    resolve();
                } else {
                    throw new Error('设备不支持预加载功能');
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建WebView模块实例
const webView = new WebViewModule();

// 导出模块
export default webView;

// 导出类和常量
export { WebViewModule, WebViewObject, WebViewErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
webView.WebViewModule = WebViewModule;
webView.WebViewObject = WebViewObject;
webView.WebViewErrorCode = WebViewErrorCode;