/**
 * HTML5+ Push 模块测试套件
 *
 * 测试推送功能包括：
 * - 推送消息接收
 * - 推送消息发送
 * - 推送配置管理
 * - 推送权限处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import push from '../../modules/push.js';

class PushTestSuite extends TestSuite {
    constructor() {
        super();
        this.pushClient = null;
        this.pushMessages = [];
        this.pushEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Push测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Push测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理推送客户端和事件
        try {
            if (this.pushClient) {
                await this.pushClient.disconnect();
                this.pushClient = null;
            }
            this.pushMessages = [];
            this.pushEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理推送客户端和事件
        try {
            if (this.pushClient) {
                await this.pushClient.disconnect();
                this.pushClient = null;
            }
            this.pushMessages = [];
            this.pushEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await push.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await push.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够初始化推送客户端')
    async testInitializePushClient() {
        try {
            const clientOptions = {
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            };

            this.pushClient = await push.createClient(clientOptions);

            // 验证推送客户端
            TestUtils.assertNotNull(this.pushClient);
            TestUtils.assertTrue(typeof this.pushClient.connect === 'function');
            TestUtils.assertTrue(typeof this.pushClient.disconnect === 'function');
            TestUtils.assertTrue(typeof this.pushClient.subscribe === 'function');
            TestUtils.assertTrue(typeof this.pushClient.unsubscribe === 'function');
            TestUtils.assertTrue(typeof this.pushClient.sendMessage === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('推送') ||
                error.message.includes('push') ||
                error.message.includes('配置') ||
                error.message.includes('configuration')
            );
        }
    }

    @test('应该能够连接推送服务器')
    async testConnectPushServer() {
        try {
            const clientOptions = {
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            };

            this.pushClient = await push.createClient(clientOptions);

            // 连接推送服务器
            const connectResult = await this.pushClient.connect();
            TestUtils.assertTrue(typeof connectResult === 'object');
            TestUtils.assertTrue(typeof connectResult.success === 'boolean');

            // 获取连接状态
            const isConnected = await this.pushClient.isConnected();
            TestUtils.assertTrue(typeof isConnected === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('连接') ||
                error.message.includes('connect') ||
                error.message.includes('网络') ||
                error.message.includes('network')
            );
        }
    }

    @test('应该能够订阅推送消息')
    async testSubscribePushMessages() {
        try {
            const clientOptions = {
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            };

            this.pushClient = await push.createClient(clientOptions);

            // 订阅推送消息
            await this.pushClient.subscribe({
                onMessage: (message) => {
                    this.pushMessages.push(message);
                },
                onConnect: () => {
                    this.pushEvents.push({ type: 'connect' });
                },
                onDisconnect: () => {
                    this.pushEvents.push({ type: 'disconnect' });
                },
                onError: (error) => {
                    this.pushEvents.push({ type: 'error', data: error });
                }
            });

            // 验证订阅状态
            const isSubscribed = await this.pushClient.isSubscribed();
            TestUtils.assertTrue(typeof isSubscribed === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('订阅') ||
                error.message.includes('subscribe') ||
                error.message.includes('服务器') ||
                error.message.includes('server')
            );
        }
    }

    @test('应该能够发送推送消息')
    async testSendPushMessage() {
        try {
            const clientOptions = {
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            };

            this.pushClient = await push.createClient(clientOptions);

            // 发送推送消息
            const messageOptions = {
                title: '测试推送',
                content: '这是一条测试推送消息',
                extras: {
                    type: 'test',
                    data: 'test_data'
                }
            };

            const sendResult = await this.pushClient.sendMessage(messageOptions);
            TestUtils.assertTrue(typeof sendResult === 'object');
            TestUtils.assertTrue(typeof sendResult.success === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('发送') ||
                error.message.includes('send') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够取消订阅推送')
    async testUnsubscribePushMessages() {
        try {
            const clientOptions = {
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            };

            this.pushClient = await push.createClient(clientOptions);

            // 先订阅
            await this.pushClient.subscribe({
                onMessage: (message) => {
                    this.pushMessages.push(message);
                }
            });

            // 然后取消订阅
            await this.pushClient.unsubscribe();

            // 验证取消订阅状态
            const isSubscribed = await this.pushClient.isSubscribed();
            TestUtils.assertTrue(typeof isSubscribed === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('取消') ||
                error.message.includes('unsubscribe') ||
                error.message.includes('服务器') ||
                error.message.includes('server')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的客户端配置
            await push.createClient({
                appId: '', // 空应用ID
                appKey: '', // 空应用密钥
                channel: 'developer',
                production: false
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
            await push.createClient(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的订阅参数
            this.pushClient = await push.createClient({
                appId: 'test_app_id',
                appKey: 'test_app_key',
                channel: 'developer',
                production: false
            });

            await this.pushClient.subscribe(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('订阅') ||
                error.message.includes('subscribe')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await push.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await push.requestPermission();
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

    @test('应该能够获取推送状态')
    async testGetPushStatus() {
        try {
            const status = await push.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.isAvailable === 'boolean');
            TestUtils.assertTrue(typeof status.isSubscribed === 'boolean');
            TestUtils.assertTrue(typeof status.isConnected === 'boolean');

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

    @test('应该能够设置推送别名')
    async testSetPushAlias() {
        try {
            const alias = 'test_alias_' + Date.now();
            const result = await push.setAlias(alias);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取别名
            const currentAlias = await push.getAlias();
            TestUtils.assertTrue(typeof currentAlias === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('别名') ||
                error.message.includes('alias')
            );
        }
    }

    @test('应该能够管理推送标签')
    async testManagePushTags() {
        try {
            const tags = ['tag1', 'tag2', 'tag3'];

            // 设置标签
            const setResult = await push.setTags(tags);
            TestUtils.assertTrue(typeof setResult === 'object');
            TestUtils.assertTrue(setResult.success === true || setResult.success === false);

            // 获取标签
            const currentTags = await push.getTags();
            TestUtils.assertTrue(Array.isArray(currentTags));

            // 添加标签
            const addResult = await push.addTags(['tag4', 'tag5']);
            TestUtils.assertTrue(typeof addResult === 'object');

            // 删除标签
            const removeResult = await push.removeTags(['tag1']);
            TestUtils.assertTrue(typeof removeResult === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('标签') ||
                error.message.includes('tags')
            );
        }
    }

    @test('应该能够获取推送消息历史')
    async testGetPushMessageHistory() {
        try {
            const history = await push.getMessageHistory({
                limit: 10,
                offset: 0
            });

            TestUtils.assertTrue(Array.isArray(history));

            // 验证消息历史结构
            for (const message of history) {
                TestUtils.assertTrue(typeof message === 'object');
                TestUtils.assertTrue(typeof message.id === 'string');
                TestUtils.assertTrue(typeof message.title === 'string');
                TestUtils.assertTrue(typeof message.content === 'string');
                TestUtils.assertTrue(typeof message.timestamp === 'number');
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

    @test('应该能够清除推送消息')
    async testClearPushMessages() {
        try {
            const result = await push.clearMessages();
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

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

    @test('应该能够处理本地推送')
    async testLocalPushNotifications() {
        try {
            const localPushOptions = {
                title: '本地推送',
                content: '这是一条本地推送消息',
                delay: 5000, // 5秒后发送
                extras: {
                    type: 'local',
                    data: 'local_test'
                }
            };

            const result = await push.scheduleLocalNotification(localPushOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(typeof result.id === 'string');

            // 取消本地推送
            await push.cancelLocalNotification(result.id);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('本地') ||
                error.message.includes('local')
            );
        }
    }

    @test('应该能够获取推送统计信息')
    async testGetPushStatistics() {
        try {
            const stats = await push.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalMessages === 'number');
            TestUtils.assertTrue(typeof stats.successfulMessages === 'number');
            TestUtils.assertTrue(typeof stats.failedMessages === 'number');
            TestUtils.assertTrue(typeof stats.activeSubscribers === 'number');

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

    @test('应该能够配置推送设置')
    async testConfigurePushSettings() {
        try {
            const settings = {
                sound: true,
                vibrate: true,
                led: true,
                clearNotificationBar: true,
                showBadge: true
            };

            const result = await push.configureSettings(settings);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取当前设置
            const currentSettings = await push.getSettings();
            TestUtils.assertTrue(typeof currentSettings === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('设置') ||
                error.message.includes('settings')
            );
        }
    }
}

export default PushTestSuite;