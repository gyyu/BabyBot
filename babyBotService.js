const chatRecorder = require('./chatRecorder.js')
const botStateRecorder = require('./botStateRecorder')
const botSetting = require('./Settings/botSetting.json')
const botState = require('./Settings/botState.json')
const babyBot = require('./babyBot.js')


const BabyBotService = {
    
    initializeBabyBot : function() {

        babyBot.age = botState.age,
        babyBot.secToYear = botState.secToYear,
        babyBot.secToMonth = botState.secToMonth,
        babyBot.secToDay = botState.secToDay
        babyBot.startTime = (new Date).getTime()

    },

    saveAndExit : function (){
            
        setTimeout(function() {
      
          botStateRecorder.backupState()
          botState.age = babyBot.getCurrentAgeInDay()
          botStateRecorder.saveState(botState)
          chatRecorder.saveMsg()
          process.exit(1)
      
        }, botSetting.exitDelay)
      
    },

    saveChatMessage : function(msg){

        chatRecorder.storeMsg(msg)
  
    },

    getExitMessage : function(){

        return botSetting.exitMessage

    },

    getGreetingMessage : function(){

        return botSetting.greetingMessage

    }


}

module.exports = BabyBotService;