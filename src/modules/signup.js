const apiUrl = "https://todoo.5xcamp.us";
const email = document.querySelector("#email");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const secoundPassword = document.querySelector("#secondPassword");
const signup = document.querySelector("#signup");
const checkNull = document.querySelector("#checkNull");
const hintStyle = "text-[#D87355] mt-1 block";
const defaultStyle = "text-[#D87355] mt-1 hidden";

function signupFn() {
  axios
    .post(`${apiUrl}/users`, {
      user: {
        email: email.value,
        nickname: username.value,
        password: password.value,
      },
    })
    .then((response) => {
      console.log(response);
      alert("註冊成功！");
      document.location.href = "login.html";
    })
    .catch((error) => {
      console.log(error);
      console.log(error.response.data.error);
      //   alert('') 提示錯誤
    });
}

function verify() {
  // 驗證密碼是否相同
  // 密碼需大於六碼
  // 信箱input格式至少滿足 "123@mail"

  // 驗證信箱格式
  if (!email.value.includes("@") || !email.value.includes("mail")) {
    document.querySelector("#check-email").classList = hintStyle;
    document.querySelector("#check-email").textContent =
      "請確認信箱格式是否正確";
    return;
  } else if (email.value.includes("@") && email.value.includes("mail")) {
    document.querySelector("#check-email").classList = defaultStyle;
  }
  // 信箱、使用者名稱不可為空
  if (email.value === "" && username.value === "") {
    document.querySelector("#check-email").classList = hintStyle;
    document.querySelector("#check-username").classList = hintStyle;
    return;
  } else if (email.value === "") {
    document.querySelector("#check-email").classList = hintStyle;
    document.querySelector("#check-username").classList = defaultStyle;
    return;
  } else if (username.value === "") {
    document.querySelector("#check-email").classList = defaultStyle;
    document.querySelector("#check-username").classList = hintStyle;
    return;
  } else {
    document.querySelector("#check-email").classList = defaultStyle;
    document.querySelector("#check-username").classList = defaultStyle;
  }
  // 驗證密碼
  if (password.value.length < 6) {
    document.querySelector("#check-password").classList = hintStyle;
    document.querySelector("#check-password").textContent = "密碼長度至少6碼";
    return;
  } else {
    document.querySelector("#check-password").classList = defaultStyle;
  }
  if (
    password.value !== secoundPassword.value &&
    secoundPassword.value !== ""
  ) {
    document.querySelector("#check-secondPassword").classList = hintStyle;
    document.querySelector("#check-secondPassword").textContent =
      "請再次確認密碼是否相同";
    return;
  } else {
    document.querySelector("#check-secondPassword").classList = defaultStyle;
  }
}

signup.addEventListener("click", (e) => {
  verify();
  signupFn();
});
