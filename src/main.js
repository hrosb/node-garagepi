import style from "./style.scss";

const leftDoorBtn = document.getElementById("door-left");
const rightDoorBtn = document.getElementById("door-right");
const passwordForm = document.getElementById("password-form");
const pictureTrigger = document.querySelector('.picture-trigger');
const formResponse = document.querySelector('.form-response');

function setHeaders(pw){
    const headers = new Headers({
      Authorization: "Basic " + btoa("Admin" + ":" + pw)
    });
    console.log(headers);
    return headers;
}

// Login form authentication

document.addEventListener("DOMContentLoaded", function(){
  var form = document.getElementById('login-form');
  console.log(form);

  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();

      const headers = setHeaders(document.getElementById('pass').value);

      fetch("/api/garage/authenticate", {
        method: 'GET',
        headers: headers
      }) .then((response) => {
        if(response.status === 200){
          return response.json();
        }
        else { 
          return "Feil passord..." 
        }
      })
      .then(function(response) {
        if(response.status === "valid"){
          formResponse.innerHTML = "Flott, sender deg videre...";
          window.location.href = '/authenticated';
        } else{
          formResponse.innerHTML = response;
        }
      });


    })
  }

});





let existingPass = localStorage.getItem("garasjepass");
let password = "";
let rightDoorClosed = 0;
let rightDoorOpen = 0;
let leftDoorClosed = 0;
let leftDoorOpen = 0;

if (existingPass) {
  //passwordForm.style.display = "none";
  password = existingPass;
}

if(leftDoorBtn){

  leftDoorBtn.addEventListener("click", evt => {
    toggleDoor("left");
  });
  rightDoorBtn.addEventListener("click", evt => {
    toggleDoor("right");
  });
  pictureTrigger.addEventListener("click", evt => {
    takePicture();
  })



function intIsZero(int){
  if(int === 0){
    return true;
  }
  if(int === 1){
    return false;
  }
}

fetch("api/doors/status", {
  method: 'GET',
  headers: headers
}) .then((response) => {
  return response.json();
})
.then(function(json) {
  console.log(json);
  rightDoorOpen = intIsZero(parseInt(json.rightDoorOpen, 10));
  rightDoorClosed = intIsZero(parseInt(json.rightDoorClosed, 10));
  leftDoorClosed = intIsZero(parseInt(json.leftDoorClosed, 10));
  leftDoorOpen = intIsZero(parseInt(json.leftDoorOpen, 10));
  if(rightDoorClosed && !rightDoorOpen){
    setButtonState(rightDoorBtn, 1);
  }
  if(rightDoorOpen && !rightDoorClosed){
    setButtonState(rightDoorBtn, 0);
  }  


  let result = "rightDoorOpen: " + rightDoorOpen + "<br>rightDoorClosed: " + rightDoorClosed + "<br>leftDoorClosed: " + leftDoorClosed + "<br>leftDoorOpen: " + leftDoorOpen;

  document.querySelector('.result').innerHTML = result;


});

setPicture();

function takePicture(){
  fetch("api/garage/picture", {
    method: 'GET',
    headers: headers
  }) .then((response) => {
    return response.json();
  })
  .then(function(json) {
    setTimeout(() => {
      setPicture();
    }, 200);
  });
}

function setPicture(){
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
function setButtonState(button, state){
  console.log(button, state);
  if(state === 1){
    button.setAttribute('checked','checked');
  }
  else{
    button.removeAttribute('checked');
  }
}


function toggleDoor(side) {
  const passwordValue = document.getElementById("pass").value;
  if (existingPass) {
    password = existingPass;
  } else {
    password = passwordValue;
  }



  fetch("api/door/" + side, {
    method: 'GET',
    headers: headers
  })
    .then(function(response) {
      console.log(response);
      localStorage.setItem('garasjepass', password);
      return response.json();
    })
}
}
