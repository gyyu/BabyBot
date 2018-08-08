# BabyBot

## Setup

1. `npm i tmi.js`
2. Clone the master branch of BabyBot project
3. Use command prompt/terminal to navigate to the project folder
4. run program using `node main.js`
5. Force to kill the program with **ctrl-c**

## Features

1. Bot will age from 0 to 3 years old (set in botSetting.json)
2. Default State of bot is Normal state where it will "learn" and converse with users
3. Bot will triggered random events after a certain amount of time (set in normalState.json)
4. Bot maintains a point system to weight user influence
5. Bot will record conversations of users who consent to participate in the research

## Events
### Crying
- When the bot starts to cry, users have to hold the bot a certain amount of time (set in cryingState.json)
- User can put down the bot. If the held time is not fulfilled, the bot will resume crying
- Users can put the bot to sleep using the Nap command

### Napping
- Bot will go to sleep for a certain amount of time (set in napState.json)
- While it is asleep, the bot will not have any interaction with the chat

### Diaper Changing
- Bot will request the chat to change its diaper

### Hungry
- Bot will ask the chat to feed it
- Bot will have different reaction based on its liking of the food
- If bot is being fed with something it never had before, it will eat and decide if it like the food


### Bot Flow Diagram
![alt text](https://github.com/ihwang1/BabyBot/blob/master/Design/BabyBot%20Flow.jpg "BabyBot Flow Chart")

