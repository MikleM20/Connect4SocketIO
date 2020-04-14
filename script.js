$(function() {
  const socket = io.connect('http://localhost:4000');
    


  let $nameForm = $('#nameForm');
  let $home = $('#homePage');
  let $gamePage = $('#gamePage');
  let $createPrivate = $("#privateForm");
  let $joinForm = $("#joinForm");
  let $theme1 = $("#theme1");
  let $theme2 = $("#theme2");
  let $theme3 = $("#theme3");

  let currentUserInfo = { username: "", theme:"", currentRoom:"", opponent:""};

  $joinForm.submit(function(e){
    e.preventDefault();
    var valInputted = document.getElementById("privRoom").value;
    socket.emit("join private", {
      username: currentUserInfo.username,
      roomCode: valInputted
    });
  });

  socket.on("reply recieve", function(data){
    $home.css("display","none");
    console.log("Joined" +data.roomId);
    $gamePage.css("display","inline-block");
    document.getElementById("game message").innerHTML = "Playing Against "+data.opponent+".<br>Opponent's Turn.";
    currentUserInfo.opponent = data.opponent;
    currentUserInfo.opponent = data.roomId;
  });

  socket.on("someone joined", function(opponent){
    document.getElementById("game message").innerHTML = "Playing Against "+opponent+".<br>Your Turn.";
    currentUserInfo.opponent = opponent;
    socket.emit("reply to join",{
      roomCode: currentUserInfo.currentRoom,
      username: currentUserInfo.username
    });
  });

  socket.on("room made",function(shareCode){
    $home.css("display","none");
    console.log(shareCode);
    currentUserInfo.currentRoom = shareCode;
    $gamePage.css("display","inline-block");
    document.getElementById("game message").innerHTML = "Hello "+currentUserInfo.username+
      ". Please get your frient to join RoomId:"+shareCode;
  });

  $createPrivate.submit(function(e){
    e.preventDefault();
      var roomCode = ""+Math.floor(Math.random() * (1000000 - 100000) + 100000);
      console.log(roomCode);
      socket.emit("create room",roomCode);
  });

  $theme1.submit(function(e){
    e.preventDefault();
    if($home.hasClass("dark")){
      $home.removeClass("dark");
    }
    if($home.hasClass("other")){
      $home.removeClass("other");
    }
    currentUserInfo.theme = "1"
    socket.emit("change theme", {
      username: currentUserInfo.username,
      theme: currentUserInfo.theme
    });
    saveUsernameCookie(currentUserInfo.username+"@#$%"+currentUserInfo.theme);
  });

  $theme2.submit(function(e){
    e.preventDefault();
    if($home.hasClass("other")){
      $home.removeClass("other");
    }
    if($home.hasClass("dark")){
    }
    else{
      $home.addClass("dark");
      console.log("here");
    }
    currentUserInfo.theme = "2"
    socket.emit("change theme", {
      username: currentUserInfo.username,
      theme: currentUserInfo.theme
    });
    saveUsernameCookie(currentUserInfo.username+"@#$%"+currentUserInfo.theme);
  });


  $theme3.submit(function(e){
    e.preventDefault();
    if($home.hasClass("dark")){
      $home.removeClass("dark");
    }
    if($home.hasClass("other")){
    }
    else{
      $home.addClass("other");
    }
    currentUserInfo.theme = "3"
    socket.emit("change theme", {
      username: currentUserInfo.username,
      theme: currentUserInfo.theme
    });
    saveUsernameCookie(currentUserInfo.username+"@#$%"+currentUserInfo.theme);
  });


  socket.on("get browser cookie", function() {
    socket.emit("send browser cookie", getUsernameCookie());
  });
 
  function getUsernameCookie(){
    var value = "; " + document.cookie;
    var parts = value.split("; username=");
    if (parts.length == 2)
      return parts
        .pop()
        .split(";")
        .shift();
  }
  
  // Shows the connected users name and sets the theme they used from cookie
  socket.on("show username", function(user) {
      var input = user.username;
      var parts = input.split("@#$%");
      currentUserInfo = { username: parts[0], theme: parts[1]};
      //console.log("username: "+ currentUserInfo.username);
      document.getElementById("who").value = "" + currentUserInfo.username;
      saveUsernameCookie(currentUserInfo.username+"@#$%"+currentUserInfo.theme);
      //console.log("Theme: "+ currentUserInfo.theme);
      setTheme();
  });

  socket.on("change greeting", function(){
    document.getElementById("greet").innerHTML = "You're New! Welcome!";
  });
  
  
  $nameForm.submit(function(e){
      e.preventDefault();
      var valInputted = document.getElementById("who").value;
      if(valInputted !== currentUserInfo.username){
          var oldToPass = currentUserInfo.username+"@#$%"+currentUserInfo.theme;
          var newToPass = valInputted+"@#$%"+currentUserInfo.theme;
          socket.emit("change username", {
              username: oldToPass,
              newusername: newToPass
          });
      }
  });
  
  socket.on("name change failed", function() {
      document.getElementById("nameFeedback").innerHTML ="The username you tried to change to is taken.";
      document.getElementById("who").value = "" + currentUserInfo.username;
  });

  socket.on("invalid room", function() {
    document.getElementById("nameFeedback").innerHTML ="The room  you tried to join is full/doesn't exist.";
    document.getElementById("privRoom").value = "";
  });

  socket.on("change cookie", function(data) {
    saveUsernameCookie(data.newName);
  });

  function saveUsernameCookie(username){
    console.log(username);
    var now = new Date();
    now.setTime(now.getTime() + 30 * 60 * 1000); // 30 minute cookie
    document.cookie =
      "username="+username+"; expires="+now.toUTCString()+";"+" path=/";
  }

  
  function setTheme(){
    if (currentUserInfo.theme == "1"){
      if($home.hasClass("dark")){
        $home.removeClass("dark");
      }
      if($home.hasClass("other")){
        $home.removeClass("other");
      }
    }
    else if(currentUserInfo.theme == "2"){
      if($home.hasClass("other")){
        $home.removeClass("other");
      }
      if($home.hasClass("dark")){
      }
      else{
        $home.addClass("dark");
        console.log("Here");
      }
    }
    else if(currentUserInfo.theme = "3"){
      if($home.hasClass("dark")){
        $home.removeClass("dark");
      }
      if($home.hasClass("other")){
      }
      else{
        $home.addClass("other");
      }
    }
  }
  
});
