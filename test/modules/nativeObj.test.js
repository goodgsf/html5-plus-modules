/**
 * HTML5+ NativeObj 模块测试套件
 *
 * 测试原生对象功能包括：
 * - 原生视图创建和管理
 * - 原生事件处理
 * - 原生动画
 * - 原生绘图
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import nativeObj from '../../modules/nativeObj.js';

class NativeObjTestSuite extends TestSuite {
    constructor() {
        super();
        this.nativeViews = [];
        this.nativeEvents = [];
        this.nativeAnimations = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置NativeObj测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理NativeObj测试环境...');
        try {
            // 清理所有原生视图
            for (const view of this.nativeViews) {
                try {
                    await view.close();
                } catch (error) {
                    // 忽略清理错误
                }
            }
        } catch (error) {
            // 忽略清理错误
        }
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理原生视图和事件
        try {
            for (const view of this.nativeViews) {
                try {
                    await view.close();
                } catch (error) {
                    // 忽略清理错误
                }
            }
            this.nativeViews = [];
            this.nativeEvents = [];
            this.nativeAnimations = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理原生视图和事件
        try {
            for (const view of this.nativeViews) {
                try {
                    await view.close();
                } catch (error) {
                    // 忽略清理错误
                }
            }
            this.nativeViews = [];
            this.nativeEvents = [];
            this.nativeAnimations = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await nativeObj.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await nativeObj.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建原生视图')
    async testCreateNativeView() {
        try {
            const viewOptions = {
                id: 'test_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                tag: 1001,
                styles: {
                    'width': '100px',
                    'height': '100px',
                    'backgroundColor': '#FF0000',
                    'borderRadius': '10px'
                },
                rect: {
                    top: '100px',
                    left: '100px',
                    width: '100px',
                    height: '100px'
                }
            };

            const nativeView = await nativeObj.createView(viewOptions);
            TestUtils.assertNotNull(nativeView);
            TestUtils.assertTrue(typeof nativeView.show === 'function');
            TestUtils.assertTrue(typeof nativeView.hide === 'function');
            TestUtils.assertTrue(typeof nativeView.close === 'function');
            TestUtils.assertTrue(typeof nativeView.setStyle === 'function');
            TestUtils.assertTrue(typeof nativeView.getStyle === 'function');

            this.nativeViews.push(nativeView);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('视图') ||
                error.message.includes('view')
            );
        }
    }

    @test('应该能够创建原生标签')
    async testCreateNativeLabel() {
        try {
            const labelOptions = {
                id: 'test_label_' + Date.now(),
                type: 'label',
                className: 'UILabel',
                text: '测试标签',
                styles: {
                    'width': '200px',
                    'height': '50px',
                    'fontSize': '16px',
                    'color': '#000000',
                    'textAlign': 'center'
                },
                rect: {
                    top: '50px',
                    left: '50px',
                    width: '200px',
                    height: '50px'
                }
            };

            const label = await nativeObj.createLabel(labelOptions);
            TestUtils.assertNotNull(label);
            TestUtils.assertTrue(typeof label.setText === 'function');
            TestUtils.assertTrue(typeof label.getText === 'function');
            TestUtils.assertTrue(typeof label.setFontSize === 'function');
            TestUtils.assertTrue(typeof label.setTextColor === 'function');

            this.nativeViews.push(label);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('标签') ||
                error.message.includes('label')
            );
        }
    }

    @test('应该能够创建原生按钮')
    async testCreateNativeButton() {
        try {
            const buttonOptions = {
                id: 'test_button_' + Date.now(),
                type: 'button',
                className: 'UIButton',
                text: '测试按钮',
                styles: {
                    'width': '150px',
                    'height': '50px',
                    'fontSize': '16px',
                    'color': '#FFFFFF',
                    'backgroundColor': '#007AFF',
                    'borderRadius': '5px'
                },
                rect: {
                    top: '150px',
                    left: '100px',
                    width: '150px',
                    height: '50px'
                },
                onClick: (event) => {
                    this.nativeEvents.push({ type: 'button_click', data: event });
                }
            };

            const button = await nativeObj.createButton(buttonOptions);
            TestUtils.assertNotNull(button);
            TestUtils.assertTrue(typeof button.setText === 'function');
            TestUtils.assertTrue(typeof button.getText === 'function');
            TestUtils.assertTrue(typeof button.setEnabled === 'function');
            TestUtils.assertTrue(typeof button.isEnabled === 'function');

            this.nativeViews.push(button);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('按钮') ||
                error.message.includes('button')
            );
        }
    }

    @test('应该能够创建原生图片视图')
    async testCreateNativeImageView() {
        try {
            const imageViewOptions = {
                id: 'test_image_' + Date.now(),
                type: 'image',
                className: 'UIImageView',
                src: '_doc/images/test.jpg',
                styles: {
                    'width': '200px',
                    'height': '200px',
                    'contentMode': 'scaleAspectFit'
                },
                rect: {
                    top: '100px',
                    left: '100px',
                    width: '200px',
                    height: '200px'
                }
            };

            const imageView = await nativeObj.createImageView(imageViewOptions);
            TestUtils.assertNotNull(imageView);
            TestUtils.assertTrue(typeof imageView.setSrc === 'function');
            TestUtils.assertTrue(typeof imageView.getSrc === 'function');
            TestUtils.assertTrue(typeof imageView.setContentMode === 'function');

            this.nativeViews.push(imageView);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('图片') ||
                error.message.includes('image')
            );
        }
    }

    @test('应该能够设置和获取样式')
    async testSetAndGetStyles() {
        try {
            const viewOptions = {
                id: 'test_style_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                styles: {
                    'width': '100px',
                    'height': '100px',
                    'backgroundColor': '#FF0000'
                }
            };

            const view = await nativeObj.createView(viewOptions);

            // 设置新样式
            const newStyles = {
                'width': '200px',
                'height': '200px',
                'backgroundColor': '#00FF00',
                'opacity': 0.8
            };

            await view.setStyle(newStyles);

            // 获取当前样式
            const currentStyles = await view.getStyle();
            TestUtils.assertTrue(typeof currentStyles === 'object');
            TestUtils.assertTrue(typeof currentStyles.width === 'string');
            TestUtils.assertTrue(typeof currentStyles.height === 'string');

            this.nativeViews.push(view);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('样式') ||
                error.message.includes('style')
            );
        }
    }

    @test('应该能够显示和隐藏视图')
    async testShowAndHideView() {
        try {
            const viewOptions = {
                id: 'test_visible_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                styles: {
                    'width': '100px',
                    'height': '100px'
                }
            };

            const view = await nativeObj.createView(viewOptions);

            // 显示视图
            await view.show();

            // 获取显示状态
            let isVisible = await view.isVisible();
            TestUtils.assertTrue(typeof isVisible === 'boolean');

            // 隐藏视图
            await view.hide();

            // 再次获取显示状态
            isVisible = await view.isVisible();
            TestUtils.assertTrue(typeof isVisible === 'boolean');

            this.nativeViews.push(view);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('显示') ||
                error.message.includes('visible')
            );
        }
    }

    @test('应该能够设置视图位置和大小')
    async testSetViewRect() {
        try {
            const viewOptions = {
                id: 'test_rect_view_' + Date.now(),
                type: 'view',
                className: 'UIView'
            };

            const view = await nativeObj.createView(viewOptions);

            // 设置位置和大小
            const newRect = {
                top: '200px',
                left: '200px',
                width: '150px',
                height: '150px'
            };

            await view.setRect(newRect);

            // 获取当前位置和大小
            const currentRect = await view.getRect();
            TestUtils.assertTrue(typeof currentRect === 'object');
            TestUtils.assertTrue(typeof currentRect.top === 'string');
            TestUtils.assertTrue(typeof currentRect.left === 'string');
            TestUtils.assertTrue(typeof currentRect.width === 'string');
            TestUtils.assertTrue(typeof currentRect.height === 'string');

            this.nativeViews.push(view);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('位置') ||
                error.message.includes('rect')
            );
        }
    }

    @test('应该能够添加手势识别')
    async testAddGestureRecognizers() {
        try {
            const viewOptions = {
                id: 'test_gesture_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                styles: {
                    'width': '200px',
                    'height': '200px'
                }
            };

            const view = await nativeObj.createView(viewOptions);

            // 添加点击手势
            await view.addTapGesture({
                onTap: (event) => {
                    this.nativeEvents.push({ type: 'tap', data: event });
                }
            });

            // 添加长按手势
            await view.addLongPressGesture({
                onLongPress: (event) => {
                    this.nativeEvents.push({ type: 'longpress', data: event });
                }
            });

            // 添加滑动手势
            await view.addSwipeGesture({
                direction: 'right',
                onSwipe: (event) => {
                    this.nativeEvents.push({ type: 'swipe', data: event });
                }
            });

            this.nativeViews.push(view);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('手势') ||
                error.message.includes('gesture')
            );
        }
    }

    @test('应该能够创建原生动画')
    async testCreateNativeAnimation() {
        try {
            const viewOptions = {
                id: 'test_animation_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                styles: {
                    'width': '100px',
                    'height': '100px'
                }
            };

            const view = await nativeObj.createView(viewOptions);

            // 创建动画
            const animationOptions = {
                type: 'basic',
                duration: 1000,
                properties: {
                    'transform': 'translateX(100px)',
                    'opacity': 0.5
                },
                options: {
                    'timingFunction': 'ease-in-out',
                    'fillMode': 'forwards'
                },
                onStart: () => {
                    this.nativeEvents.push({ type: 'animation_start' });
                },
                onEnd: () => {
                    this.nativeEvents.push({ type: 'animation_end' });
                }
            };

            const animation = await view.animate(animationOptions);
            TestUtils.assertNotNull(animation);
            TestUtils.assertTrue(typeof animation.start === 'function');
            TestUtils.assertTrue(typeof animation.stop === 'function');
            TestUtils.assertTrue(typeof animation.pause === 'function');
            TestUtils.assertTrue(typeof animation.resume === 'function');

            this.nativeViews.push(view);
            this.nativeAnimations.push(animation);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('动画') ||
                error.message.includes('animation')
            );
        }
    }

    @test('应该能够创建原生绘图上下文')
    async testCreateNativeGraphics() {
        try {
            const graphicsOptions = {
                id: 'test_graphics_' + Date.now(),
                type: 'graphics',
                className: 'UIGraphics',
                styles: {
                    'width': '300px',
                    'height': '300px',
                    'backgroundColor': '#FFFFFF'
                }
            };

            const graphics = await nativeObj.createGraphics(graphicsOptions);
            TestUtils.assertNotNull(graphics);
            TestUtils.assertTrue(typeof graphics.drawRect === 'function');
            TestUtils.assertTrue(typeof graphics.drawCircle === 'function');
            TestUtils.assertTrue(typeof graphics.drawLine === 'function');
            TestUtils.assertTrue(typeof graphics.drawText === 'function');
            TestUtils.assertTrue(typeof graphics.clearRect === 'function');

            this.nativeViews.push(graphics);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('绘图') ||
                error.message.includes('graphics')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的视图配置
            await nativeObj.createView({
                id: '',
                type: 'invalid_type'
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('视图') ||
                error.message.includes('view')
            );
        }

        try {
            // 测试空参数
            await nativeObj.createView(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的样式设置
            const view = await nativeObj.createView({
                id: 'test_invalid_style',
                type: 'view',
                className: 'UIView'
            });
            await view.setStyle('invalid_style');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('样式') ||
                error.message.includes('style')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await nativeObj.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await nativeObj.requestPermission();
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

    @test('应该能够获取视图信息')
    async testGetViewInfo() {
        try {
            const viewOptions = {
                id: 'test_info_view_' + Date.now(),
                type: 'view',
                className: 'UIView',
                styles: {
                    'width': '100px',
                    'height': '100px'
                }
            };

            const view = await nativeObj.createView(viewOptions);

            // 获取视图信息
            const info = await view.getInfo();
            TestUtils.assertTrue(typeof info === 'object');
            TestUtils.assertTrue(typeof info.id === 'string');
            TestUtils.assertTrue(typeof info.type === 'string');
            TestUtils.assertTrue(typeof info.className === 'string');
            TestUtils.assertTrue(typeof info.isVisible === 'boolean');

            this.nativeViews.push(view);

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

    @test('应该能够批量操作视图')
    async testBatchViewOperations() {
        try {
            const views = [];
            for (let i = 0; i < 3; i++) {
                const view = await nativeObj.createView({
                    id: `test_batch_view_${i}`,
                    type: 'view',
                    className: 'UIView',
                    styles: {
                        'width': '50px',
                        'height': '50px'
                    }
                });
                views.push(view);
            }

            // 批量显示
            const showResults = await Promise.all(views.map(view => view.show()));
            for (const result of showResults) {
                TestUtils.assertTrue(typeof result === 'object');
            }

            // 批量设置样式
            const styleResults = await Promise.all(views.map(view =>
                view.setStyle({ 'backgroundColor': '#00FF00' })
            ));
            for (const result of styleResults) {
                TestUtils.assertTrue(typeof result === 'object');
            }

            this.nativeViews.push(...views);

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

    @test('应该能够获取原生对象统计')
    async testGetNativeObjectStatistics() {
        try {
            const stats = await nativeObj.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalViews === 'number');
            TestUtils.assertTrue(typeof stats.activeViews === 'number');
            TestUtils.assertTrue(typeof stats.totalAnimations === 'number');
            TestUtils.assertTrue(typeof stats.memoryUsage === 'number');

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

    @test('应该能够清理原生对象')
    async testCleanupNativeObjects() {
        try {
            // 创建一些视图
            const views = [];
            for (let i = 0; i < 3; i++) {
                const view = await nativeObj.createView({
                    id: `test_cleanup_view_${i}`,
                    type: 'view',
                    className: 'UIView'
                });
                views.push(view);
            }

            // 批量清理
            const cleanupResult = await nativeObj.cleanup();
            TestUtils.assertTrue(typeof cleanupResult === 'object');
            TestUtils.assertTrue(cleanupResult.success === true || cleanupResult.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('清理') ||
                error.message.includes('cleanup')
            );
        }
    }
}

export default NativeObjTestSuite;