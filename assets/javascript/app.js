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

  var database = firebase.database();

  $("#submit").on("click", function(event){
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#first-train").val().trim();
    var frequency= $("#frequency").val().trim();

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTime,
        frequency: frequency
    };

    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");

  });

  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTrain;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
   console.log("First Time Converted: " + firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemaining = diffTime % frequency;
    console.log("Time remaining: " + tRemaining);

    var minutesToNextTrain = frequency - tRemaining;
    console.log("Minutes till next train: " + minutesToNextTrain);

    var nextTrain = moment().add(minutesToNextTrain, "minutes");
    var nextTrainDisplay = moment(nextTrain).format("hh:mm a");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainDisplay),
        $("<td>").text(minutesToNextTrain)
    );

    $("#train-data").append(newRow);

  })

});