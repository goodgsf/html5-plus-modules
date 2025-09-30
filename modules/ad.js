/**
 * HTML5+ Ad 模块 ES Module 封装
 *
 * 该模块提供了广告功能，遵循HTML5+官方API规范
 * 支持创建和管理各种类型的广告对象
 */

/**
 * 广告控件样式
 * @typedef {Object} AdViewStyles
 * @property {string} [position] - 控件在窗口中的位置，如"static"、"absolute"、"relative"
 * @property {string} [top] - 控件左上角的垂直偏移量
 * @property {string} [left] - 控件左上角的水平偏移量
 * @property {string} [width] - 控件的宽度
 * @property {string} [height] - 控件的高度
 */

/**
 * 插屏广告样式
 * @typedef {Object} InterstitialAdStyles
 * @property {string} [adpid] - 广告位标识
 * @property {boolean} [test] - 是否为测试广告，默认为false
 */

/**
 * 全屏视频广告样式
 * @typedef {Object} FullScreenVideoAdStyles
 * @property {string} [adpid] - 广告位标识
 * @property {boolean} [test] - 是否为测试广告，默认为false
 */

/**
 * 激励视频广告样式
 * @typedef {Object} RewardedVideoAdStyles
 * @property {string} [adpid] - 广告位标识
 * @property {boolean} [test] - 是否为测试广告，默认为false
 * @property {Object} [urlCallback] - 激励视频服务器回调数据
 */

/**
 * 获取信息流广告的参数
 * @typedef {Object} AdsOptions
 * @property {number} [count] - 获取广告的数量，默认为1
 * @property {string} [width] - 广告的宽度
 * @property {string} [height] - 广告的高度
 */

/**
 * 内容联盟的参数
 * @typedef {Object} ContentOptions
 * @property {string} [category] - 内容分类
 * @property {string} [keywords] - 关键词
 * @property {number} [count] - 获取内容的数量，默认为1
 */

/**
 * 信息流广告数据对象
 * @typedef {Object} AdData
 * @property {string} title - 广告标题
 * @property {string} description - 广告描述信息
 * @property {string} provider - 广告提供商标识
 * @property {string} showMode - 广告显示类型
 */

/**
 * 激励视频服务器回调数据
 * @typedef {Object} RewardVideoAdUrlCallbackDatas
 * @property {string} [url] - 服务器回调地址
 * @property {Object} [data] - 服务器回调数据
 */

/**
 * 广告操作成功回调函数
 * @callback AdSuccessCallback
 * @param {*} [result] - 操作结果
 */

/**
 * 广告操作错误回调函数
 * @callback AdErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 获取信息流广告成功回调函数
 * @callback GetAdsSuccessCallback
 * @param {AdData[]} ads - 信息流广告数据数组
 */

/**
 * 监听广告渲染完成事件回调函数
 * @callback ADViewRenderingCallback
 */

/**
 * 监听点击关闭广告事件回调函数
 * @callback ADviewDislikedCallback
 * @param {Object} result - 关闭结果
 */

/**
 * 监听关闭广告事件回调函数
 * @callback AdCloseCallback
 * @param {Object} result - 关闭结果
 */

/**
 * 监听关闭全屏或激励视频广告事件回调函数
 * @callback VideoAdCloseCallback
 * @param {Object} result - 关闭结果
 */

/**
 * Ad模块类
 */
class AdModule {
    constructor() {
        this.adViews = new Map(); // 存储广告控件
        this.interstitialAds = new Map(); // 存储插屏广告
        this.fullScreenVideoAds = new Map(); // 存储全屏视频广告
        this.rewardedVideoAds = new Map(); // 存储激励视频广告
    }

    /**
     * 创建广告控件
     * @param {AdViewStyles} styles - 广告控件样式
     * @returns {Promise<AdView>|AdView} 广告控件对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const adView = await ad.createAdView({
     *     position: 'absolute',
     *     top: '0px',
     *     left: '0px',
     *     width: '100%',
     *     height: '50px'
     *   });
     *   console.log('广告控件创建成功');
     * } catch (error) {
     *   console.error('创建广告控件失败:', error);
     * }
     * ```
     */
    createAdView(styles) {
        // 如果没有传入styles，支持Promise方式
        if (typeof styles === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('styles参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 创建广告控件
            const adView = plus.ad.createAdView(styles);
            const adId = 'adview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储广告控件
            this.adViews.set(adId, adView);

            // 添加包装方法
            this.wrapAdView(adView, adId);

            return adView;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 创建插屏广告对象
     * @param {InterstitialAdStyles} styles - 插屏广告样式
     * @returns {Promise<InterstitialAd>|InterstitialAd} 插屏广告对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const interstitialAd = await ad.createInterstitialAd({
     *     adpid: 'your-adpid',
     *     test: true
     *   });
     *   console.log('插屏广告创建成功');
     * } catch (error) {
     *   console.error('创建插屏广告失败:', error);
     * }
     * ```
     */
    createInterstitialAd(styles) {
        // 如果没有传入styles，支持Promise方式
        if (typeof styles === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('styles参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 创建插屏广告
            const interstitialAd = plus.ad.createInterstitialAd(styles);
            const adId = 'interstitial_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储插屏广告
            this.interstitialAds.set(adId, interstitialAd);

            // 添加包装方法
            this.wrapInterstitialAd(interstitialAd, adId);

            return interstitialAd;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 创建全屏视频广告对象
     * @param {FullScreenVideoAdStyles} styles - 全屏视频广告样式
     * @returns {Promise<FullScreenVideoAd>|FullScreenVideoAd} 全屏视频广告对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const fullScreenVideoAd = await ad.createFullScreenVideoAd({
     *     adpid: 'your-adpid',
     *     test: true
     *   });
     *   console.log('全屏视频广告创建成功');
     * } catch (error) {
     *   console.error('创建全屏视频广告失败:', error);
     * }
     * ```
     */
    createFullScreenVideoAd(styles) {
        // 如果没有传入styles，支持Promise方式
        if (typeof styles === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('styles参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 创建全屏视频广告
            const fullScreenVideoAd = plus.ad.createFullScreenVideoAd(styles);
            const adId = 'fullscreen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储全屏视频广告
            this.fullScreenVideoAds.set(adId, fullScreenVideoAd);

            // 添加包装方法
            this.wrapFullScreenVideoAd(fullScreenVideoAd, adId);

            return fullScreenVideoAd;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 创建激励视频广告对象
     * @param {RewardedVideoAdStyles} styles - 激励视频广告样式
     * @returns {Promise<RewardedVideoAd>|RewardedVideoAd} 激励视频广告对象
     * @throws {Error} 如果创建失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const rewardedVideoAd = await ad.createRewardedVideoAd({
     *     adpid: 'your-adpid',
     *     test: true
     *   });
     *   console.log('激励视频广告创建成功');
     * } catch (error) {
     *   console.error('创建激励视频广告失败:', error);
     * }
     * ```
     */
    createRewardedVideoAd(styles) {
        // 如果没有传入styles，支持Promise方式
        if (typeof styles === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('styles参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 创建激励视频广告
            const rewardedVideoAd = plus.ad.createRewardedVideoAd(styles);
            const adId = 'rewarded_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // 存储激励视频广告
            this.rewardedVideoAds.set(adId, rewardedVideoAd);

            // 添加包装方法
            this.wrapRewardedVideoAd(rewardedVideoAd, adId);

            return rewardedVideoAd;

        } catch (error) {
            throw error;
        }
    }

    /**
     * 获取信息流广告数据
     * @param {AdsOptions} options - 获取信息流广告的参数
     * @param {GetAdsSuccessCallback} successCB - 成功回调函数
     * @param {AdErrorCallback} [errorCB] - 错误回调函数
     * @returns {Promise<AdData[]>|void} 信息流广告数据数组
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const ads = await ad.getAds({
     *     count: 3,
     *     width: '300px',
     *     height: '250px'
     *   });
     *   console.log('获取到', ads.length, '条广告');
     * } catch (error) {
     *   console.error('获取广告失败:', error);
     * }
     * ```
     */
    getAds(options, successCB, errorCB) {
        // 如果只传入了options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('options参数不能为空'));
            });
        }

        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.getAds(options, resolve, reject);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 调用原生API
            plus.ad.getAds(options, successCB, errorCB || null);

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
    }

    /**
     * 释放广告数据
     * @param {AdData} adData - 需要释放的广告数据
     * @throws {Error} 如果释放失败
     *
     * @example
     * ```javascript
     * try {
     *   ad.releaseAdData(adData);
     *   console.log('广告数据已释放');
     * } catch (error) {
     *   console.error('释放广告数据失败:', error);
     * }
     * ```
     */
    releaseAdData(adData) {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 检查广告数据
            if (!adData) {
                throw new Error('adData参数不能为空');
            }

            // 调用原生API
            plus.ad.releaseAdData(adData);

        } catch (error) {
            throw error;
        }
    }

    /**
     * 显示内容联盟页面
     * @param {ContentOptions} options - 内容联盟参数
     * @param {AdSuccessCallback} successCB - 成功回调函数
     * @param {AdErrorCallback} [errorCB] - 错误回调函数
     * @returns {Promise<void>|void}
     * @throws {Error} 如果显示失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await ad.showContentPage({
     *     category: 'news',
     *     keywords: '科技',
     *     count: 5
     *   });
     *   console.log('内容联盟页面显示成功');
     * } catch (error) {
     *   console.error('显示内容联盟页面失败:', error);
     * }
     * ```
     */
    showContentPage(options, successCB, errorCB) {
        // 如果只传入了options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('options参数不能为空'));
            });
        }

        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.showContentPage(options, resolve, reject);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 调用原生API
            plus.ad.showContentPage(options, successCB, errorCB || null);

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
    }

    /**
     * 设置是否开启个性化推荐广告
     * @param {boolean} enable - 是否开启个性化推荐广告
     * @returns {Promise<void>|void}
     * @throws {Error} 如果设置失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await ad.setPersonalizedAd(true);
     *   console.log('个性化推荐广告已开启');
     * } catch (error) {
     *   console.error('设置个性化推荐广告失败:', error);
     * }
     * ```
     */
    setPersonalizedAd(enable) {
        // 如果没有传入enable，支持Promise方式
        if (typeof enable === 'undefined') {
            return new Promise((resolve, reject) => {
                reject(new Error('enable参数不能为空'));
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 调用原生API
            plus.ad.setPersonalizedAd(enable);

        } catch (error) {
            throw error;
        }
    }

    /**
     * 获取是否开启个性化推荐广告
     * @returns {Promise<boolean>|boolean} 是否开启个性化推荐广告
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const isPersonalized = await ad.getPersonalizedAd();
     *   console.log('个性化推荐广告状态:', isPersonalized);
     * } catch (error) {
     *   console.error('获取个性化推荐状态失败:', error);
     * }
     * ```
     */
    getPersonalizedAd() {
        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查广告模块是否可用
            if (!plus.ad) {
                throw new Error('设备不支持广告模块');
            }

            // 调用原生API
            return plus.ad.getPersonalizedAd();

        } catch (error) {
            throw error;
        }
    }

    /**
     * 判断设备是否支持广告功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await ad.isSupported();
     * if (isSupported) {
     *   console.log('设备支持广告功能');
     * } else {
     *   console.log('设备不支持广告功能');
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

                resolve(!!plus.ad);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 包装广告控件对象，添加额外功能
     * @param {Object} adView - 广告控件对象
     * @param {string} adId - 广告ID
     */
    wrapAdView(adView, adId) {
        const originalMethods = {
            renderingBind: adView.renderingBind,
            setRenderingListener: adView.setRenderingListener,
            setDislikeListener: adView.setDislikeListener,
            setAdClickedListener: adView.setAdClickedListener
        };

        // 保持原有方法
        adView.renderingBind = originalMethods.renderingBind;
        adView.setRenderingListener = originalMethods.setRenderingListener;
        adView.setDislikeListener = originalMethods.setDislikeListener;
        adView.setAdClickedListener = originalMethods.setAdClickedListener;

        // 添加Promise支持
        adView.renderingBindPromise = function(adData) {
            return new Promise((resolve, reject) => {
                try {
                    originalMethods.renderingBind.call(adView, adData);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加销毁方法
        adView.destroy = function() {
            try {
                // 从存储中移除
                if (this.adViews.has(adId)) {
                    this.adViews.delete(adId);
                }
                // 调用原生销毁方法（如果存在）
                if (typeof adView.close === 'function') {
                    adView.close();
                }
            } catch (error) {
                console.error('销毁广告控件失败:', error);
            }
        }.bind(this);
    }

    /**
     * 包装插屏广告对象，添加额外功能
     * @param {Object} interstitialAd - 插屏广告对象
     * @param {string} adId - 广告ID
     */
    wrapInterstitialAd(interstitialAd, adId) {
        // 添加销毁方法
        interstitialAd.destroy = function() {
            try {
                // 从存储中移除
                if (this.interstitialAds.has(adId)) {
                    this.interstitialAds.delete(adId);
                }
                // 调用原生销毁方法
                if (typeof interstitialAd.destroy === 'function') {
                    interstitialAd.destroy();
                }
            } catch (error) {
                console.error('销毁插屏广告失败:', error);
            }
        }.bind(this);
    }

    /**
     * 包装全屏视频广告对象，添加额外功能
     * @param {Object} fullScreenVideoAd - 全屏视频广告对象
     * @param {string} adId - 广告ID
     */
    wrapFullScreenVideoAd(fullScreenVideoAd, adId) {
        // 添加销毁方法
        fullScreenVideoAd.destroy = function() {
            try {
                // 从存储中移除
                if (this.fullScreenVideoAds.has(adId)) {
                    this.fullScreenVideoAds.delete(adId);
                }
                // 调用原生销毁方法
                if (typeof fullScreenVideoAd.destroy === 'function') {
                    fullScreenVideoAd.destroy();
                }
            } catch (error) {
                console.error('销毁全屏视频广告失败:', error);
            }
        }.bind(this);
    }

    /**
     * 包装激励视频广告对象，添加额外功能
     * @param {Object} rewardedVideoAd - 激励视频广告对象
     * @param {string} adId - 广告ID
     */
    wrapRewardedVideoAd(rewardedVideoAd, adId) {
        // 添加销毁方法
        rewardedVideoAd.destroy = function() {
            try {
                // 从存储中移除
                if (this.rewardedVideoAds.has(adId)) {
                    this.rewardedVideoAds.delete(adId);
                }
                // 调用原生销毁方法
                if (typeof rewardedVideoAd.destroy === 'function') {
                    rewardedVideoAd.destroy();
                }
            } catch (error) {
                console.error('销毁激励视频广告失败:', error);
            }
        }.bind(this);
    }
}

// 创建Ad模块实例
const ad = new AdModule();

// 导出模块
export default ad;

// 也可以导出类以便创建多个实例
export { AdModule };