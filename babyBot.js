const setting = require('./Settings/botState.json')

const BabyBot = {

  startTime : (new Date).getTime(),
  beginingAge : setting.age,
  secToYear : setting.secToYear,
  secToMonth : setting.secToMonth,
  secToDay : setting.secToYear,

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

          let arrLen = keywords[firstWord][secondWord].length-1
          let randomNumber = Math.floor((Math.random() * arrLen) + 1)
          response = keywords[firstWord][secondWord][randomNumber]
          
        }else{

          response = firstWord + " what?"

        }

      }else{

        response = firstWord + " what?"

      }


    }
    
    return response
    

  }


}

module.exports = BabyBot