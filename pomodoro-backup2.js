$(document).ready(function(){
  var rotation; var increment; var timer; var alltimers = [];
  var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];

  var worktime = {time: 0.5, state: "work", col: "rgb(122, 200, 22)"}
  var breaktime = {time: 0.5, state: "break", col: "rgb(233, 153, 0)"}
  var current = worktime;
  var time = current.time*60;
  var audio = document.createElement('audio');
  audio.setAttribute('src', 'ding/ding.mp3');

function fill(rotation){
  for(i in transform_styles) { 
    $('.circle .fill, .circle .mask.full').css(transform_styles[i], 'rotate(' + rotation/2 + 'deg)');
    $('.circle .fill.fix').css(transform_styles[i], 'rotate(' + rotation + 'deg)');
  }
}
function displayState(state){
  $('.button').css('display', 'block');
  $('#' + state).addClass('highlight');
}
function transitionToCounter(state){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  $('.mask, .fill').addClass('animate');
  $('.button').removeClass('active highlight');
  $('#' + state).addClass('active');
  $("#ball").fadeOut(100);
  rotation = 360;
  increment = 360/time;
  fill(rotation);
  setTimeout(function(){ $('.mask, .fill').removeClass('animate'); }, 1000);
}
function transitionToSetting(){
 $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  $('.mask, .fill').addClass('animate');
  $('.button').removeClass('active highlight');
  $('#' + current.state).addClass('highlight');
  rotation = 360/90 * current.time;
  TweenLite.set(ball, {rotation: rotation});
  fill(rotation);
  setTimeout(function(){ $('.mask, .fill').removeClass('animate'); $('#ball').fadeIn(100); }, 1000);
}
function setColor(color){
  // $("#ball").addClass('orange');
  $("#ball").css('background', 'radial-gradient(circle at 0.25em 0.25em,'+color+', #1F1800)');
  $('.timer').css('color', color);
  $('.fill').css('background-color', color);
  $('#'+current.state).removeClass('highlight active')
}
function setState(state){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  current = state;
  setColor(current.col);
  ClearAllIntervals();
  transitionToSetting();
  setTime();
  setTimer();
  $('.timer').one("click", startTimer);
}
function setTime(){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  current.time = Math.floor(rotation/4);
  if (current.time < 1) { current.time = 1; }
  time = Math.round(current.time*60);
}
function setTimer(){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  $('.timer').html(("0" + Math.floor(time/60)).slice(-2)+':'+ ("0" + time%60).slice(-2));
}
function endTimer(){
  ClearAllIntervals();
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  audio.play();
  if (current === worktime){
    current = breaktime;
  } else {
    current = worktime;
  }
  // setColor(current.col);
  // startTimer();
  time = current.time*60;
  setColor(current.col);
  transitionToCounter(current.state);
  setTimer();
  countDown();
  $(this).one("click", pauseTimer);
}
function countDown(){
 $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  if (!timer){
    timer = setInterval(function() {
      if (time <= 0) {
        endTimer();
      } else { 
        time-=1;
        rotation-=increment;
        fill(rotation);
        setTimer();
      }
    }, 1000);
    alltimers.push(timer);
  }

}
function ClearAllIntervals() {
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  // for (var i = 1; i < 99999; i++) {window.clearInterval(i);}
  clearInterval(timer);
  timer = false;
}
function startTimer(){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  displayState(current.state)
  // $('#break').html("startTimer");
  transitionToCounter(current.state)
  setTimer();
  countDown();
  $(this).one("click", pauseTimer);
}
function resumeTimer(){
  $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  // $('#break').html("resumeTimer");
  setTimer();
  countDown();
  $(this).one("click", pauseTimer); 
}
function pauseTimer(){
  // $('#break').html("pauseTimer");
 ClearAllIntervals();
 $('#msg').html("current timer: " + timer + ", all timers: " + alltimers);
  $(this).one("click", resumeTimer); 
}
function onRotateball() {
  rotation = dragball.rotation;
  displayState(current.state);
  fill(rotation);
  setTime();
  setTimer();
  // $('.timer').html(("0" + current.time).slice(-2) + ":00");
}
var ball = document.getElementById("ball-circle");

Draggable.create(ball, {
  type: "rotation",
  // throwProps:true,
  edgeResistance: 1,
  bounds: {minRotation: 0, maxRotation: 360},
  // onDragStartTimer: showControls,
  onDrag: onRotateball,
  // onRelease: resumeTimer(),
  // snap: function(endValue) { 
  //   return Math.round(endValue / 90) * 90;
  // }
});
var dragball = Draggable.get(ball);

  // function updateBall(rotation){
  //   TweenLite.set(ball, {rotation: 180});
  //   dragball.update();
  // }

  $('.timer').one("click", startTimer);
  $('#work').click(function(){
    setState(worktime);
  })
  $('#break').click(function(){
    setState(breaktime);
  })

});

