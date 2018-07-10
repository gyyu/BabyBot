const chatRecorder = require('./chatRecorder.js')
const botStateRecorder = require('./botStateRecorder')
const botSetting = require('./Settings/botSetting.json')
const botState = require('./Settings/botState.json')
const babyBot = require('./babyBot.js')


const BabyBotService = {
    
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

    },

    executeCommand : function(cmdName, params){
        console.log(cmdName)
        console.log(cmdName==="growthReport")
        switch(cmdName){

            case "growthReport":

                return babyBot.getGrowthReport()

            default:

                return botSetting.noCommandFoundMessage

        }
        

    },

    learnFromMessage : function(msg, weighted){

        if(weighted){

            console.log("Weight each word")
            

        }else{


            console.log("no weight")
            


        }


    },

    getResponse : function(msg){
        console.log("getResponse")
        return babyBot.getResponseToKeywords(msg)

    },

   







    


}

module.exports = BabyBotService;