// Vue application

window.onload = function(e) {
    console.log("Connecting to firebase")

    // firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyA5uAx9-ja-kz3ro7_ZS7DnfYt1foFuiYs",
        authDomain: "a2-arvr-studio.firebaseapp.com",
        projectId: "a2-arvr-studio",
        storageBucket: "a2-arvr-studio.appspot.com",
        messagingSenderId: "764802389077",
        appId: "1:764802389077:web:c25defbea7324f869db0dc",
        measurementId: "G-13M3MY56RD"
      };
      
      // init our firebase application
      try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized")
      } catch (err) {
        console.warn("Failed to connect to firebase")
      }

      // database
      const db = firebase.database()
      const game = db.ref("game")

      const newPlayerRef = game.child('players').push();

      const gameState = game.child('gameState');

      const wordRef = newPlayerRef.child('word');

      let player = {
        name: "", 
        word: "",
        submitted: false,
        joined: false
      }
      
      // creating our new Vue app
      new Vue({
        template: `<div id = "app"> 
        
          <h3> GUESSING GAME </h3>
          <p>You and a partner must guess the <strong>same word</strong> using only previous guesses as clues for what each other is thinking.</p>
          <p>Start with a random word and try to win the game in as few guesses as possible!</p>
          <p> Choose a player name:</p>
          <input v-model="newPlayerRef.name" />
          <button id="join" @click="joinGame" :disabled="!canEnterName">Join Game</button>
          <button id="start" @click="startGame" :disabled="canStartGame">Start Game</button>
          <button @click="resetGame">RESET GAME</button>
          <div id="start_div"">
          </div>
          <div v-show="gameState">
            <p> LETS PLAY A GAME <p> 
            <input v-model="newPlayerRef.word" />
            <button @click="submitWord"> Submit Word </button>
            <div id="guesses"> 
            </div>
          </div>`,
        computed: {

          

          canStartGame() {
            game.child('players').on('value', (snapshot) => {
              const players = snapshot.val()
              const num_players = snapshot.numChildren()
              if (num_players == 2){
                return true
              } else {
                return false
              }
            })
          },

          canEnterName() {
            if(this.newPlayerRef.name != null && this.newPlayerRef.name != ""){
              return true
            } else {
              return false
            }
          }

        },

        methods: {
            // game methods
            // join game method
            joinGame(){

              if(newPlayerRef.name != "") {
                console.log("Player joined game")
                start_message = document.createElement("div");
                start_message.innerText = "You successfully joined the game as '" + newPlayerRef.name + "'. Once your partner joins, press 'Start Game'";
                start_div.appendChild(start_message);
              
                newPlayerRef.set({
                  id: newPlayerRef.key,
                  name: newPlayerRef.name,
                  submitted: false,
                })
                wordRef.set("")
              } else {
                console.log("Can not join game without player name")
              }

              // make buttons not clickable now
            },

            startGame(){
              console.log("starting game")
              gameState.set(true)
            },

            resetGame() {
              // From ChatGPT
              db.ref('game').remove().then(function() {
                console.log("Database cleared successfully.");
                gameState.set(false)
                // from chatGPT
                

              }).catch(function(error) {
                console.error("Error clearing database:", error);
              });
            },

            submitWord() {
              this.newPlayerRef.update({
                word: newPlayerRef.word
              })
              guess = document.createElement("div");
              guess.innerText = "Your guess is " + newPlayerRef.word;
              guesses.appendChild(guess);
            }
        },

        watch: {
          "newPlayerRef.name" () {
            console.log("New Name:", this.newPlayerRef.name)
        },
 ///         "player2.name" () {
  ///          console.log("New Name:", this.player2.name)
//          }
        },
        

        data() {
          return {

            newPlayerRef: newPlayerRef,
            gameState: gameState,
   ///         player1: player1,
    ///        player2: player2
          }
        },

        mounted() {

          const guesses = document.getElementById("guesses");
          const start_div = document.getElementById("start_div")

        },

        created() {

            game.child('gameState').on('value', (snapshot) => {
              this.gameState = snapshot.val()
              console.log("state", this.gameState)
              if (this.gameState == false){
                while (guesses.firstChild) {
                  guesses.removeChild(guesses.firstChild);
                }
              } else {
                while (start_div.firstChild) {
                  start_div.removeChild(start_div.firstChild);
                }
              }                    
              
              var join = document.getElementById("join");
              join.hidden = false;
              var start = document.getElementById("start");
              start.hidden = false;

            })
            
            game.child('players').on('value', (snapshot) => {
              var count = 0
              var word_list = []
              var word = null
              snapshot.forEach(function(childSnapshot) {
                word = childSnapshot.child('word').val();
                if(word){
                  word_list.push(word)
                  console.log("WORD", word_list)
                  count++;
                  console.log("COUNT", count)
                }

                if(count == 2) {
                  guess = document.createElement("div");
                  guess.innerText = "You and your partner guessed " + word_list[0] + " and " + word_list[1] + "!";
                  guesses.appendChild(guess);
                  if(word_list[0] == word_list[1]) {
                    console.log("WIN")
                    guess = document.createElement("div");
                    guess.innerText = "You and your partner matched guesses! You WIN!!!!!!";
                    guesses.appendChild(guess);
                    var join = document.getElementById("join");
                    join.hidden = true;
                    var start = document.getElementById("start");
                    start.hidden = true;
                    count = 0
                    newPlayerRef.update({
                      word: ""
                    })
                    word_list = []
                    word = null
                    console.log(word_list)
                  }
                }
                
              });

            })
          
        },
        el: "#app",
      })
}