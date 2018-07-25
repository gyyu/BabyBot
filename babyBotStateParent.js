class BabyBotStateParent{

    constructor(botRef){

        this.sendMessage = botRef.say.bind(botRef) 
        this.getAgeGroup = botRef.getAgeGroup.bind(botRef)
        this.toNormalState = botRef.changeToNormalState.bind(botRef)
        this.toNappingState = botRef.changeToNappingState.bind(botRef)
        this.evokeRandomState = botRef.changeState.bind(botRef)

    }


}

module.exports = BabyBotStateParent