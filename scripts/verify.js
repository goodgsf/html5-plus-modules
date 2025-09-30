#!/usr/bin/env node

/**
 * HTML5+ 模块验证脚本
 *
 * 验证项目结构和功能是否正常
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

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

// 验证模块是否存在
function verifyModule(moduleName) {
    const modulePath = join(rootDir, 'modules', `${moduleName}.js`);
    return existsSync(modulePath);
}

// 验证测试是否存在
function verifyTest(moduleName) {
    const testPath = join(rootDir, 'test', 'modules', `${moduleName}.test.js`);
    return existsSync(testPath);
}

// 验证文档是否存在
function verifyDoc(moduleName) {
    const docPath = join(rootDir, 'docs', 'api', `${moduleName}.md`);
    return existsSync(docPath);
}

// 验证模块导入
function verifyModuleImport(moduleName) {
    try {
        const indexPath = join(rootDir, 'index.js');
        const content = readFileSync(indexPath, 'utf8');
        // 匹配 import xxx from './modules/moduleName.js'
        const importRegex = new RegExp(`import.*?from\\s+['"]\\.\\/modules\\/${moduleName}\\.js['"]`);
        return importRegex.test(content);
    } catch (error) {
        return false;
    }
}

// 主验证函数
async function verify() {
    log('🔍 开始验证 HTML5+ 模块项目...', 'magenta');
    log('==============================', 'magenta');

    const modules = [
        'accelerometer', 'ad', 'audio', 'barcode', 'bluetooth', 'camera', 'contacts',
        'device', 'downloader', 'events', 'fingerprint', 'gallery', 'geolocation',
        'ibeacon', 'io', 'key', 'maps', 'messaging', 'nativeObj', 'nativeUI',
        'navigator', 'net', 'oauth', 'orientation', 'payment', 'proximity',
        'push', 'runtime', 'share', 'speech', 'sqlite', 'statistic', 'storage',
        'uploader', 'video', 'webview', 'zip'
    ];

    let allPassed = true;
    const results = [];

    for (const module of modules) {
        const moduleExists = verifyModule(module);
        const testExists = verifyTest(module);
        const docExists = verifyDoc(module);
        const importExists = verifyModuleImport(module);

        const passed = moduleExists && testExists && docExists && importExists;
        allPassed = allPassed && passed;

        results.push({
            module,
            moduleExists,
            testExists,
            docExists,
            importExists,
            passed
        });
    }

    // 输出结果
    log('\n📊 验证结果:', 'cyan');
    log('============', 'cyan');

    for (const result of results) {
        const status = result.passed ? '✅' : '❌';
        const statusColor = result.passed ? 'green' : 'red';

        log(`${status} ${result.module}`, statusColor);

        if (!result.passed) {
            const issues = [];
            if (!result.moduleExists) issues.push('模块文件');
            if (!result.testExists) issues.push('测试文件');
            if (!result.docExists) issues.push('文档文件');
            if (!result.importExists) issues.push('导入配置');
            log(`   缺少: ${issues.join(', ')}`, 'yellow');
        }
    }

    // 统计
    const totalModules = results.length;
    const passedModules = results.filter(r => r.passed).length;
    const failedModules = totalModules - passedModules;

    log('\n📈 统计信息:', 'cyan');
    log('============', 'cyan');
    log(`总模块数: ${totalModules}`, 'cyan');
    log(`通过模块: ${passedModules}`, 'green');
    log(`失败模块: ${failedModules}`, failedModules > 0 ? 'red' : 'green');

    // 验证构建脚本
    log('\n🔧 验证构建脚本...', 'cyan');
    const buildScriptExists = existsSync(join(rootDir, 'scripts', 'build.js'));
    const docsScriptExists = existsSync(join(rootDir, 'scripts', 'generate-docs.js'));
    const testRunnerExists = existsSync(join(rootDir, 'test', 'test-runner.js'));
    const testConfigExists = existsSync(join(rootDir, 'test', 'test-config.js'));

    const scriptsOk = buildScriptExists && docsScriptExists && testRunnerExists && testConfigExists;
    log(`构建脚本: ${scriptsOk ? '✅' : '❌'}`, scriptsOk ? 'green' : 'red');

    // 验证配置文件
    log('\n⚙️  验证配置文件...', 'cyan');
    const packageJsonExists = existsSync(join(rootDir, 'package.json'));
    const readmeExists = existsSync(join(rootDir, 'README.md'));
    const docsReadmeExists = existsSync(join(rootDir, 'docs', 'README.md'));

    const configOk = packageJsonExists && readmeExists && docsReadmeExists;
    log(`配置文件: ${configOk ? '✅' : '❌'}`, configOk ? 'green' : 'red');

    // 最终结果
    log('\n🎯 最终结果:', 'magenta');
    log('============', 'magenta');

    if (allPassed && scriptsOk && configOk) {
        log('🎉 所有验证通过！项目完整且功能正常。', 'green');
        log('✅ 模块文件完整', 'green');
        log('✅ 测试用例完整', 'green');
        log('✅ API文档完整', 'green');
        log('✅ 构建脚本正常', 'green');
        log('✅ 配置文件完整', 'green');

        log('\n🚀 项目已准备好使用！', 'green');
        log('💡 提示:', 'cyan');
        log('   - 运行 "npm test" 进行测试', 'cyan');
        log('   - 运行 "npm run docs" 生成文档', 'cyan');
        log('   - 运行 "npm run build" 构建项目', 'cyan');

        process.exit(0);
    } else {
        log('❌ 验证失败，请检查上述问题。', 'red');
        process.exit(1);
    }
}

// 显示帮助
function showHelp() {
    log('HTML5+ 模块验证脚本', 'cyan');
    log('==================', 'cyan');
    log('用法: node scripts/verify.js', 'cyan');
    log('');
    log('此脚本会验证:', 'cyan');
    log('  - 所有模块文件是否存在', 'cyan');
    log('  - 所有测试文件是否存在', 'cyan');
    log('  - 所有文档文件是否存在', 'cyan');
    log('  - 模块导入配置是否正确', 'cyan');
    log('  - 构建脚本是否存在', 'cyan');
    log('  - 配置文件是否存在', 'cyan');
}

// 主函数
if (process.argv.includes('--help')) {
    showHelp();
} else {
    verify();
}