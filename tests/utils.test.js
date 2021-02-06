/**
 * @jest-environment node
 */
const { shortURL, readSavedLinks, deleteLink } = require('../src/utils');
const { initDBFile , testUrls} = require('./fixtures/init');

beforeAll(initDBFile);

test('Should return shorted url',async () => {
    const response = await shortURL(testUrls[0],false);
    expect(response).toHaveProperty('shortLink');
});

test('Should return shorted url and save it', async () => {
    const response = await shortURL(testUrls[1],true);
    expect(response).toHaveProperty("shortLink");
    const savedLinks = readSavedLinks().filter(link => {
        return link.url == testUrls[1];
    });

    expect(savedLinks).toHaveLength(1);
    
});

test('Should delete url', () => {
    const response = deleteLink(testUrls[1]);
    expect(response).toHaveProperty('message');
});

