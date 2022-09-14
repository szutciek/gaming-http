const hostArea = document.querySelector(".host2");
const guestArea = document.querySelector(".guest2");

const grid = document.querySelector(".grid");

const hostProfile = document.querySelectorAll("#hostPic");
const guestProfile = document.querySelectorAll("#guestPic");
const hostName = document.querySelectorAll("#hostName");
const hostRep = document.querySelectorAll("#hostRep");
const guestName = document.querySelectorAll("#guestName");
const guestRep = document.querySelectorAll("#guestRep");

const url = window.location.pathname;
const room = url.split("/")[2];
const fields = document.querySelectorAll(".el");
const col = [];
col[1] = [fields[0], fields[7], fields[14], fields[21], fields[28], fields[35]];
col[2] = [fields[1], fields[8], fields[15], fields[22], fields[29], fields[36]];
col[3] = [fields[2], fields[9], fields[16], fields[23], fields[30], fields[37]];
col[4] = [
  fields[3],
  fields[10],
  fields[17],
  fields[24],
  fields[31],
  fields[38],
];
col[5] = [
  fields[4],
  fields[11],
  fields[18],
  fields[25],
  fields[32],
  fields[39],
];
col[6] = [
  fields[5],
  fields[12],
  fields[19],
  fields[26],
  fields[33],
  fields[40],
];
col[7] = [
  fields[6],
  fields[13],
  fields[20],
  fields[27],
  fields[34],
  fields[41],
];

const displayData = (data) => {
  hostProfile.forEach((el) => (el.src = `/profiles/${data.hostProfile}`));
  guestProfile.forEach((el) => (el.src = `/profiles/${data.guestProfile}`));

  hostName.forEach((el) => (el.innerText = data.host));
  guestName.forEach((el) => (el.innerText = data.guest));

  hostRep.forEach((el) => (el.innerText = data.hostRep));
  guestRep.forEach((el) => (el.innerText = data.guestRep));
};

const replaceFields = (data) => {
  if (data.currentPlayer == data.host) {
    hostArea.style.filter = "";
    hostArea.style.transform = "scale(1.1)";
    guestArea.style.filter = "grayscale(100%)";
    guestArea.style.transform = "scale(1)";
  } else {
    guestArea.style.filter = "";
    guestArea.style.transform = "scale(1.1)";
    hostArea.style.filter = "grayscale(100%)";
    hostArea.style.transform = "scale(1)";
  }

  const fill = data.fields;

  if (fill) {
    Object.keys(fill).forEach((el) => {
      if (fill[el] == data.host) {
        col[String(el)[0]][
          String(el)[1]
        ].style.backgroundColor = `rgb(${data.hostColor.slice(
          0,
          3
        )}, ${data.hostColor.slice(3, 6)}, ${data.hostColor.slice(6, 9)}`;
      } else if (fill[el] == data.guest) {
        col[String(el)[0]][
          String(el)[1]
        ].style.backgroundColor = `rgb(${data.guestColor.slice(
          0,
          3
        )}, ${data.guestColor.slice(3, 6)}, ${data.guestColor.slice(6, 9)}`;
      }
    });
  }
  if (data.winner) {
    displayMessage(`${data.winner} won!`);
  }
};

const game = (move) => {
  let req = new XMLHttpRequest();
  req.open(
    "POST",
    `../api/play/${
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    }`
  );
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  const data = {
    type: "data",
    field: move,
  };
  const request = JSON.stringify(data);
  req.send(request);

  req.onload = () => {
    const response = JSON.parse(req.response);
    displayData(response.data);
  };
};

game();

const syncGame = () => {
  let sync = new XMLHttpRequest();
  sync.open("POST", `../api/sync/${room}`);
  sync.setRequestHeader("Accept", "application/json");
  sync.setRequestHeader("Content-Type", "application/json");
  sync.setRequestHeader("Authorization", document.cookie.split("=")[1]);
  const data = {
    location: "Playing For in a Row",
  };
  const request = JSON.stringify(data);
  sync.send(request);

  sync.onload = () => {
    console.log("Sync");
    const response = JSON.parse(sync.response);
    if (response.message === "Game ended") {
      clearInterval(gameRefresh);
    }
    replaceFields(response.data);
  };
};

const gameRefresh = setInterval(syncGame, 1500);

col[1].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("1" + i)));
});
col[2].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("2" + i)));
});
col[3].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("3" + i)));
});
col[4].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("4" + i)));
});
col[5].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("5" + i)));
});
col[6].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("6" + i)));
});
col[7].forEach((el, i) => {
  el.addEventListener("click", () => game(Number("7" + i)));
});
