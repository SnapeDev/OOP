// JavaScript Game Logic
class Room {
  constructor(name, description) {
    this._name = name;
    this._description = description;
    this._linkedRooms = {};
    this._item = null;
    this._character = null;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  set name(value) {
    if (value.length < 4) {
      alert("That name is too short.");
      return;
    }
    this._name = value;
  }

  describe() {
    return `Looking around the ${this._name}, you can see ${this._description}`;
  }

  getDetails() {
    const entries = Object.entries(this._linkedRooms);
    let details = [];
    for (const [direction, room] of entries) {
      details.push(`The ${room._name} is to the ${direction}.`);
    }
    return details.join(". ");
  }

  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert("You cannot go in that direction.");
      return this;
    }
  }

  linkRoom(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
  }

  set item(item) {
    this._item = item;
  }

  get item() {
    return this._item;
  }

  set character(character) {
    this._character = character;
  }

  get character() {
    return this._character;
  }
}

class Item {
  constructor(name, description) {
    this._name = name;
    this._description = description;
  }

  describe() {
    return `You see a ${this._name} here. ${this._description}`;
  }

  get name() {
    return this._name;
  }
}

class Character {
  constructor(name, description, conversation) {
    this._name = name;
    this._description = description;
    this._conversation = conversation;
  }

  describe() {
    return `You have met ${this._name}, ${this._description}.`;
  }

  converse() {
    return `${this._name} says \"${this._conversation}\"`;
  }
}

let collectedCarrots = 0;

// Rooms
const Garden = new Room(
  "garden",
  "a lush green area with flowers and bushes. It feels serene."
);
const Kitchen = new Room(
  "kitchen",
  "a long narrow room with worktops on either side and a large bench in the middle"
);
const Lounge = new Room(
  "lounge",
  "a large room with two sofas and a large fireplace"
);
const GamesRoom = new Room(
  "Games Room",
  "a large room with a pool table at its center"
);
const Hall = new Room(
  "hall",
  "a grand entrance hall with large paintings around the walls"
);
const Stairwell = new Room(
  "stairwell",
  "a small room with a staircase leading down"
);
const Basement = new Room(
  "basement",
  "a dark and damp room with a gaping hole in the middle of the floor"
);

const LaundryRoom = new Room(
  "laundry room",
  "a small room with a washer and dryer"
);

// Linking rooms
Garden.linkRoom("north", Hall);
Hall.linkRoom("south", Garden);
Hall.linkRoom("west", Kitchen);
Hall.linkRoom("east", Lounge);
Hall.linkRoom("north", LaundryRoom);
LaundryRoom.linkRoom("south", Hall);
Kitchen.linkRoom("east", Hall);
Lounge.linkRoom("west", Hall);
Lounge.linkRoom("north", GamesRoom);
GamesRoom.linkRoom("south", Lounge);
GamesRoom.linkRoom("west", Stairwell);
Stairwell.linkRoom("east", GamesRoom);
Stairwell.linkRoom("south", Basement);
Basement.linkRoom("north", Stairwell);
Basement.linkRoom("east", Garden);

// Items
Kitchen.item = new Item("carrot", "It's a bright orange carrot.");
LaundryRoom.item = new Item(
  "carrot",
  "Another carrot, perfect for the rabbit!"
);
Lounge.item = new Item("carrot", "This carrot looks fresh and tasty.");
const GoldenCarrot = new Item(
  "golden carrot",
  "A rare golden carrot dangles above the hole in the floor. It looks risky..."
);
Basement.item = GoldenCarrot;

// Rabbit
const Rabbit = new Character(
  "Rabbit",
  "a small fluffy rabbit hiding behind a bush",
  "Thank you for the carrots!"
);
Garden.character = Rabbit;

const displayRoomInfo = (room) => {
  let itemMsg = room.item
    ? room.item.describe()
    : "There appears to be no carrots here.";
  let occupantMsg = room.character ? room.character.describe() : "";
  const carrotStatus = `
  <p>
    <img src=\"./image/carrot.png\" class=\"inline-block w-10 h-10\" />
    ${collectedCarrots}/3
  </p>`;
  let textContent =
    `<h2 class=\"text-2xl font-bold mb-4\">You are in the ${room.name}</h2>` +
    `<p class=\"mb-4 leading-relaxed\">${room.describe()}</p>` +
    `<p class=\"mb-4 leading-relaxed\">${occupantMsg}</p>` +
    `<p class=\"mb-4 leading-relaxed\">${itemMsg}</p>` +
    `<p class=\"mb-4 leading-relaxed\">${room.getDetails()}</p>` +
    `<p class=\"mb-4 leading-relaxed\">${carrotStatus}</p>`;

  document.getElementById("text-area").innerHTML = textContent;
  document.getElementById("button-area").innerHTML =
    '> <input type="text" id="user-text" class="border rounded p-2 w-50" />';
  document.getElementById("user-text").focus();
};

const triggerGameOver = () => {
  document.getElementById("game-area").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");
};

const restartGame = () => {
  collectedCarrots = 0; // Reset carrot count
  currentRoom = Garden; // Reset to starting room
  document.getElementById("game-area").classList.remove("hidden");
  document.getElementById("game-over").classList.add("hidden");
  displayRoomInfo(currentRoom); // Refresh the game display
};

const startGame = () => {
  let currentRoom = Garden;

  displayRoomInfo(currentRoom);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = document.getElementById("user-text").value.toLowerCase();

      if (command.startsWith("move ")) {
        const direction = command.split(" ")[1];
        currentRoom = currentRoom.move(direction);
        document.getElementById("user-text").value = "";
        displayRoomInfo(currentRoom);
      } else if (command === "collect carrot") {
        if (collectedCarrots >= 3) {
          alert("Your bag is full, you have already collected enough carrots!");
          return;
        }
        if (currentRoom.item && currentRoom.item.name === "carrot") {
          collectedCarrots++;
          const carrotJingle = document.getElementById("carrot-jingle");
          carrotJingle.play();
          currentRoom.item = null;
        } else if (
          currentRoom.item &&
          currentRoom.item.name === "golden carrot"
        ) {
          const success = Math.random() < 0.5; // 50/50 chance
          if (success) {
            collectedCarrots = 3; // Successfully collect the golden carrot
            const carrotJingle = document.getElementById("carrot-jingle");

            // Play the jingle sound
            carrotJingle.play();

            // Wait for the jingle to finish before showing the alert
            carrotJingle.onended = function () {
              alert(
                "You successfully grabbed the golden carrot! Carrots collected: 3/3"
              );
            };
            currentRoom.item = null; // Remove the golden carrot
          } else {
            triggerGameOver(); // Trigger game-over state
            return; // Stop the game logic here
          }
        } else {
          alert("There's no carrot here to take.");
        }
        displayRoomInfo(currentRoom);
      } else if (command === "find rabbit") {
        if (currentRoom === Garden && collectedCarrots >= 3) {
          alert("You gave the rabbit the carrots. It comes out of hiding!");
          document.getElementById("text-area").innerHTML =
            `<p>${Rabbit.describe()}</p>` +
            `<p>${Rabbit.converse()}</p>` +
            document.getElementById("game-area").classList.add("hidden");
          document
            .getElementById("congratulations-screen")
            .classList.remove("hidden");
        } else if (currentRoom === Garden) {
          alert(
            "The rabbit is still hiding. You need to collect 3 carrots first."
          );
        } else {
          alert("You can only find the rabbit in the garden.");
        }
        displayRoomInfo(currentRoom);
      } else {
        alert(
          "Invalid command! Try commands like 'move <direction>', 'collect carrot', or 'find rabbit'."
        );
      }
    }
  });
};

document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("intro-page").classList.add("hidden");
  document.getElementById("game-area").classList.remove("hidden");

  startGame();
});
