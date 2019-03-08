// Initialize Firebase
var config = {
    apiKey: "AIzaSyAH5Rwb3uehGpaKKclINHz2Bv8ZdnvbXg4",
    authDomain: "getreadygo-ddf94.firebaseapp.com",
    databaseURL: "https://getreadygo-ddf94.firebaseio.com",
    projectId: "getreadygo-ddf94",
    storageBucket: "getreadygo-ddf94.appspot.com",
    messagingSenderId: "560336263158"
};

firebase.initializeApp(config);

var database = firebase.database();

//main object for app
var getReady = {
    pointsForToday: 0,
    totalPoints: 0,
    toDo: ["Go to the bathroom", "Brush your teeth!", "Get dressed", "Take your medicine", "Brush your hair", "Feed Belley Sue"],
    numMinRange: 10,
    numMaxRange: 100,
    doneCount: 0,

    displaytoDoButtons: function () {
        $("#startToDos").remove();
        $("#helpText").remove();
        // Loops through the toDo array and add buttons for each item to the page
        for (var i = 0; i < getReady.toDo.length; i++) {
            var newButton = $("<button>");
            newButton.addClass("btn m-2 text-white toDoItem");
            newButton.text(getReady.toDo[i]);
            newButton.appendTo($("#toDoDiv"));
        }
    },

    // returns a random number between the provided min and max parameters
    generateRandomNumber: function (minNum, maxNum) {
        var randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        return randomNumber;
    },

    //as tasks are completed, check to see if it is the last task
    checkProgress: function () {
        getReady.doneCount++;
        if (getReady.doneCount === getReady.toDo.length) {
            getReady.allDone();
        }
    },

    //open the modal with a gif
    //assign and store points
    //show points on the screen
    allDone: function () {
        getReady.pointsForToday = getReady.generateRandomNumber(getReady.numMinRange, getReady.numMaxRange);
        $("#todaysPointsDiv").text("Today's Points: " + getReady.pointsForToday);
        
        getReady.totalPoints += getReady.pointsForToday; 

        database.ref().set({
            totalPoints: getReady.totalPoints
        });

        $("#totalPointsDiv").text("Total Points: " + getReady.totalPoints);

        //ajax call to get a random cat gif 
        var queryURL = "https://api.giphy.com/v1/gifs/random?tag=cat&api_key=u3giqHSfEtSVIA0wn4xD9qv57xRCqvka&rating=g";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After the data comes back from the API
            .then(function (response) {
                console.log(response);
                $("#gifForToday").attr("src", response.data.images.original.url)
                $("#showProgressModal").modal('show');
        })
    },

}

        //Start the list
        $(document).ready(function () {
            $("#startToDos").on("click", function () {
                getReady.displaytoDoButtons();
            });
        });

        //disble the buttons as they are marked done and check progress
        $(document.body).on("click", ".toDoItem", function () {
            $(this).prop("disabled", true);
            getReady.checkProgress()
        });

        //set total points from snapshot
        database.ref().on("value", function (snapshot) {
            if (snapshot.child("totalPoints").exists()) {
            getReady.totalPoints = snapshot.val().totalPoints;
            }
        }); 