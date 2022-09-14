const body = document.querySelector("body");
const addToFriendsBtn = document.getElementById("add-to-friends");
const removeFromFriendsBtn = document.getElementById("remove-from-friends");
const inviteToGameBtn = document.getElementById("invite-to-game");
const createAccountBtn = document.getElementById("create-account");
const logInBtn = document.getElementById("log-in");
const selfAdmirersBtn = document.getElementById("self-admirers");
const userNameField = document.getElementById("userName");
const userStatusField = document.getElementById("userStatus");
const userProfilePicture = document.getElementById("profilePicture");
const statsRep = document.getElementById("stats-rep");
const statsWins = document.getElementById("stats-wins");
const statsGamesPlayed = document.getElementById("stats-games-played");
const statsTimePlayed = document.getElementById("stats-time-played");

let panelInfo = "Browsing Panels";

const inviteCreateGame = () => {
  const mFR = new XMLHttpRequest();
  mFR.open("POST", `../api/play/fir/${Math.floor(Math.random() * 100000 + 1)}`);
  mFR.setRequestHeader("Accept", "application/json");
  mFR.setRequestHeader("Content-Type", "application/json");
  mFR.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  const data = JSON.stringify({
    guest: `${
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    }`,
  });

  mFR.send(data);

  mFR.onload = () => {
    displayMessage(JSON.parse(mFR.response).message);
  };
};

const manageFriends = (link) => {
  const mFR = new XMLHttpRequest();
  mFR.open("POST", link);
  mFR.setRequestHeader("Accept", "application/json");
  mFR.setRequestHeader("Content-Type", "application/json");
  mFR.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  const data = JSON.stringify({
    location: "Making Decisions",
  });

  mFR.send(data);

  mFR.onload = () => {
    displayMessage(JSON.parse(mFR.response).message);
  };
};

const displayData = (response) => {
  panelInfo = `Browsing ${response.name}'s Panel`;
  if (response.panelColor)
    body.style.backgroundColor = `rgb(${response.panelColor.slice(
      0,
      3
    )}, ${response.panelColor.slice(3, 6)}, ${response.panelColor.slice(6, 9)}`;
  else {
    body.style.backgroundColor = "bisque";
  }
  document.querySelector(
    "title"
  ).innerText = `${response.name} - Kanapka Studios`;
  document
    .querySelector('link[name="icon"]')
    .setAttribute("href", `/profiles/${response.profile}`);
  userStatusField.innerText =
    new Date(response.lastOnline).getTime() + 1000 * 60 > new Date().getTime()
      ? "Online"
      : "Offline";
  userNameField.innerText = response.name;
  userProfilePicture.src = `/profiles/${response.profile}`;
  statsRep.innerText = response.reputation || "Unknown";
  statsWins.innerText = response.wins || "Unknown";
  statsGamesPlayed.innerText = `${response.totalPlayed} games`;
  statsTimePlayed.innerText = `${
    String(response.timePlayed).split(".")[0]
  } minutes`;
};

// Page appearences ----------------------------------------------------------------------------

const userNotLoggedIn = () => {
  removeFromFriendsBtn.style.display = "none";
  inviteToGameBtn.style.display = "none";
  addToFriendsBtn.style.display = "none";
  createAccountBtn.style.display = "block";
  logInBtn.style.display = "block";
};
const selfAdmirer = () => {
  removeFromFriendsBtn.style.display = "none";
  inviteToGameBtn.style.display = "none";
  addToFriendsBtn.style.display = "none";
  createAccountBtn.style.display = "none";
  logInBtn.style.display = "none";
  selfAdmirersBtn.style.display = "block";
};
const userFriend = () => {
  removeFromFriendsBtn.style.display = "block";
  inviteToGameBtn.style.display = "block";
  addToFriendsBtn.style.display = "none";
  createAccountBtn.style.display = "none";
  logInBtn.style.display = "none";
  selfAdmirersBtn.style.display = "none";
};
const notUserFriend = () => {
  removeFromFriendsBtn.style.display = "none";
  inviteToGameBtn.style.display = "none";
  addToFriendsBtn.style.display = "block";
  createAccountBtn.style.display = "none";
  logInBtn.style.display = "none";
  selfAdmirersBtn.style.display = "none";
};

const sendRequest = (method) => {
  const basicData = new XMLHttpRequest();
  basicData.open(
    method,
    `./api/users/${
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    }`
  );
  basicData.setRequestHeader("Accept", "application/json");
  basicData.setRequestHeader("Content-Type", "application/json");
  basicData.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  basicData.send(JSON.stringify({ location: panelInfo }));

  basicData.onload = () => {
    const response = JSON.parse(basicData.response);
    if (response.dataType === "friendProfile") {
      userFriend();
    } else if (response.dataType === "yourProfile") {
      selfAdmirer();
    } else if (response.isLoggedIn === 0) {
      userNotLoggedIn();
    } else {
      notUserFriend();
    }
    displayData(response.data);
  };
};

window.onload = () => {
  if (!document.cookie) {
    sendRequest("get");
    userNotLoggedIn();
    setInterval(() => {
      sendRequest("get");
    }, 8000);
  } else {
    sendRequest("POST");
    setInterval(() => {
      sendRequest("POST");
    }, 8000);
  }
};

inviteToGameBtn.addEventListener("click", () => inviteCreateGame());

addToFriendsBtn.addEventListener("click", () => {
  manageFriends(
    `../api/add-friend/${
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    }`
  );
});
removeFromFriendsBtn.addEventListener("click", () => {
  manageFriends(
    `../api/remove-friend/${
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    }`
  );
});

// NOT AVALIBLE ---------------------------------------------------------------
