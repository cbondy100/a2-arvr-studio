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

      try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized")
      } catch (err) {
        console.warn("Failed to connect to firebase")
      }

      // database
      const db = firebase.database()

      // creating our new Vue app

      new Vue({
        template: '<div id = "app"> <div>STARTER PAGE</div> </div>',
        computed: {

        },

        methods: {
            // game methods
    
        },

        data() {

        },

        mounted() {

        },
        el: "#app",
      })
}