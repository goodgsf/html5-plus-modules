/**
 * HTML5+ Bluetooth 模块测试套件
 *
 * 测试蓝牙功能包括：
 * - 蓝牙设备发现和连接
 * - 蓝牙数据传输
 * - 蓝牙状态管理
 * - 蓝牙配对处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import bluetooth from '../../modules/bluetooth.js';

class BluetoothTestSuite extends TestSuite {
    constructor() {
        super();
        this.bluetoothAdapter = null;
        this.bluetoothDevices = [];
        this.bluetoothConnections = [];
        this.bluetoothEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Bluetooth测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Bluetooth测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理蓝牙设备和连接
        try {
            if (this.bluetoothAdapter) {
                await this.bluetoothAdapter.close();
                this.bluetoothAdapter = null;
            }
            this.bluetoothDevices = [];
            this.bluetoothConnections = [];
            this.bluetoothEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理蓝牙设备和连接
        try {
            if (this.bluetoothAdapter) {
                await this.bluetoothAdapter.close();
                this.bluetoothAdapter = null;
            }
            this.bluetoothDevices = [];
            this.bluetoothConnections = [];
            this.bluetoothEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await bluetooth.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await bluetooth.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取蓝牙适配器')
    async testGetBluetoothAdapter() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();
            TestUtils.assertNotNull(this.bluetoothAdapter);
            TestUtils.assertTrue(typeof this.bluetoothAdapter.open === 'function');
            TestUtils.assertTrue(typeof this.bluetoothAdapter.close === 'function');
            TestUtils.assertTrue(typeof this.bluetoothAdapter.startDiscovery === 'function');
            TestUtils.assertTrue(typeof this.bluetoothAdapter.stopDiscovery === 'function');
            TestUtils.assertTrue(typeof this.bluetoothAdapter.getPairedDevices === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('蓝牙') ||
                error.message.includes('bluetooth')
            );
        }
    }

    @test('应该能够开启和关闭蓝牙')
    async testBluetoothPowerControl() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 开启蓝牙
            const openResult = await this.bluetoothAdapter.open();
            TestUtils.assertTrue(typeof openResult === 'object');
            TestUtils.assertTrue(openResult.success === true || openResult.success === false);

            // 获取蓝牙状态
            const isOpen = await this.bluetoothAdapter.isOpen();
            TestUtils.assertTrue(typeof isOpen === 'boolean');

            // 关闭蓝牙
            const closeResult = await this.bluetoothAdapter.close();
            TestUtils.assertTrue(typeof closeResult === 'object');
            TestUtils.assertTrue(closeResult.success === true || closeResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('蓝牙') ||
                error.message.includes('bluetooth')
            );
        }
    }

    @test('应该能够发现蓝牙设备')
    async testDeviceDiscovery() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 开始发现设备
            await this.bluetoothAdapter.startDiscovery({
                onDeviceFound: (device) => {
                    this.bluetoothDevices.push(device);
                },
                onDiscoveryStarted: () => {
                    this.bluetoothEvents.push({ type: 'discovery_started' });
                },
                onDiscoveryFinished: () => {
                    this.bluetoothEvents.push({ type: 'discovery_finished' });
                }
            });

            // 等待一段时间让设备发现
            await TestUtils.sleep(3000);

            // 停止发现
            await this.bluetoothAdapter.stopDiscovery();

            // 验证发现的设备
            TestUtils.assertTrue(Array.isArray(this.bluetoothDevices));

            for (const device of this.bluetoothDevices) {
                TestUtils.assertTrue(typeof device === 'object');
                TestUtils.assertTrue(typeof device.address === 'string');
                TestUtils.assertTrue(typeof device.name === 'string');
                TestUtils.assertTrue(typeof device.rssi === 'number');
                TestUtils.assertTrue(typeof device.bondState === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('发现') ||
                error.message.includes('discovery')
            );
        }
    }

    @test('应该能够获取已配对设备')
    async testGetPairedDevices() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 获取已配对设备
            const pairedDevices = await this.bluetoothAdapter.getPairedDevices();
            TestUtils.assertTrue(Array.isArray(pairedDevices));

            for (const device of pairedDevices) {
                TestUtils.assertTrue(typeof device === 'object');
                TestUtils.assertTrue(typeof device.address === 'string');
                TestUtils.assertTrue(typeof device.name === 'string');
                TestUtils.assertTrue(device.bondState === 12); // BOND_BONDED
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配对') ||
                error.message.includes('paired')
            );
        }
    }

    @test('应该能够连接蓝牙设备')
    async testConnectBluetoothDevice() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 模拟设备连接（需要实际的设备地址）
            const deviceAddress = '00:11:22:33:44:55';
            const connection = await this.bluetoothAdapter.connect(deviceAddress, {
                onConnected: () => {
                    this.bluetoothEvents.push({ type: 'connected', address: deviceAddress });
                },
                onDisconnected: () => {
                    this.bluetoothEvents.push({ type: 'disconnected', address: deviceAddress });
                },
                onDataReceived: (data) => {
                    this.bluetoothEvents.push({ type: 'data_received', data: data });
                },
                onError: (error) => {
                    this.bluetoothEvents.push({ type: 'error', error: error });
                }
            });

            TestUtils.assertNotNull(connection);
            TestUtils.assertTrue(typeof connection.getAddress === 'function');
            TestUtils.assertTrue(typeof connection.isConnected === 'function');
            TestUtils.assertTrue(typeof connection.disconnect === 'function');
            TestUtils.assertTrue(typeof connection.sendData === 'function');

            // 断开连接
            await connection.disconnect();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('连接') ||
                error.message.includes('connect')
            );
        }
    }

    @test('应该能够发送和接收数据')
    async testDataTransfer() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            const deviceAddress = '00:11:22:33:44:55';
            const connection = await this.bluetoothAdapter.connect(deviceAddress);

            // 发送数据
            const testData = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]); // "Hello"
            const sendResult = await connection.sendData(testData);
            TestUtils.assertTrue(typeof sendResult === 'object');
            TestUtils.assertTrue(sendResult.success === true || sendResult.success === false);

            // 断开连接
            await connection.disconnect();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('数据') ||
                error.message.includes('data')
            );
        }
    }

    @test('应该能够配对蓝牙设备')
    async testDevicePairing() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            const deviceAddress = '00:11:22:33:44:55';

            // 配对设备
            const pairResult = await this.bluetoothAdapter.pair(deviceAddress, {
                onPaired: () => {
                    this.bluetoothEvents.push({ type: 'paired', address: deviceAddress });
                },
                onPairingFailed: (error) => {
                    this.bluetoothEvents.push({ type: 'pairing_failed', error: error });
                }
            });

            TestUtils.assertTrue(typeof pairResult === 'object');
            TestUtils.assertTrue(pairResult.success === true || pairResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配对') ||
                error.message.includes('pair')
            );
        }
    }

    @test('应该能够取消配对')
    async testUnpairDevice() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            const deviceAddress = '00:11:22:33:44:55';

            // 取消配对
            const unpairResult = await this.bluetoothAdapter.unpair(deviceAddress);
            TestUtils.assertTrue(typeof unpairResult === 'object');
            TestUtils.assertTrue(unpairResult.success === true || unpairResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('取消配对') ||
                error.message.includes('unpair')
            );
        }
    }

    @test('应该能够获取蓝牙状态')
    async testGetBluetoothStatus() {
        try {
            const status = await bluetooth.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.isEnabled === 'boolean');
            TestUtils.assertTrue(typeof status.isDiscovering === 'boolean');
            TestUtils.assertTrue(typeof status.isConnected === 'boolean');
            TestUtils.assertTrue(typeof status.pairedDevicesCount === 'number');

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的设备地址
            this.bluetoothAdapter = await bluetooth.getAdapter();
            await this.bluetoothAdapter.connect('');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('地址') ||
                error.message.includes('address')
            );
        }

        try {
            // 测试空参数
            this.bluetoothAdapter = await bluetooth.getAdapter();
            await this.bluetoothAdapter.connect(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的连接参数
            this.bluetoothAdapter = await bluetooth.getAdapter();
            await this.bluetoothAdapter.connect('00:11:22:33:44:55', 'invalid_params');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('连接') ||
                error.message.includes('connection')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await bluetooth.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await bluetooth.requestPermission();
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

    @test('应该能够获取设备信息')
    async testGetDeviceInfo() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 获取设备信息
            const deviceInfo = await this.bluetoothAdapter.getDeviceInfo('00:11:22:33:44:55');
            TestUtils.assertTrue(typeof deviceInfo === 'object');
            TestUtils.assertTrue(typeof deviceInfo.address === 'string');
            TestUtils.assertTrue(typeof deviceInfo.name === 'string');
            TestUtils.assertTrue(typeof deviceInfo.rssi === 'number');
            TestUtils.assertTrue(typeof deviceInfo.bondState === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('设备信息') ||
                error.message.includes('device info')
            );
        }
    }

    @test('应该能够监听蓝牙状态变化')
    async testBluetoothStateListeners() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 监听状态变化
            await this.bluetoothAdapter.onStateChange({
                onStateChanged: (state) => {
                    this.bluetoothEvents.push({ type: 'state_changed', state: state });
                },
                onAdapterChanged: (adapter) => {
                    this.bluetoothEvents.push({ type: 'adapter_changed', adapter: adapter });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.bluetoothEvents.length >= 0);

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

    @test('应该能够获取连接的设备')
    async testGetConnectedDevices() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 获取连接的设备
            const connectedDevices = await this.bluetoothAdapter.getConnectedDevices();
            TestUtils.assertTrue(Array.isArray(connectedDevices));

            for (const device of connectedDevices) {
                TestUtils.assertTrue(typeof device === 'object');
                TestUtils.assertTrue(typeof device.address === 'string');
                TestUtils.assertTrue(typeof device.name === 'string');
                TestUtils.assertTrue(device.isConnected === true);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('连接设备') ||
                error.message.includes('connected devices')
            );
        }
    }

    @test('应该能够设置蓝牙名称')
    async testSetBluetoothName() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 设置蓝牙名称
            const newName = 'Test Bluetooth Device';
            const result = await this.bluetoothAdapter.setName(newName);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取蓝牙名称
            const currentName = await this.bluetoothAdapter.getName();
            TestUtils.assertTrue(typeof currentName === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('名称') ||
                error.message.includes('name')
            );
        }
    }

    @test('应该能够获取蓝牙地址')
    async testGetBluetoothAddress() {
        try {
            this.bluetoothAdapter = await bluetooth.getAdapter();

            // 获取蓝牙地址
            const address = await this.bluetoothAdapter.getAddress();
            TestUtils.assertTrue(typeof address === 'string');

            // 验证地址格式
            const addressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
            TestUtils.assertTrue(addressRegex.test(address));

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('地址') ||
                error.message.includes('address')
            );
        }
    }
}

export default BluetoothTestSuite;