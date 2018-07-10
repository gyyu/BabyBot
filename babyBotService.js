const chatRecorder = require('./chatRecorder.js')
const botStateRecorder = require('./botStateRecorder')
const botSetting = require('./Settings/botSetting.json')
const babyBot = require('./babyBot.js')


const BabyBotService = {

    events : ["cry", "diaper-change", "nap"],
    
    saveAndExit : function (){
            
        setTimeout(function() {
      
          botStateRecorder.backupState()
          let botState = babyBot.updateBotState()
          botStateRecorder.saveState(botState)
          chatRecorder.saveMsg()
          process.exit(1)
      
        }, botSetting.exitDelay)
      
    },

    saveChatMessage : function(msg){

        chatRecorder.storeMsg(msg)
  
    },

    getExitMessage : function(){

        return babyBot.getExitingMessage()

    },

    getGreetingMessage : function(){

        return babyBot.getGreetingMessage()

    },

    executeCommand : function(cmdName, params){
        
        switch(cmdName){

            case "growthReport":

                return babyBot.getGrowthReport()

            default:

                return babyBot.getCommandNotFoundMessage()

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

    getRandomEvent : function(){

        let len = BabyBotService.events.length
        let randInt = Math.floor((Math.random()* len))
        let eventName = BabyBotService.events[randInt]

        switch(eventName){

            case "cry":

                return babyBot.cryingEvent()

            case "diaper-change":

                return babyBot.diaperChangeEvent()

            case "nap":

                return babyBot.nappingEvent()
        }


    },

   


}

module.exports = BabyBotService;