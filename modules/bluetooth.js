/**
 * HTML5+ Bluetooth 模块 ES Module 封装
 *
 * 该模块提供了蓝牙设备管理功能，包括蓝牙适配器控制、设备搜索、
 * 低功耗蓝牙设备连接和数据传输等功能
 * 遵循HTML5+官方API规范
 */

/**
 * 蓝牙设备信息
 * @typedef {Object} BluetoothDeviceInfo
 * @property {string} name - 蓝牙设备名称（某些设备可能没有此字段）
 * @property {string} deviceId - 蓝牙设备的id
 * @property {number} RSSI - 蓝牙设备的信号强度
 * @property {ArrayBuffer} advertisData - 蓝牙设备的广播数据
 * @property {string[]} advertisServiceUUIDs - 蓝牙设备的广播服务UUID数组
 * @property {string} localName - 蓝牙设备本地名称
 * @property {Object} serviceData - 蓝牙设备的广播服务数据
 */

/**
 * 蓝牙设备服务信息
 * @typedef {Object} BluetoothService
 * @property {string} uuid - 蓝牙设备服务的uuid
 * @property {boolean} isPrimary - 是否为设备的主服务
 */

/**
 * 蓝牙设备特征值
 * @typedef {Object} BluetoothCharacteristic
 * @property {string} uuid - 蓝牙设备特征值的uuid
 * @property {BluetoothCharacteristicProperties} properties - 设备特征值支持的操作类型
 */

/**
 * 蓝牙设备特征值支持的操作类型
 * @typedef {Object} BluetoothCharacteristicProperties
 * @property {boolean} read - 特征值是否支持read操作
 * @property {boolean} write - 特征值是否支持write操作
 * @property {boolean} notify - 特征值是否支持notify操作
 * @property {boolean} indicate - 特征值是否支持indicate操作
 */

/**
 * 蓝牙适配器状态
 * @typedef {Object} BluetoothAdapterState
 * @property {boolean} available - 蓝牙适配器是否可用
 * @property {boolean} discovering - 蓝牙适配器是否正在搜索设备
 */

/**
 * 蓝牙操作参数
 * @typedef {Object} BluetoothOptions
 * @property {string} [deviceId] - 蓝牙设备ID
 * @property {string} [serviceId] - 蓝牙服务UUID
 * @property {string} [characteristicId] - 蓝牙特征值UUID
 * @property {ArrayBuffer} [value] - 写入的数据
 * @property {number} [mtu] - 最大传输单元大小(22-512)
 * @property {boolean} [allowDuplicatesKey] - 是否允许重复上报设备
 */

/**
 * 成功回调函数
 * @callback BluetoothSuccessCallback
 * @param {Object} result - 操作结果
 */

/**
 * 失败回调函数
 * @callback BluetoothFailCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * 操作完成回调函数
 * @callback BluetoothCompleteCallback
 */

/**
 * 蓝牙适配器状态变化事件回调函数
 * @callback BluetoothAdapterStateChangeCallback
 * @param {BluetoothAdapterState} state - 蓝牙适配器状态
 */

/**
 * 蓝牙设备发现事件回调函数
 * @callback BluetoothDeviceFoundCallback
 * @param {BluetoothDeviceInfo} device - 发现的蓝牙设备
 */

/**
 * 蓝牙设备连接状态变化事件回调函数
 * @callback BLEConnectionStateChangeCallback
 * @param {Object} connection - 连接状态信息
 * @property {string} connection.deviceId - 设备ID
 * @property {boolean} connection.connected - 是否已连接
 */

/**
 * 蓝牙特征值变化事件回调函数
 * @callback BLECharacteristicValueChangeCallback
 * @param {Object} change - 特征值变化信息
 * @property {string} change.deviceId - 设备ID
 * @property {string} change.serviceId - 服务UUID
 * @property {string} change.characteristicId - 特征值UUID
 * @property {ArrayBuffer} change.value - 特征值数据
 */

/**
 * 蓝牙设备信号强度回调函数
 * @callback BluetoothDeviceRSSICallback
 * @param {Object} rssiInfo - 信号强度信息
 * @property {string} rssiInfo.deviceId - 设备ID
 * @property {number} rssiInfo.RSSI - 信号强度值
 */

/**
 * Bluetooth模块类
 */
class BluetoothModule {
    constructor() {
        this.adapterStateChangeCallbacks = new Set();
        this.deviceFoundCallbacks = new Set();
        this.connectionStateChangeCallbacks = new Set();
        this.characteristicValueChangeCallbacks = new Set();
        this.connectedDevices = new Map();
        this.discoveredDevices = new Map();
    }

    /**
     * 初始化蓝牙模块
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果初始化失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.openBluetoothAdapter();
     *   console.log('蓝牙模块初始化成功');
     * } catch (error) {
     *   console.error('蓝牙模块初始化失败:', error);
     * }
     * ```
     */
    openBluetoothAdapter(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.openBluetoothAdapter({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 调用原生API
            plus.bluetooth.openBluetoothAdapter({
                success: options.success || null,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 关闭蓝牙模块
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果关闭失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.closeBluetoothAdapter();
     *   console.log('蓝牙模块已关闭');
     * } catch (error) {
     *   console.error('关闭蓝牙模块失败:', error);
     * }
     * ```
     */
    closeBluetoothAdapter(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.closeBluetoothAdapter({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 清理已连接设备
            this.connectedDevices.clear();
            this.discoveredDevices.clear();

            // 调用原生API
            plus.bluetooth.closeBluetoothAdapter({
                success: options.success || null,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取本机蓝牙适配器状态
     * @param {Object} options - 配置参数
     * @param {function} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<BluetoothAdapterState>|void}
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const state = await bluetooth.getBluetoothAdapterState();
     *   console.log('蓝牙适配器状态:', state);
     * } catch (error) {
     *   console.error('获取蓝牙状态失败:', error);
     * }
     * ```
     */
    getBluetoothAdapterState(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.getBluetoothAdapterState({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 调用原生API
            plus.bluetooth.getBluetoothAdapterState({
                success: (result) => {
                    const state = {
                        available: result.available,
                        discovering: result.discovering
                    };
                    if (options.success) {
                        options.success(state);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 开始搜索附近的蓝牙设备
     * @param {Object} options - 配置参数
     * @param {boolean} [options.allowDuplicatesKey=false] - 是否允许重复上报设备
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果搜索失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.startBluetoothDevicesDiscovery();
     *   console.log('开始搜索蓝牙设备');
     * } catch (error) {
     *   console.error('搜索失败:', error);
     * }
     * ```
     */
    startBluetoothDevicesDiscovery(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.startBluetoothDevicesDiscovery({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 调用原生API
            plus.bluetooth.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: options.allowDuplicatesKey || false,
                success: options.success || null,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 停止搜索附近的蓝牙设备
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果停止失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.stopBluetoothDevicesDiscovery();
     *   console.log('停止搜索蓝牙设备');
     * } catch (error) {
     *   console.error('停止搜索失败:', error);
     * }
     * ```
     */
    stopBluetoothDevicesDiscovery(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.stopBluetoothDevicesDiscovery({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 调用原生API
            plus.bluetooth.stopBluetoothDevicesDiscovery({
                success: options.success || null,
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取已搜索到的蓝牙设备
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<BluetoothDeviceInfo[]>|void}
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const devices = await bluetooth.getBluetoothDevices();
     *   console.log('已发现设备数量:', devices.length);
     * } catch (error) {
     *   console.error('获取设备列表失败:', error);
     * }
     * ```
     */
    getBluetoothDevices(options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.getBluetoothDevices({ success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 调用原生API
            plus.bluetooth.getBluetoothDevices({
                success: (result) => {
                    const devices = result.devices || [];
                    if (options.success) {
                        options.success(devices);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 连接低功耗蓝牙设备
     * @param {string} deviceId - 蓝牙设备ID
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果连接失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.createBLEConnection('device_id');
     *   console.log('蓝牙设备连接成功');
     * } catch (error) {
     *   console.error('连接失败:', error);
     * }
     * ```
     */
    createBLEConnection(deviceId, options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.createBLEConnection(deviceId, { success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 检查设备ID
            if (!deviceId) {
                throw new Error('设备ID不能为空');
            }

            // 调用原生API
            plus.bluetooth.createBLEConnection({
                deviceId: deviceId,
                success: (result) => {
                    this.connectedDevices.set(deviceId, { connected: true, connectedAt: Date.now() });
                    if (options.success) {
                        options.success(result);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 断开与低功耗蓝牙设备的连接
     * @param {string} deviceId - 蓝牙设备ID
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<void>|void}
     * @throws {Error} 如果断开失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await bluetooth.closeBLEConnection('device_id');
     *   console.log('蓝牙设备已断开');
     * } catch (error) {
     *   console.error('断开连接失败:', error);
     * }
     * ```
     */
    closeBLEConnection(deviceId, options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.closeBLEConnection(deviceId, { success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 检查设备ID
            if (!deviceId) {
                throw new Error('设备ID不能为空');
            }

            // 调用原生API
            plus.bluetooth.closeBLEConnection({
                deviceId: deviceId,
                success: (result) => {
                    this.connectedDevices.delete(deviceId);
                    if (options.success) {
                        options.success(result);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取蓝牙设备的所有服务
     * @param {string} deviceId - 蓝牙设备ID
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<BluetoothService[]>|void}
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const services = await bluetooth.getBLEDeviceServices('device_id');
     *   console.log('服务数量:', services.length);
     * } catch (error) {
     *   console.error('获取服务失败:', error);
     * }
     * ```
     */
    getBLEDeviceServices(deviceId, options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.getBLEDeviceServices(deviceId, { success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 检查设备ID
            if (!deviceId) {
                throw new Error('设备ID不能为空');
            }

            // 调用原生API
            plus.bluetooth.getBLEDeviceServices({
                deviceId: deviceId,
                success: (result) => {
                    const services = result.services || [];
                    if (options.success) {
                        options.success(services);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 获取蓝牙设备指定服务中所有特征值
     * @param {string} deviceId - 蓝牙设备ID
     * @param {string} serviceId - 服务UUID
     * @param {Object} options - 配置参数
     * @param {BluetoothSuccessCallback} [options.success] - 成功回调
     * @param {BluetoothFailCallback} [options.fail] - 失败回调
     * @param {BluetoothCompleteCallback} [options.complete] - 完成回调
     * @returns {Promise<BluetoothCharacteristic[]>|void}
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const characteristics = await bluetooth.getBLEDeviceCharacteristics('device_id', 'service_uuid');
     *   console.log('特征值数量:', characteristics.length);
     * } catch (error) {
     *   console.error('获取特征值失败:', error);
     * }
     * ```
     */
    getBLEDeviceCharacteristics(deviceId, serviceId, options) {
        // 如果没有传入options，支持Promise方式
        if (typeof options === 'undefined') {
            return new Promise((resolve, reject) => {
                this.getBLEDeviceCharacteristics(deviceId, serviceId, { success: resolve, fail: reject });
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查蓝牙模块是否可用
            if (!plus.bluetooth) {
                throw new Error('设备不支持蓝牙功能');
            }

            // 检查设备ID和服务ID
            if (!deviceId || !serviceId) {
                throw new Error('设备ID和服务ID不能为空');
            }

            // 调用原生API
            plus.bluetooth.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: serviceId,
                success: (result) => {
                    const characteristics = result.characteristics || [];
                    if (options.success) {
                        options.success(characteristics);
                    }
                },
                fail: options.fail || null,
                complete: options.complete || null
            });

        } catch (error) {
            if (options.fail) {
                options.fail({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 监听蓝牙适配器状态变化
     * @param {BluetoothAdapterStateChangeCallback} callback - 状态变化回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await bluetooth.onBluetoothAdapterStateChange((state) => {
     *   console.log('蓝牙状态变化:', state);
     * });
     * ```
     */
    onBluetoothAdapterStateChange(callback) {
        return new Promise((resolve) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined') {
                    throw new Error('HTML5+ 环境不可用');
                }

                // 检查蓝牙模块是否可用
                if (!plus.bluetooth) {
                    throw new Error('设备不支持蓝牙功能');
                }

                // 添加回调函数
                this.adapterStateChangeCallbacks.add(callback);

                // 调用原生API
                plus.bluetooth.onBluetoothAdapterStateChange(callback);
                resolve();

            } catch (error) {
                throw error;
            }
        });
    }

    /**
     * 监听搜索到新设备的事件
     * @param {BluetoothDeviceFoundCallback} callback - 设备发现回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await bluetooth.onBluetoothDeviceFound((device) => {
     *   console.log('发现设备:', device.name, device.deviceId);
     * });
     * ```
     */
    onBluetoothDeviceFound(callback) {
        return new Promise((resolve) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined') {
                    throw new Error('HTML5+ 环境不可用');
                }

                // 检查蓝牙模块是否可用
                if (!plus.bluetooth) {
                    throw new Error('设备不支持蓝牙功能');
                }

                // 添加回调函数
                this.deviceFoundCallbacks.add(callback);

                // 调用原生API
                plus.bluetooth.onBluetoothDeviceFound(callback);
                resolve();

            } catch (error) {
                throw error;
            }
        });
    }

    /**
     * 监听低功耗蓝牙设备连接状态变化事件
     * @param {BLEConnectionStateChangeCallback} callback - 连接状态变化回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await bluetooth.onBLEConnectionStateChange((connection) => {
     *   console.log('设备连接状态变化:', connection.deviceId, connection.connected);
     * });
     * ```
     */
    onBLEConnectionStateChange(callback) {
        return new Promise((resolve) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined') {
                    throw new Error('HTML5+ 环境不可用');
                }

                // 检查蓝牙模块是否可用
                if (!plus.bluetooth) {
                    throw new Error('设备不支持蓝牙功能');
                }

                // 添加回调函数
                this.connectionStateChangeCallbacks.add(callback);

                // 调用原生API
                plus.bluetooth.onBLEConnectionStateChange(callback);
                resolve();

            } catch (error) {
                throw error;
            }
        });
    }

    /**
     * 判断设备是否支持蓝牙功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await bluetooth.isSupported();
     * if (isSupported) {
     *   console.log('设备支持蓝牙功能');
     * } else {
     *   console.log('设备不支持蓝牙功能');
     * }
     * ```
     */
    isSupported() {
        return new Promise((resolve) => {
            try {
                if (typeof plus === 'undefined') {
                    resolve(false);
                    return;
                }

                resolve(!!plus.bluetooth);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取当前已连接的设备列表
     * @returns {Array<Object>} 已连接设备信息数组
     *
     * @example
     * ```javascript
     * const connectedDevices = bluetooth.getConnectedDevices();
     * console.log('已连接设备数量:', connectedDevices.length);
     * ```
     */
    getConnectedDevices() {
        const devices = [];
        this.connectedDevices.forEach((info, deviceId) => {
            devices.push({
                deviceId: deviceId,
                connected: info.connected,
                connectedAt: info.connectedAt
            });
        });
        return devices;
    }

    /**
     * 获取当前已发现的设备列表
     * @returns {Array<Object>} 已发现设备信息数组
     *
     * @example
     * ```javascript
     * const discoveredDevices = bluetooth.getDiscoveredDevices();
     * console.log('已发现设备数量:', discoveredDevices.length);
     * ```
     */
    getDiscoveredDevices() {
        const devices = [];
        this.discoveredDevices.forEach((info, deviceId) => {
            devices.push({
                deviceId: deviceId,
                discoveredAt: info.discoveredAt,
                deviceInfo: info.deviceInfo
            });
        });
        return devices;
    }
}

// 创建Bluetooth模块实例
const bluetooth = new BluetoothModule();

// 导出模块
export default bluetooth;