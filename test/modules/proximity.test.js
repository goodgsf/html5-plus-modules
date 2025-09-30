import { TestSuite } from '../test-config.js';

/**
 * 接近传感器测试套件
 * @class ProximityTestSuite
 * @extends TestSuite
 */
class ProximityTestSuite extends TestSuite {
  /**
   * 接近传感器测试套件
   * 测试距离检测、监听、阈值设置等功能
   */
  constructor() {
    super('Proximity');
    this.proximityService = null;
    this.proximityWatchers = [];
    this.mockProximityData = null;
  }

  /**
   * 测试前初始化
   */
  @beforeAll
  async initialize() {
    try {
      // 检查运行环境
      if (!window.plus) {
        console.warn('HTML5+环境不可用，使用模拟模式');
        this.setupMockEnvironment();
      } else {
        this.proximityService = plus.proximity;
        if (!this.proximityService) {
          throw new Error('接近传感器服务不可用');
        }
      }

      console.log('接近传感器测试环境初始化完成');
    } catch (error) {
      console.error('接近传感器测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockProximityData = {
      distance: 10.5,    // 当前距离（厘米）
      maxRange: 50.0,    // 最大检测范围
      minRange: 0.0,     // 最小检测范围
      isNear: false,     // 是否接近
      accuracy: 0.1      // 精度
    };

    this.proximityService = {
      getCurrentProximity: (success, error) => {
        setTimeout(() => {
          success({
            distance: this.mockProximityData.distance,
            maxRange: this.mockProximityData.maxRange,
            minRange: this.mockProximityData.minRange,
            isNear: this.mockProximityData.isNear,
            accuracy: this.mockProximityData.accuracy,
            timestamp: Date.now()
          });
        }, 50);
      },
      watchProximity: (success, error, options) => {
        const interval = options && options.frequency ? options.frequency : 1000;
        const watchId = 'watch_' + Date.now();

        const timer = setInterval(() => {
          // 模拟距离变化
          const change = (Math.random() - 0.5) * 20;
          this.mockProximityData.distance = Math.max(
            this.mockProximityData.minRange,
            Math.min(this.mockProximityData.maxRange, this.mockProximityData.distance + change)
          );
          this.mockProximityData.isNear = this.mockProximityData.distance < 5.0;

          success({
            distance: this.mockProximityData.distance,
            maxRange: this.mockProximityData.maxRange,
            minRange: this.mockProximityData.minRange,
            isNear: this.mockProximityData.isNear,
            accuracy: this.mockProximityData.accuracy,
            timestamp: Date.now()
          });
        }, interval);

        const watcher = { watchId, timer };
        this.proximityWatchers.push(watcher);
        return watcher;
      },
      clearWatch: (watcher) => {
        if (watcher && watcher.timer) {
          clearInterval(watcher.timer);
          const index = this.proximityWatchers.indexOf(watcher);
          if (index > -1) {
            this.proximityWatchers.splice(index, 1);
          }
        }
      },
      setThreshold: (threshold, success, error) => {
        setTimeout(() => {
          this.mockProximityData.threshold = threshold;
          success({ threshold: threshold });
        }, 50);
      },
      getThreshold: (success, error) => {
        setTimeout(() => {
          success({
            threshold: this.mockProximityData.threshold || 5.0
          });
        }, 50);
      }
    };
  }

  /**
   * 测试后清理
   */
  @afterAll
  async cleanup() {
    try {
      // 清理所有监听器
      this.proximityWatchers.forEach(watcher => {
        if (watcher.timer) {
          clearInterval(watcher.timer);
        }
      });
      this.proximityWatchers = [];

      console.log('接近传感器测试环境清理完成');
    } catch (error) {
      console.error('接近传感器测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 重置模拟数据
    if (this.mockProximityData) {
      this.mockProximityData = {
        distance: 10.5,
        maxRange: 50.0,
        minRange: 0.0,
        isNear: false,
        accuracy: 0.1
      };
    }

    // 清理监听器
    this.proximityWatchers.forEach(watcher => {
      if (watcher.timer) {
        clearInterval(watcher.timer);
      }
    });
    this.proximityWatchers = [];
  }

  /**
   * 测试获取当前接近状态
   */
  @test
  async '获取当前接近状态'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取当前接近状态超时'));
        }, 5000);

        this.proximityService.getCurrentProximity(
          (proximity) => {
            clearTimeout(timeout);
            this.assertNotNull(proximity, '接近数据不应为空');
            this.assertTypeOf(proximity.distance, 'number', '距离值应为数字');
            this.assertTypeOf(proximity.isNear, 'boolean', '接近状态应为布尔值');
            this.assertTypeOf(proximity.timestamp, 'number', '时间戳应为数字');

            // 验证数据范围
            this.assertTrue(proximity.distance >= 0, '距离值应为非负数');
            this.assertTrue(proximity.distance <= proximity.maxRange, '距离值不应超过最大范围');

            console.log('当前接近状态:', proximity);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取当前接近状态失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('获取当前接近状态测试失败:', error);
      this.fail(`获取当前接近状态测试失败: ${error.message}`);
    }
  }

  /**
   * 测试监听接近变化
   */
  @test
  async '监听接近状态变化'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('监听接近变化超时'));
        }, 15000);

        let callbackCount = 0;
        let nearStateChanges = 0;
        const maxCallbacks = 10;
        const minStateChanges = 2;

        const watcher = this.proximityService.watchProximity(
          (proximity) => {
            callbackCount++;
            this.assertNotNull(proximity, '接近数据不应为空');
            this.assertTypeOf(proximity.distance, 'number', '距离值应为数字');
            this.assertTypeOf(proximity.isNear, 'boolean', '接近状态应为布尔值');

            // 记录状态变化
            if (proximity.isNear !== (this.mockProximityData && this.mockProximityData.lastIsNear)) {
              nearStateChanges++;
              console.log(`接近状态变化 #${nearStateChanges}: ${proximity.isNear ? '接近' : '远离'}`);
            }

            if (this.mockProximityData) {
              this.mockProximityData.lastIsNear = proximity.isNear;
            }

            if (callbackCount >= maxCallbacks && nearStateChanges >= minStateChanges) {
              clearTimeout(timeout);
              this.proximityService.clearWatch(watcher);
              console.log(`接近监听测试完成，收到${callbackCount}次回调，${nearStateChanges}次状态变化`);
              resolve();
            }
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`监听接近变化失败: ${error.message || error.code}`);
          },
          {
            frequency: 300 // 300ms间隔
          }
        );
      });
    } catch (error) {
      console.error('监听接近变化测试失败:', error);
      this.fail(`监听接近变化测试失败: ${error.message}`);
    }
  }

  /**
   * 测试接近阈值设置
   */
  @test
  async '接近阈值设置'() {
    try {
      const testThresholds = [1.0, 3.0, 5.0, 10.0];

      for (const threshold of testThresholds) {
        // 设置阈值
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`设置阈值${threshold}超时`));
          }, 5000);

          this.proximityService.setThreshold(
            threshold,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '设置阈值结果不应为空');
              this.assertEqual(result.threshold, threshold, '设置的阈值应匹配');
              console.log(`成功设置接近阈值: ${threshold}cm`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`设置阈值${threshold}失败: ${error.message || error.code}`);
            }
          );
        });

        // 获取阈值验证
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('获取阈值超时'));
          }, 5000);

          this.proximityService.getThreshold(
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '获取阈值结果不应为空');
              this.assertEqual(result.threshold, threshold, '获取的阈值应与设置的一致');
              console.log(`验证阈值: ${result.threshold}cm`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`获取阈值失败: ${error.message || error.code}`);
            }
          );
        });
      }
    } catch (error) {
      console.error('接近阈值设置测试失败:', error);
      this.fail(`接近阈值设置测试失败: ${error.message}`);
    }
  }

  /**
   * 测试接近传感器精度
   */
  @test
  async '接近传感器精度检查'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('接近传感器精度检查超时'));
        }, 5000);

        this.proximityService.getCurrentProximity(
          (proximity) => {
            clearTimeout(timeout);
            this.assertNotNull(proximity, '接近数据不应为空');

            // 检查精度属性
            if (proximity.accuracy !== undefined) {
              this.assertTypeOf(proximity.accuracy, 'number', '精度值应为数字');
              this.assertTrue(proximity.accuracy >= 0, '精度值应为非负数');
              this.assertTrue(proximity.accuracy <= 1, '精度值应在0-1范围内');
            }

            // 检查范围属性
            this.assertTypeOf(proximity.maxRange, 'number', '最大范围应为数字');
            this.assertTypeOf(proximity.minRange, 'number', '最小范围应为数字');
            this.assertTrue(proximity.maxRange > proximity.minRange, '最大范围应大于最小范围');

            console.log('接近传感器精度检查通过:', proximity);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`接近传感器精度检查失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('接近传感器精度检查测试失败:', error);
      this.fail(`接近传感器精度检查测试失败: ${error.message}`);
    }
  }

  /**
   * 测试接近监听频率控制
   */
  @test
  async '接近监听频率控制'() {
    try {
      const frequencies = [100, 500, 1000];

      for (const frequency of frequencies) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`频率${frequency}ms测试超时`));
          }, 8000);

          let startTime = Date.now();
          let callbackCount = 0;
          const targetCallbacks = 5;

          const watcher = this.proximityService.watchProximity(
            (proximity) => {
              callbackCount++;

              if (callbackCount >= targetCallbacks) {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const averageInterval = duration / (callbackCount - 1);

                // 检查实际频率是否接近设定频率
                const tolerance = frequency * 0.5; // 50%容差
                this.assertTrue(
                  Math.abs(averageInterval - frequency) <= tolerance,
                  `实际频率${averageInterval}ms应接近设定频率${frequency}ms`
                );

                clearTimeout(timeout);
                this.proximityService.clearWatch(watcher);
                console.log(`频率${frequency}ms测试完成，实际平均间隔: ${averageInterval}ms`);
                resolve();
              }
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`频率${frequency}ms监听失败: ${error.message || error.code}`);
            },
            {
              frequency: frequency
            }
          );
        });
      }
    } catch (error) {
      console.error('接近监听频率控制测试失败:', error);
      this.fail(`接近监听频率控制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试接近事件触发
   */
  @test
  async '接近事件触发测试'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('接近事件触发测试超时'));
        }, 15000);

        let nearEvents = 0;
        let farEvents = 0;
        const minEvents = 2;

        const watcher = this.proximityService.watchProximity(
          (proximity) => {
            if (proximity.isNear) {
              nearEvents++;
              console.log(`接近事件 #${nearEvents}: 距离${proximity.distance.toFixed(1)}cm`);
            } else {
              farEvents++;
              console.log(`远离事件 #${farEvents}: 距离${proximity.distance.toFixed(1)}cm`);
            }

            // 检查是否收到足够的接近和远离事件
            if (nearEvents >= minEvents && farEvents >= minEvents) {
              clearTimeout(timeout);
              this.proximityService.clearWatch(watcher);
              console.log(`接近事件触发测试完成，接近:${nearEvents}次，远离:${farEvents}次`);
              resolve();
            }
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`接近事件触发失败: ${error.message || error.code}`);
          },
          {
            frequency: 200
          }
        );
      });
    } catch (error) {
      console.error('接近事件触发测试失败:', error);
      this.fail(`接近事件触发测试失败: ${error.message}`);
    }
  }

  /**
   * 测试多监听器管理
   */
  @test
  async '多监听器管理'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('多监听器管理测试超时'));
        }, 10000);

        let callbacksReceived = 0;
        const totalExpectedCallbacks = 9; // 每个监听器3次回调
        const watchers = [];

        // 创建3个监听器
        for (let i = 0; i < 3; i++) {
          const watcher = this.proximityService.watchProximity(
            (proximity) => {
              callbacksReceived++;
              console.log(`监听器${i+1}收到接近数据 #${Math.ceil(callbacksReceived/3)}`);

              if (callbacksReceived >= totalExpectedCallbacks) {
                clearTimeout(timeout);

                // 清理所有监听器
                watchers.forEach(w => this.proximityService.clearWatch(w));

                this.assertEqual(callbacksReceived, totalExpectedCallbacks, '应收到预期数量的回调');
                this.assertEqual(this.proximityWatchers.length, 0, '所有监听器应被清理');
                console.log('多监听器管理测试完成');
                resolve();
              }
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`监听器${i+1}失败: ${error.message || error.code}`);
            },
            {
              frequency: 300
            }
          );
          watchers.push(watcher);
        }
      });
    } catch (error) {
      console.error('多监听器管理测试失败:', error);
      this.fail(`多监听器管理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试距离变化检测
   */
  @test
  async '距离变化检测'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('距离变化检测测试超时'));
        }, 10000);

        let lastDistance = null;
        let significantChanges = 0;
        const minChanges = 3;

        const watcher = this.proximityService.watchProximity(
          (proximity) => {
            if (lastDistance !== null) {
              const distanceChange = Math.abs(proximity.distance - lastDistance);

              // 检查显著变化
              if (distanceChange > 1.0) { // 1cm以上变化
                significantChanges++;
                console.log(`显著距离变化 #${significantChanges}: ${lastDistance.toFixed(1)}cm -> ${proximity.distance.toFixed(1)}cm`);
              }
            }

            lastDistance = proximity.distance;

            if (significantChanges >= minChanges) {
              clearTimeout(timeout);
              this.proximityService.clearWatch(watcher);
              console.log('距离变化检测测试完成');
              resolve();
            }
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`距离变化检测失败: ${error.message || error.code}`);
          },
          {
            frequency: 200
          }
        );
      });
    } catch (error) {
      console.error('距离变化检测测试失败:', error);
      this.fail(`距离变化检测测试失败: ${error.message}`);
    }
  }

  /**
   * 测试错误处理机制
   */
  @test
  async '错误处理机制'() {
    try {
      // 测试无效参数
      const invalidWatcher = null;

      // 测试清除无效监听器
      try {
        this.proximityService.clearWatch(invalidWatcher);
        // 不应该抛出异常
        this.assertTrue(true, '清除无效监听器不应抛出异常');
      } catch (error) {
        this.fail(`清除无效监听器抛出异常: ${error.message}`);
      }

      // 测试无效阈值
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.proximityService.setThreshold(
          -1.0, // 无效阈值
          (result) => {
            clearTimeout(timeout);
            this.fail('无效阈值设置应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('错误处理机制正常:', error);
            resolve();
          }
        );
      });

      console.log('错误处理机制测试完成');
    } catch (error) {
      console.error('错误处理机制测试失败:', error);
      this.fail(`错误处理机制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试浏览器兼容性
   */
  @test
  async '浏览器兼容性'() {
    try {
      // 检查HTML5+环境
      const isHtml5Plus = typeof plus !== 'undefined' && plus.proximity;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const hasGetCurrentProximity = typeof this.proximityService.getCurrentProximity === 'function';
      const hasWatchProximity = typeof this.proximityService.watchProximity === 'function';
      const hasClearWatch = typeof this.proximityService.clearWatch === 'function';
      const hasSetThreshold = typeof this.proximityService.setThreshold === 'function';
      const hasGetThreshold = typeof this.proximityService.getThreshold === 'function';

      this.assertTrue(hasGetCurrentProximity, 'getCurrentProximity方法应可用');
      this.assertTrue(hasWatchProximity, 'watchProximity方法应可用');
      this.assertTrue(hasClearWatch, 'clearWatch方法应可用');
      this.assertTrue(hasSetThreshold, 'setThreshold方法应可用');
      this.assertTrue(hasGetThreshold, 'getThreshold方法应可用');

      console.log('浏览器兼容性检查完成');
    } catch (error) {
      console.error('浏览器兼容性测试失败:', error);
      this.fail(`浏览器兼容性测试失败: ${error.message}`);
    }
  }

  /**
   * 测试权限检查
   */
  @test
  async '权限检查'() {
    try {
      // 检查接近传感器服务权限
      this.assertNotNull(this.proximityService, '接近传感器服务不应为空');

      // 检查方法可用性
      const methods = [
        'getCurrentProximity',
        'watchProximity',
        'clearWatch',
        'setThreshold',
        'getThreshold'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.proximityService[method] === 'function';
        this.assertTrue(isAvailable, `${method}方法应可用`);
      });

      console.log('权限检查完成');
    } catch (error) {
      console.error('权限检查失败:', error);
      this.fail(`权限检查失败: ${error.message}`);
    }
  }
}

// 导出测试套件
export default ProximityTestSuite;