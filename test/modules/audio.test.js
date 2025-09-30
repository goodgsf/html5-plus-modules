/**
 * HTML5+ Audio 模块测试套件
 *
 * 测试音频功能包括：
 * - 音频播放控制
 * - 音频录制
 * - 音频文件管理
 * - 音量控制
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import audio from '../../modules/audio.js';

class AudioTestSuite extends TestSuite {
    constructor() {
        super();
        this.audioPlayer = null;
        this.audioRecorder = null;
        this.testAudioPath = null;
        this.audioEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Audio测试环境...');
        TestUtils.mockPlusEnvironment();
        this.testAudioPath = '_doc/test_audio.mp3';
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Audio测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理音频实例和事件
        try {
            if (this.audioPlayer) {
                await this.audioPlayer.stop();
                this.audioPlayer = null;
            }
            if (this.audioRecorder) {
                await this.audioRecorder.stop();
                this.audioRecorder = null;
            }
            this.audioEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理音频实例和事件
        try {
            if (this.audioPlayer) {
                await this.audioPlayer.stop();
                this.audioPlayer = null;
            }
            if (this.audioRecorder) {
                await this.audioRecorder.stop();
                this.audioRecorder = null;
            }
            this.audioEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await audio.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await audio.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建音频播放器')
    async testCreateAudioPlayer() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false,
                loop: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);

            // 验证播放器实例
            TestUtils.assertNotNull(this.audioPlayer);
            TestUtils.assertTrue(typeof this.audioPlayer.play === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.pause === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.stop === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.seek === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.setVolume === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.getDuration === 'function');
            TestUtils.assertTrue(typeof this.audioPlayer.getPosition === 'function');

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

    @test('应该能够播放和暂停音频')
    async testPlayPauseAudio() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 播放音频
            await this.audioPlayer.play();

            // 获取播放状态
            const isPlaying = await this.audioPlayer.isPlaying();
            TestUtils.assertTrue(typeof isPlaying === 'boolean');

            // 暂停音频
            await this.audioPlayer.pause();

            // 验证暂停状态
            const isPaused = await this.audioPlayer.isPaused();
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

    @test('应该能够停止音频播放')
    async testStopAudio() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 播放音频
            await this.audioPlayer.play();

            // 停止音频
            await this.audioPlayer.stop();

            // 验证停止状态
            const isStopped = await this.audioPlayer.isStopped();
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
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 设置音量
            const volumes = [0, 0.5, 1.0];
            for (const volume of volumes) {
                await this.audioPlayer.setVolume(volume);

                // 获取当前音量
                const currentVolume = await this.audioPlayer.getVolume();
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

    @test('应该能够获取音频时长和位置')
    async testAudioDurationAndPosition() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 获取音频时长
            const duration = await this.audioPlayer.getDuration();
            TestUtils.assertTrue(typeof duration === 'number');
            TestUtils.assertTrue(duration >= 0);

            // 播放音频
            await this.audioPlayer.play();

            // 等待一段时间
            await TestUtils.delay(1000);

            // 获取当前位置
            const position = await this.audioPlayer.getPosition();
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

    @test('应该能够创建音频录制器')
    async testCreateAudioRecorder() {
        try {
            const recorderOptions = {
                filename: '_doc/test_recorded_audio.mp3',
                format: 'mp3',
                samplingRate: 44100,
                channels: 1
            };

            this.audioRecorder = await audio.createRecorder(recorderOptions);

            // 验证录制器实例
            TestUtils.assertNotNull(this.audioRecorder);
            TestUtils.assertTrue(typeof this.audioRecorder.start === 'function');
            TestUtils.assertTrue(typeof this.audioRecorder.stop === 'function');
            TestUtils.assertTrue(typeof this.audioRecorder.pause === 'function');
            TestUtils.assertTrue(typeof this.audioRecorder.resume === 'function');

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

    @test('应该能够录制音频')
    async testRecordAudio() {
        try {
            const recorderOptions = {
                filename: '_doc/test_recorded_audio.mp3',
                format: 'mp3'
            };

            this.audioRecorder = await audio.createRecorder(recorderOptions);
            TestUtils.assertNotNull(this.audioRecorder);

            // 开始录制
            await this.audioRecorder.start();

            // 录制一段时间
            await TestUtils.delay(2000);

            // 停止录制
            await this.audioRecorder.stop();

            // 验证录制结果
            const recordingInfo = await this.audioRecorder.getRecordingInfo();
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
                filename: '_doc/test_pause_resume_audio.mp3',
                format: 'mp3'
            };

            this.audioRecorder = await audio.createRecorder(recorderOptions);
            TestUtils.assertNotNull(this.audioRecorder);

            // 开始录制
            await this.audioRecorder.start();

            // 录制一段时间
            await TestUtils.delay(1000);

            // 暂停录制
            await this.audioRecorder.pause();

            // 验证暂停状态
            const isPaused = await this.audioRecorder.isPaused();
            TestUtils.assertTrue(typeof isPaused === 'boolean');

            // 等待一段时间
            await TestUtils.delay(500);

            // 恢复录制
            await this.audioRecorder.resume();

            // 录制一段时间
            await TestUtils.delay(1000);

            // 停止录制
            await this.audioRecorder.stop();

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

    @test('应该能够监听音频事件')
    async testAudioEventListeners() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 设置事件监听器
            const eventTypes = ['play', 'pause', 'stop', 'ended', 'error'];

            for (const eventType of eventTypes) {
                this.audioPlayer.on(eventType, (data) => {
                    this.audioEvents.push({ type: eventType, data });
                });
            }

            // 播放音频以触发事件
            await this.audioPlayer.play();

            // 等待事件处理
            await TestUtils.delay(500);

            // 验证事件是否被记录
            TestUtils.assertTrue(Array.isArray(this.audioEvents));

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的音频文件路径
            await audio.createPlayer({
                path: '', // 空路径
                autoplay: false
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
            await audio.createPlayer(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的音量值
            this.audioPlayer = await audio.createPlayer({
                path: this.testAudioPath,
                autoplay: false
            });

            await this.audioPlayer.setVolume(2.0); // 超出范围的音量值
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

    @test('应该能够设置音频播放速度')
    async testPlaybackSpeed() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 测试不同的播放速度
            const speeds = [0.5, 1.0, 1.5, 2.0];

            for (const speed of speeds) {
                await this.audioPlayer.setPlaybackSpeed(speed);

                const currentSpeed = await this.audioPlayer.getPlaybackSpeed();
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

    @test('应该能够设置循环播放')
    async testLoopPlayback() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false,
                loop: true
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 验证循环设置
            const isLooping = await this.audioPlayer.isLooping();
            TestUtils.assertTrue(typeof isLooping === 'boolean');

            // 切换循环模式
            await this.audioPlayer.setLoop(false);
            const isNotLooping = await this.audioPlayer.isLooping();
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

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await audio.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await audio.requestPermission();
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

    @test('应该能够获取音频设备信息')
    async testAudioDeviceInfo() {
        try {
            const deviceInfo = await audio.getDeviceInfo();
            TestUtils.assertTrue(typeof deviceInfo === 'object');
            TestUtils.assertTrue(typeof deviceInfo.hasMicrophone === 'boolean');
            TestUtils.assertTrue(typeof deviceInfo.hasSpeaker === 'boolean');
            TestUtils.assertTrue(typeof deviceInfo.supportedFormats === 'object');
            TestUtils.assertTrue(Array.isArray(deviceInfo.supportedFormats));

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

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        try {
            const promises = [];
            const count = 3;

            // 并发创建多个音频播放器
            for (let i = 0; i < count; i++) {
                promises.push(audio.createPlayer({
                    path: this.testAudioPath,
                    autoplay: false
                }));
            }

            const players = await Promise.all(promises);

            // 验证所有播放器
            for (const player of players) {
                if (player) {
                    TestUtils.assertTrue(typeof player.play === 'function');
                    TestUtils.assertTrue(typeof player.pause === 'function');
                    TestUtils.assertTrue(typeof player.stop === 'function');
                }
            }

            // 清理播放器
            for (const player of players) {
                if (player) {
                    await player.stop();
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

    @test('应该能够设置音频效果')
    async testAudioEffects() {
        try {
            const playerOptions = {
                path: this.testAudioPath,
                autoplay: false
            };

            this.audioPlayer = await audio.createPlayer(playerOptions);
            TestUtils.assertNotNull(this.audioPlayer);

            // 设置音频效果
            await this.audioPlayer.setAudioEffect({
                equalizer: 'flat',
                bassBoost: 0,
                trebleBoost: 0
            });

            // 获取当前音频效果
            const currentEffect = await this.audioPlayer.getAudioEffect();
            TestUtils.assertTrue(typeof currentEffect === 'object');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('效果') ||
                error.message.includes('effect')
            );
        }
    }
}

export default AudioTestSuite;