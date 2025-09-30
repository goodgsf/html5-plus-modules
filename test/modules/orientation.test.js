import { TestSuite } from '../test-config.js';

/**
 * 设备方向测试套件
 * @class OrientationTestSuite
 * @extends TestSuite
 */
class OrientationTestSuite extends TestSuite {
  /**
   * 设备方向管理测试套件
   * 测试方向检测、锁定、监控等功能
   */
  constructor() {
    super('Orientation');
    this.orientationService = null;
    this.orientationChangeCallback = null;
    this.mockOrientationData = null;
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
        this.orientationService = plus.orientation;
        if (!this.orientationService) {
          throw new Error('方向服务不可用');
        }
      }

      console.log('方向测试环境初始化完成');
    } catch (error) {
      console.error('方向测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockOrientationData = {
      alpha: 45.0,    // 绕Z轴旋转
      beta: 30.0,     // 绕X轴旋转
      gamma: 15.0,    // 绕Y轴旋转
      magneticHeading: 90.0,  // 磁力方向
      trueHeading: 85.0,      // 真实方向
      headingAccuracy: 5.0     // 方向精度
    };

    this.orientationService = {
      getCurrentOrientation: (success, error) => {
        setTimeout(() => {
          success({
            alpha: this.mockOrientationData.alpha,
            beta: this.mockOrientationData.beta,
            gamma: this.mockOrientationData.gamma,
            magneticHeading: this.mockOrientationData.magneticHeading,
            trueHeading: this.mockOrientationData.trueHeading,
            headingAccuracy: this.mockOrientationData.headingAccuracy,
            timestamp: Date.now()
          });
        }, 50);
      },
      watchOrientation: (success, error, options) => {
        const interval = options && options.frequency ? options.frequency : 1000;
        const watchId = 'watch_' + Date.now();

        const timer = setInterval(() => {
          // 模拟方向变化
          this.mockOrientationData.alpha += (Math.random() - 0.5) * 10;
          this.mockOrientationData.beta += (Math.random() - 0.5) * 5;
          this.mockOrientationData.gamma += (Math.random() - 0.5) * 5;

          success({
            alpha: this.mockOrientationData.alpha,
            beta: this.mockOrientationData.beta,
            gamma: this.mockOrientationData.gamma,
            magneticHeading: this.mockOrientationData.magneticHeading,
            trueHeading: this.mockOrientationData.trueHeading,
            headingAccuracy: this.mockOrientationData.headingAccuracy,
            timestamp: Date.now()
          });
        }, interval);

        return {
          watchId: watchId,
          clear: () => clearInterval(timer)
        };
      },
      clearWatch: (watchId) => {
        console.log('清除方向监听:', watchId);
      },
      lockOrientation: (orientation, success, error) => {
        setTimeout(() => {
          success({ orientation: orientation });
        }, 50);
      },
      unlockOrientation: (success, error) => {
        setTimeout(() => {
          success({ unlocked: true });
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
      // 清理方向监听
      if (this.orientationService && this.orientationService.clearWatch) {
        // 在实际环境中，需要清理所有活动的监听器
        console.log('方向测试环境清理完成');
      }

      // 移除事件监听
      if (this.orientationChangeCallback) {
        this.orientationChangeCallback = null;
      }

      console.log('方向测试环境清理完成');
    } catch (error) {
      console.error('方向测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 重置模拟数据
    if (this.mockOrientationData) {
      this.mockOrientationData = {
        alpha: 45.0,
        beta: 30.0,
        gamma: 15.0,
        magneticHeading: 90.0,
        trueHeading: 85.0,
        headingAccuracy: 5.0
      };
    }
  }

  /**
   * 测试获取当前方向
   */
  @test
  async '获取当前设备方向'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取当前方向超时'));
        }, 5000);

        this.orientationService.getCurrentOrientation(
          (orientation) => {
            clearTimeout(timeout);
            this.assertNotNull(orientation, '方向数据不应为空');
            this.assertTypeOf(orientation.alpha, 'number', 'alpha值应为数字');
            this.assertTypeOf(orientation.beta, 'number', 'beta值应为数字');
            this.assertTypeOf(orientation.gamma, 'number', 'gamma值应为数字');
            this.assertTypeOf(orientation.timestamp, 'number', '时间戳应为数字');

            // 验证数据范围
            this.assertTrue(orientation.alpha >= 0 && orientation.alpha <= 360, 'alpha值应在0-360范围内');
            this.assertTrue(orientation.beta >= -180 && orientation.beta <= 180, 'beta值应在-180到180范围内');
            this.assertTrue(orientation.gamma >= -90 && orientation.gamma <= 90, 'gamma值应在-90到90范围内');

            console.log('当前方向数据:', orientation);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取当前方向失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('获取当前方向测试失败:', error);
      this.fail(`获取当前方向测试失败: ${error.message}`);
    }
  }

  /**
   * 测试方向监听
   */
  @test
  async '监听设备方向变化'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('方向监听测试超时'));
        }, 10000);

        let callbackCount = 0;
        const maxCallbacks = 3;

        const watchResult = this.orientationService.watchOrientation(
          (orientation) => {
            callbackCount++;
            this.assertNotNull(orientation, '方向数据不应为空');
            this.assertTypeOf(orientation.alpha, 'number', 'alpha值应为数字');
            this.assertTypeOf(orientation.beta, 'number', 'beta值应为数字');
            this.assertTypeOf(orientation.gamma, 'number', 'gamma值应为数字');

            console.log(`方向变化 #${callbackCount}:`, orientation);

            if (callbackCount >= maxCallbacks) {
              clearTimeout(timeout);
              // 清理监听器
              if (watchResult.watchId) {
                this.orientationService.clearWatch(watchResult.watchId);
              } else if (watchResult.clear) {
                watchResult.clear();
              }
              console.log('方向监听测试完成');
              resolve();
            }
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`方向监听失败: ${error.message || error.code}`);
          },
          {
            frequency: 500 // 500ms间隔
          }
        );
      });
    } catch (error) {
      console.error('方向监听测试失败:', error);
      this.fail(`方向监听测试失败: ${error.message}`);
    }
  }

  /**
   * 测试锁定屏幕方向
   */
  @test
  async '锁定屏幕方向'() {
    try {
      const testOrientations = ['portrait', 'landscape', 'portrait-primary', 'landscape-primary'];

      for (const orientation of testOrientations) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`锁定方向${orientation}超时`));
          }, 5000);

          this.orientationService.lockOrientation(
            orientation,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '锁定结果不应为空');
              this.assertEqual(result.orientation, orientation, '锁定方向应匹配');
              console.log(`成功锁定方向: ${orientation}`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`锁定方向${orientation}失败: ${error.message || error.code}`);
            }
          );
        });

        // 解锁方向
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('解锁方向超时'));
          }, 5000);

          this.orientationService.unlockOrientation(
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '解锁结果不应为空');
              this.assertTrue(result.unlocked, '解锁成功标志应为true');
              console.log('成功解锁方向');
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`解锁方向失败: ${error.message || error.code}`);
            }
          );
        });
      }
    } catch (error) {
      console.error('屏幕方向锁定测试失败:', error);
      this.fail(`屏幕方向锁定测试失败: ${error.message}`);
    }
  }

  /**
   * 测试方向数据精度
   */
  @test
  async '方向数据精度检查'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('方向数据精度检查超时'));
        }, 5000);

        this.orientationService.getCurrentOrientation(
          (orientation) => {
            clearTimeout(timeout);
            this.assertNotNull(orientation, '方向数据不应为空');

            // 检查磁力方向数据
            if (orientation.magneticHeading !== undefined) {
              this.assertTypeOf(orientation.magneticHeading, 'number', '磁力方向应为数字');
              this.assertTrue(orientation.magneticHeading >= 0 && orientation.magneticHeading <= 360, '磁力方向应在0-360范围内');
            }

            // 检查真实方向数据
            if (orientation.trueHeading !== undefined) {
              this.assertTypeOf(orientation.trueHeading, 'number', '真实方向应为数字');
              this.assertTrue(orientation.trueHeading >= 0 && orientation.trueHeading <= 360, '真实方向应在0-360范围内');
            }

            // 检查方向精度
            if (orientation.headingAccuracy !== undefined) {
              this.assertTypeOf(orientation.headingAccuracy, 'number', '方向精度应为数字');
              this.assertTrue(orientation.headingAccuracy >= 0, '方向精度应为非负数');
            }

            console.log('方向数据精度检查通过:', orientation);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`方向数据精度检查失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('方向数据精度检查测试失败:', error);
      this.fail(`方向数据精度检查测试失败: ${error.message}`);
    }
  }

  /**
   * 测试方向监听频率控制
   */
  @test
  async '方向监听频率控制'() {
    try {
      const frequencies = [100, 500, 1000, 2000];

      for (const frequency of frequencies) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`频率${frequency}ms测试超时`));
          }, 8000);

          let startTime = Date.now();
          let callbackCount = 0;
          const targetCallbacks = 3;

          const watchResult = this.orientationService.watchOrientation(
            (orientation) => {
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
                if (watchResult.watchId) {
                  this.orientationService.clearWatch(watchResult.watchId);
                } else if (watchResult.clear) {
                  watchResult.clear();
                }
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
      console.error('方向监听频率控制测试失败:', error);
      this.fail(`方向监听频率控制测试失败: ${error.message}`);
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
        const totalExpectedCallbacks = 6; // 每个监听器3次回调
        const watchResults = [];

        // 创建3个监听器
        for (let i = 0; i < 3; i++) {
          const watchResult = this.orientationService.watchOrientation(
            (orientation) => {
              callbacksReceived++;
              console.log(`监听器${i+1}收到方向数据 #${Math.ceil(callbacksReceived/3)}`);

              if (callbacksReceived >= totalExpectedCallbacks) {
                clearTimeout(timeout);

                // 清理所有监听器
                watchResults.forEach(result => {
                  if (result.watchId) {
                    this.orientationService.clearWatch(result.watchId);
                  } else if (result.clear) {
                    result.clear();
                  }
                });

                this.assertEqual(callbacksReceived, totalExpectedCallbacks, '应收到预期数量的回调');
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
          watchResults.push(watchResult);
        }
      });
    } catch (error) {
      console.error('多监听器管理测试失败:', error);
      this.fail(`多监听器管理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试方向变化事件处理
   */
  @test
  async '方向变化事件处理'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('方向变化事件处理测试超时'));
        }, 10000);

        let lastOrientation = null;
        let changeCount = 0;
        const minChanges = 3;

        const watchResult = this.orientationService.watchOrientation(
          (orientation) => {
            if (lastOrientation) {
              const alphaChange = Math.abs(orientation.alpha - lastOrientation.alpha);
              const betaChange = Math.abs(orientation.beta - lastOrientation.beta);
              const gammaChange = Math.abs(orientation.gamma - lastOrientation.gamma);

              // 检查是否有显著变化
              if (alphaChange > 1 || betaChange > 1 || gammaChange > 1) {
                changeCount++;
                console.log(`方向变化 #${changeCount}: α=${alphaChange.toFixed(2)}°, β=${betaChange.toFixed(2)}°, γ=${gammaChange.toFixed(2)}°`);
              }
            }

            lastOrientation = orientation;

            if (changeCount >= minChanges) {
              clearTimeout(timeout);
              if (watchResult.watchId) {
                this.orientationService.clearWatch(watchResult.watchId);
              } else if (watchResult.clear) {
                watchResult.clear();
              }
              console.log('方向变化事件处理测试完成');
              resolve();
            }
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`方向变化事件处理失败: ${error.message || error.code}`);
          },
          {
            frequency: 500
          }
        );
      });
    } catch (error) {
      console.error('方向变化事件处理测试失败:', error);
      this.fail(`方向变化事件处理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试错误处理
   */
  @test
  async '错误处理机制'() {
    try {
      // 测试无效参数
      const invalidWatchId = 'invalid_watch_id';

      // 测试清除无效监听器
      try {
        this.orientationService.clearWatch(invalidWatchId);
        // 不应该抛出异常
        this.assertTrue(true, '清除无效监听器不应抛出异常');
      } catch (error) {
        this.fail(`清除无效监听器抛出异常: ${error.message}`);
      }

      // 测试锁定无效方向
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.orientationService.lockOrientation(
          'invalid_orientation',
          (result) => {
            clearTimeout(timeout);
            this.fail('无效方向锁定应该失败');
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
      const isHtml5Plus = typeof plus !== 'undefined' && plus.orientation;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const hasGetCurrentOrientation = typeof this.orientationService.getCurrentOrientation === 'function';
      const hasWatchOrientation = typeof this.orientationService.watchOrientation === 'function';
      const hasClearWatch = typeof this.orientationService.clearWatch === 'function';
      const hasLockOrientation = typeof this.orientationService.lockOrientation === 'function';
      const hasUnlockOrientation = typeof this.orientationService.unlockOrientation === 'function';

      this.assertTrue(hasGetCurrentOrientation, 'getCurrentOrientation方法应可用');
      this.assertTrue(hasWatchOrientation, 'watchOrientation方法应可用');
      this.assertTrue(hasClearWatch, 'clearWatch方法应可用');
      this.assertTrue(hasLockOrientation, 'lockOrientation方法应可用');
      this.assertTrue(hasUnlockOrientation, 'unlockOrientation方法应可用');

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
      // 检查方向服务权限
      this.assertNotNull(this.orientationService, '方向服务不应为空');

      // 检查方法可用性
      const methods = [
        'getCurrentOrientation',
        'watchOrientation',
        'clearWatch',
        'lockOrientation',
        'unlockOrientation'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.orientationService[method] === 'function';
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
export default OrientationTestSuite;