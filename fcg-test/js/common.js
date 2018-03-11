// Customn trigger event
function customTriggerEvent (el, eventType) {
  if ('createEvent' in document) {
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent(eventType, false, true)
    el.dispatchEvent(evt)
  } else {
    el.fireEvent('on' + eventType)
  }
}

// Customn trigger event
function customEvent (el, eventType) {
  const event = new Event(eventType, {
    cancelable: true
  })

  el.dispatchEvent(event)
}

// Custom Selectbox

function CustomSelectBox (el) {
  this.el = el

  this.selElement = null
  this.selectedEl = null
  this.dropdownEl = null

  this.init()

  CustomSelectBox.instances.push(this)
}

CustomSelectBox.prototype.init = function () {
  const self = this
  this.selElement = this.el.getElementsByTagName('select')[0]

  const selectedEl = this.selectedEl = document.createElement('div')
  selectedEl.classList.add('custom-select__selected')
  selectedEl.innerHTML = this.selElement.options[this.selElement.selectedIndex].innerHTML
  this.el.appendChild(selectedEl)

  this.dropdownEl = this.createDropdown()

  this.el.appendChild(this.dropdownEl)

  selectedEl.addEventListener('click', function (e) {
    e.stopPropagation()
    CustomSelectBox.closeAll(self)
    this.nextSibling.classList.toggle('is-hidden')
    this.classList.toggle('is-active')
  })

  if (!CustomSelectBox.instances.length) {
    document.addEventListener('click', CustomSelectBox.closeAll)
  }
}

CustomSelectBox.prototype.createDropdown = function () {
  const selElement = this.selElement
  const dropdownEl = document.createElement('div')
  dropdownEl.classList.add('custom-select__items', 'is-hidden')

  for (let j = 0; j < selElement.length; j++) {
    let option = document.createElement('DIV')
    option.innerHTML = selElement.options[j].innerHTML

    option.addEventListener('click', function (e) {
      let i, s, h
      s = this.parentNode.parentNode.getElementsByTagName('select')[0]
      h = this.parentNode.previousSibling
      for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML === this.innerHTML) {
          s.selectedIndex = i
          h.innerHTML = this.innerHTML
          break
        }
      }
      h.click()

      customTriggerEvent(selElement, 'change')
    })

    dropdownEl.appendChild(option)
  }

  return dropdownEl
}

CustomSelectBox.prototype.close = function () {
  this.dropdownEl.classList.add('is-hidden')
  this.selectedEl.classList.remove('is-active')
}

CustomSelectBox.instances = []

CustomSelectBox.closeAll = function (current) {
  const instances = CustomSelectBox.instances

  if (instances instanceof Array && instances.length) {
    instances.forEach(function (select) {
      if (select !== current) {
        select.close()
      }
    })
  }
}

// XHR

const xxhr = function (url, callback) {
  const xhr = new XMLHttpRequest()

  return new Promise(function (resolve, reject) {
    xhr.open('GET', url, true)

    xhr.send()

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return

      if (this.status !== 200) {
        reject(new Error('error: ' + (this.status ? this.statusText : 'request failed')))
      }

      resolve(this.responseText)
    }
  })
}
