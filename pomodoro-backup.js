  var clock; var rotation; var increment; var dragball; var audio;
  var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];

  var worktime = {time: 25, state: "work"}
  var breaktime = {time: 5, state: "break"}
  var current = worktime;
  var time = current.time*60;

function fill(rotation){
  for(i in transform_styles) { 
    $('.circle .fill, .circle .mask.full').css(transform_styles[i], 'rotate(' + rotation/2 + 'deg)');
    $('.circle .fill.fix').css(transform_styles[i], 'rotate(' + rotation + 'deg)');
  }
}

function displayState(state){
  $('.button').css('display', 'block');
  $('#' + state).css('color', 'rgba(122, 200, 22, 1)');
}

function transitionToCounter(state){
  $('.mask, .fill').addClass('animate');
  $('#' + state).addClass('active');
  $("#ball").hide();
  rotation = 360;
  increment = 360/time;
  fill(rotation);
  setTimeout(function(){ $('.mask, .fill').removeClass('animate'); }, 1000);
}

function setTimer(){
  $('.timer').html(("0" + Math.floor(time/60)).slice(-2)+':'+ ("0" + time%60).slice(-2));
}

function startTimer(){
  transitionToCounter(current.state)
  setTimer();
  countDown();
  $(this).one("click", pauseTimer);
}

function endTimer(){
  clearInterval(clock);
  audio.play();
  if (current === worktime){
    current = breaktime;
  } else {
    current = worktime;
  }
  time = current.time*60;
  
  $("#ball").css('background', 'radial-gradient(circle at 0.25em 0.25em, #FFA700, #1F1800)');
  $('.timer').css('color', '#FFA700');
  $('.fill').css('background-color', '#FFA700');
  $('.mask, .fill').addClass('animate');
  rotation = 360;
  increment = 360/time;
  fill(rotation);
  setTimeout(function(){ $('.mask, .fill').removeClass('animate'); }, 1000);
  setTimer();
  countDown();
  $(this).one("click", pauseTimer);
}

function countDown(){
  clock = setInterval(function() {
    if (time <= 0) {
      endTimer();
    } else { 
      time-=1;
      rotation-=increment;
      fill(rotation);
      setTimer();
    }
  }, 1000);
}

function resumeTimer(){
  setTimer();
  countDown();
  $(this).one("click", pauseTimer); 
}

function pauseTimer(){
  clearInterval(clock);
  $(this).one("click", resumeTimer); 
}

function setWork(){
  $('#ball').show();
  clearInterval(clock); 
  fill(dragball.rotation);
  $('.timer').one("click", startTimer);
}



function setTime(){
  current.time = Math.floor(rotation/4);
  if (current.time < 1) { current.time = 1; }
  time = Math.round(current.time*60);
}

function onRotateball() {
  rotation = dragball.rotation;
  displayState(current.state);
  fill(rotation);
  setTime();
  setTimer();
  // $('.timer').html(("0" + current.time).slice(-2) + ":00");
  }

$(document).ready(function(){
  audio = document.createElement('audio');
  audio.setAttribute('src', 'ding/ding.mp3');

  var ball = document.getElementById("ball-circle");
  $('.timer').one("click", startTimer);
  $('#work').click(function(){
    setWork();
  })

  Draggable.create(ball, {
    type:"rotation",
    // throwProps:true,
    edgeResistance: 1,
    bounds:{minRotation: 0, maxRotation: 360},
    // onDragStartTimer: showControls,
    onDrag: onRotateball,
    // onRelease: resumeTimer(),
    // snap: function(endValue) { 
    //   return Math.round(endValue / 90) * 90;
    // }
  });
  dragball = Draggable.get(ball);
});

