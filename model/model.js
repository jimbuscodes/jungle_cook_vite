import { initListeners } from "../app/app.js";

// function to change page
export function changePage(pageName) {
  const page = pageName === "" ? "home" : pageName;

  $.get(`pages/${page}.html`, (data) => {
    $("#app").html(data);
    initListeners();
  });
}
