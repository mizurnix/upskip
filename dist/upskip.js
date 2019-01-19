"use strict";

let numberOfjobsSkipped = 0;
let jobList = null;
let skipInProgress = false;

const skipJobs = function(jobs, countries) {
  jobs.forEach(function(job) {
    const countryTag = job.querySelector(".client-location");

    if (countryTag !== null) {
      const country = countryTag.innerText.toLowerCase();

      if (countries.indexOf(country) > -1 && !job.classList.contains("upskipped")) {
        job.classList.add("upskipped");
        console.log(`Skipped a job from ${country}`);
        numberOfjobsSkipped++;
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`);
      }
    }
  });
}

const findJobList = setInterval(function() {
  console.log("Looking for job list");
  jobList = document.body.querySelector('[data-v2-job-list]') || document.body.querySelector('#feed-jobs');
  if (jobList) {
    clearInterval(findJobList);
    jObserver.observe(jobList, jObserverConfig);
  }
}, 100);

const jObserver = new MutationObserver(function(mutations) {
  if (skipInProgress === false) {
    skipInProgress = true;

    setTimeout(function() {
      const jobs = document.body.querySelectorAll("section.job-tile");
      let countries = localStorage.getItem("blacklistedCountries")

      if (countries !== null) {
        countries = countries
                    .split(",")
                    .map(country => country.trim().toLowerCase());

        if (typeof jobs !== "undefined") {
          skipJobs(jobs, countries);
        }
      }

      skipInProgress = false;
    }, 100);
  }
});

const jObserverConfig = {
  childList: true,
  subtree: true
};
