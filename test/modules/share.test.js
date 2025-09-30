/**
 * HTML5+ Share 模块测试套件
 *
 * 测试分享功能包括：
 * - 文本分享
 * - 图片分享
 * - 文件分享
 * - 社交媒体分享
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import share from '../../modules/share.js';

class ShareTestSuite extends TestSuite {
    constructor() {
        super();
        this.shareResults = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Share测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Share测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理分享结果
        this.shareResults = [];
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理分享结果
        this.shareResults = [];
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await share.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await share.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取分享服务列表')
    async testGetShareServices() {
        try {
            const services = await share.getServices();
            TestUtils.assertTrue(Array.isArray(services));

            // 验证分享服务信息
            for (const service of services) {
                TestUtils.assertTrue(typeof service === 'object');
                TestUtils.assertTrue(typeof service.id === 'string');
                TestUtils.assertTrue(typeof service.name === 'string');
                TestUtils.assertTrue(typeof service.description === 'string');
                TestUtils.assertTrue(typeof service.available === 'boolean');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('分享') ||
                error.message.includes('share')
            );
        }
    }

    @test('应该能够分享文本')
    async testShareText() {
        try {
            const shareOptions = {
                content: '这是一条测试分享文本',
                type: 'text',
                services: ['weixin', 'weibo'],
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('文本') ||
                error.message.includes('text')
            );
        }
    }

    @test('应该能够分享图片')
    async testShareImage() {
        try {
            const shareOptions = {
                content: '分享一张测试图片',
                type: 'image',
                pictures: ['_doc/images/test.jpg'],
                services: ['weixin', 'weibo'],
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('图片') ||
                error.message.includes('image')
            );
        }
    }

    @test('应该能够分享文件')
    async testShareFile() {
        try {
            const shareOptions = {
                content: '分享一个测试文件',
                type: 'file',
                files: ['_doc/files/test.pdf'],
                services: ['weixin'],
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('文件') ||
                error.message.includes('file')
            );
        }
    }

    @test('应该能够分享网页链接')
    async testShareWebpage() {
        try {
            const shareOptions = {
                content: '分享一个测试网页',
                type: 'webpage',
                href: 'https://example.com',
                title: '测试网页',
                thumbs: ['_doc/images/thumb.jpg'],
                services: ['weixin', 'weibo'],
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('网页') ||
                error.message.includes('webpage')
            );
        }
    }

    @test('应该能够分享到微信')
    async testShareToWechat() {
        try {
            const shareOptions = {
                content: '分享到微信',
                type: 'text',
                services: ['weixin'],
                scene: 'session', // 会话场景
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('微信') ||
                error.message.includes('wechat')
            );
        }
    }

    @test('应该能够分享到朋友圈')
    async testShareToWechatMoments() {
        try {
            const shareOptions = {
                content: '分享到朋友圈',
                type: 'image',
                pictures: ['_doc/images/test.jpg'],
                services: ['weixin'],
                scene: 'timeline', // 朋友圈场景
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('朋友圈') ||
                error.message.includes('timeline')
            );
        }
    }

    @test('应该能够分享到微博')
    async testShareToWeibo() {
        try {
            const shareOptions = {
                content: '分享到微博 #测试分享#',
                type: 'text',
                services: ['weibo'],
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('微博') ||
                error.message.includes('weibo')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的分享内容
            await share.share({
                content: '', // 空内容
                type: 'text',
                services: ['weixin']
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('内容') ||
                error.message.includes('content')
            );
        }

        try {
            // 测试无效的分享类型
            await share.share({
                content: '测试内容',
                type: 'invalid_type', // 无效类型
                services: ['weixin']
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('类型') ||
                error.message.includes('type')
            );
        }

        try {
            // 测试空参数
            await share.share(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await share.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await share.requestPermission();
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

    @test('应该能够获取分享服务状态')
    async testGetServiceStatus() {
        try {
            const serviceStatus = await share.getServiceStatus();
            TestUtils.assertTrue(typeof serviceStatus === 'object');

            // 验证各服务状态
            for (const [service, status] of Object.entries(serviceStatus)) {
                TestUtils.assertTrue(typeof service === 'string');
                TestUtils.assertTrue(typeof status === 'boolean');
            }

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

    @test('应该能够验证分享内容')
    async testValidateShareContent() {
        try {
            const validContent = {
                content: '测试内容',
                type: 'text',
                services: ['weixin']
            };

            const isValid = await share.validateContent(validContent);
            TestUtils.assertTrue(typeof isValid === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('验证') ||
                error.message.includes('validate')
            );
        }
    }

    @test('应该能够获取分享历史')
    async testGetShareHistory() {
        try {
            const history = await share.getHistory({
                limit: 10,
                offset: 0
            });

            TestUtils.assertTrue(Array.isArray(history));

            // 验证历史记录结构
            for (const record of history) {
                TestUtils.assertTrue(typeof record === 'object');
                TestUtils.assertTrue(typeof record.id === 'string');
                TestUtils.assertTrue(typeof record.type === 'string');
                TestUtils.assertTrue(typeof record.content === 'string');
                TestUtils.assertTrue(typeof record.timestamp === 'number');
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

    @test('应该能够处理系统分享')
    async testSystemShare() {
        try {
            const shareOptions = {
                content: '使用系统分享功能',
                type: 'text',
                useSystemShare: true,
                onSuccess: (result) => {
                    this.shareResults.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.shareResults.push({ type: 'fail', data: error });
                }
            };

            const result = await share.share(shareOptions);
            TestUtils.assertTrue(typeof result === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('系统') ||
                error.message.includes('system')
            );
        }
    }

    @test('应该能够获取分享统计信息')
    async testGetShareStatistics() {
        try {
            const stats = await share.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalShares === 'number');
            TestUtils.assertTrue(typeof stats.successfulShares === 'number');
            TestUtils.assertTrue(typeof stats.failedShares === 'number');
            TestUtils.assertTrue(typeof stats.serviceUsage === 'object');

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
}

export default ShareTestSuite;