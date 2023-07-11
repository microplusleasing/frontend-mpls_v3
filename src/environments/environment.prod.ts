export const environment = {
  production: true,
  // apiurl: 'http://58.136.5.116:9989',
  apiurl: 'api2-mpls.microplusleasing.com',
  apiportsign: '',
  apiport: '',
  httpheader: 'https://',
  httpheadercert: 'https://',
  apidipchip: 'api-dipch.microplusleasing.com',
  smsserviceallow: 1,
  carcheck: 'web-repos.microplusleasing.com', // wait for sub-domain confirm
  carcheckapi: 'api-repos.microplusleasing.com',
  carcheckport: '',
  citizen_card_img_preload: '/assets/image/placeholder-image.png',
  welcome_call_fcr_web: 'web-welcome.microplusleasing.com/fcr',
  iappapikey: "F3kBa0O7D07SUYy5YmcfLeohWRxbipdn",
  faceRecogApi: "https://api.iapp.co.th/thai-national-id-card/v3/front",
  faceValidApi: "https://api.iapp.co.th/face-verification/v2/face_compare",
  version: "version  1.03.4"
  
};

// ===== api v1 =====
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   apiurl: 'api-mplus.microplusleasing.com',
//   apiportsign: '',
//   apiport: '',
//   httpheader: 'https://',
//   httpheadercert: 'https://',
//   apidipchip: 'api-dipch.microplusleasing.com',
//   smsserviceallow: 1,
//   carcheck: 'web-repos.microplusleasing.com', // wait for sub-domain confirm
//   carcheckapi: 'api-repos.microplusleasing.com',
//   carcheckport: '',
//   citizen_card_img_preload: '/assets/image/placeholder-image.png',
//   welcome_call_fcr_web: 'web-welcome.microplusleasing.com/fcr',
  
// };



// ==== this is new version (no certificate) (UAT COLO) ====
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   // apiurl: '192.168.10.17', // UAT Black server
//   // apiurl: '43.249.69.202',
//   apiurl: '192.168.40.17', 
//   // apiurl: '192.168.40.18',
//   apiportsign: ':',
//   apiport: '9989',
//   httpheader: 'http://',
//   apidipchip: '192.168.40.23',
//   smsserviceallow: 1,
//   carcheck: '192.168.40.23',
//   carcheckport: '8080'
// };


// ==== this is new version (PROD IP)  ====
// export const environment = {
//   production: true,
//   // apiurl: 'http://58.136.5.116:9989',
//   // apiurl: '43.249.69.202',
//   apiurl: '103.40.188.103',
//   apiportsign: ':',
//   apiport: '9989',
//   httpheader: 'http://'
// };


// ==== this is for oldversion (not cloud) ====
// export const environment = {
//   production: true,
//   apiurl: 'http://58.136.5.116:9989',
//   apiport: '9989',
//   httpheader: 'http://'
// };
