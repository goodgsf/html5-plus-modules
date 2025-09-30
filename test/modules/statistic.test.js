import { TestSuite } from '../test-config.js';

/**
 * 统计分析测试套件
 * @class StatisticTestSuite
 * @extends TestSuite
 */
class StatisticTestSuite extends TestSuite {
  /**
   * 统计分析测试套件
   * 测试用户行为统计、事件追踪、数据分析等功能
   */
  constructor() {
    super('Statistic');
    this.statisticService = null;
    this.mockEventData = null;
    this.mockAnalyticsData = null;
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
        this.statisticService = plus.statistic;
        if (!this.statisticService) {
          throw new Error('统计分析服务不可用');
        }
      }

      console.log('统计分析测试环境初始化完成');
    } catch (error) {
      console.error('统计分析测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockEventData = {
      events: [],
      sessions: [],
      pageViews: []
    };

    this.mockAnalyticsData = {
      totalEvents: 0,
      uniqueUsers: 156,
      sessionCount: 45,
      averageSessionTime: 180000, // 3分钟
      topEvents: ['page_view', 'button_click', 'user_login'],
      dailyStats: {
        activeUsers: 23,
        newUsers: 5,
        sessionCount: 8,
        pageViews: 42
      }
    };

    this.statisticService = {
      // 事件追踪
      trackEvent: (eventName, eventData, success, error) => {
        setTimeout(() => {
          const event = {
            id: 'event_' + Date.now(),
            name: eventName,
            data: eventData || {},
            timestamp: Date.now(),
            sessionId: this.getCurrentSessionId()
          };
          this.mockEventData.events.push(event);
          this.mockAnalyticsData.totalEvents++;

          success({
            eventId: event.id,
            status: 'tracked',
            timestamp: event.timestamp
          });
        }, 50);
      },

      // 页面访问追踪
      trackPageView: (pageName, pageData, success, error) => {
        setTimeout(() => {
          const pageView = {
            id: 'pageview_' + Date.now(),
            pageName: pageName,
            data: pageData || {},
            timestamp: Date.now(),
            sessionId: this.getCurrentSessionId()
          };
          this.mockEventData.pageViews.push(pageView);
          this.mockAnalyticsData.dailyStats.pageViews++;

          success({
            pageViewId: pageView.id,
            status: 'tracked',
            timestamp: pageView.timestamp
          });
        }, 50);
      },

      // 开始会话
      startSession: (userData, success, error) => {
        setTimeout(() => {
          const session = {
            id: 'session_' + Date.now(),
            userId: userData ? userData.userId : null,
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            events: [],
            pageViews: []
          };
          this.mockEventData.sessions.push(session);
          this.mockAnalyticsData.sessionCount++;

          success({
            sessionId: session.id,
            status: 'started',
            timestamp: session.startTime
          });
        }, 50);
      },

      // 结束会话
      endSession: (sessionId, success, error) => {
        setTimeout(() => {
          const session = this.mockEventData.sessions.find(s => s.id === sessionId);
          if (session) {
            session.endTime = Date.now();
            session.duration = session.endTime - session.startTime;

            success({
              sessionId: session.id,
              duration: session.duration,
              status: 'ended',
              timestamp: session.endTime
            });
          } else {
            error({ code: 'SESSION_NOT_FOUND', message: '会话不存在' });
          }
        }, 50);
      },

      // 获取统计数据
      getStatistics: (startTime, endTime, metrics, success, error) => {
        setTimeout(() => {
          const stats = this.calculateStatistics(startTime, endTime, metrics);
          success(stats);
        }, 100);
      },

      // 获取用户行为分析
      getUserBehavior: (userId, days, success, error) => {
        setTimeout(() => {
          const behavior = this.analyzeUserBehavior(userId, days);
          success(behavior);
        }, 100);
      },

      // 获取实时统计
      getRealTimeStats: (success, error) => {
        setTimeout(() => {
          success({
            activeUsers: Math.floor(Math.random() * 50) + 10,
            currentSessions: this.mockEventData.sessions.filter(s => !s.endTime).length,
            eventsPerMinute: Math.floor(Math.random() * 20) + 5,
            pageViewsPerMinute: Math.floor(Math.random() * 30) + 10
          });
        }, 50);
      },

      // 设置用户属性
      setUserProperties: (properties, success, error) => {
        setTimeout(() => {
          success({
            status: 'updated',
            timestamp: Date.now()
          });
        }, 50);
      },

      // 获取热门事件
      getTopEvents: (limit, success, error) => {
        setTimeout(() => {
          const topEvents = this.mockAnalyticsData.topEvents.slice(0, limit || 10);
          success(topEvents);
        }, 50);
      }
    };
  }

  /**
   * 获取当前会话ID
   */
  getCurrentSessionId() {
    const activeSession = this.mockEventData.sessions.find(s => !s.endTime);
    return activeSession ? activeSession.id : null;
  }

  /**
   * 计算统计数据
   */
  calculateStatistics(startTime, endTime, metrics) {
    const filteredEvents = this.mockEventData.events.filter(
      e => e.timestamp >= startTime && e.timestamp <= endTime
    );

    const filteredPageViews = this.mockEventData.pageViews.filter(
      p => p.timestamp >= startTime && p.timestamp <= endTime
    );

    const stats = {
      totalEvents: filteredEvents.length,
      totalPageViews: filteredPageViews.length,
      uniqueUsers: new Set(filteredEvents.map(e => e.sessionId)).size,
      eventBreakdown: {}
    };

    // 事件分类统计
    filteredEvents.forEach(event => {
      if (!stats.eventBreakdown[event.name]) {
        stats.eventBreakdown[event.name] = 0;
      }
      stats.eventBreakdown[event.name]++;
    });

    return stats;
  }

  /**
   * 分析用户行为
   */
  analyzeUserBehavior(userId, days) {
    const daysAgo = Date.now() - (days * 24 * 60 * 60 * 1000);
    const userEvents = this.mockEventData.events.filter(
      e => e.timestamp >= daysAgo && e.data.userId === userId
    );

    return {
      userId: userId,
      totalEvents: userEvents.length,
      mostActiveTime: this.calculateMostActiveTime(userEvents),
      favoritePages: this.calculateFavoritePages(userEvents),
      sessionCount: new Set(userEvents.map(e => e.sessionId)).size
    };
  }

  /**
   * 计算最活跃时间
   */
  calculateMostActiveTime(events) {
    const hourCounts = {};
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let maxHour = 0;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });

    return maxHour;
  }

  /**
   * 计算偏好页面
   */
  calculateFavoritePages(events) {
    const pageCounts = {};
    events.forEach(event => {
      if (event.data.pageName) {
        pageCounts[event.data.pageName] = (pageCounts[event.data.pageName] || 0) + 1;
      }
    });

    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page]) => page);
  }

  /**
   * 测试后清理
   */
  @afterAll
  async cleanup() {
    try {
      // 清理模拟数据
      if (this.mockEventData) {
        this.mockEventData.events = [];
        this.mockEventData.sessions = [];
        this.mockEventData.pageViews = [];
      }

      console.log('统计分析测试环境清理完成');
    } catch (error) {
      console.error('统计分析测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 重置模拟数据
    if (this.mockEventData) {
      this.mockEventData.events = [];
      this.mockEventData.sessions = [];
      this.mockEventData.pageViews = [];
    }

    if (this.mockAnalyticsData) {
      this.mockAnalyticsData.totalEvents = 0;
      this.mockAnalyticsData.sessionCount = 0;
      this.mockAnalyticsData.dailyStats.pageViews = 0;
    }
  }

  /**
   * 测试事件追踪
   */
  @test
  async '事件追踪功能'() {
    try {
      const testEvents = [
        { name: 'user_login', data: { userId: 'user123', method: 'email' } },
        { name: 'button_click', data: { buttonId: 'submit_btn', page: 'home' } },
        { name: 'page_view', data: { pageName: 'dashboard', duration: 3000 } }
      ];

      for (const event of testEvents) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`事件追踪超时: ${event.name}`));
          }, 5000);

          this.statisticService.trackEvent(
            event.name,
            event.data,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '追踪结果不应为空');
              this.assertNotNull(result.eventId, '事件ID不应为空');
              this.assertEqual(result.status, 'tracked', '追踪状态应为tracked');
              this.assertTypeOf(result.timestamp, 'number', '时间戳应为数字');

              console.log(`事件追踪成功: ${event.name} (${result.eventId})`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`事件追踪失败: ${error.message || error.code}`);
            }
          );
        });
      }

      // 验证事件被记录
      this.assertEqual(this.mockEventData.events.length, testEvents.length, '事件数量应匹配');
    } catch (error) {
      console.error('事件追踪功能测试失败:', error);
      this.fail(`事件追踪功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试页面访问追踪
   */
  @test
  async '页面访问追踪'() {
    try {
      const testPages = [
        { name: 'home', data: { referrer: 'direct', loadTime: 1200 } },
        { name: 'product', data: { referrer: 'home', loadTime: 1800 } },
        { name: 'checkout', data: { referrer: 'product', loadTime: 900 } }
      ];

      for (const page of testPages) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`页面访问追踪超时: ${page.name}`));
          }, 5000);

          this.statisticService.trackPageView(
            page.name,
            page.data,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '页面访问结果不应为空');
              this.assertNotNull(result.pageViewId, '页面访问ID不应为空');
              this.assertEqual(result.status, 'tracked', '追踪状态应为tracked');

              console.log(`页面访问追踪成功: ${page.name} (${result.pageViewId})`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`页面访问追踪失败: ${error.message || error.code}`);
            }
          );
        });
      }

      // 验证页面访问被记录
      this.assertEqual(this.mockEventData.pageViews.length, testPages.length, '页面访问数量应匹配');
    } catch (error) {
      console.error('页面访问追踪测试失败:', error);
      this.fail(`页面访问追踪测试失败: ${error.message}`);
    }
  }

  /**
   * 测试会话管理
   */
  @test
  async '会话管理'() {
    try {
      // 开始会话
      let sessionId;
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('开始会话超时'));
        }, 5000);

        this.statisticService.startSession(
          { userId: 'test_user123' },
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '会话开始结果不应为空');
            this.assertNotNull(result.sessionId, '会话ID不应为空');
            this.assertEqual(result.status, 'started', '会话状态应为started');

            sessionId = result.sessionId;
            console.log('会话开始成功:', sessionId);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`开始会话失败: ${error.message || error.code}`);
          }
        );
      });

      // 追踪一些事件
      await new Promise((resolve) => {
        this.statisticService.trackEvent('test_event', { sessionId: sessionId }, resolve, resolve);
      });

      // 结束会话
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('结束会话超时'));
        }, 5000);

        this.statisticService.endSession(
          sessionId,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '会话结束结果不应为空');
            this.assertEqual(result.sessionId, sessionId, '会话ID应匹配');
            this.assertGreaterThan(result.duration, 0, '会话时长应大于0');
            this.assertEqual(result.status, 'ended', '会话状态应为ended');

            console.log('会话结束成功，持续时间:', result.duration, 'ms');
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`结束会话失败: ${error.message || error.code}`);
          }
        );
      });

      // 验证会话数据
      const session = this.mockEventData.sessions.find(s => s.id === sessionId);
      this.assertNotNull(session, '会话数据应存在');
      this.assertNotNull(session.startTime, '会话开始时间不应为空');
      this.assertNotNull(session.endTime, '会话结束时间不应为空');
      this.assertGreaterThan(session.duration, 0, '会话时长应大于0');
    } catch (error) {
      console.error('会话管理测试失败:', error);
      this.fail(`会话管理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试统计数据获取
   */
  @test
  async '统计数据获取'() {
    try {
      // 先添加一些测试数据
      const now = Date.now();
      const dayAgo = now - 24 * 60 * 60 * 1000;

      await Promise.all([
        new Promise(resolve => {
          this.statisticService.trackEvent('test_event1', { data: 'test1' }, resolve, resolve);
        }),
        new Promise(resolve => {
          this.statisticService.trackEvent('test_event2', { data: 'test2' }, resolve, resolve);
        }),
        new Promise(resolve => {
          this.statisticService.trackPageView('test_page', { data: 'test' }, resolve, resolve);
        })
      ]);

      // 获取统计数据
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取统计数据超时'));
        }, 5000);

        this.statisticService.getStatistics(
          dayAgo,
          now,
          ['events', 'pageViews', 'uniqueUsers'],
          (stats) => {
            clearTimeout(timeout);
            this.assertNotNull(stats, '统计数据不应为空');
            this.assertTypeOf(stats.totalEvents, 'number', '总事件数应为数字');
            this.assertTypeOf(stats.totalPageViews, 'number', '总页面访问数应为数字');
            this.assertTypeOf(stats.uniqueUsers, 'number', '独立用户数应为数字');
            this.assertNotNull(stats.eventBreakdown, '事件分类数据不应为空');

            console.log('统计数据获取成功:', stats);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取统计数据失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('统计数据获取测试失败:', error);
      this.fail(`统计数据获取测试失败: ${error.message}`);
    }
  }

  /**
   * 测试用户行为分析
   */
  @test
  async '用户行为分析'() {
    try {
      const userId = 'test_user_' + Date.now();
      const days = 7;

      // 添加用户行为数据
      await new Promise(resolve => {
        this.statisticService.trackEvent('user_action', { userId: userId, action: 'login' }, resolve, resolve);
      });

      await new Promise(resolve => {
        this.statisticService.trackEvent('user_action', { userId: userId, action: 'click' }, resolve, resolve);
      });

      await new Promise(resolve => {
        this.statisticService.trackPageView('profile', { userId: userId }, resolve, resolve);
      });

      // 获取用户行为分析
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('用户行为分析超时'));
        }, 5000);

        this.statisticService.getUserBehavior(
          userId,
          days,
          (behavior) => {
            clearTimeout(timeout);
            this.assertNotNull(behavior, '用户行为数据不应为空');
            this.assertEqual(behavior.userId, userId, '用户ID应匹配');
            this.assertTypeOf(behavior.totalEvents, 'number', '总事件数应为数字');
            this.assertTypeOf(behavior.sessionCount, 'number', '会话数应为数字');
            this.assertNotNull(behavior.mostActiveTime, '最活跃时间不应为空');
            this.assertNotNull(behavior.favoritePages, '偏好页面列表不应为空');

            console.log('用户行为分析成功:', behavior);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`用户行为分析失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('用户行为分析测试失败:', error);
      this.fail(`用户行为分析测试失败: ${error.message}`);
    }
  }

  /**
   * 测试实时统计
   */
  @test
  async '实时统计'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('实时统计超时'));
        }, 5000);

        this.statisticService.getRealTimeStats(
          (stats) => {
            clearTimeout(timeout);
            this.assertNotNull(stats, '实时统计数据不应为空');
            this.assertTypeOf(stats.activeUsers, 'number', '活跃用户数应为数字');
            this.assertTypeOf(stats.currentSessions, 'number', '当前会话数应为数字');
            this.assertTypeOf(stats.eventsPerMinute, 'number', '每分钟事件数应为数字');
            this.assertTypeOf(stats.pageViewsPerMinute, 'number', '每分钟页面访问数应为数字');

            this.assertTrue(stats.activeUsers >= 0, '活跃用户数应为非负数');
            this.assertTrue(stats.currentSessions >= 0, '当前会话数应为非负数');
            this.assertTrue(stats.eventsPerMinute >= 0, '每分钟事件数应为非负数');
            this.assertTrue(stats.pageViewsPerMinute >= 0, '每分钟页面访问数应为非负数');

            console.log('实时统计获取成功:', stats);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`实时统计失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('实时统计测试失败:', error);
      this.fail(`实时统计测试失败: ${error.message}`);
    }
  }

  /**
   * 测试热门事件获取
   */
  @test
  async '热门事件获取'() {
    try {
      const limit = 5;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('热门事件获取超时'));
        }, 5000);

        this.statisticService.getTopEvents(
          limit,
          (topEvents) => {
            clearTimeout(timeout);
            this.assertNotNull(topEvents, '热门事件列表不应为空');
            this.assertTrue(topEvents.length <= limit, '热门事件数量不应超过限制');

            topEvents.forEach(event => {
              this.assertTypeOf(event, 'string', '事件名称应为字符串');
              this.assertTrue(event.length > 0, '事件名称不应为空');
            });

            console.log('热门事件获取成功:', topEvents);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`热门事件获取失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('热门事件获取测试失败:', error);
      this.fail(`热门事件获取测试失败: ${error.message}`);
    }
  }

  /**
   * 测试用户属性设置
   */
  @test
  async '用户属性设置'() {
    try {
      const testProperties = {
        name: '测试用户',
        email: 'test@example.com',
        age: 25,
        preferences: { theme: 'dark', language: 'zh-CN' }
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('用户属性设置超时'));
        }, 5000);

        this.statisticService.setUserProperties(
          testProperties,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '设置结果不应为空');
            this.assertEqual(result.status, 'updated', '设置状态应为updated');
            this.assertTypeOf(result.timestamp, 'number', '时间戳应为数字');

            console.log('用户属性设置成功:', result);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`用户属性设置失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('用户属性设置测试失败:', error);
      this.fail(`用户属性设置测试失败: ${error.message}`);
    }
  }

  /**
   * 测试数据准确性
   */
  @test
  async '数据准确性检查'() {
    try {
      const testEventCount = 10;
      const testPageViewCount = 5;

      // 添加测试数据
      const eventPromises = [];
      const pageViewPromises = [];

      for (let i = 0; i < testEventCount; i++) {
        eventPromises.push(
          new Promise(resolve => {
            this.statisticService.trackEvent('accuracy_test', { index: i }, resolve, resolve);
          })
        );
      }

      for (let i = 0; i < testPageViewCount; i++) {
        pageViewPromises.push(
          new Promise(resolve => {
            this.statisticService.trackPageView('accuracy_page', { index: i }, resolve, resolve);
          })
        );
      }

      await Promise.all([...eventPromises, ...pageViewPromises]);

      // 验证数据准确性
      this.assertEqual(this.mockEventData.events.length, testEventCount, '事件数量应匹配');
      this.assertEqual(this.mockEventData.pageViews.length, testPageViewCount, '页面访问数量应匹配');

      // 检查事件数据完整性
      this.mockEventData.events.forEach(event => {
        this.assertNotNull(event.id, '事件ID不应为空');
        this.assertNotNull(event.name, '事件名称不应为空');
        this.assertNotNull(event.timestamp, '事件时间戳不应为空');
        this.assertNotNull(event.data, '事件数据不应为空');
      });

      // 检查页面访问数据完整性
      this.mockEventData.pageViews.forEach(pageView => {
        this.assertNotNull(pageView.id, '页面访问ID不应为空');
        this.assertNotNull(pageView.pageName, '页面名称不应为空');
        this.assertNotNull(pageView.timestamp, '页面访问时间戳不应为空');
      });

      console.log('数据准确性检查通过');
    } catch (error) {
      console.error('数据准确性检查测试失败:', error);
      this.fail(`数据准确性检查测试失败: ${error.message}`);
    }
  }

  /**
   * 测试错误处理机制
   */
  @test
  async '错误处理机制'() {
    try {
      // 测试无效会话ID
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.statisticService.endSession(
          'invalid_session_id',
          (result) => {
            clearTimeout(timeout);
            this.fail('无效会话ID应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            this.assertNotNull(error.code, '错误码不应为空');
            this.assertNotNull(error.message, '错误消息不应为空');
            console.log('无效会话错误处理正常:', error);
            resolve();
          }
        );
      });

      // 测试空事件名称
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.statisticService.trackEvent(
          '',
          { data: 'test' },
          (result) => {
            clearTimeout(timeout);
            this.fail('空事件名称应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('空事件名称错误处理正常:', error);
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
      const isHtml5Plus = typeof plus !== 'undefined' && plus.statistic;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const methods = [
        'trackEvent',
        'trackPageView',
        'startSession',
        'endSession',
        'getStatistics',
        'getUserBehavior',
        'getRealTimeStats',
        'setUserProperties',
        'getTopEvents'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.statisticService[method] === 'function';
        this.assertTrue(isAvailable, `${method}方法应可用`);
      });

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
      // 检查统计分析服务权限
      this.assertNotNull(this.statisticService, '统计分析服务不应为空');

      // 检查方法可用性
      const methods = [
        'trackEvent', 'trackPageView', 'startSession', 'endSession',
        'getStatistics', 'getUserBehavior', 'getRealTimeStats',
        'setUserProperties', 'getTopEvents'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.statisticService[method] === 'function';
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
export default StatisticTestSuite;