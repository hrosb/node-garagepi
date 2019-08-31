import style from "./style.scss";
const pictureTrigger = document.querySelector(".picture-trigger");
const formResponse = document.querySelector(".form-response");
const form = document.getElementById("login-form");
const toggleLeft = document.querySelector(".garage-door-toggle--left");
const toggleRight = document.querySelector(".garage-door-toggle--right");
const toggles = {
  left: toggleLeft,
  right: toggleRight
};

let authenticated = false;

function setHeaders(pw) {
  const headers = new Headers({
    Authorization: "Basic " + btoa("Admin" + ":" + pw)
  });
  return headers;
}

// Login form authentication
if (form) {
  authenticatePass();
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    authenticatePass();
  });
}
function authenticatePass() {
  let inputPassValue = document.getElementById("pass").value;
  if (!inputPassValue) {
    inputPassValue = localStorage.getItem("garage-pass");
  }
  if (!inputPassValue) {
    return;
  }
  const headers = setHeaders(inputPassValue);

  fetch("/api/garage/authenticate", {
    method: "GET",
    headers: headers
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        return "Feil passord...";
      }
    })
    .then(function(response) {
      if (response.status === "valid") {
        authenticated = true;
        formResponse.innerHTML = "Flott, sender deg videre...";
        localStorage.setItem("garage-pass", inputPassValue);
        window.location.href = "/authenticated";
      } else {
        formResponse.innerHTML = response;
      }
    });
}

let existingPass = localStorage.getItem("garasjepass");
let password = "";

if (existingPass) {
  //passwordForm.style.display = "none";
  password = existingPass;
}

if (!form) {
  const headers = setHeaders(localStorage.getItem("garage-pass"));
  let rightDoorStatus;
  let leftDoorStatus;

  // 1. get state from api for both buttons
  // 2. attach event listeners
  // 3. Toggle click -> add opening / closing class
  // 4. Listen to socket, and get remove opening/closing classes + add closed / open class

  toggleLeft.addEventListener("click", evt => {
    if (leftDoorStatus === "closed" || leftDoorStatus === "closing") {
      setDoorClass("left", "opening");
      leftDoorStatus = "opening";
    } else {
      setDoorClass("left", "closing");
      leftDoorStatus = "closing";
    }
    toggleDoor("left");
  });
  toggleRight.addEventListener("click", evt => {
    if (rightDoorStatus === "closed" || rightDoorStatus === "closing") {
      setDoorClass("right", "opening");
      rightDoorStatus = "opening";
    } else {
      setDoorClass("right", "closing");
      rightDoorStatus = "closing";
    }
    toggleDoor("right");
  });
  if (pictureTrigger) {
    pictureTrigger.addEventListener("click", evt => {
      takePicture();
    });
  }

  function getDoorState(doorOpenSensor, doorClosedSensor) {
    if (doorOpenSensor && !doorClosedSensor) {
      return "open";
    }
    if (!doorOpenSensor && doorClosedSensor) {
      return "closed";
    }
    if (!doorOpenSensor && !doorClosedSensor) {
      return "between";
    }
    if (doorOpenSensor && doorClosedSensor) {
      return "fatal error";
    }
  }

  function getStatus() {
    fetch("api/doors/status", {
      method: "GET",
      headers: headers
    })
      .then(response => {
        return response.json();
      })
      .then(function(json) {

        leftDoorStatus = getDoorState(json.leftDoorOpen, json.leftDoorClosed);
        rightDoorStatus = getDoorState(json.rightDoorOpen, json.rightDoorClosed);

        setDoorClass("left", leftDoorStatus);
        setDoorClass("right", rightDoorStatus);

        updatePicture();

      });
  }
  getStatus();

  function takePicture() {
    fetch("api/garage/picture", {
      method: "GET",
      
      headers: headers
    })
      .then(response => {
        return response.json();
      })
      .then(function(json) {
        setTimeout(() => {
          updatePicture();
        }, 4400);
      });
  }
  

  function updatePicture() {
    var t = new Date().getTime();
    var url = "./images/garage.jpg?t=" + t;
    const image = document.getElementById("image");
    image.src = url;
  }



  function toggleDoor(side) {
    fetch("api/door/" + side + "/toggle", {
      method: "GET",
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.success === "true") {
          setTimeout(() => {
            getStatus();
            takePicture();
          }, 19500);
        }
      });
  }
}

/* socket.on("state-change", function(status) {
  document.querySelector(".socket-info").innerHTML = status;
}); */

function setDoorClass(side, state) {
  if (state === "closed") {
    toggles[side].classList.remove("opening", "closing", "open");
    toggles[side].classList.add("closed");
    toggles[side].querySelector(".status").innerHTML = getNbReadableState(state);
  }
  if (state === "open") {
    toggles[side].classList.remove("opening", "closing", "closed");
    toggles[side].classList.add("open");
    toggles[side].querySelector(".status").innerHTML = getNbReadableState(state);
  }

  if (state === "closing") {
    toggles[side].classList.remove("opening", "open", "closed");
    toggles[side].classList.add("closing");
    toggles[side].querySelector(".status").innerHTML = getNbReadableState(state);
  }

  if (state === "opening") {
    toggles[side].classList.remove("closing", "open", "closed");
    toggles[side].classList.add("opening");
    toggles[side].querySelector(".status").innerHTML = getNbReadableState(state);
  }
}

function getNbReadableState(state) {
  switch (state) {
    case "closed":
      return "Lukket";
    case "open":
      return "Åpen";
    case "closing":
      return "Lukker...";
    case "opening":
      return "Åpner...";
  }
}


io.on('connection', function(socket){
  socket.on('photo-taken', function(bool){
    updatePicture();
  });
});