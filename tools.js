const fs = require('fs');

module.exports = {
    getFileAsString: getFileAsString,
    writeStringAsJsonToFile: writeStringAsJsonToFile,
    readJsonFromFileAsString: readJsonFromFileAsString,
}

function getFileAsString(filename){
    var text = "There are no rules!";
    try {
        text = fs.readFileSync(filename,'utf8');
    } catch (err){
        console.log(err);
        return err;
    }
    console.log(text);
    return text;
};

function writeStringAsJsonToFile(filename, string){
    /*if(!fs.existsSync(filename)){
        fs.openSync(filename)
    }*/
    var json = JSON.stringify(string);
    fs.writeFileSync(filename, json, 'utf8');
}

// returns json
function readJsonFromFileAsString(filename){
    var json = fs.readFileSync(filename, 'utf8');
    var string = JSON.parse(json);
    return string;
}