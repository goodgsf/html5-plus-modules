/**
 * HTML5+ Storage 模块测试套件
 *
 * 测试本地存储功能包括：
 * - 基本存取操作
 * - 异步操作
 * - 批量操作
 * - 错误处理
 * - 浏览器兼容性
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import storage from '../../modules/storage.js';

class StorageTestSuite extends TestSuite {
    constructor() {
        super();
        this.testStorage = null;
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Storage测试环境...');
        TestUtils.mockPlusEnvironment();
        await storage.initialize();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Storage测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理存储
        try {
            await storage.clear();
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理存储
        try {
            await storage.clear();
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够存储和获取字符串值')
    async testSetAndGetItem() {
        const key = 'test_key';
        const value = 'test_value';

        // 测试设置值
        await storage.setItem(key, value);

        // 测试获取值
        const result = await storage.getItem(key);
        TestUtils.assertEquals(result, value);
    }

    @test('应该能够存储和获取数字值')
    async testSetAndGetNumber() {
        const key = 'number_key';
        const value = 12345;

        await storage.setItem(key, value);
        const result = await storage.getItem(key);
        TestUtils.assertEquals(result, value.toString());
    }

    @test('应该能够存储和获取布尔值')
    async testSetAndGetBoolean() {
        const key = 'boolean_key';
        const value = true;

        await storage.setItem(key, value);
        const result = await storage.getItem(key);
        TestUtils.assertEquals(result, 'true');
    }

    @test('应该能够存储和获取JSON对象')
    async testSetAndGetJSONObject() {
        const key = 'json_key';
        const value = {
            name: 'test',
            age: 25,
            items: ['a', 'b', 'c']
        };

        await storage.setItem(key, JSON.stringify(value));
        const result = await storage.getItem(key);
        const parsed = JSON.parse(result);

        TestUtils.assertEquals(parsed.name, value.name);
        TestUtils.assertEquals(parsed.age, value.age);
        TestUtils.assertEquals(parsed.items.length, value.items.length);
    }

    @test('应该能够获取存储的键的数量')
    async testGetLength() {
        // 初始应该为空
        let length = await storage.getLength();
        TestUtils.assertEquals(length, 0);

        // 添加一些数据
        await storage.setItem('key1', 'value1');
        await storage.setItem('key2', 'value2');
        await storage.setItem('key3', 'value3');

        length = await storage.getLength();
        TestUtils.assertEquals(length, 3);
    }

    @test('应该能够获取所有键')
    async testGetAllKeys() {
        // 初始应该为空
        let keys = await storage.getAllKeys();
        TestUtils.assertEquals(keys.length, 0);

        // 添加一些数据
        const testKeys = ['key1', 'key2', 'key3'];
        for (const key of testKeys) {
            await storage.setItem(key, `value_${key}`);
        }

        keys = await storage.getAllKeys();
        TestUtils.assertEquals(keys.length, 3);

        // 验证键存在
        for (const key of testKeys) {
            TestUtils.assertTrue(keys.includes(key));
        }
    }

    @test('应该能够通过索引获取键')
    async testGetKeyByIndex() {
        // 添加一些数据
        const testKeys = ['key1', 'key2', 'key3'];
        for (const key of testKeys) {
            await storage.setItem(key, `value_${key}`);
        }

        // 获取键
        const key0 = await storage.key(0);
        const key1 = await storage.key(1);
        const key2 = await storage.key(2);

        TestUtils.assertNotNull(key0);
        TestUtils.assertNotNull(key1);
        TestUtils.assertNotNull(key2);

        // 验证键在列表中
        const allKeys = await storage.getAllKeys();
        TestUtils.assertTrue(allKeys.includes(key0));
        TestUtils.assertTrue(allKeys.includes(key1));
        TestUtils.assertTrue(allKeys.includes(key2));
    }

    @test('应该能够删除项目')
    async testRemoveItem() {
        const key = 'test_key';
        const value = 'test_value';

        // 设置值
        await storage.setItem(key, value);

        // 验证值存在
        let result = await storage.getItem(key);
        TestUtils.assertEquals(result, value);

        // 删除值
        await storage.removeItem(key);

        // 验证值不存在
        result = await storage.getItem(key);
        TestUtils.assertEquals(result, null);
    }

    @test('应该能够清空所有存储')
    async testClear() {
        // 添加一些数据
        await storage.setItem('key1', 'value1');
        await storage.setItem('key2', 'value2');
        await storage.setItem('key3', 'value3');

        // 验证数据存在
        let length = await storage.getLength();
        TestUtils.assertEquals(length, 3);

        // 清空存储
        await storage.clear();

        // 验证存储为空
        length = await storage.getLength();
        TestUtils.assertEquals(length, 0);

        const keys = await storage.getAllKeys();
        TestUtils.assertEquals(keys.length, 0);
    }

    @test('应该能够正确处理不存在的键')
    async testNonExistentKey() {
        // 获取不存在的键
        const result = await storage.getItem('non_existent_key');
        TestUtils.assertEquals(result, null);

        // 删除不存在的键不应该出错
        await storage.removeItem('non_existent_key');

        // 获取不存在的键的索引
        try {
            const key = await storage.key(999);
            TestUtils.assertEquals(key, null);
        } catch (error) {
            // 如果抛出错误也是可以接受的
            TestUtils.assertTrue(error.message.includes('索引越界') || error.message.includes('Index out of bounds'));
        }
    }

    @test('应该能够处理空值和空字符串')
    async testEmptyValues() {
        // 空字符串
        await storage.setItem('empty_string', '');
        let result = await storage.getItem('empty_string');
        TestUtils.assertEquals(result, '');

        // null值
        await storage.setItem('null_value', 'null');
        result = await storage.getItem('null_value');
        TestUtils.assertEquals(result, 'null');

        // undefined值（应该转换为字符串'undefined'）
        await storage.setItem('undefined_value', undefined);
        result = await storage.getItem('undefined_value');
        TestUtils.assertEquals(result, 'undefined');
    }

    @test('应该能够处理特殊字符')
    async testSpecialCharacters() {
        const specialKeys = [
            'key with spaces',
            'key-with-dashes',
            'key_with_underscores',
            'key@with#symbols',
            'key.with.dots',
            'key/with/slashes',
            'key\\with\\backslashes',
            '中文键',
            'emoji🔑key'
        ];

        const specialValues = [
            'value with spaces',
            'value-with-dashes',
            'value_with_underscores',
            'value@with#symbols',
            'value.with.dots',
            '中文值',
            'emoji🎉value',
            'multi\nline\nvalue',
            'tab\tseparated\tvalue'
        ];

        // 测试特殊键
        for (const key of specialKeys) {
            await storage.setItem(key, 'test_value');
            const result = await storage.getItem(key);
            TestUtils.assertEquals(result, 'test_value');
        }

        // 测试特殊值
        for (const value of specialValues) {
            await storage.setItem('special_key', value);
            const result = await storage.getItem('special_key');
            TestUtils.assertEquals(result, value);
        }
    }

    @test('应该能够处理大量数据')
    async testLargeData() {
        const largeString = 'x'.repeat(10000); // 10KB数据
        const key = 'large_data_key';

        await storage.setItem(key, largeString);
        const result = await storage.getItem(key);
        TestUtils.assertEquals(result, largeString);
        TestUtils.assertEquals(result.length, 10000);
    }

    @test('应该能够处理大量键值对')
    async testManyKeyValuePairs() {
        const count = 100;
        const prefix = 'test_key_';

        // 添加大量键值对
        for (let i = 0; i < count; i++) {
            await storage.setItem(`${prefix}${i}`, `value_${i}`);
        }

        // 验证数量
        let length = await storage.getLength();
        TestUtils.assertEquals(length, count);

        // 验证所有键存在
        const keys = await storage.getAllKeys();
        TestUtils.assertEquals(keys.length, count);

        // 验证部分值
        for (let i = 0; i < 10; i++) {
            const key = `${prefix}${i}`;
            const expectedValue = `value_${i}`;
            const actualValue = await storage.getItem(key);
            TestUtils.assertEquals(actualValue, expectedValue);
        }
    }

    @test('应该能够使用同步方法')
    async testSynchronousMethods() {
        // 注意：同步方法可能在浏览器环境中不可用
        // 这里主要测试方法存在性

        TestUtils.assertTrue(typeof storage.setItemSync === 'function');
        TestUtils.assertTrue(typeof storage.getItemSync === 'function');
        TestUtils.assertTrue(typeof storage.removeItemSync === 'function');
        TestUtils.assertTrue(typeof storage.clearSync === 'function');
        TestUtils.assertTrue(typeof storage.getLengthSync === 'function');
        TestUtils.assertTrue(typeof storage.getAllKeysSync === 'function');
        TestUtils.assertTrue(typeof storage.keySync === 'function');

        // 尝试使用同步方法（如果可用）
        try {
            storage.setItemSync('sync_key', 'sync_value');
            const result = storage.getItemSync('sync_key');
            TestUtils.assertEquals(result, 'sync_value');

            const length = storage.getLengthSync();
            TestUtils.assertTrue(length > 0);

            storage.removeItemSync('sync_key');
            const removedResult = storage.getItemSync('sync_key');
            TestUtils.assertEquals(removedResult, null);
        } catch (error) {
            // 同步方法在浏览器中可能不可用，这是正常的
            console.log('同步方法在当前环境中不可用:', error.message);
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        // 测试无效参数
        try {
            await storage.setItem(null, 'value');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(error.message.includes('参数') || error.message.includes('parameter'));
        }

        try {
            await storage.setItem('key', null);
            // 这应该不会出错，因为null会被转换为字符串
        } catch (error) {
            // 如果出错，确保是合理的错误
            TestUtils.assertTrue(error.message.includes('参数') || error.message.includes('parameter'));
        }

        try {
            await storage.getItem(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(error.message.includes('参数') || error.message.includes('parameter'));
        }

        try {
            await storage.removeItem(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(error.message.includes('参数') || error.message.includes('parameter'));
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await storage.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await storage.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');

        const requestedPermission = await storage.requestPermission();
        TestUtils.assertTrue(requestedPermission === 'granted' || requestedPermission === 'denied');
    }

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        const promises = [];
        const count = 50;

        // 并发设置多个值
        for (let i = 0; i < count; i++) {
            promises.push(
                storage.setItem(`concurrent_key_${i}`, `concurrent_value_${i}`)
            );
        }

        await Promise.all(promises);

        // 验证所有值都被正确设置
        for (let i = 0; i < count; i++) {
            const value = await storage.getItem(`concurrent_key_${i}`);
            TestUtils.assertEquals(value, `concurrent_value_${i}`);
        }
    }

    @test('应该能够处理键名冲突')
    async testKeyConflict() {
        const key = 'conflict_key';

        // 设置初始值
        await storage.setItem(key, 'initial_value');
        let result = await storage.getItem(key);
        TestUtils.assertEquals(result, 'initial_value');

        // 覆盖值
        await storage.setItem(key, 'overwritten_value');
        result = await storage.getItem(key);
        TestUtils.assertEquals(result, 'overwritten_value');

        // 再次覆盖
        await storage.setItem(key, 'final_value');
        result = await storage.getItem(key);
        TestUtils.assertEquals(result, 'final_value');
    }

    @test('应该能够处理超长键名')
    async testLongKeyName() {
        const longKey = 'a'.repeat(1000); // 1000字符的键名
        const value = 'test_value';

        await storage.setItem(longKey, value);
        const result = await storage.getItem(longKey);
        TestUtils.assertEquals(result, value);

        // 验证键在键列表中
        const keys = await storage.getAllKeys();
        TestUtils.assertTrue(keys.includes(longKey));
    }
}

export default StorageTestSuite;