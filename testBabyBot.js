const setting = require('./Settings/botState.json')

var BabyBot = function(){

    var currentState = new NormalState(BabyBot)
    var startTime = (new Date).getTime()
    var beginingAge = setting.age
    var secToYear = setting.secToYear
    var secToMonth = setting.secToMonth
    var secToDay = setting.secToDay

    this.changeState = function(){

        this.currentState = NormalState()

        setTimeout(function(){


            nextState = getRandomState()
            this.setState(nextState)

        }, eventInterval)


    }

    this.setState = function(nextState){

        currentState = nextState
    
    }

    this.updateBotStatus = function(){

        setting.age = this.getCurrentAgeInDay()
       
        return setting
    
      }
    
      this.getAgeInYMD = function (){
    
        let currentAge = this.getCurrentAgeInDay()
        
        let currentAgeInYear = Math.floor(currentAge / secToYear)
        let remainMonth = currentAge - currentAgeInYear * secToYear
    
        let currentAgeInMonth = Math.floor(remainMonth /secToMonth)
        let remainDay = remainMonth - currentAgeInMonth * secToMonth
    
        let currentAgeInDay = Math.floor((remainDay % secToMonth))
    
        console.log(currentAgeInYear + " " + currentAgeInMonth + " " + currentAgeInDay)
    
        return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]
      }

      getCurrentAgeInDay = function(){

        let currentTime = (new Date).getTime()
        let ageInSeconds =  (currentTime - startTime) / 1000
    
        let ageInDay = Math.round(ageInSeconds / secToDay)
        let currentAge = beginingAge + ageInDay
        
        return currentAge
      }
      getGreetingMessage = function(){

        return setting.greetingMessage
    
      }
    
      getCommandNotFoundMessage = function() {
    
        return setting.noCommandFoundMessage
    
      }
    
      getExitingMessage = function() {
    
        return setting.exitMessage
    
      }
    
      getGrowthReport = function(){
    
        let ageYMD = BabyBot.getAgeInYMD()
        
        reportMessage = "I'm " + ageYMD[0] + "-year " + ageYMD[1] + "-month and " + ageYMD[2] + "-day old!"
      
        return reportMessage
      
      }
    
      getResponseToKeywords = function(msg){
    
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
              console.log("Has keyword")
              let arrLen = keywords[firstWord][secondWord].length
              let randomNumber = Math.floor((Math.random() * arrLen))
              response = keywords[firstWord][secondWord][randomNumber]
              break
            }else{
    
              console.log("Overwrite 1")
              response = firstWord + " what?"
    
            }
    
          }else{
    
            console.log("Overwrite 2")
            response = firstWord + " what?"
    
          }
    
    
        }
        
        return response
        
    
      }
    
}

var NormalState = function(botRef){

    this.botRef = botRef
    
    this.onCommand = function(cmdName){

        switch(cmdName){

            case "GrowthReport":

                return botRef.getGrowthReport()

            case "Feed" :

            case "Change" :

            case "BedtimeStory" :

            case "Hold" :

            default:

                return botRef.getCommandNotFoundMessage()

        }



    }


}


var CryingState = function(botRef){

    this.botRef = botRef

    
}


