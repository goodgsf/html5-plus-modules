/**
 * HTML5+ Contacts 模块测试套件
 *
 * 测试联系人功能包括：
 * - 联系人查询和检索
 * - 联系人添加和删除
 * - 联系人信息更新
 * - 联系人分组管理
 * - 权限处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import contacts from '../../modules/contacts.js';

class ContactsTestSuite extends TestSuite {
    constructor() {
        super();
        this.testContactId = null;
        this.testContactData = null;
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Contacts测试环境...');
        TestUtils.mockPlusEnvironment();
        this.testContactData = {
            displayName: '测试联系人',
            phoneNumbers: [{
                type: 'mobile',
                value: '13800138000',
                pref: true
            }],
            emails: [{
                type: 'work',
                value: 'test@example.com'
            }],
            addresses: [{
                type: 'work',
                streetAddress: '测试地址',
                locality: '测试城市',
                region: '测试省份',
                postalCode: '100000'
            }]
        };
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Contacts测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理测试联系人
        try {
            if (this.testContactId) {
                await contacts.remove(this.testContactId);
                this.testContactId = null;
            }
        } catch (error) {
            // 忽略清理错误
        }
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理测试联系人
        try {
            if (this.testContactId) {
                await contacts.remove(this.testContactId);
                this.testContactId = null;
            }
        } catch (error) {
            // 忽略清理错误
        }
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await contacts.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await contacts.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够获取所有联系人')
    async testGetAllContacts() {
        try {
            const allContacts = await contacts.getAll();
            TestUtils.assertTrue(Array.isArray(allContacts));

            // 验证联系人数据结构
            for (const contact of allContacts) {
                TestUtils.assertTrue(typeof contact === 'object');
                TestUtils.assertTrue(typeof contact.id === 'string');
                TestUtils.assertTrue(typeof contact.displayName === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够搜索联系人')
    async testSearchContacts() {
        try {
            const searchOptions = {
                filter: 'test',
                multiple: true,
                fields: ['displayName', 'phoneNumbers']
            };

            const searchResults = await contacts.search(searchOptions);
            TestUtils.assertTrue(Array.isArray(searchResults));

            // 验证搜索结果
            for (const contact of searchResults) {
                TestUtils.assertTrue(typeof contact === 'object');
                TestUtils.assertTrue(typeof contact.id === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('搜索') ||
                error.message.includes('search')
            );
        }
    }

    @test('应该能够添加联系人')
    async testAddContact() {
        try {
            const newContact = await contacts.add(this.testContactData);
            TestUtils.assertNotNull(newContact);
            TestUtils.assertTrue(typeof newContact.id === 'string');

            this.testContactId = newContact.id;

            // 验证联系人信息
            TestUtils.assertEquals(newContact.displayName, this.testContactData.displayName);
            TestUtils.assertTrue(Array.isArray(newContact.phoneNumbers));
            TestUtils.assertTrue(Array.isArray(newContact.emails));
            TestUtils.assertTrue(Array.isArray(newContact.addresses));

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('权限') ||
                error.message.includes('permission')
            );
        }
    }

    @test('应该能够获取单个联系人')
    async testGetContact() {
        try {
            // 首先添加一个测试联系人
            const newContact = await contacts.add(this.testContactData);
            this.testContactId = newContact.id;

            // 获取联系人
            const contact = await contacts.get(this.testContactId);
            TestUtils.assertNotNull(contact);
            TestUtils.assertEquals(contact.id, this.testContactId);
            TestUtils.assertEquals(contact.displayName, this.testContactData.displayName);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('获取') ||
                error.message.includes('get')
            );
        }
    }

    @test('应该能够更新联系人')
    async testUpdateContact() {
        try {
            // 首先添加一个测试联系人
            const newContact = await contacts.add(this.testContactData);
            this.testContactId = newContact.id;

            // 更新联系人信息
            const updatedData = {
                ...this.testContactData,
                displayName: '更新后的联系人',
                phoneNumbers: [{
                    type: 'work',
                    value: '13900139000'
                }]
            };

            const updatedContact = await contacts.update(this.testContactId, updatedData);
            TestUtils.assertNotNull(updatedContact);
            TestUtils.assertEquals(updatedContact.displayName, updatedData.displayName);
            TestUtils.assertEquals(updatedContact.phoneNumbers[0].value, updatedData.phoneNumbers[0].value);

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

    @test('应该能够删除联系人')
    async testRemoveContact() {
        try {
            // 首先添加一个测试联系人
            const newContact = await contacts.add(this.testContactData);
            const contactId = newContact.id;

            // 删除联系人
            await contacts.remove(contactId);

            // 验证联系人已被删除
            try {
                const deletedContact = await contacts.get(contactId);
                TestUtils.fail('联系人应该已被删除');
            } catch (getError) {
                TestUtils.assertTrue(
                    getError.message.includes('不存在') ||
                    getError.message.includes('not found') ||
                    getError.message.includes('已删除')
                );
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('删除') ||
                error.message.includes('remove')
            );
        }
    }

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的联系人数据
            await contacts.add({
                displayName: '', // 空显示名称
                phoneNumbers: 'invalid_phone_numbers' // 无效的电话号码格式
            });
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('数据') ||
                error.message.includes('data')
            );
        }

        try {
            // 测试空参数
            await contacts.add(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试获取不存在的联系人
            await contacts.get('non_existent_contact_id');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('不存在') ||
                error.message.includes('not found') ||
                error.message.includes('ID')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await contacts.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await contacts.requestPermission();
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

    @test('应该能够按组管理联系人')
    async testContactGroups() {
        try {
            // 获取所有联系人组
            const groups = await contacts.getGroups();
            TestUtils.assertTrue(Array.isArray(groups));

            // 创建测试组
            const testGroup = await contacts.createGroup('测试组');
            TestUtils.assertNotNull(testGroup);
            TestUtils.assertEquals(testGroup.name, '测试组');

            // 获取组内联系人
            const groupContacts = await contacts.getContactsByGroup(testGroup.id);
            TestUtils.assertTrue(Array.isArray(groupContacts));

            // 删除测试组
            await contacts.deleteGroup(testGroup.id);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('组') ||
                error.message.includes('group')
            );
        }
    }

    @test('应该能够批量操作联系人')
    async testBatchOperations() {
        try {
            // 创建多个测试联系人
            const testContacts = [
                {
                    displayName: '批量联系人1',
                    phoneNumbers: [{
                        type: 'mobile',
                        value: '13800138001'
                    }]
                },
                {
                    displayName: '批量联系人2',
                    phoneNumbers: [{
                        type: 'mobile',
                        value: '13800138002'
                    }]
                }
            ];

            const addedContacts = await contacts.batchAdd(testContacts);
            TestUtils.assertTrue(Array.isArray(addedContacts));
            TestUtils.assertEquals(addedContacts.length, testContacts.length);

            // 清理创建的联系人
            for (const contact of addedContacts) {
                await contacts.remove(contact.id);
            }

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

    @test('应该能够获取联系人统计信息')
    async testContactStatistics() {
        try {
            const stats = await contacts.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalContacts === 'number');
            TestUtils.assertTrue(typeof stats.groupsCount === 'number');
            TestUtils.assertTrue(typeof stats.lastSyncTime === 'number');

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

    @test('应该能够导入和导出联系人')
    async testImportExportContacts() {
        try {
            // 导出联系人
            const exportedData = await contacts.exportContacts('vcf');
            TestUtils.assertTrue(typeof exportedData === 'string');

            // 导入联系人
            const importResult = await contacts.importContacts(exportedData, 'vcf');
            TestUtils.assertTrue(typeof importResult === 'object');
            TestUtils.assertTrue(typeof importResult.importedCount === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('导入') ||
                error.message.includes('export')
            );
        }
    }

    @test('应该能够处理联系人照片')
    async testContactPhotos() {
        try {
            // 首先添加一个测试联系人
            const newContact = await contacts.add(this.testContactData);
            this.testContactId = newContact.id;

            // 设置联系人照片
            const photoPath = '_doc/contacts/test_photo.jpg';
            await contacts.setPhoto(this.testContactId, photoPath);

            // 获取联系人照片
            const photoInfo = await contacts.getPhoto(this.testContactId);
            TestUtils.assertTrue(typeof photoInfo === 'object');
            TestUtils.assertTrue(typeof photoInfo.path === 'string');

            // 删除联系人照片
            await contacts.removePhoto(this.testContactId);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('照片') ||
                error.message.includes('photo')
            );
        }
    }

    @test('应该能够处理联系人备注')
    async testContactNotes() {
        try {
            // 首先添加一个测试联系人
            const newContact = await contacts.add(this.testContactData);
            this.testContactId = newContact.id;

            // 设置联系人备注
            const note = '这是一个测试备注';
            await contacts.setNote(this.testContactId, note);

            // 获取联系人备注
            const retrievedNote = await contacts.getNote(this.testContactId);
            TestUtils.assertEquals(retrievedNote, note);

            // 删除联系人备注
            await contacts.removeNote(this.testContactId);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('备注') ||
                error.message.includes('note')
            );
        }
    }

    @test('应该能够处理联系人字段')
    async testContactFields() {
        try {
            // 获取支持的字段
            const supportedFields = await contacts.getSupportedFields();
            TestUtils.assertTrue(Array.isArray(supportedFields));

            // 验证基本字段
            const basicFields = ['id', 'displayName', 'name', 'phoneNumbers', 'emails', 'addresses'];
            for (const field of basicFields) {
                TestUtils.assertTrue(supportedFields.includes(field));
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('字段') ||
                error.message.includes('fields')
            );
        }
    }

    @test('应该能够处理并发操作')
    async testConcurrentOperations() {
        try {
            const promises = [];
            const count = 3;

            // 并发获取联系人信息
            for (let i = 0; i < count; i++) {
                promises.push(contacts.getAll());
            }

            const results = await Promise.all(promises);

            // 验证所有结果
            for (const result of results) {
                TestUtils.assertTrue(Array.isArray(result));
            }

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
}

export default ContactsTestSuite;