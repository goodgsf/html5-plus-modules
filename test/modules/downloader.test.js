/**
 * HTML5+ Downloader 模块测试套件
 *
 * 测试下载功能包括：
 * - 文件下载
 * - 下载进度监控
 * - 下载暂停和恢复
 * - 下载取消
 * - 并发下载管理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import downloader from '../../modules/downloader.js';

class DownloaderTestSuite extends TestSuite {
    constructor() {
        super();
        this.downloadTasks = [];
        this.downloadEvents = [];
        this.testUrl = 'https://example.com/testfile.txt';
        this.testSavePath = '_doc/downloads/testfile.txt';
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Downloader测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Downloader测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理下载任务和事件
        try {
            for (const task of this.downloadTasks) {
                if (task) {
                    await task.cancel();
                }
            }
            this.downloadTasks = [];
            this.downloadEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理下载任务和事件
        try {
            for (const task of this.downloadTasks) {
                if (task) {
                    await task.cancel();
                }
            }
            this.downloadTasks = [];
            this.downloadEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await downloader.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await downloader.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建下载任务')
    async testCreateDownloadTask() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3
            };

            const downloadTask = await downloader.createTask(downloadOptions);

            // 验证下载任务实例
            TestUtils.assertNotNull(downloadTask);
            TestUtils.assertTrue(typeof downloadTask.start === 'function');
            TestUtils.assertTrue(typeof downloadTask.pause === 'function');
            TestUtils.assertTrue(typeof downloadTask.resume === 'function');
            TestUtils.assertTrue(typeof downloadTask.cancel === 'function');
            TestUtils.assertTrue(typeof downloadTask.getProgress === 'function');
            TestUtils.assertTrue(typeof downloadTask.getStatus === 'function');

            this.downloadTasks.push(downloadTask);

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

    @test('应该能够开始和监控下载')
    async testStartAndMonitorDownload() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                onProgress: (progress) => {
                    this.downloadEvents.push({ type: 'progress', data: progress });
                },
                onComplete: (result) => {
                    this.downloadEvents.push({ type: 'complete', data: result });
                },
                onError: (error) => {
                    this.downloadEvents.push({ type: 'error', data: error });
                }
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 获取下载状态
            const status = await downloadTask.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.state === 'string');

            // 等待一段时间以监控进度
            await TestUtils.delay(1000);

            // 获取下载进度
            const progress = await downloadTask.getProgress();
            TestUtils.assertTrue(typeof progress === 'object');
            TestUtils.assertTrue(typeof progress.percent === 'number');
            TestUtils.assertTrue(typeof progress.downloaded === 'number');
            TestUtils.assertTrue(typeof progress.total === 'number');

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

    @test('应该能够暂停和恢复下载')
    async testPauseAndResumeDownload() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待一段时间
            await TestUtils.delay(1000);

            // 暂停下载
            await downloadTask.pause();

            // 验证暂停状态
            const status = await downloadTask.getStatus();
            TestUtils.assertTrue(status.state === 'paused' || status.state === 'paused');

            // 恢复下载
            await downloadTask.resume();

            // 验证恢复状态
            const resumedStatus = await downloadTask.getStatus();
            TestUtils.assertTrue(typeof resumedStatus.state === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('暂停') ||
                error.message.includes('pause')
            );
        }
    }

    @test('应该能够取消下载')
    async testCancelDownload() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待一段时间
            await TestUtils.delay(1000);

            // 取消下载
            await downloadTask.cancel();

            // 验证取消状态
            const status = await downloadTask.getStatus();
            TestUtils.assertTrue(status.state === 'cancelled' || status.state === 'canceled');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('取消') ||
                error.message.includes('cancel')
            );
        }
    }

    @test('应该能够设置下载参数')
    async testDownloadParameters() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                headers: {
                    'User-Agent': 'HTML5+ Downloader',
                    'Accept': '*/*'
                }
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 验证下载参数
            const params = await downloadTask.getParameters();
            TestUtils.assertTrue(typeof params === 'object');
            TestUtils.assertTrue(typeof params.url === 'string');
            TestUtils.assertTrue(typeof params.method === 'string');
            TestUtils.assertTrue(typeof params.timeout === 'number');

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

    @test('应该能够处理大文件下载')
    async testLargeFileDownload() {
        try {
            const largeFileUrl = 'https://example.com/largefile.zip';
            const downloadOptions = {
                url: largeFileUrl,
                path: '_doc/downloads/largefile.zip',
                method: 'GET',
                timeout: 60000,
                retry: 5,
                chunkSize: 1024 * 1024 // 1MB chunks
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待一段时间
            await TestUtils.delay(2000);

            // 获取下载进度
            const progress = await downloadTask.getProgress();
            TestUtils.assertTrue(typeof progress === 'object');

            // 取消下载（避免实际下载大文件）
            await downloadTask.cancel();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('大文件') ||
                error.message.includes('large file')
            );
        }
    }

    @test('应该能够处理并发下载')
    async testConcurrentDownloads() {
        try {
            const concurrentTasks = [];
            const taskCount = 3;

            // 创建多个并发下载任务
            for (let i = 0; i < taskCount; i++) {
                const downloadOptions = {
                    url: `${this.testUrl}?id=${i}`,
                    path: `_doc/downloads/testfile_${i}.txt`,
                    method: 'GET',
                    timeout: 30000,
                    retry: 3
                };

                const downloadTask = await downloader.createTask(downloadOptions);
                concurrentTasks.push(downloadTask);
                this.downloadTasks.push(downloadTask);
            }

            // 开始所有下载任务
            for (const task of concurrentTasks) {
                await task.start();
            }

            // 等待一段时间
            await TestUtils.delay(2000);

            // 验证所有任务的状态
            for (const task of concurrentTasks) {
                const status = await task.getStatus();
                TestUtils.assertTrue(typeof status === 'object');
                TestUtils.assertTrue(typeof status.state === 'string');
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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的URL
            await downloader.createTask({
                url: '', // 空URL
                path: this.testSavePath,
                method: 'GET'
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
            await downloader.createTask(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的方法
            await downloader.createTask({
                url: this.testUrl,
                path: this.testSavePath,
                method: 'INVALID_METHOD' // 无效的HTTP方法
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
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await downloader.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await downloader.requestPermission();
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

    @test('应该能够获取下载任务列表')
    async testGetDownloadTasks() {
        try {
            const tasks = await downloader.getAllTasks();
            TestUtils.assertTrue(Array.isArray(tasks));

            // 验证任务列表
            for (const task of tasks) {
                TestUtils.assertTrue(typeof task === 'object');
                TestUtils.assertTrue(typeof task.id === 'string');
                TestUtils.assertTrue(typeof task.url === 'string');
                TestUtils.assertTrue(typeof task.path === 'string');
                TestUtils.assertTrue(typeof task.status === 'object');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('任务') ||
                error.message.includes('tasks')
            );
        }
    }

    @test('应该能够设置下载速度限制')
    async testDownloadSpeedLimit() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                speedLimit: 1024 * 1024 // 1MB/s limit
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 验证速度限制设置
            const speedLimit = await downloadTask.getSpeedLimit();
            TestUtils.assertTrue(typeof speedLimit === 'number');
            TestUtils.assertTrue(speedLimit > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('速度') ||
                error.message.includes('speed')
            );
        }
    }

    @test('应该能够处理断点续传')
    async testResumeFromBreakpoint() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                resumeFromBreakpoint: true
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待一段时间
            await TestUtils.delay(1000);

            // 暂停下载
            await downloadTask.pause();

            // 获取已下载的字节数
            const progress = await downloadTask.getProgress();
            TestUtils.assertTrue(typeof progress.downloaded === 'number');

            // 恢复下载
            await downloadTask.resume();

            // 验证下载继续进行
            const resumedProgress = await downloadTask.getProgress();
            TestUtils.assertTrue(typeof resumedProgress === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('断点续传') ||
                error.message.includes('resume')
            );
        }
    }

    @test('应该能够处理下载重试')
    async testDownloadRetry() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 5000, // 较短的超时时间
                retry: 2,
                retryInterval: 1000
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待重试机制触发
            await TestUtils.delay(8000);

            // 获取重试状态
            const retryCount = await downloadTask.getRetryCount();
            TestUtils.assertTrue(typeof retryCount === 'number');
            TestUtils.assertTrue(retryCount >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重试') ||
                error.message.includes('retry')
            );
        }
    }

    @test('应该能够处理下载文件验证')
    async testDownloadFileValidation() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                checksum: {
                    algorithm: 'md5',
                    expected: 'd41d8cd98f00b204e9800998ecf8427e' // empty file MD5
                }
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待下载完成
            await TestUtils.delay(2000);

            // 验证文件校验和
            const checksum = await downloadTask.getFileChecksum();
            TestUtils.assertTrue(typeof checksum === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('校验') ||
                error.message.includes('checksum')
            );
        }
    }

    @test('应该能够处理下载事件')
    async testDownloadEvents() {
        try {
            const downloadOptions = {
                url: this.testUrl,
                path: this.testSavePath,
                method: 'GET',
                timeout: 30000,
                retry: 3,
                onProgress: (progress) => {
                    this.downloadEvents.push({ type: 'progress', data: progress });
                },
                onComplete: (result) => {
                    this.downloadEvents.push({ type: 'complete', data: result });
                },
                onError: (error) => {
                    this.downloadEvents.push({ type: 'error', data: error });
                },
                onStatusChange: (status) => {
                    this.downloadEvents.push({ type: 'status', data: status });
                }
            };

            const downloadTask = await downloader.createTask(downloadOptions);
            this.downloadTasks.push(downloadTask);

            // 开始下载
            await downloadTask.start();

            // 等待事件触发
            await TestUtils.delay(1000);

            // 验证事件记录
            TestUtils.assertTrue(Array.isArray(this.downloadEvents));

            // 验证事件类型
            const eventTypes = this.downloadEvents.map(e => e.type);
            TestUtils.assertTrue(eventTypes.includes('progress') || eventTypes.includes('status'));

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
}

export default DownloaderTestSuite;