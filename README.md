# BabyBot

## twitchHandler.js
- Handles connection with Twitch
- Sends request to BabyBotService.js to get response from babyBot

### connectionSetting.json
- Contains connection setting to Twitch
- Defines message parsing symbols
- Defines interval for calling functions

## babyBotService.js
- Handles reqest from twitchHandler.js
- Sends request to babyBot to get response/actions

### botSetting.json
- Defines commands the bot has
- Defines exit delay
- Defines word weight

## babyBot.js
- the core logic of the bot
- stores bot state and information
- person actions(crying, needs nap...etc.)

### botState.json
- Defines bot age conversion rule
- Stores bot age
- Store words learned
