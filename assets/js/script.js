const cards = document.querySelectorAll('.card');
const board = document.querySelector('.game-board');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let points = 0;
const bgMusic = new Audio('./assets/sounds/guile_stage.mp3');
const youWin = new Audio('./assets/sounds/you-win.mp3');
const flip_card = new Audio('./assets/sounds/flip-card.mp3');
const scored = new Audio('./assets/sounds/1-up.mp3');
const wrong = new Audio('./assets/sounds/wrong.mp3');
let attempts = 0;

function flipCard() {
    if(lockBoard) return;
    if(this === firstCard) return;
    this.classList.add('flip');
    flip_card.play();
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    flip_card.play();
    hasFlippedCard = false;
    checkForMatch();
}

function checkForMatch() {
    if(firstCard.dataset.card === secondCard.dataset.card) {
        disabledCards();
        scored.play();
        points ++;
        attempts ++;
        if (points == 9) {
            document.getElementById('attempts')
            .innerHTML = attempts; 
            setTimeout(() => {
                board.classList.add('board-off');
            }, 500);
            setTimeout(() => {
                youWin.play();
                Modal.open();
            }, 2000);
        }
        return;
    } 
    unflipCards();
}

function disabledCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => { 
        wrong.play();
        attempts++;
    }, 600);
    setTimeout(() => { 
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        flip_card.play();
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


(function shuffleCards() {
    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * 18);
        card.style.order = randomPosition;
        bgMusic.play();
    })
})();

const Modal = {
    open(){
        document.querySelector('.modal-overlay')
        .classList.add('active');
    },
    close(){
        document.querySelector('.modal-overlay')
        .classList.remove('active');
    }
}

function playAgain() {
    document.location.reload();
}

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
});

