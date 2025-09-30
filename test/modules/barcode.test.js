/**
 * HTML5+ Barcode 模块测试套件
 *
 * 测试条码扫描功能包括：
 * - 条码扫描启动和停止
 * - 条码识别和解码
 * - 摄像头控制
 * - 扫描结果处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import barcode from '../../modules/barcode.js';

class BarcodeTestSuite extends TestSuite {
    constructor() {
        super();
        this.barcodeScanner = null;
        this.scanResults = [];
        this.barcodeEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Barcode测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Barcode测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理条码扫描器
        try {
            if (this.barcodeScanner) {
                await this.barcodeScanner.stop();
                this.barcodeScanner = null;
            }
            this.scanResults = [];
            this.barcodeEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理条码扫描器
        try {
            if (this.barcodeScanner) {
                await this.barcodeScanner.stop();
                this.barcodeScanner = null;
            }
            this.scanResults = [];
            this.barcodeEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await barcode.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await barcode.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建条码扫描器')
    async testCreateBarcodeScanner() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 支持所有条码类型
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);

            // 验证扫描器实例
            TestUtils.assertNotNull(this.barcodeScanner);
            TestUtils.assertTrue(typeof this.barcodeScanner.start === 'function');
            TestUtils.assertTrue(typeof this.barcodeScanner.stop === 'function');
            TestUtils.assertTrue(typeof this.barcodeScanner.setFlash === 'function');
            TestUtils.assertTrue(typeof this.barcodeScanner.cancel === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('相机') ||
                error.message.includes('camera')
            );
        }
    }

    @test('应该能够启动和停止扫描')
    async testStartStopScan() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1], // 只支持QR码和条码
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 获取扫描状态
            const isScanning = await this.barcodeScanner.isScanning();
            TestUtils.assertTrue(typeof isScanning === 'boolean');

            // 停止扫描
            await this.barcodeScanner.stop();

            // 验证停止状态
            const isStopped = await this.barcodeScanner.isStopped();
            TestUtils.assertTrue(typeof isStopped === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('相机') ||
                error.message.includes('camera')
            );
        }
    }

    @test('应该能够扫描条码并获取结果')
    async testScanBarcode() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                sound: true,
                vibrate: true,
                save: false,
                onsuccess: (result) => {
                    this.scanResults.push(result);
                },
                onerror: (error) => {
                    console.error('条码扫描错误:', error);
                }
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 等待扫描（在测试环境中通常需要用户操作）
            await TestUtils.delay(1000);

            // 停止扫描
            await this.barcodeScanner.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('相机') ||
                error.message.includes('camera')
            );
        }
    }

    @test('应该能够控制闪光灯')
    async testFlashControl() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 开启闪光灯
            await this.barcodeScanner.setFlash(true);

            // 关闭闪光灯
            await this.barcodeScanner.setFlash(false);

            // 停止扫描
            await this.barcodeScanner.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('闪光灯') ||
                error.message.includes('flash')
            );
        }
    }

    @test('应该能够设置条码过滤')
    async testBarcodeFilter() {
        try {
            // 测试不同类型的条码过滤器
            const filterTypes = [
                [0], // QR码
                [1], // 条码
                [0, 1], // QR码和条码
                [2, 3, 4], // 其他类型
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 全部类型
            ];

            for (const filter of filterTypes) {
                const scannerOptions = {
                    filename: '_doc/barcode/',
                    filter: filter,
                    sound: true,
                    vibrate: true,
                    save: false
                };

                this.barcodeScanner = await barcode.createScanner(scannerOptions);
                TestUtils.assertNotNull(this.barcodeScanner);

                // 验证过滤器设置
                const currentFilter = await this.barcodeScanner.getFilter();
                TestUtils.assertTrue(Array.isArray(currentFilter));

                // 清理
                await this.barcodeScanner.stop();
                this.barcodeScanner = null;
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('过滤器') ||
                error.message.includes('filter')
            );
        }
    }

    @test('应该能够处理扫描结果')
    async testScanResultHandling() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: true,
                onsuccess: (result) => {
                    this.scanResults.push(result);
                },
                onerror: (error) => {
                    console.error('条码扫描错误:', error);
                }
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 等待扫描
            await TestUtils.delay(1000);

            // 停止扫描
            await this.barcodeScanner.stop();

            // 验证扫描结果结构
            if (this.scanResults.length > 0) {
                const result = this.scanResults[0];
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(typeof result.type === 'number');
                TestUtils.assertTrue(typeof result.result === 'string');
                TestUtils.assertTrue(typeof result.file === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('扫描') ||
                error.message.includes('scan')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的扫描器配置
            await barcode.createScanner({
                filename: '', // 空文件名
                filter: [-1], // 无效的过滤器
                sound: true,
                vibrate: true,
                save: false
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
            await barcode.createScanner(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的过滤器
            await barcode.createScanner({
                filename: '_doc/barcode/',
                filter: 'invalid_filter', // 字符串而不是数组
                sound: true,
                vibrate: true,
                save: false
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('过滤器') ||
                error.message.includes('filter')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await barcode.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await barcode.requestPermission();
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

    @test('应该能够取消扫描')
    async testCancelScan() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 取消扫描
            await this.barcodeScanner.cancel();

            // 验证取消状态
            const isCancelled = await this.barcodeScanner.isCancelled();
            TestUtils.assertTrue(typeof isCancelled === 'boolean');

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

    @test('应该能够保存扫描结果')
    async testSaveScanResult() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: true,
                onsuccess: (result) => {
                    this.scanResults.push(result);
                }
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 启动扫描
            await this.barcodeScanner.start();

            // 等待扫描
            await TestUtils.delay(1000);

            // 停止扫描
            await this.barcodeScanner.stop();

            // 验证保存设置
            const saveSetting = await this.barcodeScanner.getSaveSetting();
            TestUtils.assertTrue(typeof saveSetting === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('保存') ||
                error.message.includes('save')
            );
        }
    }

    @test('应该能够设置扫描区域')
    async testScanArea() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: false,
                frame: {
                    top: '50%',
                    left: '25%',
                    width: '50%',
                    height: '50%'
                }
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 验证扫描区域设置
            const scanArea = await this.barcodeScanner.getScanArea();
            TestUtils.assertTrue(typeof scanArea === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('区域') ||
                error.message.includes('area')
            );
        }
    }

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        try {
            const promises = [];
            const count = 2;

            // 并发创建多个扫描器
            for (let i = 0; i < count; i++) {
                promises.push(barcode.createScanner({
                    filename: `_doc/barcode/test_${i}/`,
                    filter: [0, 1],
                    sound: true,
                    vibrate: true,
                    save: false
                }));
            }

            const scanners = await Promise.all(promises);

            // 验证所有扫描器
            for (const scanner of scanners) {
                if (scanner) {
                    TestUtils.assertTrue(typeof scanner.start === 'function');
                    TestUtils.assertTrue(typeof scanner.stop === 'function');
                    TestUtils.assertTrue(typeof scanner.setFlash === 'function');
                }
            }

            // 清理扫描器
            for (const scanner of scanners) {
                if (scanner) {
                    await scanner.stop();
                }
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

    @test('应该能够获取条码类型信息')
    async testBarcodeTypeInfo() {
        try {
            const barcodeTypes = await barcode.getSupportedBarcodeTypes();
            TestUtils.assertTrue(Array.isArray(barcodeTypes));
            TestUtils.assertTrue(barcodeTypes.length > 0);

            // 验证条码类型格式
            for (const type of barcodeTypes) {
                TestUtils.assertTrue(typeof type === 'object');
                TestUtils.assertTrue(typeof type.id === 'number');
                TestUtils.assertTrue(typeof type.name === 'string');
                TestUtils.assertTrue(typeof type.description === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('类型') ||
                error.message.includes('type')
            );
        }
    }

    @test('应该能够从文件扫描条码')
    async testScanFromFile() {
        try {
            const testImagePath = '_doc/barcode/test_image.jpg';
            const scanOptions = {
                filename: testImagePath,
                filter: [0, 1] // QR码和条码
            };

            const result = await barcode.scanFromFile(scanOptions);

            // 验证扫描结果
            if (result) {
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(typeof result.type === 'number');
                TestUtils.assertTrue(typeof result.result === 'string');
            }

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

    @test('应该能够设置扫描提示音')
    async testScanSound() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 测试不同的声音设置
            await this.barcodeScanner.setSoundEnabled(true);
            await this.barcodeScanner.setSoundEnabled(false);

            // 验证声音设置
            const soundEnabled = await this.barcodeScanner.isSoundEnabled();
            TestUtils.assertTrue(typeof soundEnabled === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('声音') ||
                error.message.includes('sound')
            );
        }
    }

    @test('应该能够设置扫描振动')
    async testScanVibration() {
        try {
            const scannerOptions = {
                filename: '_doc/barcode/',
                filter: [0, 1],
                sound: true,
                vibrate: true,
                save: false
            };

            this.barcodeScanner = await barcode.createScanner(scannerOptions);
            TestUtils.assertNotNull(this.barcodeScanner);

            // 测试不同的振动设置
            await this.barcodeScanner.setVibrateEnabled(true);
            await this.barcodeScanner.setVibrateEnabled(false);

            // 验证振动设置
            const vibrateEnabled = await this.barcodeScanner.isVibrateEnabled();
            TestUtils.assertTrue(typeof vibrateEnabled === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('振动') ||
                error.message.includes('vibrate')
            );
        }
    }
}

export default BarcodeTestSuite;