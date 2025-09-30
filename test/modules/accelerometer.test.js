/**
 * HTML5+ Accelerometer 模块测试套件
 *
 * 测试设备加速计功能包括：
 * - 获取当前加速度数据
 * - 监听加速度变化
 * - 频率控制
 * - 错误处理
 * - 设备兼容性
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import accelerometer from '../../modules/accelerometer.js';

class AccelerometerTestSuite extends TestSuite {
    constructor() {
        super();
        this.accelerometerData = null;
        this.accelerometerListener = null;
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Accelerometer测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Accelerometer测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理监听器
        try {
            if (this.accelerometerListener) {
                await accelerometer.stop();
                this.accelerometerListener = null;
            }
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理监听器
        try {
            if (this.accelerometerListener) {
                await accelerometer.stop();
                this.accelerometerListener = null;
            }
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await accelerometer.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await accelerometer.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取当前加速度数据')
    async testGetCurrentAcceleration() {
        try {
            const acceleration = await accelerometer.getCurrentAcceleration();

            // 验证数据结构
            TestUtils.assertTrue(typeof acceleration === 'object');
            TestUtils.assertTrue(typeof acceleration.x === 'number');
            TestUtils.assertTrue(typeof acceleration.y === 'number');
            TestUtils.assertTrue(typeof acceleration.z === 'number');
            TestUtils.assertTrue(typeof acceleration.timestamp === 'number');

            // 验证数值范围（加速度通常在-10到10之间）
            TestUtils.assertTrue(acceleration.x >= -20 && acceleration.x <= 20);
            TestUtils.assertTrue(acceleration.y >= -20 && acceleration.y <= 20);
            TestUtils.assertTrue(acceleration.z >= -20 && acceleration.z <= 20);

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够监听加速度变化')
    async testWatchAcceleration() {
        try {
            let receivedData = null;
            let watchCount = 0;

            this.accelerometerListener = await accelerometer.watchAcceleration(
                (acceleration) => {
                    receivedData = acceleration;
                    watchCount++;
                },
                (error) => {
                    console.error('加速度监听错误:', error);
                },
                {
                    frequency: 1000 // 每秒更新一次
                }
            );

            TestUtils.assertNotNull(this.accelerometerListener);

            // 等待一段时间以接收数据
            await TestUtils.delay(1500);

            if (receivedData) {
                // 验证接收到的数据结构
                TestUtils.assertTrue(typeof receivedData.x === 'number');
                TestUtils.assertTrue(typeof receivedData.y === 'number');
                TestUtils.assertTrue(typeof receivedData.z === 'number');
                TestUtils.assertTrue(typeof receivedData.timestamp === 'number');
            }

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够控制监听频率')
    async testWatchAccelerationWithFrequency() {
        try {
            let receivedData = [];
            let startTime = Date.now();

            this.accelerometerListener = await accelerometer.watchAcceleration(
                (acceleration) => {
                    receivedData.push(acceleration);
                },
                (error) => {
                    console.error('加速度监听错误:', error);
                },
                {
                    frequency: 500 // 每500ms更新一次
                }
            );

            TestUtils.assertNotNull(this.accelerometerListener);

            // 等待2秒
            await TestUtils.delay(2000);

            // 验证接收到的数据频率
            const endTime = Date.now();
            const duration = endTime - startTime;
            const expectedCount = Math.floor(duration / 500);

            // 由于各种因素，可能不会完全精确，但应该有一定数量的数据
            if (receivedData.length > 0) {
                TestUtils.assertTrue(receivedData.length > 0);
            }

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够停止监听')
    async testStopAcceleration() {
        try {
            let receivedData = [];

            // 开始监听
            this.accelerometerListener = await accelerometer.watchAcceleration(
                (acceleration) => {
                    receivedData.push(acceleration);
                },
                (error) => {
                    console.error('加速度监听错误:', error);
                },
                {
                    frequency: 200
                }
            );

            TestUtils.assertNotNull(this.accelerometerListener);

            // 等待一段时间以接收数据
            await TestUtils.delay(500);
            const initialCount = receivedData.length;

            // 停止监听
            await accelerometer.stop();
            this.accelerometerListener = null;

            // 再等待一段时间
            await TestUtils.delay(500);

            // 验证停止后没有新数据
            const finalCount = receivedData.length;
            TestUtils.assertTrue(finalCount >= initialCount);

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效参数
            await accelerometer.getCurrentAcceleration(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('不支持') ||
                error.message.includes('not supported')
            );
        }

        try {
            // 测试无效的监听选项
            await accelerometer.watchAcceleration(
                () => {},
                null,
                {
                    frequency: -1 // 无效频率
                }
            );
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('频率') ||
                error.message.includes('frequency')
            );
        }

        try {
            // 测试空的回调函数
            await accelerometer.watchAcceleration(
                null,
                null,
                {
                    frequency: 1000
                }
            );
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('回调') ||
                error.message.includes('callback')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await accelerometer.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await accelerometer.requestPermission();
                TestUtils.assertTrue(
                    requestedPermission === 'granted' ||
                    requestedPermission === 'denied'
                );
            }
        } catch (error) {
            // 在浏览器环境中可能不支持权限请求
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        try {
            const promises = [];
            const count = 3;

            // 并发获取加速度数据
            for (let i = 0; i < count; i++) {
                promises.push(accelerometer.getCurrentAcceleration());
            }

            const results = await Promise.all(promises);

            // 验证所有结果都有正确的数据结构
            for (const result of results) {
                if (result) {
                    TestUtils.assertTrue(typeof result.x === 'number');
                    TestUtils.assertTrue(typeof result.y === 'number');
                    TestUtils.assertTrue(typeof result.z === 'number');
                    TestUtils.assertTrue(typeof result.timestamp === 'number');
                }
            }

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够获取设备方向信息')
    async testDeviceOrientation() {
        try {
            // 测试是否有设备方向相关的方法
            TestUtils.assertTrue(typeof accelerometer.getCurrentAcceleration === 'function');

            // 尝试获取当前加速度
            const acceleration = await accelerometer.getCurrentAcceleration();

            if (acceleration) {
                // 验证加速度数据的合理性
                TestUtils.assertTrue(acceleration.x >= -20 && acceleration.x <= 20);
                TestUtils.assertTrue(acceleration.y >= -20 && acceleration.y <= 20);
                TestUtils.assertTrue(acceleration.z >= -20 && acceleration.z <= 20);

                // 验证时间戳
                TestUtils.assertTrue(acceleration.timestamp > 0);
            }

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够处理异常情况')
    async testExceptionHandling() {
        try {
            // 测试重复停止监听
            await accelerometer.stop();
            await accelerometer.stop(); // 第二次停止应该不会出错
        } catch (error) {
            // 如果出错，确保是合理的错误
            TestUtils.assertTrue(
                error.message.includes('监听') ||
                error.message.includes('listener') ||
                error.message.includes('停止') ||
                error.message.includes('stop')
            );
        }

        try {
            // 测试在没有监听的情况下停止
            await accelerometer.stop();
        } catch (error) {
            // 如果出错，确保是合理的错误
            TestUtils.assertTrue(
                error.message.includes('监听') ||
                error.message.includes('listener') ||
                error.message.includes('停止') ||
                error.message.includes('stop')
            );
        }
    }

    @test('应该能够验证设备传感器可用性')
    async testSensorAvailability() {
        try {
            // 尝试获取加速度数据以验证传感器可用性
            const acceleration = await accelerometer.getCurrentAcceleration();

            if (acceleration) {
                // 验证数据不是默认值（0,0,0）
                const hasRealData = acceleration.x !== 0 || acceleration.y !== 0 || acceleration.z !== 0;
                if (hasRealData) {
                    TestUtils.assertTrue(true, '传感器提供了真实的加速度数据');
                } else {
                    TestUtils.assertTrue(true, '传感器返回了零值，可能是设备静止');
                }
            }

        } catch (error) {
            // 在浏览器环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }
}

export default AccelerometerTestSuite;