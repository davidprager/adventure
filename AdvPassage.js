/*
 * File: AdvPassage.js
 * -------------------
 * This file defines a class that models a passage in Adventure.  Each
 * passage is characterized by the following properties:
 *
 * - The word that defines the direction of motion, such as "NORTH"
 * - The name of the room to which the passage leads
 * - The name of the object that serves as a key to taking the passage
 */

"use strict";

/*
 * Factory method: AdvPassage
 * Usage: let passage = AdvPassage(dir, room, key);
 * ------------------------------------------------
 * Creates an AdvPassage from the specified properties.  The key parameter
 * is optional.  If it is undefined the passage requires no key.
 */

function AdvPassage(direction, room, key) {

   let passage = { };

/*
 * Method: getDirection
 * Usage: let dir = passage.getDirection();
 * ----------------------------------------
 * Returns the string form of the motion verb used to indicate the direction.
 */

   passage.getDirection = function() {
      return direction;
   }

/*
 * Method: getDestinationRoom
 * Usage: let room = passage.getDestinationRoom();
 * -----------------------------------------------
 * Returns the name of the room to which this passage leads.
 */

   passage.getDestinationRoom = function() {
      return room;
   }

/*
 * Method: getKey
 * Usage: let key = passage.getKey();
 * ----------------------------------
 * Returns the name of the object necessary to follow this passage.  If
 * there is no key, getKey returns the constant undefined.
 */

   passage.getKey = function() {
      return key;
   }

   return passage;

}

/*
 * Function: readPassage
 * Usage: let passage = readPassage(passageXML);
 * ---------------------------------------------
 * Creates the passage data structure by reading the contents of an XML
 * <passage> tag.
 */

function readPassage(passageXML) {
   let dir = passageXML.getAttribute("dir").toLowerCase();
   let room = passageXML.getAttribute("room");
   let key = passageXML.getAttribute("key");
   if (key === null || key === "") {
      key = undefined;
   } else {
      key = key.toLowerCase();
   }
   return AdvPassage(dir, room, key);
}
