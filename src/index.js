import imageCardTpl from './templates/imageCardTpl.hbs'
import ImagesApiService from './js/apiService'
import refs from './js/refs'
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

const imagesApiService = new ImagesApiService()

export function onSearch(e) {
  refs.imagesContainer.innerHTML = ''
  // imagesApiService.resetPage()
  imagesApiService.query = e.target.value
  if (imagesApiService.query === ' ') {
    refs.imagesContainer.innerHTML = ''
    info({ text: 'Too many matches found. Please enter a more specific query!' })
    e.target.value = ''
    return
  }
  imagesApiService.fetchArticles().then(createGalleryImages).catch(onFetchError)
  e.target.value = ''
}

export function onLoadMore(e) {
  imagesApiService.incrementPage()
  imagesApiService.fetchArticles().then(createGalleryImages).catch(onFetchError)
}

function createGalleryImages(images) {
  if (images.total === 0) {
    refs.imagesContainer.innerHTML = ''
    alert({ text: 'Check the correctness of the entered data, images of this category do not exist!' })
    return
  }
  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  refs.imagesContainer.lastElementChild.setAttribute('id', imagesApiService.page)
  document.getElementById(imagesApiService.page).scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
  success({ text: 'The gallery is completed!' })
}

function onFetchError(err) {
  refs.imagesContainer.innerHTML = ''
  error({ text: 'Server error \n Please try again later' })
}
