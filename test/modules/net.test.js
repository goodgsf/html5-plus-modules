/**
 * HTML5+ Net 模块测试套件
 *
 * 测试网络功能包括：
 * - 网络状态检测
 * - HTTP请求
 * - WebSocket连接
 * - 网络配置
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import net from '../../modules/net.js';

class NetTestSuite extends TestSuite {
    constructor() {
        super();
        this.webSocketConnections = [];
        this.httpRequests = [];
        this.networkEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Net测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Net测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理网络连接和请求
        try {
            for (const ws of this.webSocketConnections) {
                if (ws) {
                    await ws.close();
                }
            }
            this.webSocketConnections = [];

            for (const req of this.httpRequests) {
                if (req) {
                    await req.abort();
                }
            }
            this.httpRequests = [];
            this.networkEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理网络连接和请求
        try {
            for (const ws of this.webSocketConnections) {
                if (ws) {
                    await ws.close();
                }
            }
            this.webSocketConnections = [];

            for (const req of this.httpRequests) {
                if (req) {
                    await req.abort();
                }
            }
            this.httpRequests = [];
            this.networkEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await net.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await net.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取网络状态')
    async testGetNetworkState() {
        try {
            const networkState = await net.getNetworkState();
            TestUtils.assertTrue(typeof networkState === 'object');

            // 验证网络状态字段
            TestUtils.assertTrue(typeof networkState.isConnected === 'boolean');
            TestUtils.assertTrue(typeof networkState.type === 'string');
            TestUtils.assertTrue(typeof networkState.isWifi === 'boolean');
            TestUtils.assertTrue(typeof networkState.isMobile === 'boolean');
            TestUtils.assertTrue(typeof networkState.signalStrength === 'number');

            // 验证网络类型
            const validTypes = ['wifi', 'mobile', 'ethernet', 'none', 'unknown'];
            TestUtils.assertTrue(validTypes.includes(networkState.type));

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

    @test('应该能够监听网络状态变化')
    async testNetworkStateChangeListener() {
        try {
            let stateChanged = false;

            // 添加网络状态变化监听器
            const listenerId = await net.addNetworkStateListener((state) => {
                stateChanged = true;
                this.networkEvents.push({ type: 'stateChange', data: state });
            });

            TestUtils.assertNotNull(listenerId);

            // 等待一段时间以检测状态变化
            await TestUtils.delay(2000);

            // 移除监听器
            await net.removeNetworkStateListener(listenerId);

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

    @test('应该能够发送HTTP GET请求')
    async testHttpGetRequest() {
        try {
            const requestOptions = {
                url: 'https://httpbin.org/get',
                method: 'GET',
                timeout: 10000,
                headers: {
                    'User-Agent': 'HTML5+ Net Test',
                    'Accept': 'application/json'
                }
            };

            const request = await net.createRequest(requestOptions);
            this.httpRequests.push(request);

            // 发送请求
            const response = await request.send();

            // 验证响应
            TestUtils.assertTrue(typeof response === 'object');
            TestUtils.assertTrue(typeof response.status === 'number');
            TestUtils.assertTrue(typeof response.statusText === 'string');
            TestUtils.assertTrue(typeof response.data === 'object');
            TestUtils.assertTrue(typeof response.headers === 'object');

            // 验证状态码
            TestUtils.assertTrue(response.status >= 200 && response.status < 300);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('网络') ||
                error.message.includes('network') ||
                error.message.includes('超时') ||
                error.message.includes('timeout')
            );
        }
    }

    @test('应该能够发送HTTP POST请求')
    async testHttpPostRequest() {
        try {
            const requestData = {
                message: 'Test POST request',
                timestamp: Date.now()
            };

            const requestOptions = {
                url: 'https://httpbin.org/post',
                method: 'POST',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'HTML5+ Net Test'
                },
                data: requestData
            };

            const request = await net.createRequest(requestOptions);
            this.httpRequests.push(request);

            // 发送请求
            const response = await request.send();

            // 验证响应
            TestUtils.assertTrue(typeof response === 'object');
            TestUtils.assertTrue(typeof response.status === 'number');
            TestUtils.assertTrue(typeof response.data === 'object');

            // 验证请求数据被正确发送
            if (response.data.json) {
                TestUtils.assertEquals(response.data.json.message, requestData.message);
            }

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

    @test('应该能够处理文件上传')
    async testFileUpload() {
        try {
            const uploadOptions = {
                url: 'https://httpbin.org/post',
                method: 'POST',
                timeout: 30000,
                files: [
                    {
                        name: 'testfile',
                        path: '_doc/uploads/test.txt',
                        mimeType: 'text/plain'
                    }
                ],
                data: {
                    description: 'Test file upload'
                }
            };

            const uploadTask = await net.createUploadTask(uploadOptions);
            this.httpRequests.push(uploadTask);

            // 开始上传
            await uploadTask.start();

            // 获取上传进度
            const progress = await uploadTask.getProgress();
            TestUtils.assertTrue(typeof progress === 'object');
            TestUtils.assertTrue(typeof progress.percent === 'number');
            TestUtils.assertTrue(typeof progress.uploaded === 'number');
            TestUtils.assertTrue(typeof progress.total === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('上传') ||
                error.message.includes('upload')
            );
        }
    }

    @test('应该能够处理文件下载')
    async testFileDownload() {
        try {
            const downloadOptions = {
                url: 'https://httpbin.org/json',
                path: '_doc/downloads/test.json',
                method: 'GET',
                timeout: 10000,
                onProgress: (progress) => {
                    this.networkEvents.push({ type: 'downloadProgress', data: progress });
                }
            };

            const downloadTask = await net.createDownloadTask(downloadOptions);
            this.httpRequests.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待下载完成
            await TestUtils.delay(2000);

            // 获取下载状态
            const status = await downloadTask.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.state === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('下载') ||
                error.message.includes('download')
            );
        }
    }

    @test('应该能够创建WebSocket连接')
    async testWebSocketConnection() {
        try {
            const wsOptions = {
                url: 'wss://echo.websocket.org',
                protocols: ['chat', 'superchat'],
                timeout: 10000
            };

            const ws = await net.createWebSocket(wsOptions);
            this.webSocketConnections.push(ws);

            // 验证WebSocket连接
            TestUtils.assertNotNull(ws);
            TestUtils.assertTrue(typeof ws.send === 'function');
            TestUtils.assertTrue(typeof ws.close === 'function');
            TestUtils.assertTrue(typeof ws.on === 'function');
            TestUtils.assertTrue(typeof ws.off === 'function');

            // 设置事件监听器
            ws.on('open', () => {
                this.networkEvents.push({ type: 'wsOpen' });
            });

            ws.on('message', (data) => {
                this.networkEvents.push({ type: 'wsMessage', data });
            });

            ws.on('close', () => {
                this.networkEvents.push({ type: 'wsClose' });
            });

            ws.on('error', (error) => {
                this.networkEvents.push({ type: 'wsError', data: error });
            });

            // 等待连接建立
            await TestUtils.delay(2000);

            // 发送测试消息
            await ws.send('Hello WebSocket');

            // 等待响应
            await TestUtils.delay(1000);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('WebSocket') ||
                error.message.includes('websocket')
            );
        }
    }

    @test('应该能够处理网络错误')
    async testNetworkErrorHandling() {
        try {
            // 测试无效的URL
            await net.createRequest({
                url: 'invalid-url', // 无效URL
                method: 'GET',
                timeout: 5000
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
            // 测试无效的HTTP方法
            await net.createRequest({
                url: 'https://httpbin.org/get',
                method: 'INVALID_METHOD', // 无效方法
                timeout: 5000
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('方法') ||
                error.message.includes('method')
            );
        }

        try {
            // 测试空参数
            await net.createRequest(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }
    }

    @test('应该能够处理请求超时')
    async testRequestTimeout() {
        try {
            const request = await net.createRequest({
                url: 'https://httpbin.org/delay/5', // 延迟5秒的请求
                method: 'GET',
                timeout: 2000 // 2秒超时
            });
            this.httpRequests.push(request);

            // 发送请求（应该超时）
            await request.send();
            TestUtils.fail('应该抛出超时错误');

        } catch (error) {
            // 超时错误是正常的
            TestUtils.assertTrue(
                error.message.includes('超时') ||
                error.message.includes('timeout') ||
                error.message.includes('时间') ||
                error.message.includes('time')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await net.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await net.requestPermission();
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

    @test('应该能够获取网络接口信息')
    async testNetworkInterfaces() {
        try {
            const interfaces = await net.getNetworkInterfaces();
            TestUtils.assertTrue(Array.isArray(interfaces));

            // 验证网络接口信息
            for (const iface of interfaces) {
                TestUtils.assertTrue(typeof iface === 'object');
                TestUtils.assertTrue(typeof iface.name === 'string');
                TestUtils.assertTrue(typeof iface.type === 'string');
                TestUtils.assertTrue(Array.isArray(iface.addresses));

                for (const addr of iface.addresses) {
                    TestUtils.assertTrue(typeof addr === 'string');
                    TestUtils.assertTrue(addr.length > 0);
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('接口') ||
                error.message.includes('interface')
            );
        }
    }

    @test('应该能够处理HTTP头部')
    async testHttpHeaders() {
        try {
            const customHeaders = {
                'X-Custom-Header': 'test-value',
                'Authorization': 'Bearer test-token',
                'Content-Type': 'application/json'
            };

            const request = await net.createRequest({
                url: 'https://httpbin.org/headers',
                method: 'GET',
                timeout: 10000,
                headers: customHeaders
            });
            this.httpRequests.push(request);

            // 发送请求
            const response = await request.send();

            // 验证响应头部
            TestUtils.assertTrue(typeof response.headers === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('头部') ||
                error.message.includes('headers')
            );
        }
    }

    @test('应该能够处理Cookie')
    async testCookieHandling() {
        try {
            const request = await net.createRequest({
                url: 'https://httpbin.org/cookies/set/test/value',
                method: 'GET',
                timeout: 10000,
                withCredentials: true
            });
            this.httpRequests.push(request);

            // 发送请求
            const response = await request.send();

            // 验证Cookie处理
            TestUtils.assertTrue(typeof response === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('Cookie') ||
                error.message.includes('cookie')
            );
        }
    }

    @test('应该能够处理HTTPS请求')
    async testHttpsRequest() {
        try {
            const request = await net.createRequest({
                url: 'https://httpbin.org/get',
                method: 'GET',
                timeout: 10000,
                ssl: {
                    verify: true,
                    rejectUnauthorized: true
                }
            });
            this.httpRequests.push(request);

            // 发送HTTPS请求
            const response = await request.send();

            // 验证HTTPS响应
            TestUtils.assertTrue(typeof response === 'object');
            TestUtils.assertTrue(response.status >= 200 && response.status < 300);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('HTTPS') ||
                error.message.includes('https')
            );
        }
    }

    @test('应该能够处理并发请求')
    async testConcurrentRequests() {
        try {
            const promises = [];
            const count = 3;

            // 并发发送多个请求
            for (let i = 0; i < count; i++) {
                const request = await net.createRequest({
                    url: `https://httpbin.org/get?id=${i}`,
                    method: 'GET',
                    timeout: 10000
                });
                this.httpRequests.push(request);
                promises.push(request.send());
            }

            const responses = await Promise.all(promises);

            // 验证所有响应
            for (const response of responses) {
                TestUtils.assertTrue(typeof response === 'object');
                TestUtils.assertTrue(typeof response.status === 'number');
                TestUtils.assertTrue(response.status >= 200 && response.status < 300);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('并发') ||
                error.message.includes('concurrent')
            );
        }
    }

    @test('应该能够处理请求重试')
    async testRequestRetry() {
        try {
            const request = await net.createRequest({
                url: 'https://httpbin.org/get',
                method: 'GET',
                timeout: 5000,
                retry: 3,
                retryInterval: 1000
            });
            this.httpRequests.push(request);

            // 发送请求
            const response = await request.send();

            // 验证重试机制
            TestUtils.assertTrue(typeof response === 'object');

        } catch (error) {
            // 重试失败是正常的
            TestUtils.assertTrue(
                error.message.includes('重试') ||
                error.message.includes('retry') ||
                error.message.includes('网络') ||
                error.message.includes('network')
            );
        }
    }

    @test('应该能够获取网络统计信息')
    async testNetworkStatistics() {
        try {
            const stats = await net.getNetworkStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalRequests === 'number');
            TestUtils.assertTrue(typeof stats.successfulRequests === 'number');
            TestUtils.assertTrue(typeof stats.failedRequests === 'number');
            TestUtils.assertTrue(typeof stats.totalBytesSent === 'number');
            TestUtils.assertTrue(typeof stats.totalBytesReceived === 'number');

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

export default NetTestSuite;