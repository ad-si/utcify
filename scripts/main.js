import * as chrono from 'https://cdn.jsdelivr.net/npm/chrono-node@2.9.1/+esm'

const stringInput = document
  .getElementById('datetime-string')
const outputContainer = document
  .getElementById('utc-output')
const infoContainer = document
  .getElementById('info')
const copyButton = document
  .getElementById('copy-button')
const shareButton = document
  .getElementById('share-button')


function readInputFromHash () {
  const hash = window.location.hash.slice(1)
  if (!hash) return ''
  try {
    return decodeURIComponent(hash)
  }
  catch (error) {
    console.info(error)
    return hash
  }
}

function writeInputToHash (value) {
  const encoded = value ? '#' + encodeURIComponent(value) : ''
  const newUrl = window.location.pathname + window.location.search + encoded
  window.history.replaceState(null, '', newUrl)
}

function flashButton (button, success) {
  button.classList.remove('copied', 'failed')
  button.classList.add(success ? 'copied' : 'failed')
  clearTimeout(button._resetTimeout)
  button._resetTimeout = setTimeout(() => {
    button.classList.remove('copied', 'failed')
  }, 1500)
}


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
    const value = event.srcElement.value
    writeInputToHash(value)
    convertAndRender(value)
  })

window.addEventListener('hashchange', () => {
  const fromHash = readInputFromHash()
  if (fromHash && fromHash !== stringInput.value) {
    stringInput.value = fromHash
    convertAndRender(fromHash)
  }
})

copyButton.addEventListener('click', async () => {
  const text = outputContainer.textContent
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    flashButton(copyButton, true)
  }
  catch (error) {
    console.info(error)
    flashButton(copyButton, false)
  }
})

shareButton.addEventListener('click', async () => {
  writeInputToHash(stringInput.value)
  try {
    await navigator.clipboard.writeText(window.location.href)
    flashButton(shareButton, true)
  }
  catch (error) {
    console.info(error)
    flashButton(shareButton, false)
  }
})

const initialFromHash = readInputFromHash()
if (initialFromHash) {
  stringInput.value = initialFromHash
}
else {
  writeInputToHash(stringInput.value)
}
convertAndRender(stringInput.value)
