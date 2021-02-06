const fs = require('fs');
const { shortURL } = require('../../src/utils');

// db file path
const savedLinksDir = 'source/links.json';
const testUrls = [ 'https://www.facebook.com', 'https://www.google.com'];
// clear links db
const initDBFile = async () => {
    fs.writeFileSync(savedLinksDir,[]);
    await shortURL(testUrls[1]);
}



module.exports = {
    initDBFile,
    testUrls
};