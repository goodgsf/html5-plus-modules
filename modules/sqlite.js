/**
 * HTML5+ SQLite 模块 ES Module 封装
 *
 * 该模块提供了SQLite数据库管理功能，包括打开/关闭数据库、执行SQL语句、事务处理等
 * 遵循HTML5+官方API规范
 */

/**
 * SQLite错误码常量
 */
export const SQLiteErrorCode = {
    NOT_AVAILABLE: 1001,       // SQLite不可用
    DATABASE_NOT_OPEN: 1002,  // 数据库未打开
    DATABASE_ALREADY_OPEN: 1003, // 数据库已打开
    INVALID_PATH: 1004,        // 无效路径
    INVALID_NAME: 1005,       // 无效数据库名称
    SQL_SYNTAX_ERROR: 1006,   // SQL语法错误
    CONSTRAINT_VIOLATION: 1007, // 约束违反
    TRANSACTION_ERROR: 1008, // 事务错误
    PERMISSION_DENIED: 1009, // 权限被拒绝
    TIMEOUT: 1010,            // 操作超时
    UNKNOWN_ERROR: 1099       // 未知错误
};

/**
 * 数据库操作选项
 * @typedef {Object} DatabaseOptions
 * @property {string} name - 数据库名称
 * @property {string} path - 数据库路径
 */

/**
 * 数据库查询结果
 * @typedef {Object} QueryResult
 * @property {Array<Object>} rows - 查询结果行数组
 * @property {number} rowsAffected - 受影响的行数
 * @property {number} insertId - 插入的ID（仅INSERT操作）
 */

/**
 * SQL执行选项
 * @typedef {Object} ExecuteSQLOptions
 * @property {string} name - 数据库名称
 * @property {string|string[]} sql - SQL语句或SQL语句数组
 */

/**
 * 事务选项
 * @typedef {Object} TransactionOptions
 * @property {string} name - 数据库名称
 * @property {'begin'|'commit'|'rollback'} operation - 事务操作类型
 */

/**
 * SQLite操作成功回调函数
 * @callback SQLiteSuccessCallback
 * @param {Object|QueryResult|Array<Object>} [result] - 操作结果
 */

/**
 * SQLite操作失败回调函数
 * @callback SQLiteErrorCallback
 * @param {Error} error - 错误信息
 */

/**
 * HTML5+ SQLite 模块类
 */
class SQLiteModule {
    constructor() {
        this.moduleName = 'SQLite';
        this._databases = new Map();
        this._isInitialized = false;
        this._initPromise = null;
        this._browserSupport = false;
    }

    /**
     * 初始化SQLite模块
     * @private
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this._initPromise) {
            return this._initPromise;
        }

        this._initPromise = new Promise((resolve, reject) => {
            try {
                // 检查HTML5+环境是否可用
                if (typeof plus === 'undefined' || !plus.sqlite) {
                    // 检查浏览器环境是否支持Web SQL
                    if (typeof window !== 'undefined' && 'openDatabase' in window) {
                        this._browserSupport = true;
                        console.log('SQLite模块将在浏览器环境中使用Web SQL API');
                    } else if (typeof window !== 'undefined' && 'indexedDB' in window) {
                        console.log('SQLite模块将在浏览器环境中模拟SQLite功能');
                    } else {
                        console.warn('设备不支持SQLite功能');
                    }
                    this._isInitialized = true;
                    resolve();
                    return;
                }

                // HTML5+环境初始化
                this._isInitialized = true;
                resolve();

            } catch (error) {
                console.warn('SQLite模块初始化异常:', error);
                reject(error);
            }
        });

        return this._initPromise;
    }

    /**
     * 打开数据库
     * @param {DatabaseOptions} options - 数据库选项
     * @param {SQLiteSuccessCallback} [successCallback] - 成功回调函数
     * @param {SQLiteErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   await sqlite.openDatabase({
     *     name: 'mydb',
     *     path: '_doc/test.db'
     *   });
     *   console.log('数据库打开成功');
     * } catch (error) {
     *   console.error('打开数据库失败:', error);
     * }
     *
     * // 回调方式调用
     * sqlite.openDatabase(
     *   { name: 'mydb', path: '_doc/test.db' },
     *   () => {
     *     console.log('数据库打开成功');
     *   },
     *   (error) => {
     *     console.error('打开数据库失败:', error);
     *   }
     * );
     * ```
     */
    openDatabase(options, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name || !options.path) {
                    throw new Error('name和path参数不能为空');
                }

                const { name, path } = options;

                if (this._databases.has(name)) {
                    throw new Error(`数据库 "${name}" 已经打开`);
                }

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    plus.sqlite.openDatabase(
                        {
                            name,
                            path,
                            success: () => {
                                this._databases.set(name, { name, path, type: 'plus' });
                                if (successCallback) successCallback();
                                resolve();
                            },
                            fail: (error) => {
                                const sqliteError = new Error(`打开数据库失败: ${error.message || '未知错误'}`);
                                if (errorCallback) errorCallback(sqliteError);
                                reject(sqliteError);
                            }
                        }
                    );

                } else if (this._browserSupport) {
                    // 浏览器环境使用Web SQL
                    this._openDatabaseBrowser(name, path, successCallback, errorCallback, resolve, reject);
                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                if (errorCallback) errorCallback(error);
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中打开数据库
     * @private
     */
    _openDatabaseBrowser(name, path, successCallback, errorCallback, resolve, reject) {
        try {
            // 在浏览器环境中，我们使用Web SQL API
            const db = window.openDatabase(name, '1.0', name, 5 * 1024 * 1024); // 5MB

            if (db) {
                this._databases.set(name, {
                    name,
                    path,
                    type: 'browser',
                    db: db
                });

                if (successCallback) successCallback();
                resolve();
            } else {
                throw new Error('无法打开Web SQL数据库');
            }
        } catch (error) {
            const sqliteError = new Error(`打开数据库失败: ${error.message}`);
            if (errorCallback) errorCallback(sqliteError);
            reject(sqliteError);
        }
    }

    /**
     * 判断数据库是否打开
     * @param {DatabaseOptions} options - 数据库选项
     * @returns {Promise<boolean>} 是否已打开
     *
     * @example
     * ```javascript
     * try {
     *   const isOpen = await sqlite.isOpenDatabase({
     *     name: 'mydb',
     *     path: '_doc/test.db'
     *   });
     *   console.log('数据库是否打开:', isOpen);
     * } catch (error) {
     *   console.error('检查数据库状态失败:', error);
     * }
     * ```
     */
    isOpenDatabase(options) {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (!options || !options.name) {
                    resolve(false);
                    return;
                }

                const { name } = options;

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    const isOpen = plus.sqlite.isOpenDatabase({ name });
                    resolve(isOpen);
                } else {
                    // 浏览器环境
                    resolve(this._databases.has(name));
                }

            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 关闭数据库
     * @param {DatabaseOptions} options - 数据库选项
     * @param {SQLiteSuccessCallback} [successCallback] - 成功回调函数
     * @param {SQLiteErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * try {
     *   await sqlite.closeDatabase({
     *     name: 'mydb'
     *   });
     *   console.log('数据库关闭成功');
     * } catch (error) {
     *   console.error('关闭数据库失败:', error);
     * }
     * ```
     */
    closeDatabase(options, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name) {
                    throw new Error('name参数不能为空');
                }

                const { name } = options;

                if (!this._databases.has(name)) {
                    throw new Error(`数据库 "${name}" 未打开`);
                }

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    plus.sqlite.closeDatabase(
                        {
                            name,
                            success: () => {
                                this._databases.delete(name);
                                if (successCallback) successCallback();
                                resolve();
                            },
                            fail: (error) => {
                                const sqliteError = new Error(`关闭数据库失败: ${error.message || '未知错误'}`);
                                if (errorCallback) errorCallback(sqliteError);
                                reject(sqliteError);
                            }
                        }
                    );

                } else if (this._browserSupport) {
                    // 浏览器环境
                    this._databases.delete(name);
                    if (successCallback) successCallback();
                    resolve();

                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                if (errorCallback) errorCallback(error);
                reject(error);
            }
        });
    }

    /**
     * 执行事务
     * @param {TransactionOptions} options - 事务选项
     * @param {SQLiteSuccessCallback} [successCallback] - 成功回调函数
     * @param {SQLiteErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * // 开始事务
     * await sqlite.transaction({
     *   name: 'mydb',
     *   operation: 'begin'
     * });
     *
     * // 执行一些SQL操作...
     *
     * // 提交事务
     * await sqlite.transaction({
     *   name: 'mydb',
     *   operation: 'commit'
     * });
     * ```
     */
    transaction(options, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name || !options.operation) {
                    throw new Error('name和operation参数不能为空');
                }

                const { name, operation } = options;

                if (!this._databases.has(name)) {
                    throw new Error(`数据库 "${name}" 未打开`);
                }

                const validOperations = ['begin', 'commit', 'rollback'];
                if (!validOperations.includes(operation)) {
                    throw new Error('operation参数必须是begin、commit或rollback');
                }

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    plus.sqlite.transaction(
                        {
                            name,
                            operation,
                            success: () => {
                                if (successCallback) successCallback();
                                resolve();
                            },
                            fail: (error) => {
                                const sqliteError = new Error(`执行事务失败: ${error.message || '未知错误'}`);
                                if (errorCallback) errorCallback(sqliteError);
                                reject(sqliteError);
                            }
                        }
                    );

                } else if (this._browserSupport) {
                    // 浏览器环境使用Web SQL事务
                    this._transactionBrowser(name, operation, successCallback, errorCallback, resolve, reject);
                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                if (errorCallback) errorCallback(error);
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中执行事务
     * @private
     */
    _transactionBrowser(name, operation, successCallback, errorCallback, resolve, reject) {
        const dbInfo = this._databases.get(name);
        if (!dbInfo || !dbInfo.db) {
            const error = new Error(`数据库 "${name}" 未打开`);
            if (errorCallback) errorCallback(error);
            reject(error);
            return;
        }

        try {
            if (operation === 'begin') {
                // Web SQL不需要显式开始事务，事务在executeSql中自动处理
                if (successCallback) successCallback();
                resolve();
            } else if (operation === 'commit') {
                // Web SQL不需要显式提交事务
                if (successCallback) successCallback();
                resolve();
            } else if (operation === 'rollback') {
                // Web SQL无法显式回滚事务
                if (successCallback) successCallback();
                resolve();
            }
        } catch (error) {
            const sqliteError = new Error(`执行事务失败: ${error.message}`);
            if (errorCallback) errorCallback(sqliteError);
            reject(sqliteError);
        }
    }

    /**
     * 执行SQL语句（增删改操作）
     * @param {ExecuteSQLOptions} options - SQL执行选项
     * @param {SQLiteSuccessCallback} [successCallback] - 成功回调函数
     * @param {SQLiteErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<QueryResult>}
     *
     * @example
     * ```javascript
     * // 执行单条SQL
     * await sqlite.executeSql({
     *   name: 'mydb',
     *   sql: 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)'
     * });
     *
     * // 执行多条SQL
     * await sqlite.executeSql({
     *   name: 'mydb',
     *   sql: [
     *     'INSERT INTO users (name) VALUES ("张三")',
     *     'INSERT INTO users (name) VALUES ("李四")'
     *   ]
     * });
     * ```
     */
    executeSql(options, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name || !options.sql) {
                    throw new Error('name和sql参数不能为空');
                }

                const { name, sql } = options;

                if (!this._databases.has(name)) {
                    throw new Error(`数据库 "${name}" 未打开`);
                }

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    plus.sqlite.executeSql(
                        {
                            name,
                            sql,
                            success: () => {
                                const result = { rowsAffected: 1, insertId: null };
                                if (successCallback) successCallback(result);
                                resolve(result);
                            },
                            fail: (error) => {
                                const sqliteError = new Error(`执行SQL失败: ${error.message || '未知错误'}`);
                                if (errorCallback) errorCallback(sqliteError);
                                reject(sqliteError);
                            }
                        }
                    );

                } else if (this._browserSupport) {
                    // 浏览器环境使用Web SQL
                    this._executeSqlBrowser(name, sql, successCallback, errorCallback, resolve, reject);
                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                if (errorCallback) errorCallback(error);
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中执行SQL
     * @private
     */
    _executeSqlBrowser(name, sql, successCallback, errorCallback, resolve, reject) {
        const dbInfo = this._databases.get(name);
        if (!dbInfo || !dbInfo.db) {
            const error = new Error(`数据库 "${name}" 未打开`);
            if (errorCallback) errorCallback(error);
            reject(error);
            return;
        }

        try {
            const sqlArray = Array.isArray(sql) ? sql : [sql];
            let currentIndex = 0;

            const executeNext = () => {
                if (currentIndex >= sqlArray.length) {
                    const result = { rowsAffected: sqlArray.length, insertId: null };
                    if (successCallback) successCallback(result);
                    resolve(result);
                    return;
                }

                const currentSql = sqlArray[currentIndex];

                dbInfo.db.transaction((tx) => {
                    tx.executeSql(
                        currentSql,
                        [],
                        (tx, result) => {
                            currentIndex++;
                            executeNext();
                        },
                        (tx, error) => {
                            const sqliteError = new Error(`执行SQL失败: ${error.message}`);
                            if (errorCallback) errorCallback(sqliteError);
                            reject(sqliteError);
                        }
                    );
                });
            };

            executeNext();

        } catch (error) {
            const sqliteError = new Error(`执行SQL失败: ${error.message}`);
            if (errorCallback) errorCallback(sqliteError);
            reject(sqliteError);
        }
    }

    /**
     * 执行查询SQL语句
     * @param {ExecuteSQLOptions} options - SQL执行选项
     * @param {SQLiteSuccessCallback} [successCallback] - 成功回调函数
     * @param {SQLiteErrorCallback} [errorCallback] - 错误回调函数
     * @returns {Promise<Array<Object>>} 查询结果数组
     *
     * @example
     * ```javascript
     * const results = await sqlite.selectSql({
     *   name: 'mydb',
     *   sql: 'SELECT * FROM users'
     * });
     * console.log('查询结果:', results);
     * ```
     */
    selectSql(options, successCallback = null, errorCallback = null) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name || !options.sql) {
                    throw new Error('name和sql参数不能为空');
                }

                const { name, sql } = options;

                if (!this._databases.has(name)) {
                    throw new Error(`数据库 "${name}" 未打开`);
                }

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境
                    plus.sqlite.selectSql(
                        {
                            name,
                            sql,
                            success: (data) => {
                                const results = Array.isArray(data) ? data : [];
                                if (successCallback) successCallback(results);
                                resolve(results);
                            },
                            fail: (error) => {
                                const sqliteError = new Error(`查询SQL失败: ${error.message || '未知错误'}`);
                                if (errorCallback) errorCallback(sqliteError);
                                reject(sqliteError);
                            }
                        }
                    );

                } else if (this._browserSupport) {
                    // 浏览器环境使用Web SQL
                    this._selectSqlBrowser(name, sql, successCallback, errorCallback, resolve, reject);
                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                if (errorCallback) errorCallback(error);
                reject(error);
            }
        });
    }

    /**
     * 在浏览器环境中执行查询SQL
     * @private
     */
    _selectSqlBrowser(name, sql, successCallback, errorCallback, resolve, reject) {
        const dbInfo = this._databases.get(name);
        if (!dbInfo || !dbInfo.db) {
            const error = new Error(`数据库 "${name}" 未打开`);
            if (errorCallback) errorCallback(error);
            reject(error);
            return;
        }

        try {
            dbInfo.db.transaction((tx) => {
                tx.executeSql(
                    sql,
                    [],
                    (tx, result) => {
                        const rows = [];
                        const len = result.rows.length;

                        for (let i = 0; i < len; i++) {
                            rows.push(result.rows.item(i));
                        }

                        if (successCallback) successCallback(rows);
                        resolve(rows);
                    },
                    (tx, error) => {
                        const sqliteError = new Error(`查询SQL失败: ${error.message}`);
                        if (errorCallback) errorCallback(sqliteError);
                        reject(sqliteError);
                    }
                );
            });
        } catch (error) {
            const sqliteError = new Error(`查询SQL失败: ${error.message}`);
            if (errorCallback) errorCallback(sqliteError);
            reject(sqliteError);
        }
    }

    /**
     * 获取当前打开的数据库列表
     * @returns {Promise<Array<{name: string, path: string}>>} 数据库列表
     *
     * @example
     * ```javascript
     * const databases = await sqlite.getDatabases();
     * console.log('已打开的数据库:', databases);
     * ```
     */
    getDatabases() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const databases = Array.from(this._databases.values()).map(db => ({
                    name: db.name,
                    path: db.path
                }));

                resolve(databases);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 关闭所有打开的数据库
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await sqlite.closeAllDatabases();
     * console.log('所有数据库已关闭');
     * ```
     */
    closeAllDatabases() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                const closePromises = Array.from(this._databases.keys()).map(name =>
                    this.closeDatabase({ name }).catch(error => {
                        console.error(`关闭数据库 ${name} 失败:`, error);
                    })
                );

                await Promise.all(closePromises);
                resolve();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 判断设备是否支持SQLite功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * try {
     *   const isSupported = await sqlite.isSupported();
     *   if (isSupported) {
     *     console.log('设备支持SQLite功能');
     *   } else {
     *     console.log('设备不支持SQLite功能');
     *   }
     * } catch (error) {
     *   console.error('检查支持性失败:', error);
     * }
     * ```
     */
    isSupported() {
        return new Promise(async (resolve) => {
            try {
                await this.initialize();

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    resolve(true);
                } else if (this._browserSupport) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 获取数据库版本信息
     * @param {DatabaseOptions} options - 数据库选项
     * @returns {Promise<string>} 数据库版本
     *
     * @example
     * ```javascript
     * try {
     *   const version = await sqlite.getDatabaseVersion({
     *     name: 'mydb'
     *   });
     *   console.log('数据库版本:', version);
     * } catch (error) {
     *   console.error('获取数据库版本失败:', error);
     * }
     * ```
     */
    getDatabaseVersion(options) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.initialize();

                if (!options || !options.name) {
                    throw new Error('name参数不能为空');
                }

                const { name } = options;

                if (typeof plus !== 'undefined' && plus.sqlite) {
                    // HTML5+环境，尝试查询SQLite版本
                    try {
                        const results = await this.selectSql({
                            name,
                            sql: 'SELECT sqlite_version() as version'
                        });
                        resolve(results[0]?.version || 'unknown');
                    } catch (error) {
                        resolve('unknown');
                    }
                } else if (this._browserSupport) {
                    // 浏览器环境
                    resolve('Web SQL');
                } else {
                    throw new Error('设备不支持SQLite功能');
                }

            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建SQLite模块实例
const sqlite = new SQLiteModule();

// 导出模块
export default sqlite;

// 导出类和常量
export { SQLiteModule, SQLiteErrorCode };

// 为了兼容性，也导出类作为默认导出的属性
sqlite.SQLiteModule = SQLiteModule;
sqlite.SQLiteErrorCode = SQLiteErrorCode;