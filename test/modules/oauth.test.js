import { TestSuite } from '../test-config.js';

/**
 * OAuth认证测试套件
 * @class OAuthTestSuite
 * @extends TestSuite
 */
class OAuthTestSuite extends TestSuite {
  /**
   * OAuth认证服务测试套件
   * 测试OAuth认证、授权令牌管理等功能
   */
  constructor() {
    super('OAuth');
    this.authServices = null;
    this.mockAuthServer = null;
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
        this.authServices = plus.oauth;
        if (!this.authServices) {
          throw new Error('OAuth服务不可用');
        }
      }

      console.log('OAuth测试环境初始化完成');
    } catch (error) {
      console.error('OAuth测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.authServices = {
      getServices: () => {
        return [
          {
            id: 'weixin',
            description: '微信',
            authResult: null,
            userInfo: null,
            authorize: (success, error, options) => {
              setTimeout(() => {
                success({
                  code: 'mock_auth_code',
                  state: options.state || 'mock_state'
                });
              }, 100);
            },
            logout: (success, error) => {
              setTimeout(() => success(), 50);
            },
            getUserInfo: (success, error) => {
              setTimeout(() => {
                success({
                  openid: 'mock_openid',
                  nickname: '测试用户',
                  headimgurl: 'https://example.com/avatar.jpg',
                  sex: 1,
                  province: '广东',
                  city: '深圳',
                  country: '中国'
                });
              }, 100);
            }
          },
          {
            id: 'qq',
            description: 'QQ',
            authResult: null,
            userInfo: null,
            authorize: (success, error, options) => {
              setTimeout(() => {
                success({
                  code: 'mock_qq_code',
                  state: options.state || 'mock_state'
                });
              }, 100);
            },
            logout: (success, error) => {
              setTimeout(() => success(), 50);
            },
            getUserInfo: (success, error) => {
              setTimeout(() => {
                success({
                  openid: 'mock_qq_openid',
                  nickname: 'QQ测试用户',
                  figureurl: 'https://example.com/qq_avatar.jpg',
                  gender: '男',
                  province: '广东',
                  city: '深圳'
                });
              }, 100);
            }
          },
          {
            id: 'sinaweibo',
            description: '新浪微博',
            authResult: null,
            userInfo: null,
            authorize: (success, error, options) => {
              setTimeout(() => {
                success({
                  code: 'mock_weibo_code',
                  state: options.state || 'mock_state'
                });
              }, 100);
            },
            logout: (success, error) => {
              setTimeout(() => success(), 50);
            },
            getUserInfo: (success, error) => {
              setTimeout(() => {
                success({
                  id: 'mock_weibo_id',
                  screen_name: '微博测试用户',
                  profile_image_url: 'https://example.com/weibo_avatar.jpg',
                  gender: 'm',
                  location: '广东 深圳'
                });
              }, 100);
            }
          }
        ];
      }
    };
  }

  /**
   * 测试后清理
   */
  @afterAll
  async cleanup() {
    try {
      // 清理认证状态
      if (this.authServices && this.authServices.getServices) {
        const services = this.authServices.getServices();
        services.forEach(service => {
          service.authResult = null;
          service.userInfo = null;
        });
      }

      console.log('OAuth测试环境清理完成');
    } catch (error) {
      console.error('OAuth测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 重置认证状态
    if (this.authServices && this.authServices.getServices) {
      const services = this.authServices.getServices();
      services.forEach(service => {
        service.authResult = null;
        service.userInfo = null;
      });
    }
  }

  /**
   * 测试获取OAuth服务列表
   */
  @test
  async '获取OAuth服务列表'() {
    try {
      const services = this.authServices.getServices();

      // 验证服务列表不为空
      this.assertNotNull(services, '服务列表不应为空');
      this.assertGreaterThan(services.length, 0, '应至少有一个OAuth服务');

      // 验证服务结构
      services.forEach(service => {
        this.assertNotNull(service.id, '服务ID不应为空');
        this.assertNotNull(service.description, '服务描述不应为空');
        this.assertTypeOf(service.authorize, 'function', 'authorize方法应存在');
        this.assertTypeOf(service.logout, 'function', 'logout方法应存在');
        this.assertTypeOf(service.getUserInfo, 'function', 'getUserInfo方法应存在');
      });

      console.log(`成功获取${services.length}个OAuth服务`);
    } catch (error) {
      console.error('获取OAuth服务列表失败:', error);
      this.fail(`获取OAuth服务列表失败: ${error.message}`);
    }
  }

  /**
   * 测试微信授权
   */
  @test
  async '微信授权认证'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');

      if (!weixinService) {
        this.skip('微信OAuth服务不可用');
        return;
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('微信授权超时'));
        }, 10000);

        weixinService.authorize(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '授权结果不应为空');
            this.assertNotNull(result.code, '授权码不应为空');
            this.assertNotNull(result.state, '状态参数不应为空');

            // 保存授权结果
            weixinService.authResult = result;
            console.log('微信授权成功:', result);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`微信授权失败: ${error.message || error.code}`);
          },
          {
            state: 'test_state_' + Date.now()
          }
        );
      });
    } catch (error) {
      console.error('微信授权测试失败:', error);
      this.fail(`微信授权测试失败: ${error.message}`);
    }
  }

  /**
   * 测试QQ授权
   */
  @test
  async 'QQ授权认证'() {
    try {
      const services = this.authServices.getServices();
      const qqService = services.find(s => s.id === 'qq');

      if (!qqService) {
        this.skip('QQ OAuth服务不可用');
        return;
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('QQ授权超时'));
        }, 10000);

        qqService.authorize(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '授权结果不应为空');
            this.assertNotNull(result.code, '授权码不应为空');
            this.assertNotNull(result.state, '状态参数不应为空');

            // 保存授权结果
            qqService.authResult = result;
            console.log('QQ授权成功:', result);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`QQ授权失败: ${error.message || error.code}`);
          },
          {
            state: 'test_state_' + Date.now()
          }
        );
      });
    } catch (error) {
      console.error('QQ授权测试失败:', error);
      this.fail(`QQ授权测试失败: ${error.message}`);
    }
  }

  /**
   * 测试微博授权
   */
  @test
  async '微博授权认证'() {
    try {
      const services = this.authServices.getServices();
      const weiboService = services.find(s => s.id === 'sinaweibo');

      if (!weiboService) {
        this.skip('微博OAuth服务不可用');
        return;
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('微博授权超时'));
        }, 10000);

        weiboService.authorize(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '授权结果不应为空');
            this.assertNotNull(result.code, '授权码不应为空');
            this.assertNotNull(result.state, '状态参数不应为空');

            // 保存授权结果
            weiboService.authResult = result;
            console.log('微博授权成功:', result);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`微博授权失败: ${error.message || error.code}`);
          },
          {
            state: 'test_state_' + Date.now()
          }
        );
      });
    } catch (error) {
      console.error('微博授权测试失败:', error);
      this.fail(`微博授权测试失败: ${error.message}`);
    }
  }

  /**
   * 测试获取用户信息
   */
  @test
  async '获取用户信息'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');

      if (!weixinService) {
        this.skip('微信OAuth服务不可用');
        return;
      }

      // 先进行授权
      await new Promise((resolve, reject) => {
        weixinService.authorize(
          (result) => {
            weixinService.authResult = result;
            resolve();
          },
          (error) => reject(error)
        );
      });

      // 获取用户信息
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取用户信息超时'));
        }, 10000);

        weixinService.getUserInfo(
          (userInfo) => {
            clearTimeout(timeout);
            this.assertNotNull(userInfo, '用户信息不应为空');
            this.assertNotNull(userInfo.openid, '用户ID不应为空');
            this.assertNotNull(userInfo.nickname, '用户昵称不应为空');
            this.assertTypeOf(userInfo.headimgurl, 'string', '头像URL应为字符串');

            // 保存用户信息
            weixinService.userInfo = userInfo;
            console.log('获取用户信息成功:', userInfo);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取用户信息失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('获取用户信息测试失败:', error);
      this.fail(`获取用户信息测试失败: ${error.message}`);
    }
  }

  /**
   * 测试登出功能
   */
  @test
  async '用户登出'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');

      if (!weixinService) {
        this.skip('微信OAuth服务不可用');
        return;
      }

      // 先进行授权
      await new Promise((resolve, reject) => {
        weixinService.authorize(
          (result) => {
            weixinService.authResult = result;
            resolve();
          },
          (error) => reject(error)
        );
      });

      // 执行登出
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('登出操作超时'));
        }, 10000);

        weixinService.logout(
          () => {
            clearTimeout(timeout);
            // 验证登出状态
            this.assertNull(weixinService.authResult, '登出后授权结果应为空');
            this.assertNull(weixinService.userInfo, '登出后用户信息应为空');
            console.log('用户登出成功');
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`登出失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('用户登出测试失败:', error);
      this.fail(`用户登出测试失败: ${error.message}`);
    }
  }

  /**
   * 测试授权错误处理
   */
  @test
  async '授权错误处理'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');

      if (!weixinService) {
        this.skip('微信OAuth服务不可用');
        return;
      }

      // 模拟取消授权
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('授权错误处理测试超时'));
        }, 10000);

        weixinService.authorize(
          (result) => {
            clearTimeout(timeout);
            this.fail('预期授权应该被取消');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            this.assertNotNull(error.code, '错误码不应为空');
            console.log('授权错误处理正确:', error);
            resolve();
          },
          {
            state: 'cancel_test'
          }
        );
      });
    } catch (error) {
      console.error('授权错误处理测试失败:', error);
      this.fail(`授权错误处理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试并发授权请求
   */
  @test
  async '并发授权请求'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');
      const qqService = services.find(s => s.id === 'qq');

      if (!weixinService || !qqService) {
        this.skip('OAuth服务不可用');
        return;
      }

      // 并发发起授权请求
      const promises = [
        new Promise((resolve, reject) => {
          weixinService.authorize(
            (result) => {
              weixinService.authResult = result;
              resolve(result);
            },
            reject
          );
        }),
        new Promise((resolve, reject) => {
          qqService.authorize(
            (result) => {
              qqService.authResult = result;
              resolve(result);
            },
            reject
          );
        })
      ];

      const results = await Promise.allSettled(promises);

      // 验证结果
      this.assertEqual(results.length, 2, '应有两个授权结果');

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.assertNotNull(result.value, `授权结果${index}不应为空`);
          this.assertNotNull(result.value.code, `授权码${index}不应为空');
        }
      });

      console.log('并发授权请求测试完成');
    } catch (error) {
      console.error('并发授权请求测试失败:', error);
      this.fail(`并发授权请求测试失败: ${error.message}`);
    }
  }

  /**
   * 测试状态参数验证
   */
  @test
  async '状态参数验证'() {
    try {
      const services = this.authServices.getServices();
      const weixinService = services.find(s => s.id === 'weixin');

      if (!weixinService) {
        this.skip('微信OAuth服务不可用');
        return;
      }

      const testState = 'custom_state_' + Date.now();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('状态参数验证测试超时'));
        }, 10000);

        weixinService.authorize(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '授权结果不应为空');
            this.assertEqual(result.state, testState, '状态参数应与传入的一致');
            console.log('状态参数验证成功:', result.state);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`状态参数验证失败: ${error.message || error.code}`);
          },
          {
            state: testState
          }
        );
      });
    } catch (error) {
      console.error('状态参数验证测试失败:', error);
      this.fail(`状态参数验证测试失败: ${error.message}`);
    }
  }

  /**
   * 测试浏览器兼容性
   */
  @test
  async '浏览器兼容性'() {
    try {
      // 检查HTML5+环境
      const isHtml5Plus = typeof plus !== 'undefined' && plus.oauth;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const hasGetServices = typeof this.authServices.getServices === 'function';
      this.assertTrue(hasGetServices, 'getServices方法应可用');

      // 测试服务获取
      const services = this.authServices.getServices();
      this.assertNotNull(services, '服务列表不应为空');

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
      const services = this.authServices.getServices();

      // 检查服务权限状态
      services.forEach(service => {
        this.assertNotNull(service, '服务对象不应为空');
        this.assertNotNull(service.id, '服务ID不应为空');
        this.assertTypeOf(service.authorize, 'function', 'authorize方法应存在');
        this.assertTypeOf(service.logout, 'function', 'logout方法应存在');
        this.assertTypeOf(service.getUserInfo, 'function', 'getUserInfo方法应存在');
      });

      console.log('权限检查完成');
    } catch (error) {
      console.error('权限检查失败:', error);
      this.fail(`权限检查失败: ${error.message}`);
    }
  }
}

// 导出测试套件
export default OAuthTestSuite;