import { TestSuite } from '../test-config.js';

/**
 * 文件上传测试套件
 * @class UploaderTestSuite
 * @extends TestSuite
 */
class UploaderTestSuite extends TestSuite {
  /**
   * 文件上传测试套件
   * 测试文件上传、任务管理、进度监控等功能
   */
  constructor() {
    super('Uploader');
    this.uploaderService = null;
    this.uploadTasks = [];
    this.mockUploadData = null;
    this.testFileContent = null;
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
        this.uploaderService = plus.uploader;
        if (!this.uploaderService) {
          throw new Error('文件上传服务不可用');
        }
      }

      // 创建测试文件内容
      this.testFileContent = this.generateTestFileContent();

      console.log('文件上传测试环境初始化完成');
    } catch (error) {
      console.error('文件上传测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockUploadData = {
      serverResponses: [
        { status: 200, data: { success: true, fileId: 'file_001', url: 'https://example.com/files/file_001' } },
        { status: 200, data: { success: true, fileId: 'file_002', url: 'https://example.com/files/file_002' } },
        { status: 400, data: { success: false, error: 'Invalid file format' } },
        { status: 500, data: { success: false, error: 'Server internal error' } }
      ],
      currentResponseIndex: 0
    };

    this.uploaderService = {
      createUpload: (url, options, success, error) => {
        const taskId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const task = {
          id: taskId,
          url: url,
          state: 'pending',
          options: options || {},
          uploadedSize: 0,
          totalSize: options && options.file ? options.file.size || 1024 * 1024 : 1024 * 1024,
          startTime: null,
          endTime: null,
          progress: 0,
          response: null,

          start: function() {
            this.state = 'uploading';
            this.startTime = Date.now();
            this.simulateUpload();
          },

          pause: function() {
            if (this.state === 'uploading') {
              this.state = 'paused';
              this.clearUploadTimer();
            }
          },

          resume: function() {
            if (this.state === 'paused') {
              this.state = 'uploading';
              this.simulateUpload();
            }
          },

          abort: function() {
            this.state = 'aborted';
            this.clearUploadTimer();
            this.endTime = Date.now();
          },

          simulateUpload: function() {
            this.clearUploadTimer();
            const uploadInterval = setInterval(() => {
              if (this.state === 'uploading') {
                // 模拟上传进度
                const chunkSize = Math.min(1024 * 50, this.totalSize - this.uploadedSize);
                this.uploadedSize += chunkSize;
                this.progress = (this.uploadedSize / this.totalSize) * 100;

                // 触发进度回调
                if (this.options.onProgress) {
                  this.options.onProgress({
                    state: this.state,
                    progress: this.progress,
                    uploaded: this.uploadedSize,
                    total: this.totalSize,
                    taskId: this.id
                  });
                }

                // 检查是否完成
                if (this.uploadedSize >= this.totalSize) {
                  this.completeUpload();
                }
              } else {
                this.clearUploadTimer();
              }
            }, 200);

            this.uploadTimer = uploadInterval;
          },

          completeUpload: function() {
            this.clearUploadTimer();
            this.state = 'completed';
            this.progress = 100;
            this.endTime = Date.now();

            // 获取服务器响应
            const response = this.mockUploadData.serverResponses[this.mockUploadData.currentResponseIndex];
            this.mockUploadData.currentResponseIndex = (this.mockUploadData.currentResponseIndex + 1) % this.mockUploadData.serverResponses.length;

            this.response = {
              status: response.status,
              data: response.data,
              headers: {
                'Content-Type': 'application/json'
              }
            };

            // 触发完成回调
            if (this.options.onComplete) {
              this.options.onComplete(this.response);
            }
          },

          clearUploadTimer: function() {
            if (this.uploadTimer) {
              clearInterval(this.uploadTimer);
              this.uploadTimer = null;
            }
          },

          getUploadTask: function() {
            return {
              id: this.id,
              url: this.url,
              state: this.state,
              progress: this.progress,
              uploaded: this.uploadedSize,
              total: this.totalSize,
              startTime: this.startTime,
              endTime: this.endTime,
              duration: this.endTime ? this.endTime - this.startTime : null,
              response: this.response
            };
          }
        };

        this.uploadTasks.push(task);
        return task;
      },

      enumerate: function(success, error) {
        setTimeout(() => {
          const taskList = this.uploadTasks.map(task => task.getUploadTask());
          success(taskList);
        }, 50);
      },

      clear: function(taskId, success, error) {
        setTimeout(() => {
          const taskIndex = this.uploadTasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            const task = this.uploadTasks[taskIndex];
            task.abort();
            this.uploadTasks.splice(taskIndex, 1);
            success({ cleared: true, taskId: taskId });
          } else {
            error({ code: 'TASK_NOT_FOUND', message: '上传任务不存在' });
          }
        }, 50);
      },

      clearAll: function(success, error) {
        setTimeout(() => {
          this.uploadTasks.forEach(task => task.abort());
          this.uploadTasks = [];
          success({ cleared: true, count: this.uploadTasks.length });
        }, 50);
      },

      startAll: function(success, error) {
        setTimeout(() => {
          let startedCount = 0;
          this.uploadTasks.forEach(task => {
            if (task.state === 'pending' || task.state === 'paused') {
              task.start();
              startedCount++;
            }
          });
          success({ started: true, count: startedCount });
        }, 50);
      }
    };

    // 绑定mockUploadData
    this.uploaderService.mockUploadData = this.mockUploadData;
  }

  /**
   * 生成测试文件内容
   */
  generateTestFileContent() {
    const content = {
      text: '这是一个测试文件内容，用于文件上传测试。',
      size: 1024,
      type: 'text/plain',
      name: 'test_upload.txt',
      data: new Array(1024).fill('a').join('') // 1KB的测试数据
    };
    return content;
  }

  /**
   * 测试后清理
   */
  @afterAll
  async cleanup() {
    try {
      // 清理所有上传任务
      if (this.uploaderService && this.uploaderService.clearAll) {
        this.uploaderService.clearAll(() => {
          console.log('所有上传任务已清理');
        });
      }

      this.uploadTasks = [];
      console.log('文件上传测试环境清理完成');
    } catch (error) {
      console.error('文件上传测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 清理上传任务
    if (this.uploadTasks.length > 0) {
      this.uploadTasks.forEach(task => task.abort());
      this.uploadTasks = [];
    }

    // 重置模拟数据
    if (this.mockUploadData) {
      this.mockUploadData.currentResponseIndex = 0;
    }
  }

  /**
   * 测试创建上传任务
   */
  @test
  async '创建上传任务'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/file.txt',
        name: 'test.txt',
        size: 1024 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('创建上传任务超时'));
        }, 5000);

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 30000,
            retry: 3,
            headers: {
              'Authorization': 'Bearer test_token'
            }
          },
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(task, '上传任务不应为空');
            this.assertNotNull(task.id, '任务ID不应为空');
            this.assertEqual(task.url, testUrl, '上传URL应匹配');
            this.assertEqual(task.state, 'pending', '任务状态应为pending');
            this.assertEqual(task.totalSize, testFile.size, '文件大小应匹配');

            console.log('上传任务创建成功:', task.id);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`创建上传任务失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('创建上传任务测试失败:', error);
      this.fail(`创建上传任务测试失败: ${error.message}`);
    }
  }

  /**
   * 测试文件上传
   */
  @test
  async '文件上传功能'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/upload.txt',
        name: 'upload.txt',
        size: 512 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('文件上传超时'));
        }, 15000);

        let progressEvents = 0;
        let lastProgress = 0;

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 10000,
            onProgress: (progress) => {
              progressEvents++;
              this.assertNotNull(progress, '进度信息不应为空');
              this.assertTypeOf(progress.progress, 'number', '进度值应为数字');
              this.assertTrue(progress.progress >= 0 && progress.progress <= 100, '进度值应在0-100范围内');
              this.assertTrue(progress.progress >= lastProgress, '进度应递增');

              lastProgress = progress.progress;
              console.log(`上传进度: ${progress.progress.toFixed(1)}%`);
            },
            onComplete: (response) => {
              clearTimeout(timeout);
              this.assertNotNull(response, '上传响应不应为空');
              this.assertNotNull(response.status, '响应状态不应为空');
              this.assertNotNull(response.data, '响应数据不应为空');

              console.log(`上传完成，状态: ${response.status}`);
              console.log('上传进度事件次数:', progressEvents);
              this.assertTrue(progressEvents > 0, '应收到进度更新事件');
              resolve();
            }
          },
          (result) => {
            // 任务创建成功，开始上传
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`文件上传失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('文件上传功能测试失败:', error);
      this.fail(`文件上传功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传任务管理
   */
  @test
  async '上传任务管理'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/manage.txt',
        name: 'manage.txt',
        size: 256 * 1024,
        type: 'text/plain'
      };

      // 创建多个上传任务
      const tasks = [];
      for (let i = 0; i < 3; i++) {
        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: {
              ...testFile,
              name: `manage_${i}.txt`
            },
            method: 'POST'
          }
        );
        tasks.push(task);
      }

      // 枚举所有任务
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('枚举任务超时'));
        }, 5000);

        this.uploaderService.enumerate(
          (taskList) => {
            clearTimeout(timeout);
            this.assertNotNull(taskList, '任务列表不应为空');
            this.assertEqual(taskList.length, tasks.length, '任务数量应匹配');

            taskList.forEach(task => {
              this.assertNotNull(task.id, '任务ID不应为空');
              this.assertEqual(task.state, 'pending', '任务状态应为pending');
            });

            console.log(`枚举到${taskList.length}个上传任务`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`枚举任务失败: ${error.message || error.code}`);
          }
        );
      });

      // 开始所有任务
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('开始所有任务超时'));
        }, 5000);

        this.uploaderService.startAll(
          (result) => {
            clearTimeout(timeout);
            this.assertTrue(result.started, '开始任务应成功');
            this.assertEqual(result.count, tasks.length, '开始的任务数量应匹配');

            console.log(`成功开始${result.count}个任务`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`开始所有任务失败: ${error.message || error.code}`);
          }
        );
      });

      // 等待上传完成
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('上传任务管理测试失败:', error);
      this.fail(`上传任务管理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传暂停和恢复
   */
  @test
  async '上传暂停和恢复'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/pause_resume.txt',
        name: 'pause_resume.txt',
        size: 1024 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('上传暂停恢复测试超时'));
        }, 20000);

        let wasPaused = false;
        let wasResumed = false;

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 15000,
            onProgress: (progress) => {
              if (progress.progress >= 30 && !wasPaused) {
                // 暂停上传
                task.pause();
                wasPaused = true;
                console.log('上传已暂停');

                setTimeout(() => {
                  // 恢复上传
                  task.resume();
                  wasResumed = true;
                  console.log('上传已恢复');
                }, 1000);
              }
            },
            onComplete: (response) => {
              clearTimeout(timeout);
              this.assertTrue(wasPaused, '上传应被暂停过');
              this.assertTrue(wasResumed, '上传应被恢复过');
              this.assertEqual(response.status, 200, '上传应成功完成');

              console.log('上传暂停恢复测试完成');
              resolve();
            }
          },
          (result) => {
            // 任务创建成功，开始上传
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`上传暂停恢复测试失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('上传暂停恢复测试失败:', error);
      this.fail(`上传暂停恢复测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传任务取消
   */
  @test
  async '上传任务取消'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/abort.txt',
        name: 'abort.txt',
        size: 2 * 1024 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('上传任务取消测试超时'));
        }, 15000);

        let wasCancelled = false;

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 10000,
            onProgress: (progress) => {
              if (progress.progress >= 20 && !wasCancelled) {
                // 取消上传
                task.abort();
                wasCancelled = true;
                console.log('上传任务已取消');

                // 验证任务状态
                setTimeout(() => {
                  this.assertEqual(task.state, 'aborted', '任务状态应为aborted');
                  this.assertTrue(task.endTime > task.startTime, '结束时间应大于开始时间');

                  console.log('上传任务取消测试完成');
                  clearTimeout(timeout);
                  resolve();
                }, 500);
              }
            },
            onComplete: (response) => {
              clearTimeout(timeout);
              this.fail('上传应该被取消，而不是完成');
            }
          },
          (result) => {
            // 任务创建成功，开始上传
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`上传任务取消测试失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('上传任务取消测试失败:', error);
      this.fail(`上传任务取消测试失败: ${error.message}`);
    }
  }

  /**
   * 测试多文件并发上传
   */
  @test
  async '多文件并发上传'() {
    try {
      const testUrl = 'https://example.com/upload';
      const fileCount = 3;

      const uploadPromises = [];
      for (let i = 0; i < fileCount; i++) {
        const promise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`文件${i}上传超时`));
          }, 15000);

          const task = this.uploaderService.createUpload(
            testUrl,
            {
              file: {
                path: `/test/path/concurrent_${i}.txt`,
                name: `concurrent_${i}.txt`,
                size: 512 * 1024,
                type: 'text/plain'
              },
              method: 'POST',
              timeout: 10000,
              onComplete: (response) => {
                clearTimeout(timeout);
                this.assertEqual(response.status, 200, `文件${i}上传应成功`);
                console.log(`文件${i}上传完成`);
                resolve();
              }
            },
            (result) => {
              task.start();
            },
            (error) => {
              clearTimeout(timeout);
              reject(new Error(`文件${i}上传失败: ${error.message || error.code}`));
            }
          );
        });
        uploadPromises.push(promise);
      }

      await Promise.all(uploadPromises);
      console.log(`所有${fileCount}个文件并发上传完成`);
    } catch (error) {
      console.error('多文件并发上传测试失败:', error);
      this.fail(`多文件并发上传测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传进度监控
   */
  @test
  async '上传进度监控'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/progress.txt',
        name: 'progress.txt',
        size: 1024 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('上传进度监控测试超时'));
        }, 15000);

        const progressEvents = [];
        const minProgressEvents = 5;

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 10000,
            onProgress: (progress) => {
              progressEvents.push(progress);
              this.assertNotNull(progress, '进度信息不应为空');
              this.assertTypeOf(progress.progress, 'number', '进度值应为数字');
              this.assertTypeOf(progress.uploaded, 'number', '已上传字节数应为数字');
              this.assertTypeOf(progress.total, 'number', '总字节数应为数字');
              this.assertEqual(progress.total, testFile.size, '总字节数应匹配');

              console.log(`进度: ${progress.progress.toFixed(1)}% (${progress.uploaded}/${progress.total})`);
            },
            onComplete: (response) => {
              clearTimeout(timeout);
              this.assertTrue(progressEvents.length >= minProgressEvents, `应收到至少${minProgressEvents}次进度更新`);

              // 验证进度递增
              for (let i = 1; i < progressEvents.length; i++) {
                this.assertTrue(
                  progressEvents[i].progress >= progressEvents[i-1].progress - 1,
                  '进度应递增（允许小幅波动）'
                );
              }

              console.log(`上传进度监控测试完成，收到${progressEvents.length}次进度更新`);
              resolve();
            }
          },
          (result) => {
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`上传进度监控测试失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('上传进度监控测试失败:', error);
      this.fail(`上传进度监控测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传错误处理
   */
  @test
  async '上传错误处理'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/error.txt',
        name: 'error.txt',
        size: 512 * 1024,
        type: 'text/plain'
      };

      // 测试无效URL
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 10000);

        const task = this.uploaderService.createUpload(
          'invalid-url',
          {
            file: testFile,
            method: 'POST',
            timeout: 5000,
            onComplete: (response) => {
              clearTimeout(timeout);
              this.fail('无效URL应该上传失败');
            }
          },
          (result) => {
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('无效URL错误处理正常:', error);
            resolve();
          }
        );
      });

      // 测试无效文件
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 10000);

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: null,
            method: 'POST',
            timeout: 5000,
            onComplete: (response) => {
              clearTimeout(timeout);
              this.fail('无效文件应该上传失败');
            }
          },
          (result) => {
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('无效文件错误处理正常:', error);
            resolve();
          }
        );
      });

      console.log('上传错误处理测试完成');
    } catch (error) {
      console.error('上传错误处理测试失败:', error);
      this.fail(`上传错误处理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传任务清理
   */
  @test
  async '上传任务清理'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/cleanup.txt',
        name: 'cleanup.txt',
        size: 256 * 1024,
        type: 'text/plain'
      };

      // 创建多个任务
      const tasks = [];
      for (let i = 0; i < 3; i++) {
        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: {
              ...testFile,
              name: `cleanup_${i}.txt`
            },
            method: 'POST'
          }
        );
        tasks.push(task);
      }

      // 验证任务数量
      this.assertEqual(this.uploadTasks.length, 3, '应有3个上传任务');

      // 清理特定任务
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('清理任务超时'));
        }, 5000);

        this.uploaderService.clear(
          tasks[0].id,
          (result) => {
            clearTimeout(timeout);
            this.assertTrue(result.cleared, '任务清理应成功');
            this.assertEqual(this.uploadTasks.length, 2, '剩余2个任务');
            console.log('单个任务清理成功');
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`清理任务失败: ${error.message || error.code}`);
          }
        );
      });

      // 清理所有任务
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('清理所有任务超时'));
        }, 5000);

        this.uploaderService.clearAll(
          (result) => {
            clearTimeout(timeout);
            this.assertTrue(result.cleared, '清理所有任务应成功');
            this.assertEqual(this.uploadTasks.length, 0, '所有任务应被清理');
            console.log('所有任务清理成功');
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`清理所有任务失败: ${error.message || error.code}`);
          }
        );
      });

      console.log('上传任务清理测试完成');
    } catch (error) {
      console.error('上传任务清理测试失败:', error);
      this.fail(`上传任务清理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试上传超时处理
   */
  @test
  async '上传超时处理'() {
    try {
      const testUrl = 'https://example.com/upload';
      const testFile = {
        path: '/test/path/timeout.txt',
        name: 'timeout.txt',
        size: 1024 * 1024,
        type: 'text/plain'
      };

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('上传超时测试超时'));
        }, 8000);

        const task = this.uploaderService.createUpload(
          testUrl,
          {
            file: testFile,
            method: 'POST',
            timeout: 2000, // 2秒超时
            onComplete: (response) => {
              clearTimeout(timeout);
              this.fail('上传应该超时，而不是完成');
            }
          },
          (result) => {
            task.start();
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '超时错误不应为空');
            console.log('上传超时处理正常:', error);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error('上传超时处理测试失败:', error);
      this.fail(`上传超时处理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试浏览器兼容性
   */
  @test
  async '浏览器兼容性'() {
    try {
      // 检查HTML5+环境
      const isHtml5Plus = typeof plus !== 'undefined' && plus.uploader;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const methods = [
        'createUpload',
        'enumerate',
        'clear',
        'clearAll',
        'startAll'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.uploaderService[method] === 'function';
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
      // 检查上传服务权限
      this.assertNotNull(this.uploaderService, '文件上传服务不应为空');

      // 检查方法可用性
      const methods = [
        'createUpload', 'enumerate', 'clear', 'clearAll', 'startAll'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.uploaderService[method] === 'function';
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
export default UploaderTestSuite;