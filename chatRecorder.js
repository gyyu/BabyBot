const fs = require('fs')
const setting = require("./settings.json")

const ChatRecorder = {
    
    records : [],

    storeMsg : function(msg) {
        
        ChatRecorder.records.push(msg)

        if (ChatRecorder.records.length >= setting.recordCountToFlush){

            this.saveMsg()

        }

    },

    saveMsg : function(){

        fs.writeFileSync('./record_' + Date.now(), ChatRecorder.records.join('\n'))
        ChatRecorder.records = []
    }
}

module.exports = ChatRecorder;