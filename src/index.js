import imageCardTpl from './templates/imageCardTpl.hbs'
import refs from './js/refs'
import ImagesApiService from './js/apiService'
import LoadMoreBtn from './js/load-more-btn'

import { alert, notice, info, success, error, defaultModules } from '@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
defaultModules.set(PNotifyMobile, {})
import { defaults } from '@pnotify/core'
defaults.width = '400px'
defaults.delay = '3000'

const imagesApiService = new ImagesApiService()
export const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
})

var debounce = require('lodash.debounce')

refs.searchForm.addEventListener('input', debounce(onSearch, 1000))
loadMoreBtn.refs.button.addEventListener('click', onLoadMore)

export function onSearch(e) {
  refs.imagesContainer.innerHTML = ''
  imagesApiService.resetPage()
  imagesApiService.query = e.target.value

  if (imagesApiService.query === ' ') {
    refs.imagesContainer.innerHTML = ''
    info({ text: 'Too many matches found. Please enter a more specific query!' })
    e.target.value = ''
    return
  }

  loadMoreBtn.show()
  loadMoreBtn.disable()
  imagesApiService.fetchArticles().then(createGalleryImages).catch(onFetchError)
  e.target.value = ''
}

export function onLoadMore(e) {
  imagesApiService.incrementPage()
  loadMoreBtn.disable()
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
  loadMoreBtn.enable()
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  success({ text: 'Upload successful!' })
}

function onFetchError(err) {
  refs.imagesContainer.innerHTML = ''
  error({ text: 'Server error \n Please try again later' })
}
