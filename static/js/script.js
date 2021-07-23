const blackjackDirectory = {
    'user':{'scoreSpam':"#userCounterScore",
            'div': '#userSideDiv',
            'userScore':0 },
    'bot':{'scoreSpam':"#botCounterScore",
            'div': '#botSideDiv',
            'botScore':0 },
    'ScoreCardCollection' : {
                '2.png':2,
                '3.png':3,
                '4.png':4,
                '5.png':5,
                '6.png':6,
                '7.png':7,
                '8.png':8,
                '9.png':9,
                '10.png':10,
                'J.png':10,
                'Q.png':10,
                'K.png':10,
                'A.png':11
                
            },
    'sounds':{
        'throw':'static/sound/swish.m4a',
        'win':'static/sound/cash.mp3',
        'loss':'static/sound/aww.mp3'
    },
    'scoreBoard':{'id':'#gameNotifications'},
};



let cardCollection = Object.keys(blackjackDirectory['ScoreCardCollection']);
// console.log(typeof cardCollection, cardCollection);

const user = blackjackDirectory['user'];
const bot = blackjackDirectory['bot'];
const hiterSound = new Audio(blackjackDirectory['sounds']['throw']);

document.querySelector('#blackjackHitButton')
.addEventListener('click',blackjackHit);
document.querySelector('#blackjackStandButton')
.addEventListener('click', blakcjackStand);




let userScoreCount = 0;
let botScoreCount = 0;
let botPlayCondition = true;



// user playing excutional funtion
function blackjackHit() { 
    if (botPlayCondition) {
        userScoreCount = gameConditionChecker(userScoreCount, cardCollection, blackjackDirectory, user);
        if (userScoreCount > 21) {
            userScoreCount = -1;
            console.log(userScoreCount);
        }
    }else{
        gameNotification(`IT IS NOT YOUR TURN!!`, blackjackDirectory);
    }
     
}

// bot playing excutional funtion
function blakcjackStand() {

    if (botPlayCondition) {
        // console.log(userScoreCount);
        let loopCounter = 0;
        while ((loopCounter < cardCollection.length)) {

            

            botScoreCount = gameConditionChecker(botScoreCount,cardCollection, blackjackDirectory, bot);
            if ((botScoreCount > 21)) {
                botScoreCount = -1;
                break;
                
            }else if (
            ((botScoreCount >= 17) && 
            (!cardCollection.includes('2.png') ||
             (!cardCollection.includes('3.png')) &&
             (!cardCollection.includes('4.png'))))
                ) {
                    // console.log(botScoreCount);
                    break;
                
            }else if ((botScoreCount >=  userScoreCount)) {
                break;
            } 
            loopCounter++;
        }


        botPlayCondition =false;
    }else{
        gameNotification(`DEALER HAS ALREADY PLAYED!!`, blackjackDirectory);
    }

    let gameResults = winnerDeterminer(userScoreCount, botScoreCount);

    gameNotification(gameResults[3]['msg'], blackjackDirectory);
    tableDataUpdater(gameResults);
        const newButton = {
            'oldButtons':{'Hit':{'name':'Hit', 'id':'blackjackHitButton', 'class':'btn-lg btn-primary font-weight-bold mr-2'},
            "Stand":{'name':'Stand', 'id':"blackjackStandButton", 'class':'btn-lg btn-warning font-weight-bold mr-2'}},
            'newButtons':{'Deal':{'name':'Deal', 'id':"blackjackDealButton", 'class':'btn-lg btn-danger font-weight-bold'}},
        }
        buttomReaseter(newButton);
        
    
    document.querySelector('#blackjackDealButton').addEventListener('click',blackjackDealer);

     
    
}



function blackjackDealer() {

    // reset and remove the tages
    gameNotification("Let's Play Again!", blackjackDirectory);
    displayScores(0, user)
    displayScores(0, bot)
    
    // remove the img tages
    removeImgTage('#userSideDiv');
    removeImgTage('#botSideDiv');


    // rebuild buttons
    const newButton = {
        'oldButtons':{'Deal':{'name':'Deal', 'id':"blackjackDealButton", 'class':'btn-lg btn-danger font-weight-bold'}},
        'newButtons':{'Hit':{'name':'Hit', 'id':'blackjackHitButton', 'class':'btn-lg btn-primary font-weight-bold mr-2'},
        "Stand":{'name':'Stand', 'id':"blackjackStandButton", 'class':'btn-lg btn-warning font-weight-bold mr-2'}},
    }
    buttomReaseter(newButton);

    // reset base varibles
    userScoreCount = 0;
    botScoreCount = 0;
    botPlayCondition = true;
    cardCollection = Object.keys(blackjackDirectory['ScoreCardCollection']);
    console.log(typeof cardCollection, cardCollection);

    // call on buttons
    document.querySelector('#blackjackHitButton')
    .addEventListener('click',blackjackHit);
    document.querySelector('#blackjackStandButton')
    .addEventListener('click', blakcjackStand);

    
}


// img tage remove function
function removeImgTage(id) {
    let imgTageDiv = document.querySelector(id);
    while (imgTageDiv.firstChild) {
        imgTageDiv.removeChild(imgTageDiv.firstChild);
        
    }   
}


// back-end
// check the game conditions
function gameConditionChecker(scoreCounter, cardCollection, blackjackDirectory, player) {
    if (scoreCounter < 21) {
        
        let cardName = randomPickUpCard(cardCollection);
        let cardNameIndex = cardCollection.indexOf(cardName);
        // console.log(cardNameIndex);
        cardCollection.splice(cardNameIndex, 1);
         
        scoreCounter = scoreCounters(blackjackDirectory, cardName, scoreCounter);
        // console.log(scoreCounter);
        // console.log(cardCollection);
        displayCard(cardName, player, hiterSound);

        if (scoreCounter <= 21) {
            
            displayScores(scoreCounter,player);
            
        }else{
            displayScores("ARE BUSTED!!", player);
        }

    }
    return scoreCounter
    
}



// Determine the winner and msg text: return a msg text and results in an array
// return [botPoint, drawPoint, userPoint, {msg:text}]
function winnerDeterminer(userScore, botScore) {
    if(botScore > userScore){
        return [1, 0, 0 , {'msg':'YOU LOST!!'}]
    }else if (userScore === botScore) {
        return [0, 1, 0, {'msg':'DRAW!!'}]
    }else{
        return [0, 0 , 1, {'msg':'YOU WON!!'}]
    }
    
}


// Picks Card randomly 
function randomPickUpCard(cardCollection) {
    return cardCollection[Math.floor(Math.random() * cardCollection.length)]
    
}

// Score Counter fucntion
function scoreCounters(blackjackDirectory, cardName, scoreCounter) {
    if (scoreCounter < 21) {
        let cardScore = blackjackDirectory['ScoreCardCollection'][cardName];
        scoreCounter += cardScore;
        return scoreCounter

    } else{
        return -1
    }



}


// font-end
// changes the game notificaitons
function gameNotification(resultText, blackjackDirectory) {
    document.querySelector(blackjackDirectory['scoreBoard']['id']).innerText = resultText;
    document.querySelector(blackjackDirectory['scoreBoard']['id'])
    .style = 'color: red; font-weigh:bloder';

    if (resultText === 'YOU WON!!') {
        document.querySelector(blackjackDirectory['scoreBoard']['id'])
        .style = 'color: green; font-weigh:bloder';
    }else if (resultText === 'DRAW!!') {
        document.querySelector(blackjackDirectory['scoreBoard']['id'])
        .style = 'color:  #f8c300 ; font-weigh:bloder';
        
    }else if (resultText === "Let's Play Again!") {
        document.querySelector(blackjackDirectory['scoreBoard']['id'])
        .style = 'color:  #05DCFA ; font-weigh:bloder';
        
    }
    
}


// displays the score of players
function displayScores(score, player) {
    document.querySelector(player['scoreSpam']).innerText = score;
    // console.log(document.querySelector(player['scoreSpam']));
    if (typeof score == 'string') {
        document.querySelector(player['scoreSpam']).style = 'color: red; font-weigh:bloder';
        
    }else if (typeof score == 'number') {
        document.querySelector(player['scoreSpam']).style = 'color: white; font-weigh:bloder';
    }
}


// displays the picked cards
function displayCard(cardName, player, hiterSound) {

    const cardImg = document.createElement('img');
    cardImg.src = `static/img/${cardName}`;

    cardImg.height ='150';
    cardImg.width = `${imgAdapter(360, 500, parseInt(cardImg.height))}`
    
    cardImg.setAttribute('style',
    'margin:5px; text-align:center; border-radius:10px; background-color:white');
    document.querySelector(player['div']).appendChild(cardImg);
    hiterSound.play();

    
}

// adapts the imgs
function imgAdapter(oldWidth, oldHeight, newHeight) {
    const ratio = oldWidth/oldHeight;
    let newWidth = ratio * newHeight;
    return newWidth
    
}

// passing game scores to table
// gameResults: [botPoint, drawPoint, userPoint, {msg:text}]
function tableDataUpdater(gameResults) {
    document.querySelector('#botWins').innerText = 
    parseInt(document.querySelector('#botWins').innerText) + gameResults[0];
    document.querySelector('#drawGames').innerText = 
    parseInt(document.querySelector('#drawGames').innerText) + gameResults[1];
    document.querySelector('#userWins').innerText = 
    parseInt(document.querySelector('#userWins').innerText) + gameResults[2];


    
}



// const newButton = {
//     'oldButtons':{'Hit':{'id':'blackjackHitButton', 'class':'btn btn-primary'},
//     "Stand":{'id':"blackjackStandButton", 'class':'btn btn-warning'}},
//     'newButtons':{'Deal':{'id':"blackjackDealButton", 'class':'btn btn-danger'}},
// }


// buttom reseter
function buttomReaseter(newButton) {
    // remove the old buttons
    for(key in newButton['oldButtons']){
        document.querySelector(`#${newButton['oldButtons'][key]['id']}`).remove();

    }
    for(key in newButton['newButtons']){
        // console.log(newButton['newButtons'][key]);
        let createdButton = document.createElement('button');
        createdButton.setAttribute('class',newButton['newButtons'][key]['class']);
        createdButton.setAttribute('id', newButton['newButtons'][key]['id']);
        createdButton.textContent = newButton['newButtons'][key]['name'];
        document.querySelector('#buttonHolderDiv').appendChild(createdButton);
    }
    
}