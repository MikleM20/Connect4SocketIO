var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var randomRooms = [];
var privateRooms = [];
app.use(express.static('.'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
//Send style file
app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/style.css');
});
  
//send script file
app.get('/script.js', function(req, res){
    res.sendFile(__dirname + '/script.js');
});

var currentUsers = [];
var connectionsMade = 0;


io.on("connection", function(socket) {
  connectionsMade += 1;
  getBrowserCookie(socket);
  updateRooms();

  socket.on("disconnect", function() {
    //console.log("user disconnected");
  });

  socket.on("create room", function(roomId){
    socket.join(roomId);
    console.log(roomId);
    privateRooms.push(roomId);
    socket.emit("room made",roomId);
  });

  socket.on("join private", function(data){
    var roomId = data.roomCode;
    for(var i=0;i< privateRooms.length;i++){
      if(privateRooms[i] == roomId){
        privateRooms.splice(i,1);
        socket.join(roomId);
        io.to(roomId).emit("someone joined", data.username);
        return;
      }
    }
    socket.emit("invalid room");

  });

  socket.on("reply to join", function(data){
    socket.to(data.roomCode).emit("reply recieve", {
      opponent: data.username,
      roomId: data.roomCode
    });
  });


  socket.on("send browser cookie", function(username) {
    console.log(username);
    if(username !== null){
      let usernameParts = username.split("@#$%");
      let nameFromParts = usernameParts[0];
      for (var i = 0; i < currentUsers.length; i++) {
        let userListParts = currentUsers[i].username.split("@#$%");
        let userListName = userListParts[0];
        if (userListName == nameFromParts) {
          socket.emit("show username", { username: currentUsers[i].username });
          return;
        }
      }
    }
    // Create new connection
    var newUsername = '' + Math.random().toString(36).substr(2, 9)+"@#$%1";
    console.log("new = "+ newUsername);
    var addUser = { username: newUsername, theme: "1"};
    currentUsers.push(addUser);
    socket.emit("show username", { username: newUsername });
    socket.emit("change greeting");
  });

  socket.on("change username", function(data) {
    if (updateUserName(data.username, data.newusername)) {
        socket.emit("change cookie", {
            newName: data.newusername
        });
    }
    else{
        socket.emit("name change failed");
    }
  });

  socket.on("change theme", function(data){
    for (var i = 0; i < currentUsers.length; i++) {
      let userListParts = currentUsers[i].username.split("@#$%");
      let userListName = userListParts[0];
      if (userListName == data.username) {
        currentUsers[i].username = data.username+"@#$%"+data.theme;
      }
    }
  });



});


const getBrowserCookie = socket => {
  socket.emit("get browser cookie");
};

function updateRooms(){
  for(var i=privateRooms.length; i>0; i--){
    var roomName = privateRooms[i];
    var sizeOfRoom = io.sockets.adapter.rooms[roomName];
    if(sizeOfRoom < 1){
      privateRooms.splice(i,1);
    }
  }
  for(var i=randomRooms.length; i>0; i--){
    var roomName = randomRooms[i];
    var sizeOfRoom = io.sockets.adapter.rooms[roomName];
    if(sizeOfRoom < 1){
      randomRooms.splice(i,1);
    }
  }
}



const updateUserName = (currentUsername, newName) => {
  let currentNameParts = currentUsername.split("@#$%");
  let nameFromCurrentName = currentNameParts[0];
  let newNameParts = newName.split("@#$%");
  let nameFromNewName = newNameParts[0];
  for (var i = 0; i < currentUsers.length; i++) {
    let userListParts = currentUsers[i].username.split("@#$%");
    let userListName = userListParts[0];
    if (userListName == nameFromNewName) {
      return false;
    }
  }
  for (var i = 0; i < currentUsers.length; i++) {
    let userListParts = currentUsers[i].username.split("@#$%");
    let userListName = userListParts[0];
    if (userListName == nameFromCurrentName) {
      currentUsers[i].username = newName;
      return true;
    }
  }
};



server.listen(4000);
console.log("running");
