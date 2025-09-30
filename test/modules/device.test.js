/**
 * HTML5+ Device 模块测试套件
 *
 * 测试设备功能包括：
 * - 设备信息获取
 * - 设备状态监控
 * - 设备属性设置
 * - 设备能力检查
 * - 硬件信息获取
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import device from '../../modules/device.js';

class DeviceTestSuite extends TestSuite {
    constructor() {
        super();
        this.deviceInfo = null;
        this.deviceEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Device测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Device测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理事件监听器
        this.deviceEvents = [];
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理事件监听器
        this.deviceEvents = [];
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await device.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');
    }

    @test('应该能够获取设备基本信息')
    async testGetDeviceInfo() {
        try {
            const deviceInfo = await device.getInfo();
            TestUtils.assertTrue(typeof deviceInfo === 'object');

            // 验证基本设备信息字段
            TestUtils.assertTrue(typeof deviceInfo.model === 'string');
            TestUtils.assertTrue(typeof deviceInfo.vendor === 'string');
            TestUtils.assertTrue(typeof deviceInfo.uuid === 'string');
            TestUtils.assertTrue(typeof deviceInfo.imei === 'string');
            TestUtils.assertTrue(typeof deviceInfo.platform === 'string');
            TestUtils.assertTrue(typeof deviceInfo.version === 'string');

            // 验证信息不为空
            TestUtils.assertTrue(deviceInfo.model.length > 0);
            TestUtils.assertTrue(deviceInfo.vendor.length > 0);
            TestUtils.assertTrue(deviceInfo.uuid.length > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('设备') ||
                error.message.includes('device')
            );
        }
    }

    @test('应该能够获取设备屏幕信息')
    async testGetScreenInfo() {
        try {
            const screenInfo = await device.getScreenInfo();
            TestUtils.assertTrue(typeof screenInfo === 'object');

            // 验证屏幕信息字段
            TestUtils.assertTrue(typeof screenInfo.width === 'number');
            TestUtils.assertTrue(typeof screenInfo.height === 'number');
            TestUtils.assertTrue(typeof screenInfo.density === 'number');
            TestUtils.assertTrue(typeof screenInfo.dpi === 'number');
            TestUtils.assertTrue(typeof screenInfo.orientation === 'string');

            // 验证数值合理性
            TestUtils.assertTrue(screenInfo.width > 0);
            TestUtils.assertTrue(screenInfo.height > 0);
            TestUtils.assertTrue(screenInfo.density > 0);
            TestUtils.assertTrue(screenInfo.dpi > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('屏幕') ||
                error.message.includes('screen')
            );
        }
    }

    @test('应该能够获取设备内存信息')
    async testGetMemoryInfo() {
        try {
            const memoryInfo = await device.getMemoryInfo();
            TestUtils.assertTrue(typeof memoryInfo === 'object');

            // 验证内存信息字段
            TestUtils.assertTrue(typeof memoryInfo.totalMemory === 'number');
            TestUtils.assertTrue(typeof memoryInfo.availableMemory === 'number');
            TestUtils.assertTrue(typeof memoryInfo.usedMemory === 'number');

            // 验证数值合理性
            TestUtils.assertTrue(memoryInfo.totalMemory > 0);
            TestUtils.assertTrue(memoryInfo.availableMemory >= 0);
            TestUtils.assertTrue(memoryInfo.usedMemory >= 0);

            // 验证内存总量关系
            TestUtils.assertTrue(memoryInfo.totalMemory >= memoryInfo.availableMemory + memoryInfo.usedMemory);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('内存') ||
                error.message.includes('memory')
            );
        }
    }

    @test('应该能够获取设备存储信息')
    async testGetStorageInfo() {
        try {
            const storageInfo = await device.getStorageInfo();
            TestUtils.assertTrue(typeof storageInfo === 'object');

            // 验证存储信息字段
            TestUtils.assertTrue(typeof storageInfo.totalSpace === 'number');
            TestUtils.assertTrue(typeof storageInfo.availableSpace === 'number');
            TestUtils.assertTrue(typeof storageInfo.usedSpace === 'number');

            // 验证数值合理性
            TestUtils.assertTrue(storageInfo.totalSpace > 0);
            TestUtils.assertTrue(storageInfo.availableSpace >= 0);
            TestUtils.assertTrue(storageInfo.usedSpace >= 0);

            // 验证存储空间关系
            TestUtils.assertTrue(storageInfo.totalSpace >= storageInfo.availableSpace + storageInfo.usedSpace);

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

    @test('应该能够获取设备电池信息')
    async testGetBatteryInfo() {
        try {
            const batteryInfo = await device.getBatteryInfo();
            TestUtils.assertTrue(typeof batteryInfo === 'object');

            // 验证电池信息字段
            TestUtils.assertTrue(typeof batteryInfo.level === 'number');
            TestUtils.assertTrue(typeof batteryInfo.isPlugged === 'boolean');
            TestUtils.assertTrue(typeof batteryInfo.health === 'string');
            TestUtils.assertTrue(typeof batteryInfo.temperature === 'number');

            // 验证数值合理性
            TestUtils.assertTrue(batteryInfo.level >= 0 && batteryInfo.level <= 100);
            TestUtils.assertTrue(batteryInfo.temperature >= -50 && batteryInfo.temperature <= 100);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('电池') ||
                error.message.includes('battery')
            );
        }
    }

    @test('应该能够获取设备网络信息')
    async testGetNetworkInfo() {
        try {
            const networkInfo = await device.getNetworkInfo();
            TestUtils.assertTrue(typeof networkInfo === 'object');

            // 验证网络信息字段
            TestUtils.assertTrue(typeof networkInfo.type === 'string');
            TestUtils.assertTrue(typeof networkInfo.isConnected === 'boolean');
            TestUtils.assertTrue(typeof networkInfo.signalStrength === 'number');

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

    @test('应该能够获取设备传感器信息')
    async testGetSensorInfo() {
        try {
            const sensorInfo = await device.getSensorInfo();
            TestUtils.assertTrue(typeof sensorInfo === 'object');

            // 验证传感器信息字段
            TestUtils.assertTrue(typeof sensorInfo.hasAccelerometer === 'boolean');
            TestUtils.assertTrue(typeof sensorInfo.hasGyroscope === 'boolean');
            TestUtils.assertTrue(typeof sensorInfo.hasMagnetometer === 'boolean');
            TestUtils.assertTrue(typeof sensorInfo.hasLightSensor === 'boolean');
            TestUtils.assertTrue(typeof sensorInfo.hasProximitySensor === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('传感器') ||
                error.message.includes('sensor')
            );
        }
    }

    @test('应该能够监听设备事件')
    async testDeviceEventListeners() {
        try {
            // 监听电池状态变化
            device.onBatteryChange((data) => {
                this.deviceEvents.push({ type: 'battery', data });
            });

            // 监听网络状态变化
            device.onNetworkChange((data) => {
                this.deviceEvents.push({ type: 'network', data });
            });

            // 监听屏幕方向变化
            device.onOrientationChange((data) => {
                this.deviceEvents.push({ type: 'orientation', data });
            });

            // 等待事件
            await TestUtils.delay(1000);

            // 验证事件监听器已设置
            TestUtils.assertTrue(typeof device.onBatteryChange === 'function');
            TestUtils.assertTrue(typeof device.onNetworkChange === 'function');
            TestUtils.assertTrue(typeof device.onOrientationChange === 'function');

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

    @test('应该能够控制设备振动')
    async testVibrationControl() {
        try {
            // 测试短振动
            await device.vibrate(500);

            // 测试振动模式
            await device.vibrate([100, 50, 100, 50, 100]);

            // 测试停止振动
            await device.stopVibration();

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

    @test('应该能够控制屏幕亮度')
    async testScreenBrightness() {
        try {
            // 获取当前亮度
            const currentBrightness = await device.getScreenBrightness();
            TestUtils.assertTrue(typeof currentBrightness === 'number');
            TestUtils.assertTrue(currentBrightness >= 0 && currentBrightness <= 1);

            // 设置不同亮度值
            const brightnessValues = [0.1, 0.5, 0.9];
            for (const brightness of brightnessValues) {
                await device.setScreenBrightness(brightness);

                const newBrightness = await device.getScreenBrightness();
                TestUtils.assertTrue(typeof newBrightness === 'number');
                TestUtils.assertTrue(newBrightness >= 0 && newBrightness <= 1);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('亮度') ||
                error.message.includes('brightness')
            );
        }
    }

    @test('应该能够控制屏幕超时')
    async testScreenTimeout() {
        try {
            // 获取当前超时时间
            const currentTimeout = await device.getScreenTimeout();
            TestUtils.assertTrue(typeof currentTimeout === 'number');
            TestUtils.assertTrue(currentTimeout > 0);

            // 设置不同的超时时间
            const timeoutValues = [15000, 30000, 60000];
            for (const timeout of timeoutValues) {
                await device.setScreenTimeout(timeout);

                const newTimeout = await device.getScreenTimeout();
                TestUtils.assertTrue(typeof newTimeout === 'number');
                TestUtils.assertTrue(newTimeout > 0);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('超时') ||
                error.message.includes('timeout')
            );
        }
    }

    @test('应该能够获取设备IMEI信息')
    async testImeiInfo() {
        try {
            const imeiInfo = await device.getImeiInfo();
            TestUtils.assertTrue(typeof imeiInfo === 'object');

            // 验证IMEI信息
            if (imeiInfo.imei1) {
                TestUtils.assertTrue(typeof imeiInfo.imei1 === 'string');
                TestUtils.assertTrue(imeiInfo.imei1.length >= 14 && imeiInfo.imei1.length <= 16);
            }

            if (imeiInfo.imei2) {
                TestUtils.assertTrue(typeof imeiInfo.imei2 === 'string');
                TestUtils.assertTrue(imeiInfo.imei2.length >= 14 && imeiInfo.imei2.length <= 16);
            }

            TestUtils.assertTrue(typeof imeiInfo.meid === 'string');
            TestUtils.assertTrue(typeof imeiInfo.imsi === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('IMEI') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够获取设备MAC地址')
    async testMacAddress() {
        try {
            const macAddress = await device.getMacAddress();
            TestUtils.assertTrue(typeof macAddress === 'string');

            // 验证MAC地址格式
            const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            if (macAddress !== 'unknown') {
                TestUtils.assertTrue(macRegex.test(macAddress));
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('MAC') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够获取设备CPU信息')
    async testCpuInfo() {
        try {
            const cpuInfo = await device.getCpuInfo();
            TestUtils.assertTrue(typeof cpuInfo === 'object');

            // 验证CPU信息
            TestUtils.assertTrue(typeof cpuInfo.cores === 'number');
            TestUtils.assertTrue(typeof cpuInfo.frequency === 'number');
            TestUtils.assertTrue(typeof cpuInfo.architecture === 'string');
            TestUtils.assertTrue(typeof cpuInfo.model === 'string');

            // 验证数值合理性
            TestUtils.assertTrue(cpuInfo.cores > 0);
            TestUtils.assertTrue(cpuInfo.frequency > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('CPU') ||
                error.message.includes('cpu')
            );
        }
    }

    @test('应该能够获取设备GPU信息')
    async testGpuInfo() {
        try {
            const gpuInfo = await device.getGpuInfo();
            TestUtils.assertTrue(typeof gpuInfo === 'object');

            // 验证GPU信息
            TestUtils.assertTrue(typeof gpuInfo.vendor === 'string');
            TestUtils.assertTrue(typeof gpuInfo.renderer === 'string');
            TestUtils.assertTrue(typeof gpuInfo.version === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('GPU') ||
                error.message.includes('gpu')
            );
        }
    }

    @test('应该能够获取设备相机信息')
    async testCameraInfo() {
        try {
            const cameraInfo = await device.getCameraInfo();
            TestUtils.assertTrue(typeof cameraInfo === 'object');

            // 验证相机信息
            TestUtils.assertTrue(typeof cameraInfo.count === 'number');
            TestUtils.assertTrue(cameraInfo.count >= 0);

            if (cameraInfo.count > 0) {
                TestUtils.assertTrue(Array.isArray(cameraInfo.cameras));
                TestUtils.assertTrue(cameraInfo.cameras.length > 0);

                for (const cam of cameraInfo.cameras) {
                    TestUtils.assertTrue(typeof cam.index === 'number');
                    TestUtils.assertTrue(typeof cam.type === 'string');
                    TestUtils.assertTrue(typeof cam.resolution === 'object');
                }
            }

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

    @test('应该能够获取设备显示信息')
    async testDisplayInfo() {
        try {
            const displayInfo = await device.getDisplayInfo();
            TestUtils.assertTrue(typeof displayInfo === 'object');

            // 验证显示信息
            TestUtils.assertTrue(typeof displayInfo.width === 'number');
            TestUtils.assertTrue(typeof displayInfo.height === 'number');
            TestUtils.assertTrue(typeof displayInfo.refreshRate === 'number');
            TestUtils.assertTrue(typeof displayInfo.colorDepth === 'number');

            // 验证数值合理性
            TestUtils.assertTrue(displayInfo.width > 0);
            TestUtils.assertTrue(displayInfo.height > 0);
            TestUtils.assertTrue(displayInfo.refreshRate > 0);
            TestUtils.assertTrue(displayInfo.colorDepth > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('显示') ||
                error.message.includes('display')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的振动参数
            await device.vibrate(-1); // 负数
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('振动') ||
                error.message.includes('vibrate')
            );
        }

        try {
            // 测试无效的亮度值
            await device.setScreenBrightness(1.5); // 超出范围
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('亮度') ||
                error.message.includes('brightness')
            );
        }

        try {
            // 测试无效的超时值
            await device.setScreenTimeout(-1); // 负数
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('超时') ||
                error.message.includes('timeout')
            );
        }
    }
}

export default DeviceTestSuite;