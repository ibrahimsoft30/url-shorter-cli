const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');

const savedLinksDir = 'source/links.json';

// make url shorting request
const shortURL = async (url,autoSave) => {
    try{
        savedLinksList = readSavedLinks();
        const duplicatedUrls = savedLinksList.filter(item =>{
            return item.url == url;
        });
        if(duplicatedUrls.length > 0){
            return {error: 'This url already shorted and saved'.toUpperCase()};
        }
        const { data: {result_url: shortedURL,error}} = await axios.post('https://cleanuri.com/api/v1/shorten',{url});
        if(error){
            return {error: error.toUpperCase()};
        }

        if(autoSave){
            return saveShortedLink(url,shortedURL);
        }
        return {shortLink:shortedURL};
    }catch(error){
        return {error: error.message.toUpperCase()};   
    }
}

// save shorted links in json file
const saveShortedLink = async (url,shortURL) =>{
    try{
        const data = {url,shortURL};
        const savedLinksList = readSavedLinks();
        savedLinksList.push(data);
        fs.writeFileSync(savedLinksDir,JSON.stringify(savedLinksList));
        return {shortLink:shortURL};
    }catch(error){
        return {error: error.message.toUpperCase()};
    }
    
}

// read already saved links
const readSavedLinks = () => {
    try {
        const data = fs.readFileSync(savedLinksDir).toString();
        return data != '' ? JSON.parse(data) : [] ;
    } catch (error) {
        console.log(chalk.bgRed.bold(error));
        return [];
    }
}

// delete link by his url

const deleteLink = (url) => {
    try{
        const savedLinks = readSavedLinks();
        if(savedLinks.length == 0){
            return {error: 'No links saved yet'};
        }
        const clearedLinks = savedLinks.filter(link => {
            return link.url != url;
        });

        if(clearedLinks.length != savedLinks.length){
            fs.writeFileSync(savedLinksDir, JSON.stringify(clearedLinks));
            return {message: `${url} deleted`};
        }
    }catch(error){
        return {error};
    }
}

// export methods
module.exports = {
    shortURL,
    readSavedLinks,
    deleteLink
}