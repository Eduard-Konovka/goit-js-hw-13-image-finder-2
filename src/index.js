import imageCardTpl from './templates/imageCardTpl.hbs'
import fetchImages from './js/apiService'
import refs from './js/refs'
// import './js/func'
import './js/listeners'

import { alert, notice, info, success, error, defaultModules } from '@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
defaultModules.set(PNotifyMobile, {})
import { defaults } from '@pnotify/core'
defaults.width = '300px'
defaults.delay = '3000'
defaults.minHeight = '86px'

let searchQuery = ''
let page = 1

export function onSearch(e) {
  refs.imagesContainer.innerHTML = ''
  searchQuery = e.target.value
  if (searchQuery === ' ') {
    refs.imagesContainer.innerHTML = ''
    info({ text: 'Too many matches found. Please enter a more specific query!' })
    e.target.value = ''
    return
  }
  fetchImages(searchQuery, page).then(createGalleryImages).catch(onFetchError)
  e.target.value = ''
}

export function onLoadMore(e) {
  page += 1
  fetchImages(searchQuery, page).then(createGalleryImages).then(scrollNextPage).catch(onFetchError)
}

function createGalleryImages(images) {
  if (images.total === 0) {
    refs.imagesContainer.innerHTML = ''
    alert({ text: 'Check the correctness of the entered data, images of this category do not exist!' })
    return
  }
  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  success({ text: 'The gallery is completed!' })
  console.log(images)
}

function scrollNextPage() {
  refs.loadMoreBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
}

function onFetchError(err) {
  refs.imagesContainer.innerHTML = ''
  error({ text: 'Server error \n Please try again later' })
}
