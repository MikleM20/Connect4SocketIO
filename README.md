# Connect4
Connect4 Web App Using Socket io

To Run:
- Ensure that node and npm is installed. This can be done by going to the
command line/terminal (can be from your IDE if IDE is capable)/git bash terminal
and using “node -v” and “npm -v”.
- If you have it installed use of the 3 above (command line, terminal, git bash
terminal) and navigate to where you have unzipped the zip using “cd”.
- Once there you will need to install the dependencies like express, socket.io and
jQuery that were used to create the project. To do this run “npm install”.
- Once the install has been completed, use “node server” to start up the socket.io
server.
- You can confirm it has been started as it should print out “running” in the
command line. This listens on port 4000 so go to localhost:4000.
- This uses cookies so make sure to use different browsers (incognito and normal
count as different browsers).
NOTE:
- This can be run across multiple devices. To do so:
o Devices must be connected to the same router.
 On Windows, on the computer you are going to start up the
socket.io server with, you go into the terminal and run “ipconfig” it
will output multiple IPs one of which will look similar to 10.0.0.#
(where # is 0-8). Once you have that and the server has been
started, on a different device (again must be connected to the same
router) you can visit the site 10.0.0.#:4000 (where # is 0-8
depending on the ipconfig output you received).
 On Linux, instead of using “ipconfig” you can run “ifconfig” and
there will be an IP similar to what I believe to looks like 127.0.0.#
(where # is 0-8). Then similarly you can use that IP to
connect/interact with the site (127.0.0.#:4000 would be put into
the URL).

Once Running:
- When you first visit the site, it will generate for you a random string of multiple
words, you can change this by replacing the text in the text box and pressing
enter/change name button.
o NOTE: I do not allow user to have the substring ‘@#$%’ in their username
as I concatenate the theme after the username using this substring to help
me store both in 1 cookie.
o I do not allow multiple users to have the same username as it may allow
for one user to change the wrong user’s theme.
- If you are returning (assuming cookie hasn’t expired yet) it will display the
username you previously had before reconnecting to site.
- To play a private game with friend, have one of you create a private room, in that
private room you will be given a room code in which you can share with your
friend so that they can join the room using the text field and join room button.
- To play a random opponent, press the find random opponent button and if there
is someone already waiting you will join their game, otherwise you will be moved
to a room, and must wait for a random opponent.
In Room/Game:
- In the room you may choose to change your color theme whenever you want
which will change the color of the game board. This theme will be stored in user
cookie.
Playing
- If it is your turn you can move the move across the board and there will be an
indicator of where your piece would place if you were to play/click there, IF NO
INDICATOR SHOWN THEN IT IS INVALID MOVE AND GAME WILL WAIT FOR YOU
TO MAKE VALID MOVE.
- IF it is not your turn you cannot see any indicator on hover and the only thing you
can do is change the theme of your board.
GAME OVER
- Once game is finished via tie or someone won then user MUST reload page to get
back to home page in which they can look for another game.
o Site does not check if one of the users has disconnected mid-way
through the game, if this occurs then the user remaining in room will be
left waiting for eternity/until they reload page to find another game.
 If it is their turn, they can make they turn but…
 Once it is opponent’s (opponent being person that left midway
through) turn then remaining user will be left waiting.
Other things to Note
- User who was waiting for opponent to join whether it be for a friend in private or
for a random in random search will be person to make the first move.
