#!/usr/bin/env node

/**
 * HTML5+ 模块 API 文档生成脚本
 *
 * 自动从模块文件中的 JSDoc 注释生成 API 文档
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

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

// 模块信息映射
const moduleInfo = {
    accelerometer: { name: 'Accelerometer', description: '加速度传感器管理' },
    ad: { name: 'Ad', description: '广告功能管理' },
    audio: { name: 'Audio', description: '音频播放和录制管理' },
    barcode: { name: 'Barcode', description: '条码/二维码扫描' },
    bluetooth: { name: 'Bluetooth', description: '蓝牙通信管理' },
    camera: { name: 'Camera', description: '相机功能管理' },
    contacts: { name: 'Contacts', description: '联系人管理' },
    device: { name: 'Device', description: '设备信息管理' },
    downloader: { name: 'Downloader', description: '文件下载管理' },
    events: { name: 'Events', description: '事件系统管理' },
    fingerprint: { name: 'Fingerprint', description: '指纹识别管理' },
    gallery: { name: 'Gallery', description: '图库管理' },
    geolocation: { name: 'Geolocation', description: '地理位置定位' },
    ibeacon: { name: 'IBeacon', description: 'iBeacon设备管理' },
    io: { name: 'IO', description: '文件系统操作' },
    key: { name: 'Key', description: '按键事件管理' },
    maps: { name: 'Maps', description: '地图服务管理' },
    messaging: { name: 'Messaging', description: '短信功能管理' },
    nativeObj: { name: 'NativeObj', description: '原生对象管理' },
    nativeUI: { name: 'NativeUI', description: '原生UI组件管理' },
    navigator: { name: 'Navigator', description: '页面导航管理' },
    net: { name: 'Net', description: '网络请求管理' },
    oauth: { name: 'OAuth', description: 'OAuth认证管理' },
    orientation: { name: 'Orientation', description: '方向传感器管理' },
    payment: { name: 'Payment', description: '支付功能管理' },
    proximity: { name: 'Proximity', description: '接近传感器管理' },
    push: { name: 'Push', description: '推送通知管理' },
    runtime: { name: 'Runtime', description: '运行时环境管理' },
    share: { name: 'Share', description: '社交分享管理' },
    speech: { name: 'Speech', description: '语音识别与合成' },
    sqlite: { name: 'SQLite', description: 'SQLite数据库管理' },
    statistic: { name: 'Statistic', description: '统计分析管理' },
    storage: { name: 'Storage', description: '本地存储管理' },
    uploader: { name: 'Uploader', description: '文件上传管理' },
    video: { name: 'Video', description: '视频播放和录制管理' },
    webView: { name: 'WebView', description: 'WebView窗口管理' },
    zip: { name: 'Zip', description: '压缩解压缩管理' }
};

// 解析 JSDoc 注释
function parseJSDoc(content) {
    const jsdocRegex = /\/\*\*[\s\S]*?\*\//g;
    const matches = content.match(jsdocRegex) || [];

    const docs = [];
    for (const match of matches) {
        const doc = {
            description: '',
            params: [],
            returns: null,
            examples: [],
            type: 'function'
        };

        // 解析描述
        const descMatch = match.match(/\/\*\*\s*\n\s*\*\s*([^\n@]+)/);
        if (descMatch) {
            doc.description = descMatch[1].trim();
        }

        // 解析参数
        const paramRegex = /@param\s*\{([^}]+)\}\s*([^\s]+)\s*([^\n@]*)/g;
        let paramMatch;
        while ((paramMatch = paramRegex.exec(match)) !== null) {
            doc.params.push({
                type: paramMatch[1],
                name: paramMatch[2],
                description: paramMatch[3].trim()
            });
        }

        // 解析返回值
        const returnMatch = match.match(/@returns\s*\{([^}]+)\}\s*([^\n@]*)/);
        if (returnMatch) {
            doc.returns = {
                type: returnMatch[1],
                description: returnMatch[2].trim()
            };
        }

        // 解析示例
        const exampleRegex = /@example\s*\n\s*\*\s*([\s\S]*?)(?=\n\s*\*[\s@]|$)/g;
        let exampleMatch;
        while ((exampleMatch = exampleRegex.exec(match)) !== null) {
            doc.examples.push(exampleMatch[1].trim());
        }

        // 解析类型
        if (match.includes('@typedef')) {
            doc.type = 'typedef';
            const typeMatch = match.match(/@typedef\s*\{([^}]+)\}\s*([^\s]+)/);
            if (typeMatch) {
                doc.name = typeMatch[2];
                doc.typeDef = typeMatch[1];
            }
        } else if (match.includes('@class')) {
            doc.type = 'class';
            const classMatch = match.match(/@class\s+([^\s\n]+)/);
            if (classMatch) {
                doc.name = classMatch[1];
            }
        } else if (match.includes('@constant')) {
            doc.type = 'constant';
            const constMatch = match.match(/@constant\s*\{([^}]+)\}\s*([^\s]+)/);
            if (constMatch) {
                doc.name = constMatch[2];
                doc.constType = constMatch[1];
            }
        }

        docs.push(doc);
    }

    return docs;
}

// 生成单个模块的 API 文档
function generateModuleDocs(moduleName, modulePath) {
    const content = readFileSync(modulePath, 'utf8');
    const docs = parseJSDoc(content);
    const info = moduleInfo[moduleName];

    let markdown = `# ${info.name} API\n\n`;
    markdown += `> ${info.description}\n\n`;

    // 添加模块概览
    markdown += `## 模块概览\n\n`;
    markdown += `${info.name} 模块提供了完整的 ${info.description} 功能，支持 HTML5+ 和浏览器双环境。\n\n`;

    // 添加快速开始
    markdown += `## 快速开始\n\n`;
    markdown += `\`\`\`javascript\nimport ${moduleName} from '../modules/${moduleName}.js';\n\n`;
    markdown += `// 检查模块支持性\nconst supported = await ${moduleName}.isSupported();\nif (!supported) {\n  console.log('设备不支持此功能');\n  return;\n}\n\n`;
    markdown += `// 检查权限\nconst permission = await ${moduleName}.checkPermission();\nif (permission !== 'granted') {\n  const result = await ${moduleName}.requestPermission();\n  if (result !== 'granted') {\n    console.log('权限被拒绝');\n    return;\n  }\n}\n\`\`\`\n\n`;

    // 添加错误码说明
    const errorCodeRegex = new RegExp(`${moduleName.toUpperCase()}_ErrorCode`, 'g');
    if (errorCodeRegex.test(content)) {
        markdown += `## 错误码\n\n`;
        markdown += `| 错误码 | 说明 |\n`;
        markdown += `|--------|------|\n`;

        const errorMatch = content.match(/export const (\w+ErrorCode = \{[\s\S]*?\});/);
        if (errorMatch) {
            const errorBlock = errorMatch[1];
            const errorItems = errorBlock.match(/(\w+):\s*(\d+),?\s*\/\/\s*([^\n]+)/g);
            if (errorItems) {
                for (const item of errorItems) {
                    const [, code, , desc] = item.match(/(\w+):\s*(\d+),?\s*\/\/\s*([^\n]+)/) || [];
                    if (code && desc) {
                        markdown += `| ${code} | ${desc.trim()} |\n`;
                    }
                }
            }
        }
        markdown += `\n`;
    }

    // 添加类型定义
    const typeDefs = docs.filter(doc => doc.type === 'typedef');
    if (typeDefs.length > 0) {
        markdown += `## 类型定义\n\n`;
        for (const typeDef of typeDefs) {
            markdown += `### ${typeDef.name}\n\n`;
            markdown += `**类型**: \`${typeDef.typeDef}\`\n\n`;
            markdown += `${typeDef.description}\n\n`;
        }
    }

    // 添加常量
    const constants = docs.filter(doc => doc.type === 'constant');
    if (constants.length > 0) {
        markdown += `## 常量\n\n`;
        for (const constant of constants) {
            markdown += `### ${constant.name}\n\n`;
            markdown += `**类型**: \`${constant.constType}\`\n\n`;
            markdown += `${constant.description}\n\n`;
        }
    }

    // 添加类说明
    const classes = docs.filter(doc => doc.type === 'class');
    if (classes.length > 0) {
        markdown += `## 类\n\n`;
        for (const cls of classes) {
            markdown += `### ${cls.name}\n\n`;
            markdown += `${cls.description}\n\n`;
        }
    }

    // 添加方法说明
    const functions = docs.filter(doc => doc.type === 'function');
    if (functions.length > 0) {
        markdown += `## 方法\n\n`;
        for (const func of functions) {
            // 生成方法签名
            let signature = `### ${func.description.split('\n')[0].replace(/^[^a-zA-Z]/, '')}\n\n`;

            // 从实际代码中提取方法名
            const methodMatch = content.match(new RegExp(`(?:async\\s+)?(\\w+)\\s*\\([^)]*\\)\\s*\\{[^}]*${func.description.split('\n')[0].replace(/^[^a-zA-Z]/, '')}`));
            if (methodMatch) {
                signature = `### ${methodMatch[1]}()\n\n`;
            }

            markdown += signature;
            markdown += `${func.description}\n\n`;

            // 添加参数
            if (func.params.length > 0) {
                markdown += `**参数**:\n\n`;
                markdown += `| 参数 | 类型 | 描述 |\n`;
                markdown += `|------|------|------|\n`;
                for (const param of func.params) {
                    markdown += `| ${param.name} | \`${param.type}\` | ${param.description} |\n`;
                }
                markdown += `\n`;
            }

            // 添加返回值
            if (func.returns) {
                markdown += `**返回值**: \`${func.returns.type}\` - ${func.returns.description}\n\n`;
            }

            // 添加示例
            if (func.examples.length > 0) {
                markdown += `**示例**:\n\n`;
                for (const example of func.examples) {
                    markdown += `\`\`\`javascript\n${example}\n\`\`\`\n\n`;
                }
            }
        }
    }

    // 添加使用示例
    markdown += `## 使用示例\n\n`;
    markdown += `### 基本用法\n\n`;
    markdown += `\`\`\`javascript\nimport ${moduleName} from '../modules/${moduleName}.js';\n\n`;
    markdown += `try {\n  // 基本操作\n  const result = await ${moduleName}.someMethod();\n  console.log('操作结果:', result);\n} catch (error) {\n  console.error('操作失败:', error);\n}\n\`\`\`\n\n`;

    // 添加错误处理示例
    markdown += `### 错误处理\n\n`;
    markdown += `\`\`\`javascript\nasync function safe${info.name}Operation() {\n  try {\n    // 检查支持性\n    const supported = await ${moduleName}.isSupported();\n    if (!supported) {\n      throw new Error('设备不支持此功能');\n    }\n\n    // 检查权限\n    const permission = await ${moduleName}.checkPermission();\n    if (permission !== 'granted') {\n      const result = await ${moduleName}.requestPermission();\n      if (result !== 'granted') {\n        throw new Error('权限被拒绝');\n      }\n    }\n\n    // 执行操作\n    const result = await ${moduleName}.someMethod();\n    return result;\n\n  } catch (error) {\n    console.error('${info.name} 操作失败:', error);\n    // 根据错误类型进行相应处理\n    return null;\n  }\n}\n\`\`\`\n\n`;

    // 添加最佳实践
    markdown += `## 最佳实践\n\n`;
    markdown += `1. **权限检查**: 在使用任何功能前，先检查设备支持性和权限状态\n`;
    markdown += `2. **错误处理**: 使用 try-catch 处理所有异步操作\n`;
    markdown += `3. **资源清理**: 确保及时释放占用的资源\n`;
    markdown += `4. **性能优化**: 避免频繁调用，合理使用缓存\n\n`;

    // 添加注意事项
    markdown += `## 注意事项\n\n`;
    markdown += `- 确保在 HTML5+ 环境或兼容的浏览器环境中使用\n`;
    markdown += `- 部分功能可能需要用户授权\n`;
    markdown += `- 在浏览器环境中，某些功能可能被降级或不可用\n`;
    markdown += `- 请参考具体方法的详细文档了解限制条件\n\n`;

    return markdown;
}

// 生成 API 索引
function generateAPIIndex() {
    const categories = {
        '核心模块': ['device', 'runtime', 'storage', 'events'],
        '网络通信': ['net', 'downloader', 'uploader'],
        '多媒体': ['camera', 'audio', 'video', 'gallery'],
        '传感器': ['accelerometer', 'orientation', 'proximity', 'geolocation'],
        '用户界面': ['nativeUI', 'nativeObj', 'webView'],
        '数据处理': ['sqlite', 'io', 'zip'],
        '应用功能': ['contacts', 'messaging', 'share', 'payment', 'push'],
        '系统功能': ['bluetooth', 'fingerprint', 'barcode', 'ibeacon', 'key', 'speech'],
        '开发工具': ['navigator', 'oauth', 'statistic', 'maps', 'ad']
    };

    let markdown = `# HTML5+ API 参考索引\n\n`;
    markdown += `以下是所有可用的 HTML5+ 模块 API 文档：\n\n`;

    for (const [category, modules] of Object.entries(categories)) {
        markdown += `## ${category}\n\n`;
        for (const module of modules) {
            const info = moduleInfo[module];
            if (info) {
                markdown += `- [${info.name}](./${module}.md) - ${info.description}\n`;
            }
        }
        markdown += `\n`;
    }

    return markdown;
}

// 主函数
async function generateDocs() {
    log('📚 开始生成 API 文档...', 'magenta');
    log('========================', 'magenta');

    const startTime = Date.now();

    try {
        // 确保 docs/api 目录存在
        const apiDir = join(rootDir, 'docs', 'api');
        if (!existsSync(apiDir)) {
            mkdirSync(apiDir, { recursive: true });
        }

        // 生成各个模块的文档
        for (const [moduleName, info] of Object.entries(moduleInfo)) {
            const modulePath = join(rootDir, 'modules', `${moduleName}.js`);
            if (existsSync(modulePath)) {
                log(`📄 生成 ${info.name} 文档...`, 'cyan');
                const docs = generateModuleDocs(moduleName, modulePath);
                const docPath = join(apiDir, `${moduleName}.md`);
                writeFileSync(docPath, docs, 'utf8');
            } else {
                log(`⚠️  模块文件不存在: ${modulePath}`, 'yellow');
            }
        }

        // 生成 API 索引
        log(`📋 生成 API 索引...`, 'cyan');
        const indexContent = generateAPIIndex();
        writeFileSync(join(apiDir, 'README.md'), indexContent, 'utf8');

        const endTime = Date.now();
        const duration = endTime - startTime;

        log('\n🎉 API 文档生成完成!', 'green');
        log(`⏱️  用时: ${duration}ms`, 'green');
        log(`📁 文档位置: ${join(rootDir, 'docs', 'api')}`, 'green');
        log(`📊 生成了 ${Object.keys(moduleInfo).length} 个模块的文档`, 'green');

    } catch (error) {
        log(`❌ 文档生成失败: ${error.message}`, 'red');
        if (error.stack) {
            log(error.stack, 'red');
        }
        process.exit(1);
    }
}

// 显示帮助
function showHelp() {
    log('HTML5+ API 文档生成脚本', 'cyan');
    log('========================', 'cyan');
    log('用法: node scripts/generate-docs.js', 'cyan');
    log('');
    log('此脚本会自动从模块文件中的 JSDoc 注释生成 API 文档', 'cyan');
    log('');
    log('生成的文档位于 docs/api/ 目录', 'cyan');
}

// 主函数
if (process.argv.includes('--help')) {
    showHelp();
} else {
    generateDocs();
}