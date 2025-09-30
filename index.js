// HTML5+ 模块集合入口文件

// 导入各个模块
import accelerometer from './modules/accelerometer.js';
import ad from './modules/ad.js';
import audio, { AudioRoute } from './modules/audio.js';
import barcode, { BarcodeType } from './modules/barcode.js';
import bluetooth from './modules/bluetooth.js';
import camera, { CameraType, ImageFormat, VideoFormat } from './modules/camera.js';
import contacts, { AddressBookType, ContactFieldType, AddressType, LogicOperator } from './modules/contacts.js';
import device, { ConnectionType, ScreenOrientation } from './modules/device.js';
import downloader, { DownloadEventType, DownloadState } from './modules/downloader.js';
import events, { EventType, NetworkType } from './modules/events.js';
import fingerprint, { FingerprintErrorCode } from './modules/fingerprint.js';
import gallery, { GalleryFilter } from './modules/gallery.js';
import geolocation, { GeolocationErrorCode, CoordinatesType, GeolocationProvider } from './modules/geolocation.js';
import ibeacon, { IBeaconErrorCode } from './modules/ibeacon.js';
import io, { FileSystemType, URLType, IOErrorCode } from './modules/io.js';
import key, { KeyType, KeyErrorCode, AssistantType } from './modules/key.js';
import maps, { MapType, SearchPolicy, MapsErrorCode, CoordinateSystem } from './modules/maps.js';
import messaging, { MessageType, BodyType, MessagingErrorCode } from './modules/messaging.js';
import nativeObj, { Bitmap, View, ImageSlider, NativeObjErrorCode, ImageMode, TextAlign, TextOverflow } from './modules/nativeObj.js';
import nativeUI, { NativeUIErrorCode } from './modules/nativeUI.js';
import navigator from './modules/navigator.js';
import net, { XMLHttpRequest, ReadyState, ResponseType } from './modules/net.js';
import oauth, { AuthServiceProvider, AuthErrorCode } from './modules/oauth.js';
import orientation, { OrientationErrorCode } from './modules/orientation.js';
import payment, { PaymentChannelId, PaymentErrorCode, GooglePayEnvironment, GooglePayPaymentMethod, GooglePayCardNetwork, GooglePayAuthMethod, GooglePayAddressFormat, IAPTransactionState } from './modules/payment.js';
import proximity, { ProximityErrorCode } from './modules/proximity.js';
import push, { PushErrorCode, PushEventType } from './modules/push.js';
import runtime, { RuntimeErrorCode } from './modules/runtime.js';
import share, { ShareErrorCode, ShareServerIdentity, ShareMessageType, WeixinScene, ShareInterface, MiniProgramType } from './modules/share.js';
import speech, { SpeechErrorCode } from './modules/speech.js';
import sqlite, { SQLiteErrorCode } from './modules/sqlite.js';
import statistic, { StatisticErrorCode } from './modules/statistic.js';
import storage, { StorageErrorCode } from './modules/storage.js';
import uploader, { UploaderErrorCode, UploadEventType, UploadState } from './modules/uploader.js';
import video, { VideoPlayerErrorCode, LivePusherErrorCode, VideoPlayer, LivePusher } from './modules/video.js';
import webView, { WebViewErrorCode, WebViewObject } from './modules/webview.js';
import zip, { ZipErrorCode } from './modules/zip.js';

// 导出模块
export { accelerometer, ad, audio, barcode, bluetooth, camera, contacts, device, downloader, events, fingerprint, gallery, geolocation, ibeacon, io, key, maps, messaging, nativeObj, nativeUI, navigator, net, oauth, orientation, payment, proximity, push, runtime, share, speech, sqlite, statistic, storage, uploader, video, webView, zip, AudioRoute, BarcodeType, CameraType, ImageFormat, VideoFormat, AddressBookType, ContactFieldType, AddressType, LogicOperator, ConnectionType, ScreenOrientation, DownloadEventType, DownloadState, EventType, NetworkType, FingerprintErrorCode, GalleryFilter, GeolocationErrorCode, CoordinatesType, GeolocationProvider, IBeaconErrorCode, FileSystemType, URLType, IOErrorCode, KeyType, KeyErrorCode, AssistantType, MapType, SearchPolicy, MapsErrorCode, CoordinateSystem, MessageType, BodyType, MessagingErrorCode, Bitmap, View, ImageSlider, NativeObjErrorCode, ImageMode, TextAlign, TextOverflow, NativeUIErrorCode, ReadyState, ResponseType, XMLHttpRequest, AuthServiceProvider, AuthErrorCode, OrientationErrorCode, PaymentChannelId, PaymentErrorCode, GooglePayEnvironment, GooglePayPaymentMethod, GooglePayCardNetwork, GooglePayAuthMethod, GooglePayAddressFormat, IAPTransactionState, ProximityErrorCode, PushErrorCode, PushEventType, RuntimeErrorCode, ShareErrorCode, ShareServerIdentity, ShareMessageType, WeixinScene, ShareInterface, MiniProgramType, SpeechErrorCode, SQLiteErrorCode, StatisticErrorCode, StorageErrorCode, UploaderErrorCode, UploadEventType, UploadState, VideoPlayerErrorCode, LivePusherErrorCode, VideoPlayer, LivePusher, WebViewErrorCode, WebViewObject, ZipErrorCode };

// 也可以通过命名空间导出
export default {
  accelerometer,
  ad,
  audio,
  barcode,
  bluetooth,
  camera,
  contacts,
  device,
  downloader,
  events,
  fingerprint,
  gallery,
  geolocation,
  ibeacon,
  io,
  key,
  maps,
  messaging,
  nativeObj,
  nativeUI,
  navigator,
  net,
  oauth,
  orientation,
  payment,
  proximity,
  push,
  runtime,
  share,
  speech,
  sqlite,
  statistic,
  storage,
  uploader,
  video,
  webView,
  zip,
  AudioRoute,
  BarcodeType,
  CameraType,
  ImageFormat,
  VideoFormat,
  AddressBookType,
  ContactFieldType,
  AddressType,
  LogicOperator,
  ConnectionType,
  ScreenOrientation,
  DownloadEventType,
  DownloadState,
  EventType,
  NetworkType,
  FingerprintErrorCode,
  GalleryFilter,
  GeolocationErrorCode,
  CoordinatesType,
  GeolocationProvider,
  IBeaconErrorCode,
  FileSystemType,
  URLType,
  IOErrorCode,
  KeyType,
  KeyErrorCode,
  AssistantType,
  MapType,
  SearchPolicy,
  MapsErrorCode,
  CoordinateSystem,
  MessageType,
  BodyType,
  MessagingErrorCode,
  Bitmap,
  View,
  ImageSlider,
  NativeObjErrorCode,
  ImageMode,
  TextAlign,
  TextOverflow,
  NativeUIErrorCode,
  ReadyState,
  ResponseType,
  XMLHttpRequest,
  AuthServiceProvider,
  AuthErrorCode,
  OrientationErrorCode,
  PaymentChannelId,
  PaymentErrorCode,
  GooglePayEnvironment,
  GooglePayPaymentMethod,
  GooglePayCardNetwork,
  GooglePayAuthMethod,
  GooglePayAddressFormat,
  IAPTransactionState,
  ProximityErrorCode,
  PushErrorCode,
  PushEventType,
  RuntimeErrorCode,
  ShareErrorCode,
  ShareServerIdentity,
  ShareMessageType,
  WeixinScene,
  ShareInterface,
  MiniProgramType,
  SpeechErrorCode,
  SQLiteErrorCode,
  StatisticErrorCode,
  StorageErrorCode,
  UploaderErrorCode,
  UploadEventType,
  UploadState,
  VideoPlayerErrorCode,
  LivePusherErrorCode,
  VideoPlayer,
  LivePusher,
  WebViewErrorCode,
  WebViewObject,
  ZipErrorCode
};

// 为了方便使用，也提供具名导出
export { default as accelerometer } from './modules/accelerometer.js';
export { default as ad } from './modules/ad.js';
export { default as audio } from './modules/audio.js';
export { AudioRoute } from './modules/audio.js';
export { default as barcode } from './modules/barcode.js';
export { BarcodeType } from './modules/barcode.js';
export { default as bluetooth } from './modules/bluetooth.js';
export { default as camera } from './modules/camera.js';
export { CameraType, ImageFormat, VideoFormat } from './modules/camera.js';
export { default as contacts } from './modules/contacts.js';
export { AddressBookType, ContactFieldType, AddressType, LogicOperator } from './modules/contacts.js';
export { default as device } from './modules/device.js';
export { ConnectionType, ScreenOrientation } from './modules/device.js';
export { default as downloader } from './modules/downloader.js';
export { DownloadEventType, DownloadState } from './modules/downloader.js';
export { default as events } from './modules/events.js';
export { EventType, NetworkType } from './modules/events.js';
export { default as fingerprint } from './modules/fingerprint.js';
export { FingerprintErrorCode } from './modules/fingerprint.js';
export { default as gallery } from './modules/gallery.js';
export { GalleryFilter } from './modules/gallery.js';
export { default as geolocation } from './modules/geolocation.js';
export { GeolocationErrorCode, CoordinatesType, GeolocationProvider } from './modules/geolocation.js';
export { default as ibeacon } from './modules/ibeacon.js';
export { IBeaconErrorCode } from './modules/ibeacon.js';
export { default as io } from './modules/io.js';
export { FileSystemType, URLType, IOErrorCode } from './modules/io.js';
export { default as key } from './modules/key.js';
export { KeyType, KeyErrorCode, AssistantType } from './modules/key.js';
export { default as maps } from './modules/maps.js';
export { MapType, SearchPolicy, MapsErrorCode, CoordinateSystem } from './modules/maps.js';
export { default as messaging } from './modules/messaging.js';
export { MessageType, BodyType, MessagingErrorCode } from './modules/messaging.js';
export { default as nativeObj } from './modules/nativeObj.js';
export { Bitmap, View, ImageSlider, NativeObjErrorCode, ImageMode, TextAlign, TextOverflow } from './modules/nativeObj.js';
export { default as nativeUI } from './modules/nativeUI.js';
export { NativeUIErrorCode } from './modules/nativeUI.js';
export { default as navigator } from './modules/navigator.js';
export { default as net } from './modules/net.js';
export { ReadyState, ResponseType, XMLHttpRequest } from './modules/net.js';
export { default as oauth } from './modules/oauth.js';
export { AuthServiceProvider, AuthErrorCode } from './modules/oauth.js';
export { default as orientation } from './modules/orientation.js';
export { OrientationErrorCode } from './modules/orientation.js';
export { default as payment } from './modules/payment.js';
export { PaymentChannelId, PaymentErrorCode, GooglePayEnvironment, GooglePayPaymentMethod, GooglePayCardNetwork, GooglePayAuthMethod, GooglePayAddressFormat, IAPTransactionState } from './modules/payment.js';
export { default as proximity } from './modules/proximity.js';
export { ProximityErrorCode } from './modules/proximity.js';
export { default as push } from './modules/push.js';
export { PushErrorCode, PushEventType } from './modules/push.js';
export { default as runtime } from './modules/runtime.js';
export { RuntimeErrorCode } from './modules/runtime.js';
export { default as share } from './modules/share.js';
export { ShareErrorCode, ShareServerIdentity, ShareMessageType, WeixinScene, ShareInterface, MiniProgramType } from './modules/share.js';
export { default as speech } from './modules/speech.js';
export { SpeechErrorCode } from './modules/speech.js';
export { default as sqlite } from './modules/sqlite.js';
export { SQLiteErrorCode } from './modules/sqlite.js';
export { default as statistic } from './modules/statistic.js';
export { StatisticErrorCode } from './modules/statistic.js';
export { default as storage } from './modules/storage.js';
export { StorageErrorCode } from './modules/storage.js';
export { default as uploader } from './modules/uploader.js';
export { UploaderErrorCode, UploadEventType, UploadState } from './modules/uploader.js';
export { default as video } from './modules/video.js';
export { VideoPlayerErrorCode, LivePusherErrorCode, VideoPlayer, LivePusher } from './modules/video.js';
export { default as webView } from './modules/webview.js';
export { WebViewErrorCode, WebViewObject } from './modules/webview.js';
export { default as zip } from './modules/zip.js';
export { ZipErrorCode } from './modules/zip.js';