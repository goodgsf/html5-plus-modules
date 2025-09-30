#!/usr/bin/env node

/**
 * HTML5+ 模块测试运行器
 *
 * 使用方法:
 * node test-runner.js [module-name]
 * node test-runner.js --all        # 运行所有测试
 * node test-runner.js --report json # 以JSON格式输出报告
 */

import { runTestSuite } from './test-config.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 测试模块映射
const testModules = {
    'accelerometer': './modules/accelerometer.test.js',
    'ad': './modules/ad.test.js',
    'audio': './modules/audio.test.js',
    'barcode': './modules/barcode.test.js',
    'bluetooth': './modules/bluetooth.test.js',
    'camera': './modules/camera.test.js',
    'contacts': './modules/contacts.test.js',
    'device': './modules/device.test.js',
    'downloader': './modules/downloader.test.js',
    'events': './modules/events.test.js',
    'fingerprint': './modules/fingerprint.test.js',
    'gallery': './modules/gallery.test.js',
    'geolocation': './modules/geolocation.test.js',
    'ibeacon': './modules/ibeacon.test.js',
    'io': './modules/io.test.js',
    'key': './modules/key.test.js',
    'maps': './modules/maps.test.js',
    'messaging': './modules/messaging.test.js',
    'nativeObj': './modules/nativeObj.test.js',
    'nativeUI': './modules/nativeUI.test.js',
    'navigator': './modules/navigator.test.js',
    'net': './modules/net.test.js',
    'oauth': './modules/oauth.test.js',
    'orientation': './modules/orientation.test.js',
    'payment': './modules/payment.test.js',
    'proximity': './modules/proximity.test.js',
    'push': './modules/push.test.js',
    'runtime': './modules/runtime.test.js',
    'share': './modules/share.test.js',
    'speech': './modules/speech.test.js',
    'sqlite': './modules/sqlite.test.js',
    'statistic': './modules/statistic.test.js',
    'storage': './modules/storage.test.js',
    'uploader': './modules/uploader.test.js',
    'video': './modules/video.test.js',
    'webview': './modules/webview.test.js',
    'zip': './modules/zip.test.js'
};

// 命令行参数解析
const args = process.argv.slice(2);
let targetModule = null;
let runAll = false;
let reportFormat = 'console';

for (const arg of args) {
    if (arg === '--all') {
        runAll = true;
    } else if (arg.startsWith('--report=')) {
        reportFormat = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        targetModule = arg;
    }
}

// 主函数
async function main() {
    console.log('🚀 HTML5+ 模块测试运行器');
    console.log('========================\n');

    const allResults = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        suites: []
    };

    try {
        if (runAll) {
            // 运行所有测试
            console.log('📋 运行所有模块测试...\n');

            for (const [moduleName, testPath] of Object.entries(testModules)) {
                try {
                    console.log(`🔍 正在测试 ${moduleName} 模块...`);

                    // 动态导入测试模块
                    const testModule = await import(join(__dirname, testPath));
                    const TestSuiteClass = testModule.default || testModule.TestSuite;

                    if (TestSuiteClass) {
                        const testSuite = new TestSuiteClass();
                        const results = await runTestSuite(testSuite);

                        allResults.total += results.total;
                        allResults.passed += results.passed;
                        allResults.failed += results.failed;
                        allResults.skipped += results.skipped;
                        allResults.suites.push({
                            name: moduleName,
                            ...results
                        });
                    } else {
                        console.log(`⚠️  ${moduleName} 模块没有找到测试套件`);
                    }
                } catch (error) {
                    console.error(`❌ ${moduleName} 模块测试失败:`, error.message);
                }
            }
        } else if (targetModule) {
            // 运行指定模块测试
            if (testModules[targetModule]) {
                console.log(`🔍 正在测试 ${targetModule} 模块...\n`);

                const testPath = testModules[targetModule];
                const testModule = await import(join(__dirname, testPath));
                const TestSuiteClass = testModule.default || testModule.TestSuite;

                if (TestSuiteClass) {
                    const testSuite = new TestSuiteClass();
                    const results = await runTestSuite(testSuite);

                    allResults.total += results.total;
                    allResults.passed += results.passed;
                    allResults.failed += results.failed;
                    allResults.skipped += results.skipped;
                    allResults.suites.push({
                        name: targetModule,
                        ...results
                    });
                } else {
                    console.log(`⚠️  ${targetModule} 模块没有找到测试套件`);
                }
            } else {
                console.error(`❌ 未找到模块: ${targetModule}`);
                console.log('可用模块:', Object.keys(testModules).join(', '));
                process.exit(1);
            }
        } else {
            // 显示帮助信息
            console.log('用法:');
            console.log('  node test-runner.js [module-name]  # 运行指定模块测试');
            console.log('  node test-runner.js --all           # 运行所有模块测试');
            console.log('  node test-runner.js --report=json   # JSON格式报告');
            console.log('\n可用模块:');
            Object.keys(testModules).forEach(module => {
                console.log(`  - ${module}`);
            });
            return;
        }

        // 输出总报告
        if (runAll || allResults.suites.length > 1) {
            console.log('\n🎯 总体测试结果');
            console.log('================');
            console.log(`总计: ${allResults.total} 个测试`);
            console.log(`通过: ${allResults.passed} 个`);
            console.log(`失败: ${allResults.failed} 个`);
            console.log(`跳过: ${allResults.skipped} 个`);

            if (allResults.failed > 0) {
                console.log(`\n❌ 失败的模块:`);
                allResults.suites
                    .filter(suite => suite.failed > 0)
                    .forEach(suite => {
                        console.log(`  - ${suite.name}: ${suite.failed} 个失败`);
                    });
            }

            if (reportFormat === 'json') {
                console.log('\n📊 JSON报告:');
                console.log(JSON.stringify(allResults, null, 2));
            }
        }

        // 退出码
        if (allResults.failed > 0) {
            process.exit(1);
        } else {
            console.log('\n✅ 所有测试通过!');
            process.exit(0);
        }

    } catch (error) {
        console.error('💥 测试运行器出错:', error);
        process.exit(1);
    }
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}