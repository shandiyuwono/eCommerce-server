const { Storage } = require('@google-cloud/storage');

// const key = require('../')
const GOOGLE_CLOUD_PROJECT_ID = 'miniwp-244509'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = './key.json'; // Replace with the path to the downloaded private key

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

const getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;

// console.log(getPublicUrl('shandi-portfolio', 'blablabla'))

module.exports = { storage, getPublicUrl}