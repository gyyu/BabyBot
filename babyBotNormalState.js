const normalState = require('./Settings/normalState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')

class NormalState extends BabyBotStateParent{

    constructor (botRef) {

      super(botRef)
      this.normalResponse = normalState.response

      let len = normalState.eventInterval.length
      let ran = Math.floor(Math.random()* len)
      this.changeStateIntervalID = setTimeout(this.evokeRandomState, normalState.eventInterval[ran])
    }
  
    onCommand (cmdName) {
     
      let ageGroup = this.getAgeGroup()
      let response
  
      if(!this.normalResponse[cmdName]){
             
        cmdName = "NoCommandFound"

      }

      switch(cmdName){

        case 'Nap':

          clearTimeout(this.changeStateIntervalID)
          this.toNappingState()
          break
        
        case 'YayCopyPasta':
          normalState.copyPastaProbability.encouraged += 1
          break

        case 'NoCopyPasta':

          normalState.copyPastaProbability.discouraged -= 1
          break
        
        case 'YayCurse':

          normalState.curseProbability.encouraged += 1
          break
        
        case 'NoCurse':

          normalState.curseProbability.encouraged -= 1
          break
        
        default:

          let listLength = this.normalResponse[cmdName][ageGroup].length
          let ranNum = Math.floor(Math.random() * listLength)
      
          response = this.normalResponse[cmdName][ageGroup][ranNum] 
          this.sendMessage('','chat', response)
      }
          
    }

    onMessage(msg){

      let emote = this.emoteExist(msg)
      console.log(emote)
      //if shows up in the last 10 msgs too
      if (msg.length >= 10){

        this.repeatCopyPasta(msg)
      
      }else if(emote != ""){

        let max = normalState.emoteProbability.upperRange
        let min = normalState.emoteProbability.lowerRange

        let prob = Math.floor(Math.random() * (max - min + 1)) + min
        console.log(prob)
        if(prob >= 0){

          console.log(emote)
          this.sendMessage('', 'chat', emote)
        }
        

      }else{
  
        let words = msg.filter(word => word.length > 3)
        let ranNum = Math.floor(Math.random() * words.length)
        let word = msg[ranNum]
        
        if(!normalState.askedWord[word] && word.length > 3){
          normalState.askedWord[word] = true
          this.sendMessage('','chat', "What is " + word.replace(/[,.?&]+/g, "") + "?")
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

        this.sendMessage('','chat', msg)

      }
      
    }
        
    curse(){

      let max = normalState.curseProbability.encouraged
      let min = normalState.curseProbability.discouraged

      let prob = Math.floor(Math.random() * (max - min + 1)) + min

      if(prob >= 0){

        this.sendMessage('','chat', "Some curse words here")

      }

    }

    emoteExist(msg){

      let emoteList = msg.filter(word => normalState.emoteList[word])
      let listLen = emoteList.length
      let word = ""
      if(listLen > 0){

        let ranNum = Math.floor(Math.random() * emoteList.length)
        word = msg[ranNum]
      }
      
      return word
    
    }
  
  }

  module.exports = NormalState