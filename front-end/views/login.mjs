import {renderOne, destroy} from "../lib/render.mjs";
import {state, getLoginContainer} from "../index.mjs";
import {createLogin, handleLogin} from "../components/login.mjs";

// Login view - shown on initial load when not logged in
function loginView() {
  destroy();
  renderOne(
    state.isLoggedIn,
    getLoginContainer(),
    "login-template",
    createLogin
  );
  const form = document.querySelector("[data-form='login']");
  form?.addEventListener("submit", handleLogin);
}

export {loginView};
