import style from "./style.scss";
var socket = io();
const pictureTrigger = document.querySelector(".picture-trigger");
const formResponse = document.querySelector(".form-response");
const form = document.getElementById("login-form");
const toggleLeft = document.querySelector(".garage-door-toggle--left");
const toggleRight = document.querySelector(".garage-door-toggle--right");
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
  console.log(inputPassValue);
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
  const toggleLeftText = toggleLeft.querySelector(".status");
  const toggleRightText = toggleRight.querySelector(".status");
  const headers = setHeaders(localStorage.getItem('garage-pass'));

  // 1. get state from api for both buttons
  // 2. attach event listeners
  // 3. Toggle click -> add opening / closing class
  // 4. Listen to socket, and get remove opening/closing classes + add closed / open class

  toggleLeft.addEventListener("click", evt => {
    console.log(this, evt.target);
    evt.target.classList.toggle("status--closed");
    toggleLeftText.innerHTML = "Lukker";
    toggleLeft.classList.toggle("opening");
    toggleDoor("left");
  });
  toggleRight.addEventListener("click", evt => {
    toggleDoor("right");
  });
  if (pictureTrigger) {
    pictureTrigger.addEventListener("click", evt => {
      takePicture();
    });
  }

  function getDooerState(doorOpenSensor, doorClosedSensor ){
    if(doorOpenSensor && !doorClosedSensor){
      return 'open';
    }
    if(!doorOpenSensor && doorClosedSensor){
      return 'closed';
    }    
    if(!doorOpenSensor && !doorClosedSensor){
      return 'between';
    }    
    if(doorOpenSensor && doorClosedSensor){
      return 'fatal error';
    }        
  }

  fetch("api/doors/status", {
    method: "GET",
    headers: headers
  })
    .then(response => {
      return response.json();
    })
    .then(function(json) {
      console.log(json);

      let rightDoorStatus = getDooerState(json.leftDoorOpen, json.leftDoorClosed);
      let leftDoorStatus = getDooerState(json.rightDoorOpen, json.rightDoorClosed);

      let result = "leftDoor: " + leftDoorStatus + "<br>rightDoor: " + rightDoorStatus;

      document.querySelector(".results").innerHTML = result;
    });



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
          setPicture();
        }, 200);
      });
  }

  function setPicture() {
    var t = new Date().getTime();
    var url = "url(/images/garage.jpg?t=" + t + ")";
    const backgroundDiv = document.getElementById("background");
    backgroundDiv.style.backgroundImage = url;
  }

  /* fetch("api/door/right/status", {
  method: 'GET',
  headers: headers
}) .then(function(response) {
  console.log(parseInt(response.state, 10));
  rightState = parseInt(response.state, 10);
  setButtonState(rightDoorBtn, rightState);
  return response.json();
});
 */
  function setButtonState(button, state) {
    console.log(button, state);
    if (state === 1) {
      button.setAttribute("checked", "checked");
    } else {
      button.removeAttribute("checked");
    }
  }

  function toggleDoor(side) {


    fetch("api/door/" + side + "/toggle", {
      method: "GET",
      headers: headers
    }).then(function(response) {
      console.log(response);
      return response.json()
    }).then(function(json) {
        console.log(json);
    });
  }
}



socket.on('left-door-status', function(status){
  document.querySelector('.socket-info').innerHTML = status;
});