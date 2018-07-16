const TwitchHandler = require('./twitchHandler.js')
const BabyBot = require('./babyBot.js')
const BabyBotChannel = require('./babyBotChannel.js')

const babyBotChannel = new BabyBotChannel()

const twitchHandler = new TwitchHandler()

const babyBot = new BabyBot(babyBotChannel)

babyBotChannel.setMethods(babyBot.onMessage.bind(babyBot),twitchHandler.sendMessage.bind(twitchHandler), babyBot.onJoin.bind(babyBot))
twitchHandler.initialize(babyBotChannel)

