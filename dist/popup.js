"use strict";

const form = document.forms["skiplist"];
const countriesInput = form.elements["countries"];

chrome.storage.sync.get("skiplist", function(result) {
  if (typeof result !== "undefined") {
    countriesInput.value = result.skiplist.join(", ");
    console.log("Retrieved skiplist");
    console.log(result.skiplist);
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const countries = countriesInput
                    .value
                    .split(",")
                    .map(country => country.trim().toLowerCase());

  chrome.storage.sync.set({ "skiplist": countries }, function () {
    console.log("Updated list of countries to skip");
  });

  window.location.hash = "just-updated";
  location.reload();
});

const showSuccessMessage = function() {
  console.log(window.location.hash)
  if (window.location.hash === "#just-updated") {
    const successMessage = document.createElement('p');
    successMessage.innerText = "List updated";
    successMessage.style.cssText = "background-color: #cdffeb; color: #07456f; padding: 2px 4px;";

    form.prepend(successMessage);

    setTimeout(function() {
      successMessage.remove();
    }, 2500);
  }
}

window.onload = function() {
  showSuccessMessage();
};
