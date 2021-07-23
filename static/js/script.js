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
console.log(typeof cardCollection, cardCollection);

const user = blackjackDirectory['user'];
const bot = blackjackDirectory['bot'];
const hiterSound = new Audio(blackjackDirectory['sounds']['throw']);

document.querySelector('#blackjackHitButton')
.addEventListener('click',blackjackHit);
document.querySelector('#blackjackStandButton')
.addEventListener('click', blakcjackStand);




let userScoreCounter = 0;
let botScoreCounter = 0;
let botPlayCondition = true;



// user playing excutional funtion
function blackjackHit() { 
    if (botPlayCondition) {
        userScoreCounter = gameConditionChecker(userScoreCounter, cardCollection, blackjackDirectory, user);
        if (userScoreCounter > 21) {
            userScoreCounter = -1;
            console.log(userScoreCounter);
        }
    }else{
        gameNotification(`IT IS NOT YOUR TURN!!`, blackjackDirectory);
    }
     
}

// bot playing excutional funtion
function blakcjackStand() {

    if (botPlayCondition) {
        botScoreCounter = gameConditionChecker(botScoreCounter,cardCollection, blackjackDirectory, bot);
        if (userScoreCounter > 21) {
            userScoreCounter = -1;
            console.log(userScoreCounter);
        }
        botPlayCondition =false;
    }else{
        gameNotification(`DEALER HAS ALREADY PLAYED!!`, blackjackDirectory);
    }
     
    
}


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

// changes the game notificaitons
function gameNotification(resultText, blackjackDirectory) {
    document.querySelector(blackjackDirectory['scoreBoard']['id']).innerText = resultText;
    document.querySelector(blackjackDirectory['scoreBoard']['id']).style = 'color: red; font-weigh:bloder';
    if (resultText === 'YOU WON!!') {
        document.querySelector(blackjackDirectory['scoreBoard']['id']).style = 'color: green; font-weigh:bloder';
    }
    
}


// displays the score of players
function displayScores(score, player) {
    document.querySelector(player['scoreSpam']).innerText = score;
    console.log(document.querySelector(player['scoreSpam']));
    if (typeof score == 'string') {
        document.querySelector(player['scoreSpam']).style = 'color: red; font-weigh:bloder';
        
    }
}


// displays the picked cards
function displayCard(cardName, player, hiterSound) {

    const cardImg = document.createElement('img');
    cardImg.src = `static/img/${cardName}`;

    cardImg.height ='130';
    cardImg.width = `${imgAdapter(360, 500, 130)}`
    
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

