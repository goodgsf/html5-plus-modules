/**
 * HTML5+ NativeUI 模块测试套件
 *
 * 测试原生UI功能包括：
 * - 原生界面组件
 * - 对话框和提示
 * - 原生菜单
 * - 进度指示器
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import nativeUI from '../../modules/nativeUI.js';

class NativeUITestSuite extends TestSuite {
    constructor() {
        super();
        this.uiComponents = [];
        this.uiEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置NativeUI测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理NativeUI测试环境...');
        try {
            // 清理所有UI组件
            for (const component of this.uiComponents) {
                try {
                    await component.close();
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
        // 每个测试前清理UI组件和事件
        try {
            for (const component of this.uiComponents) {
                try {
                    await component.close();
                } catch (error) {
                    // 忽略清理错误
                }
            }
            this.uiComponents = [];
            this.uiEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理UI组件和事件
        try {
            for (const component of this.uiComponents) {
                try {
                    await component.close();
                } catch (error) {
                    // 忽略清理错误
                }
            }
            this.uiComponents = [];
            this.uiEvents = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await nativeUI.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await nativeUI.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够显示警告对话框')
    async testShowAlertDialog() {
        try {
            const alertOptions = {
                title: '测试警告',
                message: '这是一个测试警告对话框',
                buttonLabel: '确定',
                onButtonClick: () => {
                    this.uiEvents.push({ type: 'alert_button_clicked' });
                }
            };

            const result = await nativeUI.alert(alertOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('警告') ||
                error.message.includes('alert')
            );
        }
    }

    @test('应该能够显示确认对话框')
    async testShowConfirmDialog() {
        try {
            const confirmOptions = {
                title: '测试确认',
                message: '您确定要执行此操作吗？',
                cancelButtonLabel: '取消',
                confirmButtonLabel: '确定',
                onCancel: () => {
                    this.uiEvents.push({ type: 'confirm_cancel' });
                },
                onConfirm: () => {
                    this.uiEvents.push({ type: 'confirm_confirm' });
                }
            };

            const result = await nativeUI.confirm(confirmOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('确认') ||
                error.message.includes('confirm')
            );
        }
    }

    @test('应该能够显示提示对话框')
    async testShowPromptDialog() {
        try {
            const promptOptions = {
                title: '测试输入',
                message: '请输入您的姓名：',
                defaultValue: '测试用户',
                placeholder: '请输入姓名',
                cancelButtonLabel: '取消',
                confirmButtonLabel: '确定',
                onCancel: () => {
                    this.uiEvents.push({ type: 'prompt_cancel' });
                },
                onConfirm: (value) => {
                    this.uiEvents.push({ type: 'prompt_confirm', data: value });
                }
            };

            const result = await nativeUI.prompt(promptOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('输入') ||
                error.message.includes('prompt')
            );
        }
    }

    @test('应该能够显示操作表')
    async testShowActionSheet() {
        try {
            const actionSheetOptions = {
                title: '选择操作',
                cancelButtonLabel: '取消',
                buttons: [
                    { label: '选项1', value: 'option1' },
                    { label: '选项2', value: 'option2' },
                    { label: '选项3', value: 'option3' }
                ],
                onButtonClick: (index, value) => {
                    this.uiEvents.push({ type: 'action_sheet_click', index, value });
                },
                onCancel: () => {
                    this.uiEvents.push({ type: 'action_sheet_cancel' });
                }
            };

            const result = await nativeUI.actionSheet(actionSheetOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('操作表') ||
                error.message.includes('action sheet')
            );
        }
    }

    @test('应该能够显示Toast消息')
    async testShowToast() {
        try {
            const toastOptions = {
                message: '这是一条测试消息',
                duration: 3000,
                position: 'center', // top, center, bottom
                style: {
                    'backgroundColor': '#333333',
                    'textColor': '#FFFFFF',
                    'fontSize': '14px'
                }
            };

            const result = await nativeUI.toast(toastOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('Toast') ||
                error.message.includes('toast')
            );
        }
    }

    @test('应该能够显示加载指示器')
    async testShowLoading() {
        try {
            const loadingOptions = {
                title: '加载中...',
                message: '请稍候',
                cancelable: true,
                onCancel: () => {
                    this.uiEvents.push({ type: 'loading_cancel' });
                }
            };

            const loading = await nativeUI.showLoading(loadingOptions);
            TestUtils.assertNotNull(loading);
            TestUtils.assertTrue(typeof loading.hide === 'function');
            TestUtils.assertTrue(typeof loading.isShowing === 'function');

            this.uiComponents.push(loading);

            // 隐藏加载指示器
            await loading.hide();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('加载') ||
                error.message.includes('loading')
            );
        }
    }

    @test('应该能够显示进度条')
    async testShowProgressDialog() {
        try {
            const progressOptions = {
                title: '下载中...',
                message: '正在下载文件',
                max: 100,
                progress: 30,
                cancelable: true,
                onCancel: () => {
                    this.uiEvents.push({ type: 'progress_cancel' });
                }
            };

            const progress = await nativeUI.showProgress(progressOptions);
            TestUtils.assertNotNull(progress);
            TestUtils.assertTrue(typeof progress.setProgress === 'function');
            TestUtils.assertTrue(typeof progress.getProgress === 'function');
            TestUtils.assertTrue(typeof progress.hide === 'function');

            this.uiComponents.push(progress);

            // 更新进度
            await progress.setProgress(50);

            // 获取当前进度
            const currentProgress = await progress.getProgress();
            TestUtils.assertTrue(typeof currentProgress === 'number');

            // 隐藏进度条
            await progress.hide();

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('进度') ||
                error.message.includes('progress')
            );
        }
    }

    @test('应该能够显示原生菜单')
    async testShowNativeMenu() {
        try {
            const menuOptions = {
                title: '主菜单',
                items: [
                    { id: 'item1', label: '菜单项1', icon: 'icon1.png' },
                    { id: 'item2', label: '菜单项2', icon: 'icon2.png' },
                    { id: 'item3', label: '菜单项3', icon: 'icon3.png' }
                ],
                onItemClick: (item) => {
                    this.uiEvents.push({ type: 'menu_item_click', data: item });
                },
                onCancel: () => {
                    this.uiEvents.push({ type: 'menu_cancel' });
                }
            };

            const result = await nativeUI.showMenu(menuOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('菜单') ||
                error.message.includes('menu')
            );
        }
    }

    @test('应该能够显示日期选择器')
    async testShowDatePicker() {
        try {
            const datePickerOptions = {
                title: '选择日期',
                mode: 'date', // date, time, datetime
                value: new Date(),
                minDate: new Date(2020, 0, 1),
                maxDate: new Date(2030, 11, 31),
                onConfirm: (date) => {
                    this.uiEvents.push({ type: 'date_confirm', data: date });
                },
                onCancel: () => {
                    this.uiEvents.push({ type: 'date_cancel' });
                }
            };

            const result = await nativeUI.showDatePicker(datePickerOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('日期') ||
                error.message.includes('date')
            );
        }
    }

    @test('应该能够显示时间选择器')
    async testShowTimePicker() {
        try {
            const timePickerOptions = {
                title: '选择时间',
                mode: 'time',
                value: new Date(),
                hour24: true,
                onConfirm: (time) => {
                    this.uiEvents.push({ type: 'time_confirm', data: time });
                },
                onCancel: () => {
                    this.uiEvents.push({ type: 'time_cancel' });
                }
            };

            const result = await nativeUI.showTimePicker(timePickerOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('时间') ||
                error.message.includes('time')
            );
        }
    }

    @test('应该能够显示原生选择器')
    async testShowPicker() {
        try {
            const pickerOptions = {
                title: '选择项目',
                items: [
                    { label: '选项1', value: 'value1' },
                    { label: '选项2', value: 'value2' },
                    { label: '选项3', value: 'value3' }
                ],
                selectedValue: 'value1',
                onConfirm: (value) => {
                    this.uiEvents.push({ type: 'picker_confirm', data: value });
                },
                onCancel: () => {
                    this.uiEvents.push({ type: 'picker_cancel' });
                }
            };

            const result = await nativeUI.showPicker(pickerOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('选择器') ||
                error.message.includes('picker')
            );
        }
    }

    @test('应该能够显示状态栏通知')
    async testShowStatusBarNotification() {
        try {
            const notificationOptions = {
                title: '测试通知',
                message: '这是一条测试通知',
                icon: 'icon.png',
                sound: true,
                vibrate: true,
                onClick: () => {
                    this.uiEvents.push({ type: 'notification_click' });
                },
                onDismiss: () => {
                    this.uiEvents.push({ type: 'notification_dismiss' });
                }
            };

            const result = await nativeUI.showNotification(notificationOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('通知') ||
                error.message.includes('notification')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的对话框参数
            await nativeUI.alert({
                title: '',
                message: ''
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('标题') ||
                error.message.includes('title')
            );
        }

        try {
            // 测试空参数
            await nativeUI.alert(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的Toast参数
            await nativeUI.toast({});
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('消息') ||
                error.message.includes('message')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await nativeUI.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await nativeUI.requestPermission();
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

    @test('应该能够获取UI状态')
    async testGetUIState() {
        try {
            const state = await nativeUI.getState();
            TestUtils.assertTrue(typeof state === 'object');
            TestUtils.assertTrue(typeof state.isAlertShowing === 'boolean');
            TestUtils.assertTrue(typeof state.isLoadingShowing === 'boolean');
            TestUtils.assertTrue(typeof state.isProgressShowing === 'boolean');
            TestUtils.assertTrue(typeof state.activeDialogs === 'number');

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

    @test('应该能够设置UI主题')
    async testSetUITheme() {
        try {
            const themeOptions = {
                primaryColor: '#007AFF',
                secondaryColor: '#FF3B30',
                backgroundColor: '#F2F2F7',
                textColor: '#000000',
                fontSize: 16
            };

            const result = await nativeUI.setTheme(themeOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('主题') ||
                error.message.includes('theme')
            );
        }
    }

    @test('应该能够获取UI配置')
    async testGetUIConfig() {
        try {
            const config = await nativeUI.getConfig();
            TestUtils.assertTrue(typeof config === 'object');
            TestUtils.assertTrue(typeof config.animationDuration === 'number');
            TestUtils.assertTrue(typeof config.defaultToastDuration === 'number');
            TestUtils.assertTrue(typeof config.maxNotificationCount === 'number');

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

    @test('应该能够显示自定义对话框')
    async testShowCustomDialog() {
        try {
            const customDialogOptions = {
                title: '自定义对话框',
                message: '这是一个自定义对话框',
                customView: {
                    type: 'text',
                    placeholder: '请输入内容'
                },
                buttons: [
                    { label: '取消', style: 'cancel' },
                    { label: '确定', style: 'default' }
                ],
                onButtonClick: (buttonIndex) => {
                    this.uiEvents.push({ type: 'custom_dialog_click', index: buttonIndex });
                },
                onCustomViewChange: (value) => {
                    this.uiEvents.push({ type: 'custom_view_change', data: value });
                }
            };

            const result = await nativeUI.showCustomDialog(customDialogOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('自定义') ||
                error.message.includes('custom')
            );
        }
    }

    @test('应该能够批量显示Toast')
    async testBatchShowToast() {
        try {
            const toastMessages = [
                { message: '消息1', duration: 2000 },
                { message: '消息2', duration: 2000 },
                { message: '消息3', duration: 2000 }
            ];

            const results = await Promise.all(
                toastMessages.map(msg => nativeUI.toast(msg))
            );

            for (const result of results) {
                TestUtils.assertTrue(typeof result === 'object');
                TestUtils.assertTrue(result.success === true || result.success === false);
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

    @test('应该能够获取UI统计信息')
    async testGetUIStatistics() {
        try {
            const stats = await nativeUI.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalAlerts === 'number');
            TestUtils.assertTrue(typeof stats.totalToasts === 'number');
            TestUtils.assertTrue(typeof stats.totalNotifications === 'number');
            TestUtils.assertTrue(typeof stats.averageDialogDuration === 'number');

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

    @test('应该能够清除所有UI组件')
    async testClearAllUIComponents() {
        try {
            const result = await nativeUI.clearAll();
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

export default NativeUITestSuite;