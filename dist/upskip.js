const undesiredLocations = ["india", "pakistan", "ghana", "malaysia"];
let loadMoreButton = null;
let numberOfJobsLoaded = 0;
let numberOfjobsSkipped = 0;

const findAndArmLoadMoreButton = function() {
  if (loadMoreButton === null) {
    loadMoreButton = document.body.querySelector(".load-more-button");

    if (loadMoreButton !== null) {
      loadMoreButton.addEventListener("click", function(){
        runUpskip();
      })
    }
  }
}

const hideJobs = function(jobs) {
  jobs.forEach(function(job) {
    const locationTag = job.querySelector(".client-location")

    if (locationTag !== null) {
      const location = locationTag.innerText.toLowerCase();

      if (undesiredLocations.indexOf(location) > -1) {
        job.classList.add("upskipped");
        console.log(`Skipped a job from ${location}`);
        numberOfjobsSkipped++;
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`);
      }
    }
  });
}

const runUpskip = function() {
  const scanJobs = setInterval(function() {
    console.log('scanning jobs')
    const jobs = document.body.querySelectorAll("section.job-tile");

    if (jobs.length > numberOfJobsLoaded) {
      numberOfJobsLoaded = jobs.length;
      hideJobs(jobs);
      findAndArmLoadMoreButton();
      clearInterval(scanJobs);
    }
  }, 100);
}

runUpskip();
