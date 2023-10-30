const apiUrl = "https://todoo.5xcamp.us";
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const login = document.querySelector("#login");
const checkMail = document.querySelector("#checkMail");
const checkPassword = document.querySelector("#checkPassword");
const defaultStyle = "text-[#D87355] mt-1 hidden";
const hintStyle = "text-[#D87355] mt-1 block";

const token = localStorage.getItem("token");
const nickname = localStorage.getItem("nickname");

function getToken() {
  return new Promise((resolve, reject) => {
    axios
      .post(`${apiUrl}/users/sign_in`, {
        user: { email: email.value, password: password.value },
      })
      .then((response) => {
        localStorage.setItem("token", response.headers.authorization);
        localStorage.setItem("nickname", response.data.nickname);
        resolve(response);
        document.location.href = "list.html";
      })
      .catch((error) => {
        reject(error);
        alert("信箱或密碼不正確");
        password.value = "";
      });
  });
}

function loginFn() {
  if (email.value === "" && password.value === "") {
    checkMail.classList = hintStyle;
    checkPassword.classList = hintStyle;
    return;
  } else if (email.value === "") {
    checkMail.classList = hintStyle;
    checkPassword.classList = defaultStyle;
    return;
  } else if (password.value === "") {
    checkMail.classList = defaultStyle;
    checkPassword.classList = hintStyle;
    return;
  } else {
    checkMail.classList = defaultStyle;
    checkPassword.classList = defaultStyle;
  }
  getToken();
}

login.addEventListener("click", (e) => {
  loginFn();
});

export { token, nickname };
