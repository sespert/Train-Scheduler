$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCIlbZOxg3E7by7nl8wJxnWAMEN2qs8NmE",
    authDomain: "trainscheduler-93200.firebaseapp.com",
    databaseURL: "https://trainscheduler-93200.firebaseio.com",
    projectId: "trainscheduler-93200",
    storageBucket: "trainscheduler-93200.appspot.com",
    messagingSenderId: "697279589770"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();
  
  //When user clicks on submit button, after filling the forms
  $("#submit").on("click", function(event){
    
    //Prevent form from submitting
    event.preventDefault();

    //Capture user input for each field
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#first-train").val().trim();
    var frequency= $("#frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTime,
        frequency: frequency
    };

    //Uploads train data to the database
    database.ref().push(newTrain);

    //Logs to the console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert("You succesfully added a Train");

    //Clear all the text boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");

  });

  //Create Firebase event for adding a train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTrain;

    //Move the time entered one year back so we make sure the current time is after
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("First Time Converted: " + firstTimeConverted);

    //Variable to calculate the nect train based on current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //Calculate the difference in time between current and the one entered by user
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    //Calculate the remaining of difference in time divided by frequency to calculate next train
    var tRemaining = diffTime % frequency;
    console.log("Time remaining: " + tRemaining);

    //Calculate minutes to next train
    var minutesToNextTrain = frequency - tRemaining;
    console.log("Minutes till next train: " + minutesToNextTrain);

    //Add minutes to next train to current time to display time of next train
    var nextTrain = moment().add(minutesToNextTrain, "minutes");
    var nextTrainDisplay = moment(nextTrain).format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

    //Append all this info to the table
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainDisplay),
        $("<td>").text(minutesToNextTrain)
    );
    
    //Prevents filling the table with incomplete form
    if((trainName !== '') || (destination !== '') || (frequency !== '') || (firstTime !== '')) {
      $("#train-data").append(newRow);
    }
  })
});

