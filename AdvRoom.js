/*
 * File: AdvRoom.js
 * ----------------
 * This file defines a class that models a single room in Adventure.
 * Each room is characterized by the following properties:
 *
 * - The room name, which uniquely identifies the room
 * - The short description
 * - The multiline long description
 * - The passage table specifying the exits and where they lead
 * - A list of objects contained in the room
 * - A flag indicating whether the room has been visited
 *
 * The XML format for a room is described in the assignment.
 */

"use strict";

/*
 * Factory method: AdvRoom
 * Usage: let room = AdvRoom(name, shortDescription, longDescription, passages)
 * ----------------------------------------------------------------------------
 * Creates an AdvRoom from the specified properties.
 */

function AdvRoom(name, shortDescription, longDescription, passages) {

   let room = { };
   let visited = false;
   let contents = [ ];

/*
 * Method: getName
 * Usage: let name = room.getName();
 * ---------------------------------
 * Returns the name of the room.
 */

   room.getName = function() {
      return name;
   };

/*
 * Method: printShortDescription
 * Usage: room.printShortDescription();
 * ------------------------------------
 * Prints the short description of the room.  If no short description
 * exists, this method prints the long description.
 */

   room.printShortDescription = function() {
      if (shortDescription === undefined) {
         room.printLongDescription();
      } else {
         console.log(shortDescription + ".");
      }
   };

/*
 * Method: printLongDescription
 * Usage: room.printLongDescription();
 * -----------------------------------
 * Prints the long description of the room.
 */

   room.printLongDescription = function() {
      console.write(longDescription + "<br />");
   };

/*
 * Method: getPassages
 * Usage: let passages = room.getPassages();
 * -----------------------------------------
 * Returns the passages array for this room.
 */

   room.getPassages = function() {
      return passages;
   };

/*
 * Method: setVisited
 * Usage: room.setVisited(flag);
 * -----------------------------
 * Sets an internal flag in the room that determines whether it has been
 * visited.  The Boolean argument flag must be either true or false.
 */

   room.setVisited = function(flag) {
      visited = flag;
   };

/*
 * Method: hasBeenVisited
 * Usage: if (room.hasBeenVisited()) . . .
 * ---------------------------------------
 * Returns true if the room has been visited, and false otherwise.
 */

   room.hasBeenVisited = function() {
      return visited;
   };

/*
 * Method: describeObjects
 * Usage: room.describeObjects();
 * ------------------------------
 * Describes the objects that exist in the room.
 */

   room.describeObjects = function() {
      for (let i = 0; i < contents.length; i++) {
         console.log("There is " + contents[i].getDescription() + " here.");
      }
   };

/*
 * Method: addObject
 * Usage: room.addObject(obj);
 * ---------------------------
 * Adds the specified object to the list of objects in the room.
 */

   room.addObject = function(obj) {
      contents.push(obj);
   };

/*
 * Method: removeObject
 * Usage: room.removeObject(obj);
 * ------------------------------
 * Removes the specified object from the list of objects in the room.
 */

   room.removeObject = function(obj) {
      let index = contents.indexOf(obj);
      if (index >= 0) contents.splice(index, 1);
   };

/*
 * Method: contains
 * Usage: if (room.contains(obj)) . . .
 * ------------------------------------
 * Returns true if the room contains the specified object.
 */

   room.contains = function(obj) {
      return contents.indexOf(obj) >= 0;
   };

/*
 * Method: toString
 * Usage: (usually called implicitly)
 * ----------------------------------
 * Returns the string form of the AdvRoom.
 */

   room.toString = function() {
      return "<AdvRoom:" + name + ">";
   };

   return room;

}

/*
 * Function: readRooms
 * Usage: let rooms = readRooms(gameXML);
 * --------------------------------------
 * Creates a map for the rooms by reading all the room tags from the
 * XML data for the game.  The keys in the map are the room names,
 * and the values are the AdvRoom objects that contain the data for
 * the corresponding room.  To ensure that the game starts with the
 * first room in the XML data, the map also stores a reference to the
 * first room under the name "START".
 */

function readRooms(gameXML) {
   let rooms = { };
   let tags = gameXML.getElementsByTagName("room");
   for (let i = 0; i < tags.length; i++) {
      let roomXML = tags[i];
      let name = roomXML.getAttribute("name");
      let shortDescription = roomXML.getAttribute("short");
      if (shortDescription === null) shortDescription = undefined;
      let longDescription = roomXML.innerHTML;
      let passages = readPassages(roomXML);
      let room = AdvRoom(name, shortDescription, longDescription, passages);
      if (i === 0) rooms["START"] = room;
      rooms[name] = room;
   }
   return rooms;
}

/*
 * Function: readPassages
 * Usage: let passages = readPassages(roomXML);
 * --------------------------------------------
 * Reads the data structure containing the passages.  In this version,
 * passages is an array of AdvPassage entries.
 */

function readPassages(roomXML) {
   let passages = [ ];
   let tags = roomXML.getElementsByTagName("passage");
   for (let i = 0; i < tags.length; i++) {
      passages.push(readPassage(tags[i]));      
   }
   return passages;
}
