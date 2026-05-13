import * as chrono from 'https://cdn.jsdelivr.net/npm/chrono-node@2.9.1/+esm'

const stringInput = document
  .getElementById('datetime-string')
const outputContainer = document
  .getElementById('utc-output')
const infoContainer = document
  .getElementById('info')
const copyButton = document
  .getElementById('copy-button')


function convertAndRender (string) {
  let output = ''
  let infoData = ''
  let fragments = []

  const trimmed = string.trim()
  const unixTimeShort = /^[0-9]{10}$/
  const unixTimeMedium = /^[0-9]{13}$/
  const unixTimeLong = /^[0-9]{16}$/

  let normalized = trimmed
  if (unixTimeShort.test(normalized)) {
    normalized += '000'
  }
  if (unixTimeLong.test(normalized)) {
    normalized = normalized.slice(0, -3)
  }

  if (unixTimeMedium.test(normalized)) {
    outputContainer.textContent = new Date(Number(normalized)).toISOString()
    infoContainer.innerHTML = ''
    return
  }

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
      <span class="col2">${infoData.start.get(frag)}</span>
    `)
    .join('<br>')
  infoContainer.innerHTML = `<p id='utc-info'>${grid}<p>`
}

stringInput
  .addEventListener('input',  event => {
    event.preventDefault()
    convertAndRender(event.srcElement.value)
  })

let copyResetTimeout
copyButton.addEventListener('click', async () => {
  const text = outputContainer.textContent
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copyButton.classList.remove('failed')
    copyButton.classList.add('copied')
  }
  catch (error) {
    console.info(error)
    copyButton.classList.remove('copied')
    copyButton.classList.add('failed')
  }
  clearTimeout(copyResetTimeout)
  copyResetTimeout = setTimeout(() => {
    copyButton.classList.remove('copied', 'failed')
  }, 1500)
})

convertAndRender(stringInput.value)
