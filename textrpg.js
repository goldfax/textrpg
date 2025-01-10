//This is the main game file for the text based game that I am writing -- will have a 2d array that will be able to be iterated over
//each part of the table will have instances of objects that are held in a hash table to add functionality
//the game pattern will be fixed for the beginning of development
//dynamic content may be something that begins if i learn how to use random number generators to make maps.

//creates a 2d array that will have rooms
class Map {
  /**
   * @param {number} height
   * @param {number} width
   */
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.array_map = Array.from({ length: width }, () => new Array(height));
  }

  /**
   *@param {number} y_pos
   *@param {number} x_pos
   *@param {Room} room
   */
  modify_map(x_pos, y_pos, room) {
    this.array_map[x_pos][y_pos] = room;
  }
}

//room that goes in each 2d array
//can have hash tables of objects that will get returned in the get info() function
//only have accessibility and possible directions for each room
class Room {
  /**
   * @param {boolean} accessible
   * @param {Array} directions
   * @param {number} id
   */
  constructor(accessiblity, directions, id) {
    this.accessible = accessiblity;
    this.directions = [
      directions[0],
      directions[1],
      directions[2],
      directions[3],
    ];
    this.has_character = false;
    this.room_id = id;
  }

  /**
   * @returns {Array}
   */
  get info() {
    return [this.directions, this.accessible];
  }

  /**
   * @param {boolean} yes_or_no
   * */
  set character_exists_here(yes_or_no) {
    this.has_character = yes_or_no;
  }

  get character_exists() {
    return this.has_character;
  }

  /**
   * @param {Array} input_directions
   */

  set possible_directions(input_directions) {
    this.directions = input_directions;
  }

  get room_is_accessible() {
    return this.accessible;
  }

  /**
   * @param {boolean} accessibility
   */
  set room_accessible(accessibility) {
    this.accessible = accessibility;
  }
}

//character class -- simply only needs a name and (can_move)
//there may be more characters than just the player
class Character {
  /**
   * @param {string} name
   * @param {boolean} can_move
   * @param {number} starting_room
   */
  constructor(name, can_move, starting_room) {
    this.name = name;
    this.can_move = can_move;
    this.room = starting_room;
  }

  /**
   * @param {number} room
   */

  set room_num(room) {
    this.room = room;
  }

  /**
   * @returns {number}
   */

  get room_num() {
    return this.room;
  }
  /**
   *
   * @param {string} direction
   * @param {Map} map
   * @param {Array} rooms
   *
   */
  move(direction, map, rooms) {
    // Method to move the character to a new room
    // Logic for moving the character
    if (
      direction === "n" &&
      this.room_num - map.width >= 0 &&
      rooms[this.room_num - map.width].room_is_accessible
    ) {
      this.room_num -= map.width;
    } else if (
      direction == "s" &&
      this.room_num + map.width < rooms.length &&
      rooms[this.room_num + map.width].room_is_accessible
    ) {
      this.room_num += map.width;
    } else if (
      direction == "e" &&
      this.room_num + 1 < rooms.length &&
      rooms[this.room_num + 1].room_is_accessible
    ) {
      this.room_num += 1;
    } else if (
      direction == "w" &&
      this.room_num - 1 >= 0 &&
      rooms[this.room_num - 1].room_is_accessible
    ) {
      this.room_num -= 1;
    } else {
      console.log("You cannot move in that direction");
    }
  }
}
//create new map
//create multiple base sets of rooms
//this is where we generate the game and the map and the rooms as well as the player
//this includes possible directions
let new_map = new Map(4, 4);
let new_char = new Character("nulthiel", true, 0);
let count = 0;
for (let i = 0; i < new_map.width; i++) {
  for (let j = 0; j < new_map.height; j++) {
    new_map.modify_map(i, j, new Room(true, true, count));
    count++;
  }
}

//create a list of rooms to get an easy to access ID
let list_rooms = [];
for (let i = 0; i < new_map.width; i++) {
  for (let j = 0; j < new_map.height; j++) {
    list_rooms.push(new_map.array_map[i][j]);
  }
}

function getPossibleDirections(room_id, map) {
  const directions = [];
  const width = map.width;
  const height = map.height;
  const totalRooms = width * height;

  if (room_id >= width) directions.push("n"); // Not on the top row
  if (room_id % width !== width - 1) directions.push("e"); // Not on the right edge
  if (room_id < totalRooms - width) directions.push("s"); // Not on the bottom row
  if (room_id % width !== 0) directions.push("w"); // Not on the left edge

  return directions;
}

for (let i = 0; i < list_rooms.length; i++) {
  list_rooms[i].possible_directions = getPossibleDirections(
    list_rooms[i].room_id,
    new_map
  );
}
function updateCharacterPosition(character, rooms) {
  // need to call lthis function every time the character moves
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].character_exists_here = rooms[i].room_id === character.room;
  }
}
// console.log(new_map);
updateCharacterPosition(new_char, list_rooms);
// //list of rooms that can be accessed
console.log(list_rooms);

//room update function

updateCharacterPosition(new_char, list_rooms);
console.log(list_rooms);
new_char.move("n", new_map, list_rooms);

new_char.move("s", new_map, list_rooms);
updateCharacterPosition(new_char, list_rooms);
console.log(list_rooms);
new_char.move("e", new_map, list_rooms);
updateCharacterPosition(new_char, list_rooms);
console.log(list_rooms);
new_char.move("n", new_map, list_rooms);
updateCharacterPosition(new_char, list_rooms);
console.log(list_rooms);
new_char.move("n", new_map, list_rooms);
updateCharacterPosition(new_char, list_rooms);
console.log(list_rooms);
//it is still possible to ask the character to move in a direction that is not possible
//need to sanitize input so that the character does not move into a wall
