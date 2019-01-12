const undesiredLocations = ["india", "pakistan", "ghana", "malaysia", "philippines"];
let numberOfjobsSkipped = 0;
let jobList = null;
let skipInProgress = false;

const skipJobs = function(jobs) {
  jobs.forEach(function(job) {
    const locationTag = job.querySelector(".client-location")

    if (locationTag !== null) {
      const location = locationTag.innerText.toLowerCase();

      if (undesiredLocations.indexOf(location) > -1 && !job.classList.contains("upskipped")) {
        job.classList.add("upskipped");
        console.log(`Skipped a job from ${location}`);
        numberOfjobsSkipped++;
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`);
      }
    }
  });
}

const findJobList = setInterval(function() {
  console.log("Looking for job list")
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
      skipJobs(jobs);
      skipInProgress = false;
    }, 100);
  }
});

const jObserverConfig = {
  childList: true,
  subtree: true
};
