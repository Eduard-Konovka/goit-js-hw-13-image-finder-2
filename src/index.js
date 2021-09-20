// ----------------------------------------------------------------------------
// --------------------------------- ИМПОРТЫ ----------------------------------
// ----------------------------------------------------------------------------

import db from './db/db.json'
import templ from './templates/imageCardTpl.hbs'
import refs from './js/refs'
import './js/func'
import './js/listeners'

const element = document.getElementById('.my-element-selector')
element.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
})
