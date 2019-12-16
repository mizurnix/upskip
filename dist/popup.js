"use strict";

const form = document.forms["skiplist"];
const countriesInput = form.elements["countries"];
const jobTierCheckboxes = form.elements["job-tier"];

form.addEventListener("submit", e => {
  e.preventDefault();
  const countries = countriesInput
                    .value
                    .split(",")
                    .map(country => country.trim().toLowerCase());

  const jobTiers = [];

  jobTierCheckboxes.forEach(function(jobTierCheckbox) {
    if (jobTierCheckbox.checked) {
      jobTiers.push(jobTierCheckbox.value);
    }
  });

  console.log(jobTiers);

  chrome.storage.sync.set({ "skiplist": countries }, function () {
    console.log("Updated list of countries to skip");
  });

  chrome.storage.sync.set({ "tiersToSkip": jobTiers }, function () {
    console.log("Updated list of job tiers to skip");
  });

  window.location.hash = "just-updated";
  location.reload();
});

const showSuccessMessage = function() {
  console.log(window.location.hash)
  if (window.location.hash === "#just-updated") {
    const successMessage = document.createElement('p');

    successMessage.innerText     = "List updated";
    successMessage.style.cssText = "background-color: #cdffeb; color: #07456f; padding: 2px 4px;";

    form.prepend(successMessage);

    setTimeout(function() {
      successMessage.remove();
    }, 2500);
  }
}

const populateForm = function() {
  chrome.storage.sync.get("skiplist", function(result) {
    if (typeof result !== "undefined") {
      console.log("Retrieved skiplist");
      console.log(result.skiplist);
      countriesInput.value = result.skiplist.join(", ");
    }
  });

  chrome.storage.sync.get("tiersToSkip", function(result) {
    if (typeof result !== "undefined") {
      console.log("Retrieved tiers to skip");
      console.log(result.tiersToSkip);

      result.tiersToSkip.forEach(function(tierToSkip) {
        jobTierCheckboxes.forEach(function(checkbox) {
          if (checkbox.value === tierToSkip) {
            checkbox.checked = true;
          }
        });
      });
    }
  });
}

window.onload = function() {
  showSuccessMessage();
  populateForm();
};
