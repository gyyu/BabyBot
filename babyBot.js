const setting = require('./Settings/botState.json')

let taggedCounter = 0; // used to measure the number of times the bot interacts, when it hits a certain number, it will take a nap 

const BabyBot = {

  startTime : (new Date).getTime(),
  beginingAge : setting.age,
  secToYear : setting.secToYear,
  secToMonth : setting.secToMonth,
  secToDay : setting.secToDay,



  updateBotState : function(){

    setting.age = BabyBot.getCurrentAgeInDay()
   
    return setting

  },

  getAgeInYMD : function (){

    let currentAge = BabyBot.getCurrentAgeInDay()
    
    let currentAgeInYear = Math.floor(currentAge / BabyBot.secToYear)
    let remainMonth = currentAge - currentAgeInYear * BabyBot.secToYear

    let currentAgeInMonth = Math.floor(remainMonth / BabyBot.secToMonth)
    let remainDay = remainMonth - currentAgeInMonth * BabyBot.secToMonth

    let currentAgeInDay = Math.floor((remainDay % BabyBot.secToMonth))

    console.log(currentAgeInYear + " " + currentAgeInMonth + " " + currentAgeInDay)

    return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]
  },

  getCurrentAgeInDay : function(){

    let currentTime = (new Date).getTime()
    let ageInSeconds =  (currentTime - BabyBot.startTime) / 1000

    let ageInDay = Math.round(ageInSeconds / BabyBot.secToDay)
    let currentAge = BabyBot.beginingAge + ageInDay
    
    return currentAge
  },

  getGreetingMessage : function(){

    return setting.greetingMessage

  },

  getCommandNotFoundMessage : function() {

    return setting.noCommandFoundMessage

  },

  getExitingMessage : function() {

    return setting.exitMessage

  },

  getGrowthReport : function(){

    let ageYMD = BabyBot.getAgeInYMD()
    
    reportMessage = "I'm " + ageYMD[0] + "-year " + ageYMD[1] + "-month and " + ageYMD[2] + "-day old!"
  
    return reportMessage
  
  },

  getResponseToKeywords : function(msg){

    console.log(msg)
    let response = "I don't understand"
    let keywords = setting.keywords
    let firstWord
    let secondWord

    for(i = 0; i < msg.length; i++){

      firstWord = msg[i]
      
      if(keywords[firstWord] && i+1 <= msg.length){
      
        secondWord = msg[i+1]
      
        if(keywords[firstWord][secondWord]){

          let arrLen = keywords[firstWord][secondWord].length
          let randomNumber = Math.floor((Math.random() * arrLen))
          response = keywords[firstWord][secondWord][randomNumber]
          
        }else{

          response = firstWord + " what?"

        }

      }else{

        response = firstWord + " what?"

      }


    }
    
    return response
    

  },
  cryingEvent : function(){

    return setting.cryingMessage

  },

  diaperChangeEvent : function(){

    return setting.diaperChangeMessage

  },

  nappingEvent : function(){

    //startTime = Date.now();

    //if (Date.now() - startTime > 300000)
      //return setting.awakeMessage;
    //else 
    return setting.nappingMessage

  }


}

module.exports = BabyBot