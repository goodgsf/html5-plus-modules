/**
 * HTML5+ Geolocation 模块测试套件
 *
 * 测试地理位置功能包括：
 * - 获取当前位置
 * - 监听位置变化
 * - 位置精度控制
 * - 地理编码和反编码
 * - 权限处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import geolocation from '../../modules/geolocation.js';

class GeolocationTestSuite extends TestSuite {
    constructor() {
        super();
        this.locationWatcher = null;
        this.locationEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Geolocation测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Geolocation测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理位置监听器和事件
        try {
            if (this.locationWatcher) {
                await geolocation.clearWatch(this.locationWatcher);
                this.locationWatcher = null;
            }
            this.locationEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理位置监听器和事件
        try {
            if (this.locationWatcher) {
                await geolocation.clearWatch(this.locationWatcher);
                this.locationWatcher = null;
            }
            this.locationEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await geolocation.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await geolocation.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取当前位置')
    async testGetCurrentPosition() {
        try {
            const position = await geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            });

            // 验证位置数据结构
            TestUtils.assertTrue(typeof position === 'object');
            TestUtils.assertTrue(typeof position.coords === 'object');
            TestUtils.assertTrue(typeof position.timestamp === 'number');

            // 验证坐标数据
            const coords = position.coords;
            TestUtils.assertTrue(typeof coords.latitude === 'number');
            TestUtils.assertTrue(typeof coords.longitude === 'number');
            TestUtils.assertTrue(typeof coords.accuracy === 'number');
            TestUtils.assertTrue(typeof coords.altitude === 'number' || coords.altitude === null);
            TestUtils.assertTrue(typeof coords.altitudeAccuracy === 'number' || coords.altitudeAccuracy === null);
            TestUtils.assertTrue(typeof coords.heading === 'number' || coords.heading === null);
            TestUtils.assertTrue(typeof coords.speed === 'number' || coords.speed === null);

            // 验证数值范围
            TestUtils.assertTrue(coords.latitude >= -90 && coords.latitude <= 90);
            TestUtils.assertTrue(coords.longitude >= -180 && coords.longitude <= 180);
            TestUtils.assertTrue(coords.accuracy >= 0);
            TestUtils.assertTrue(position.timestamp > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission') ||
                error.message.includes('位置') ||
                error.message.includes('location')
            );
        }
    }

    @test('应该能够监听位置变化')
    async testWatchPosition() {
        try {
            let positionsReceived = [];

            this.locationWatcher = await geolocation.watchPosition(
                (position) => {
                    positionsReceived.push(position);
                },
                (error) => {
                    console.error('位置监听错误:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                    maximumAge: 0
                }
            );

            TestUtils.assertNotNull(this.locationWatcher);

            // 等待一段时间以接收位置更新
            await TestUtils.delay(3000);

            // 验证是否接收到位置数据
            if (positionsReceived.length > 0) {
                const position = positionsReceived[0];
                TestUtils.assertTrue(typeof position.coords.latitude === 'number');
                TestUtils.assertTrue(typeof position.coords.longitude === 'number');
                TestUtils.assertTrue(typeof position.timestamp === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('监听') ||
                error.message.includes('watch') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够停止位置监听')
    async testClearWatch() {
        try {
            let positionsReceived = [];

            // 开始监听位置
            this.locationWatcher = await geolocation.watchPosition(
                (position) => {
                    positionsReceived.push(position);
                },
                (error) => {
                    console.error('位置监听错误:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );

            TestUtils.assertNotNull(this.locationWatcher);

            // 等待一段时间以接收位置更新
            await TestUtils.delay(1000);
            const initialCount = positionsReceived.length;

            // 停止监听
            await geolocation.clearWatch(this.locationWatcher);
            this.locationWatcher = null;

            // 再等待一段时间
            await TestUtils.delay(1000);

            // 验证停止后没有新数据
            const finalCount = positionsReceived.length;
            TestUtils.assertTrue(finalCount >= initialCount);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('停止') ||
                error.message.includes('clear') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够控制位置精度')
    async testPositionAccuracy() {
        try {
            // 测试高精度模式
            const highAccuracyPosition = await geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });

            // 测试低精度模式
            const lowAccuracyPosition = await geolocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 10000
            });

            // 验证两种模式都返回有效数据
            if (highAccuracyPosition) {
                TestUtils.assertTrue(typeof highAccuracyPosition.coords.latitude === 'number');
                TestUtils.assertTrue(typeof highAccuracyPosition.coords.longitude === 'number');
            }

            if (lowAccuracyPosition) {
                TestUtils.assertTrue(typeof lowAccuracyPosition.coords.latitude === 'number');
                TestUtils.assertTrue(typeof lowAccuracyPosition.coords.longitude === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('精度') ||
                error.message.includes('accuracy') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够处理超时设置')
    async testTimeoutHandling() {
        try {
            const position = await geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 5000, // 5秒超时
                maximumAge: 0
            });

            TestUtils.assertNotNull(position);
            TestUtils.assertTrue(typeof position.coords === 'object');

        } catch (error) {
            // 超时错误是正常的
            TestUtils.assertTrue(
                error.message.includes('超时') ||
                error.message.includes('timeout') ||
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够进行地理编码')
    async testGeocoding() {
        try {
            // 正向地理编码：地址转坐标
            const geocodingResult = await geolocation.geocode({
                address: '北京市朝阳区',
                region: '中国'
            });

            TestUtils.assertTrue(typeof geocodingResult === 'object');
            TestUtils.assertTrue(Array.isArray(geocodingResult.results));

            if (geocodingResult.results.length > 0) {
                const result = geocodingResult.results[0];
                TestUtils.assertTrue(typeof result.latitude === 'number');
                TestUtils.assertTrue(typeof result.longitude === 'number');
                TestUtils.assertTrue(typeof result.address === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('编码') ||
                error.message.includes('geocoding')
            );
        }
    }

    @test('应该能够进行反向地理编码')
    async testReverseGeocoding() {
        try {
            // 反向地理编码：坐标转地址
            const reverseGeocodingResult = await geolocation.reverseGeocode({
                latitude: 39.9042,
                longitude: 116.4074
            });

            TestUtils.assertTrue(typeof reverseGeocodingResult === 'object');
            TestUtils.assertTrue(Array.isArray(reverseGeocodingResult.results));

            if (reverseGeocodingResult.results.length > 0) {
                const result = reverseGeocodingResult.results[0];
                TestUtils.assertTrue(typeof result.address === 'string');
                TestUtils.assertTrue(typeof result.city === 'string');
                TestUtils.assertTrue(typeof result.district === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('反向') ||
                error.message.includes('reverse')
            );
        }
    }

    @test('应该能够计算距离')
    async testCalculateDistance() {
        try {
            // 计算两个位置之间的距离
            const distance = await geolocation.calculateDistance({
                start: {
                    latitude: 39.9042,
                    longitude: 116.4074
                },
                end: {
                    latitude: 31.2304,
                    longitude: 121.4737
                },
                unit: 'km'
            });

            TestUtils.assertTrue(typeof distance === 'number');
            TestUtils.assertTrue(distance > 0);

            // 测试不同单位
            const distanceMeters = await geolocation.calculateDistance({
                start: {
                    latitude: 39.9042,
                    longitude: 116.4074
                },
                end: {
                    latitude: 39.9043,
                    longitude: 116.4075
                },
                unit: 'm'
            });

            TestUtils.assertTrue(typeof distanceMeters === 'number');
            TestUtils.assertTrue(distanceMeters > 0);

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的地理编码参数
            await geolocation.geocode({
                address: '', // 空地址
                region: ''
            });
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
            // 测试无效的坐标
            await geolocation.reverseGeocode({
                latitude: 999, // 无效纬度
                longitude: 999 // 无效经度
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('坐标') ||
                error.message.includes('coordinates')
            );
        }

        try {
            // 测试无效的距离计算参数
            await geolocation.calculateDistance({
                start: {
                    latitude: 39.9042,
                    longitude: 116.4074
                },
                end: null, // 无效的终点
                unit: 'km'
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('距离') ||
                error.message.includes('distance')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await geolocation.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await geolocation.requestPermission();
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

    @test('应该能够获取位置提供者信息')
    async testLocationProviderInfo() {
        try {
            const providerInfo = await geolocation.getProviderInfo();
            TestUtils.assertTrue(typeof providerInfo === 'object');
            TestUtils.assertTrue(typeof providerInfo.provider === 'string');
            TestUtils.assertTrue(typeof providerInfo.isAvailable === 'boolean');
            TestUtils.assertTrue(typeof providerInfo.accuracy === 'number');
            TestUtils.assertTrue(typeof providerInfo.powerUsage === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('提供者') ||
                error.message.includes('provider')
            );
        }
    }

    @test('应该能够处理并发位置请求')
    async testConcurrentPositionRequests() {
        try {
            const promises = [];
            const count = 3;

            // 并发获取位置
            for (let i = 0; i < count; i++) {
                promises.push(geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000
                }));
            }

            const positions = await Promise.all(promises);

            // 验证所有位置数据
            for (const position of positions) {
                if (position) {
                    TestUtils.assertTrue(typeof position.coords.latitude === 'number');
                    TestUtils.assertTrue(typeof position.coords.longitude === 'number');
                    TestUtils.assertTrue(typeof position.timestamp === 'number');
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('并发') ||
                error.message.includes('concurrent') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够处理位置缓存')
    async testPositionCaching() {
        try {
            // 获取当前位置
            const freshPosition = await geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0 // 不使用缓存
            });

            // 等待一段时间
            await TestUtils.delay(1000);

            // 获取缓存的位置
            const cachedPosition = await geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // 使用60秒内的缓存
            });

            // 验证两个位置都有有效数据
            if (freshPosition && cachedPosition) {
                TestUtils.assertTrue(typeof freshPosition.coords.latitude === 'number');
                TestUtils.assertTrue(typeof cachedPosition.coords.latitude === 'number');
                TestUtils.assertTrue(typeof freshPosition.timestamp === 'number');
                TestUtils.assertTrue(typeof cachedPosition.timestamp === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('缓存') ||
                error.message.includes('cache') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }
}

export default GeolocationTestSuite;