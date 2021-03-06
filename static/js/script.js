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
                'A.png': [1, 11]
                
            },
    'sounds':{
        'throw':'static/sound/swish.m4a',
        'win':'static/sound/cash.mp3',
        'lost':'static/sound/aww.mp3'
    },
    'scoreBoard':{'id':'#gameNotifications'},
};

class Button{
    constructor(nameButton, idButton, classButton){
        this.nameButton = nameButton;
        this.idButton = idButton;
        this.classButton = classButton;
    }
    removeButtons(){
        document.querySelector(`#${this.idButton}`).remove();
    }
    addButtons(){
        const createdButton = document.createElement('button');
        createdButton.setAttribute('class',this.classButton);
        createdButton.setAttribute('id', this.idButton);
        createdButton.textContent = this.nameButton;
        document.querySelector('#buttonHolderDiv').appendChild(createdButton);
    }
}


// instantaite new Button
const hitButton = new Button('Hit', 'blackjackHitButton', 'btn-lg btn-primary font-weight-bold mr-2');
const standButton = new Button('Stand', 'blackjackStandButton', 'btn-lg btn-warning font-weight-bold');
const dealButton = new Button('Deal', 'blackjackDealButton', 'btn-lg btn-danger font-weight-bold')


let cardCollection = Object.keys(blackjackDirectory['ScoreCardCollection']);
// console.log(typeof cardCollection, cardCollection);

const user = blackjackDirectory['user'];
const bot = blackjackDirectory['bot'];
const hiterSound = new Audio(blackjackDirectory['sounds']['throw']);
const winSound = new Audio(blackjackDirectory['sounds']['win']);
const lostSound = new Audio(blackjackDirectory['sounds']['lost']);

document.querySelector('#blackjackHitButton')
            .addEventListener('click',blackjackHit);
document.querySelector('#blackjackStandButton')
            .addEventListener('click', blakcjackStand);




let userScoreCount = 0;
let botScoreCount = 0;
let botPlayCondition = true;
let userPlayedFirst = false;



// user playing excutional funtion
function blackjackHit() { 
    userPlayedFirst = true;
    if (botPlayCondition) {
        userScoreCount = gameConditionChecker(userScoreCount, cardCollection, blackjackDirectory, user);
        if (userScoreCount > 21) {
            userScoreCount = -1;
            console.log(userScoreCount);
            botPlayCondition = false;
        }
    }else{
        gameNotification(`YOU CAN'T PICK ANOTHER CARD!!`, blackjackDirectory);
    }
     
}

const sleep = (timeout) => 
     new Promise(resolve => setTimeout(resolve, timeout));

// bot playing excutional funtion
async function blakcjackStand() {
        if (userPlayedFirst) {
            

            // console.log(userScoreCount);
            let loopCounter = 0;
            while ((loopCounter < cardCollection.length)) {

                botScoreCount = gameConditionChecker(botScoreCount,cardCollection, blackjackDirectory, bot);
                await sleep(700);

                if ((botScoreCount > 21)) {
                    botScoreCount = -1;
                    break;
                    
                }else if (
                ((botScoreCount >= 17) && 
                (!cardCollection.includes('2.png') ||
                (!cardCollection.includes('A.png')) ||
                (!cardCollection.includes('3.png')) &&
                (!cardCollection.includes('4.png'))))
                    ) {
                        // console.log(botScoreCount);
                        break;
                    
                }else if ((botScoreCount >=  userScoreCount) ||
                        (botScoreCount >= 19)) {
                    break;
                } 
                loopCounter++;
            }


            botPlayCondition =false;


        let gameResults = winnerDeterminer(userScoreCount, botScoreCount);

        gameNotification(gameResults[3]['msg'], blackjackDirectory);
        if (gameResults[3]['msg'] === 'YOU LOST!!') lostSound.play();
        else if (gameResults[3]['msg'] === 'YOU WON!!') winSound.play();
        tableDataUpdater(gameResults);


            hitButton.removeButtons();
            standButton.removeButtons();
            dealButton.addButtons();

        document.querySelector('#blackjackDealButton').addEventListener('click',blackjackDealer);

    }else{
        gameNotification(`YOU HAVE TO PICK ATLEAST A CARD!!`, blackjackDirectory);
    }
    
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

    dealButton.removeButtons();
    hitButton.addButtons();
    standButton.addButtons();

    // reset base varibles
    userScoreCount = 0;
    botScoreCount = 0;
    botPlayCondition = true;
    userPlayedFirst = false;
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


    // // second way
    // let imgTages = document.querySelector(id).querySelectorAll('img');
    // console.log(typeof imgTages, imgTages);
    // for(let key in imgTages){
    //     console.log(imgTages[key]);
    //     imgTages[key].remove();
    // }
        

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
        if (cardName === "A.png") {
            if (blackjackDirectory['ScoreCardCollection'][cardName][1] + scoreCounter <= 21) {
                console.log((blackjackDirectory['ScoreCardCollection'][cardName][1]));
                scoreCounter += blackjackDirectory['ScoreCardCollection'][cardName][1];
                return scoreCounter
            }else{
                scoreCounter += blackjackDirectory['ScoreCardCollection'][cardName][0];
                return scoreCounter
            }
            
        }else{

       
        scoreCounter +=  blackjackDirectory['ScoreCardCollection'][cardName];
        // console.log(scoreCounter);
        return scoreCounter
        }

    } else{
        return -1
        // console.log(scoreCounter);
        // return scoreCounter
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
        document.querySelector(player['scoreSpam'])
                                .style = 'color: red; font-weigh:bloder';
        
    }else if (typeof score == 'number') {
        document.querySelector(player['scoreSpam'])
                                .style = 'color: white; font-weigh:bloder';
    }
}


// displays the picked cards
function displayCard(cardName, player, hiterSound) {

    const cardImg = document.createElement('img');
    cardImg.src = `static/img/${cardName}`;

    cardImg.height ='150';
    cardImg.width = `${imgAdapter(360, 500, parseInt(cardImg.height))}`
    
    cardImg.setAttribute('style',
                        `margin:5px;
                         text-align:center;
                          border-radius:10px;
                           background-color:white`);
    cardImg.setAttribute('class', 'imgTagePhoneDisplay');
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
