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

  let currentUserInfo = { username: "", theme:"", currentRoom:"", opponent:"", playerNum:""};

  function setupEventListeners(){
    const $board = $('#gameBoard');

    function findLastEmptyCell(col){
      const cells = $(`.col[data-col='${col}']`);
      for(let i=cells.length-1;i>=0; i--){
        const $cell = $(cells[i]);
        if($cell.hasClass('empty')){
            return $cell;
        }
      }
      return null;
    }

    $board.on('mouseenter', '.empty.col', function(){
        const col = $(this).data('col');
        const $lastEmptyCell = findLastEmptyCell(col);
        $lastEmptyCell.addClass('next-turn');

    })

    $board.on('mouseleave', '.col', function(){
        $('.col').removeClass('next-turn');
    })

    $board.on('click', '.col.empty', function(){
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      if($lastEmptyCell == null){return;}
      $lastEmptyCell.removeClass('empty');
      if(currentUserInfo.playerNum == "1"){
        $lastEmptyCell.addClass('P1');
      }
      else{
        $lastEmptyCell.addClass('P2');
      }
      //console.log("Col:"+$lastEmptyCell.data('col')+"Row:"+$lastEmptyCell.data('row'));
      sendMove($lastEmptyCell.data('row'), $lastEmptyCell.data('col'));
    })

  }

  function pauseEventListeners(){
    const $board = $('#gameBoard');
    //In case old event listener active, remove effects it would have had.
    console.log("paused?");
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
    console.log("ran");
    for(let row =0; row < 6; row++){
      const $row = $('<div>')
        .addClass('row');
    
      for(let col =0; col< 7  ; col++){
          const $col= $('<div>')
            .addClass('empty col')
            .attr('data-col', col)
            .attr('data-row', row);
          $row.append($col);
      }
      $board.append($row);
    }
  }


  function sendMove(row, col){
    pauseEventListeners();
    socket.emit("move made", {
      moveCol: col,
      moveRow: row,
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
    //$( "input[id][name$='man']" ).val( "only this one" );
    console.log("Ran");
    console.log(data.col+" "+data.row);
    const cells = $(`.col[data-col='${data.col}']`);
    for(let i=cells.length-1;i>=0; i--){
      const $cell = $(cells[i]);
      var rowValue = $cell.data('row');
      console.log(rowValue);
      console.log("i="+i);
      if(rowValue == data.row){
        $cell.removeClass('empty');
        console.log($cell);
        if(currentUserInfo.playerNum == 1){
          $cell.addClass('P2');
        }
        else{
          $cell.addClass('P1');
        }     
      }
    }
    checkWinner();
    setupEventListeners();
    

  });

  function checkWinner(){

  }

  socket.on("not my turn", function(){
    document.getElementById("turnMessage").innerHTML = currentUserInfo.opponent+"'s Turn. Please Wait.";
    pauseEventListeners();
  });

  socket.on("You go first", function(){
    document.getElementById("turnMessage").innerHTML = "Hey "+currentUserInfo.username+", It's your turn.";
  });

  socket.on("reply recieve", function(data){
    $home.css("display","none");
    console.log("Joined" +data.roomId);
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

  socket.on("room made",function(shareCode){
    $home.css("display","none");
    console.log(shareCode);
    currentUserInfo.currentRoom = shareCode;
    $gamePage.css("display","inline-block");
    document.getElementById("gameMessage").innerHTML = "Hello "+currentUserInfo.username+
      ".<br> Please get your friend to join RoomId:"+shareCode;
      createGrid();
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
