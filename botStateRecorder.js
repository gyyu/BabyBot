const fs = require('fs')
const botRecorderSetting = require('./Settings/botRecorderSetting.json')
const BotStateRecorder = {


    getTimeStamp(){
        let date = new Date()
        return date.getFullYear() + "" + date.getMonth() + 1  + "" +  date.getDate()
    },

    saveJson : function(outputJson, fileName){
        fs.writeFileSync(botRecorderSetting.outputPath + fileName + '.json', JSON.stringify(outputJson, null, '\t'))
    },

    backupJson : function(outputJson, fileName){
        fs.writeFileSync(botRecorderSetting.backupOutputPath + fileName + '_' + this.getTimeStamp() +'.json', JSON.stringify(outputJson, null, '\t'))       
    }


}

module.exports = BotStateRecorder;