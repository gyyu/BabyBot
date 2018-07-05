const fs = require('fs')
const setting = require('./Settings/settings.json')

const ChatRecorder = {
    
    records : [],

    storeMsg : function(msg) {
        
        ChatRecorder.records.push(msg)

        if (ChatRecorder.records.length >= setting.recordCountToFlush){

            this.saveMsg()

        }

    },

    saveMsg : function(){

        fs.writeFileSync( setting.outputPath + 'record_' + Date.now(), ChatRecorder.records.join('\n'))
        ChatRecorder.records = []
    }
}

module.exports = ChatRecorder;