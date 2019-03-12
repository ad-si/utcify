// const chrono = require('chrono')
/* globals chrono */

const stringInput = document
  .getElementById('datetime-string')
const outputContainer = document
  .getElementById('utc-output')
const infoContainer = document
  .getElementById('info')


function convertAndRender (string) {
  let output = ''
  let infoData = ''
  let fragments = []

  try {
    output = chrono
      .parseDate(string)
      .toISOString()
    infoData = chrono.parse(string)[0]
    fragments = [
      'year',
      'month',
      'day',
      'hour',
      'minute',
      'second',
      'meridiem',
      'timezoneOffset',
    ]
  }
  catch (error) {
    console.info(error)
  }

  outputContainer.textContent = output

  if (!infoData) {
    infoContainer.innerHTML = ''
    return
  }

  const grid = fragments
    .map(frag => `
      <span class="col1">${frag}:</span>
      <span class="col2">${infoData.start.knownValues[frag]}</span>
    `)
    .join('<br>')
  infoContainer.innerHTML = `<p id='utc-info'>${grid}<p>`
}

stringInput
  .addEventListener('input',  event => {
    event.preventDefault()
    convertAndRender(event.srcElement.value)
  })

convertAndRender(stringInput.value)
