const fs = require('fs')
const setting = require('./Settings/chatRecorderSetting.json')

class ChatRecorder {

    constructor(){

        this.records = []
        this.stream = fs.createWriteStream(setting.outputPath + 'record_' + this.getTimeStamp(), {flag: 'a'})
    }

    
    getTimeStamp(){

        let date = new Date()
        return date.getFullYear() + "" + date.getMonth() + 1  + "" +  date.getDate()

    }

    storeMsg(msg) {
        
        this.records.push(msg)

        if (this.records.length >= setting.recordCountToFlush){

            this.saveMsg()

        }

    }

    saveMsg(){
  
        if(setting.recordCountToFlush === 1){
            this.stream.write(this.records + "\n")
            this.records = []

        }else{

            this.stream.write(this.records.join('\n'))
            this.records = []
        }
       
       
    }
}

module.exports = ChatRecorder;