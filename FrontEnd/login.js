const form = document.querySelector("form");

let loginEmail = document.getElementById("loginemail");
let loginPassword = document.getElementById("password");
const formSelect = document.querySelector("form");

function pageIndex () {
  const liSelect = document.querySelector("header nav ul li");
  const hrefSegment = "<a href=\"index.html\">projets<a>";
  liSelect.innerHTML =hrefSegment;
}

pageIndex();

async function connect(mail, pwd) {
  const url = "http://localhost:5678/api/users/login";

  const chargeUtile = JSON.stringify({
    email: mail,
    password: pwd
  });

  try {
    const reponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
    });

    if(!reponse.ok){
      const errorMsgSelect = document.querySelector("#error_message");

      if(reponse.status == "404"){
        errorMsgSelect.textContent = "User not found";
      }

      if(reponse.status == "401"){
        errorMsgSelect.textContent = "Not Authorized";
      }
    }
    
    return await reponse.json();
  } catch (error) {
    console.log("catch de l'appel fetch", error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  let emailValue = loginEmail.value;
  let passwordValue = loginPassword.value;
  const loginResponse = await connect(emailValue, passwordValue);
  let tokenResponse = loginResponse.token;
  if (tokenResponse) {
    console.log(tokenResponse);
    localStorage.setItem("token", tokenResponse);
    console.log(localStorage);
    window.location.replace("index.html");
  }
});
