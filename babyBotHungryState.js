const hungryState = require('./Settings/hungryState.json')


class HungryState {

  constructor (botRef) {

    this.botRef = botRef
    this.hungryResponse = hungryState.response
    this.sendHungryMessage()
    this.requestFeedingIntervalID = setInterval(this.sendHungryMessage.bind(this), hungryState.messageInterval)
    
}

  onCommand (cmdName, food = "") {

    let ageGroup = this.botRef.getAgeGroup()

    if(!this.hungryResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.hungryResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    let response = this.hungryResponse[cmdName][ageGroup][ranNum]
    
    if (cmdName === 'Feed') {

        if(food === ""){

            return ["","chat", "What to eat?"]

        }
        
        if(hungryState.knownFood.includes(food)){

            clearInterval(this.requestFeedingIntervalID)
            this.botRef.changeToNormalState()  
            return ["","chat", response]

        }else{

            hungryState.knownFood.push(food)
            return ["","chat", "I don't know what is "+ food +"... But I'll give it a try!"]

        }
           
    }

    return ["","chat", response]
  }

  sendHungryMessage(){

    let msg = ["","",hungryState.hungryMessage]
    this.botRef.say()

  }

  

}

module.exports = HungryState