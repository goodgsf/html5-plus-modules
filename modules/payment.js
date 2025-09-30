/**
 * HTML5+ Payment 模块 ES Module 封装
 *
 * 该模块提供了支付功能管理，包括获取支付通道、请求支付操作等
 * 支持支付宝、微信支付、苹果内购、Google Pay等多种支付方式
 * 遵循HTML5+官方API规范
 */

/**
 * 支付通道标识常量
 */
export const PaymentChannelId = {
    ALIPAY: 'alipay',        // 支付宝
    WXPAY: 'wxpay',          // 微信支付
    APPLE_IAP: 'appleiap',   // 苹果应用内支付
    QHPAY: 'qhpay',          // 360聚合支付（仅360手助流应用环境）
    GOOGLE_PAY: 'googlepay'  // Google Pay
};

/**
 * 支付错误码常量
 */
export const PaymentErrorCode = {
    // 通用错误码
    USER_CANCEL: -1,         // 用户取消操作
    SEND_FAILED: -2,         // 发送失败
    AUTH_DENIED: -3,         // 认证被否决
    NOT_SUPPORTED: -4,       // 不支持的操作
    INVALID_PARAM: -5,       // 无效参数

    // 支付宝错误码 (62000-62009)
    ALIPAY_SERVICE_NOT_INSTALLED: 62000,   // 客户端未安装支付通道依赖的服务
    ALIPAY_USER_CANCEL: 62001,            // 用户取消支付操作
    ALIPAY_NOT_SUPPORTED: 62002,           // 此设备不支持支付
    ALIPAY_DATA_FORMAT_ERROR: 62003,       // 数据格式错误
    ALIPAY_ACCOUNT_ERROR: 62004,          // 支付账号状态错误
    ALIPAY_ORDER_ERROR: 62005,             // 订单信息错误
    ALIPAY_INTERNAL_ERROR: 62006,          // 支付操作内部错误
    ALIPAY_SERVER_ERROR: 62007,            // 支付服务器错误
    ALIPAY_NETWORK_ERROR: 62008,           // 网络问题引起的错误
    ALIPAY_UNKNOWN_ERROR: 62009,           // 其它未定义的错误

    // IAP错误码
    IAP_PRODUCT_NOT_FOUND: 63000,          // 商品未找到
    IAP_PAYMENT_FAILED: 63001,             // 支付失败
    IAP_TRANSACTION_INVALID: 63002,       // 无效的交易
    IAP_VERIFICATION_FAILED: 63003,        // 验证失败

    // Google Pay错误码
    GOOGLE_PAY_NOT_AVAILABLE: 64000,       // Google Pay不可用
    GOOGLE_PAY_REQUEST_FAILED: 64001,     // 请求失败

    // 通用错误码
    UNKNOWN: 1099                            // 未知错误
};

/**
 * Google Pay环境类型
 */
export const GooglePayEnvironment = {
    TEST: 3,     // 测试环境
    PRODUCTION: 1  // 生产环境
};

/**
 * Google Pay支付方式
 */
export const GooglePayPaymentMethod = {
    CARD: 'CARD',     // 信用卡支付
    PAYPAL: 'PAYPAL'   // PayPal支付
};

/**
 * Google Pay卡网络类型
 */
export const GooglePayCardNetwork = {
    AMEX: 'AMEX',
    DISCOVER: 'DISCOVER',
    JCB: 'JCB',
    MASTERCARD: 'MASTERCARD',
    VISA: 'VISA'
};

/**
 * Google Pay支付认证方式
 */
export const GooglePayAuthMethod = {
    PAN_ONLY: 'PAN_ONLY',
    CRYPTOGRAM_3DS: 'CRYPTOGRAM_3DS'
};

/**
 * Google Pay账单地址格式
 */
export const GooglePayAddressFormat = {
    FULL: 'FULL',
    MIN: 'MIN'
};

/**
 * IAP交易状态
 */
export const IAPTransactionState = {
    PAYMENT_PENDING: '0',    // 正在支付
    PAYMENT_SUCCESS: '1',     // 支付成功
    PAYMENT_FAILED: '2',      // 支付失败
    PAYMENT_RESTORED: '3'     // 支付已恢复
};

/**
 * 支付通道对象
 * @typedef {Object} PaymentChannel
 * @property {string} id - 支付通道标识
 * @property {string} description - 支付通道描述
 * @property {boolean} serviceReady - 支付通道服务是否安装
 * @property {Function} installService - 安装支付通道依赖的服务
 * @property {Function} requestOrder - 向IAP服务器请求支付订单
 * @property {Function} restoreComplateRequest - 向IAP服务器请求已购买商品
 * @property {Function} finishTransaction - 向IAP服务器请求关闭订单
 * @property {Function} isReadyToPay - 判断是否支持Google Pay
 */

/**
 * IAP订单数据对象
 * @typedef {Object} OrderStatementIAP
 * @property {string} productid - 商品的标识
 * @property {string} [username] - 购买用户名称
 * @property {number} [quantity] - 商品数量
 */

/**
 * 支付操作结果对象
 * @typedef {Object} PaymentResult
 * @property {PaymentChannel} channel - 支付通道对象
 * @property {string} [tradeno] - 交易编号信息
 * @property {string} [description] - 交易描述信息
 * @property {string} [url] - 查找支付交易信息地址
 * @property {string} [signature] - 支付操作指纹信息
 * @property {string} [rawdata] - 支付平台返回的原始数据
 */

/**
 * IAP商品对象
 * @typedef {Object} IAPProduct
 * @property {string} productid - 商品的标识
 * @property {string} price - 商品的价格
 * @property {string} title - 商品标题
 * @property {string} description - 商品的描述信息
 */

/**
 * 购买IAP商品对象
 * @typedef {Object} IAPProductInfo
 * @property {string} productIdentifier - 商品的标识
 * @property {string} quantity - 商品的数量
 */

/**
 * IAP交易信息对象
 * @typedef {Object} IAPTransaction
 * @property {IAPProductInfo} payment - 购买商品的信息
 * @property {string} transactionDate - 购买商品的交易日期
 * @property {string} transactionIdentifier - 购买商品的交易订单标识
 * @property {string} transactionReceipt - 购买商品的交易收据(base64)
 * @property {string} transactionState - 购买商品的交易状态
 */

/**
 * Google Pay选项对象
 * @typedef {Object} GooglePayOptions
 * @property {number} environment - 支付环境类型
 * @property {string} paymentMethodType - 支付方式
 * @property {string} [merchantId] - 商户id
 * @property {string[]} allowedAuthMethods - 支付认证方式
 * @property {string[]} allowedCardNetworks - 卡网络类型
 * @property {boolean} [billingAddressRequired] - 是否需要账单地址
 * @property {string} [billingAddressParametersFormat] - 账单地址参数格式
 */

/**
 * 恢复购买选项
 * @typedef {Object} RestoreOptions
 * @property {string} [username] - 用户名称
 * @property {boolean} [manualFinishTransaction] - 是否需要主动关闭订单
 */

/**
 * 获取支付通道成功的回调函数
 * @callback ChannelsSuccessCallback
 * @param {PaymentChannel[]} channels - 支付通道列表
 */

/**
 * 请求支付商品列表成功的回调函数
 * @callback IapRequestOrderSuccessCallback
 * @param {IAPProduct[]} results - 商品信息数据
 */

/**
 * 恢复购买成功的回调函数
 * @callback IapRestoreComplateRequestCallback
 * @param {IAPTransaction[]} results - 已购买的非消耗性商品和订阅商品交易信息
 */

/**
 * IAP支付操作成功的回调函数
 * @callback IapPaymentSuccessCallback
 * @param {IAPTransaction} result - 支付操作成功的信息
 */

/**
 * 支付操作成功的回调函数
 * @callback PaymentSuccessCallback
 * @param {PaymentResult} result - 支付操作成功的信息
 */

/**
 * 支付操作失败的回调函数
 * @callback PaymentErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ Payment 模块类
 */
class PaymentModule {
    constructor() {
        this.moduleName = 'Payment';
        this._channels = null;
        this._initPromise = null;
        this._channelCache = new Map();
    }

    /**
     * 初始化Payment模块
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
                if (typeof plus === 'undefined' || !plus.payment) {
                    // 在浏览器环境中提供基本支持
                    this._browserSupport = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                plus.payment.getChannels(
                    (channels) => {
                        this._channels = channels;
                        this._cacheChannels(channels);
                        resolve();
                    },
                    (error) => {
                        console.warn('Payment模块初始化失败，将使用基本功能:', error);
                        // 仍然允许基本功能
                        this._browserSupport = true;
                        resolve();
                    }
                );
            } catch (error) {
                console.warn('Payment模块初始化异常:', error);
                this._browserSupport = true;
                resolve();
            }
        });

        return this._initPromise;
    }

    /**
     * 缓存支付通道信息
     * @private
     * @param {PaymentChannel[]} channels - 支付通道列表
     */
    _cacheChannels(channels) {
        this._channelCache.clear();
        if (channels && Array.isArray(channels)) {
            channels.forEach(channel => {
                this._channelCache.set(channel.id, this._wrapChannel(channel));
            });
        }
    }

    /**
     * 包装支付通道对象，添加Promise方法
     * @private
     */
    _wrapChannel(channel) {
        return {
            id: channel.id,
            description: channel.description,
            serviceReady: channel.serviceReady,

            // 原生方法
            installService: channel.installService ? channel.installService.bind(channel) : null,
            requestOrder: channel.requestOrder ? channel.requestOrder.bind(channel) : null,
            restoreComplateRequest: channel.restoreComplateRequest ? channel.restoreComplateRequest.bind(channel) : null,
            finishTransaction: channel.finishTransaction ? channel.finishTransaction.bind(channel) : null,
            isReadyToPay: channel.isReadyToPay ? channel.isReadyToPay.bind(channel) : null,

            // Promise包装方法
            installServiceAsync: async () => {
                if (channel.installService) {
                    channel.installService();
                }
            },

            requestOrderAsync: (ids) => {
                return new Promise((resolve, reject) => {
                    if (!channel.requestOrder) {
                        reject(new Error('此支付通道不支持requestOrder方法'));
                        return;
                    }
                    channel.requestOrder(ids, resolve, reject);
                });
            },

            restoreComplateRequestAsync: (options = {}) => {
                return new Promise((resolve, reject) => {
                    if (!channel.restoreComplateRequest) {
                        reject(new Error('此支付通道不支持restoreComplateRequest方法'));
                        return;
                    }
                    channel.restoreComplateRequest(options, resolve, reject);
                });
            },

            finishTransactionAsync: (transaction) => {
                return new Promise((resolve, reject) => {
                    if (!channel.finishTransaction) {
                        reject(new Error('此支付通道不支持finishTransaction方法'));
                        return;
                    }
                    channel.finishTransaction(transaction, resolve, reject);
                });
            },

            isReadyToPayAsync: (options) => {
                return new Promise((resolve, reject) => {
                    if (!channel.isReadyToPay) {
                        reject(new Error('此支付通道不支持isReadyToPay方法'));
                        return;
                    }
                    channel.isReadyToPay(options, resolve, reject);
                });
            }
        };
    }

    /**
     * 获取支付通道列表
     * @returns {Promise<PaymentChannel[]>} 支付通道列表
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const channels = await payment.getChannels();
     *   console.log('可用支付通道:', channels);
     *
     *   // 查找支付宝通道
     *   const alipayChannel = channels.find(ch => ch.id === 'alipay');
     *   if (alipayChannel) {
     *     console.log('支付宝支付可用');
     *   }
     * } catch (error) {
     *   console.error('获取支付通道失败:', error);
     * }
     *
     * // 回调方式调用
     * payment.getChannels()
     *   .then(channels => {
     *     console.log('可用支付通道:', channels);
     *   })
     *   .catch(error => {
     *     console.error('获取失败:', error);
     *   });
     * ```
     */
    getChannels() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.payment && this._channels) {
                    // HTML5+环境，返回缓存的channels
                    resolve(Array.from(this._channelCache.values()));
                } else {
                    // 浏览器环境，返回模拟的通道列表
                    const mockChannels = [
                        {
                            id: 'alipay',
                            description: '支付宝',
                            serviceReady: true,
                            installService: () => console.log('模拟安装支付宝服务'),
                            requestOrder: null,
                            restoreComplateRequest: null,
                            finishTransaction: null,
                            isReadyToPay: null
                        },
                        {
                            id: 'wxpay',
                            description: '微信支付',
                            serviceReady: false,
                            installService: () => console.log('模拟安装微信支付服务'),
                            requestOrder: null,
                            restoreComplateRequest: null,
                            finishTransaction: null,
                            isReadyToPay: null
                        }
                    ];
                    resolve(mockChannels);
                }
            } catch (error) {
                reject(new Error(`获取支付通道失败: ${error.message}`));
            }
        });
    }

    /**
     * 请求支付操作
     * @param {PaymentChannel|string} channel - 支付通道或通道ID
     * @param {string|OrderStatementIAP|Object} statement - 支付订单信息
     * @param {PaymentSuccessCallback|IapPaymentSuccessCallback} [successCallback] - 成功回调函数
     * @param {PaymentErrorCallback} [errorCallback] - 失败回调函数
     * @returns {Promise<PaymentResult|IAPTransaction>} 支付结果
     *
     * @example
     * ```javascript
     * // 使用Promise方式
     * try {
     *   const channels = await payment.getChannels();
     *   const alipayChannel = channels.find(ch => ch.id === 'alipay');
     *
     *   const result = await payment.request(alipayChannel, '模拟支付订单信息');
     *   console.log('支付成功:', result);
     * } catch (error) {
     *   console.error('支付失败:', error);
     * }
     *
     * // 使用回调方式
     * payment.request(alipayChannel, '模拟支付订单信息',
     *   (result) => {
     *     console.log('支付成功:', result);
     *   },
     *   (error) => {
     *     console.error('支付失败:', error);
     *   }
     * );
     *
     * // IAP支付示例
     * const iapChannel = channels.find(ch => ch.id === 'appleiap');
     * const order = { productid: 'com.example.product1', quantity: 1 };
     * const result = await payment.request(iapChannel, order);
     * ```
     */
    request(channel, statement, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                // 处理channel参数
                let actualChannel = channel;
                if (typeof channel === 'string') {
                    actualChannel = this._channelCache.get(channel);
                    if (!actualChannel) {
                        throw new Error(`未找到支付通道: ${channel}`);
                    }
                }

                // 处理statement参数
                let actualStatement = statement;
                if (typeof statement === 'object') {
                    actualStatement = JSON.stringify(statement);
                }

                if (typeof plus !== 'undefined' && plus.payment) {
                    // HTML5+环境
                    plus.payment.request(
                        actualChannel,
                        actualStatement,
                        (result) => {
                            // 调用成功回调
                            if (successCallback) {
                                try {
                                    successCallback(result);
                                } catch (callbackError) {
                                    console.error('支付成功回调执行失败:', callbackError);
                                }
                            }
                            resolve(result);
                        },
                        (error) => {
                            const paymentError = new Error(`支付失败: ${error.message || '未知错误'}`);
                            paymentError.code = error.code || PaymentErrorCode.UNKNOWN;

                            // 调用失败回调
                            if (errorCallback) {
                                try {
                                    errorCallback(paymentError);
                                } catch (callbackError) {
                                    console.error('支付失败回调执行失败:', callbackError);
                                }
                            }
                            reject(paymentError);
                        }
                    );
                } else {
                    // 浏览器环境模拟
                    setTimeout(() => {
                        const mockResult = {
                            channel: actualChannel,
                            tradeno: `mock_trade_${Date.now()}`,
                            description: '模拟支付成功',
                            url: 'https://mock-payment.com/check',
                            signature: 'mock_signature',
                            rawdata: JSON.stringify({
                                trade_no: `mock_trade_${Date.now()}`,
                                total_amount: '0.01',
                                subject: '模拟支付'
                            })
                        };

                        // 调用成功回调
                        if (successCallback) {
                            try {
                                successCallback(mockResult);
                            } catch (callbackError) {
                                console.error('支付成功回调执行失败:', callbackError);
                            }
                        }
                        resolve(mockResult);
                    }, 1500);
                }
            } catch (error) {
                const paymentError = new Error(`支付请求失败: ${error.message}`);
                paymentError.code = PaymentErrorCode.INVALID_PARAM;

                // 调用失败回调
                if (errorCallback) {
                    try {
                        errorCallback(paymentError);
                    } catch (callbackError) {
                        console.error('支付失败回调执行失败:', callbackError);
                    }
                }
                reject(paymentError);
            }
        });
    }

    /**
     * 获取指定支付通道
     * @param {string} channelId - 支付通道ID
     * @returns {Promise<PaymentChannel>} 支付通道对象
     *
     * @example
     * ```javascript
     * try {
     *   const alipayChannel = await payment.getChannel('alipay');
     *   console.log('支付宝通道:', alipayChannel);
     * } catch (error) {
     *   console.error('获取支付通道失败:', error);
     * }
     * ```
     */
    getChannel(channelId) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const channel = this._channelCache.get(channelId);
                if (channel) {
                    resolve(channel);
                } else {
                    reject(new Error(`未找到支付通道: ${channelId}`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 检查支付通道是否可用
     * @param {string} channelId - 支付通道ID
     * @returns {Promise<boolean>} 是否可用
     *
     * @example
     * ```javascript
     * try {
     *   const isAvailable = await payment.isChannelAvailable('alipay');
     *   console.log('支付宝是否可用:', isAvailable);
     * } catch (error) {
     *   console.error('检查通道可用性失败:', error);
     * }
     * ```
     */
    isChannelAvailable(channelId) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(channelId);
                resolve(channel && channel.serviceReady);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 安装支付通道服务
     * @param {string} channelId - 支付通道ID
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await payment.installChannelService('wxpay');
     *   console.log('微信支付服务安装完成');
     * } catch (error) {
     *   console.error('安装服务失败:', error);
     * }
     * ```
     */
    installChannelService(channelId) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(channelId);

                if (channel.installService) {
                    channel.installService();
                    resolve();
                } else if (channel.installServiceAsync) {
                    await channel.installServiceAsync();
                    resolve();
                } else {
                    reject(new Error(`支付通道 ${channelId} 不支持安装服务`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 向IAP服务器请求支付订单
     * @param {string} channelId - 支付通道ID
     * @param {string[]} productIds - 商品ID列表
     * @returns {Promise<IAPProduct[]>} 商品信息列表
     *
     * @example
     * ```javascript
     * try {
     *   const products = await payment.requestIAPOrder('appleiap', ['product1', 'product2']);
     *   console.log('商品信息:', products);
     * } catch (error) {
     *   console.error('请求订单失败:', error);
     * }
     * ```
     */
    requestIAPOrder(channelId, productIds) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(channelId);

                if (channel.requestOrderAsync) {
                    const products = await channel.requestOrderAsync(productIds);
                    resolve(products);
                } else {
                    reject(new Error(`支付通道 ${channelId} 不支持请求订单功能`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 恢复已购买的非消耗性商品和订阅商品
     * @param {string} channelId - 支付通道ID
     * @param {RestoreOptions} [options] - 恢复选项
     * @returns {Promise<IAPTransaction[]>} 已购买商品交易信息
     *
     * @example
     * ```javascript
     * try {
     *   const transactions = await payment.restoreCompletedTransactions('appleiap', {
     *     manualFinishTransaction: true
     *   });
     *   console.log('已购买商品:', transactions);
     * } catch (error) {
     *   console.error('恢复购买失败:', error);
     * }
     * ```
     */
    restoreCompletedTransactions(channelId, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(channelId);

                if (channel.restoreComplateRequestAsync) {
                    const transactions = await channel.restoreComplateRequestAsync(options);
                    resolve(transactions);
                } else {
                    reject(new Error(`支付通道 ${channelId} 不支持恢复购买功能`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 关闭IAP订单
     * @param {string} channelId - 支付通道ID
     * @param {IAPTransaction} transaction - 交易信息
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await payment.finishTransaction('appleiap', transaction);
     *   console.log('订单已关闭');
     * } catch (error) {
     *   console.error('关闭订单失败:', error);
     * }
     * ```
     */
    finishTransaction(channelId, transaction) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(channelId);

                if (channel.finishTransactionAsync) {
                    await channel.finishTransactionAsync(transaction);
                    resolve();
                } else {
                    reject(new Error(`支付通道 ${channelId} 不支持关闭订单功能`));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 检查Google Pay是否可用
     * @param {GooglePayOptions} options - Google Pay选项
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   const options = {
     *     environment: GooglePayEnvironment.TEST,
     *     paymentMethodType: GooglePayPaymentMethod.CARD,
     *     allowedAuthMethods: [GooglePayAuthMethod.PAN_ONLY],
     *     allowedCardNetworks: [GooglePayCardNetwork.VISA, GooglePayCardNetwork.MASTERCARD]
     *   };
     *   await payment.checkGooglePayReady(options);
     *   console.log('Google Pay可用');
     * } catch (error) {
     *   console.error('Google Pay不可用:', error);
     * }
     * ```
     */
    checkGooglePayReady(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.getChannel(PaymentChannelId.GOOGLE_PAY);

                if (channel.isReadyToPayAsync) {
                    await channel.isReadyToPayAsync(options);
                    resolve();
                } else {
                    reject(new Error('Google Pay通道不支持可用性检查'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 判断设备是否支持Payment功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await payment.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持支付功能');
     *   } else {
     *     console.log('设备不支持支付功能');
     *   }
     * } catch (error) {
     *   console.error('检查支付支持失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.payment) {
                    resolve(true);
                } else {
                    // 浏览器环境提供基本支持
                    resolve(true);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取所有可用的支付通道ID
     * @returns {Promise<string[]>} 可用的支付通道ID列表
     *
     * @example
     * ```javascript
     * try {
     *   const availableChannelIds = await payment.getAvailableChannelIds();
     *   console.log('可用支付通道ID:', availableChannelIds);
     * } catch (error) {
     *   console.error('获取可用通道ID失败:', error);
     * }
     * ```
     */
    getAvailableChannelIds() {
        return new Promise(async (resolve, reject) => {
            try {
                const channels = await this.getChannels();
                const availableIds = channels
                    .filter(channel => channel.serviceReady)
                    .map(channel => channel.id);
                resolve(availableIds);
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建Payment模块实例
const payment = new PaymentModule();

// 导出模块
export default payment;

// 导出类和常量
export { PaymentModule, PaymentChannelId, PaymentErrorCode, GooglePayEnvironment, GooglePayPaymentMethod, GooglePayCardNetwork, GooglePayAuthMethod, GooglePayAddressFormat, IAPTransactionState };

// 为了兼容性，也导出类和常量作为默认导出的属性
payment.PaymentModule = PaymentModule;
payment.PaymentChannelId = PaymentChannelId;
payment.PaymentErrorCode = PaymentErrorCode;
payment.GooglePayEnvironment = GooglePayEnvironment;
payment.GooglePayPaymentMethod = GooglePayPaymentMethod;
payment.GooglePayCardNetwork = GooglePayCardNetwork;
payment.GooglePayAuthMethod = GooglePayAuthMethod;
payment.GooglePayAddressFormat = GooglePayAddressFormat;
payment.IAPTransactionState = IAPTransactionState;