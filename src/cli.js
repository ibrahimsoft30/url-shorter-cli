const validator = require('validator');
const yargs = require('yargs');
const chalk = require('chalk');
const encodeUrl = require('encodeurl');
const { shortURL, readSavedLinks, deleteLink} = require('./utils');

// commands

// populate short url
yargs.command({
    command:'short-link',
    describe: 'This command for shorting long url',
    builder:{
        url:{
            type: String,
            describe: 'Long url to be shorted',
            demandOption: true
        },
        save:{
            type: Boolean,
            describe: 'enable auto saveing shorted links',
            default: false
        }
    },
    handler: async (argv) =>{
        
        const url = encodeUrl(argv.url.trim().toLowerCase());
        if(!validator.isURL(url)){
            return console.log(chalk.bgRed.bold('This url is not in correct format'.toUpperCase()));
        }

       const {shortLink,error} = await shortURL(url,argv.save);
       if(error){
           return console.log(chalk.bgRed.bold(error));
       }
       console.log(shortLink);
       console.log(chalk.bgGreen.black.bold('URL has been shorted succssfully'));
    }
});

// read All Short Links

yargs.command({
    command: 'list',
    describe: 'This For Listing All Saved Links',
    builder:{
        url:{
            type: String,
            describe: 'actual saved url'
        }
    },
    handler(argv){
        const savedLinksList = readSavedLinks();
        if(savedLinksList.length > 0){
            if(argv.url){
                const url = argv.url.trim().toLowerCase();
                const savedShortLink = savedLinksList.filter(link => {
                    return link.url == url;
                });
                if(savedShortLink.length > 0){
                    console.log(chalk.bgGreen.black(`==========  ${url} Short link  ==========`));
                    console.log(savedShortLink[0].shortURL);
                }else{
                    console.log(chalk.bgRed.bold('URL not found'));
                }
            }else{
                console.log(chalk.bgGreen.black('==========  Saved Links  ========'));
                console.log(savedLinksList);
            }
        }else{
            console.log(chalk.bgYellow.black('No links saved yet'.toUpperCase()));
        }
    }
});

yargs.command({
    command: 'delete',
    describe: 'Delete saved Link',
    builder: {
        url: {
            type: String,
            demandOption: true,
            describe: 'URL to delete'
        }
    },
    handler(argv){
        
        if(argv.url){
            const url = argv.url.trim().toLowerCase();
            const {message,error} = deleteLink(url);
            if(error){
                return console.log(chalk.bgRed.bold(error.toUpperCase()));
            }

            console.log(chalk.bgGreen.black.bold(message));
        }
    }
})

yargs.parse();