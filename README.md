# BabyBot

## Setup

1. `npm install tmi.js`
2. Clone the master branch of BabyBot project
3. Use command prompt/terminal to navigate to the project folder
4. run program using `node main.js`
5. Force to kill the program with **ctrl-c**

## main.js
- Create class objects of the program
- Initialize each class

## twitchHandler.js
- Handles connection with Twitch
- Sends chat message to babyBotChannel.js to get response from babyBot

### connectionSetting.json
- Contains connection setting to Twitch
- Defines message parsing symbols
- Defines interval for calling functions

## babyBotChannel.js
- Facilitates communication between babyBot and twitchHandler
- setMethods acts as a registrator which registers methods from babyBot and twitchHandler to be used

## babyBot.js
- The core logic of the bot
- Stores bot information
- Switches between states based on event

### botState.json
- Defines bot age conversion rule
- Stores bot age
- Stores available states
- Stores bot username
- Stores words learned

### babyBotNormalState.js
#### normalState.json
- Normal state of the bot

### babyBotCryingState.js
#### cyringState.json
- Crying state of the bot
- Will keep on sending crying message until users use !Hold command
- Sends whisper to the user who used the Hold command
- If other users who are not holding the not use command while the bot is being held, the bot will tell the chat who is currently holding the bot
- The user who is holding the bot can put down the bot using the !PutDown command in whisper
- If the user who is holding the bot tries to use other command in the chat, the bot will whisper to the user telling him/her he is holding the bot right now
- Goes back to Normal state once the bot is being held certain amount of time

### babyBotNappingState.js
#### nappingState.json
- Napping state of the bot
- Does not respond to any message for a period of time
- Goes back to Normal state once the bot is awake

### babyBotDiaperChangingState.js
#### diaperChangeState.json
- Needs to change diaper
- Will keep on sending request until users used the Change command
- Goes back to Normal state once the diaper is changed

### Bot Flow Diagram
(https://github.com/ihwang1/BabyBot/blob/master/Design/BabyBot%20Flow.jpg)

