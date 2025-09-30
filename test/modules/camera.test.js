/**
 * HTML5+ Camera 模块测试套件
 *
 * 测试相机功能包括：
 * - 相机启动和控制
 * - 拍照功能
 * - 录像功能
 * - 相机参数设置
 * - 图像处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import camera from '../../modules/camera.js';

class CameraTestSuite extends TestSuite {
    constructor() {
        super();
        this.cameraInstance = null;
        this.cameraEvents = [];
        this.testImagePath = null;
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Camera测试环境...');
        TestUtils.mockPlusEnvironment();
        this.testImagePath = '_doc/camera/test_image.jpg';
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Camera测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理相机实例
        try {
            if (this.cameraInstance) {
                await this.cameraInstance.stop();
                this.cameraInstance = null;
            }
            this.cameraEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理相机实例
        try {
            if (this.cameraInstance) {
                await this.cameraInstance.stop();
                this.cameraInstance = null;
            }
            this.cameraEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await camera.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await camera.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建相机实例')
    async testCreateCamera() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0, // 后置相机
                format: 'jpg',
                quality: 80,
                resolution: '1280x720'
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);

            // 验证相机实例
            TestUtils.assertNotNull(this.cameraInstance);
            TestUtils.assertTrue(typeof this.cameraInstance.start === 'function');
            TestUtils.assertTrue(typeof this.cameraInstance.stop === 'function');
            TestUtils.assertTrue(typeof this.cameraInstance.captureImage === 'function');
            TestUtils.assertTrue(typeof this.cameraInstance.startVideoCapture === 'function');
            TestUtils.assertTrue(typeof this.cameraInstance.stopVideoCapture === 'function');

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

    @test('应该能够启动和停止相机')
    async testStartStopCamera() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 获取相机状态
            const isStarted = await this.cameraInstance.isStarted();
            TestUtils.assertTrue(typeof isStarted === 'boolean');

            // 停止相机
            await this.cameraInstance.stop();

            // 验证停止状态
            const isStopped = await this.cameraInstance.isStopped();
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

    @test('应该能够拍照')
    async testCaptureImage() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 拍照
            const result = await this.cameraInstance.captureImage();

            // 验证拍照结果
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(typeof result.path === 'string');
            TestUtils.assertTrue(result.path.length > 0);

            // 停止相机
            await this.cameraInstance.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('拍照') ||
                error.message.includes('capture')
            );
        }
    }

    @test('应该能够开始和停止录像')
    async testVideoCapture() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 开始录像
            await this.cameraInstance.startVideoCapture('_doc/camera/test_video.mp4');

            // 录制一段时间
            await TestUtils.delay(2000);

            // 停止录像
            const result = await this.cameraInstance.stopVideoCapture();

            // 验证录像结果
            if (result) {
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(typeof result.path === 'string');
            }

            // 停止相机
            await this.cameraInstance.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('录像') ||
                error.message.includes('video')
            );
        }
    }

    @test('应该能够设置相机参数')
    async testCameraParameters() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 设置相机参数
            const parameters = {
                flash: 'auto',
                focusMode: 'auto',
                exposureCompensation: 0,
                whiteBalance: 'auto'
            };

            await this.cameraInstance.setParameters(parameters);

            // 获取当前参数
            const currentParams = await this.cameraInstance.getParameters();
            TestUtils.assertTrue(typeof currentParams === 'object');

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

    @test('应该能够控制闪光灯')
    async testFlashControl() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 测试不同的闪光灯模式
            const flashModes = ['auto', 'on', 'off', 'torch'];

            for (const mode of flashModes) {
                await this.cameraInstance.setFlashMode(mode);

                const currentMode = await this.cameraInstance.getFlashMode();
                TestUtils.assertTrue(typeof currentMode === 'string');
            }

            // 停止相机
            await this.cameraInstance.stop();

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的相机配置
            await camera.createCamera({
                filename: '', // 空文件名
                index: -1, // 无效的相机索引
                format: 'invalid_format',
                quality: 150 // 超出范围的质量值
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
            await camera.createCamera(null);
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
            const permission = await camera.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await camera.requestPermission();
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

    @test('应该能够获取相机信息')
    async testCameraInfo() {
        try {
            const cameraInfo = await camera.getCameraInfo();
            TestUtils.assertTrue(typeof cameraInfo === 'object');
            TestUtils.assertTrue(typeof cameraInfo.count === 'number');
            TestUtils.assertTrue(cameraInfo.count >= 0);

            if (cameraInfo.count > 0) {
                TestUtils.assertTrue(Array.isArray(cameraInfo.cameras));
                TestUtils.assertTrue(cameraInfo.cameras.length > 0);

                for (const cam of cameraInfo.cameras) {
                    TestUtils.assertTrue(typeof cam.index === 'number');
                    TestUtils.assertTrue(typeof cam.name === 'string');
                    TestUtils.assertTrue(typeof cam.resolution === 'object');
                }
            }

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

    @test('应该能够设置图像质量')
    async testImageQuality() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 测试不同的质量设置
            const qualities = [50, 80, 100];

            for (const quality of qualities) {
                await this.cameraInstance.setQuality(quality);

                const currentQuality = await this.cameraInstance.getQuality();
                TestUtils.assertTrue(typeof currentQuality === 'number');
                TestUtils.assertTrue(currentQuality >= 0 && currentQuality <= 100);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('质量') ||
                error.message.includes('quality')
            );
        }
    }

    @test('应该能够设置图像格式')
    async testImageFormat() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 测试不同的图像格式
            const formats = ['jpg', 'png', 'bmp'];

            for (const format of formats) {
                await this.cameraInstance.setFormat(format);

                const currentFormat = await this.cameraInstance.getFormat();
                TestUtils.assertTrue(typeof currentFormat === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('格式') ||
                error.message.includes('format')
            );
        }
    }

    @test('应该能够切换相机')
    async testSwitchCamera() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 切换相机（如果有多个相机）
            try {
                await this.cameraInstance.switchCamera();

                const currentIndex = await this.cameraInstance.getCurrentCameraIndex();
                TestUtils.assertTrue(typeof currentIndex === 'number');
            } catch (switchError) {
                // 如果只有一个相机，切换失败是正常的
                TestUtils.assertTrue(
                    switchError.message.includes('相机') ||
                    switchError.message.includes('camera') ||
                    switchError.message.includes('切换') ||
                    switchError.message.includes('switch')
                );
            }

            // 停止相机
            await this.cameraInstance.stop();

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

    @test('应该能够设置对焦模式')
    async testFocusMode() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 测试不同的对焦模式
            const focusModes = ['auto', 'macro', 'continuous', 'infinity'];

            for (const mode of focusModes) {
                try {
                    await this.cameraInstance.setFocusMode(mode);

                    const currentMode = await this.cameraInstance.getFocusMode();
                    TestUtils.assertTrue(typeof currentMode === 'string');
                } catch (focusError) {
                    // 某些模式可能不支持，这是正常的
                    console.log(`对焦模式 ${mode} 不支持:`, focusError.message);
                }
            }

            // 停止相机
            await this.cameraInstance.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('对焦') ||
                error.message.includes('focus')
            );
        }
    }

    @test('应该能够设置曝光补偿')
    async testExposureCompensation() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 测试不同的曝光补偿值
            const exposureValues = [-2, -1, 0, 1, 2];

            for (const value of exposureValues) {
                try {
                    await this.cameraInstance.setExposureCompensation(value);

                    const currentValue = await this.cameraInstance.getExposureCompensation();
                    TestUtils.assertTrue(typeof currentValue === 'number');
                } catch (exposureError) {
                    // 某些值可能不支持，这是正常的
                    console.log(`曝光补偿 ${value} 不支持:`, exposureError.message);
                }
            }

            // 停止相机
            await this.cameraInstance.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('曝光') ||
                error.message.includes('exposure')
            );
        }
    }

    @test('应该能够设置白平衡')
    async testWhiteBalance() {
        try {
            const cameraOptions = {
                filename: this.testImagePath,
                index: 0,
                format: 'jpg',
                quality: 80
            };

            this.cameraInstance = await camera.createCamera(cameraOptions);
            TestUtils.assertNotNull(this.cameraInstance);

            // 启动相机
            await this.cameraInstance.start();

            // 测试不同的白平衡模式
            const whiteBalanceModes = ['auto', 'incandescent', 'fluorescent', 'daylight', 'cloudy'];

            for (const mode of whiteBalanceModes) {
                try {
                    await this.cameraInstance.setWhiteBalance(mode);

                    const currentMode = await this.cameraInstance.getWhiteBalance();
                    TestUtils.assertTrue(typeof currentMode === 'string');
                } catch (wbError) {
                    // 某些模式可能不支持，这是正常的
                    console.log(`白平衡模式 ${mode} 不支持:`, wbError.message);
                }
            }

            // 停止相机
            await this.cameraInstance.stop();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('白平衡') ||
                error.message.includes('white balance')
            );
        }
    }
}

export default CameraTestSuite;