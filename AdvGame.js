/*
 * File: AdvGame.js
 * ----------------
 * This file defines the AdvGame class, which records the information
 * necessary to play a game. Your job is to complete the implementation
 * of this file in stages as described in the "Milestones" section of
 * the assignment handout.
 */

/*
 * Factory method: AdvGame
 * Usage: let game = AdvGame();
 * ----------------------------
 * Creates an AdvGame object by reading data from the GameData element
 * in the index.html file.
 */

function AdvGame() {
    let gameXML = document.getElementById("GameData");
    if (gameXML === undefined) return undefined;
    let rooms = readRooms(gameXML);
    let objects = readObjects(gameXML);
    let synonyms = readSynonyms(gameXML);
    let currentRoom = rooms["START"];
    let previousRoom = undefined;
    let inventory = [];
    distributeObjects();

    /*
     * Function: distributeObjects
     * Usage: distributeObjects();
     * ---------------------------
     * Reads through the elements of objects and moves the objects into
     * their initial rooms.  As a special case, the room name "PLAYER" is
     * used as a signal that the object should be inserted in the player's
     * inventory.
     */

    function distributeObjects() {
        for (let objectName in objects) {
            let obj = objects[objectName];
            let location = obj.getLocation();
            if (location === "PLAYER") {
                inventory.push(obj);
            } else {
                rooms[location].addObject(obj);
            }
        }
    }

    /*
     * Function: takeObject
     * Usage: takeObject(objectName);
     * ------------------------------
     * Takes the named object out of the current room and adds it to the
     * player's inventory.  If the object does not exist in the room, this
     * function prints a message to that effect.
     */

    function takeObject(objectName) {
        let obj = objects[objectName.toLowerCase()];
        if (obj === undefined) {
            console.log("I don't recognize that object name");
        } else {
            if (!currentRoom.contains(obj)) {
                console.log("I don't see that here.");
            } else {
                currentRoom.removeObject(obj);
                inventory.push(obj);
                console.log("Taken.");
            }
        }
    }

    /*
     * Function: dropObject
     * Usage: dropObject(objectName);
     * ------------------------------
     * Drops the named object from the player inventory and adds it to the
     * list of objects in the current room.  If the player is not carrying
     * the object, this function prints a message to that effect.
     */

    function dropObject(objectName) {
        let obj = objects[objectName.toLowerCase()];
        if (obj === undefined) {
            console.log("I don't recognize that object name");
        } else {
            let index = inventory.indexOf(obj);
            if (index === -1) {
                console.log("You're not carrying that.");
            } else {
                inventory.splice(index, 1);
                currentRoom.addObject(obj);
                console.log("Dropped.");
            }
        }
    }

    /*
     * Function: printInventory
     * Usage: printInventory();
     * ------------------------
     * Lists all the objects the player is carrying on the console.
     */

    function printInventory() {
        let n = inventory.length;
        if (n === 0) {
            console.log("You are empty-handed.");
        } else {
            console.log("You are carrying:");
            for (let i = 0; i < n; i++) {
                console.log("  " + inventory[i].getDescription());
            }
        }
    }

    /*
     * Function: printHelpText
     * -----------------------
     * Prints the help text for the Adventure game.
     */

    function printHelpText() {
        for (let i = 0; i < HELP_TEXT.length; i++) {
            console.log(HELP_TEXT[i])
        }
    }

    /*
     * Function: enterRoom
     * Usage: enterRoom();
     * -------------------
     * Describes the current room and then waits for a user command.
     */

    function enterRoom() {
        let forcedRoomName = getNextRoom("FORCED");
        while (forcedRoomName !== undefined) {
            currentRoom.printLongDescription();
            currentRoom = rooms[forcedRoomName];
            forcedRoomName = getNextRoom("FORCED");
        }
        if (previousRoom !== currentRoom) {
            if (currentRoom.hasBeenVisited()) {
                currentRoom.printShortDescription();
            } else {
                currentRoom.printLongDescription();
                currentRoom.setVisited(true);
            }
            currentRoom.describeObjects();
            previousRoom = currentRoom;
        }
        console.requestInput("> ", applyUserCommand);
    }

    /*
     * Function: applyUserCommand
     * Usage: applyUserCommand(line);
     * ------------------------------
     * Executes the user's command.  The parameter line is the string
     * entered by the user.
     */

    function applyUserCommand(line) {
        let words = line.trim().split(" ");
        let cmd = getStandardDefinition(words[0]);
        if (cmd === "quit") {
            console.log("Thanks for playing.  Have a great day!!!");
            return;
        }
        if (cmd === "help") {
            printHelpText();
        } else if (cmd === "look") {
            currentRoom.printLongDescription();
            currentRoom.describeObjects();
        } else if (cmd === "take") {
            takeObject(getStandardDefinition(words[1]));
        } else if (cmd === "drop") {
            dropObject(getStandardDefinition(words[1]));
        } else if (cmd === "inventory") {
            printInventory();
        } else {
            let nextRoomName = getNextRoom(cmd);
            if (nextRoomName === undefined) {
                console.log("I don't know how to apply that word here.");
            } else {
                if (nextRoomName === "EXIT") return;
                if (rooms[nextRoomName] === undefined) {
                    alert("Illegal passage from " + currentRoom);
                }
                currentRoom = rooms[nextRoomName];
            }
        }
        enterRoom();
    }


    /*
     * Function: getNextRoom
     * Usage: let nextRoomName = getNextRoom(dir);
     * -------------------------------------------
     * Returns the name of the next room that comes from following the passage
     * in the indicated direction.  This method checks to make sure that the
     * the inventory contains the necessary key for the passage.
     */

    function getNextRoom(dir) {
        dir = dir.toLowerCase();
        let passages = currentRoom.getPassages();
        for (let i = 0; i < passages.length; i++) {
            let passage = passages[i];
            if (passage.getDirection() === dir) {
                let keyName = passage.getKey();
                if (keyName === undefined) {
                    return passage.getDestinationRoom();
                }
                let key = objects[keyName.toLowerCase()];
                if (key === undefined) {
                    alert("Illegal key name " + keyName);
                }
                if (inventory.indexOf(key) >= 0) {
                    return passage.getDestinationRoom();
                }
            }
        }
        return undefined;
    }

    /*
     * Function: readSynonyms
     * Usage: let synonyms = readSynonyms(gameXML);
     * --------------------------------------------
     * Creates a synonym object that maps alternative definitions to their
     * standard form.  The data for the map comes from the XML <synonym> tags.
     */

    function readSynonyms(gameXML) {
        let tags = gameXML.getElementsByTagName("synonym");
        let synonyms = {};
        for (let i = 0; i < tags.length; i++) {
            let synonymXML = tags[i];
            let word = synonymXML.getAttribute("word").toLowerCase();
            let definition = synonymXML.getAttribute("definition").toLowerCase();
            synonyms[word] = definition;
        }
        return synonyms;
    }


    /*
     * Function: getStandardDefinition(word)
     * Usage: let word = getStandardDefinition(word);
     * ----------------------------------------------
     * Looks up the standard definition of a word, which might be a synonym
     * for another word.  This function returns the standard form of the
     * word, which always appears in lower case.
     */

    function getStandardDefinition(word) {
        word = word.toLowerCase();
        let definition = synonyms[word];
        if (definition !== undefined) word = definition;
        return word;
    }

    let game = {};

    /*
     * Method: play
     * Usage: game.play();
     * -------------------
     * Plays the Adventure game.
     */

    game.play = function () {
        enterRoom();
    };

    return game;
}

/*
 * This constant defines the instructions for the adventure game so that
 * you don't have to retype it.  Make sure that you add additional lines
 * to HELP_TEXT to describe any extensions you've added for the contest.
 */

const HELP_TEXT = [
    "Welcome to Adventure!",
    "Who knows what wonders await you.  I will be your eyes",
    "and hands.  Direct me with natural English commands; I don't understand",
    "all of the English language, but I do a pretty good job.",
    "",
    "It's important to remember that passages often turn a lot, and that",
    "leaving a room to the north does not guarantee you can return to it to",
    "the south, although it often works out that way.  You'd best make",
    "yourself a map as you go along.",
    "",
    "Much of my vocabulary describes places and is used to move you there.",
    "To move, try words like IN, OUT, EAST, WEST, NORTH, SOUTH, UP, or DOWN.",
    "I also know about a number of objects hidden within the cave which you",
    "can TAKE or DROP.  To see what objects you're carrying, say INVENTORY.",
    "To reprint the detailed description of where you are, say LOOK.  If you",
    "want to end your adventure, say QUIT."
];
