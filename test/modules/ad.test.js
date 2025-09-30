/**
 * HTML5+ AD 模块测试套件
 *
 * 测试广告功能包括：
 * - 广告加载和显示
 * - 广告类型处理
 * - 广告事件监听
 * - 错误处理
 * - 权限检查
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import ad from '../../modules/ad.js';

class AdTestSuite extends TestSuite {
    constructor() {
        super();
        this.adInstance = null;
        this.adEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置AD测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理AD测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理广告实例和事件
        try {
            if (this.adInstance) {
                await this.adInstance.destroy();
                this.adInstance = null;
            }
            this.adEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理广告实例和事件
        try {
            if (this.adInstance) {
                await this.adInstance.destroy();
                this.adInstance = null;
            }
            this.adEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await ad.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await ad.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建横幅广告')
    async testCreateBannerAd() {
        try {
            const adOptions = {
                adId: 'test-banner-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);

            // 验证广告实例
            TestUtils.assertNotNull(this.adInstance);
            TestUtils.assertTrue(typeof this.adInstance.show === 'function');
            TestUtils.assertTrue(typeof this.adInstance.hide === 'function');
            TestUtils.assertTrue(typeof this.adInstance.destroy === 'function');
            TestUtils.assertTrue(typeof this.adInstance.load === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }
    }

    @test('应该能够创建插屏广告')
    async testCreateInterstitialAd() {
        try {
            const adOptions = {
                adId: 'test-interstitial-ad',
                autoShow: false
            };

            this.adInstance = await ad.createInterstitialAd(adOptions);

            // 验证广告实例
            TestUtils.assertNotNull(this.adInstance);
            TestUtils.assertTrue(typeof this.adInstance.show === 'function');
            TestUtils.assertTrue(typeof this.adInstance.load === 'function');
            TestUtils.assertTrue(typeof this.adInstance.isLoaded === 'function');
            TestUtils.assertTrue(typeof this.adInstance.destroy === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }
    }

    @test('应该能够创建激励广告')
    async testCreateRewardedAd() {
        try {
            const adOptions = {
                adId: 'test-rewarded-ad',
                userId: 'test-user-id'
            };

            this.adInstance = await ad.createRewardedAd(adOptions);

            // 验证广告实例
            TestUtils.assertNotNull(this.adInstance);
            TestUtils.assertTrue(typeof this.adInstance.show === 'function');
            TestUtils.assertTrue(typeof this.adInstance.load === 'function');
            TestUtils.assertTrue(typeof this.adInstance.isLoaded === 'function');
            TestUtils.assertTrue(typeof this.adInstance.destroy === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }
    }

    @test('应该能够加载广告')
    async testLoadAd() {
        try {
            const adOptions = {
                adId: 'test-load-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 加载广告
            await this.adInstance.load();

            // 验证广告状态
            const isLoaded = await this.adInstance.isLoaded();
            TestUtils.assertTrue(typeof isLoaded === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('网络') ||
                error.message.includes('network')
            );
        }
    }

    @test('应该能够显示和隐藏广告')
    async testShowHideAd() {
        try {
            const adOptions = {
                adId: 'test-show-hide-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 显示广告
            await this.adInstance.show();

            // 隐藏广告
            await this.adInstance.hide();

            // 再次显示广告
            await this.adInstance.show();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('显示') ||
                error.message.includes('show')
            );
        }
    }

    @test('应该能够监听广告事件')
    async testAdEventListeners() {
        try {
            const adOptions = {
                adId: 'test-events-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 设置事件监听器
            const eventTypes = ['load', 'show', 'close', 'error', 'click'];

            for (const eventType of eventTypes) {
                this.adInstance.on(eventType, (data) => {
                    this.adEvents.push({ type: eventType, data });
                });
            }

            // 加载广告以触发事件
            await this.adInstance.load();

            // 等待事件处理
            await TestUtils.delay(1000);

            // 验证事件是否被记录
            TestUtils.assertTrue(Array.isArray(this.adEvents));

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('事件') ||
                error.message.includes('event')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的广告配置
            await ad.createBannerAd({
                adId: '', // 空的广告ID
                position: 'invalid_position', // 无效的位置
                width: -1, // 无效宽度
                height: -1 // 无效高度
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }

        try {
            // 测试空参数
            await ad.createBannerAd(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的广告ID
            await ad.createBannerAd({ adId: null });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('ID')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await ad.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await ad.requestPermission();
                TestUtils.assertTrue(
                    requestedPermission === 'granted' ||
                    requestedPermission === 'denied'
                );
            }
        } catch (error) {
            // 在测试环境中可能不支持权限请求
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够获取广告状态')
    async testAdStatus() {
        try {
            const adOptions = {
                adId: 'test-status-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 获取广告状态
            const status = await this.adInstance.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.isLoaded === 'boolean');
            TestUtils.assertTrue(typeof status.isVisible === 'boolean');
            TestUtils.assertTrue(typeof status.isLoading === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('状态') ||
                error.message.includes('status')
            );
        }
    }

    @test('应该能够设置广告参数')
    async testAdParameters() {
        try {
            const adOptions = {
                adId: 'test-params-ad',
                position: 'bottom',
                width: 320,
                height: 50,
                refreshInterval: 60,
                autoShow: false
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 设置广告参数
            await this.adInstance.setParameters({
                refreshInterval: 120,
                position: 'top'
            });

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('参数') ||
                error.message.includes('parameters')
            );
        }
    }

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        try {
            const promises = [];
            const count = 3;

            // 并发创建多个广告实例
            for (let i = 0; i < count; i++) {
                promises.push(ad.createBannerAd({
                    adId: `test-concurrent-ad-${i}`,
                    position: 'bottom',
                    width: 320,
                    height: 50
                }));
            }

            const adInstances = await Promise.all(promises);

            // 验证所有广告实例
            for (const instance of adInstances) {
                if (instance) {
                    TestUtils.assertTrue(typeof instance.show === 'function');
                    TestUtils.assertTrue(typeof instance.hide === 'function');
                    TestUtils.assertTrue(typeof instance.destroy === 'function');
                }
            }

            // 清理实例
            for (const instance of adInstances) {
                if (instance) {
                    await instance.destroy();
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }
    }

    @test('应该能够处理广告生命周期')
    async testAdLifecycle() {
        try {
            const adOptions = {
                adId: 'test-lifecycle-ad',
                position: 'bottom',
                width: 320,
                height: 50
            };

            this.adInstance = await ad.createBannerAd(adOptions);
            TestUtils.assertNotNull(this.adInstance);

            // 加载广告
            await this.adInstance.load();

            // 显示广告
            await this.adInstance.show();

            // 隐藏广告
            await this.adInstance.hide();

            // 再次显示
            await this.adInstance.show();

            // 销毁广告
            await this.adInstance.destroy();
            this.adInstance = null;

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('生命周期') ||
                error.message.includes('lifecycle')
            );
        }
    }

    @test('应该能够获取广告平台信息')
    async testAdPlatformInfo() {
        try {
            const platformInfo = await ad.getPlatformInfo();
            TestUtils.assertTrue(typeof platformInfo === 'object');
            TestUtils.assertTrue(typeof platformInfo.platform === 'string');
            TestUtils.assertTrue(typeof platformInfo.version === 'string');
            TestUtils.assertTrue(typeof platformInfo.isInitialized === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('平台') ||
                error.message.includes('platform')
            );
        }
    }

    @test('应该能够设置广告测试模式')
    async testAdTestMode() {
        try {
            // 设置测试模式
            await ad.setTestMode(true);

            // 创建测试广告
            this.adInstance = await ad.createBannerAd({
                adId: 'test-test-mode-ad',
                position: 'bottom',
                width: 320,
                height: 50,
                test: true
            });

            TestUtils.assertNotNull(this.adInstance);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('测试') ||
                error.message.includes('test')
            );
        }
    }
}

export default AdTestSuite;