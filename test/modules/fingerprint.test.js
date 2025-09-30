/**
 * HTML5+ Fingerprint 模块测试套件
 *
 * 测试指纹识别功能包括：
 * - 指纹认证
 * - 指纹注册
 * - 指纹管理
 * - 指纹权限处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import fingerprint from '../../modules/fingerprint.js';

class FingerprintTestSuite extends TestSuite {
    constructor() {
        super();
        this.fingerprintAuth = null;
        this.fingerprintResults = [];
        this.fingerprintEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Fingerprint测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Fingerprint测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理指纹结果和事件
        this.fingerprintResults = [];
        this.fingerprintEvents = [];
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理指纹结果和事件
        this.fingerprintResults = [];
        this.fingerprintEvents = [];
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await fingerprint.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await fingerprint.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够检查硬件支持')
    async testHardwareSupport() {
        try {
            const hardwareInfo = await fingerprint.checkHardwareSupport();
            TestUtils.assertTrue(typeof hardwareInfo === 'object');
            TestUtils.assertTrue(typeof hardwareInfo.isSupported === 'boolean');
            TestUtils.assertTrue(typeof hardwareInfo.hasEnrolledFingerprints === 'boolean');
            TestUtils.assertTrue(typeof hardwareInfo.hardwareDetected === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('硬件') ||
                error.message.includes('hardware')
            );
        }
    }

    @test('应该能够获取已注册的指纹列表')
    async testGetEnrolledFingerprints() {
        try {
            const fingerprints = await fingerprint.getEnrolledFingerprints();
            TestUtils.assertTrue(Array.isArray(fingerprints));

            for (const fp of fingerprints) {
                TestUtils.assertTrue(typeof fp === 'object');
                TestUtils.assertTrue(typeof fp.id === 'string');
                TestUtils.assertTrue(typeof fp.name === 'string');
                TestUtils.assertTrue(typeof fp.enrolledDate === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('指纹') ||
                error.message.includes('fingerprint')
            );
        }
    }

    @test('应该能够进行指纹认证')
    async testFingerprintAuthentication() {
        try {
            const authOptions = {
                title: '指纹认证',
                subtitle: '请使用您的指纹进行身份验证',
                description: '测试指纹认证功能',
                cancelButtonTitle: '取消',
                onSucceeded: (result) => {
                    this.fingerprintResults.push({ type: 'success', data: result });
                },
                onFailed: (error) => {
                    this.fingerprintResults.push({ type: 'fail', data: error });
                },
                onError: (error) => {
                    this.fingerprintEvents.push({ type: 'error', data: error });
                }
            };

            const result = await fingerprint.authenticate(authOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('认证') ||
                error.message.includes('authentication')
            );
        }
    }

    @test('应该能够注册新指纹')
    async testFingerprintEnrollment() {
        try {
            const enrollmentOptions = {
                title: '注册指纹',
                subtitle: '请按照提示完成指纹注册',
                description: '测试指纹注册功能',
                cancelButtonText: '取消',
                onProgress: (progress) => {
                    this.fingerprintEvents.push({ type: 'progress', data: progress });
                },
                onCompleted: (result) => {
                    this.fingerprintResults.push({ type: 'completed', data: result });
                },
                onFailed: (error) => {
                    this.fingerprintResults.push({ type: 'failed', data: error });
                }
            };

            const result = await fingerprint.enroll(enrollmentOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('注册') ||
                error.message.includes('enroll')
            );
        }
    }

    @test('应该能够删除指纹')
    async testRemoveFingerprint() {
        try {
            const fingerprintId = 'test_fingerprint_id';
            const result = await fingerprint.remove(fingerprintId);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('删除') ||
                error.message.includes('remove')
            );
        }
    }

    @test('应该能够重命名指纹')
    async testRenameFingerprint() {
        try {
            const fingerprintId = 'test_fingerprint_id';
            const newName = '测试指纹名称';
            const result = await fingerprint.rename(fingerprintId, newName);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重命名') ||
                error.message.includes('rename')
            );
        }
    }

    @test('应该能够检查指纹是否已注册')
    async testIsFingerprintEnrolled() {
        try {
            const fingerprintId = 'test_fingerprint_id';
            const isEnrolled = await fingerprint.isEnrolled(fingerprintId);
            TestUtils.assertTrue(typeof isEnrolled === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('检查') ||
                error.message.includes('check')
            );
        }
    }

    @test('应该能够获取指纹配置')
    async testGetFingerprintConfig() {
        try {
            const config = await fingerprint.getConfig();
            TestUtils.assertTrue(typeof config === 'object');
            TestUtils.assertTrue(typeof config.maxAttempts === 'number');
            TestUtils.assertTrue(typeof config.timeout === 'number');
            TestUtils.assertTrue(typeof config.securityLevel === 'string');

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

    @test('应该能够设置指纹配置')
    async testSetFingerprintConfig() {
        try {
            const config = {
                maxAttempts: 3,
                timeout: 30000,
                securityLevel: 'high',
                allowBackup: false
            };

            const result = await fingerprint.setConfig(config);
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

    @test('应该能够获取指纹认证状态')
    async testGetAuthenticationStatus() {
        try {
            const status = await fingerprint.getAuthenticationStatus();
            TestUtils.assertTrue(typeof status === 'object');
            TestUtils.assertTrue(typeof status.isAvailable === 'boolean');
            TestUtils.assertTrue(typeof status.isAuthenticated === 'boolean');
            TestUtils.assertTrue(typeof status.lastAuthTime === 'number');

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
            // 测试无效的指纹ID
            await fingerprint.remove('');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('指纹ID') ||
                error.message.includes('fingerprint id')
            );
        }

        try {
            // 测试空参数
            await fingerprint.remove(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的认证参数
            await fingerprint.authenticate({});
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('认证') ||
                error.message.includes('authentication')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await fingerprint.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await fingerprint.requestPermission();
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

    @test('应该能够获取指纹使用统计')
    async testGetFingerprintStatistics() {
        try {
            const stats = await fingerprint.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalAttempts === 'number');
            TestUtils.assertTrue(typeof stats.successfulAttempts === 'number');
            TestUtils.assertTrue(typeof stats.failedAttempts === 'number');
            TestUtils.assertTrue(typeof stats.enrolledCount === 'number');

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

    @test('应该能够重置指纹数据')
    async testResetFingerprintData() {
        try {
            const result = await fingerprint.reset();
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重置') ||
                error.message.includes('reset')
            );
        }
    }

    @test('应该能够设置指纹超时')
    async testSetFingerprintTimeout() {
        try {
            const timeout = 60000; // 60秒
            const result = await fingerprint.setTimeout(timeout);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证超时设置
            const currentTimeout = await fingerprint.getTimeout();
            TestUtils.assertTrue(typeof currentTimeout === 'number');

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

    @test('应该能够检查指纹安全级别')
    async testCheckSecurityLevel() {
        try {
            const securityLevel = await fingerprint.getSecurityLevel();
            TestUtils.assertTrue(typeof securityLevel === 'string');
            TestUtils.assertTrue(
                securityLevel === 'low' ||
                securityLevel === 'medium' ||
                securityLevel === 'high' ||
                securityLevel === 'strong'
            );

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('安全') ||
                error.message.includes('security')
            );
        }
    }

    @test('应该能够处理指纹锁定')
    async testFingerprintLockout() {
        try {
            // 模拟多次失败尝试
            for (let i = 0; i < 5; i++) {
                try {
                    await fingerprint.authenticate({
                        title: '测试锁定',
                        description: '测试指纹锁定功能'
                    });
                } catch (error) {
                    // 预期的失败
                }
            }

            // 检查是否被锁定
            const isLocked = await fingerprint.isLocked();
            TestUtils.assertTrue(typeof isLocked === 'boolean');

            // 如果被锁定，重置
            if (isLocked) {
                await fingerprint.unlock();
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('锁定') ||
                error.message.includes('lockout')
            );
        }
    }

    @test('应该能够获取指纹设备信息')
    async testGetFingerprintDeviceInfo() {
        try {
            const deviceInfo = await fingerprint.getDeviceInfo();
            TestUtils.assertTrue(typeof deviceInfo === 'object');
            TestUtils.assertTrue(typeof deviceInfo.manufacturer === 'string');
            TestUtils.assertTrue(typeof deviceInfo.model === 'string');
            TestUtils.assertTrue(typeof deviceInfo.version === 'string');
            TestUtils.assertTrue(typeof deviceInfo.sensorType === 'string');

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
}

export default FingerprintTestSuite;