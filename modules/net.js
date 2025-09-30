/**
 * HTML5+ Net 模块 ES Module 封装
 *
 * 该模块提供了网络请求功能，包括跨域XMLHttpRequest请求、进度事件监听等
 * 遵循HTML5+官方API规范
 */

/**
 * HTTP请求状态常量
 */
export const ReadyState = {
    UNINITIALIZED: 0,    // 未初始化
    OPEN: 1,            // 已打开
    SENT: 2,            // 已发送
    RECEIVING: 3,       // 接收中
    LOADED: 4           // 已完成
};

/**
 * 响应数据类型常量
 */
export const ResponseType = {
    TEXT: 'text',           // 文本类型
    ARRAY_BUFFER: 'arraybuffer',  // 二进制数组
    BLOB: 'blob',           // Blob对象
    DOCUMENT: 'document',    // Document对象
    JSON: 'json'            // JSON对象
};

/**
 * 网络请求进度事件
 * @typedef {Object} ProgressEvent
 * @property {Object} target - 事件目标对象
 * @property {boolean} lengthComputable - 是否可计算进度
 * @property {number} loaded - 已加载数据量
 * @property {number} total - 总数据量
 */

/**
 * 网络请求状态变化的回调函数
 * @callback XhrStateChangeCallback
 * @param {XMLHttpRequest} xhr - XMLHttpRequest对象
 */

/**
 * 网络请求进度事件的回调函数
 * @callback XhrProgressEventCallback
 * @param {ProgressEvent} event - 进度事件对象
 */

/**
 * HTML5+ XMLHttpRequest 网络请求类
 */
class XMLHttpRequest {
    constructor() {
        // 内部状态
        this.readyState = ReadyState.UNINITIALIZED;
        this.response = null;
        this.responseText = '';
        this.responseType = ResponseType.TEXT;
        this.responseXML = null;
        this.status = 0;
        this.statusText = '';
        this.timeout = 0;
        this.withCredentials = false;

        // 事件处理器
        this.onreadystatechange = null;
        this.onloadstart = null;
        this.onprogress = null;
        this.onabort = null;
        this.onerror = null;
        this.onload = null;
        this.ontimeout = null;
        this.onloadend = null;

        // 内部属性
        this._url = '';
        this._method = '';
        this._async = true;
        this._requestHeaders = {};
        this._nativeXhr = null;
        this._listeners = new Map();
    }

    /**
     * 初始化HTTP/HTTPS请求参数
     * @param {string} method - HTTP方法（GET、POST、PUT、DELETE等）
     * @param {string} url - 请求的URL地址
     * @param {boolean} [async=true] - 是否异步请求
     * @param {string} [user] - 认证用户名
     * @param {string} [password] - 认证密码
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.send();
     * ```
     */
    open(method, url, async = true, user = null, password = null) {
        try {
            // 参数验证
            if (!method || !url) {
                throw new Error('method和url参数不能为空');
            }

            this._method = method.toUpperCase();
            this._url = url;
            this._async = async !== false;

            // 重置状态
            this.readyState = ReadyState.OPEN;
            this.response = null;
            this.responseText = '';
            this.responseXML = null;
            this.status = 0;
            this.statusText = '';

            // 触发状态变化事件
            this._triggerStateChange();

        } catch (error) {
            this._handleError('open方法调用失败', error);
        }
    }

    /**
     * 发送HTTP请求
     * @param {string|ArrayBuffer|Blob|Document|FormData} [data] - 发送的数据
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('POST', 'https://api.example.com/data');
     * xhr.setRequestHeader('Content-Type', 'application/json');
     * xhr.send(JSON.stringify({ key: 'value' }));
     * ```
     */
    send(data = null) {
        try {
            if (this.readyState !== ReadyState.OPEN) {
                throw new Error('请先调用open()方法');
            }

            // 检查HTML5+环境是否可用
            if (typeof plus !== 'undefined' && plus.net && plus.net.XMLHttpRequest) {
                this._sendWithPlus(data);
            } else {
                // 使用浏览器原生XMLHttpRequest
                this._sendWithBrowser(data);
            }

        } catch (error) {
            this._handleError('send方法调用失败', error);
        }
    }

    /**
     * 使用HTML5+环境发送请求
     * @private
     */
    _sendWithPlus(data) {
        try {
            // 创建HTML5+ XMLHttpRequest对象
            this._nativeXhr = new plus.net.XMLHttpRequest();

            // 设置响应类型
            if (this.responseType) {
                this._nativeXhr.responseType = this.responseType;
            }

            // 设置超时时间
            if (this.timeout > 0) {
                this._nativeXhr.timeout = this.timeout;
            }

            // 设置跨域凭证
            this._nativeXhr.withCredentials = this.withCredentials;

            // 绑定事件处理器
            this._bindPlusEvents();

            // 设置请求头
            for (const [header, value] of Object.entries(this._requestHeaders)) {
                this._nativeXhr.setRequestHeader(header, value);
            }

            // 发送请求
            this._nativeXhr.open(this._method, this._url, this._async);
            this._nativeXhr.send(data);

        } catch (error) {
            this._handleError('HTML5+请求发送失败', error);
        }
    }

    /**
     * 使用浏览器原生XMLHttpRequest发送请求
     * @private
     */
    _sendWithBrowser(data) {
        try {
            // 创建浏览器原生XMLHttpRequest对象
            this._nativeXhr = new window.XMLHttpRequest();

            // 设置响应类型
            if (this.responseType) {
                this._nativeXhr.responseType = this.responseType;
            }

            // 设置超时时间
            if (this.timeout > 0) {
                this._nativeXhr.timeout = this.timeout;
            }

            // 设置跨域凭证
            this._nativeXhr.withCredentials = this.withCredentials;

            // 绑定事件处理器
            this._bindBrowserEvents();

            // 设置请求头
            for (const [header, value] of Object.entries(this._requestHeaders)) {
                this._nativeXhr.setRequestHeader(header, value);
            }

            // 发送请求
            this._nativeXhr.open(this._method, this._url, this._async);
            this._nativeXhr.send(data);

        } catch (error) {
            this._handleError('浏览器请求发送失败', error);
        }
    }

    /**
     * 绑定HTML5+事件处理器
     * @private
     */
    _bindPlusEvents() {
        const xhr = this._nativeXhr;

        // 状态变化事件
        xhr.onreadystatechange = () => {
            this.readyState = xhr.readyState;
            this.response = xhr.response;
            this.responseText = xhr.responseText;
            this.responseXML = xhr.responseXML;
            this.status = xhr.status;
            this.statusText = xhr.statusText;

            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        };

        // 进度事件
        xhr.onloadstart = (event) => {
            this._triggerEvent('loadstart', event);
        };

        xhr.onprogress = (event) => {
            this._triggerEvent('progress', event);
        };

        xhr.onabort = (event) => {
            this._triggerEvent('abort', event);
        };

        xhr.onerror = (event) => {
            this._triggerEvent('error', event);
        };

        xhr.onload = (event) => {
            this._triggerEvent('load', event);
        };

        xhr.ontimeout = (event) => {
            this._triggerEvent('timeout', event);
        };

        xhr.onloadend = (event) => {
            this._triggerEvent('loadend', event);
        };
    }

    /**
     * 绑定浏览器事件处理器
     * @private
     */
    _bindBrowserEvents() {
        const xhr = this._nativeXhr;

        // 状态变化事件
        xhr.onreadystatechange = () => {
            this.readyState = xhr.readyState;
            this.response = xhr.response;
            this.responseText = xhr.responseText;
            this.responseXML = xhr.responseXML;
            this.status = xhr.status;
            this.statusText = xhr.statusText;

            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        };

        // 进度事件
        xhr.onloadstart = (event) => {
            this._triggerEvent('loadstart', event);
        };

        xhr.onprogress = (event) => {
            this._triggerEvent('progress', event);
        };

        xhr.onabort = (event) => {
            this._triggerEvent('abort', event);
        };

        xhr.onerror = (event) => {
            this._triggerEvent('error', event);
        };

        xhr.onload = (event) => {
            this._triggerEvent('load', event);
        };

        xhr.ontimeout = (event) => {
            this._triggerEvent('timeout', event);
        };

        xhr.onloadend = (event) => {
            this._triggerEvent('loadend', event);
        };
    }

    /**
     * 触发事件
     * @private
     */
    _triggerEvent(type, event) {
        const handler = this[`on${type}`];
        if (handler) {
            handler(event);
        }

        // 触发自定义监听器
        if (this._listeners.has(type)) {
            this._listeners.get(type).forEach(listener => {
                listener(event);
            });
        }
    }

    /**
     * 触发状态变化
     * @private
     */
    _triggerStateChange() {
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    }

    /**
     * 处理错误
     * @private
     */
    _handleError(message, error) {
        console.error(`XMLHttpRequest错误: ${message}`, error);

        // 触发错误事件
        const errorEvent = {
            target: this,
            type: 'error',
            message: message,
            error: error
        };

        this._triggerEvent('error', errorEvent);
    }

    /**
     * 取消当前响应，关闭连接并且结束任何未决的网络活动
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.send();
     *
     * // 取消请求
     * xhr.abort();
     * ```
     */
    abort() {
        try {
            if (this._nativeXhr) {
                this._nativeXhr.abort();
            }

            // 重置状态
            this.readyState = ReadyState.UNINITIALIZED;
            this.response = null;
            this.responseText = '';
            this.responseXML = null;
            this.status = 0;
            this.statusText = '';

            // 触发中止事件
            this._triggerEvent('abort', {
                target: this,
                type: 'abort'
            });

        } catch (error) {
            this._handleError('abort方法调用失败', error);
        }
    }

    /**
     * 获取HTTP响应头部信息
     * @returns {string} 所有响应头部信息
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.onload = function() {
     *   const headers = xhr.getAllResponseHeaders();
     *   console.log('响应头:', headers);
     * };
     * xhr.send();
     * ```
     */
    getAllResponseHeaders() {
        try {
            if (this._nativeXhr) {
                return this._nativeXhr.getAllResponseHeaders();
            }
            return '';
        } catch (error) {
            this._handleError('获取响应头失败', error);
            return '';
        }
    }

    /**
     * 获取指定的HTTP响应头部的值
     * @param {string} header - 头部名称
     * @returns {string} 头部值
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.onload = function() {
     *   const contentType = xhr.getResponseHeader('Content-Type');
     *   console.log('Content-Type:', contentType);
     * };
     * xhr.send();
     * ```
     */
    getResponseHeader(header) {
        try {
            if (!header) {
                throw new Error('header参数不能为空');
            }

            if (this._nativeXhr) {
                return this._nativeXhr.getResponseHeader(header);
            }
            return '';
        } catch (error) {
            this._handleError('获取指定响应头失败', error);
            return '';
        }
    }

    /**
     * 重写服务器返回的MIME类型
     * @param {string} mimeType - MIME类型
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.overrideMimeType('text/plain; charset=utf-8');
     * xhr.send();
     * ```
     */
    overrideMimeType(mimeType) {
        try {
            if (!mimeType) {
                throw new Error('mimeType参数不能为空');
            }

            if (this._nativeXhr && typeof this._nativeXhr.overrideMimeType === 'function') {
                this._nativeXhr.overrideMimeType(mimeType);
            }

        } catch (error) {
            this._handleError('overrideMimeType方法调用失败', error);
        }
    }

    /**
     * 指定一个HTTP请求的Header
     * @param {string} header - 头部名称
     * @param {string} value - 头部值
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.open('POST', 'https://api.example.com/data');
     * xhr.setRequestHeader('Content-Type', 'application/json');
     * xhr.setRequestHeader('Authorization', 'Bearer token');
     * xhr.send();
     * ```
     */
    setRequestHeader(header, value) {
        try {
            if (!header || !value) {
                throw new Error('header和value参数不能为空');
            }

            // 存储请求头，在send方法中设置
            this._requestHeaders[header] = value;

            // 如果已经有原生xhr对象，直接设置
            if (this._nativeXhr) {
                this._nativeXhr.setRequestHeader(header, value);
            }

        } catch (error) {
            this._handleError('setRequestHeader方法调用失败', error);
        }
    }

    /**
     * 添加事件监听器
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * xhr.addEventListener('load', function(event) {
     *   console.log('请求完成:', event);
     * });
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.send();
     * ```
     */
    addEventListener(type, listener) {
        if (!type || typeof listener !== 'function') {
            throw new Error('type和listener参数不能为空');
        }

        if (!this._listeners.has(type)) {
            this._listeners.set(type, new Set());
        }

        this._listeners.get(type).add(listener);
    }

    /**
     * 移除事件监听器
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     * @returns {void}
     *
     * @example
     * ```javascript
     * const xhr = new XMLHttpRequest();
     * function loadHandler(event) {
     *   console.log('请求完成:', event);
     * }
     * xhr.addEventListener('load', loadHandler);
     * xhr.removeEventListener('load', loadHandler);
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.send();
     * ```
     */
    removeEventListener(type, listener) {
        if (!type || typeof listener !== 'function') {
            throw new Error('type和listener参数不能为空');
        }

        if (this._listeners.has(type)) {
            this._listeners.get(type).delete(listener);
        }
    }

    /**
     * 判断设备是否支持XMLHttpRequest功能
     * @returns {boolean} 是否支持
     *
     * @example
     * ```javascript
     * if (XMLHttpRequest.isSupported()) {
     *   console.log('设备支持XMLHttpRequest功能');
     * } else {
     *   console.log('设备不支持XMLHttpRequest功能');
     * }
     * ```
     */
    static isSupported() {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus !== 'undefined' && plus.net && plus.net.XMLHttpRequest) {
                return true;
            }

            // 检查浏览器环境
            if (typeof window !== 'undefined' && window.XMLHttpRequest) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}

/**
 * Net模块类
 */
class NetModule {
    constructor() {
        this.moduleName = 'Net';
        this.activeRequests = new Set();
    }

    /**
     * 创建XMLHttpRequest对象
     * @returns {XMLHttpRequest} XMLHttpRequest对象
     *
     * @example
     * ```javascript
     * const net = new NetModule();
     * const xhr = net.createXMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data');
     * xhr.send();
     * ```
     */
    createXMLHttpRequest() {
        const xhr = new XMLHttpRequest();
        this.activeRequests.add(xhr);

        // 请求完成后从活跃请求中移除
        const originalOnLoadEnd = xhr.onloadend;
        xhr.onloadend = (event) => {
            if (originalOnLoadEnd) {
                originalOnLoadEnd.call(xhr, event);
            }
            this.activeRequests.delete(xhr);
        };

        return xhr;
    }

    /**
     * 取消所有活跃的请求
     * @returns {void}
     *
     * @example
     * ```javascript
     * const net = new NetModule();
     * // 创建多个请求...
     * net.cancelAllRequests();
     * ```
     */
    cancelAllRequests() {
        this.activeRequests.forEach(xhr => {
            try {
                xhr.abort();
            } catch (error) {
                console.error('取消请求失败:', error);
            }
        });
        this.activeRequests.clear();
    }

    /**
     * 获取活跃请求数量
     * @returns {number} 活跃请求数量
     *
     * @example
     * ```javascript
     * const net = new NetModule();
     * const count = net.getActiveRequestCount();
     * console.log('活跃请求数量:', count);
     * ```
     */
    getActiveRequestCount() {
        return this.activeRequests.size;
    }

    /**
     * 判断设备是否支持Net功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const isSupported = await net.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持Net功能');
     *   } else {
     *     console.log('设备不支持Net功能');
     *   }
     * } catch (error) {
     *   console.error('检查Net支持失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise((resolve) => {
            resolve(XMLHttpRequest.isSupported());
        });
    }
}

// 创建Net模块实例
const net = new NetModule();

// 导出模块
export default net;

// 导出类和常量
export { XMLHttpRequest, NetModule, ReadyState, ResponseType };

// 为了兼容性，也导出XMLHttpRequest类作为默认导出的属性
net.XMLHttpRequest = XMLHttpRequest;