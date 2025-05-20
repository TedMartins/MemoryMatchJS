class MemoryGame {
  constructor() {
    this.cards = [];
    this.hasFlippedCard = false;
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
    this.points = 0;
    this.attempts = 0;

    this.board = document.querySelector(".game-board");
    this.audio = {
      bg: new Audio("./assets/sounds/guile_stage.mp3"),
      win: new Audio("./assets/sounds/you-win.mp3"),
      flip: new Audio("./assets/sounds/flip-card.mp3"),
      score: new Audio("./assets/sounds/1-up.mp3"),
      wrong: new Audio("./assets/sounds/wrong.mp3"),
    };

    this.characters = this.generateCharacterPairs();
    this.initializeEventListeners();
  }

  generateCharacterPairs() {
    const baseCharacters = [
      { name: "ryu", ext: "jpg" },
      { name: "ehonda", ext: "png" },
      { name: "blanka", ext: "jpg" },
      { name: "guile", ext: "jpg" },
      { name: "ken", ext: "jpg" },
      { name: "chunli", ext: "jpg" },
      { name: "zangief", ext: "jpg" },
      { name: "dhalsim", ext: "png" },
      { name: "balrog", ext: "png" },
    ];
    return [...baseCharacters, ...baseCharacters];
  }

  initializeEventListeners() {
    document
      .getElementById("startButton")
      .addEventListener("click", () => this.startGame());
  }

  startGame() {
    this.createBoard();
    this.audio.bg.play();
    this.audio.bg.loop = true;
    document.getElementById("startButton").style.display = "none";
    this.board.classList.remove("board-off");
  }

  createBoard() {
    this.board.innerHTML = "";
    const shuffled = this.shuffle([...this.characters]);

    shuffled.forEach((char) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.card = char.name;
      card.innerHTML = `
                <img src="./assets/img/${char.name}.${char.ext}" alt="${char.name}" class="card-face">
                <img src="./assets/img/cardback.png" alt="card back" class="card-back">
            `;
      card.addEventListener("click", (e) => this.handleCardFlip(e));
      this.board.appendChild(card);
    });

    this.cards = document.querySelectorAll(".card");
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  handleCardFlip(event) {
    if (this.lockBoard || event.currentTarget === this.firstCard) return;

    event.currentTarget.classList.add("flip");
    this.audio.flip.play();

    !this.hasFlippedCard
      ? this.setFirstCard(event.currentTarget)
      : this.setSecondCard(event.currentTarget);
  }

  setFirstCard(card) {
    this.hasFlippedCard = true;
    this.firstCard = card;
  }

  setSecondCard(card) {
    this.secondCard = card;
    this.checkMatch();
  }

  checkMatch() {
    this.firstCard.dataset.card === this.secondCard.dataset.card
      ? this.handleMatch()
      : this.handleMismatch();
  }

  handleMatch() {
    this.disableCards();
    this.audio.score.play();
    this.points++;

    if (this.points === 9) {
      document.getElementById("attempts").textContent = this.attempts;
      setTimeout(() => this.board.classList.add("board-off"), 500);
      setTimeout(() => {
        this.audio.win.play();
        this.openModal();
      }, 2000);
    }
  }

  handleMismatch() {
    this.lockBoard = true;
    this.attempts++;
    document.getElementById("attempts").textContent = this.attempts;

    setTimeout(() => {
      this.audio.wrong.play();
      this.resetCards();
    }, 600);
  }

  disableCards() {
    this.firstCard.removeEventListener("click", this.handleCardFlip);
    this.secondCard.removeEventListener("click", this.handleCardFlip);
    this.resetGameState();
  }

  resetCards() {
    this.firstCard.classList.remove("flip");
    this.secondCard.classList.remove("flip");
    this.audio.flip.play();
    this.resetGameState();
  }

  resetGameState() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  openModal() {
    document.querySelector(".modal-overlay").classList.add("active");
  }

  closeModal() {
    document.querySelector(".modal-overlay").classList.remove("active");
  }

  playAgain() {
    this.points = 0;
    this.attempts = 0;
    this.resetGameState();

    document.getElementById("attempts").textContent = this.attempts;
    this.closeModal();
    this.board.classList.remove("board-off");

    Object.values(this.audio).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });

    this.createBoard();
    this.audio.bg.play();
  }
}

const game = new MemoryGame();
