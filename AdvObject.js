/*
 * File: AdvObject.js
 * ------------------
 * This file defines a class that models an object in Adventure.  In the
 * finished assignment, each object is characterized by the following
 * properties:
 *
 * - The object name, which is the noun used to refer to the object
 * - The object description, which is a one-line string
 * - The name of the room in which the object initially lives
 *
 * The XML format for an object is described in the assignment.
 */

"use strict";

/*
 * Factory method: AdvObject
 * Usage: let obj = AdvObject(name, description, location);
 * --------------------------------------------------------
 * Creates an AdvObject from the specified properties.
 */

function AdvObject(name, description, location) {

   let obj = { };

/*
 * Method: getName
 * Usage: let name = obj.getName();
 * --------------------------------
 * Returns the name of this object.
 */

   obj.getName = function() {
      return name;
   };

/*
 * Method: getDescription
 * Usage: let description = obj.getDescription();
 * ----------------------------------------------
 * Returns the description of this object.
 */

   obj.getDescription = function() {
      return description;
   };

/*
 * Method: getLocation
 * Usage: let roomName = obj.getLocation();
 * ----------------------------------------
 * Returns the name of the room in which this object initially lives.
 */

   obj.getLocation = function() {
      return location;
   };

/*
 * Method: toString
 * Usage: (usually called implicitly)
 * ----------------------------------
 * Returns the string form of the AdvObject.
 */

   obj.toString = function() {
      return "<AdvObject:" + name + ">";
   };

   return obj;
}

/*
 * Function: readObjects
 * Usage: let objects = readObjects(gameXML);
 * ------------------------------------------
 * Creates a map from object names to objects by reading the XML data
 * from the <object> tags.
 */

function readObjects(gameXML) {
   let tags = gameXML.getElementsByTagName("object");
   let objects = { };
   for (let i = 0; i < tags.length; i++) {
      let objXML = tags[i];
      let name = objXML.getAttribute("name").toLowerCase();
      let description = objXML.getAttribute("description");
      let location = objXML.getAttribute("location");
      let obj = AdvObject(name, description, location);
      objects[obj.getName()] = obj;
   }
   return objects;

}
