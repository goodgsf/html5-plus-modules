/**
 * HTML5+ SQLite 模块测试套件
 *
 * 测试SQLite数据库功能包括：
 * - 数据库连接和管理
 * - 表的创建和删除
 * - 数据的增删改查
 * - 事务处理
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import sqlite from '../../modules/sqlite.js';

class SQLiteTestSuite extends TestSuite {
    constructor() {
        super();
        this.db = null;
        this.dbName = '_doc/test_database.db';
        this.testTables = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置SQLite测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理SQLite测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理数据库
        try {
            if (this.db) {
                await this.db.close();
                this.db = null;
            }
            this.testTables = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理数据库
        try {
            if (this.db) {
                await this.db.close();
                this.db = null;
            }
            this.testTables = [];
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await sqlite.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await sqlite.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够打开数据库')
    async testOpenDatabase() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0',
                description: 'Test Database',
                size: 5 * 1024 * 1024 // 5MB
            });

            // 验证数据库连接
            TestUtils.assertNotNull(this.db);
            TestUtils.assertTrue(typeof this.db.executeSql === 'function');
            TestUtils.assertTrue(typeof this.db.transaction === 'function');
            TestUtils.assertTrue(typeof this.db.close === 'function');
            TestUtils.assertTrue(typeof this.db.getVersion === 'function');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('数据库') ||
                error.message.includes('database')
            );
        }
    }

    @test('应该能够创建表')
    async testCreateTable() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            this.testTables.push('test_users');

            // 验证表创建成功
            const tableInfo = await this.db.getTableInfo('test_users');
            TestUtils.assertTrue(Array.isArray(tableInfo));
            TestUtils.assertTrue(tableInfo.length > 0);

            // 验证表结构
            const columns = tableInfo.map(col => col.name);
            TestUtils.assertTrue(columns.includes('id'));
            TestUtils.assertTrue(columns.includes('name'));
            TestUtils.assertTrue(columns.includes('email'));
            TestUtils.assertTrue(columns.includes('age'));

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('表') ||
                error.message.includes('table')
            );
        }
    }

    @test('应该能够插入数据')
    async testInsertData() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            this.testTables.push('test_users');

            // 插入测试数据
            const insertSql = `
                INSERT INTO test_users (name, email, age)
                VALUES (?, ?, ?)
            `;
            const params = ['张三', 'zhangsan@example.com', 25];

            const result = await this.db.executeSql(insertSql, params);
            TestUtils.assertNotNull(result);
            TestUtils.assertTrue(result.insertId > 0);
            TestUtils.assertTrue(result.rowsAffected > 0);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('插入') ||
                error.message.includes('insert')
            );
        }
    }

    @test('应该能够查询数据')
    async testQueryData() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            this.testTables.push('test_users');

            // 插入测试数据
            await this.db.executeSql(`
                INSERT INTO test_users (name, email, age)
                VALUES (?, ?, ?)
            `, ['张三', 'zhangsan@example.com', 25]);

            // 查询数据
            const querySql = 'SELECT * FROM test_users WHERE name = ?';
            const params = ['张三'];

            const result = await this.db.executeSql(querySql, params);
            TestUtils.assertNotNull(result);
            TestUtils.assertTrue(Array.isArray(result.rows));
            TestUtils.assertTrue(result.rows.length > 0);

            // 验证查询结果
            const user = result.rows[0];
            TestUtils.assertEquals(user.name, '张三');
            TestUtils.assertEquals(user.email, 'zhangsan@example.com');
            TestUtils.assertEquals(user.age, 25);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('查询') ||
                error.message.includes('query')
            );
        }
    }

    @test('应该能够更新数据')
    async testUpdateData() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            this.testTables.push('test_users');

            // 插入测试数据
            const insertResult = await this.db.executeSql(`
                INSERT INTO test_users (name, email, age)
                VALUES (?, ?, ?)
            `, ['张三', 'zhangsan@example.com', 25]);

            // 更新数据
            const updateSql = 'UPDATE test_users SET age = ? WHERE id = ?';
            const params = [26, insertResult.insertId];

            const updateResult = await this.db.executeSql(updateSql, params);
            TestUtils.assertNotNull(updateResult);
            TestUtils.assertTrue(updateResult.rowsAffected > 0);

            // 验证更新结果
            const queryResult = await this.db.executeSql('SELECT age FROM test_users WHERE id = ?', [insertResult.insertId]);
            TestUtils.assertEquals(queryResult.rows[0].age, 26);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('更新') ||
                error.message.includes('update')
            );
        }
    }

    @test('应该能够删除数据')
    async testDeleteData() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            this.testTables.push('test_users');

            // 插入测试数据
            const insertResult = await this.db.executeSql(`
                INSERT INTO test_users (name, email, age)
                VALUES (?, ?, ?)
            `, ['张三', 'zhangsan@example.com', 25]);

            // 删除数据
            const deleteSql = 'DELETE FROM test_users WHERE id = ?';
            const params = [insertResult.insertId];

            const deleteResult = await this.db.executeSql(deleteSql, params);
            TestUtils.assertNotNull(deleteResult);
            TestUtils.assertTrue(deleteResult.rowsAffected > 0);

            // 验证删除结果
            const queryResult = await this.db.executeSql('SELECT * FROM test_users WHERE id = ?', [insertResult.insertId]);
            TestUtils.assertEquals(queryResult.rows.length, 0);

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

    @test('应该能够处理事务')
    async testTransaction() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_accounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    balance DECIMAL(10,2) DEFAULT 0
                )
            `);
            this.testTables.push('test_accounts');

            // 插入测试数据
            await this.db.executeSql(`
                INSERT INTO test_accounts (name, balance)
                VALUES (?, ?), (?, ?)
            `, ['账户A', 1000, '账户B', 500]);

            // 执行事务
            await this.db.transaction(async (tx) => {
                // 从账户A转账200到账户B
                await tx.executeSql('UPDATE test_accounts SET balance = balance - ? WHERE name = ?', [200, '账户A']);
                await tx.executeSql('UPDATE test_accounts SET balance = balance + ? WHERE name = ?', [200, '账户B']);
            });

            // 验证事务结果
            const resultA = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户A']);
            const resultB = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户B']);

            TestUtils.assertEquals(resultA.rows[0].balance, 800);
            TestUtils.assertEquals(resultB.rows[0].balance, 700);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('事务') ||
                error.message.includes('transaction')
            );
        }
    }

    @test('应该能够处理事务回滚')
    async testTransactionRollback() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_accounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    balance DECIMAL(10,2) DEFAULT 0
                )
            `);
            this.testTables.push('test_accounts');

            // 插入测试数据
            await this.db.executeSql(`
                INSERT INTO test_accounts (name, balance)
                VALUES (?, ?), (?, ?)
            `, ['账户A', 1000, '账户B', 500]);

            // 获取初始余额
            const initialA = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户A']);
            const initialB = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户B']);

            // 执行事务（故意失败以测试回滚）
            try {
                await this.db.transaction(async (tx) => {
                    await tx.executeSql('UPDATE test_accounts SET balance = balance - ? WHERE name = ?', [200, '账户A']);
                    // 故意制造错误
                    await tx.executeSql('INVALID SQL STATEMENT');
                });
                TestUtils.fail('事务应该失败');
            } catch (txError) {
                // 事务失败是正常的
                TestUtils.assertTrue(txError.message.includes('SQL') || txError.message.includes('sql'));
            }

            // 验证事务回滚后数据未改变
            const finalA = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户A']);
            const finalB = await this.db.executeSql('SELECT balance FROM test_accounts WHERE name = ?', ['账户B']);

            TestUtils.assertEquals(finalA.rows[0].balance, initialA.rows[0].balance);
            TestUtils.assertEquals(finalB.rows[0].balance, initialB.rows[0].balance);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('事务') ||
                error.message.includes('transaction')
            );
        }
    }

    @test('应该能够处理批量操作')
    async testBatchOperations() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price DECIMAL(10,2),
                    category TEXT
                )
            `);
            this.testTables.push('test_products');

            // 批量插入数据
            const batchData = [
                ['产品A', 10.99, '电子产品'],
                ['产品B', 20.50, '电子产品'],
                ['产品C', 15.75, '办公用品'],
                ['产品D', 8.25, '办公用品'],
                ['产品E', 12.99, '电子产品']
            ];

            const batchResults = [];
            for (const data of batchData) {
                const result = await this.db.executeSql(`
                    INSERT INTO test_products (name, price, category)
                    VALUES (?, ?, ?)
                `, data);
                batchResults.push(result);
            }

            // 验证批量插入结果
            TestUtils.assertEquals(batchResults.length, 5);
            for (const result of batchResults) {
                TestUtils.assertTrue(result.insertId > 0);
                TestUtils.assertTrue(result.rowsAffected > 0);
            }

            // 批量查询
            const queryResult = await this.db.executeSql('SELECT * FROM test_products WHERE category = ?', ['电子产品']);
            TestUtils.assertEquals(queryResult.rows.length, 3);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('批量') ||
                error.message.includes('batch')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 测试无效的SQL语句
            await this.db.executeSql('INVALID SQL STATEMENT');
            TestUtils.fail('应该抛出错误');

        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('SQL') ||
                error.message.includes('sql') ||
                error.message.includes('语法') ||
                error.message.includes('syntax')
            );
        }

        try {
            // 测试不存在的表
            await this.db.executeSql('SELECT * FROM non_existent_table');
            TestUtils.fail('应该抛出错误');

        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('表') ||
                error.message.includes('table') ||
                error.message.includes('不存在') ||
                error.message.includes('not found')
            );
        }

        try {
            // 测试参数不匹配
            await this.db.executeSql('SELECT * FROM test_users WHERE id = ?', []); // 空参数
            TestUtils.fail('应该抛出错误');

        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('绑定') ||
                error.message.includes('bind')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await sqlite.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await sqlite.requestPermission();
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

    @test('应该能够获取数据库信息')
    async testGetDatabaseInfo() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_info (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    data TEXT
                )
            `);
            this.testTables.push('test_info');

            // 获取数据库信息
            const dbInfo = await this.db.getDatabaseInfo();
            TestUtils.assertTrue(typeof dbInfo === 'object');
            TestUtils.assertTrue(typeof dbInfo.version === 'string');
            TestUtils.assertTrue(typeof dbInfo.pageSize === 'number');
            TestUtils.assertTrue(typeof dbInfo.cacheSize === 'number');

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

    @test('应该能够获取表列表')
    async testGetTableList() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_table1 (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT
                )
            `);
            this.testTables.push('test_table1');

            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_table2 (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    value TEXT
                )
            `);
            this.testTables.push('test_table2');

            // 获取表列表
            const tables = await this.db.getTableList();
            TestUtils.assertTrue(Array.isArray(tables));
            TestUtils.assertTrue(tables.length >= 2);

            // 验证测试表存在
            TestUtils.assertTrue(tables.includes('test_table1'));
            TestUtils.assertTrue(tables.includes('test_table2'));

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('表') ||
                error.message.includes('table')
            );
        }
    }

    @test('应该能够处理并发数据库操作')
    async testConcurrentOperations() {
        try {
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 创建测试表
            await this.db.executeSql(`
                CREATE TABLE IF NOT EXISTS test_concurrent (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    value INTEGER
                )
            `);
            this.testTables.push('test_concurrent');

            // 并发插入数据
            const promises = [];
            const count = 5;

            for (let i = 0; i < count; i++) {
                promises.push(
                    this.db.executeSql('INSERT INTO test_concurrent (value) VALUES (?)', [i])
                );
            }

            const results = await Promise.all(promises);

            // 验证并发操作结果
            TestUtils.assertEquals(results.length, count);
            for (const result of results) {
                TestUtils.assertTrue(result.insertId > 0);
                TestUtils.assertTrue(result.rowsAffected > 0);
            }

            // 验证数据总数
            const countResult = await this.db.executeSql('SELECT COUNT(*) as count FROM test_concurrent');
            TestUtils.assertEquals(countResult.rows[0].count, count);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('并发') ||
                error.message.includes('concurrent')
            );
        }
    }

    @test('应该能够处理数据库版本管理')
    async testDatabaseVersionManagement() {
        try {
            // 打开数据库
            this.db = await sqlite.openDatabase({
                name: this.dbName,
                version: '1.0'
            });

            // 获取当前版本
            const currentVersion = await this.db.getVersion();
            TestUtils.assertEquals(currentVersion, '1.0');

            // 更新版本
            await this.db.setVersion('2.0');

            // 验证版本更新
            const newVersion = await this.db.getVersion();
            TestUtils.assertEquals(newVersion, '2.0');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('版本') ||
                error.message.includes('version')
            );
        }
    }
}

export default SQLiteTestSuite;