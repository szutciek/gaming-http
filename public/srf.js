document.querySelector("body").insertAdjacentHTML(
  "afterbegin",
  `<h6
id="serverResponseField"
style="
  position: fixed;
  bottom: 50px;
  left: 50%;
  z-index: 999;
  max-width: 340px;
  text-align: center;
  padding: 5px 10px;
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translate(-50%, 50px);
  opacity: 0;
  transition: 0.2s;
"
></h6>`
);
const serverResponseField = document.getElementById("serverResponseField");
let queue = [];
let lastMessageTime = Date.now() - 5000;

const showMessage = (message) => {
  serverResponseField.style.opacity = 1;
  serverResponseField.style.transform = "translate(-50%, 0px)";
  serverResponseField.innerText = message;
  queue.shift();
  setTimeout(() => {
    serverResponseField.style.opacity = 0;
    serverResponseField.style.transform = "translate(-50%, 50px)";
  }, 4600);
};
const displayMessage = (message) => {
  queue.push(message);
};
const queueManager = () => {
  if (queue[0] && lastMessageTime - Date.now() < -5000) {
    lastMessageTime = Date.now();
    showMessage(queue[0]);
  }
};

queueManager();
setInterval(queueManager, 500);

// serverResponseField.style.opacity = 1;
// serverResponseField.style.transform = "translate(-50%, 0px)";
// serverResponseField.innerText = message;

// setTimeout(() => {
//   serverResponseField.style.opacity = 0;
//   serverResponseField.style.transform = "translate(-50%, 50px)";
// }, 5000);
