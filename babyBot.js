
const BabyBot = {

  startTime : 0,
  beginingAge : 0,
  secToYear : 0,
  secToMonth : 0,
  secToDay : 0,

  getAgeInYMD : function (){

    currentAge = getCurrentAgeInDay()
    
    let currentAgeInYear = Math.floor(currentAge / BabyBot.secToYear)
    let remainMonth = currentAge - currentAgeInYear * BabyBot.secToYear

    let currentAgeInMonth = Math.floor(remainMonth / BabyBot.secToMonth)
    let remainDay = remainMonth - currentAgeInMonth * BabyBot.secToMonth

    let currentAgeInDay = Math.floor((remainDay % BabyBot.secToMonth))

    console.log(currentAgeInYear + " " + currentAgeInMonth + " " + currentAgeInDay)

    return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]
  },

  getCurrentAgeInDay : function(){

    let currentTime = (new Date).getTime()
    let ageInSeconds =  (currentTime - BabyBot.startTime) / 1000

    let ageInDay = Math.round(ageInSeconds / BabyBot.secToDay)
    
    let currentAge = BabyBot.beginingAge + ageInDay

    return currentAge
  }


}

module.exports = BabyBot