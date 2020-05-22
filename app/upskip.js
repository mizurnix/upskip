/* eslint-disable no-undef */
'use strict'

let numberOfjobsSkipped = 0
let jobList = null
let skipInProgress = false

const skipJobs = function (jobs, countries, tiers, rate) {
  jobs.forEach(function (job) {
    const countryTag = job.querySelector('.client-location')
    const tierTag = job.querySelector('.js-contractor-tier')
    const typeTag = job.querySelector('.js-type')

    if (countryTag !== null) {
      const country = countryTag.innerText.toLowerCase()

      if (
        countries.indexOf(country) > -1 && !job.classList.contains('upskipped')
      ) {
        job.classList.add('upskipped')
        console.log(`Skipped a job from ${country}`)
        numberOfjobsSkipped++
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`)
      }
    }

    if (tierTag !== null) {
      const tier =
        tierTag.innerText
          .replace('-', '')
          .replace(/\$/g, '')
          .replace('()', '')
          .trim()
          .toLowerCase()

      if (tiers.indexOf(tier) > -1 && !job.classList.contains('upskipped')) {
        job.classList.add('upskipped')
        console.log(`Skipped a job with tier ${tier}`)
        numberOfjobsSkipped++
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`)
      }
    }

    if (typeTag !== null && typeTag.innerText.includes('Hourly:')) {
      const rateInfo = typeTag.innerText
      const maxRate = parseInt(rateInfo.slice(rateInfo.lastIndexOf('$') + 1))

      if (rate > maxRate && !job.classList.contains('upskipped')) {
        job.classList.add('upskipped')
        console.log(`Skipped a job with max rate of ${maxRate}`)
        numberOfjobsSkipped++
        console.log(`Number of jobs skipped: ${numberOfjobsSkipped}`)
      }
    }
  })
}

const findJobList = setInterval(function () {
  console.log('Looking for job list')

  jobList =
    document.body.querySelector('[data-v2-job-list]') ||
    document.body.querySelector('#feed-jobs')

  if (jobList) {
    console.log('Job list found')
    clearInterval(findJobList)
    jObserver.observe(jobList, jObserverConfig)
  }
}, 100)

const jObserver = new MutationObserver(function (mutations) {
  if (skipInProgress === false) {
    skipInProgress = true

    setTimeout(function () {
      const jobs = document.body.querySelectorAll('section.job-tile')
      let countries = null
      let tiers = null
      let rate = null

      chrome.storage.sync.get(
        ['skiplist', 'tiersToSkip', 'rateToSkip'],
        function (result) {
          countries = result.skiplist
          tiers = result.tiersToSkip
          rate = result.rateToSkip

          if (typeof jobs !== 'undefined') {
            skipJobs(jobs, countries, tiers, rate)
          }
        }
      )

      skipInProgress = false
    }, 100)
  }
})

const jObserverConfig = {
  childList: true,
  subtree: true
}
