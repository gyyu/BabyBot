const napState = require('./Settings/nappingState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')

class NappingState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.napingResponse = napState.response
    this.stateMessage = napState.message
    this.sendMessage(this.stateMessage)  
    setTimeout(this.toNormalState, napState.stateDuration)
    
}

  onCommand (cmdName) {

    this.sendMessage( "/me babyBot is sleeping right now. It can't hear you!")
        
  }
  onMessage(){}
  onTagged(msg){}
  saveStatus(){}
}

module.exports = NappingState