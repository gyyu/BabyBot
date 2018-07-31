const diaperChangeState = require('./Settings/diaperChangeState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')

class DiaperChangingState extends BabyBotStateParent{

  constructor (botRef) {
   
    super(botRef)
    this.diaperChangeResponse = diaperChangeState.response
    this.stateMessage = diaperChangeState.message
    this.sendMessage(this.stateMessage)  
    this.requestChangingIntervalID = setInterval(this.sendMessage.bind(this, this.stateMessage), diaperChangeState.messageInterval)
    
}

  onCommand (cmdName) {

    let ageGroup = this.ageGroup
    
    if(!this.diaperChangeResponse[cmdName]){
            
        cmdName = "noCommandFound"

    }

    let listLength = this.diaperChangeResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    let response = this.diaperChangeResponse[cmdName][ageGroup][ranNum]

    if (cmdName === 'change') {
        this.clearIntervals()
        this.toNormalState()      
    }

    this.sendMessage(response)
  }

  onMessage(){}
  onTagged(msg){}
  
  clearIntervals(){

    clearInterval(this.requestChangingIntervalID)

  }

  saveStatus(){}

  
}

module.exports = DiaperChangingState