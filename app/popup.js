/* eslint-disable no-undef */
'use strict'

const form = document.forms.skiplist
const countriesInput = form.elements.countries
const jobTierCheckboxes = form.elements['job-tier']
const rateInput = form.elements.rate

form.addEventListener('submit', e => {
  e.preventDefault()

  const countries = countriesInput.value.split(',').map(
    country => country.trim().toLowerCase()
  )

  const jobTiers = []

  jobTierCheckboxes.forEach(function (jobTierCheckbox) {
    if (jobTierCheckbox.checked) {
      jobTiers.push(jobTierCheckbox.value)
    }
  })

  const rate = parseInt(rateInput.value)

  chrome.storage.sync.set({ skiplist: countries }, function () {
    console.log('Updated list of countries to skip')
  })

  chrome.storage.sync.set({ tiersToSkip: jobTiers }, function () {
    console.log('Updated list of job tiers to skip')
  })

  chrome.storage.sync.set({ rateToSkip: rate }, function () {
    console.log('Updated rate below which to skip')
  })

  window.location.hash = 'just-updated'
  location.reload()
})

const showSuccessMessage = function () {
  console.log(window.location.hash)
  if (window.location.hash === '#just-updated') {
    const successMessage = document.createElement('p')

    successMessage.innerText = 'List updated. Refresh page to apply new filters'
    successMessage.style.cssText =
      'background-color: #cdffeb; color: #07456f; padding: 2px 4px;'

    form.prepend(successMessage)

    setTimeout(function () {
      successMessage.remove()
    }, 5000)
  }
}

const populateForm = function () {
  chrome.storage.sync.get('skiplist', function (result) {
    if (typeof result !== 'undefined') {
      console.log('Retrieved skiplist')
      console.log(result.skiplist)
      countriesInput.value = result.skiplist.join(', ')
    }
  })

  chrome.storage.sync.get('tiersToSkip', function (result) {
    if (typeof result !== 'undefined') {
      console.log('Retrieved tiers to skip')
      console.log(result.tiersToSkip)

      result.tiersToSkip.forEach(function (tierToSkip) {
        jobTierCheckboxes.forEach(function (checkbox) {
          if (checkbox.value === tierToSkip) {
            checkbox.checked = true
          }
        })
      })
    }
  })

  chrome.storage.sync.get('rateToSkip', function (result) {
    if (typeof result !== 'undefined') {
      console.log('Retrieved rateToSkip')
      console.log(result.rateToSkip)
      rateInput.value = result.rateToSkip
    }
  })
}

window.onload = function () {
  showSuccessMessage()
  populateForm()
}
