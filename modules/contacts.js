/**
 * HTML5+ Contacts 模块 ES Module 封装
 *
 * 该模块提供了系统通讯录管理功能，支持对联系人的增、删、改、查等操作
 * 遵循HTML5+官方API规范
 */

/**
 * 通讯录类型常量
 */
export const AddressBookType = {
    PHONE: 0,    // 手机通讯录
    SIM: 1       // SIM卡通讯录
};

/**
 * 联系人域类型常量
 */
export const ContactFieldType = {
    PHONE: 'phone',
    HOME: 'home',
    COMPANY: 'company',
    MOBILE: 'mobile',
    WORK: 'work',
    PERSONAL: 'personal',
    OTHER: 'other'
};

/**
 * 地址类型常量
 */
export const AddressType = {
    HOME: 'home',
    COMPANY: 'company',
    WORK: 'work',
    OTHER: 'other'
};

/**
 * 逻辑运算符常量
 */
export const LogicOperator = {
    AND: 'and',
    OR: 'or',
    NOT: 'not'
};

/**
 * 联系人查找选项参数
 * @typedef {Object} ContactFindOption
 * @property {ContactFindFilter[]} [filter] - 查找时的过滤器数组
 * @property {boolean} [multiple] - 是否查找多个联系人，默认值为true
 */

/**
 * 联系人查找过滤器
 * @typedef {Object} ContactFindFilter
 * @property {string} [logic] - 匹配的逻辑，可取"and"、"or"、"not"，默认值为"and"
 * @property {string} field - 匹配的联系人域，可取联系人的属性名称
 * @property {string} value - 匹配的联系人值，可使用匹配符号"?"和"*"
 */

/**
 * 联系人域数据对象
 * @typedef {Object} ContactField
 * @property {string} type - 联系人域类型
 * @property {string} value - 联系人域值
 * @property {boolean} [preferred] - 是否为首选项
 */

/**
 * 联系人名称对象
 * @typedef {Object} ContactName
 * @property {string} [formatted] - 联系人的完整名称
 * @property {string} [familyName] - 联系人的姓
 * @property {string} [givenName] - 联系人的名
 * @property {string} [middleName] - 联系人的中间名
 * @property {string} [honorificPrefix] - 联系人的前缀（如Mr.或Dr.）
 * @property {string} [honorificSuffix] - 联系人的后缀
 */

/**
 * 联系人地址对象
 * @typedef {Object} ContactAddress
 * @property {string} [type] - 联系人地址类型
 * @property {string} [formatted] - 完整地址
 * @property {string} [streetAddress] - 完整的街道地址
 * @property {string} [locality] - 城市或地区
 * @property {string} [region] - 省或地区
 * @property {string} [country] - 国家
 * @property {string} [postalCode] - 邮政编码
 * @property {boolean} [preferred] - 是否为首选项
 */

/**
 * 联系人所属组织信息
 * @typedef {Object} ContactOrganization
 * @property {string} [type] - 联系人所属组织类型
 * @property {string} [name] - 联系人所属组织名称
 * @property {string} [department] - 联系人所属组织部门
 * @property {string} [title] - 联系人在组织中的职位
 * @property {boolean} [preferred] - 是否为首选项
 */

/**
 * 联系人对象
 * @typedef {Object} Contact
 * @property {string} [id] - 联系人的id（只读）
 * @property {string} [displayName] - 联系人显示的名字
 * @property {ContactName} [name] - 联系人的名称
 * @property {string} [nickname] - 联系人的昵称
 * @property {ContactField[]} [phoneNumbers] - 联系人的电话
 * @property {ContactField[]} [emails] - 联系人的邮箱
 * @property {ContactAddress[]} [addresses] - 联系人的地址
 * @property {ContactField[]} [ims] - 联系人的即时通讯地址
 * @property {ContactOrganization[]} [organizations] - 联系人所属组织信息
 * @property {Date} [birthday] - 联系人的生日
 * @property {string} [note] - 联系人的备注
 * @property {ContactField[]} [photos] - 联系人的头像
 * @property {ContactField[]} [categories] - 联系人的组名
 * @property {ContactField[]} [urls] - 联系人的网址
 * @property {function} clone - 克隆联系人
 * @property {function} remove - 删除联系人
 * @property {function} save - 保存联系人
 */

/**
 * 通讯录对象
 * @typedef {Object} AddressBook
 * @property {function} create - 创建联系人
 * @property {function} find - 在通讯录中查找联系人
 */

/**
 * 通讯录操作成功回调函数
 * @callback AddressBookSuccessCallback
 * @param {AddressBook} addressbook - 获取到的通讯录对象
 */

/**
 * 查找联系人操作成功回调函数
 * @callback FindSuccessCallback
 * @param {Contact[]} contacts - 数组，查找到的联系人对象
 */

/**
 * 联系人操作成功回调函数
 * @callback ContactsSuccessCallback
 */

/**
 * 联系人操作失败回调函数
 * @callback ContactsErrorCallback
 * @param {Object} error - 错误信息
 * @param {number} error.code - 错误编码
 * @param {string} error.message - 错误描述信息
 */

/**
 * Contacts模块类
 */
class ContactsModule {
    constructor() {
        this.addressBooks = new Map(); // 存储通讯录对象
    }

    /**
     * 获取通讯录对象
     * @param {number} type - 要获取的通讯录类型
     * @param {AddressBookSuccessCallback} successCB - 获取通讯录对象成功回调
     * @param {ContactsErrorCallback} [errorCB] - 获取通讯录对象失败回调
     * @returns {Promise<AddressBook>|void} 通讯录对象
     * @throws {Error} 如果获取失败
     *
     * @example
     * ```javascript
     * // Promise方式调用
     * try {
     *   const addressBook = await contacts.getAddressBook(contacts.AddressBookType.PHONE);
     *   console.log('手机通讯录获取成功');
     *   // 可以通过addressBook进行通讯录操作
     * } catch (error) {
     *   console.error('获取通讯录失败:', error);
     * }
     * ```
     */
    getAddressBook(type, successCB, errorCB) {
        // 如果只传入了type且没有successCB，支持Promise方式
        if (typeof successCB !== 'function') {
            return new Promise((resolve, reject) => {
                this.getAddressBook(type, resolve, reject);
            });
        }

        try {
            // 检查HTML5+环境是否可用
            if (typeof plus === 'undefined') {
                throw new Error('HTML5+ 环境不可用');
            }

            // 检查通讯录模块是否可用
            if (!plus.contacts) {
                throw new Error('设备不支持通讯录功能');
            }

            // 检查type参数
            if (typeof type !== 'number') {
                throw new Error('通讯录类型参数错误');
            }

            // 调用原生API
            plus.contacts.getAddressBook(type, (addressbook) => {
                const addressBookId = 'addressbook_' + type + '_' + Date.now();

                // 存储通讯录
                this.addressBooks.set(addressBookId, addressbook);

                // 添加包装方法
                this.wrapAddressBook(addressbook, addressBookId);

                if (successCB) {
                    successCB(addressbook);
                }
            }, errorCB || null);

        } catch (error) {
            if (errorCB) {
                errorCB({
                    code: -1,
                    message: error.message
                });
            } else {
                throw error;
            }
        }
    }

    /**
     * 包装通讯录对象，添加额外功能
     * @param {Object} addressBook - 通讯录对象
     * @param {string} addressBookId - 通讯录ID
     */
    wrapAddressBook(addressBook, addressBookId) {
        const originalCreate = addressBook.create;
        const originalFind = addressBook.find;

        // 包装create方法
        addressBook.create = function() {
            const contact = originalCreate.call(addressBook);

            // 添加包装方法
            this.wrapContact(contact);

            return contact;
        }.bind(this);

        // 包装find方法
        addressBook.findPromise = function(contactFields, findOptions) {
            return new Promise((resolve, reject) => {
                try {
                    originalFind.call(
                        addressBook,
                        contactFields,
                        resolve,
                        reject,
                        findOptions || {}
                    );
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 添加销毁方法
        addressBook.destroy = function() {
            try {
                // 从存储中移除
                if (this.addressBooks.has(addressBookId)) {
                    this.addressBooks.delete(addressBookId);
                }
            } catch (error) {
                console.error('销毁通讯录失败:', error);
            }
        }.bind(this);
    }

    /**
     * 包装联系人对象，添加额外功能
     * @param {Object} contact - 联系人对象
     */
    wrapContact(contact) {
        const originalSave = contact.save;
        const originalRemove = contact.remove;
        const originalClone = contact.clone;

        // 包装save方法
        contact.savePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalSave.call(contact, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装remove方法
        contact.removePromise = function() {
            return new Promise((resolve, reject) => {
                try {
                    originalRemove.call(contact, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
        };

        // 包装clone方法
        contact.clone = function() {
            const newContact = originalClone.call(contact);
            this.wrapContact(newContact);
            return newContact;
        }.bind(this);
    }

    /**
     * 判断设备是否支持通讯录功能
     * @returns {Promise<boolean>} 返回是否支持的Promise
     *
     * @example
     * ```javascript
     * const isSupported = await contacts.isSupported();
     * if (isSupported) {
     *   console.log('设备支持通讯录功能');
     * } else {
     *   console.log('设备不支持通讯录功能');
     * }
     * ```
     */
    isSupported() {
        return new Promise((resolve) => {
            try {
                if (typeof plus === 'undefined') {
                    resolve(false);
                    return;
                }

                resolve(!!plus.contacts);
            } catch (error) {
                resolve(false);
            }
        });
    }

    /**
     * 创建联系人域数据对象
     * @param {string} type - 联系人域类型
     * @param {string} value - 联系人域值
     * @param {boolean} [preferred] - 是否为首选项
     * @returns {ContactField} 联系人域数据对象
     *
     * @example
     * ```javascript
     * const phoneField = contacts.createContactField(
     *   contacts.ContactFieldType.MOBILE,
     *   '13800138000',
     *   true
     * );
     * ```
     */
    createContactField(type, value, preferred) {
        return {
            type: type || ContactFieldType.OTHER,
            value: value || '',
            preferred: !!preferred
        };
    }

    /**
     * 创建联系人名称对象
     * @param {Object} options - 名称选项
     * @param {string} [options.familyName] - 姓
     * @param {string} [options.givenName] - 名
     * @param {string} [options.middleName] - 中间名
     * @param {string} [options.honorificPrefix] - 前缀
     * @param {string} [options.honorificSuffix] - 后缀
     * @returns {ContactName} 联系人名称对象
     *
     * @example
     * ```javascript
     * const name = contacts.createContactName({
     *   familyName: '张',
     *   givenName: '三'
     * });
     * ```
     */
    createContactName(options) {
        const name = {};

        if (options && typeof options === 'object') {
            if (options.familyName) name.familyName = options.familyName;
            if (options.givenName) name.givenName = options.givenName;
            if (options.middleName) name.middleName = options.middleName;
            if (options.honorificPrefix) name.honorificPrefix = options.honorificPrefix;
            if (options.honorificSuffix) name.honorificSuffix = options.honorificSuffix;
        }

        return name;
    }

    /**
     * 创建联系人地址对象
     * @param {Object} options - 地址选项
     * @param {string} [options.type] - 地址类型
     * @param {string} [options.streetAddress] - 街道地址
     * @param {string} [options.locality] - 城市
     * @param {string} [options.region] - 省份
     * @param {string} [options.country] - 国家
     * @param {string} [options.postalCode] - 邮政编码
     * @param {boolean} [options.preferred] - 是否为首选项
     * @returns {ContactAddress} 联系人地址对象
     *
     * @example
     * ```javascript
     * const address = contacts.createContactAddress({
     *   type: contacts.AddressType.HOME,
     *   streetAddress: '人民路1号',
     *   locality: '北京',
     *   region: '北京市'
     * });
     * ```
     */
    createContactAddress(options) {
        const address = {};

        if (options && typeof options === 'object') {
            if (options.type) address.type = options.type;
            if (options.streetAddress) address.streetAddress = options.streetAddress;
            if (options.locality) address.locality = options.locality;
            if (options.region) address.region = options.region;
            if (options.country) address.country = options.country;
            if (options.postalCode) address.postalCode = options.postalCode;
            if (typeof options.preferred === 'boolean') address.preferred = options.preferred;
        }

        return address;
    }

    /**
     * 创建联系人所属组织信息
     * @param {Object} options - 组织信息选项
     * @param {string} [options.type] - 组织类型
     * @param {string} [options.name] - 组织名称
     * @param {string} [options.department] - 部门
     * @param {string} [options.title] - 职位
     * @param {boolean} [options.preferred] - 是否为首选项
     * @returns {ContactOrganization} 联系人所属组织信息
     *
     * @example
     * ```javascript
     * const organization = contacts.createContactOrganization({
     *   type: 'company',
     *   name: '某某公司',
     *   department: '技术部',
     *   title: '工程师'
     * });
     * ```
     */
    createContactOrganization(options) {
        const organization = {};

        if (options && typeof options === 'object') {
            if (options.type) organization.type = options.type;
            if (options.name) organization.name = options.name;
            if (options.department) organization.department = options.department;
            if (options.title) organization.title = options.title;
            if (typeof options.preferred === 'boolean') organization.preferred = options.preferred;
        }

        return organization;
    }

    /**
     * 创建联系人查找过滤器
     * @param {string} field - 匹配的联系人域
     * @param {string} value - 匹配的联系人值
     * @param {string} [logic] - 匹配的逻辑
     * @returns {ContactFindFilter} 联系人查找过滤器
     *
     * @example
     * ```javascript
     * const filter = contacts.createContactFindFilter(
     *   'displayName',
     *   '*张*',
     *   contacts.LogicOperator.OR
     * );
     * ```
     */
    createContactFindFilter(field, value, logic) {
        return {
            logic: logic || LogicOperator.AND,
            field: field,
            value: value
        };
    }

    /**
     * 获取当前活跃的通讯录信息
     * @returns {Array<Object>} 活跃通讯录信息数组
     *
     * @example
     * ```javascript
     * const activeAddressBooks = contacts.getActiveAddressBooks();
     * console.log('活跃通讯录数量:', activeAddressBooks.length);
     * ```
     */
    getActiveAddressBooks() {
        const addressBooks = [];
        this.addressBooks.forEach((addressBook, addressBookId) => {
            addressBooks.push({
                addressBookId: addressBookId
            });
        });
        return addressBooks;
    }

    /**
     * 关闭所有活跃的通讯录
     * @returns {Promise<void>}
     *
     * @example
     * ```javascript
     * await contacts.closeAllAddressBooks();
     * console.log('所有通讯录已关闭');
     * ```
     */
    closeAllAddressBooks() {
        return new Promise((resolve, reject) => {
            try {
                this.addressBooks.clear();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取通讯录类型名称
     * @param {number} type - 通讯录类型常量
     * @returns {string} 通讯录类型名称
     *
     * @example
     * ```javascript
     * const typeName = contacts.getAddressBookTypeName(contacts.AddressBookType.PHONE);
     * console.log('通讯录类型:', typeName); // 输出: 手机通讯录
     * ```
     */
    getAddressBookTypeName(type) {
        const typeNames = {
            [AddressBookType.PHONE]: '手机通讯录',
            [AddressBookType.SIM]: 'SIM卡通讯录'
        };

        return typeNames[type] || '未知类型';
    }

    /**
     * 获取联系人域类型名称
     * @param {string} type - 联系人域类型常量
     * @returns {string} 联系人域类型名称
     *
     * @example
     * ```javascript
     * const typeName = contacts.getContactFieldTypeName(contacts.ContactFieldType.MOBILE);
     * console.log('联系人域类型:', typeName); // 输出: 手机
     * ```
     */
    getContactFieldTypeName(type) {
        const typeNames = {
            [ContactFieldType.PHONE]: '电话',
            [ContactFieldType.HOME]: '家庭',
            [ContactFieldType.COMPANY]: '公司',
            [ContactFieldType.MOBILE]: '手机',
            [ContactFieldType.WORK]: '工作',
            [ContactFieldType.PERSONAL]: '个人',
            [ContactFieldType.OTHER]: '其他'
        };

        return typeNames[type] || '未知类型';
    }
}

// 创建Contacts模块实例
const contacts = new ContactsModule();

// 导出模块
export default contacts;

// 导出常量
export { AddressBookType, ContactFieldType, AddressType, LogicOperator };

// 也可以导出类以便创建多个实例
export { ContactsModule };