const hungryState = require('./Settings/hungryState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')


class HungryState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.hungryResponse = hungryState.response
    this.stateMessage = hungryState.message
    this.sendMessage("","", this.stateMessage)  
    this.requestFeedingIntervalID = setInterval(this.sendMessage.bind(this, "","", this.stateMessage), hungryState.messageInterval)
}

  onCommand (cmdName, food = "") {

    let ageGroup = this.getAgeGroup()

    if(!this.hungryResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }
    
    if (cmdName === 'Feed') {

        if(food === ""){

            this.sendMessage("","chat", "What to eat?") 

        }
        food = food.toLowerCase()
        if(hungryState.knownFood[food]){

            if(hungryState.knownFood[food] === 1){

                this.sendMessage("","chat", "Yum yum! :)") 

            }else{
                this.sendMessage("","chat", "Eh better than nothing! :/") 
            }
            clearInterval(this.requestFeedingIntervalID)
            this.toNormalState()


        }else if (food !== ""){

            let ranInt = Math.floor(Math.random()*Math.floor(2))
            if(ranInt){
                hungryState.knownFood[food] = 1
                this.sendMessage("","chat", "I don't know what is "+ food +"... But I'll give it a try!.....And it taste good!")

            }else{
                hungryState.knownFood[food] = -1
                this.sendMessage("","chat", "I don't know what is "+ food +"... But I'll give it a try!....Ewww!!! :(")
            }
            
            console.log(hungryState.knownFood)

            clearInterval(this.requestFeedingIntervalID)
            this.toNormalState()
        }
           
    }else{
        
        let listLength = this.hungryResponse[cmdName][ageGroup].length
        let ranNum = Math.floor(Math.random() * listLength)
    
        let response = this.hungryResponse[cmdName][ageGroup][ranNum]
    
        this.sendMessage("","chat", response)

    }

    
  }

}

module.exports = HungryState