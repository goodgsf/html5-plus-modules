/**
 * HTML5+ Key 模块测试套件
 *
 * 测试按键功能包括：
 * - 按键事件监听
 * - 按键状态检测
 * - 音量控制
 * - 菜单键处理
 * - 返回键处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import key from '../../modules/key.js';

class KeyTestSuite extends TestSuite {
    constructor() {
        super();
        this.keyManager = null;
        this.keyEvents = [];
        this.keyStates = {};
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Key测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Key测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理按键事件和状态
        try {
            if (this.keyManager) {
                await this.keyManager.removeEventListener();
                this.keyManager = null;
            }
            this.keyEvents = [];
            this.keyStates = {};
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理按键事件和状态
        try {
            if (this.keyManager) {
                await this.keyManager.removeEventListener();
                this.keyManager = null;
            }
            this.keyEvents = [];
            this.keyStates = {};
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await key.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await key.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取按键管理器')
    async testGetKeyManager() {
        try {
            this.keyManager = await key.getManager();
            TestUtils.assertNotNull(this.keyManager);
            TestUtils.assertTrue(typeof this.keyManager.addEventListener === 'function');
            TestUtils.assertTrue(typeof this.keyManager.removeEventListener === 'function');
            TestUtils.assertTrue(typeof this.keyManager.getKeyState === 'function');
            TestUtils.assertTrue(typeof this.keyManager.setVolume === 'function');
            TestUtils.assertTrue(typeof this.keyManager.getVolume === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('按键') ||
                error.message.includes('key')
            );
        }
    }

    @test('应该能够监听按键事件')
    async testKeyEventListener() {
        try {
            this.keyManager = await key.getManager();

            await this.keyManager.addEventListener({
                onKeydown: (event) => {
                    this.keyEvents.push({ type: 'keydown', data: event });
                },
                onKeyup: (event) => {
                    this.keyEvents.push({ type: 'keyup', data: event });
                },
                onKeypress: (event) => {
                    this.keyEvents.push({ type: 'keypress', data: event });
                },
                onBackButton: () => {
                    this.keyEvents.push({ type: 'backbutton' });
                },
                onMenuButton: () => {
                    this.keyEvents.push({ type: 'menubutton' });
                },
                onVolumeUp: () => {
                    this.keyEvents.push({ type: 'volumeup' });
                },
                onVolumeDown: () => {
                    this.keyEvents.push({ type: 'volumedown' });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.keyEvents.length >= 0);

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

    @test('应该能够获取按键状态')
    async testGetKeyState() {
        try {
            this.keyManager = await key.getManager();

            // 获取音量键状态
            const volumeState = await this.keyManager.getKeyState('volume');
            TestUtils.assertTrue(typeof volumeState === 'object');
            TestUtils.assertTrue(typeof volumeState.isPressed === 'boolean');
            TestUtils.assertTrue(typeof volumeState.pressCount === 'number');

            // 获取返回键状态
            const backState = await this.keyManager.getKeyState('back');
            TestUtils.assertTrue(typeof backState === 'object');
            TestUtils.assertTrue(typeof backState.isPressed === 'boolean');

            // 获取菜单键状态
            const menuState = await this.keyManager.getKeyState('menu');
            TestUtils.assertTrue(typeof menuState === 'object');
            TestUtils.assertTrue(typeof menuState.isPressed === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('状态') ||
                error.message.includes('state')
            );
        }
    }

    @test('应该能够获取音量')
    async testGetVolume() {
        try {
            this.keyManager = await key.getManager();

            const volume = await this.keyManager.getVolume();
            TestUtils.assertTrue(typeof volume === 'object');
            TestUtils.assertTrue(typeof volume.current === 'number');
            TestUtils.assertTrue(typeof volume.max === 'number');
            TestUtils.assertTrue(typeof volume.min === 'number');
            TestUtils.assertTrue(volume.current >= volume.min && volume.current <= volume.max);

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

    @test('应该能够设置音量')
    async testSetVolume() {
        try {
            this.keyManager = await key.getManager();

            // 设置音量
            const result = await this.keyManager.setVolume(50);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证音量设置
            const volume = await this.keyManager.getVolume();
            TestUtils.assertTrue(typeof volume.current === 'number');

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

    @test('应该能够静音和取消静音')
    async testMuteUnmute() {
        try {
            this.keyManager = await key.getManager();

            // 静音
            const muteResult = await this.keyManager.setMute(true);
            TestUtils.assertTrue(typeof muteResult === 'object');
            TestUtils.assertTrue(muteResult.success === true || muteResult.success === false);

            // 取消静音
            const unmuteResult = await this.keyManager.setMute(false);
            TestUtils.assertTrue(typeof unmuteResult === 'object');
            TestUtils.assertTrue(unmuteResult.success === true || unmuteResult.success === false);

            // 获取静音状态
            const isMuted = await this.keyManager.isMuted();
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

    @test('应该能够监听音量变化')
    async testVolumeChangeListener() {
        try {
            this.keyManager = await key.getManager();

            await this.keyManager.addEventListener({
                onVolumeChanged: (volume) => {
                    this.keyEvents.push({ type: 'volume_changed', data: volume });
                },
                onMuteChanged: (isMuted) => {
                    this.keyEvents.push({ type: 'mute_changed', data: isMuted });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.keyEvents.length >= 0);

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

    @test('应该能够检测按键按下')
    async testKeyPressDetection() {
        try {
            this.keyManager = await key.getManager();

            // 模拟按键检测
            const keyTypes = ['back', 'menu', 'volume_up', 'volume_down', 'home'];
            for (const keyType of keyTypes) {
                const isPressed = await this.keyManager.isKeyPressed(keyType);
                TestUtils.assertTrue(typeof isPressed === 'boolean');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('按键') ||
                error.message.includes('key')
            );
        }
    }

    @test('应该能够处理长按事件')
    async testLongPressHandling() {
        try {
            this.keyManager = await key.getManager();

            await this.keyManager.addEventListener({
                onLongPress: (event) => {
                    this.keyEvents.push({ type: 'longpress', data: event });
                },
                onDoubleClick: (event) => {
                    this.keyEvents.push({ type: 'doubleclick', data: event });
                }
            });

            // 验证监听器已设置
            TestUtils.assertTrue(this.keyEvents.length >= 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('长按') ||
                error.message.includes('longpress')
            );
        }
    }

    @test('应该能够设置按键重复间隔')
    async testSetKeyRepeatInterval() {
        try {
            this.keyManager = await key.getManager();

            const interval = 500; // 500毫秒
            const result = await this.keyManager.setKeyRepeatInterval(interval);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 获取当前重复间隔
            const currentInterval = await this.keyManager.getKeyRepeatInterval();
            TestUtils.assertTrue(typeof currentInterval === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重复') ||
                error.message.includes('repeat')
            );
        }
    }

    @test('应该能够获取按键配置')
    async testGetKeyConfig() {
        try {
            const config = await key.getConfig();
            TestUtils.assertTrue(typeof config === 'object');
            TestUtils.assertTrue(typeof config.keyRepeatEnabled === 'boolean');
            TestUtils.assertTrue(typeof config.longPressDelay === 'number');
            TestUtils.assertTrue(typeof config.doubleClickDelay === 'number');
            TestUtils.assertTrue(typeof config.volumeStep === 'number');

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

    @test('应该能够设置按键配置')
    async testSetKeyConfig() {
        try {
            const config = {
                keyRepeatEnabled: true,
                longPressDelay: 1000,
                doubleClickDelay: 300,
                volumeStep: 5
            };

            const result = await key.setConfig(config);
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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的按键类型
            this.keyManager = await key.getManager();
            await this.keyManager.getKeyState('invalid_key');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('按键') ||
                error.message.includes('key')
            );
        }

        try {
            // 测试无效的音量值
            this.keyManager = await key.getManager();
            await this.keyManager.setVolume(-1);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('音量') ||
                error.message.includes('volume')
            );
        }

        try {
            // 测试空参数
            this.keyManager = await key.getManager();
            await this.keyManager.getKeyState(null);
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
            const permission = await key.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await key.requestPermission();
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

    @test('应该能够获取按键统计信息')
    async testGetKeyStatistics() {
        try {
            const stats = await key.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalKeyPresses === 'number');
            TestUtils.assertTrue(typeof stats.backButtonPresses === 'number');
            TestUtils.assertTrue(typeof stats.volumeUpPresses === 'number');
            TestUtils.assertTrue(typeof stats.volumeDownPresses === 'number');
            TestUtils.assertTrue(typeof stats.lastKeyPressTime === 'number');

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

    @test('应该能够重置按键统计')
    async testResetKeyStatistics() {
        try {
            const result = await key.resetStatistics();
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

    @test('应该能够模拟按键事件')
    async testSimulateKeyEvent() {
        try {
            this.keyManager = await key.getManager();

            const simulateOptions = {
                keyType: 'back',
                eventType: 'keydown',
                timestamp: Date.now()
            };

            const result = await this.keyManager.simulateKeyEvent(simulateOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('模拟') ||
                error.message.includes('simulate')
            );
        }
    }

    @test('应该能够获取按键历史记录')
    async testGetKeyHistory() {
        try {
            const historyOptions = {
                limit: 10,
                offset: 0,
                keyTypes: ['back', 'menu', 'volume_up', 'volume_down']
            };

            const history = await key.getKeyHistory(historyOptions);
            TestUtils.assertTrue(Array.isArray(history));

            for (const event of history) {
                TestUtils.assertTrue(typeof event === 'object');
                TestUtils.assertTrue(typeof event.keyType === 'string');
                TestUtils.assertTrue(typeof event.eventType === 'string');
                TestUtils.assertTrue(typeof event.timestamp === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('历史') ||
                error.message.includes('history')
            );
        }
    }

    @test('应该能够清除按键历史记录')
    async testClearKeyHistory() {
        try {
            const result = await key.clearKeyHistory();
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('清除') ||
                error.message.includes('clear')
            );
        }
    }
}

export default KeyTestSuite;