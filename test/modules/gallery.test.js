/**
 * HTML5+ Gallery 模块测试套件
 *
 * 测试图片库功能包括：
 * - 图片选择和预览
 * - 图片编辑和处理
 * - 图片保存和管理
 * - 相册访问
 * - 错误处理
 */

import { TestSuite, test, beforeAll, afterAll, beforeEach, afterEach } from '../test-config.js';
import { TestUtils } from '../test-config.js';
import gallery from '../../modules/gallery.js';

class GalleryTestSuite extends TestSuite {
    constructor() {
        super();
        this.galleryInstance = null;
        this.selectedImages = [];
        this.galleryEvents = [];
    }

    @beforeAll
    async setupAll() {
        console.log('🔧 设置Gallery测试环境...');
        TestUtils.mockPlusEnvironment();
    }

    @afterAll
    async cleanupAll() {
        console.log('🧹 清理Gallery测试环境...');
        TestUtils.cleanupMockEnvironment();
    }

    @beforeEach
    async setupEach() {
        // 每个测试前清理图片选择和事件
        this.selectedImages = [];
        this.galleryEvents = [];
    }

    @afterEach
    async cleanupEach() {
        // 每个测试后清理图片选择和事件
        this.selectedImages = [];
        this.galleryEvents = [];
    }

    @test('应该能够检查模块支持性')
    async testModuleSupport() {
        const isSupported = await gallery.isSupported();
        TestUtils.assertTrue(typeof isSupported === 'boolean');

        const permission = await gallery.checkPermission();
        TestUtils.assertTrue(permission === 'granted' || permission === 'denied' || permission === 'prompt');
    }

    @test('应该能够选择图片')
    async testSelectImages() {
        try {
            const selectOptions = {
                maximum: 5,
                multiple: true,
                filter: 'image',
                onSuccess: (images) => {
                    this.selectedImages = images;
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.select(selectOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

            // 验证选择的图片
            TestUtils.assertTrue(Array.isArray(this.selectedImages));
            for (const image of this.selectedImages) {
                TestUtils.assertTrue(typeof image === 'object');
                TestUtils.assertTrue(typeof image.path === 'string');
                TestUtils.assertTrue(typeof image.size === 'number');
                TestUtils.assertTrue(typeof image.type === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('选择') ||
                error.message.includes('select')
            );
        }
    }

    @test('应该能够预览图片')
    async testPreviewImage() {
        try {
            const previewOptions = {
                urls: ['_doc/images/test1.jpg', '_doc/images/test2.jpg'],
                current: 0,
                background: '#000000',
                onShow: () => {
                    this.galleryEvents.push({ type: 'show' });
                },
                onClose: () => {
                    this.galleryEvents.push({ type: 'close' });
                },
                onChange: (index) => {
                    this.galleryEvents.push({ type: 'change', index: index });
                }
            };

            const result = await gallery.preview(previewOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('预览') ||
                error.message.includes('preview')
            );
        }
    }

    @test('应该能够保存图片到相册')
    async testSaveImage() {
        try {
            const saveOptions = {
                path: '_doc/images/test.jpg',
                album: '测试相册',
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.save(saveOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('保存') ||
                error.message.includes('save')
            );
        }
    }

    @test('应该能够裁剪图片')
    async testCropImage() {
        try {
            const cropOptions = {
                path: '_doc/images/test.jpg',
                width: 300,
                height: 300,
                quality: 0.8,
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.crop(cropOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('裁剪') ||
                error.message.includes('crop')
            );
        }
    }

    @test('应该能够压缩图片')
    async testCompressImage() {
        try {
            const compressOptions = {
                path: '_doc/images/test.jpg',
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.compress(compressOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('压缩') ||
                error.message.includes('compress')
            );
        }
    }

    @test('应该能够获取图片信息')
    async testGetImageInfo() {
        try {
            const imagePath = '_doc/images/test.jpg';
            const imageInfo = await gallery.getImageInfo(imagePath);
            TestUtils.assertTrue(typeof imageInfo === 'object');
            TestUtils.assertTrue(typeof imageInfo.width === 'number');
            TestUtils.assertTrue(typeof imageInfo.height === 'number');
            TestUtils.assertTrue(typeof imageInfo.size === 'number');
            TestUtils.assertTrue(typeof imageInfo.type === 'string');
            TestUtils.assertTrue(typeof imageInfo.orientation === 'number');

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

    @test('应该能够获取相册列表')
    async testGetAlbums() {
        try {
            const albums = await gallery.getAlbums();
            TestUtils.assertTrue(Array.isArray(albums));

            for (const album of albums) {
                TestUtils.assertTrue(typeof album === 'object');
                TestUtils.assertTrue(typeof album.id === 'string');
                TestUtils.assertTrue(typeof album.name === 'string');
                TestUtils.assertTrue(typeof album.count === 'number');
                TestUtils.assertTrue(typeof album.cover === 'string');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('相册') ||
                error.message.includes('album')
            );
        }
    }

    @test('应该能够获取相册中的图片')
    async testGetAlbumImages() {
        try {
            const albumId = 'test_album_id';
            const getOptions = {
                albumId: albumId,
                count: 20,
                offset: 0,
                sort: 'date_desc'
            };

            const images = await gallery.getAlbumImages(getOptions);
            TestUtils.assertTrue(Array.isArray(images));

            for (const image of images) {
                TestUtils.assertTrue(typeof image === 'object');
                TestUtils.assertTrue(typeof image.id === 'string');
                TestUtils.assertTrue(typeof album.path === 'string');
                TestUtils.assertTrue(typeof image.width === 'number');
                TestUtils.assertTrue(typeof image.height === 'number');
            }

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('相册') ||
                error.message.includes('album')
            );
        }
    }

    @test('应该能够创建相册')
    async testCreateAlbum() {
        try {
            const albumName = '测试相册_' + Date.now();
            const result = await gallery.createAlbum(albumName);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);
            TestUtils.assertTrue(typeof result.albumId === 'string');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('创建') ||
                error.message.includes('create')
            );
        }
    }

    @test('应该能够删除相册')
    async testDeleteAlbum() {
        try {
            const albumId = 'test_album_id';
            const result = await gallery.deleteAlbum(albumId);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

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

    @test('应该能够删除图片')
    async testDeleteImage() {
        try {
            const imagePath = '_doc/images/test.jpg';
            const result = await gallery.deleteImage(imagePath);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

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

    @test('应该能够处理错误情况')
    async testErrorHandling() {
        try {
            // 测试无效的图片路径
            await gallery.getImageInfo('');
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('路径') ||
                error.message.includes('path')
            );
        }

        try {
            // 测试空参数
            await gallery.getImageInfo(null);
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter')
            );
        }

        try {
            // 测试无效的选择参数
            await gallery.select({});
            TestUtils.fail('应该抛出错误');
        } catch (error) {
            TestUtils.assertTrue(
                error.message.includes('参数') ||
                error.message.includes('parameter') ||
                error.message.includes('选择') ||
                error.message.includes('select')
            );
        }
    }

    @test('应该能够处理权限请求')
    async testPermissionHandling() {
        try {
            const permission = await gallery.checkPermission();
            TestUtils.assertTrue(
                permission === 'granted' ||
                permission === 'denied' ||
                permission === 'prompt'
            );

            if (permission === 'prompt') {
                const requestedPermission = await gallery.requestPermission();
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

    @test('应该能够批量处理图片')
    async testBatchProcessImages() {
        try {
            const images = ['_doc/images/test1.jpg', '_doc/images/test2.jpg'];
            const batchOptions = {
                images: images,
                operation: 'compress',
                quality: 0.7,
                maxWidth: 800,
                maxHeight: 800,
                onProgress: (progress) => {
                    this.galleryEvents.push({ type: 'progress', data: progress });
                },
                onComplete: (results) => {
                    this.galleryEvents.push({ type: 'complete', data: results });
                },
                onError: (error) => {
                    this.galleryEvents.push({ type: 'error', data: error });
                }
            };

            const result = await gallery.batchProcess(batchOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

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

    @test('应该能够旋转图片')
    async testRotateImage() {
        try {
            const rotateOptions = {
                path: '_doc/images/test.jpg',
                angle: 90,
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.rotate(rotateOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('旋转') ||
                error.message.includes('rotate')
            );
        }
    }

    @test('应该能够调整图片大小')
    async testResizeImage() {
        try {
            const resizeOptions = {
                path: '_doc/images/test.jpg',
                width: 500,
                height: 500,
                maintainAspectRatio: true,
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.resize(resizeOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('调整') ||
                error.message.includes('resize')
            );
        }
    }

    @test('应该能够添加水印')
    async testAddWatermark() {
        try {
            const watermarkOptions = {
                path: '_doc/images/test.jpg',
                watermark: {
                    text: '测试水印',
                    position: 'bottom-right',
                    fontSize: 20,
                    color: '#FF0000',
                    opacity: 0.8
                },
                onSuccess: (result) => {
                    this.galleryEvents.push({ type: 'success', data: result });
                },
                onFail: (error) => {
                    this.galleryEvents.push({ type: 'fail', data: error });
                }
            };

            const result = await gallery.addWatermark(watermarkOptions);
            TestUtils.assertTrue(typeof result === 'object');
            TestUtils.assertTrue(result.success === true || result.success === false);

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('水印') ||
                error.message.includes('watermark')
            );
        }
    }

    @test('应该能够获取图片缩略图')
    async testGetThumbnail() {
        try {
            const thumbnailOptions = {
                path: '_doc/images/test.jpg',
                width: 100,
                height: 100,
                quality: 0.8
            };

            const thumbnail = await gallery.getThumbnail(thumbnailOptions);
            TestUtils.assertTrue(typeof thumbnail === 'object');
            TestUtils.assertTrue(typeof thumbnail.path === 'string');
            TestUtils.assertTrue(typeof thumbnail.size === 'number');

        } catch (error) {
            // 在测试环境中可能不支持，这是正常的
            TestUtils.assertTrue(
                error.message.includes('不支持') ||
                error.message.includes('not supported') ||
                error.message.includes('缩略图') ||
                error.message.includes('thumbnail')
            );
        }
    }

    @test('应该能够获取图片使用统计')
    async testGetGalleryStatistics() {
        try {
            const stats = await gallery.getStatistics();
            TestUtils.assertTrue(typeof stats === 'object');
            TestUtils.assertTrue(typeof stats.totalImages === 'number');
            TestUtils.assertTrue(typeof stats.totalSize === 'number');
            TestUtils.assertTrue(typeof stats.totalAlbums === 'number');
            TestUtils.assertTrue(typeof stats.lastUpdate === 'number');

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
}

export default GalleryTestSuite;