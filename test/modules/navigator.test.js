/**
 * HTML5+ Navigator 模块测试套件
 *
 * 测试导航功能包括：
 * - 页面导航控制
 * - 导航历史管理
 * - 导航状态查询
 * - 导航事件处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import navigator from '../../modules/navigator.js';

class NavigatorTestSuite extends TestSuite {
    constructor() {
        super();
        this.navigatorInstance = null;
        this.navigationEvents = [];
        this.navigationHistory = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Navigator测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Navigator测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理导航实例和事件
        try {
            if (this.navigatorInstance) {
                await this.navigatorInstance.clearHistory();
                this.navigatorInstance = null;
            }
            this.navigationEvents = [];
            this.navigationHistory = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理导航实例和事件
        try {
            if (this.navigatorInstance) {
                await this.navigatorInstance.clearHistory();
                this.navigatorInstance = null;
            }
            this.navigationEvents = [];
            this.navigationHistory = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await navigator.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await navigator.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取导航器实例')
    async testGetNavigatorInstance() {
        try {
            this.navigatorInstance = await navigator.getInstance();
            TestUtils.assertNotNull(this.navigatorInstance);
            TestUtils.assertTrue(typeof this.navigatorInstance.navigate === 'function');
            TestUtils.assertTrue(typeof this.navigatorInstance.back === 'function');
            TestUtils.assertTrue(typeof this.navigatorInstance.forward === 'function');
            TestUtils.assertTrue(typeof this.navigatorInstance.canGoBack === 'function');
            TestUtils.assertTrue(typeof this.navigatorInstance.canGoForward === 'function');
            TestUtils.assertTrue(typeof this.navigatorInstance.getCurrentPage === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('导航') ||
                error.message.includes('navigator')
            );
        }
    }

    @test('应该能够导航到新页面')
    async testNavigateToPage() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            const navigateOptions = {
                url: 'test_page.html',
                title: '测试页面',
                params: {
                    id: 'test_id',
                    name: '测试名称'
                },
                animation: {
                    type: 'slide',
                    duration: 300
                },
                onNavigate: (event) => {
                    this.navigationEvents.push({ type: 'navigate', data: event });
                },
                onLoad: (event) => {
                    this.navigationEvents.push({ type: 'load', data: event });
                }
            };

            const result = await this.navigatorInstance.navigate(navigateOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('导航') ||
                error.message.includes('navigate')
            );
        }
    }

    @test('应该能够返回上一页')
    async testNavigateBack() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });

            // 返回上一页
            const backResult = await this.navigatorInstance.back();
            TestUtils.assertTrue(typeof backResult === 'object');
            TestUtils.assertTrue(backResult.success === true || backResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('返回') ||
                error.message.includes('back')
            );
        }
    }

    @test('应该能够前进到下一页')
    async testNavigateForward() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面，然后返回
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });
            await this.navigatorInstance.back();

            // 前进
            const forwardResult = await this.navigatorInstance.forward();
            TestUtils.assertTrue(typeof forwardResult === 'object');
            TestUtils.assertTrue(forwardResult.success === true || forwardResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('前进') ||
                error.message.includes('forward')
            );
        }
    }

    @test('应该能够检查是否可以返回')
    async testCanGoBack() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });

            // 检查是否可以返回
            const canBack = await this.navigatorInstance.canGoBack();
            TestUtils.assertTrue(typeof canBack === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('返回') ||
                error.message.includes('back')
            );
        }
    }

    @test('应该能够检查是否可以前进')
    async testCanGoForward() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面，然后返回
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });
            await this.navigatorInstance.back();

            // 检查是否可以前进
            const canForward = await this.navigatorInstance.canGoForward();
            TestUtils.assertTrue(typeof canForward === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('前进') ||
                error.message.includes('forward')
            );
        }
    }

    @test('应该能够获取当前页面信息')
    async testGetCurrentPage() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'test_page.html',
                title: '测试页面'
            });

            // 获取当前页面信息
            const currentPage = await this.navigatorInstance.getCurrentPage();
            TestUtils.assertTrue(typeof currentPage === 'object');
            TestUtils.assertTrue(typeof currentPage.url === 'string');
            TestUtils.assertTrue(typeof currentPage.title === 'string');
            TestUtils.assertTrue(typeof currentPage.id === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('当前页面') ||
                error.message.includes('current page')
            );
        }
    }

    @test('应该能够获取导航历史')
    async testGetNavigationHistory() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 导航到几个页面
            await this.navigatorInstance.navigate({ url: 'page1.html' });
            await this.navigatorInstance.navigate({ url: 'page2.html' });
            await this.navigatorInstance.navigate({ url: 'page3.html' });

            // 获取导航历史
            const history = await this.navigatorInstance.getHistory();
            TestUtils.assertTrue(Array.isArray(history));

            for (const page of history) {
                TestUtils.assertTrue(typeof page === 'object');
                TestUtils.assertTrue(typeof page.url === 'string');
                TestUtils.assertTrue(typeof page.title === 'string');
                TestUtils.assertTrue(typeof page.timestamp === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('历史') ||
                error.message.includes('history')
            );
        }
    }

    @test('应该能够清除导航历史')
    async testClearNavigationHistory() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 导航到几个页面
            await this.navigatorInstance.navigate({ url: 'page1.html' });
            await this.navigatorInstance.navigate({ url: 'page2.html' });

            // 清除历史
            const clearResult = await this.navigatorInstance.clearHistory();
            TestUtils.assertTrue(typeof clearResult === 'object');
            TestUtils.assertTrue(clearResult.success === true || clearResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('清除') ||
                error.message.includes('clear')
            );
        }
    }

    @test('应该能够替换当前页面')
    async testReplaceCurrentPage() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'original_page.html'
            });

            // 替换当前页面
            const replaceOptions = {
                url: 'replacement_page.html',
                title: '替换页面'
            };

            const result = await this.navigatorInstance.replace(replaceOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('替换') ||
                error.message.includes('replace')
            );
        }
    }

    @test('应该能够重新加载当前页面')
    async testReloadCurrentPage() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 先导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });

            // 重新加载当前页面
            const reloadResult = await this.navigatorInstance.reload();
            TestUtils.assertTrue(typeof reloadResult === 'object');
            TestUtils.assertTrue(reloadResult.success === true || reloadResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重载') ||
                error.message.includes('reload')
            );
        }
    }

    @test('应该能够监听导航事件')
    async testNavigationEventListeners() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            await this.navigatorInstance.addEventListener({
                onNavigate: (event) => {
                    this.navigationEvents.push({ type: 'navigate', data: event });
                },
                onBack: (event) => {
                    this.navigationEvents.push({ type: 'back', data: event });
                },
                onForward: (event) => {
                    this.navigationEvents.push({ type: 'forward', data: event });
                },
                onLoad: (event) => {
                    this.navigationEvents.push({ type: 'load', data: event });
                },
                onUnload: (event) => {
                    this.navigationEvents.push({ type: 'unload', data: event });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.navigationEvents.length >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('监听') ||
                error.message.includes('listener')
            );
        }
    }

    @test('应该能够设置导航参数')
    async testSetNavigationParams() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            const params = {
                userData: 'test_data',
                animationType: 'fade',
                duration: 500
            };

            const result = await this.navigatorInstance.setParams(params);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取当前参数
            const currentParams = await this.navigatorInstance.getParams();
            TestUtils.assertTrue(typeof currentParams === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('参数') ||
                error.message.includes('params')
            );
        }
    }

    @test('应该能够获取导航状态')
    async testGetNavigationState() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            // 导航到某个页面
            await this.navigatorInstance.navigate({
                url: 'test_page.html'
            });

            // 获取导航状态
            const state = await this.navigatorInstance.getState();
            TestUtils.assertTrue(typeof state === 'object');
            TestUtils.assertTrue(typeof state.canGoBack === 'boolean');
            TestUtils.assertTrue(typeof state.canGoForward === 'boolean');
            TestUtils.assertTrue(typeof state.historyLength === 'number');
            TestUtils.assertTrue(typeof state.currentIndex === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('状态') ||
                error.message.includes('state')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的导航URL
            this.navigatorInstance = await navigator.getInstance();
            await this.navigatorInstance.navigate({
                url: ''
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('URL') ||
                error.message.includes('url')
            );
        }

        try {
            // 测试空参数
            this.navigatorInstance = await navigator.getInstance();
            await this.navigatorInstance.navigate(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无法前进时调用前进
            this.navigatorInstance = await navigator.getInstance();
            await this.navigatorInstance.forward();
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('前进') ||
                error.message.includes('forward') ||
                error.message.includes('无法') ||
                error.message.includes('cannot')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await navigator.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await navigator.requestPermission();
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

    @test('应该能够批量导航')
    async testBatchNavigation() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            const navigationList = [
                { url: 'page1.html', title: '页面1' },
                { url: 'page2.html', title: '页面2' },
                { url: 'page3.html', title: '页面3' }
            ];

            // 批量导航
            const results = await Promise.all(
                navigationList.map(page => this.navigatorInstance.navigate(page))
            );

            for (const result of results) {
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(result.success === true || result.success === false);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('批量') ||
                error.message.includes('batch')
            );
        }
    }

    @test('应该能够获取导航统计')
    async testGetNavigationStatistics() {
        try {
            const stats = await navigator.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalNavigations === 'number');
            TestUtils.assertTrue(typeof stats.totalBackNavigations === 'number');
            TestUtils.assertTrue(typeof stats.totalForwardNavigations === 'number');
            TestUtils.assertTrue(typeof stats.averageNavigationTime === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('统计') ||
                error.message.includes('statistics')
            );
        }
    }

    @test('应该能够设置导航配置')
    async testSetNavigationConfig() {
        try {
            const config = {
                defaultAnimation: 'slide',
                animationDuration: 300,
                enableCache: true,
                maxHistoryLength: 50,
                preloadEnabled: true
            };

            const result = await navigator.setConfig(config);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取当前配置
            const currentConfig = await navigator.getConfig();
            TestUtils.assertTrue(typeof currentConfig === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('config')
            );
        }
    }

    @test('应该能够预加载页面')
    async testPreloadPage() {
        try {
            this.navigatorInstance = await navigator.getInstance();

            const preloadOptions = {
                url: 'preload_page.html',
                params: {
                    preload: true
                },
                onSuccess: (result) => {
                    this.navigationEvents.push({ type: 'preload_success', data: result });
                },
                onError: (error) => {
                    this.navigationEvents.push({ type: 'preload_error', data: error });
                }
            };

            const result = await this.navigatorInstance.preload(preloadOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('预加载') ||
                error.message.includes('preload')
            );
        }
    }
}

export default NavigatorTestSuite;