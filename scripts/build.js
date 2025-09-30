#!/usr/bin/env node

/**
 * HTML5+ 模块构建脚本
 *
 * 构建选项：
 * --prod        # 生产构建
 * --dev         # 开发构建
 * --analyze     # 分析构建
 * --minify      # 压缩代码
 * --clean       # 清理构建目录
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// 构建配置
const buildConfig = {
    prod: false,
    dev: false,
    analyze: false,
    minify: false,
    clean: false,
    outputDir: 'dist',
    sourceDir: 'modules',
    testDir: 'test'
};

// 解析命令行参数
const args = process.argv.slice(2);
for (const arg of args) {
    if (arg === '--prod') buildConfig.prod = true;
    if (arg === '--dev') buildConfig.dev = true;
    if (arg === '--analyze') buildConfig.analyze = true;
    if (arg === '--minify') buildConfig.minify = true;
    if (arg === '--clean') buildConfig.clean = true;
}

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 清理构建目录
function cleanBuild() {
    const buildDir = join(rootDir, buildConfig.outputDir);
    if (existsSync(buildDir)) {
        rmSync(buildDir, { recursive: true, force: true });
        log('🧹 构建目录已清理', 'green');
    }
}

// 创建构建目录
function createBuildDirectories() {
    const dirs = [
        join(rootDir, buildConfig.outputDir),
        join(rootDir, buildConfig.outputDir, 'modules')
    ];

    for (const dir of dirs) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    }
}

// 复制文件
function copyFile(src, dest) {
    if (existsSync(src)) {
        copyFileSync(src, dest);
        log(`📄 复制: ${src} -> ${dest}`, 'cyan');
    }
}

// 处理JS文件
async function processJsFile(src, dest) {
    let content = readFileSync(src, 'utf8');

    // 生产环境处理
    if (buildConfig.prod) {
        // 移除调试代码
        content = content.replace(/console\.(log|debug|info|warn|error)\s*\([^)]*\);?/g, '');

        // 移除注释
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        content = content.replace(/\/\/.*$/gm, '');

        // 压缩代码
        if (buildConfig.minify) {
            try {
                const result = await minify(content, {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    },
                    mangle: false,
                    format: {
                        comments: false
                    }
                });

                if (result.code) {
                    content = result.code;
                }
            } catch (error) {
                // 压缩失败时继续使用原始内容
            }
        }
    }

    writeFileSync(dest, content);
    log(`📦 构建: ${src} -> ${dest}`, 'green');
}

// 构建主入口文件
async function buildMainEntry() {
    const src = join(rootDir, 'index.js');
    const dest = join(rootDir, buildConfig.outputDir, 'index.js');
    await processJsFile(src, dest);
}

// 构建模块文件
async function buildModules() {
    const modulesDir = join(rootDir, buildConfig.sourceDir);
    const destDir = join(rootDir, buildConfig.outputDir, 'modules');

    // 读取所有模块文件
    const moduleFiles = readFileSync(join(rootDir, 'index.js'), 'utf8')
        .match(/import .*? from '\.\/modules\/(.*?)\.js'/g)
        ?.map(match => match.match(/\.\/modules\/(.*?)\.js'/)?.[1])
        ?.filter(Boolean) || [];

    for (const module of moduleFiles) {
        const src = join(modulesDir, `${module}.js`);
        const dest = join(destDir, `${module}.js`);

        if (existsSync(src)) {
            await processJsFile(src, dest);
        }
    }
}

// 构建测试文件 - 已移除
function buildTests() {
    // 不再复制测试文件到输出目录
}

// 复制静态文件
function copyStaticFiles() {
    const staticFiles = [
        'package.json',
        'README.md',
        'LICENSE'
    ];

    for (const file of staticFiles) {
        const src = join(rootDir, file);
        const dest = join(rootDir, buildConfig.outputDir, file);
        copyFile(src, dest);
    }
}

// 生成构建信息
function generateBuildInfo() {
    // 读取package.json版本
    const packageJsonPath = join(rootDir, 'package.json');
    let version = '1.0.0';
    if (existsSync(packageJsonPath)) {
        const packageContent = readFileSync(packageJsonPath, 'utf8');
        const packageData = JSON.parse(packageContent);
        version = packageData.version || '1.0.0';
    }

    const buildInfo = {
        version: version,
        buildTime: new Date().toISOString(),
        config: buildConfig,
        modules: []
    };

    // 统计模块信息
    const modulesDir = join(rootDir, buildConfig.sourceDir);
    if (existsSync(modulesDir)) {
        const moduleFiles = readFileSync(join(rootDir, 'index.js'), 'utf8')
            .match(/import .*? from '\.\/modules\/(.*?)\.js'/g)
            ?.map(match => match.match(/\.\/modules\/(.*?)\.js'/)?.[1])
            ?.filter(Boolean) || [];

        buildInfo.modules = moduleFiles.map(module => {
            const modulePath = join(modulesDir, `${module}.js`);
            let stats = null;
            if (existsSync(modulePath)) {
                // 使用statSync而不是require('fs').statSync
                try {
                    stats = { size: readFileSync(modulePath, 'utf8').length };
                } catch (error) {
                    stats = { size: 0 };
                }
            }
            return {
                name: module,
                size: stats?.size || 0,
                built: existsSync(join(rootDir, buildConfig.outputDir, 'modules', `${module}.js`))
            };
        });
    }

    const buildInfoPath = join(rootDir, buildConfig.outputDir, 'build-info.json');
    writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    log(`📊 生成构建信息: ${buildInfoPath}`, 'green');
}

// 运行测试
function runTests() {
    try {
        log('🧪 运行测试...', 'cyan');
        execSync('node test/test-runner.js --all', {
            cwd: rootDir,
            stdio: 'inherit'
        });
        log('✅ 测试通过', 'green');
    } catch (error) {
        log('❌ 测试失败', 'red');
        process.exit(1);
    }
}

// 分析构建
function analyzeBuild() {
    const buildDir = join(rootDir, buildConfig.outputDir);
    const buildInfo = JSON.parse(readFileSync(join(buildDir, 'build-info.json'), 'utf8'));

    log('📊 构建分析报告', 'magenta');
    log('==================', 'magenta');
    log(`构建版本: ${buildInfo.version}`, 'cyan');
    log(`构建时间: ${buildInfo.buildTime}`, 'cyan');
    log(`构建模式: ${buildConfig.prod ? '生产' : '开发'}`, 'cyan');
    log(`模块数量: ${buildInfo.modules.length}`, 'cyan');
    log(`总大小: ${buildInfo.modules.reduce((sum, m) => sum + m.size, 0)} bytes`, 'cyan');

    log('\n📦 模块详情:', 'cyan');
    buildInfo.modules.forEach(module => {
        const status = module.built ? '✅' : '❌';
        log(`  ${status} ${module.name}: ${module.size} bytes`, 'cyan');
    });
}

// 主构建函数
async function build() {
    log('🚀 开始构建 HTML5+ 模块...', 'magenta');
    log('========================', 'magenta');

    const startTime = Date.now();

    try {
        // 清理构建目录
        if (buildConfig.clean) {
            cleanBuild();
        }

        // 创建构建目录
        createBuildDirectories();

        // 构建各个部分
        await buildMainEntry();
        await buildModules();
        copyStaticFiles();

        // 运行测试
        if (buildConfig.prod) {
            runTests();
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        log('\n🎉 构建完成!', 'green');
        log(`⏱️  用时: ${duration}ms`, 'green');
        log(`📁 输出目录: ${join(rootDir, buildConfig.outputDir)}`, 'green');

    } catch (error) {
        log(`❌ 构建失败: ${error.message}`, 'red');
        if (error.stack) {
            log(error.stack, 'red');
        }
        process.exit(1);
    }
}

// 显示帮助
function showHelp() {
    log('HTML5+ 模块构建脚本', 'cyan');
    log('==================', 'cyan');
    log('用法: node scripts/build.js [选项]', 'cyan');
    log('');
    log('选项:', 'cyan');
    log('  --prod     生产构建（移除调试代码，可选压缩）', 'cyan');
    log('  --dev      开发构建', 'cyan');
    log('  --analyze  分析构建结果', 'cyan');
    log('  --minify   压缩代码', 'cyan');
    log('  --clean    清理构建目录', 'cyan');
    log('  --help     显示帮助', 'cyan');
    log('');
    log('示例:', 'cyan');
    log('  node scripts/build.js --prod --minify', 'cyan');
    log('  node scripts/build.js --dev --analyze', 'cyan');
}

// 主函数
if (args.includes('--help')) {
    showHelp();
} else {
    build();
}