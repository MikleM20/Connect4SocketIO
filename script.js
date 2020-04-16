$(function() {
  const socket = io.connect('http://localhost:4000');
    


  let $nameForm = $('#nameForm');
  let $home = $('#homePage');
  let $gamePage = $('#gamePage');
  let $gameBoard = $('#gameBoard');
  let $createPrivate = $("#privateForm");
  let $findRandom = $("#random")
  let $joinForm = $("#joinForm");
  let $theme1 = $("#theme1");
  let $theme2 = $("#theme2");
  let $theme3 = $("#theme3");

  let currentUserInfo = { username: "", theme:"", currentRoom:"", opponent:"", playerNum:""};
  
  $findRandom.submit(function(e){
    e.preventDefault();
      socket.emit("find random", currentUserInfo.username);
  });


  function setupEventListeners(){
    const $board = $('#gameBoard');

    function findLastEmptyCell(gamecol){
      const cells = $(`.gamecol[data-gamecol='${gamecol}']`);
      for(let i=cells.length-1;i>=0; i--){
        const $cell = $(cells[i]);
        if($cell.hasClass('empty')){
            return $cell;
        }
      }
      return null;
    }

    $board.on('mouseenter', '.empty.gamecol', function(){
        const gamecol = $(this).data('gamecol');
        const $lastEmptyCell = findLastEmptyCell(gamecol);
        $lastEmptyCell.addClass('next-turn');

    })

    $board.on('mouseleave', '.gamecol', function(){
        $('.gamecol').removeClass('next-turn');
    })

    $board.on('click', '.gamecol.empty', function(){
      const gamecol = $(this).data('gamecol');
      const $lastEmptyCell = findLastEmptyCell(gamecol);
      if($lastEmptyCell == null){return;}
      $lastEmptyCell.removeClass('empty');
      if(currentUserInfo.playerNum == "1"){
        $lastEmptyCell.addClass('P1');
      }
      else{
        $lastEmptyCell.addClass('P2');
      }
      //console.log("gamerow:"+$lastEmptyCell.data('gamerow')+"gamecol:"+$lastEmptyCell.data('gamecol'));
      //console.log("Sending: "+ $lastEmptyCell.data('gamerow')+ $lastEmptyCell.data('gamecol'));/////////////////
      sendMove($lastEmptyCell.data('gamerow'), $lastEmptyCell.data('gamecol'));
    })

  }

  function pauseEventListeners(){
    const $board = $('#gameBoard');
    //In case old event listener active, remove effects it would have had.
    //console.log("paused?");
    $board.unbind('mouseenter');
    $board.unbind('mouseleave');
    $board.unbind('click');
    var hoveredInPast = document.getElementsByClassName('next-turn');
    for (var i = 0; i < hoveredInPast.length; i++) {
      const hovered = $(hoveredInPast);
      hovered.removeClass('next-turn');
    }
  }

  function createGrid(){
    const $board=$('#gameBoard');
    $board.empty();
    //console.log("ran");
    for(let gamerow =0; gamerow < 6; gamerow++){
      const $gamerow = $('<div>')
        .addClass('gamerow');
    
      for(let gamecol =0; gamecol< 7  ; gamecol++){
          const $gamecol= $('<div>')
            .addClass('empty gamecol')
            .attr('data-gamecol', gamecol)
            .attr('data-gamerow', gamerow);
          $gamerow.append($gamecol);
      }
      $board.append($gamerow);
    }
  }


  function sendMove(gamerow, gamecol){
    pauseEventListeners();
    //console.log(""+gamerow,gamecol);
    document.getElementById('turnMessage').innerHTML = ""+currentUserInfo.opponent+"'s Turn. Please Wait."
    socket.emit("move made", {
      moveCol: gamecol,
      moveRow: gamerow,
      roomId: currentUserInfo.currentRoom
    });

  }


  $joinForm.submit(function(e){
    e.preventDefault();
    var valInputted = document.getElementById("privRoom").value;
    socket.emit("join private", {
      username: currentUserInfo.username,
      roomCode: valInputted
    });
  });


  socket.on("your turn", function(data){
    //console.log("Ran");
    //console.log("recieved"+data.movecol+" "+data.moverow);
    const cells = $(`.gamecol[data-gamecol='${data.movecol}']`);
    document.getElementById('turnMessage').innerHTML = "Hey "+currentUserInfo.username+", it's your turn."
    for(let i=cells.length-1;i>=0; i--){
      const $cell = $(cells[i]);
      var gamerowValue = $cell.data('gamerow');
      //console.log(gamerowValue);
      //console.log("i="+i);
      if(gamerowValue == data.moverow){
        $cell.removeClass('empty');
        //console.log($cell);
        if(currentUserInfo.playerNum == 1){
          $cell.addClass('P2');
        }
        else{
          $cell.addClass('P1');
        }     
      }
    }
    if (currentUserInfo.playerNum == 1){
      var playerClass = "P2";
    }
    else{
      var playerClass = "P1";
    }
    if(checkForWinner(data.moverow, data.movecol, playerClass) == true){
      document.getElementById("gameMessage").innerHTML = "Your opponent '"+currentUserInfo.opponent+"' outplayed you. You lose. <br>Reload page to find another game.";
      document.getElementById("turnMessage").innerHTML = "";
      socket.emit("opponent won", currentUserInfo.currentRoom);
      return;
    }
    else if(checkTie() == true){
      socket.emit("we tied",currentUserInfo.currentRoom);
      document.getElementById("gameMessage").innerHTML = "You and '"+currentUserInfo.opponent+"' tied. <br>Reload page to find another game.";
      document.getElementById("turnMessage").innerHTML = "";
      return;
    }
    else{
      setupEventListeners();
    }

  });

  function checkTie(){
    var openSlots = document.getElementsByClassName("empty");
    if(openSlots.length == 0){
      return true;
    }
    return null;
  }

  function checkForWinner(gamerow, gamecol, opponentClass) {

    function $getCell(y, x) {
      return $(`.gamecol[data-gamerow='${y}'][data-gamecol='${x}']`);
    }

    function checkDirection(checkDirection) {
      let total = 0;
      let y = gamerow + checkDirection.y;
      let x = gamecol + checkDirection.x;
      let $next = $getCell(y, x);
      while (y >= 0 && y < 6 && x >= 0 && x < 7 && $next.hasClass(opponentClass)) {
          total++;
          y += checkDirection.y;
          x += checkDirection.x;
          $next = $getCell(y, x);
      }
      return total;
    }

    function checkWin(yMove, xMove) {
      const total = 1 +
        checkDirection(yMove) +
        checkDirection(xMove);
      if (total >= 4) {
        return true;
      } else {
        return null;
      }
    }

    function checkCounterDiag() {
      return checkWin({y: 1, x: -1}, {y: -1, x: 1});
    }

    function checkMainDiag() {
      return checkWin({y: 1, x: 1}, {y: -1, x: -1});
    }

    function checkVerticals() {
      return checkWin({y: -1, x: 0}, {y: 1, x: 0});
    }

    function checkHorizontals() {
      return checkWin({y: 0, x: -1}, {y: 0, x: 1});
    }

    return checkVerticals() || checkHorizontals() || checkCounterDiag() || checkMainDiag();
  }

  socket.on("not my turn", function(){
    document.getElementById("turnMessage").innerHTML = currentUserInfo.opponent+"'s Turn. Please Wait.";
    pauseEventListeners();
  });

  socket.on("game tie", function(){
    document.getElementById("turnMessage").innerHTML = "";
    document.getElementById("gameMessage").innerHTML = "You and '"+currentUserInfo.opponent+"' tied. <br>Reload page to find another game.";
    socket.emit("game over", currentUserInfo.currentRoom);
  });


  socket.on("You win", function(){
    document.getElementById("turnMessage").innerHTML = "";
    document.getElementById("gameMessage").innerHTML = "You won against '"+currentUserInfo.opponent+"'. You Win!<br>Reload page and see if you can win again!";
    socket.emit("game over", currentUserInfo.currentRoom);
  });

  socket.on("You go first", function(){
    document.getElementById("turnMessage").innerHTML = "Hey "+currentUserInfo.username+", it's your turn.";
  });

  socket.on("reply recieve", function(data){
    $home.css("display","none");
    //console.log("Joined" +data.roomId);
    $gamePage.css("display","inline-block");
    document.getElementById("gameMessage").innerHTML = "Playing Against "+data.opponent+".";
    currentUserInfo.opponent = data.opponent;
    currentUserInfo.currentRoom = data.roomId;
    currentUserInfo.playerNum = "2";
    socket.emit("you start", currentUserInfo.currentRoom);
    createGrid();
  });

  socket.on("someone joined", function(opponent){
    document.getElementById("gameMessage").innerHTML = "Playing Against "+opponent+".";
    currentUserInfo.opponent = opponent;
    currentUserInfo.playerNum = "1";
    setupEventListeners();
    socket.emit("reply to join",{
      roomCode: currentUserInfo.currentRoom,
      username: currentUserInfo.username
    });
  });

  socket.on("random room made",function(roomId){
    $home.css("display","none");
    //console.log(shareCode);
    currentUserInfo.currentRoom = roomId;
    $gamePage.css("display","inline-block");
    document.getElementById("gameMessage").innerHTML = "Hello "+currentUserInfo.username+
      ".<br> Please wait for a random opponent.";
      createGrid();
  });

  socket.on("room made",function(shareCode){
    $home.css("display","none");
    //console.log(shareCode);
    currentUserInfo.currentRoom = shareCode;
    $gamePage.css("display","inline-block");
    document.getElementById("gameMessage").innerHTML = "Hello "+currentUserInfo.username+
      ".<br> Please get your friend to join RoomId:"+shareCode;
      createGrid();
  });

  $createPrivate.submit(function(e){
    e.preventDefault();
      var roomCode = ""+Math.floor(Math.random() * (1000000 - 100000) + 100000);
      //console.log(roomCode);
      socket.emit("create room",roomCode);
  });

  $theme1.submit(function(e){
    e.preventDefault();
    if($gameBoard.hasClass("dark")){
      $gameBoard.removeClass("dark");
    }
    if($gameBoard.hasClass("other")){
      $gameBoard.removeClass("other");
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
    if($gameBoard.hasClass("other")){
      $gameBoard.removeClass("other");
    }
    if($gameBoard.hasClass("dark")){
    }
    else{
      $gameBoard.addClass("dark");
      //console.log("here");
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
    if($gameBoard.hasClass("dark")){
      $gameBoard.removeClass("dark");
    }
    if($gameBoard.hasClass("other")){
    }
    else{
      $gameBoard.addClass("other");
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
      document.getElementById('nameFeedback'),innerHTML=" ";
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
      if(valInputted.includes("@#$%")){
        document.getElementById("nameFeedback").innerHTML ="Username cannot contain '@#$%'";
        document.getElementById("who").value = "" + currentUserInfo.username;
        return;
      }
      if(valInputted !== currentUserInfo.username){
          var oldToPass = currentUserInfo.username+"@#$%"+currentUserInfo.theme;
          var newToPass = valInputted+"@#$%"+currentUserInfo.theme;
          socket.emit("change username", {
              username: oldToPass,
              newusername: newToPass
          });
      }
  });
  
  socket.on("name change failed", function(newUsername) {
      document.getElementById("nameFeedback").innerHTML ="The username"+newUsername+" is taken. You are still"+currentUserInfo.username+".";
      document.getElementById("who").value = "" + currentUserInfo.username;
  });

  socket.on("invalid room", function() {
    document.getElementById("roomFeedback").innerHTML ="The room  you tried to join is full/doesn't exist.";
    document.getElementById("privRoom").value = "";
  });

  socket.on("change cookie", function(data) {
    saveUsernameCookie(data.newName);
  });

  function saveUsernameCookie(username){
    //console.log(username);
    var now = new Date();
    now.setTime(now.getTime() + 30 * 60 * 1000); // 30 minute cookie
    document.cookie =
      "username="+username+"; expires="+now.toUTCString()+";"+" path=/";
  }

  
  function setTheme(){
    if (currentUserInfo.theme == "1"){
      if($gameBoard.hasClass("dark")){
        $gameBoard.removeClass("dark");
      }
      if($gameBoard.hasClass("other")){
        $gameBoard.removeClass("other");
      }
    }
    else if(currentUserInfo.theme == "2"){
      if($gameBoard.hasClass("other")){
        $gameBoard.removeClass("other");
      }
      if($gameBoard.hasClass("dark")){
      }
      else{
        $gameBoard.addClass("dark");
        //console.log("Here");
      }
    }
    else if(currentUserInfo.theme = "3"){
      if($gameBoard.hasClass("dark")){
        $gameBoard.removeClass("dark");
      }
      if($gameBoard.hasClass("other")){
      }
      else{
        $gameBoard.addClass("other");
      }
    }
  }
  

});
