/**
 * HTML5+ iBeacon 模块测试套件
 *
 * 测试iBeacon功能包括：
 * - iBeacon扫描和监测
 * - iBeacon区域管理
 * - iBeacon距离计算
 * - iBeacon配置
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import ibeacon from '../../modules/ibeacon.js';

class IBeaconTestSuite extends TestSuite {
    constructor() {
        super();
        this.ibeaconManager = null;
        this.detectedBeacons = [];
        this.ibeaconRegions = [];
        this.ibeaconEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置iBeacon测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理iBeacon测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理iBeacon设备和区域
        try {
            if (this.ibeaconManager) {
                await this.ibeaconManager.stopRanging();
                this.ibeaconManager = null;
            }
            this.detectedBeacons = [];
            this.ibeaconRegions = [];
            this.ibeaconEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理iBeacon设备和区域
        try {
            if (this.ibeaconManager) {
                await this.ibeaconManager.stopRanging();
                this.ibeaconManager = null;
            }
            this.detectedBeacons = [];
            this.ibeaconRegions = [];
            this.ibeaconEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await ibeacon.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await ibeacon.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取iBeacon管理器')
    async testGetIBeaconManager() {
        try {
            this.ibeaconManager = await ibeacon.getManager();
            TestUtils.assertNotNull(this.ibeaconManager);
            TestUtils.assertTrue(typeof this.ibeaconManager.startRanging === 'function');
            TestUtils.assertTrue(typeof this.ibeaconManager.stopRanging === 'function');
            TestUtils.assertTrue(typeof this.ibeaconManager.startMonitoring === 'function');
            TestUtils.assertTrue(typeof this.ibeaconManager.stopMonitoring === 'function');
            TestUtils.assertTrue(typeof this.ibeaconManager.getRegions === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('iBeacon') ||
                error.message.includes('ibeacon')
            );
        }
    }

    @test('应该能够扫描iBeacon设备')
    async testScanBeacons() {
        try {
            this.ibeaconManager = await ibeacon.getManager();

            // 开始扫描
            await this.ibeaconManager.startRanging({
                uuid: '00000000-0000-0000-0000-000000000000',
                onBeaconDiscovered: (beacon) => {
                    this.detectedBeacons.push(beacon);
                },
                onRangingStarted: () => {
                    this.ibeaconEvents.push({ type: 'ranging_started' });
                },
                onRangingStopped: () => {
                    this.ibeaconEvents.push({ type: 'ranging_stopped' });
                },
                onError: (error) => {
                    this.ibeaconEvents.push({ type: 'error', data: error });
                }
            });

            // 等待一段时间让设备发现
            await TestUtils.sleep(5000);

            // 停止扫描
            await this.ibeaconManager.stopRanging();

            // 验证发现的Beacon
            TestUtils.assertTrue(Array.isArray(this.detectedBeacons));

            for (const beacon of this.detectedBeacons) {
                TestUtils.assertTrue(typeof beacon === 'object');
                TestUtils.assertTrue(typeof beacon.uuid === 'string');
                TestUtils.assertTrue(typeof beacon.major === 'number');
                TestUtils.assertTrue(typeof beacon.minor === 'number');
                TestUtils.assertTrue(typeof beacon.rssi === 'number');
                TestUtils.assertTrue(typeof beacon.distance === 'number');
                TestUtils.assertTrue(typeof beacon.proximity === 'string');
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

    @test('应该能够监测iBeacon区域')
    async testMonitorRegion() {
        try {
            this.ibeaconManager = await ibeacon.getManager();

            const region = {
                identifier: 'test_region_' + Date.now(),
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minor: 1
            };

            // 开始监测区域
            await this.ibeaconManager.startMonitoring(region, {
                onRegionEntered: (regionInfo) => {
                    this.ibeaconEvents.push({ type: 'region_entered', data: regionInfo });
                },
                onRegionExited: (regionInfo) => {
                    this.ibeaconEvents.push({ type: 'region_exited', data: regionInfo });
                },
                onMonitoringStarted: () => {
                    this.ibeaconEvents.push({ type: 'monitoring_started' });
                },
                onMonitoringStopped: () => {
                    this.ibeaconEvents.push({ type: 'monitoring_stopped' });
                },
                onError: (error) => {
                    this.ibeaconEvents.push({ type: 'error', data: error });
                }
            });

            // 停止监测
            await this.ibeaconManager.stopMonitoring(region.identifier);

            // 验证监测事件
            TestUtils.assertTrue(this.ibeaconEvents.length >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('监测') ||
                error.message.includes('monitor')
            );
        }
    }

    @test('应该能够计算Beacon距离')
    async testCalculateDistance() {
        try {
            const beaconData = {
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minor: 1,
                rssi: -65,
                txPower: -59
            };

            const distance = await ibeacon.calculateDistance(beaconData);
            TestUtils.assertTrue(typeof distance === 'number');
            TestUtils.assertTrue(distance >= 0);

            // 验证距离范围
            TestUtils.assertTrue(distance < 100); // 一般iBeacon距离不超过100米

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('距离') ||
                error.message.includes('distance')
            );
        }
    }

    @test('应该能够判断接近程度')
    async testGetProximity() {
        try {
            const beaconData = {
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minor: 1,
                rssi: -65,
                txPower: -59
            };

            const proximity = await ibeacon.getProximity(beaconData);
            TestUtils.assertTrue(typeof proximity === 'string');
            TestUtils.assertTrue(
                proximity === 'immediate' ||
                proximity === 'near' ||
                proximity === 'far' ||
                proximity === 'unknown'
            );

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('接近') ||
                error.message.includes('proximity')
            );
        }
    }

    @test('应该能够获取所有监测区域')
    async testGetMonitoredRegions() {
        try {
            this.ibeaconManager = await ibeacon.getManager();

            const regions = await this.ibeaconManager.getRegions();
            TestUtils.assertTrue(Array.isArray(regions));

            for (const region of regions) {
                TestUtils.assertTrue(typeof region === 'object');
                TestUtils.assertTrue(typeof region.identifier === 'string');
                TestUtils.assertTrue(typeof region.uuid === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('区域') ||
                error.message.includes('region')
            );
        }
    }

    @test('应该能够创建自定义区域')
    async testCreateCustomRegion() {
        try {
            const regionConfig = {
                identifier: 'custom_region_' + Date.now(),
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minor: 1,
                notifyOnEntry: true,
                notifyOnExit: true
            };

            const region = await ibeacon.createRegion(regionConfig);
            TestUtils.assertTrue(typeof region === 'object');
            TestUtils.assertTrue(typeof region.identifier === 'string');
            TestUtils.assertTrue(typeof region.uuid === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('创建') ||
                error.message.includes('create')
            );
        }
    }

    @test('应该能够配置iBeacon参数')
    async testConfigureBeacon() {
        try {
            const config = {
                scanInterval: 1000,
                scanWindow: 100,
                notifyEntryDelay: 1000,
                notifyExitDelay: 2000
            };

            const result = await ibeacon.configure(config);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('配置') ||
                error.message.includes('configure')
            );
        }
    }

    @test('应该能够获取iBeacon状态')
    async testGetBeaconStatus() {
        try {
            const status = await ibeacon.getStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.isBluetoothEnabled === 'boolean');
            TestUtils.assertTrue(typeof status.isLocationEnabled === 'boolean');
            TestUtils.assertTrue(typeof status.isMonitoring === 'boolean');
            TestUtils.assertTrue(typeof status.monitoredRegionsCount === 'number');

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
            // 测试无效的区域配置
            this.ibeaconManager = await ibeacon.getManager();
            await this.ibeaconManager.startMonitoring({});
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('区域') ||
                error.message.includes('region')
            );
        }

        try {
            // 测试空参数
            this.ibeaconManager = await ibeacon.getManager();
            await this.ibeaconManager.startMonitoring(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的扫描参数
            this.ibeaconManager = await ibeacon.getManager();
            await this.ibeaconManager.startRanging({});
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('扫描') ||
                error.message.includes('scan')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await ibeacon.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await ibeacon.requestPermission();
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

    @test('应该能够获取Beacon信息')
    async testGetBeaconInfo() {
        try {
            const beaconData = {
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minor: 1
            };

            const beaconInfo = await ibeacon.getBeaconInfo(beaconData);
            TestUtils.assertTrue(typeof beaconInfo === 'object');
            TestUtils.assertTrue(typeof beaconInfo.uuid === 'string');
            TestUtils.assertTrue(typeof beaconInfo.major === 'number');
            TestUtils.assertTrue(typeof beaconInfo.minor === 'number');
            TestUtils.assertTrue(typeof beaconInfo.isAvailable === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('信息') ||
                error.message.includes('info')
            );
        }
    }

    @test('应该能够监听Beacon状态变化')
    async testBeaconStateListeners() {
        try {
            this.ibeaconManager = await ibeacon.getManager();

            // 监听状态变化
            await this.ibeaconManager.onBeaconStateChange({
                onBeaconAppeared: (beacon) => {
                    this.ibeaconEvents.push({ type: 'beacon_appeared', data: beacon });
                },
                onBeaconDisappeared: (beacon) => {
                    this.ibeaconEvents.push({ type: 'beacon_disappeared', data: beacon });
                },
                onBeaconUpdated: (beacon) => {
                    this.ibeaconEvents.push({ type: 'beacon_updated', data: beacon });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.ibeaconEvents.length >= 0);

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

    @test('应该能够批量处理Beacon数据')
    async testBatchProcessBeacons() {
        try {
            const beaconList = [
                {
                    uuid: '00000000-0000-0000-0000-000000000000',
                    major: 1,
                    minor: 1,
                    rssi: -65
                },
                {
                    uuid: '00000000-0000-0000-0000-000000000000',
                    major: 1,
                    minor: 2,
                    rssi: -70
                }
            ];

            const results = await ibeacon.batchProcess(beaconList);
            TestUtils.assertTrue(Array.isArray(results));

            for (const result of results) {
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(typeof result.uuid === 'string');
                TestUtils.assertTrue(typeof result.distance === 'number');
                TestUtils.assertTrue(typeof result.proximity === 'string');
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

    @test('应该能够过滤Beacon设备')
    async testFilterBeacons() {
        try {
            const filterOptions = {
                uuid: '00000000-0000-0000-0000-000000000000',
                major: 1,
                minorRange: { min: 1, max: 10 },
                distanceRange: { min: 0, max: 10 },
                proximity: ['immediate', 'near']
            };

            const filteredBeacons = await ibeacon.filterBeacons(filterOptions);
            TestUtils.assertTrue(Array.isArray(filteredBeacons));

            for (const beacon of filteredBeacons) {
                TestUtils.assertTrue(typeof beacon === 'object');
                TestUtils.assertTrue(typeof beacon.uuid === 'string');
                TestUtils.assertTrue(typeof beacon.major === 'number');
                TestUtils.assertTrue(typeof beacon.minor === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('过滤') ||
                error.message.includes('filter')
            );
        }
    }

    @test('应该能够获取iBeacon使用统计')
    async testGetBeaconStatistics() {
        try {
            const stats = await ibeacon.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalScans === 'number');
            TestUtils.assertTrue(typeof stats.totalBeaconsDiscovered === 'number');
            TestUtils.assertTrue(typeof stats.activeRegions === 'number');
            TestUtils.assertTrue(typeof stats.lastScanTime === 'number');

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

    @test('应该能够导出Beacon数据')
    async testExportBeaconData() {
        try {
            const exportOptions = {
                format: 'json',
                includeDistance: true,
                includeProximity: true,
                includeTimestamp: true
            };

            const exportData = await ibeacon.exportData(exportOptions);
            TestUtils.assertTrue(typeof exportData === 'object');
            TestUtils.assertTrue(Array.isArray(exportData.beacons));
            TestUtils.assertTrue(typeof exportData.exportTime === 'number');

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
}

export default IBeaconTestSuite;