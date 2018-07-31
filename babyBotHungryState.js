const hungryState = require('./Settings/hungryState.json')
const botRecorder = require('./botStateRecorder.js')
const BabyBotStateParent = require('./babyBotStateParent.js')


class HungryState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.hungryResponse = hungryState.response
    this.stateMessage = hungryState.message
    this.sendMessage(this.stateMessage)  
    this.requestFeedingIntervalID = setInterval(this.sendMessage.bind(this,this.stateMessage), hungryState.messageInterval)
}

  onCommand (cmdName, food = "") {

    let ageGroup = this.ageGroup

    if(!this.hungryResponse[cmdName]){
            
        cmdName = "noCommandFound"

    }
    
    if (cmdName === 'feed') {

        if(food === ""){

            this.sendMessage( "What to eat?") 

        }

        if(hungryState.knownFood[food]){

            if(hungryState.knownFood[food] === 1){

                this.sendMessage("Yum yum! :)") 

            }else{
                this.sendMessage("Eh better than nothing! :/") 
            }

            this.clearIntervals()
            this.toNormalState()


        }else if (food !== ""){

            let ranInt = Math.floor(Math.random()*Math.floor(2))
            if(ranInt){
                hungryState.knownFood[food] = 1
                this.sendMessage("I don't know what is "+ food +"... But I'll give it a try!.....And it taste good!")

            }else{
                hungryState.knownFood[food] = -1
                this.sendMessage( "I don't know what is "+ food +"... But I'll give it a try!....Ewww!!! :(")
            }
            
            this.clearIntervals()
            this.saveStatus()
            this.toNormalState()
        }
           
    }else{

        let listLength = this.hungryResponse[cmdName][ageGroup].length
        let ranNum = Math.floor(Math.random() * listLength)
    
        let response = this.hungryResponse[cmdName][ageGroup][ranNum]
    
        this.sendMessage(response)

    }

    
  }

  onMessage(){}

  onTagged(msg){}

  clearIntervals(){

    clearInterval(this.requestFeedingIntervalID)

  }

  saveStatus(){

    botRecorder.saveJson(hungryState, "hungryState")
  }

}

module.exports = HungryState