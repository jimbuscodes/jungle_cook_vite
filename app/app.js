import { changePage } from "../model/model.js";
import { initializeApp } from "../node_modules/firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBN6ceHeYNnR6tYdM-gW_sAdLzo5-DN54I",
  authDomain: "webdev-class-setup.firebaseapp.com",
  projectId: "webdev-class-setup",
  storageBucket: "webdev-class-setup.firebasestorage.app",
  messagingSenderId: "187086770371",
  appId: "1:187086770371:web:2737b950e7015cc0a4d276",
  measurementId: "G-ST1HN1H3W9",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let canSeeInfo = false;

// listeners
export function initListeners() {
  // authentication change listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in: ", user.email);
      canSeeInfo = true;
      updateNavForAuth(user);
      updateLoginButton(true);
    } else {
      console.log("No user signed in");
      canSeeInfo = false;
      updateNavForAuth(null);
      updateLoginButton(false);
    }
  });

  // login button
  document.getElementById("loginBtn").onclick = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User Singned in");
      })
      .catch((error) => {
        console.error("error signing in: ", error);
      });
  };

  // sign up button
  document.getElementById("signupBtn").onclick = () => {
    let email = document.getElementById("newEmail").value;
    let password = document.getElementById("newPassword").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User signed up sucessfully");
      })
      .catch((error) => {
        console.error("Error signing up: ", error);
      });
  };

  function updateLoginButton(loggedIn) {
    const loginLink = document.getElementById("login");
    if (!loginLink) return;

    loginLink.textContent = loggedIn ? "Logout" : "Login";

    loginLink.onclick = loggedIn
      ? () => signOut(getAuth()).then(() => console.log("signed out"))
      : null;
  }

  function updateNavForAuth(user) {
    const navList = document.querySelector("nav ul");
    const mobileMenu = document.querySelector(".mobile-menu");

    navList?.querySelector("#yourRecipesLink")?.remove();
    mobileMenu?.querySelector("#yourRecipesLinkMobile")?.remove();

    if (user) {
      const yourRecipesItem = document.createElement("li");
      yourRecipesItem.innerHTML = `<a id="yourRecipesLink" href="#your_recipes">Your Recipes</a>`;

      const yourRecipesItemMobile = document.createElement("li");
      yourRecipesItemMobile.innerHTML = `<a id="yourRecipesLinkMobile" href="#your_recipes">Your Recipes</a>`;

      const loginItem = navList?.querySelector("#login")?.parentElement;
      const loginItemMobile =
        mobileMenu?.querySelector("#login")?.parentElement;

      if (loginItem) navList.insertBefore(yourRecipesItem, loginItem);
      if (loginItemMobile)
        mobileMenu.insertBefore(yourRecipesItemMobile, loginItemMobile);
    }
  }
}

// page routing function
function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  changePage(pageID);
}

// start routing on hash change
function initRouting() {
  $(window).on("hashchange", route);
  route();
}

$(document).ready(() => {
  initRouting();
});
