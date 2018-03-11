const selects = document.querySelectorAll('.custom-select')

if (selects && selects.length) {
  Array.prototype.forEach.call(selects, function (item, index) {
    new CustomSelectBox(item)
  })
}

// Image class

function CompImage (src, width, height) {
  this.src = src
  this.selected = false

  const sizes = CompImage.sizeTypes

  for (let size in sizes) {
    if ((width * height) >= size) {
      this.size = sizes[size]
    }
  }

  if (!CompImage.instances.length) {
    CompImage.template = CompImage.getTemplate()
  }

  CompImage.instances.push(this)
}

CompImage.prototype.render = function () {
  const self = this
  const html = document.createElement('div')

  html.innerHTML = CompImage.template

  const li = html.querySelector('li')
  const wrapper = li.querySelector('[data-wrapper]')
  const img = document.createElement('img')
  img.src = this.src
  li.setAttribute('data-size', this.size)

  wrapper.appendChild(img)

  this.el = li
  this.checkboxEl = li.querySelector('[data-checkbox]')

  this.checkboxEl.addEventListener('change', function (e) {
    self.selected = this.checked

    if (self.selected) {
      customEvent(self.el, 'select')
    } else {
      customEvent(self.el, 'unselect')
    }
  })

  return li
}

CompImage.prototype.select = function () {
  if (!this.checkboxEl) return
  this.selected = true
  this.checkboxEl.checked = true
}

CompImage.prototype.unselect = function () {
  if (!this.checkboxEl) return
  this.selected = false
  this.checkboxEl.checked = false
}

CompImage.prototype.hide = function () {
  this.el.classList.add('is-hidden')

  if (this.el.classList.contains('is-hidden')) {
    this.isHidden = true
  }
}

CompImage.prototype.show = function () {
  this.el.classList.remove('is-hidden')

  if (!this.el.classList.contains('is-hidden')) {
    this.isHidden = false
  }
}

CompImage.prototype.destroy = function () {
  this.el.remove()
}

CompImage.getTemplate = function () {
  const tpl = document.getElementById('imageItem')

  if (!tpl) {
    throw new Error({
      message: 'image item template doesn\'t set in html'
    })
  }

  return tpl.innerHTML
}

CompImage.sizeTypes = {
  0: 'small',
  300000: 'medium',
  600000: 'large'
}

CompImage.instances = []

const App = (function (el) {
  let instance
  const obj = {}

  function initImages (images) {
    return images.map(function (item) {
      return new CompImage(item.src, item.width, item.height)
    })
  }

  function renderImages (images) {
    const imageListEl = obj.el.querySelector('[data-list]')
    const imagesListHtml = document.createDocumentFragment()
    obj.images.forEach(function (item) {
      obj.listEl.appendChild(item.render())

      item.el.addEventListener('select', function () {
        toggleDisabledBtn()
      })
      item.el.addEventListener('unselect', function () {
        toggleDisabledBtn()
      })
    })
  }

  function selectAllImages () {
    obj.images.forEach(function (item) {
      item.select()
    })
  }

  function unSelectAllImages () {
    obj.images.forEach(function (item) {
      item.unselect()
    })
  }

  function removeChecked () {
    let l = obj.images.length
    let i = 0

    while (i < l) {
      let item = obj.images[i]

      if (item.selected && !item.isHidden) {
        let index = obj.images.indexOf(item)

        item.destroy()
        obj.images.splice(index, 1)
        l--
      } else {
        i++
      }
    }
  }

  function toggleDisabledBtn () {
    console.log(obj.images.some(item => item.selected))
    obj.removeBtn.disabled = !obj.images.some(item => item.selected)
  }

  function init (el) {
    obj.el = el

    obj.listEl = el.querySelector('[data-list]')
    obj.selectAllCheckbox = el.querySelector('[data-select-all]')
    obj.filterBySizeEl = el.querySelector('[data-filter-size]')
    obj.removeBtn = el.querySelector('[data-remove]')
    obj.removeChecked = removeChecked.bind(obj)
    obj.selectedItems = 0

    obj.selectAllCheckbox.addEventListener('change', function (e) {
      if (this.checked) {
        selectAllImages()
      } else {
        unSelectAllImages()
      }
      toggleDisabledBtn()
    })

    obj.filterBySizeEl.addEventListener('change', function (e) {
      const size = this.value

      if (size === 'all') {
        obj.images.forEach(function (item) {
          item.show()
        })

        return
      }

      obj.images.forEach(function (item) {
        if (item.size === size) {
          item.show()
        } else {
          item.hide()
        }
      })
    })

    obj.removeBtn.addEventListener('click', function (e) {
      if (!this.disabled) {
        obj.removeChecked()
      }
    })

    xxhr('js/images.json')
      .then(function (response) {
        obj.images = initImages(JSON.parse(response))
        renderImages(obj.images)
        customTriggerEvent(obj.filterBySizeEl, 'change')
      })

    return obj
  }

  return {
    getInstance: function (el) {
      if (!instance) {
        instance = init(el)
      }

      return instance
    }

  }
})()

const app = App.getInstance(document.getElementById('app'))

console.log(app)
