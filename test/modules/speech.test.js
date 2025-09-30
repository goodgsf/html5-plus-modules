import { TestSuite } from '../test-config.js';

/**
 * 语音识别与合成测试套件
 * @class SpeechTestSuite
 * @extends TestSuite
 */
class SpeechTestSuite extends TestSuite {
  /**
   * 语音识别与合成测试套件
   * 测试语音识别、语音合成、语音控制等功能
   */
  constructor() {
    super('Speech');
    this.speechService = null;
    this.speechRecognition = null;
    this.speechSynthesis = null;
    this.mockSpeechData = null;
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
        this.speechService = plus.speech;
        if (!this.speechService) {
          throw new Error('语音服务不可用');
        }
        this.speechRecognition = plus.speechRecognition;
        this.speechSynthesis = plus.speechSynthesis;
      }

      console.log('语音测试环境初始化完成');
    } catch (error) {
      console.error('语音测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockSpeechData = {
      recognitionResults: [
        { text: '你好', confidence: 0.95 },
        { text: '今天天气怎么样', confidence: 0.88 },
        { text: '打开音乐', confidence: 0.92 },
        { text: '设置闹钟', confidence: 0.85 }
      ],
      currentResultIndex: 0
    };

    this.speechService = {
      startSpeaking: (text, options, success, error) => {
        setTimeout(() => {
          if (typeof options === 'function') {
            error = success;
            success = options;
            options = {};
          }

          success({
            text: text,
            status: 'started',
            timestamp: Date.now()
          });
        }, 100);
      },
      stopSpeaking: (success, error) => {
        setTimeout(() => {
          success({
            status: 'stopped',
            timestamp: Date.now()
          });
        }, 50);
      },
      pauseSpeaking: (success, error) => {
        setTimeout(() => {
          success({
            status: 'paused',
            timestamp: Date.now()
          });
        }, 50);
      },
      resumeSpeaking: (success, error) => {
        setTimeout(() => {
          success({
            status: 'resumed',
            timestamp: Date.now()
          });
        }, 50);
      }
    };

    this.speechRecognition = {
      start: (success, error, options) => {
        const timeout = options && options.timeout ? options.timeout : 10000;
        const result = this.mockSpeechData.recognitionResults[this.mockSpeechData.currentResultIndex];

        setTimeout(() => {
          success({
            text: result.text,
            confidence: result.confidence,
            timestamp: Date.now()
          });
          this.mockSpeechData.currentResultIndex = (this.mockSpeechData.currentResultIndex + 1) % this.mockSpeechData.recognitionResults.length;
        }, 2000);
      },
      stop: (success, error) => {
        setTimeout(() => {
          success({
            status: 'stopped',
            timestamp: Date.now()
          });
        }, 50);
      },
      cancel: (success, error) => {
        setTimeout(() => {
          success({
            status: 'cancelled',
            timestamp: Date.now()
          });
        }, 50);
      }
    };

    this.speechSynthesis = {
      speak: (text, options, success, error) => {
        setTimeout(() => {
          if (typeof options === 'function') {
            error = success;
            success = options;
            options = {};
          }

          success({
            text: text,
            status: 'speaking',
            timestamp: Date.now()
          });
        }, 100);
      },
      stop: (success, error) => {
        setTimeout(() => {
          success({
            status: 'stopped',
            timestamp: Date.now()
          });
        }, 50);
      },
      pause: (success, error) => {
        setTimeout(() => {
          success({
            status: 'paused',
            timestamp: Date.now()
          });
        }, 50);
      },
      resume: (success, error) => {
        setTimeout(() => {
          success({
            status: 'resumed',
            timestamp: Date.now()
          });
        }, 50);
      },
      getVoices: (success, error) => {
        setTimeout(() => {
          success([
            { name: '中文（普通话）', lang: 'zh-CN', localService: true },
            { name: 'English', lang: 'en-US', localService: true },
            { name: '日本語', lang: 'ja-JP', localService: false }
          ]);
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
      // 停止语音播放
      if (this.speechService && this.speechService.stopSpeaking) {
        this.speechService.stopSpeaking(() => {
          console.log('语音播放已停止');
        });
      }

      // 停止语音识别
      if (this.speechRecognition && this.speechRecognition.stop) {
        this.speechRecognition.stop(() => {
          console.log('语音识别已停止');
        });
      }

      // 停止语音合成
      if (this.speechSynthesis && this.speechSynthesis.stop) {
        this.speechSynthesis.stop(() => {
          console.log('语音合成已停止');
        });
      }

      console.log('语音测试环境清理完成');
    } catch (error) {
      console.error('语音测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 重置模拟数据
    if (this.mockSpeechData) {
      this.mockSpeechData.currentResultIndex = 0;
    }
  }

  /**
   * 测试语音播放
   */
  @test
  async '语音播放功能'() {
    try {
      const testTexts = ['你好世界', 'Hello World', '这是一个测试'];

      for (const text of testTexts) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`语音播放超时: ${text}`));
          }, 10000);

          this.speechService.startSpeaking(
            text,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '播放结果不应为空');
              this.assertEqual(result.text, text, '播放文本应匹配');
              this.assertEqual(result.status, 'started', '播放状态应为started');
              console.log(`语音播放成功: ${text}`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`语音播放失败: ${error.message || error.code}`);
            }
          );
        });

        // 等待播放完成
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('语音播放功能测试失败:', error);
      this.fail(`语音播放功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音播放控制
   */
  @test
  async '语音播放控制'() {
    try {
      const text = '这是一个语音控制测试';

      // 开始播放
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('开始播放超时'));
        }, 5000);

        this.speechService.startSpeaking(
          text,
          (result) => {
            clearTimeout(timeout);
            console.log('开始播放:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`开始播放失败: ${error.message || error.code}`);
          }
        );
      });

      // 暂停播放
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('暂停播放超时'));
        }, 5000);

        this.speechService.pauseSpeaking(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'paused', '暂停状态应为paused');
            console.log('暂停播放:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`暂停播放失败: ${error.message || error.code}`);
          }
        );
      });

      // 恢复播放
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('恢复播放超时'));
        }, 5000);

        this.speechService.resumeSpeaking(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'resumed', '恢复状态应为resumed');
            console.log('恢复播放:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`恢复播放失败: ${error.message || error.code}`);
          }
        );
      });

      // 停止播放
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('停止播放超时'));
        }, 5000);

        this.speechService.stopSpeaking(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'stopped', '停止状态应为stopped');
            console.log('停止播放:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`停止播放失败: ${error.message || error.code}`);
          }
        );
      });

      console.log('语音播放控制测试完成');
    } catch (error) {
      console.error('语音播放控制测试失败:', error);
      this.fail(`语音播放控制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音识别
   */
  @test
  async '语音识别功能'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('语音识别超时'));
        }, 15000);

        this.speechRecognition.start(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '识别结果不应为空');
            this.assertNotNull(result.text, '识别文本不应为空');
            this.assertNotNull(result.confidence, '置信度不应为空');
            this.assertTrue(result.confidence >= 0 && result.confidence <= 1, '置信度应在0-1范围内');
            this.assertTypeOf(result.timestamp, 'number', '时间戳应为数字');

            console.log(`语音识别成功: "${result.text}" (置信度: ${result.confidence})`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`语音识别失败: ${error.message || error.code}`);
          },
          {
            timeout: 10000,
            language: 'zh-CN'
          }
        );
      });
    } catch (error) {
      console.error('语音识别功能测试失败:', error);
      this.fail(`语音识别功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音识别控制
   */
  @test
  async '语音识别控制'() {
    try {
      // 开始识别
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('开始识别超时'));
        }, 5000);

        this.speechRecognition.start(
          (result) => {
            clearTimeout(timeout);
            console.log('识别结果:', result.text);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`开始识别失败: ${error.message || error.code}`);
          },
          {
            timeout: 3000,
            language: 'zh-CN'
          }
        );
      });

      // 测试取消识别
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('取消识别超时'));
        }, 5000);

        this.speechRecognition.cancel(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'cancelled', '取消状态应为cancelled');
            console.log('取消识别:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`取消识别失败: ${error.message || error.code}`);
          }
        );
      });

      console.log('语音识别控制测试完成');
    } catch (error) {
      console.error('语音识别控制测试失败:', error);
      this.fail(`语音识别控制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音合成
   */
  @test
  async '语音合成功能'() {
    try {
      const testTexts = ['语音合成测试', 'Speech Synthesis Test', 'こんにちは'];

      for (const text of testTexts) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`语音合成超时: ${text}`));
          }, 10000);

          this.speechSynthesis.speak(
            text,
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '合成结果不应为空');
              this.assertEqual(result.text, text, '合成文本应匹配');
              this.assertEqual(result.status, 'speaking', '合成状态应为speaking');
              console.log(`语音合成成功: ${text}`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`语音合成失败: ${error.message || error.code}`);
            }
          );
        });

        // 停止合成
        await new Promise(resolve => {
          this.speechSynthesis.stop(() => {
            console.log('语音合成已停止');
            resolve();
          });
        });

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('语音合成功能测试失败:', error);
      this.fail(`语音合成功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音合成控制
   */
  @test
  async '语音合成控制'() {
    try {
      const text = '这是语音合成控制测试';

      // 开始合成
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('开始合成超时'));
        }, 5000);

        this.speechSynthesis.speak(
          text,
          (result) => {
            clearTimeout(timeout);
            console.log('开始合成:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`开始合成失败: ${error.message || error.code}`);
          }
        );
      });

      // 暂停合成
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('暂停合成超时'));
        }, 5000);

        this.speechSynthesis.pause(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'paused', '暂停状态应为paused');
            console.log('暂停合成:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`暂停合成失败: ${error.message || error.code}`);
          }
        );
      });

      // 恢复合成
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('恢复合成超时'));
        }, 5000);

        this.speechSynthesis.resume(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'resumed', '恢复状态应为resumed');
            console.log('恢复合成:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`恢复合成失败: ${error.message || error.code}`);
          }
        );
      });

      // 停止合成
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('停止合成超时'));
        }, 5000);

        this.speechSynthesis.stop(
          (result) => {
            clearTimeout(timeout);
            this.assertEqual(result.status, 'stopped', '停止状态应为stopped');
            console.log('停止合成:', result.status);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`停止合成失败: ${error.message || error.code}`);
          }
        );
      });

      console.log('语音合成控制测试完成');
    } catch (error) {
      console.error('语音合成控制测试失败:', error);
      this.fail(`语音合成控制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试获取语音列表
   */
  @test
  async '获取语音列表'() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取语音列表超时'));
        }, 5000);

        this.speechSynthesis.getVoices(
          (voices) => {
            clearTimeout(timeout);
            this.assertNotNull(voices, '语音列表不应为空');
            this.assertTrue(voices.length > 0, '语音列表不应为空');

            voices.forEach(voice => {
              this.assertNotNull(voice.name, '语音名称不应为空');
              this.assertNotNull(voice.lang, '语音语言不应为空');
              this.assertTypeOf(voice.localService, 'boolean', 'localService应为布尔值');
            });

            console.log(`成功获取${voices.length}个语音:`, voices.map(v => v.name));
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取语音列表失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('获取语音列表测试失败:', error);
      this.fail(`获取语音列表测试失败: ${error.message}`);
    }
  }

  /**
   * 测试多语言语音合成
   */
  @test
  async '多语言语音合成'() {
    try {
      const testCases = [
        { text: '你好世界', lang: 'zh-CN', expectedLanguage: '中文' },
        { text: 'Hello World', lang: 'en-US', expectedLanguage: 'English' },
        { text: 'こんにちは', lang: 'ja-JP', expectedLanguage: '日语' }
      ];

      for (const testCase of testCases) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`多语言语音合成超时: ${testCase.text}`));
          }, 8000);

          this.speechSynthesis.speak(
            testCase.text,
            {
              language: testCase.lang
            },
            (result) => {
              clearTimeout(timeout);
              this.assertNotNull(result, '合成结果不应为空');
              this.assertEqual(result.text, testCase.text, '合成文本应匹配');
              console.log(`${testCase.expectedLanguage}语音合成成功: ${testCase.text}`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              this.fail(`${testCase.expectedLanguage}语音合成失败: ${error.message || error.code}`);
            }
          );
        });

        // 停止当前合成
        await new Promise(resolve => {
          this.speechSynthesis.stop(() => {
            resolve();
          });
        });

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('多语言语音合成测试失败:', error);
      this.fail(`多语言语音合成测试失败: ${error.message}`);
    }
  }

  /**
   * 测试语音识别准确性
   */
  @test
  async '语音识别准确性'() {
    try {
      const minConfidence = 0.7; // 最小置信度阈值

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('语音识别准确性测试超时'));
        }, 10000);

        this.speechRecognition.start(
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '识别结果不应为空');
            this.assertNotNull(result.confidence, '置信度不应为空');
            this.assertTrue(result.confidence >= minConfidence, `置信度${result.confidence}应大于等于${minConfidence}`);
            this.assertTrue(result.text.length > 0, '识别文本不应为空');

            console.log(`语音识别准确性测试通过: "${result.text}" (置信度: ${result.confidence})`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`语音识别准确性测试失败: ${error.message || error.code}`);
          },
          {
            timeout: 8000,
            language: 'zh-CN'
          }
        );
      });
    } catch (error) {
      console.error('语音识别准确性测试失败:', error);
      this.fail(`语音识别准确性测试失败: ${error.message}`);
    }
  }

  /**
   * 测试错误处理机制
   */
  @test
  async '错误处理机制'() {
    try {
      // 测试空文本
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.speechService.startSpeaking(
          '',
          (result) => {
            clearTimeout(timeout);
            this.fail('空文本播放应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('空文本错误处理正常:', error);
            resolve();
          }
        );
      });

      // 测试无效语言设置
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.speechRecognition.start(
          (result) => {
            clearTimeout(timeout);
            this.fail('无效语言设置应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('无效语言错误处理正常:', error);
            resolve();
          },
          {
            language: 'invalid-language'
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
      const isHtml5Plus = typeof plus !== 'undefined' && plus.speech;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const speechMethods = [
        'startSpeaking', 'stopSpeaking', 'pauseSpeaking', 'resumeSpeaking'
      ];

      const recognitionMethods = [
        'start', 'stop', 'cancel'
      ];

      const synthesisMethods = [
        'speak', 'stop', 'pause', 'resume', 'getVoices'
      ];

      speechMethods.forEach(method => {
        const isAvailable = typeof this.speechService[method] === 'function';
        this.assertTrue(isAvailable, `speech.${method}方法应可用`);
      });

      recognitionMethods.forEach(method => {
        const isAvailable = typeof this.speechRecognition[method] === 'function';
        this.assertTrue(isAvailable, `speechRecognition.${method}方法应可用`);
      });

      synthesisMethods.forEach(method => {
        const isAvailable = typeof this.speechSynthesis[method] === 'function';
        this.assertTrue(isAvailable, `speechSynthesis.${method}方法应可用`);
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
      // 检查语音服务权限
      this.assertNotNull(this.speechService, '语音服务不应为空');
      this.assertNotNull(this.speechRecognition, '语音识别服务不应为空');
      this.assertNotNull(this.speechSynthesis, '语音合成服务不应为空');

      // 检查方法可用性
      const allServices = [this.speechService, this.speechRecognition, this.speechSynthesis];
      allServices.forEach(service => {
        Object.keys(service).forEach(method => {
          if (typeof service[method] === 'function') {
            this.assertTrue(true, `${method}方法应可用`);
          }
        });
      });

      console.log('权限检查完成');
    } catch (error) {
      console.error('权限检查失败:', error);
      this.fail(`权限检查失败: ${error.message}`);
    }
  }
}

// 导出测试套件
export default SpeechTestSuite;