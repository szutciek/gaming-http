const profilePicture = document.getElementById("profilePicture");
const userName = document.getElementById("userName");
const userReputation = document.getElementById("userReputation");
const statsLevel = document.getElementById("stats-level");
const statsWins = document.getElementById("stats-wins");
const statsGamesPlayed = document.getElementById("stats-games-played");
const statsTimePlayed = document.getElementById("stats-time-played");
const notificationsList = document.getElementById("notificationsList");
const friendList = document.getElementById("friendList");
const activeFriends = document.getElementById("active-friends");

let onlineFriends = 0;

const goToGame = (link) => {
  window.location = link;
};
const notificationAction = (link) => {
  if (link.split("/")[1] !== "play") {
    const manageNot = new XMLHttpRequest();
    manageNot.open("POST", link);
    manageNot.setRequestHeader("Accept", "application/json");
    manageNot.setRequestHeader("Content-Type", "application/json");
    manageNot.setRequestHeader("Authorization", document.cookie.split("=")[1]);
    manageNot.send();

    manageNot.onload = () => {
      const response = JSON.parse(manageNot.response);
      displayMessage(response.message);
      getFriendsData();
      replaceData();
    };
  } else {
    goToGame(`..${link}`);
  }
};

const removeNotification = (event) => {
  const manageNot = new XMLHttpRequest();
  manageNot.open("POST", `./api/delete-notification/${event}`);
  manageNot.setRequestHeader("Accept", "application/json");
  manageNot.setRequestHeader("Content-Type", "application/json");
  manageNot.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  manageNot.send();

  manageNot.onload = () => {
    const response = JSON.parse(manageNot.response);
    displayMessage(response.message);
    replaceData();
  };
};

const updateFriendsDisplay = (friends) => {
  onlineFriends = 0;
  const now = Date.now();
  friendList.innerHTML = "";
  friends.forEach((friend) => {
    let lastOnline = new Date(friend.lastOnline).getTime();
    if ((now - lastOnline) / 1000 / 60 / 60 / 24 > 1) {
      lastOnline = `Last online ${Math.round(
        (now - lastOnline) / 1000 / 60 / 60 / 24
      )} ${
        Math.round((now - lastOnline) / 1000 / 60 / 60 / 24) > 1
          ? "days"
          : "day"
      } ago`;
    } else if ((now - lastOnline) / 1000 / 60 / 60 > 1) {
      lastOnline = `Last online ${Math.round(
        (now - lastOnline) / 1000 / 60 / 60
      )} ${
        Math.round((now - lastOnline) / 1000 / 60 / 60) > 1 ? "hours" : "hour"
      } ago`;
    } else if ((now - lastOnline) / 1000 / 60 > 1) {
      lastOnline = `Last online ${Math.round((now - lastOnline) / 1000 / 60)} ${
        Math.round((now - lastOnline) / 1000 / 60) > 1 ? "minutes" : "minute"
      } ago`;
    } else if ((now - lastOnline) / 1000 > 10) {
      lastOnline = `Last online ${Math.round(
        (now - lastOnline) / 1000
      )} seconds ago`;
    } else {
      onlineFriends++;
      lastOnline = `Online - ${friend.lastOnlineLocation}`;
    }
    friendList.insertAdjacentHTML(
      "beforeend",
      `<li>
              <img class="friendImg" src="profiles/${friend.profile}"/>
              <div class="friendDetails">
                <a href="../${friend.name}">${friend.name}</a>
                <h4>${lastOnline}<span>${
        lastOnline[0] === "L" ? "🔴" : "🟢"
      }</span></h4>
              </div>
            </li>`
    );
    activeFriends.innerText = onlineFriends;
  });
};

const updateFriends = () => {
  const friendData = new XMLHttpRequest();
  friendData.open("get", "./api/friend-data");
  friendData.setRequestHeader("Accept", "application/json");
  friendData.setRequestHeader("Content-Type", "application/json");
  friendData.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  friendData.send();

  friendData.onload = () => {
    const friends = JSON.parse(friendData.response).data.friends;
    updateFriendsDisplay(friends);
  };
};

const replaceData = (user) => {
  document.querySelector(
    "title"
  ).innerText = `${user.name}'s panel - Kanapka Studios`;
  document
    .querySelector('link[name="icon"]')
    .setAttribute("href", `profiles/${user.profile}`);

  profilePicture.src = `profiles/${user.profile}`;
  userName.innerText = user.name;
  userReputation.innerText = user.reputation;

  statsLevel.innerText = user.level;
  statsWins.innerText = user.wins;
  statsGamesPlayed.innerText = `${user.totalPlayed} games`;
  statsTimePlayed.innerText = `${
    String(user.timePlayed).split(".")[0]
  } minutes`;

  notificationsList.innerHTML = "";
  user.notifications.forEach((not) => {
    notificationsList.insertAdjacentHTML(
      "beforeend",
      `<li>
            <img src="${not.image}" />
            <div>
              <h3 id="notification-title" href="">${
                not.event.split(":")[0]
              }</h3>
              <h4 id="notification-content">
                ${not.content}
              </h4>
              <a id="accept-not" >Accept</a><a id="decline-not" >Decline</a>
            </div>
          </li>`
    );
  });
  const performAccept = (i) => {
    notificationAction(user.notifications[i].action);
  };
  const performDecline = (i) => {
    removeNotification(user.notifications[i].event);
  };
  const accept = document.querySelectorAll("#accept-not");
  accept.forEach((el, i) => {
    el.addEventListener("click", () => performAccept(i));
  });
  const decline = document.querySelectorAll("#decline-not");
  decline.forEach((el, i) => {
    el.addEventListener("click", () => performDecline(i));
  });
  updateFriends();
};

const sendRequest = () => {
  const basicData = new XMLHttpRequest();
  basicData.open("POST", "./api/me");
  basicData.setRequestHeader("Accept", "application/json");
  basicData.setRequestHeader("Content-Type", "application/json");
  basicData.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  basicData.send(JSON.stringify({ location: "His Panel" }));

  basicData.onload = () => {
    const response = JSON.parse(basicData.response);
    if (response.dataType === "yourProfile") {
      replaceData(JSON.parse(basicData.response).data);
    } else {
      window.location("/home");
    }
  };
};

window.onload = () => {
  if (!document.cookie) {
    window.location("/home");
  } else {
    sendRequest();
  }
};

setInterval(sendRequest, 8000);
