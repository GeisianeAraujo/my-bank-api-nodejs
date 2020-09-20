const path = require("path");
const fs = require('fs');

const dataFilePath = path.resolve(__dirname, "..", "data", "accounts.json");
const configFilePath = path.resolve(__dirname, "..", "data", "config.json");

const getData = () => {
    try {
        const jsonData = fs.readFileSync(dataFilePath, "utf-8");
        const data = JSON.parse(jsonData);

        return data;
    } catch (error) {
        return [];
    }    
}

const generateNewId = () => {
    let configJsonData;
    let data;

    try {
        configJsonData = fs.readFileSync(configFilePath, "utf-8");
        data = JSON.parse(configJsonData);
    } catch(error) {
        data = {
            lastIndex: 1
        };
    }

    let newIndex = parseInt(data.lastIndex) + 1;
    data.lastIndex = newIndex;

    fs.writeFile(configFilePath, JSON.stringify(data), "utf-8", (error) => {
        if (error) {
            throw new Error("Erro ao gravar o ultimo indice no arquivo");
        }
    });

    return newIndex;
}

module.exports.writeData = async (dataWrite) => {
    return fs.writeFile(dataFilePath, JSON.stringify(dataWrite), "utf-8", (error) => {
        if (error) {
            throw new Error("Erro ao gravar o arquivo");
        }
    });
}

module.exports.getData = getData;
module.exports.generateNewId = generateNewId;