var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

//Array of rooms, will be removed from list once they are full
var randomRooms = [];
var privateRooms = [];

app.use(express.static('.'));

let parts = [];
  parts.push(["AliceBlue",  "AntiqueWhite",  "Aqua",  "Aquamarine",  "Azure",  "Beige",  "Bisque",  "Black",  "BlanchedAlmond",  "Blue",  "BlueViolet",  "Brown",  "BurlyWood",  "CadetBlue",  "Chartreuse",  "Chocolate",  "Coral",  "CornflowerBlue",  "Cornsilk",  "Crimson",  "Cyan",  "DarkBlue",  "DarkCyan",  "DarkGoldenRod",  "DarkGray",  "DarkGrey",  "DarkGreen",  "DarkKhaki",  "DarkMagenta",  "DarkOliveGreen",  "DarkOrange",  "DarkOrchid",  "DarkRed",  "DarkSalmon",  "DarkSeaGreen",  "DarkSlateBlue",  "DarkSlateGray",  "DarkSlateGrey",  "DarkTurquoise",  "DarkViolet",  "DeepPink",  "DeepSkyBlue",  "DimGray",  "DimGrey",  "DodgerBlue",  "FireBrick",  "FloralWhite",  "ForestGreen",  "Fuchsia",  "Gainsboro",  "GhostWhite",  "Gold",  "GoldenRod",  "Gray",  "Grey",  "Green",  "GreenYellow",  "HoneyDew",  "HotPink",  "IndianRed",  "Indigo",  "Ivory",  "Khaki",  "Lavender",  "LavenderBlush",  "LawnGreen",  "LemonChiffon",  "LightBlue",  "LightCoral",  "LightCyan",  "LightGoldenRodYellow",  "LightGray",  "LightGrey",  "LightGreen",  "LightPink",  "LightSalmon",  "LightSeaGreen",  "LightSkyBlue",  "LightSlateGray",  "LightSlateGrey",  "LightSteelBlue",  "LightYellow",  "Lime",  "LimeGreen",  "Linen",  "Magenta",  "Maroon",  "MediumAquaMarine",  "MediumBlue",  "MediumOrchid",  "MediumPurple",  "MediumSeaGreen",  "MediumSlateBlue",  "MediumSpringGreen",  "MediumTurquoise",  "MediumVioletRed",  "MidnightBlue",  "MintCream",  "MistyRose",  "Moccasin",  "NavajoWhite",  "Navy",  "OldLace",  "Olive",  "OliveDrab",  "Orange",  "OrangeRed",  "Orchid",  "PaleGoldenRod",  "PaleGreen",  "PaleTurquoise",  "PaleVioletRed",  "PapayaWhip",  "PeachPuff",  "Peru",  "Pink",  "Plum",  "PowderBlue",  "Purple",  "RebeccaPurple",  "Red",  "RosyBrown",  "RoyalBlue",  "SaddleBrown",  "Salmon",  "SandyBrown",  "SeaGreen",  "SeaShell",  "Sienna",  "Silver",  "SkyBlue",  "SlateBlue",  "SlateGray",  "SlateGrey",  "Snow",  "SpringGreen",  "SteelBlue",  "Tan",  "Teal",  "Thistle",  "Tomato",  "Turquoise",  "Violet",  "Wheat",  "White",  "WhiteSmoke",  "Yellow",  "YellowGreen"]);
  parts.push(["Wary","Washable","Washed","Washier","Washiest","Washy","Waspier","Waspiest","Waspish","Waspy","Wastable","Waste","Wasted","Wasteful","Wasting","Watchful","Water-cooled","Water-gas","Water-repellent","Water-resistant","Water-soluble","Water-supply","Watercress","Watered","Watered-down","Waterish","Waterless","Waterlog","Waterlogged","Waterproof","Waterproofed","Watertight","Watery","Wattle","Waugh","Waur","Waved","Waveless","Wavelike","Wavering","Wavier","Waviest","Waving","Wavy","Waxed","Waxen","Waxier","Waxiest","Waxing","Waxy","Way-out","Wayfarer","Wayfaring","Wayless","Wayward","Wayworn","Weak","Weak-kneed","Weak-minded","Weak-willed","Weakened","Weakening","Weakly","Wealthier","Wealthiest","Wealthy","Weaned","Weaponed","Weaponless","Wearable","Wearied","Wearier","Weariest","Weariful","Weariless","Wearing","Wearish","Wearisome","Weary","Wearying","Weather","Weather-beaten","Weather-bound","Weather-wise","Weathered","Weatherly","Weaving","Web-footed","Web-toed","Webbed","Webbier","Webbiest","Webby","Wed","Wedded","Wedge-shaped","Wedged","Wedgy","Wee","Weeded","Weedier","Weediest","Weedless","Weedy","Weekday","Weekly","Weeny","Weepier","Weepiest","Weeping","Weepy","Weer","Weest","Weighable","Weighted","Weightier","Weightiest","Weightless","Weightlessness","Weighty","Weird","Welcome","Welcomed","Welcoming","Weldable","Weldless","Welfare","Welfarist","Well","Well-acquainted","Well-advised","Well-affected","Well-aimed","Well-appointed","Well-balanced","Well-becoming","Well-behaved","Well-beloved","Well-bred","Well-built","Well-chosen","Well-conditioned","Well-conducted","Well-connected","Well-coupled","Well-covered","Well-defined","Well-derived","Well-deserved","Well-desired","Well-developed","Well-directed","Well-disposed","Well-dressed","Well-earned","Well-educated","Well-endowed","Well-entered","Well-established","Well-favoured","Well-fed","Well-formed","Well-found","Well-founded","Well-gotten","Well-groomed","Well-grounded","Well-heeled","Well-hung","Well-informed","Well-intentioned","Well-judged","Well-kept","Well-knit","Well-known","Well-lined","Well-made","Well-mannered","Well-marked","Well-meaning","Well-meant","Well-off","Well-oiled","Well-ordered","Well-paid","Well-placed","Well-prepared","Well-preserved","Well-proportioned","Well-read","Well-regulated","Well-respected","Well-rounded","Well-set","Well-spent","Well-spoken","Well-stacked","Well-tempered","Well-thought-of","Well-thought-out","Well-timed","Well-to-do","Well-tried","Well-trodden","Well-turned","Well-upholstered","Well-warranted","Well-wishing","Well-won","Well-worn","Welsh","Wersh","West","Westbound","Westering","Westerly","Western","Westernmost","Westmost","Westward","Westwardly","Wet","Wetter","Wetting","Wettish","Whacked","Whackier","Whackiest","Whacking","Whacky","Whapping","Whate'er","Whatever","Whatsoe'er","Whatsoever","Wheaten","Wheeled","Wheeling","Wheezier","Wheeziest","Wheezing","Wheezy","Whelked","Whelped","Wheyey","Whilom","Whimsical","Whinier","Whiniest","Whining","Whinny","Whiny","Whip-tailed","Whiplike","Whipping","Whippy","Whirling","Whirring","Whiskered","Whiskery","Whispered","Whispering","Whist","Whistleable","White","White-collar","White-faced","White-haired","White-hot","White-livered","Whited","Whitened","Whitewashed","Whitish","Whittling","Whity","Whole","Whole-souled","Whole-wheat","Wholesale","Wholesome","Wholistic","Whopping","Whoreson","Whorish","Whorled","Wick","Wicked","Wicker","Wide","Wide-angle","Wide-awake","Wide-eyed","Wide-open","Wide-ranging","Wide-screen","Wider","Widespread","Widest","Widish","Widowed","Wieldable","Wieldier","Wieldiest","Wieldy","Wifeless","Wifely","Wigged","Wigglier","Wiggliest","Wiggling","Wiggly","Wight","Wigless","Wiglike","Wild","Wild-eyed","Wilful","Wilier","Wiliest","Will-less","Willable","Willed","Willful","Willing","Willowy","Willy-nilly","Willyard","Wilted","Wily","Wimpish","Wimpy","Wind-borne","Wind-broken","Wind-shaken","Windburned","Winded","Windier","Windiest","Winding","Windless","Windowless","Windproof","Windswept","Windward","Windy","Winey","Wing-footed","Winged","Wingless","Winglike","Winier","Winiest","Winking","Winnable","Winning","Winsome","Winter","Winterier","Winteriest","Winterweight","Wintery","Wintrier","Wintriest","Wintry","Winy","Wire-haired","Wired","Wireless","Wiretap","Wiring","Wiry","Wise","Wised","Wiser","Wisest","Wishful","Wishy-washy","Wising","Wispier","Wispiest","Wispy","Wistful","Witch-hunt","Witching","Witchlike","Witchy","Withdrawing","Withdrawn","Withered","Withering","Withy","Witless","Witnessed","Witted","Wittier","Wittiest","Witting","Witty","Wizard","Wizardly","Wizen","Wizened","Woaded","Wobbling","Wobbly","Wobegone","Woebegone","Woeful","Woesome","Wolfish","Womanish","Womanless","Womanly","Wombed","Won","Wonder-stricken","Wonder-struck","Wonderful","Wondering","Wondrous","Wonky","Wonted","Wood","Wooded","Wooden","Wooden-headed","Woodier","Woodiest","Woodless","Woods","Woodsy","Woodwind","Woodworking","Woody","Wool-stapler","Woolen","Woollen","Woolly","Woolly-headed","Woozier","Wooziest","Woozy","Word-blind","Word-for-word","Word-of-mouth","Word-perfect","Wordier","Wordiest","Wordless","Wordy","Work-shy","Workable","Workaday","Worked","Working","Working-class","Workless","Workmanlike","World","World-beater","World-shaking","World-shattering","World-weary","Worldly","Worldly-minded","Worldly-wise","Worldwide","Worm-eaten","Worm-wheel","Wormy","Worn","Worn-out","Worried","Worrisome","Worrying","Worse","Worsened","Worsening","Worser","Worshipful","Worshipless","Worshipped","Worshipping","Worst","Worth","Worthful","Worthless","Worthwhile","Worthy","Would-be","Wound","Wound-up","Wounded","Wounding","Woundless","Woven","Wraparound","Wrapped","Wrapround","Wrath","Wrathful","Wrathless","Wreathed","Wreathless","Wrecked","Wreckful","Wrenching","Wretched","Wrier","Wriest","Wriggling","Wriggly","Wrinkled","Wrinklier","Wrinkliest","Wrinkly","Write-in","Writhed","Writhen","Writhing","Written","Wrong","Wrong-headed","Wronged","Wrongful","Wroth","Wrought","Wrought-iron","Wrought-up","Wry","Wry-necked","Wud","Wuthering","Xanthic","Xanthochroid","Xanthous","Xenogenetic","Xenomorphic","Xenophobic","Xerarch","Xeric","Xerographic","Xeromorphic","Xerophilous","Xerophytic","Xerotic","Xiphoid","Xiphosuran","Xylic","Xylographic","Xylographical","Xyloid","Xylophagous","Xylotomous","Yare","Yarer","Yarest","Yauld","Yawning","Yclept","Year-end","Year-round","Yearling","Yearlong","Yearly","Yearning","Yeastlike","Yeasty","Yeld","Yelled","Yelling","Yellow","Yellow-bellied","Yellowed","Yellowish","Yeomanly","Yester","Yestern","Yielding","Yogic","Yokelish","Yolky","Yon","Yonder","Young","Young-eyed","Younger","Youngish","Youthful","Yttric","Yttriferous","Yucky","Yuletide","Yummy","Zanier","Zanies","Zaniest","Zany","Zealous","Zebrine","Zenithal","Zeolitic","Zero","Zero-rated","Zeroth","Zestful","Zesty","Zeugmatic","Zibeline","Zig","Zigzag","Zillion","Zinciferous","Zincky","Zincographic","Zincographical","Zincoid","Zincous","Zincy","Zingiberaceous","Zingy","Zinky","Zippered","Zippy","Zirconic","Zodiacal","Zoic","Zonal","Zonary","Zonate","Zoning","Zonked","Zonular","Zoochemical","Zoographic","Zoographical","Zoolatrous","Zoological","Zoometric","Zoomorphic","Zoonal","Zoophagous","Zoophilous","Zoophobous","Zoophoric","Zooplastic","Zygodactyl","Zygomorphic","Zygomorphous","Zygophyllaceous","Zygotic","Zymogenic","Zymolysis","Zymolytic","Zymotic"]);
  parts.push(["Aardvark", "Albatross", "Alligator", "Alpaca", "Ant", "Anteater", "Antelope", "Ape", "Armadillo", "Donkey", "Baboon", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Bison", "Boar", "Buffalo", "Butterfly", "Camel", "Capybara", "Caribou", "Cassowary", "Cat", "Caterpillar", "Cattle", "Chamois", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Chough", "Clam", "Cobra", "Cockroach", "Cod", "Cormorant", "Coyote", "Crab", "Crane", "Crocodile", "Crow", "Curlew", "Deer", "Dinosaur", "Dog", "Dogfish", "Dolphin", "Dotterel", "Dove", "Dragonfly", "Duck", "Dugong", "Dunlin", "Eagle", "Echidna", "Eel", "Eland", "Elephant", "Elk", "Emu", "Falcon", "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog", "Gaur", "Gazelle", "Gerbil", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfinch", "Goldfish", "Goose", "Gorilla", "Goshawk", "Grasshopper", "Grouse", "Guanaco", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog", "Heron", "Herring", "Hippopotamus", "Hornet", "Horse", "Human", "Hummingbird", "Hyena", "Ibex", "Ibis", "Jackal", "Jaguar", "Jay", "Jellyfish", "Kangaroo", "Kingfisher", "Koala", "Kookabura", "Kouprey", "Kudu", "Lapwing", "Lark", "Lemur", "Leopard", "Lion", "Llama", "Lobster", "Locust", "Loris", "Louse", "Lyrebird", "Magpie", "Mallard", "Manatee", "Mandrill", "Mantis", "Marten", "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Mouse", "Mule", "Narwhal", "Newt", "Nightingale", "Octopus", "Okapi", "Opossum", "Oryx", "Ostrich", "Otter", "Owl", "Oyster", "Panther", "Parrot", "Partridge", "Peafowl", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon", "Pony", "Porcupine", "Porpoise", "Quail", "Quelea", "Quetzal", "Rabbit", "Raccoon", "Rail", "Ram", "Rat", "Raven", "Reddeer", "Redpanda", "Reindeer", "Rhinoceros", "Rook", "Salamander", "Salmon", "SandDollar", "Sandpiper", "Sardine", "Scorpion", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Skunk", "Snail", "Snake", "Sparrow", "Spider", "Spoonbill", "Squid", "Squirrel", "Starling", "Stingray", "Stinkbug", "Stork", "Swallow", "Swan", "Tapir", "Tarsier", "Termite", "Tiger", "Toad", "Trout", "Turkey", "Turtle", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Weasel", "Whale", "Wildcat", "Wolf", "Wolverine", "Wombat", "Woodcock", "Woodpecker", "Worm", "Wren", "Yak", "Zebra"]);

//Send main html file
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

//Array of users
var currentUsers = [];
var connectionsMade = 0;

//When user connects
io.on("connection", function(socket) {
  connectionsMade += 1;
  getBrowserCookie(socket);       //Get cookie if any
  updateRooms();                  //Update rooms in case some were made but then people left

  socket.on("disconnect", function() {
    //console.log("user disconnected");
  });

  //If opponent won then tell them they won and leave the room
  socket.on("opponent won", function(roomId){
    socket.to(roomId).emit("You win");
    socket.leave(roomId);
  });

  //If tie then tell opponent it is a tie and then leave room
  socket.on("we tied", function(roomId){
    socket.to(roomId).emit("game tie");
    socket.leave(roomId);
  });

  //Leave room and update room array if game is over
  socket.on("game over", function(roomId){
    socket.leave(roomId);
    updateRooms();
  });

  //If move made tell user it is no longer their turn and tell other user in room
  //that it is their turn, giving them the row and column of move that was just made
  socket.on("move made", function(data){
    socket.emit("not my turn");
    //console.log(""+data.moveRow+data.moveCol);
    socket.to(data.roomId).emit("your turn",{
      movecol: data.moveCol,
      moverow: data.moveRow
    });
  });

  //Tell opponent that they will have first move and tell self it is not owns turn
  socket.on("you start", function(roomId){
    socket.emit("not my turn");
    socket.to(roomId).emit("You go first");
  });

  //If user tries to find a random match, if no current random rooms, then make one
  //Otherwise join what is already made
  socket.on("find random", function(username){
    if(randomRooms.length == 0){  //If no rooms made
      var roomCode = ""+Math.floor(Math.random() * (2000000 - 1000001) + 1000001);  //Give roomId out of range of private roomIds
      randomRooms.push(roomCode);
      socket.join(roomCode);
      socket.emit("random room made", roomCode);
    }
    else{ //Join the first random room available
      var randomRoomId = randomRooms[0];
      randomRooms.splice(0,1);
      socket.join(randomRoomId);
      socket.to(randomRoomId).emit("someone joined", username);
    }
  });

  //Create a private room
  socket.on("create room", function(roomId){
    socket.join(roomId);
    //console.log(roomId);
    privateRooms.push(roomId);
    socket.emit("room made",roomId);  //Tell user room was made.
  });

  //Function for joing private room
  socket.on("join private", function(data){
    var roomId = data.roomCode;
    //Check if roomCode is existing room and if it is join it and remove from arry of private rooms
    for(var i=0;i< privateRooms.length;i++){
      if(privateRooms[i] == roomId){
        privateRooms.splice(i,1);
        socket.join(roomId);
        socket.to(roomId).emit("someone joined", data.username);
        return;
      }
    }
    //Otherwise tell them it is a room that doesn't exist or is full.
    socket.emit("invalid room");
  });

  //Give acknowledgement to user that they joined
  socket.on("reply to join", function(data){
    socket.to(data.roomCode).emit("reply recieve", {
      opponent: data.username,
      roomId: data.roomCode
    });
  });

  //Send cookie info to script so that it can store it in currentUserInfo
  socket.on("send browser cookie", function(username) {
    //console.log(username);
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

    // If browser doesn't have a cookie new connection
    var usernameInProgress = "";
    //Generate random username from parts array
    for (part of parts) {
      usernameInProgress += part[Math.floor(Math.random() * part.length)];
    }
    
    //Add default theme as 1 at the end of the username
    var newUsername = usernameInProgress.concat("@#$%1");
    //console.log("new = "+ newUsername);
    //console.log(newUsername);
    var addUser = { username: newUsername, theme: "1"};
    currentUsers.push(addUser);       //Add user to the user array
    socket.emit("show username", { username: newUsername });  //Show username
    socket.emit("change greeting"); //If they didn't have cookie then change greeting to new user
  });

  //If user wants to try to change username
  socket.on("change username", function(data) {
    if (updateUserName(data.username, data.newusername)) {
        socket.emit("change cookie", {
            newName: data.newusername
        });
        socket.emit("show username", { username: data.newusername });
        return null;
    }
    else{
        socket.emit("name change failed",data.newusername);
    }
  });

  //Change theme
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

//Get browser cookie
const getBrowserCookie = socket => {
  socket.emit("get browser cookie");
};

//Update rooms, if they have no people in them then remove them from list
function updateRooms(){
  //console.log("random ="+randomRooms.length);
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


//Check if username is not taken and does not contain '@#$%' we need '@#$%' for saving theme
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
console.log("Listening port 4000.");
