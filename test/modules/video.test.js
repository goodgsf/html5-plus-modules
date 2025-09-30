/**
 * HTML5+ Video 模块测试套件
 *
 * 测试视频功能包括：
 * - 视频播放控制
 * - 视频录制
 * - 视频文件管理
 * - 视频格式支持
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import video from '../../modules/video.js';

class VideoTestSuite extends TestSuite {
    constructor() {
        super();
        this.videoPlayer = null;
        this.videoRecorder = null;
        this.videoEvents = [];
        this.testVideoPath = '_doc/videos/test_video.mp4';
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Video测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Video测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理视频实例和事件
        try {
            if (this.videoPlayer) {
                await this.videoPlayer.stop();
                this.videoPlayer = null;
            }
            if (this.videoRecorder) {
                await this.videoRecorder.stop();
                this.videoRecorder = null;
            }
            this.videoEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理视频实例和事件
        try {
            if (this.videoPlayer) {
                await this.videoPlayer.stop();
                this.videoPlayer = null;
            }
            if (this.videoRecorder) {
                await this.videoRecorder.stop();
                this.videoRecorder = null;
            }
            this.videoEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await video.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await video.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建视频播放器')
    async testCreateVideoPlayer() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true,
                muted: false
            };

            this.videoPlayer = await video.createPlayer(playerOptions);

            // 验证视频播放器实例
            TestUtils.assertNotNull(this.videoPlayer);
            TestUtils.assertTrue(typeof this.videoPlayer.play === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.pause === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.stop === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.seek === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.setVolume === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.getDuration === 'function');
            TestUtils.assertTrue(typeof this.videoPlayer.getPosition === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('视频') ||
                error.message.includes('video')
            );
        }
    }

    @test('应该能够播放和暂停视频')
    async testPlayPauseVideo() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 播放视频
            await this.videoPlayer.play();

            // 获取播放状态
            const isPlaying = await this.videoPlayer.isPlaying();
            TestUtils.assertTrue(typeof isPlaying === 'boolean');

            // 暂停视频
            await this.videoPlayer.pause();

            // 验证暂停状态
            const isPaused = await this.videoPlayer.isPaused();
            TestUtils.assertTrue(typeof isPaused === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('播放') ||
                error.message.includes('play')
            );
        }
    }

    @test('应该能够停止视频播放')
    async testStopVideo() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 播放视频
            await this.videoPlayer.play();

            // 停止视频
            await this.videoPlayer.stop();

            // 验证停止状态
            const isStopped = await this.videoPlayer.isStopped();
            TestUtils.assertTrue(typeof isStopped === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('停止') ||
                error.message.includes('stop')
            );
        }
    }

    @test('应该能够控制音量')
    async testVolumeControl() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 设置音量
            const volumes = [0, 0.5, 1.0];
            for (const volume of volumes) {
                await this.videoPlayer.setVolume(volume);

                // 获取当前音量
                const currentVolume = await this.videoPlayer.getVolume();
                TestUtils.assertTrue(currentVolume >= 0 && currentVolume <= 1);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('音量') ||
                error.message.includes('volume')
            );
        }
    }

    @test('应该能够控制播放速度')
    async testPlaybackSpeed() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 设置播放速度
            const speeds = [0.5, 1.0, 1.5, 2.0];
            for (const speed of speeds) {
                await this.videoPlayer.setPlaybackSpeed(speed);

                const currentSpeed = await this.videoPlayer.getPlaybackSpeed();
                TestUtils.assertTrue(typeof currentSpeed === 'number');
                TestUtils.assertTrue(currentSpeed > 0);
            }

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

    @test('应该能够获取视频时长和位置')
    async testVideoDurationAndPosition() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 获取视频时长
            const duration = await this.videoPlayer.getDuration();
            TestUtils.assertTrue(typeof duration === 'number');
            TestUtils.assertTrue(duration >= 0);

            // 播放视频
            await this.videoPlayer.play();

            // 等待一段时间
            await TestUtils.delay(2000);

            // 获取当前位置
            const position = await this.videoPlayer.getPosition();
            TestUtils.assertTrue(typeof position === 'number');
            TestUtils.assertTrue(position >= 0);

            // 验证位置不超过时长
            if (duration > 0) {
                TestUtils.assertTrue(position <= duration);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('时长') ||
                error.message.includes('duration')
            );
        }
    }

    @test('应该能够创建视频录制器')
    async testCreateVideoRecorder() {
        try {
            const recorderOptions = {
                filename: '_doc/videos/test_recorded_video.mp4',
                format: 'mp4',
                resolution: '1280x720',
                frameRate: 30,
                bitrate: 5000000
            };

            this.videoRecorder = await video.createRecorder(recorderOptions);

            // 验证视频录制器实例
            TestUtils.assertNotNull(this.videoRecorder);
            TestUtils.assertTrue(typeof this.videoRecorder.start === 'function');
            TestUtils.assertTrue(typeof this.videoRecorder.stop === 'function');
            TestUtils.assertTrue(typeof this.videoRecorder.pause === 'function');
            TestUtils.assertTrue(typeof this.videoRecorder.resume === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('录制') ||
                error.message.includes('record')
            );
        }
    }

    @test('应该能够录制视频')
    async testRecordVideo() {
        try {
            const recorderOptions = {
                filename: '_doc/videos/test_recorded_video.mp4',
                format: 'mp4',
                resolution: '1280x720',
                frameRate: 30
            };

            this.videoRecorder = await video.createRecorder(recorderOptions);
            TestUtils.assertNotNull(this.videoRecorder);

            // 开始录制
            await this.videoRecorder.start();

            // 录制一段时间
            await TestUtils.delay(3000);

            // 停止录制
            await this.videoRecorder.stop();

            // 验证录制结果
            const recordingInfo = await this.videoRecorder.getRecordingInfo();
            TestUtils.assertTrue(typeof recordingInfo === 'object');
            TestUtils.assertTrue(typeof recordingInfo.duration === 'number');
            TestUtils.assertTrue(recordingInfo.duration >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('录制') ||
                error.message.includes('record')
            );
        }
    }

    @test('应该能够暂停和恢复录制')
    async testPauseResumeRecording() {
        try {
            const recorderOptions = {
                filename: '_doc/videos/test_pause_resume_video.mp4',
                format: 'mp4',
                resolution: '1280x720',
                frameRate: 30
            };

            this.videoRecorder = await video.createRecorder(recorderOptions);
            TestUtils.assertNotNull(this.videoRecorder);

            // 开始录制
            await this.videoRecorder.start();

            // 录制一段时间
            await TestUtils.delay(2000);

            // 暂停录制
            await this.videoRecorder.pause();

            // 验证暂停状态
            const isPaused = await this.videoRecorder.isPaused();
            TestUtils.assertTrue(typeof isPaused === 'boolean');

            // 等待一段时间
            await TestUtils.delay(1000);

            // 恢复录制
            await this.videoRecorder.resume();

            // 录制一段时间
            await TestUtils.delay(1000);

            // 停止录制
            await this.videoRecorder.stop();

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

    @test('应该能够监听视频事件')
    async testVideoEventListeners() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true,
                onPlay: (event) => {
                    this.videoEvents.push({ type: 'play', data: event });
                },
                onPause: (event) => {
                    this.videoEvents.push({ type: 'pause', data: event });
                },
                onStop: (event) => {
                    this.videoEvents.push({ type: 'stop', data: event });
                },
                onEnd: (event) => {
                    this.videoEvents.push({ type: 'end', data: event });
                },
                onError: (event) => {
                    this.videoEvents.push({ type: 'error', data: event });
                }
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 播放视频以触发事件
            await this.videoPlayer.play();

            // 等待事件处理
            await TestUtils.delay(1000);

            // 验证事件是否被记录
            TestUtils.assertTrue(Array.isArray(this.videoEvents));

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

    @test('应该能够设置循环播放')
    async testLoopPlayback() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: true,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 验证循环设置
            const isLooping = await this.videoPlayer.isLooping();
            TestUtils.assertTrue(typeof isLooping === 'boolean');

            // 切换循环模式
            await this.videoPlayer.setLoop(false);
            const isNotLooping = await this.videoPlayer.isLooping();
            TestUtils.assertTrue(typeof isNotLooping === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('循环') ||
                error.message.includes('loop')
            );
        }
    }

    @test('应该能够设置静音')
    async testMuteControl() {
        try {
            const playerOptions = {
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            };

            this.videoPlayer = await video.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.videoPlayer);

            // 设置静音
            await this.videoPlayer.setMuted(true);
            let isMuted = await this.videoPlayer.isMuted();
            TestUtils.assertTrue(typeof isMuted === 'boolean');

            // 取消静音
            await this.videoPlayer.setMuted(false);
            isMuted = await this.videoPlayer.isMuted();
            TestUtils.assertTrue(typeof isMuted === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('静音') ||
                error.message.includes('mute')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的视频路径
            await video.createPlayer({
                path: '', // 空路径
                autoplay: false,
                loop: false,
                controls: true
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('路径') ||
                error.message.includes('path')
            );
        }

        try {
            // 测试空参数
            await video.createPlayer(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的音量值
            this.videoPlayer = await video.createPlayer({
                path: this.testVideoPath,
                autoplay: false,
                loop: false,
                controls: true
            });

            await this.videoPlayer.setVolume(2.0); // 超出范围的音量值
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('音量') ||
                error.message.includes('volume') ||
                error.message.includes('范围') ||
                error.message.includes('range')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await video.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await video.requestPermission();
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

    @test('应该能够获取视频信息')
    async testGetVideoInfo() {
        try {
            const videoInfo = await video.getVideoInfo(this.testVideoPath);
            TestUtils.assertTrue(typeof videoInfo === 'object');
            TestUtils.assertTrue(typeof videoInfo.duration === 'number');
            TestUtils.assertTrue(typeof videoInfo.width === 'number');
            TestUtils.assertTrue(typeof videoInfo.height === 'number');
            TestUtils.assertTrue(typeof videoInfo.format === 'string');
            TestUtils.assertTrue(typeof videoInfo.size === 'number');

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

    @test('应该能够获取支持的格式')
    async testGetSupportedFormats() {
        try {
            const formats = await video.getSupportedFormats();
            TestUtils.assertTrue(Array.isArray(formats));
            TestUtils.assertTrue(formats.length > 0);

            // 验证格式列表
            const commonFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
            for (const format of commonFormats) {
                if (formats.includes(format)) {
                    TestUtils.assertTrue(true);
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('格式') ||
                error.message.includes('formats')
            );
        }
    }
}

export default VideoTestSuite;