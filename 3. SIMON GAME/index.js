var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red","blue","green","yellow"];
var headinglevel = 0;
var started = false;
var userindex = -1;
var gameindex = -1;

$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + headinglevel);
    nextSequence();
    started = true;
  }
});

function nextSequence()
{
  headinglevel++;
  $("#level-title").text("Level " + headinglevel);
  var randomNumber = Math.floor(Math.random()*10)%4;
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  gameindex++;
  userindex = -1;
  userClickedPattern = [];
  playSound(randomChosenColour);
  animatePress(randomChosenColour);
}

$(".btn").click(function(){
   var userChosenColour = $(this).attr("id");
   userClickedPattern.push(userChosenColour);
   userindex++;
   playSound(userChosenColour);
   animatePress(userChosenColour);
   check();
});

function check()
{
if(userClickedPattern[userindex]==gamePattern[userindex])
{
  console.log("ok");
  if(userindex == gameindex)
  setTimeout(function () {nextSequence();}, 1000);
  else
  console.log("ok");
}
else
{
  $("#level-title").text("Game Over...Click button to restart");
  setTimeout(function () {playSound("wrong");}, 1000);
  restart();
}
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function restart()
{
  started = false;
  gamePattern = [];
  userClickedPattern = [];
  headinglevel = 0;
  userindex = -1;
  gameindex = -1;
}
