// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


// === local serve === 
export const environment = {
  production: true,
  apiurl: 'localhost',
  apiportsign: ':',
  apiport: '4000',
  httpheader: 'http://',
  // apiurl: 'http://58.136.2.53:9989'
  // apiurl: 'http://vrteminal.thddns.net:9989',
  // onfaceapi: 'https://api.iapp.co.th/thai-national-id-card/v3/front'
  httpheadercert: 'https://',
  apidipchip: 'api-dipch-uat.microplusleasing.com',
  smsserviceallow: 0,
  carcheck: 'web-repos-uat.microplusleasing.com',
  carcheckapi: 'api-repos-uat.microplusleasing.com',
  carcheckport: '',

  citizen_card_img_preload: '/assets/image/placeholder-image.png',
  welcome_call_fcr_web: 'web-welcome-uat.microplusleasing.com/fcr',

  iappapikey: "F3kBa0O7D07SUYy5YmcfLeohWRxbipdn",
  faceRecogApi: "https://api.iapp.co.th/thai-national-id-card/v3/front",
  faceValidApi: "https://api.iapp.co.th/face-verification/v2/face_compare",
  version: "uat version  1.05.08 (dev 0.1)"
};

// === build UAT === 
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   // apiurl: '43.249.69.202',
//   apiurl: '192.168.40.17', 
//   apiportsign: ':',
//   apiport: '9989',
//   httpheader: 'https://',
//   apidipchip: '192.168.40.23',
//   smsserviceallow: 0,
//   carcheck: '192.168.40.25',
//   carcheckport: ''
// };

// === build UAT (internet) === 
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   // apiurl: '43.249.69.202',
//   apiurl: '223.27.247.102', 
//   apiportsign: ':',
//   apiport: '9989',
//   httpheader: 'http://',
//   httpheadercert: 'https://',
//   apidipchip: 'api-dipch-uat.microplusleasing.com',
//   smsserviceallow: 0,
//   carcheck: 'web-repos-uat.microplusleasing.com',
//   carcheckapi: 'api-repos-uat.microplusleasing.com',
//   carcheckport: ''
// };

// // === build UAT (internet) (certificate 443)=== (v2)
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   // apiurl: '43.249.69.202',
//   apiurl: 'api2-mpls-uat.microplusleasing.com',
//   apiportsign: ':',
//   apiport: '',
//   httpheader: 'https://',
//   httpheadercert: 'https://',
//   apidipchip: 'api-dipch-uat.microplusleasing.com',
//   smsserviceallow: 1,
//   carcheck: 'web-repos-uat.microplusleasing.com',
//   carcheckapi: 'api-repos-uat.microplusleasing.com',
//   carcheckport: '',
//   citizen_card_img_preload: '/assets/image/placeholder-image.png',
//   welcome_call_fcr_web: 'web-welcome-uat.microplusleasing.com/fcr',

//   iappapikey: "F3kBa0O7D07SUYy5YmcfLeohWRxbipdn",
//   faceRecogApi: "https://api.iapp.co.th/thai-national-id-card/v3/front",
//   faceValidApi: "https://api.iapp.co.th/face-verification/v2/face_compare",
//   version: "uat version  1.04.01"


// };

// === build Development === 
// export const environment = {
//   production: true,
//   apiurl: '192.168.10.17', 
//   apiportsign: ':',
//   apiport: '9989',
//   httpheader: 'http://',
//   apidipchip: '192.168.40.23',
//   smsserviceallow: 0,
//   carcheck: '192.168.10.19',
//   carcheckport: '8081'
// };


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
