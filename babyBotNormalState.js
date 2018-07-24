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
  
      if(cmdName === "Nap"){

        clearTimeout(this.changeStateIntervalID)
        this.toNappingState()
        
      }

      
      if(!this.normalResponse[cmdName]){
             
        cmdName = "NoCommandFound"

      }
  
      let listLength = this.normalResponse[cmdName][ageGroup].length
      let ranNum = Math.floor(Math.random() * listLength)
  
      response = this.normalResponse[cmdName][ageGroup][ranNum] 
      this.sendMessage('','chat', response)
          
      
    }
        
  
  }

  module.exports = NormalState