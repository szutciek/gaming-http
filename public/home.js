const userProfileBtn = document.getElementById("userBtn");
const userPopupName = document.getElementById("user-popup-name");
const panelButton = document.getElementById("panelButton");
const logOutButton = document.getElementById("logOutButton");
const loginBtn = document.getElementById("loginBtn");
const createAccountBtn = document.getElementById("createAccountBtn");
const actionText = document.getElementById("actionText");

// Functions ----------------------------------------------------------------------------

const userNotLoggedIn = () => {
  userProfileBtn.style.display = "none";
  userProfileBtn.style.backgroundImage = "";
  actionText.innerText = "Sign in to your account to begin";
  userPopupName.style.display = "inline";
  panelButton.style.display = "none";
  logOutButton.style.display = "none";
  loginBtn.style.display = "inline";
  createAccountBtn.style.display = "inline";
};

const userLoggedIn = (data) => {
  userProfileBtn.style.display = "block";
  userProfileBtn.style.backgroundImage = `url(profiles/${data.profile})`;
  actionText.innerText = `Welcome, ${data.name}`;
  userPopupName.style.display = "block";
  userPopupName.innerText = data.name;
  panelButton.style.display = "inline";
  logOutButton.style.display = "inline";
  loginBtn.style.display = "none";
  createAccountBtn.style.display = "none";
};

// Log out ----------------------------------------------------------------------------

const logOut = () => {
  if (document.cookie) {
    const allCookies = document.cookie.split(";");
    for (cookie of allCookies) {
      document.cookie = cookie + "=;expires=" + new Date(0).toUTCString();
    }
  }
  userNotLoggedIn();
};
logOutButton.addEventListener("click", logOut);
document.getElementById("clearCookiesBtn").addEventListener("click", logOut);

// Checking log in state --------------------------------------------------------------

const sendRequest = () => {
  const basicData = new XMLHttpRequest();
  basicData.open("POST", "./api/me");
  basicData.setRequestHeader("Accept", "application/json");
  basicData.setRequestHeader("Content-Type", "application/json");
  basicData.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  basicData.send(JSON.stringify({ location: "Home Page" }));

  basicData.onload = () => {
    const response = JSON.parse(basicData.response);
    if (response.dataType === "yourProfile") {
      userLoggedIn(response.data);
    } else {
      logOut();
      userNotLoggedIn();
    }
  };
};

window.onload = async () => {
  if (!document.cookie) {
    userNotLoggedIn();
  } else {
    sendRequest();
  }
};

setInterval(sendRequest, 8000);
