this.interval = null;
this.h = 0;
this.m = 0;
this.s = 0;
this.publisher = false;

var start = function(sendMessageToParticipants){
  if(this.interval  && this.interval != null){
    stop();
  }
  this.interval = setInterval(function(){tick()},1000);
  if(sendMessageToParticipants == true){
    displayMessage(getLocalUser(), "started");
    sendMessage("started");
    this.publisher = true;
  }
};

var stop = function(sendMessageToParticipants){
  window.clearInterval(interval);
  if(sendMessageToParticipants == true){
   displayMessage(getLocalUser(), "stopped");
   sendMessage("stopped");
   this.publisher = false;
 }
};

var reset = function(sendMessageToParticipants){
 this.h = 0;
 this.m = 0;
 this.s = 0;

 displayTime();
 if(sendMessageToParticipants == true){
  displayMessage(getLocalUser(), "reset");
  sendMessage("reset");
}
};

var getLocalUser =function(){
  return gapi.hangout.getLocalParticipant();
};

var tick = function(){
  this.s += 1;
  if(this.s >= 60)
  {
    this.m += 1;
    this.s = 0;
    if(this.publisher == true){
      sendMessage("");
    }
  }

  if(this.m >= 60){
    this.h += 1;
    this.m = 0;
  }



  displayTime();
};

var displayTime = function(message){

  if(message){
    this.h = message.hours
    this.m = message.minutes
    this.s = message.seconds
  }

  html = "";
  html += getText(this.h)
  html += ":";

  html += getText(this.m)
  html += ":";

  html += getText(this.s)

  document.getElementById('timer').innerText = html;
};

var getText = function(n){
  var str  = "";
  if(n<10)
    str += "0";
  str += n;
  return str;
};

var sendMessage = function(msg){
  var message = {"action":msg, "hours":this.h, "minutes":this.m, "seconds":this.s};
  msg = JSON.stringify(message);
  gapi.hangout.data.sendMessage(msg)
  console.log(msg); 
};

var getUser = function(){
  return "user";
};

var init = function(){
 console.log('init called'); 
 gapi.hangout.onApiReady.add( 
  function(eventObj) { 
    if (eventObj.isApiReady) { 
      try { 
        gapi.hangout.data.onMessageReceived.add(
          function(msg){
           console.log('message received'); 
           var participant = gapi.hangout.getParticipantById(msg.senderId);
           var message = JSON.parse(msg.message);

           displayMessage(participant, message.action);

           displayTime(message);

           if(msg.message == "started" || msg.message == ""){
            start();
          }


          if(msg.message == "stopped"){
            stop();
          }

          if(msg.message == "reset"){
           reset();
         });

        console.log('message handler registered');  
      } catch (e) { 
        console.log('init:ERROR'); 
        console.log(e); 
      } 
    } 
  });
};

var displayMessage = function(participant, message){
  var messageArea =   document.getElementById('messageArea');
  messageArea.innerText = messageArea.innerHTML + "\n" + participant.person.displayName + " : " + message ;
  messageArea.scrollTop = messageArea.scrollTop + 50;
};

gadgets.util.registerOnLoadHandler(init);
console.log('script loaded'); 