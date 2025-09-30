import { TestSuite } from '../test-config.js';

/**
 * ZIP压缩解压测试套件
 * @class ZipTestSuite
 * @extends TestSuite
 */
class ZipTestSuite extends TestSuite {
  /**
   * ZIP压缩解压测试套件
   * 测试文件压缩、解压、压缩包管理等功能
   */
  constructor() {
    super('Zip');
    this.zipService = null;
    this.testFiles = [];
    this.testZipPath = null;
    this.mockZipData = null;
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
        this.zipService = plus.zip;
        if (!this.zipService) {
          throw new Error('ZIP服务不可用');
        }
      }

      // 创建测试文件数据
      this.createTestFiles();
      this.testZipPath = '_doc/test_archive.zip';

      console.log('ZIP压缩解压测试环境初始化完成');
    } catch (error) {
      console.error('ZIP压缩解压测试环境初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置模拟环境
   */
  setupMockEnvironment() {
    this.mockZipData = {
      archives: {},
      currentOperation: null
    };

    this.zipService = {
      compress: (files, zipPath, options, success, error) => {
        setTimeout(() => {
          try {
            if (typeof options === 'function') {
              error = success;
              success = options;
              options = {};
            }

            const archive = {
              path: zipPath,
              files: files.map(file => ({
                path: file,
                size: Math.floor(Math.random() * 10000) + 1000,
                compressedSize: Math.floor(Math.random() * 5000) + 500,
                compressionRatio: 0.3 + Math.random() * 0.4
              })),
              createdAt: Date.now(),
              size: 0,
              compressionLevel: options.compressionLevel || 6
            };

            archive.size = archive.files.reduce((total, file) => total + file.compressedSize, 0);

            this.mockZipData.archives[zipPath] = archive;
            this.mockZipData.currentOperation = 'compress';

            success({
              path: zipPath,
              size: archive.size,
              fileCount: archive.files.length,
              compressionRatio: 1 - (archive.size / archive.files.reduce((total, file) => total + file.size, 0))
            });
          } catch (err) {
            error({ code: 'COMPRESS_ERROR', message: err.message });
          }
        }, 100);
      },

      decompress: (zipPath, targetPath, options, success, error) => {
        setTimeout(() => {
          try {
            if (typeof options === 'function') {
              error = success;
              success = options;
              options = {};
            }

            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            const extractedFiles = archive.files.map(file => ({
              originalPath: file.path,
              extractedPath: targetPath + '/' + file.path.split('/').pop(),
              size: file.size,
              extractedAt: Date.now()
            }));

            this.mockZipData.currentOperation = 'decompress';

            success({
              sourcePath: zipPath,
              targetPath: targetPath,
              extractedFiles: extractedFiles,
              fileCount: extractedFiles.length,
              totalSize: extractedFiles.reduce((total, file) => total + file.size, 0)
            });
          } catch (err) {
            error({ code: 'DECOMPRESS_ERROR', message: err.message });
          }
        }, 150);
      },

      listFiles: (zipPath, success, error) => {
        setTimeout(() => {
          try {
            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            const fileList = archive.files.map((file, index) => ({
              index: index,
              name: file.path.split('/').pop(),
              path: file.path,
              size: file.size,
              compressedSize: file.compressedSize,
              compressionRatio: 1 - (file.compressedSize / file.size),
              date: new Date(archive.createdAt).toISOString(),
              isDirectory: file.path.endsWith('/')
            }));

            success({
              path: zipPath,
              fileCount: fileList.length,
              totalSize: archive.files.reduce((total, file) => total + file.size, 0),
              compressedSize: archive.size,
              files: fileList
            });
          } catch (err) {
            error({ code: 'LIST_ERROR', message: err.message });
          }
        }, 50);
      },

      extractFile: (zipPath, filePath, targetPath, success, error) => {
        setTimeout(() => {
          try {
            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            const file = archive.files.find(f => f.path === filePath);
            if (!file) {
              error({ code: 'FILE_NOT_FOUND', message: '文件在压缩包中不存在' });
              return;
            }

            success({
              sourcePath: filePath,
              targetPath: targetPath,
              size: file.size,
              extractedAt: Date.now()
            });
          } catch (err) {
            error({ code: 'EXTRACT_ERROR', message: err.message });
          }
        }, 80);
      },

      deleteFile: (zipPath, filePath, success, error) => {
        setTimeout(() => {
          try {
            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            const fileIndex = archive.files.findIndex(f => f.path === filePath);
            if (fileIndex === -1) {
              error({ code: 'FILE_NOT_FOUND', message: '文件在压缩包中不存在' });
              return;
            }

            const deletedFile = archive.files.splice(fileIndex, 1)[0];
            archive.size = archive.files.reduce((total, file) => total + file.compressedSize, 0);

            success({
              deletedFile: filePath,
              remainingFiles: archive.files.length,
              archiveSize: archive.size
            });
          } catch (err) {
            error({ code: 'DELETE_ERROR', message: err.message });
          }
        }, 60);
      },

      addFile: (zipPath, filePath, success, error) => {
        setTimeout(() => {
          try {
            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            const newFile = {
              path: filePath,
              size: Math.floor(Math.random() * 10000) + 1000,
              compressedSize: Math.floor(Math.random() * 5000) + 500,
              compressionRatio: 0.3 + Math.random() * 0.4
            };

            archive.files.push(newFile);
            archive.size = archive.files.reduce((total, file) => total + file.compressedSize, 0);

            success({
              addedFile: filePath,
              totalFiles: archive.files.length,
              archiveSize: archive.size
            });
          } catch (err) {
            error({ code: 'ADD_ERROR', message: err.message });
          }
        }, 70);
      },

      getArchiveInfo: (zipPath, success, error) => {
        setTimeout(() => {
          try {
            const archive = this.mockZipData.archives[zipPath];
            if (!archive) {
              error({ code: 'ARCHIVE_NOT_FOUND', message: '压缩包不存在' });
              return;
            }

            success({
              path: zipPath,
              fileCount: archive.files.length,
              totalSize: archive.files.reduce((total, file) => total + file.size, 0),
              compressedSize: archive.size,
              compressionRatio: 1 - (archive.size / archive.files.reduce((total, file) => total + file.size, 0)),
              createdAt: archive.createdAt,
              compressionLevel: archive.compressionLevel
            });
          } catch (err) {
            error({ code: 'INFO_ERROR', message: err.message });
          }
        }, 40);
      }
    };

    // 绑定mockZipData
    this.zipService.mockZipData = this.mockZipData;
  }

  /**
   * 创建测试文件数据
   */
  createTestFiles() {
    this.testFiles = [
      {
        path: '_doc/test1.txt',
        content: '这是第一个测试文件的内容',
        size: 1024
      },
      {
        path: '_doc/test2.json',
        content: JSON.stringify({ name: '测试数据', value: 123, array: [1, 2, 3] }),
        size: 512
      },
      {
        path: '_doc/subdir/test3.txt',
        content: '这是子目录中的测试文件',
        size: 768
      },
      {
        path: '_doc/image.jpg',
        content: '模拟的图片数据',
        size: 2048
      }
    ];
  }

  /**
   * 测试后清理
   */
  @afterAll
  async cleanup() {
    try {
      // 清理模拟数据
      if (this.mockZipData) {
        this.mockZipData.archives = {};
        this.mockZipData.currentOperation = null;
      }

      this.testFiles = [];
      this.testZipPath = null;

      console.log('ZIP压缩解压测试环境清理完成');
    } catch (error) {
      console.error('ZIP压缩解压测试环境清理失败:', error);
    }
  }

  /**
   * 每个测试前的准备工作
   */
  @beforeEach
  async setupTest() {
    // 清理模拟数据
    if (this.mockZipData) {
      this.mockZipData.archives = {};
      this.mockZipData.currentOperation = null;
    }
  }

  /**
   * 测试文件压缩
   */
  @test
  async '文件压缩功能'() {
    try {
      const testZipPath = '_doc/test_compress.zip';
      const filesToCompress = this.testFiles.map(f => f.path);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('文件压缩超时'));
        }, 10000);

        this.zipService.compress(
          filesToCompress,
          testZipPath,
          {
            compressionLevel: 6,
            password: null,
            includeHidden: true
          },
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '压缩结果不应为空');
            this.assertEqual(result.path, testZipPath, '压缩包路径应匹配');
            this.assertTypeOf(result.size, 'number', '压缩包大小应为数字');
            this.assertTypeOf(result.fileCount, 'number', '文件数量应为数字');
            this.assertTrue(result.fileCount > 0, '文件数量应大于0');
            this.assertTrue(result.compressionRatio >= 0 && result.compressionRatio <= 1, '压缩率应在0-1范围内');

            console.log(`文件压缩成功: ${result.path}`);
            console.log(`压缩后大小: ${result.size} bytes`);
            console.log(`文件数量: ${result.fileCount}`);
            console.log(`压缩率: ${(result.compressionRatio * 100).toFixed(1)}%`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`文件压缩失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('文件压缩功能测试失败:', error);
      this.fail(`文件压缩功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试文件解压
   */
  @test
  async '文件解压功能'() {
    try {
      const testZipPath = '_doc/test_decompress.zip';
      const targetPath = '_doc/extracted';

      // 先创建一个压缩包
      await new Promise((resolve, reject) => {
        this.zipService.compress(
          this.testFiles.map(f => f.path),
          testZipPath,
          (result) => resolve(),
          (error) => reject(error)
        );
      });

      // 测试解压
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('文件解压超时'));
        }, 10000);

        this.zipService.decompress(
          testZipPath,
          targetPath,
          {
            overwrite: true,
            createDirectories: true
          },
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '解压结果不应为空');
            this.assertEqual(result.sourcePath, testZipPath, '源路径应匹配');
            this.assertEqual(result.targetPath, targetPath, '目标路径应匹配');
            this.assertNotNull(result.extractedFiles, '解压文件列表不应为空');
            this.assertTypeOf(result.fileCount, 'number', '文件数量应为数字');
            this.assertTrue(result.fileCount > 0, '文件数量应大于0');
            this.assertTypeOf(result.totalSize, 'number', '总大小应为数字');

            console.log(`文件解压成功: ${result.targetPath}`);
            console.log(`解压文件数量: ${result.fileCount}`);
            console.log(`解压总大小: ${result.totalSize} bytes`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`文件解压失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('文件解压功能测试失败:', error);
      this.fail(`文件解压功能测试失败: ${error.message}`);
    }
  }

  /**
   * 测试压缩包文件列表
   */
  @test
  async '压缩包文件列表'() {
    try {
      const testZipPath = '_doc/test_list.zip';

      // 创建压缩包
      await new Promise((resolve, reject) => {
        this.zipService.compress(
          this.testFiles.map(f => f.path),
          testZipPath,
          (result) => resolve(),
          (error) => reject(error)
        );
      });

      // 获取文件列表
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取文件列表超时'));
        }, 5000);

        this.zipService.listFiles(
          testZipPath,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '文件列表结果不应为空');
            this.assertEqual(result.path, testZipPath, '压缩包路径应匹配');
            this.assertNotNull(result.files, '文件列表不应为空');
            this.assertTypeOf(result.fileCount, 'number', '文件数量应为数字');
            this.assertTypeOf(result.totalSize, 'number', '总大小应为数字');
            this.assertTypeOf(result.compressedSize, 'number', '压缩后大小应为数字');

            // 验证文件信息
            result.files.forEach((file, index) => {
              this.assertNotNull(file.name, '文件名不应为空');
              this.assertNotNull(file.path, '文件路径不应为空');
              this.assertTypeOf(file.size, 'number', '文件大小应为数字');
              this.assertTypeOf(file.compressedSize, 'number', '压缩后大小应为数字');
              this.assertTypeOf(file.compressionRatio, 'number', '压缩率应为数字');
              this.assertTrue(file.compressionRatio >= 0 && file.compressionRatio <= 1, '压缩率应在0-1范围内');
            });

            console.log(`获取文件列表成功: ${result.fileCount}个文件`);
            console.log(`总大小: ${result.totalSize} bytes`);
            console.log(`压缩后大小: ${result.compressedSize} bytes`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取文件列表失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('压缩包文件列表测试失败:', error);
      this.fail(`压缩包文件列表测试失败: ${error.message}`);
    }
  }

  /**
   * 测试单个文件解压
   */
  @test
  async '单个文件解压'() {
    try {
      const testZipPath = '_doc/test_extract_single.zip';
      const targetPath = '_doc/extracted_single.txt';

      // 创建压缩包
      await new Promise((resolve, reject) => {
        this.zipService.compress(
          this.testFiles.map(f => f.path),
          testZipPath,
          (result) => resolve(),
          (error) => reject(error)
        );
      });

      // 解压单个文件
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('单个文件解压超时'));
        }, 5000);

        this.zipService.extractFile(
          testZipPath,
          this.testFiles[0].path, // 解压第一个文件
          targetPath,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '解压结果不应为空');
            this.assertEqual(result.sourcePath, this.testFiles[0].path, '源文件路径应匹配');
            this.assertEqual(result.targetPath, targetPath, '目标路径应匹配');
            this.assertTypeOf(result.size, 'number', '文件大小应为数字');
            this.assertTrue(result.size > 0, '文件大小应大于0');
            this.assertTypeOf(result.extractedAt, 'number', '解压时间应为数字');

            console.log(`单个文件解压成功: ${result.sourcePath} -> ${result.targetPath}`);
            console.log(`文件大小: ${result.size} bytes`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`单个文件解压失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('单个文件解压测试失败:', error);
      this.fail(`单个文件解压测试失败: ${error.message}`);
    }
  }

  /**
   * 测试压缩包文件管理
   */
  @test
  async '压缩包文件管理'() {
    try {
      const testZipPath = '_doc/test_manage.zip';
      const newFilePath = '_doc/new_file.txt';

      // 创建压缩包
      await new Promise((resolve, reject) => {
        this.zipService.compress(
          [this.testFiles[0].path], // 只压缩一个文件
          testZipPath,
          (result) => resolve(),
          (error) => reject(error)
        );
      });

      // 添加文件
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('添加文件超时'));
        }, 5000);

        this.zipService.addFile(
          testZipPath,
          newFilePath,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '添加文件结果不应为空');
            this.assertEqual(result.addedFile, newFilePath, '添加的文件路径应匹配');
            this.assertTrue(result.totalFiles > 0, '文件数量应大于0');
            this.assertTrue(result.archiveSize > 0, '压缩包大小应大于0');

            console.log(`添加文件成功: ${result.addedFile}`);
            console.log(`总文件数: ${result.totalFiles}`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`添加文件失败: ${error.message || error.code}`);
          }
        );
      });

      // 删除文件
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('删除文件超时'));
        }, 5000);

        this.zipService.deleteFile(
          testZipPath,
          this.testFiles[0].path,
          (result) => {
            clearTimeout(timeout);
            this.assertNotNull(result, '删除文件结果不应为空');
            this.assertEqual(result.deletedFile, this.testFiles[0].path, '删除的文件路径应匹配');
            this.assertTypeOf(result.remainingFiles, 'number', '剩余文件数量应为数字');
            this.assertTypeOf(result.archiveSize, 'number', '压缩包大小应为数字');

            console.log(`删除文件成功: ${result.deletedFile}`);
            console.log(`剩余文件数: ${result.remainingFiles}`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`删除文件失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('压缩包文件管理测试失败:', error);
      this.fail(`压缩包文件管理测试失败: ${error.message}`);
    }
  }

  /**
   * 测试压缩包信息获取
   */
  @test
  async '压缩包信息获取'() {
    try {
      const testZipPath = '_doc/test_info.zip';

      // 创建压缩包
      await new Promise((resolve, reject) => {
        this.zipService.compress(
          this.testFiles.map(f => f.path),
          testZipPath,
          { compressionLevel: 8 },
          (result) => resolve(),
          (error) => reject(error)
        );
      });

      // 获取压缩包信息
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('获取压缩包信息超时'));
        }, 5000);

        this.zipService.getArchiveInfo(
          testZipPath,
          (info) => {
            clearTimeout(timeout);
            this.assertNotNull(info, '压缩包信息不应为空');
            this.assertEqual(info.path, testZipPath, '压缩包路径应匹配');
            this.assertTypeOf(info.fileCount, 'number', '文件数量应为数字');
            this.assertTypeOf(info.totalSize, 'number', '总大小应为数字');
            this.assertTypeOf(info.compressedSize, 'number', '压缩后大小应为数字');
            this.assertTypeOf(info.compressionRatio, 'number', '压缩率应为数字');
            this.assertTypeOf(info.createdAt, 'number', '创建时间应为数字');
            this.assertTypeOf(info.compressionLevel, 'number', '压缩级别应为数字');

            this.assertTrue(info.fileCount > 0, '文件数量应大于0');
            this.assertTrue(info.totalSize > 0, '总大小应大于0');
            this.assertTrue(info.compressedSize > 0, '压缩后大小应大于0');
            this.assertTrue(info.compressionRatio >= 0 && info.compressionRatio <= 1, '压缩率应在0-1范围内');
            this.assertTrue(info.compressionLevel >= 1 && info.compressionLevel <= 9, '压缩级别应在1-9范围内');

            console.log(`压缩包信息获取成功:`);
            console.log(`文件数量: ${info.fileCount}`);
            console.log(`总大小: ${info.totalSize} bytes`);
            console.log(`压缩后大小: ${info.compressedSize} bytes`);
            console.log(`压缩率: ${(info.compressionRatio * 100).toFixed(1)}%`);
            console.log(`压缩级别: ${info.compressionLevel}`);
            resolve();
          },
          (error) => {
            clearTimeout(timeout);
            this.fail(`获取压缩包信息失败: ${error.message || error.code}`);
          }
        );
      });
    } catch (error) {
      console.error('压缩包信息获取测试失败:', error);
      this.fail(`压缩包信息获取测试失败: ${error.message}`);
    }
  }

  /**
   * 测试压缩级别
   */
  @test
  async '压缩级别测试'() {
    try {
      const compressionLevels = [1, 6, 9]; // 最低、默认、最高压缩级别
      const results = {};

      for (const level of compressionLevels) {
        const testZipPath = `_doc/test_level_${level}.zip`;

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`压缩级别${level}测试超时`));
          }, 8000);

          this.zipService.compress(
            this.testFiles.map(f => f.path),
            testZipPath,
            { compressionLevel: level },
            (result) => {
              clearTimeout(timeout);
              results[level] = result;
              console.log(`压缩级别${level}完成，压缩率: ${(result.compressionRatio * 100).toFixed(1)}%`);
              resolve();
            },
            (error) => {
              clearTimeout(timeout);
              reject(new Error(`压缩级别${level}失败: ${error.message || error.code}`));
            }
          );
        });
      }

      // 验证不同压缩级别的效果
      this.assertTrue(results[1].compressionRatio <= results[6].compressionRatio, '低压缩级别的压缩率应小于等于默认级别');
      this.assertTrue(results[6].compressionRatio <= results[9].compressionRatio, '默认压缩级别的压缩率应小于等于高压缩级别');

      console.log('压缩级别测试完成，压缩率对比:');
      Object.keys(results).forEach(level => {
        console.log(`级别${level}: ${(results[level].compressionRatio * 100).toFixed(1)}%`);
      });
    } catch (error) {
      console.error('压缩级别测试失败:', error);
      this.fail(`压缩级别测试失败: ${error.message}`);
    }
  }

  /**
   * 测试错误处理机制
   */
  @test
  async '错误处理机制'() {
    try {
      // 测试无效压缩包路径
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.zipService.listFiles(
          'invalid/path/archive.zip',
          (result) => {
            clearTimeout(timeout);
            this.fail('无效路径应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            this.assertNotNull(error.code, '错误码不应为空');
            this.assertNotNull(error.message, '错误消息不应为空');
            console.log('无效路径错误处理正常:', error);
            resolve();
          }
        );
      });

      // 测试空文件列表压缩
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('错误处理测试超时'));
        }, 5000);

        this.zipService.compress(
          [],
          '_doc/empty.zip',
          (result) => {
            clearTimeout(timeout);
            this.fail('空文件列表应该失败');
          },
          (error) => {
            clearTimeout(timeout);
            this.assertNotNull(error, '错误对象不应为空');
            console.log('空文件列表错误处理正常:', error);
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
   * 测试并发操作
   */
  @test
  async '并发操作测试'() {
    try {
      const operations = [];
      const operationCount = 3;

      for (let i = 0; i < operationCount; i++) {
        const operation = new Promise((resolve, reject) => {
          const testZipPath = `_doc/concurrent_${i}.zip`;
          const timeout = setTimeout(() => {
            reject(new Error(`并发操作${i}超时`));
          }, 10000);

          this.zipService.compress(
            [this.testFiles[i % this.testFiles.length].path],
            testZipPath,
            (result) => {
              clearTimeout(timeout);
              console.log(`并发操作${i}完成: ${result.path}`);
              resolve(result);
            },
            (error) => {
              clearTimeout(timeout);
              reject(new Error(`并发操作${i}失败: ${error.message || error.code}`));
            }
          );
        });
        operations.push(operation);
      }

      const results = await Promise.allSettled(operations);

      // 验证并发操作结果
      let successCount = 0;
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          this.assertNotNull(result.value, `操作${index}结果不应为空`);
        }
      });

      this.assertTrue(successCount > 0, '至少应有一个操作成功');
      console.log(`并发操作测试完成，成功: ${successCount}/${operationCount}`);
    } catch (error) {
      console.error('并发操作测试失败:', error);
      this.fail(`并发操作测试失败: ${error.message}`);
    }
  }

  /**
   * 测试浏览器兼容性
   */
  @test
  async '浏览器兼容性'() {
    try {
      // 检查HTML5+环境
      const isHtml5Plus = typeof plus !== 'undefined' && plus.zip;

      if (isHtml5Plus) {
        console.log('运行在HTML5+环境中');
        this.assertTrue(true, 'HTML5+环境可用');
      } else {
        console.log('运行在模拟环境中');
        this.assertTrue(true, '模拟环境可用');
      }

      // 检查必要的API
      const methods = [
        'compress',
        'decompress',
        'listFiles',
        'extractFile',
        'deleteFile',
        'addFile',
        'getArchiveInfo'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.zipService[method] === 'function';
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
      // 检查ZIP服务权限
      this.assertNotNull(this.zipService, 'ZIP服务不应为空');

      // 检查方法可用性
      const methods = [
        'compress', 'decompress', 'listFiles', 'extractFile',
        'deleteFile', 'addFile', 'getArchiveInfo'
      ];

      methods.forEach(method => {
        const isAvailable = typeof this.zipService[method] === 'function';
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
export default ZipTestSuite;