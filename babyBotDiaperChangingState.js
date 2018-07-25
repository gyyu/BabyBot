const diaperChangeState = require('./Settings/diaperChangeState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')

class DiaperChangingState extends BabyBotStateParent{

  constructor (botRef) {
   
    super(botRef)
    this.diaperChangeResponse = diaperChangeState.response
    this.stateMessage = diaperChangeState.message
    this.sendMessage("","", this.stateMessage)  
    this.requestChangingIntervalID = setInterval(this.sendMessage.bind(this, "","", this.stateMessage), diaperChangeState.messageInterval)
    
}

  onCommand (cmdName) {

    let ageGroup = this.getAgeGroup()
    
    if(!this.diaperChangeResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.diaperChangeResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    let response = this.diaperChangeResponse[cmdName][ageGroup][ranNum]

    if (cmdName === 'Change') {
        clearInterval(this.requestChangingIntervalID)
        this.toNormalState()      
    }

    this.sendMessage("","chat", response)
  }

}

module.exports = DiaperChangingState