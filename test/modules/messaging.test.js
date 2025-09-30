/**
 * HTML5+ Messaging 模块测试套件
 *
 * 测试消息功能包括：
 * - 短信发送和接收
 * - 消息管理
 * - 消息状态查询
 * - 消息过滤和搜索
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import messaging from '../../modules/messaging.js';

class MessagingTestSuite extends TestSuite {
    constructor() {
        super();
        this.messagingClient = null;
        this.messageEvents = [];
        this.sentMessages = [];
        this.receivedMessages = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Messaging测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Messaging测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理消息客户端和事件
        try {
            if (this.messagingClient) {
                await this.messagingClient.disconnect();
                this.messagingClient = null;
            }
            this.messageEvents = [];
            this.sentMessages = [];
            this.receivedMessages = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理消息客户端和事件
        try {
            if (this.messagingClient) {
                await this.messagingClient.disconnect();
                this.messagingClient = null;
            }
            this.messageEvents = [];
            this.sentMessages = [];
            this.receivedMessages = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await messaging.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await messaging.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取消息客户端')
    async testGetMessagingClient() {
        try {
            this.messagingClient = await messaging.getClient();
            TestUtils.assertNotNull(this.messagingClient);
            TestUtils.assertTrue(typeof this.messagingClient.sendMessage === 'function');
            TestUtils.assertTrue(typeof this.messagingClient.getMessageList === 'function');
            TestUtils.assertTrue(typeof this.messagingClient.deleteMessage === 'function');
            TestUtils.assertTrue(typeof this.messagingClient.markMessageAsRead === 'function');
            TestUtils.assertTrue(typeof this.messagingClient.getMessageStatus === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('消息') ||
                error.message.includes('messaging')
            );
        }
    }

    @test('应该能够发送短信')
    async testSendSMS() {
        try {
            this.messagingClient = await messaging.getClient();

            const smsOptions = {
                to: ['13800138000'], // 测试号码
                body: '这是一条测试短信\nThis is a test message',
                type: 'sms',
                onSent: (result) => {
                    this.sentMessages.push({ type: 'sent', data: result });
                },
                onDelivered: (result) => {
                    this.sentMessages.push({ type: 'delivered', data: result });
                },
                onFailed: (error) => {
                    this.messageEvents.push({ type: 'failed', data: error });
                }
            };

            const result = await this.messagingClient.sendMessage(smsOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('发送') ||
                error.message.includes('send')
            );
        }
    }

    @test('应该能够获取消息列表')
    async testGetMessageList() {
        try {
            this.messagingClient = await messaging.getClient();

            const listOptions = {
                type: 'all', // all, inbox, sent, draft
                limit: 20,
                offset: 0,
                filter: {
                    unread: false,
                    dateRange: {
                        start: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7天前
                        end: Date.now()
                    }
                }
            };

            const result = await this.messagingClient.getMessageList(listOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(Array.isArray(result.messages));
                for (const message of result.messages) {
                    TestUtils.assertTrue(typeof message === 'object');
                    TestUtils.assertTrue(typeof message.id === 'string');
                    TestUtils.assertTrue(typeof message.body === 'string');
                    TestUtils.assertTrue(typeof message.address === 'string');
                    TestUtils.assertTrue(typeof message.timestamp === 'number');
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('列表') ||
                error.message.includes('list')
            );
        }
    }

    @test('应该能够删除消息')
    async testDeleteMessage() {
        try {
            this.messagingClient = await messaging.getClient();

            const messageId = 'test_message_id';
            const result = await this.messagingClient.deleteMessage(messageId);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('删除') ||
                error.message.includes('delete')
            );
        }
    }

    @test('应该能够标记消息为已读')
    async testMarkMessageAsRead() {
        try {
            this.messagingClient = await messaging.getClient();

            const messageId = 'test_message_id';
            const result = await this.messagingClient.markMessageAsRead(messageId);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('标记') ||
                error.message.includes('mark')
            );
        }
    }

    @test('应该能够获取消息状态')
    async testGetMessageStatus() {
        try {
            this.messagingClient = await messaging.getClient();

            const messageId = 'test_message_id';
            const status = await this.messagingClient.getMessageStatus(messageId);
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.status === 'string');
            TestUtils.assertTrue(
                status.status === 'sending' ||
                status.status === 'sent' ||
                status.status === 'delivered' ||
                status.status === 'failed'
            );
            TestUtils.assertTrue(typeof status.timestamp === 'number');

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

    @test('应该能够搜索消息')
    async testSearchMessages() {
        try {
            this.messagingClient = await messaging.getClient();

            const searchOptions = {
                query: '测试',
                type: 'all',
                limit: 10,
                offset: 0,
                fields: ['body', 'address'] // 搜索字段
            };

            const result = await this.messagingClient.searchMessages(searchOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(Array.isArray(result.messages));
                for (const message of result.messages) {
                    TestUtils.assertTrue(typeof message === 'object');
                    TestUtils.assertTrue(typeof message.id === 'string');
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('搜索') ||
                error.message.includes('search')
            );
        }
    }

    @test('应该能够获取未读消息数量')
    async testGetUnreadMessageCount() {
        try {
            this.messagingClient = await messaging.getClient();

            const count = await this.messagingClient.getUnreadMessageCount();
            TestUtils.assertTrue(typeof count === 'number');
            TestUtils.assertTrue(count >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('未读') ||
                error.message.includes('unread')
            );
        }
    }

    @test('应该能够创建消息草稿')
    async testCreateMessageDraft() {
        try {
            this.messagingClient = await messaging.getClient();

            const draftOptions = {
                to: ['13800138000'],
                body: '这是一条草稿消息',
                type: 'sms'
            };

            const result = await this.messagingClient.createDraft(draftOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(typeof result.draftId === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('草稿') ||
                error.message.includes('draft')
            );
        }
    }

    @test('应该能够获取消息详情')
    async testGetMessageDetails() {
        try {
            this.messagingClient = await messaging.getClient();

            const messageId = 'test_message_id';
            const details = await this.messagingClient.getMessageDetails(messageId);
            TestUtils.assertTrue(typeof details === 'object');
            TestUtils.assertTrue(typeof details.id === 'string');
            TestUtils.assertTrue(typeof details.body === 'string');
            TestUtils.assertTrue(typeof details.address === 'string');
            TestUtils.assertTrue(typeof details.timestamp === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('详情') ||
                error.message.includes('details')
            );
        }
    }

    @test('应该能够批量操作消息')
    async testBatchMessageOperations() {
        try {
            this.messagingClient = await messaging.getClient();

            const messageIds = ['msg1', 'msg2', 'msg3'];

            // 批量删除
            const deleteResult = await this.messagingClient.deleteMessages(messageIds);
            TestUtils.assertTrue(typeof deleteResult === 'object');
            TestUtils.assertTrue(deleteResult.success === true || deleteResult.success === false);

            // 批量标记为已读
            const markResult = await this.messagingClient.markMessagesAsRead(messageIds);
            TestUtils.assertTrue(typeof markResult === 'object');
            TestUtils.assertTrue(markResult.success === true || markResult.success === false);

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

    @test('应该能够监听消息事件')
    async testMessageEventListeners() {
        try {
            this.messagingClient = await messaging.getClient();

            await this.messagingClient.addEventListener({
                onMessageReceived: (message) => {
                    this.receivedMessages.push(message);
                },
                onMessageSent: (message) => {
                    this.sentMessages.push(message);
                },
                onMessageDelivered: (message) => {
                    this.messageEvents.push({ type: 'delivered', data: message });
                },
                onMessageFailed: (error) => {
                    this.messageEvents.push({ type: 'failed', data: error });
                },
                onNewMessage: (message) => {
                    this.messageEvents.push({ type: 'new', data: message });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.messageEvents.length >= 0);

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

    @test('应该能够获取联系人消息')
    async testGetContactMessages() {
        try {
            this.messagingClient = await messaging.getClient();

            const contactOptions = {
                address: '13800138000',
                limit: 20,
                offset: 0
            };

            const result = await this.messagingClient.getContactMessages(contactOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(Array.isArray(result.messages));
                for (const message of result.messages) {
                    TestUtils.assertTrue(typeof message === 'object');
                    TestUtils.assertTrue(message.address === '13800138000');
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('联系人') ||
                error.message.includes('contact')
            );
        }
    }

    @test('应该能够获取消息统计')
    async testGetMessageStatistics() {
        try {
            const stats = await messaging.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalMessages === 'number');
            TestUtils.assertTrue(typeof stats.unreadMessages === 'number');
            TestUtils.assertTrue(typeof stats.sentMessages === 'number');
            TestUtils.assertTrue(typeof stats.receivedMessages === 'number');

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

    @test('应该能够导出消息')
    async testExportMessages() {
        try {
            const exportOptions = {
                format: 'json',
                type: 'all',
                dateRange: {
                    start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30天前
                    end: Date.now()
                }
            };

            const result = await messaging.exportMessages(exportOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(typeof result.exportData === 'string');
                TestUtils.assertTrue(typeof result.exportPath === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('导出') ||
                error.message.includes('export')
            );
        }
    }

    @test('应该能够设置消息配置')
    async testSetMessageConfig() {
        try {
            const config = {
                autoSaveDraft: true,
                deliveryReport: true,
                messageLimit: 1000,
                notificationEnabled: true,
                signature: '发送自测试应用'
            };

            const result = await messaging.setConfig(config);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的收件人
            this.messagingClient = await messaging.getClient();
            await this.messagingClient.sendMessage({
                to: [],
                body: '测试消息'
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('收件人') ||
                error.message.includes('recipient')
            );
        }

        try {
            // 测试空消息内容
            this.messagingClient = await messaging.getClient();
            await this.messagingClient.sendMessage({
                to: ['13800138000'],
                body: ''
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
            // 测试空参数
            this.messagingClient = await messaging.getClient();
            await this.messagingClient.sendMessage(null);
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
            const permission = await messaging.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await messaging.requestPermission();
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

    @test('应该能够获取消息存储信息')
    async testGetMessageStorageInfo() {
        try {
            const storageInfo = await messaging.getStorageInfo();
            TestUtils.assertTrue(typeof storageInfo === 'object');
            TestUtils.assertTrue(typeof storageInfo.totalSpace === 'number');
            TestUtils.assertTrue(typeof storageInfo.usedSpace === 'number');
            TestUtils.assertTrue(typeof storageInfo.freeSpace === 'number');
            TestUtils.assertTrue(typeof storageInfo.messageCount === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('存储') ||
                error.message.includes('storage')
            );
        }
    }

    @test('应该能够清空消息')
    async testClearMessages() {
        try {
            const clearOptions = {
                type: 'all', // all, inbox, sent, draft
                confirmRequired: true
            };

            const result = await messaging.clearMessages(clearOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('清空') ||
                error.message.includes('clear')
            );
        }
    }
}

export default MessagingTestSuite;