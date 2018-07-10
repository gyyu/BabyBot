const fs = require('fs')
const beginningState = require('./Settings/botState.json')
const BotStateRecorder = {

    saveState : function(botState){

        fs.writeFileSync('./Outputs/botState.json', JSON.stringify(botState))

    },

    backupState : function(){

        fs.writeFileSync('./Outputs/botState_' + Date.now() +'.json', JSON.stringify(beginningState))

    }


}

module.exports = BotStateRecorder;