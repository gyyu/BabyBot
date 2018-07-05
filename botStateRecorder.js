const fs = require('fs')
const setting = require('./Settings/settings.json')
const beginningState = require('./Settings/botState.json')
const BotStateRecorder = {

    saveState : function(botState){

        fs.writeFileSync(setting.settingPath + 'botState.json', JSON.stringify(botState))

    },

    backupState : function(){

        fs.writeFileSync(setting.outputPath + 'botState_' + Date.now() +'.json', JSON.stringify(beginningState))

    }


}

module.exports = BotStateRecorder;