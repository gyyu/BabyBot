const normalState = require('./Settings/normalState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')
const botRecorder = require('./botStateRecorder.js')

class NormalState extends BabyBotStateParent{

    constructor (botRef) {

      super(botRef)
      this.normalResponse = normalState.response
      this.getAgeInYMD = botRef.getAgeInYMD.bind(botRef)

      let len = normalState.eventInterval.length
      let ran = Math.floor(Math.random()* len)
      botRecorder.backupJson(normalState, "normalState")
      this.changeStateTimeoutID = setTimeout(this.changeState.bind(this), normalState.eventInterval[ran])
      this.sayRandomSentenceIntervalID = setInterval(this.sayRandomSentence.bind(this), 30000)

    }
  
    changeState(){

      botRecorder.saveJson(normalState, "normalState")
      this.evokeRandomState()
    }

    onCommand (cmdName) {
     
      let response
  
      if(!normalState.stateCommands[cmdName]){
             
        cmdName = "noCommandFound"

      }

      switch(cmdName){

        case 'nap':
          clearTimeout(this.changeStateTimeoutID)
          this.toNappingState()
          break
        
        case 'yaycopypasta':
          normalState.copyPastaProbability.encouraged += 1
          break

        case 'nocopypasta':
          normalState.copyPastaProbability.discouraged -= 1
          break
        
        case 'yaycurse':
          normalState.curseProbability.encouraged += 1
          break
        
        case 'nocurse':
          normalState.curseProbability.encouraged -= 1
          break

        case 'growthreport' :
          this.getReport()
          break
        
        default:
          console.log(this)
          let listLength = this.normalResponse[cmdName][this.ageGroup].length
          let ranNum = Math.floor(Math.random() * listLength)
      
          response = this.normalResponse[cmdName][this.ageGroup][ranNum] 
          this.sendMessage(response)
      }
          
    }

    //TODO
    onTagged(msg){


    }

    onMessage(msg){

      let emote = this.getEmote(msg)
    
      //TODO: if shows up in the last 10 msgs too
      if (msg.length >= 10){

        this.repeatCopyPasta(msg)
      
      }else if(emote != ""){

        let max = normalState.emoteProbability.upperRange
        let min = normalState.emoteProbability.lowerRange

        let prob = Math.floor(Math.random() * (max - min + 1)) + min
        console.log(prob)
        if(prob >= 0){
    
          this.sendMessage(emote)
        }      

      }else{
  
        let words = msg.filter(word => word.length > 3)
        let ranNum = Math.floor(Math.random() * words.length)
        let word = msg[ranNum]

        let prob = Math.round(Math.random())
        
        if(!normalState.askedWord[word] && word.length > 3 && prob >= 0.5){
          normalState.askedWord[word] = true
          this.sendMessage( "What is " + word.replace(/[,.?&]+/g, "") + "?")
        }

      }

      this.curse()

    }

    repeatCopyPasta(msg){

      msg = msg.join(' ')
      if(msg.length > 500){

        msg = msg.substring(0, 400)
      }

      let max = normalState.copyPastaProbability.encouraged
      let min = normalState.copyPastaProbability.discouraged

      let prob = Math.floor(Math.random() * (max - min + 1)) + min
  
      if(prob >= 0){

        this.sendMessage(msg)

      }
      
    }
        
    curse(){

      let max = normalState.curseProbability.encouraged
      let min = normalState.curseProbability.discouraged

      let prob = Math.floor(Math.random() * (max - min + 1)) + min

      if(prob >= 0){

        this.sendMessage("Some curse words here")

      }

    }

    getEmote(msg){

      let emoteList = msg.filter(word => normalState.emoteList[word])
      let listLen = emoteList.length
      let word = ""
      if(listLen > 0){

        let ranNum = Math.floor(Math.random() * emoteList.length)
        let emote = emoteList[ranNum]
        word = normalState.emoteList[emote]
      }
      
      return word
    
    }

    sayRandomSentence(){

      this.sendMessage("Some sentences here")

    }
  
    getReport () {
      
      let age = this.getAgeInYMD()
      this.sendMessage("/me BabyBot is " + age[0]  + " year " + age[1] + " month " + " and " + age[2] + " days old!")
    }


    clearIntervals(){
      clearTimeout(this.changeStateTimeoutID)
      clearInterval(this.sayRandomSentenceIntervalID)
    }

    saveStatus(){

      botRecorder.saveJson(normalState, "normalState")

    }
    

  }

  module.exports = NormalState