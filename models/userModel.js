const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const functions = require("../utils/functions");

const UserError = require("../utils/UserError");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

let names = [];
let possibleLocations = [];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
    maxlength: [15, "Name is too long"],
    validate: [
      functions.validateManyCharacters,
      "Name includes invalid characters",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
    trim: true,
    validate: [validateEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be longer than 8 characters"],
    select: false,
  },
  changedPassword: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "ceo"],
    default: "user",
  },
  friends: [
    {
      type: String, // Change the _id if Kanapkabot changes in authenticationStation.createAccount
    },
  ],
  lastOnline: {
    type: Date,
    default: Date.now(),
  },
  lastOnlineLocation: {
    type: String,
    default: "Account Creation",
    validate: {
      validator: function (v) {
        return possibleLocations.includes(v);
      },
      message: `You can't be here...`,
    },
  },
  level: {
    type: Number,
    default: 0,
  },
  reputation: {
    type: String,
    default: "Unfamiliar",
  },
  wins: {
    type: Number,
    default: 0,
  },
  panelColor: {
    type: String,
    default: "255228196",
  },
  totalPlayed: {
    type: Number,
    default: 0,
  },
  timePlayed: {
    type: Number,
    default: 0,
  },
  profile: {
    type: String,
    default: "user.png",
    validate: [
      functions.validateManyCharacters,
      "Profile includes invalid characters",
    ],
  },
  notifications: [
    {
      kind: {
        type: String,
      },
      event: {
        type: String,
        unique: false,
      },
      content: {
        type: String,
      },
      action: {
        type: String,
      },
      image: {
        type: String,
        default: "logoOnly.png",
      },
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  history: [
    {
      game: {
        type: String,
        default: "Game name isn't avalible",
      },
      opponent: {
        type: String,
        default: "Opponent's name isn't avalible",
      },
      score: {
        type: String,
        default: "Score isn't avalible",
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
});

userSchema.pre("save", function (next) {
  if (this.isModified("notifications")) return next();
  this.lastOnline = Date.now();
  next();
});

// userSchema.pre("save", function (next) {
//   if (!this.isModified("friends")) return next();
//   const friendsSet = new Set([...this.friends]);
//   this.friends = Array.from(friendsSet);
//   next();
// });

userSchema.pre("save", function (next) {
  if (!this.isModified("notifications")) return next();
  if (this.notifications[0] && this.notifications[1]) {
    if (this.notifications[0].event === this.notifications[1].event) {
      return next(new UserError("You did this already", 400));
    }
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("wins")) {
    if (this.wins > 100) {
      this.reputation = "Mafia Boss";
    } else if (this.wins > 90) {
      this.reputation = "Mafia Underboss";
    } else if (this.wins > 80) {
      this.reputation = "Mafia Caporegime";
    } else if (this.wins > 70) {
      this.reputation = "Mafia Soldier";
    } else if (this.wins > 60) {
      this.reputation = "Mafia Associate";
    } else if (this.wins > 50) {
      this.reputation = "International Drug Lord";
    } else if (this.wins > 40) {
      this.reputation = "Drug Lord";
    } else if (this.wins > 30) {
      this.reputation = "Medical Marijuana Exporter";
    } else if (this.wins > 20) {
      this.reputation = "Villan";
    } else if (this.wins > 10) {
      this.reputation = "Thief";
    } else if (this.wins > 0) {
      this.reputation = "Civilian";
    }
  }
  next();
});
userSchema.pre("save", function (next) {
  if (this.isModified("totalPlayed")) {
    if (this.totalPlayed > 100) {
      this.level = 11;
    } else if (this.totalPlayed > 90) {
      this.level = 10;
    } else if (this.totalPlayed > 80) {
      this.level = 9;
    } else if (this.totalPlayed > 70) {
      this.level = 8;
    } else if (this.totalPlayed > 60) {
      this.level = 7;
    } else if (this.totalPlayed > 50) {
      this.level = 6;
    } else if (this.totalPlayed > 40) {
      this.level = 5;
    } else if (this.totalPlayed > 30) {
      this.level = 4;
    } else if (this.totalPlayed > 20) {
      this.level = 3;
    } else if (this.totalPlayed > 10) {
      this.level = 2;
    } else if (this.totalPlayed > 0) {
      this.level = 1;
    }
  }
  next();
});

userSchema.methods.comparePasswords = async function (input, user) {
  return await bcrypt.compare(input, user);
};

userSchema.methods.changedPasswordAfter = function (timestamp) {
  const changedPasswordTime = parseInt(
    this.changedPassword.getTime() / 1000,
    10
  );

  return timestamp < changedPasswordTime;
};

const User = mongoose.model("User", userSchema);

const getNames = async () => {
  const users = await User.find().select({ name: 1 });
  names = users.map((el) => el.name);
  possibleLocations = names.map((el) => {
    return `Browsing ${el}'s Panel`;
  });
  possibleLocations.unshift(
    "Home Page",
    "His Panel",
    "Browsing Panels",
    "Making Decisions",
    "Account Creation",
    "Playing For in a Row",
    "Unknown"
  );
};
getNames();

setInterval(getNames, 15 * 1000);

module.exports = User;
