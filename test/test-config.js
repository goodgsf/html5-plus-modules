/**
 * HTML5+ 模块测试套件配置
 *
 * 本文件提供了所有HTML5+模块的测试配置和通用测试工具
 */

// 测试配置
export const TestConfig = {
    // 测试超时时间（毫秒）
    TIMEOUT: 10000,

    // 测试重试次数
    RETRY_COUNT: 3,

    // 是否跳过需要实际设备的测试
    SKIP_DEVICE_TESTS: true,

    // 是否输出详细日志
    VERBOSE: false,

    // 测试环境
    ENVIRONMENT: 'browser', // 'browser' 或 'html5+'

    // 测试报告格式
    REPORT_FORMAT: 'console' // 'console' 或 'json'
};

// 测试结果类型
export const TestResult = {
    PASSED: 'passed',
    FAILED: 'failed',
    SKIPPED: 'skipped',
    PENDING: 'pending'
};

// 测试工具类
export class TestUtils {
    /**
     * 创建测试用例
     */
    static createTest(name, testFn, options = {}) {
        return {
            name,
            testFn,
            options: {
                timeout: TestConfig.TIMEOUT,
                skip: TestConfig.SKIP_DEVICE_TESTS,
                ...options
            },
            result: TestResult.PENDING,
            error: null,
            duration: 0
        };
    }

    /**
     * 运行单个测试
     */
    static async runTest(testCase) {
        const startTime = Date.now();

        try {
            if (testCase.options.skip) {
                testCase.result = TestResult.SKIPPED;
                return testCase;
            }

            if (testCase.options.timeout) {
                await Promise.race([
                    testCase.testFn(),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Test timeout')), testCase.options.timeout)
                    )
                ]);
            } else {
                await testCase.testFn();
            }

            testCase.result = TestResult.PASSED;
        } catch (error) {
            testCase.result = TestResult.FAILED;
            testCase.error = error;

            if (TestConfig.VERBOSE) {
                console.error(`Test failed: ${testCase.name}`, error);
            }
        }

        testCase.duration = Date.now() - startTime;
        return testCase;
    }

    /**
     * 运行测试套件
     */
    static async runTestSuite(testSuite) {
        const results = {
            total: testSuite.length,
            passed: 0,
            failed: 0,
            skipped: 0,
            tests: []
        };

        for (const testCase of testSuite) {
            const result = await this.runTest(testCase);
            results.tests.push(result);

            switch (result.result) {
                case TestResult.PASSED:
                    results.passed++;
                    break;
                case TestResult.FAILED:
                    results.failed++;
                    break;
                case TestResult.SKIPPED:
                    results.skipped++;
                    break;
            }
        }

        return results;
    }

    /**
     * 输出测试报告
     */
    static printReport(results) {
        console.log('\n=== 测试报告 ===');
        console.log(`总计: ${results.total} 个测试`);
        console.log(`通过: ${results.passed} 个`);
        console.log(`失败: ${results.failed} 个`);
        console.log(`跳过: ${results.skipped} 个`);

        if (results.failed > 0) {
            console.log('\n=== 失败的测试 ===');
            results.tests
                .filter(test => test.result === TestResult.FAILED)
                .forEach(test => {
                    console.log(`❌ ${test.name}`);
                    console.log(`   错误: ${test.error.message}`);
                    if (TestConfig.VERBOSE) {
                        console.log(`   堆栈: ${test.error.stack}`);
                    }
                });
        }

        console.log(`\n用时: ${results.tests.reduce((sum, test) => sum + test.duration, 0)}ms`);
        console.log('================');
    }

    /**
     * 断言工具
     */
    static assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
    }

    static assertEquals(actual, expected, message = `Expected ${expected}, got ${actual}`) {
        if (actual !== expected) {
            throw new Error(message);
        }
    }

    static assertTrue(value, message = `Expected true, got ${value}`) {
        if (value !== true) {
            throw new Error(message);
        }
    }

    static assertFalse(value, message = `Expected false, got ${value}`) {
        if (value !== false) {
            throw new Error(message);
        }
    }

    static assertNotNull(value, message = 'Expected value not to be null') {
        if (value === null || value === undefined) {
            throw new Error(message);
        }
    }

    static async assertThrows(fn, expectedError, message = 'Expected function to throw') {
        try {
            await fn();
            throw new Error(message);
        } catch (error) {
            if (expectedError && !(error instanceof expectedError)) {
                throw new Error(`Expected ${expectedError.name}, got ${error.constructor.name}`);
            }
        }
    }

    /**
     * 模拟HTML5+环境
     */
    static mockPlusEnvironment() {
        if (typeof window !== 'undefined') {
            window.plus = {
                runtime: {
                    version: '1.0.0',
                    innerVersion: '1.0.0'
                },
                device: {
                    vendor: 'MockVendor',
                    model: 'MockModel',
                    uuid: 'mock-uuid-12345'
                },
                os: {
                    name: 'MockOS',
                    version: '1.0.0',
                    language: 'zh-CN'
                }
            };
        }
    }

    /**
     * 清理模拟环境
     */
    static cleanupMockEnvironment() {
        if (typeof window !== 'undefined' && window.plus) {
            delete window.plus;
        }
    }

    /**
     * 延迟执行
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 测试装饰器
export function test(name, options = {}) {
    return function(target, propertyKey, descriptor) {
        if (!target._tests) {
            target._tests = [];
        }

        target._tests.push({
            name,
            testFn: descriptor.value,
            options
        });

        return descriptor;
    };
}

export function beforeAll(fn) {
    return function(target, propertyKey, descriptor) {
        target._beforeAll = descriptor.value;
        return descriptor;
    };
}

export function afterAll(fn) {
    return function(target, propertyKey, descriptor) {
        target._afterAll = descriptor.value;
        return descriptor;
    };
}

export function beforeEach(fn) {
    return function(target, propertyKey, descriptor) {
        target._beforeEach = descriptor.value;
        return descriptor;
    };
}

export function afterEach(fn) {
    return function(target, propertyKey, descriptor) {
        target._afterEach = descriptor.value;
        return descriptor;
    };
}

// 测试基类
export class TestSuite {
    constructor() {
        this._tests = this._tests || [];
    }

    async run() {
        // 运行 beforeAll
        if (this._beforeAll) {
            await this._beforeAll();
        }

        const results = [];

        for (const testCase of this._tests) {
            // 运行 beforeEach
            if (this._beforeEach) {
                await this._beforeEach();
            }

            const result = await TestUtils.runTest(testCase);
            results.push(result);

            // 运行 afterEach
            if (this._afterEach) {
                await this._afterEach();
            }
        }

        // 运行 afterAll
        if (this._afterAll) {
            await this._afterAll();
        }

        return {
            total: results.length,
            passed: results.filter(r => r.result === TestResult.PASSED).length,
            failed: results.filter(r => r.result === TestResult.FAILED).length,
            skipped: results.filter(r => r.result === TestResult.SKIPPED).length,
            tests: results
        };
    }
}

// 导出测试运行器
export async function runTestSuite(testSuite) {
    console.log(`🧪 开始运行测试套件: ${testSuite.constructor.name}`);

    const results = await testSuite.run();
    TestUtils.printReport(results);

    return results;
}