import style from "./style.scss";

const leftDoorBtn = document.getElementById("door-left");
const rightDoorBtn = document.getElementById("door-right");
const passwordForm = document.getElementById("password-form");

let existingPass = localStorage.getItem("garasjepass");
let password = "";
let leftState = 0;
let rightState = 0;

if (existingPass) {
  passwordForm.style.display = "none";
  password = existingPass;
}

leftDoorBtn.addEventListener("click", evt => {
  toggleDoor("left");
});
rightDoorBtn.addEventListener("click", evt => {
  toggleDoor("right");
});

const headers = new Headers({
  Authorization: "Basic " + btoa("Admin" + ":" + password)
});

fetch("api/door/left/status", {
  method: 'GET',
  headers: headers
}) .then((response) => {
  leftState = 1;
  console.log(response.body);
  setButtonState(leftDoorBtn, leftState);
  return response.json();
});

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
  if(state === 0){
    button.setAttribute('checked','checked');
  }
  else{
    button.removeAttribute('checked');
  }
}


function toggleDoor(side) {
  const passwordValue = document.getElementById("pass").value;

  console.log(existingPass);
  console.log(passwordValue);
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
