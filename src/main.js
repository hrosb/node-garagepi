import style from "./style.scss";

const leftDoorBtn = document.getElementById("door-left");
const rightDoorBtn = document.getElementById("door-right");
const passwordForm = document.getElementById("password-form");

let existingPass = localStorage.getItem("garasjepass");
let password = "";

if (existingPass) {
  passwordForm.style.display = "none";
}

leftDoorBtn.addEventListener("click", evt => {
  toggleDoor("left");
});
rightDoorBtn.addEventListener("click", evt => {
  toggleDoor("right");
});

function toggleDoor(side) {
  const passwordValue = document.getElementById("pass").value;

  console.log(existingPass);
  console.log(passwordValue);
  if (existingPass) {
    password = existingPass;
  } else {
    password = passwordValue;
  }

  const headers = new Headers({
    Authorization: "Basic " + btoa("Admin" + ":" + password)
  });

  fetch("api/door/" + side, {
    method: 'GET',
    headers: headers
  })
    .then(function(response) {
      console.log(response);
      localStorage.setItem('garasjepass', password);
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });
}
