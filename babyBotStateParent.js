class BabyBotStateParent{

    constructor(botRef){

        this.ageGroup = botRef.ageGroup
        this.sendMessage = botRef.say.bind(botRef) 
        this.toNormalState = botRef.changeToNormalState.bind(botRef)
        this.toNappingState = botRef.changeToNappingState.bind(botRef)
        this.evokeRandomState = botRef.changeState.bind(botRef)
        
    }


}

module.exports = BabyBotStateParent