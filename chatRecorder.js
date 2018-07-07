const fs = require('fs')
const setting = require('./Settings/chatRecorderSetting.json')

const ChatRecorder = {
    
    records : [],

    getTimeStamp : function(){

        let date = new Date()
        return date.getFullYear() + "" + date.getMonth()  + "" +  date.getDate()  + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds()

    },

    storeMsg : function(msg) {
        
        ChatRecorder.records.push(msg)

        if (ChatRecorder.records.length >= setting.recordCountToFlush){

            ChatRecorder.saveMsg()

        }

    },

    saveMsg : function(){

        fs.writeFileSync( setting.outputPath + 'record_' + ChatRecorder.getTimeStamp(), ChatRecorder.records.join('\n'))
        ChatRecorder.records = []
    }
}

module.exports = ChatRecorder;