import { token } from "./login.js";
const apiUrl = "https://todoo.5xcamp.us";
const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  axios
    .delete(`${apiUrl}/users/sign_out`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      console.log(response);
      document.location.href = "https://enpluto.github.io/js_week8/login.html";
    })
    .catch((error) => {
      console.log(error);
    });
});
