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

            normalState.curseProbability.encouraged += 1
            break
          
          default:

            let listLength = this.normalResponse[cmdName][ageGroup].length
            let ranNum = Math.floor(Math.random() * listLength)
        
            response = this.normalResponse[cmdName][ageGroup][ranNum] 
            this.sendMessage('','chat', response)
      }
          
    }

    onMessage(msg){

      if (msg.length >= 10){

        this.repeatCopyPasta(msg)
      }


    }

    repeatCopyPasta(msg){

      msg = msg.join(' ')
      if(msg.length > 500){

        msg = msg.substring(0, 400)
      }

      let max = normalState.copyPastaProbability.encouraged
      let min = normalState.copyPastaProbability.discouraged

      let prob = Math.floor(Math.random() * (max - min + 1)) + min
      
      console.log(prob)
      if(prob >= 0){

        this.sendMessage('','chat', msg)

      }
      

    }
        
  
  }

  module.exports = NormalState