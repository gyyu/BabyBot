const fs = require('fs')
const beginningState = require('./Settings/botState.json')
const BotStateRecorder = {

    saveState : function(botState){

        fs.writeFileSync('./Output/botState.json', JSON.stringify(botState))

    },

    backupState : function(){

        fs.writeFileSync('./Output/botState_' + Date.now() +'.json', JSON.stringify(beginningState))

    }


}

module.exports = BotStateRecorder;