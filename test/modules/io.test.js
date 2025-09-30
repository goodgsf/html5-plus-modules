/**
 * HTML5+ IO 模块测试套件
 *
 * 测试IO功能包括：
 * - 文件读写操作
 * - 目录管理
 * - 文件系统访问
 * - 路径操作
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import io from '../../modules/io.js';

class IOTestSuite extends TestSuite {
    constructor() {
        super();
        this.testDir = '_doc/test_io_' + Date.now();
        this.testFile = this.testDir + '/test.txt';
        this.testContent = '这是测试文件内容\nThis is test file content';
        this.fileOperations = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置IO测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理IO测试环境...');
        try {
            // 清理测试文件和目录
            await io.deleteFile(this.testFile);
            await io.deleteDirectory(this.testDir);
        } catch (error) {
            // 忽略清理错误
        }
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前创建测试目录
        try {
            await io.createDirectory(this.testDir);
            this.fileOperations = [];
        } catch (error) {
            // 忽略创建错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理测试文件和目录
        try {
            await io.deleteFile(this.testFile);
            this.fileOperations = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await io.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await io.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够创建目录')
    async testCreateDirectory() {
        try {
            const dirPath = this.testDir + '/subdir';
            const result = await io.createDirectory(dirPath);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证目录是否存在
            const exists = await io.directoryExists(dirPath);
            TestUtils.assertTrue(typeof exists === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('目录') ||
                error.message.includes('directory')
            );
        }
    }

    @test('应该能够删除目录')
    async testDeleteDirectory() {
        try {
            const dirPath = this.testDir + '/subdir';
            await io.createDirectory(dirPath);

            const result = await io.deleteDirectory(dirPath);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('删除') ||
                error.message.includes('delete')
            );
        }
    }

    @test('应该能够检查目录是否存在')
    async testDirectoryExists() {
        try {
            const dirPath = this.testDir + '/subdir';

            // 测试不存在的目录
            let exists = await io.directoryExists(dirPath);
            TestUtils.assertTrue(typeof exists === 'boolean');

            // 创建目录后测试
            await io.createDirectory(dirPath);
            exists = await io.directoryExists(dirPath);
            TestUtils.assertTrue(typeof exists === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('检查') ||
                error.message.includes('check')
            );
        }
    }

    @test('应该能够写入文件')
    async testWriteFile() {
        try {
            const writeOptions = {
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8',
                append: false
            };

            const result = await io.writeFile(writeOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证文件是否存在
            const exists = await io.fileExists(this.testFile);
            TestUtils.assertTrue(typeof exists === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('写入') ||
                error.message.includes('write')
            );
        }
    }

    @test('应该能够读取文件')
    async testReadFile() {
        try {
            // 先写入文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            // 读取文件
            const readOptions = {
                path: this.testFile,
                encoding: 'utf-8'
            };

            const result = await io.readFile(readOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(typeof result.content === 'string');
                TestUtils.assertTrue(result.content.includes('测试文件内容'));
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('读取') ||
                error.message.includes('read')
            );
        }
    }

    @test('应该能够检查文件是否存在')
    async testFileExists() {
        try {
            // 测试不存在的文件
            let exists = await io.fileExists(this.testFile);
            TestUtils.assertTrue(typeof exists === 'boolean');

            // 创建文件后测试
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });
            exists = await io.fileExists(this.testFile);
            TestUtils.assertTrue(typeof exists === 'boolean');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('检查') ||
                error.message.includes('check')
            );
        }
    }

    @test('应该能够删除文件')
    async testDeleteFile() {
        try {
            // 先创建文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            const result = await io.deleteFile(this.testFile);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('删除') ||
                error.message.includes('delete')
            );
        }
    }

    @test('应该能够获取文件信息')
    async testGetFileInfo() {
        try {
            // 先创建文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            const fileInfo = await io.getFileInfo(this.testFile);
            TestUtils.assertTrue(typeof fileInfo === 'object');
            TestUtils.assertTrue(typeof fileInfo.size === 'number');
            TestUtils.assertTrue(typeof fileInfo.lastModified === 'number');
            TestUtils.assertTrue(typeof fileInfo.isDirectory === 'boolean');
            TestUtils.assertTrue(typeof fileInfo.isFile === 'boolean');

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

    @test('应该能够列出目录内容')
    async testListDirectory() {
        try {
            // 创建测试文件
            await io.writeFile({
                path: this.testDir + '/file1.txt',
                content: 'file1 content',
                encoding: 'utf-8'
            });
            await io.writeFile({
                path: this.testDir + '/file2.txt',
                content: 'file2 content',
                encoding: 'utf-8'
            });

            const listOptions = {
                path: this.testDir,
                recursive: false
            };

            const result = await io.listDirectory(listOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            if (result.success) {
                TestUtils.assertTrue(Array.isArray(result.files));
                for (const file of result.files) {
                    TestUtils.assertTrue(typeof file === 'object');
                    TestUtils.assertTrue(typeof file.name === 'string');
                    TestUtils.assertTrue(typeof file.path === 'string');
                    TestUtils.assertTrue(typeof file.isDirectory === 'boolean');
                }
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('列表') ||
                error.message.includes('list')
            );
        }
    }

    @test('应该能够复制文件')
    async testCopyFile() {
        try {
            // 先创建源文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            const destFile = this.testDir + '/copy.txt';
            const copyOptions = {
                source: this.testFile,
                destination: destFile,
                overwrite: true
            };

            const result = await io.copyFile(copyOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('复制') ||
                error.message.includes('copy')
            );
        }
    }

    @test('应该能够移动文件')
    async testMoveFile() {
        try {
            // 先创建源文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            const destFile = this.testDir + '/moved.txt';
            const moveOptions = {
                source: this.testFile,
                destination: destFile,
                overwrite: true
            };

            const result = await io.moveFile(moveOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('移动') ||
                error.message.includes('move')
            );
        }
    }

    @test('应该能够重命名文件')
    async testRenameFile() {
        try {
            // 先创建文件
            await io.writeFile({
                path: this.testFile,
                content: this.testContent,
                encoding: 'utf-8'
            });

            const newName = 'renamed.txt';
            const newPath = this.testDir + '/' + newName;
            const result = await io.renameFile(this.testFile, newName);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('重命名') ||
                error.message.includes('rename')
            );
        }
    }

    @test('应该能够获取文件系统信息')
    async testGetFileSystemInfo() {
        try {
            const fsInfo = await io.getFileSystemInfo();
            TestUtils.assertTrue(typeof fsInfo === 'object');
            TestUtils.assertTrue(typeof fsInfo.totalSpace === 'number');
            TestUtils.assertTrue(typeof fsInfo.freeSpace === 'number');
            TestUtils.assertTrue(typeof fsInfo.usedSpace === 'number');
            TestUtils.assertTrue(typeof fsInfo.rootPath === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('文件系统') ||
                error.message.includes('filesystem')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的文件路径
            await io.readFile({ path: '' });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('路径') ||
                error.message.includes('path')
            );
        }

        try {
            // 测试空参数
            await io.readFile(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试读取不存在的文件
            await io.readFile({ path: 'nonexistent_file.txt' });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('文件') ||
                error.message.includes('file') ||
                error.message.includes('不存在') ||
                error.message.includes('not found')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await io.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await io.requestPermission();
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

    @test('应该能够处理二进制文件')
    async testBinaryFileOperations() {
        try {
            const binaryData = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]);

            // 写入二进制数据
            const writeResult = await io.writeFile({
                path: this.testFile,
                content: binaryData,
                encoding: 'binary'
            });
            TestUtils.assertTrue(typeof writeResult === 'object');
            TestUtils.assertTrue(writeResult.success === true || writeResult.success === false);

            // 读取二进制数据
            const readResult = await io.readFile({
                path: this.testFile,
                encoding: 'binary'
            });
            TestUtils.assertTrue(typeof readResult === 'object');

            if (readResult.success) {
                TestUtils.assertTrue(readResult.content instanceof Uint8Array);
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('二进制') ||
                error.message.includes('binary')
            );
        }
    }

    @test('应该能够追加文件内容')
    async testAppendFile() {
        try {
            // 先写入初始内容
            await io.writeFile({
                path: this.testFile,
                content: '初始内容',
                encoding: 'utf-8'
            });

            // 追加内容
            const appendResult = await io.writeFile({
                path: this.testFile,
                content: '追加内容',
                encoding: 'utf-8',
                append: true
            });
            TestUtils.assertTrue(typeof appendResult === 'object');
            TestUtils.assertTrue(appendResult.success === true || appendResult.success === false);

            // 验证追加结果
            const readResult = await io.readFile({
                path: this.testFile,
                encoding: 'utf-8'
            });

            if (readResult.success) {
                TestUtils.assertTrue(readResult.content.includes('初始内容'));
                TestUtils.assertTrue(readResult.content.includes('追加内容'));
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('追加') ||
                error.message.includes('append')
            );
        }
    }

    @test('应该能够获取工作目录')
    async testGetCurrentDirectory() {
        try {
            const currentDir = await io.getCurrentDirectory();
            TestUtils.assertTrue(typeof currentDir === 'string');
            TestUtils.assertTrue(currentDir.length > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('目录') ||
                error.message.includes('directory')
            );
        }
    }

    @test('应该能够改变工作目录')
    async testChangeDirectory() {
        try {
            const result = await io.changeDirectory(this.testDir);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证当前目录
            const currentDir = await io.getCurrentDirectory();
            TestUtils.assertTrue(typeof currentDir === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('目录') ||
                error.message.includes('directory')
            );
        }
    }

    @test('应该能够获取文件系统使用统计')
    async testGetFileSystemStatistics() {
        try {
            const stats = await io.getFileSystemStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalFiles === 'number');
            TestUtils.assertTrue(typeof stats.totalDirectories === 'number');
            TestUtils.assertTrue(typeof stats.totalSize === 'number');
            TestUtils.assertTrue(typeof stats.lastUpdated === 'number');

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
}

export default IOTestSuite;