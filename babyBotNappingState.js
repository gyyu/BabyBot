const napState = require('./Settings/nappingState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')

class NappingState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.napingResponse = napState.response
    this.stateMessage = napState.message
    this.sendMessage("","", this.stateMessage)  
    setTimeout(this.toNormalState, napState.stateDuration)
    
}

  onCommand (cmdName) {

    // let ageGroup = this.botRef.getAgeGroup()
    // let response

    // if(!this.napingResponse[cmdName]){
            
    //   return ['','chat', "/me babyBot is sleeping right now. It can't hear you! Plus, that's not a valid command."]

    // }

    // let listLength = this.napingResponse[cmdName][ageGroup].length
    // let ranNum = Math.floor(Math.random() * listLength)

    // response = this.napingResponse[cmdName][ageGroup][ranNum]
    this.sendMessage('','chat', "/me babyBot is sleeping right now. It can't hear you!")
        
  }

}

module.exports = NappingState