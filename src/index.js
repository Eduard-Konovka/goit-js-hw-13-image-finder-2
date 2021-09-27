import imageCardTpl from './templates/imageCardTpl.hbs'
import refs from './js/refs'

// --- Либо для дефолтного экспорта объекта отвечающего за логику HTTP-запросов к API ---
import imagesApiService from './js/apiService'

// --- Либо для дефолтного экспорта объекта-экземпляра класса отвечающего за логику HTTP-запросов к API ---
// import ImagesApiService from './js/apiServicePlagin'

// --- Дефолтный экспорт объекта-экземпляра класса кнопки загрузки следующей страницы ---
import LoadMoreBtn from './js/load-more-btn'

// --- Подключение плагина нотификации PNotify ---
import { alert, notice, info, success, error, defaultModules } from '@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
defaultModules.set(PNotifyMobile, {})
// --- Настройка плагина нотификации PNotify ---
import { defaults } from '@pnotify/core'
defaults.width = '400px'
defaults.delay = '3000'

// --- Создание объекта-экземпляра класса отвечающего за логику HTTP-запросов к API ---
// const imagesApiService = new ImagesApiService()

// --- Создание объекта-экземпляра класса кнопки загрузки следующей страницы ---
export const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
})

// --- Подключение плагина debounce ---
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
