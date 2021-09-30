// --- Импорт шаблона ---
import imageCardTpl from './templates/imageCardTpl.hbs'

// --- Импорт ссылок на DOM ---
import refs from './js/refs'

// --- Дефолтный экспорт объекта-экземпляра класса отвечающего за логику HTTP-запросов к API ---
import ImagesApiService from './js/apiServicePlagin'

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

// --- Подключение плагина debounce ---
const debounce = require('lodash.debounce')

// --- Подключение плагина лайтбокса basicLightbox ---
// const basicLightbox = require('basiclightbox') // import * as basicLightbox from 'basiclightbox'

// --- Создание объекта-экземпляра класса отвечающего за логику HTTP-запросов к API ---
const imagesApiService = new ImagesApiService()

// --- Слушатели событий ---
refs.searchForm.addEventListener('input', debounce(onSearch, 1000))

// --- Intersection Observer ---
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.9,
}

const onEntry = (elements, observer) => {
  elements.forEach(element => {
    if (element.isIntersecting) {
      onLoadMore()
    }
  })
}

const observer = new IntersectionObserver(onEntry, options)

function setObserver() {
  observer.observe(refs.imagesContainer.lastElementChild)
}

function removeObserver(data) {
  observer.unobserve(refs.imagesContainer.lastElementChild)
  return data
}

// --- Функции рендеринга изображений ---

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

  imagesApiService.fetchCards().then(createGalleryImages).then(setObserver).catch(onFetchError)
  e.target.value = ''
}

export function onLoadMore() {
  imagesApiService.incrementPage()
  imagesApiService.fetchCards().then(removeObserver).then(createGalleryImages).then(setObserver).catch(onFetchError)
}

function createGalleryImages(images) {
  if (images.total === 0) {
    refs.imagesContainer.innerHTML = ''
    alert({ text: 'Check the correctness of the entered data, images of this category do not exist!' })
    return
  }

  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  success({ text: 'Upload successful!' })
}

function onFetchError(err) {
  refs.imagesContainer.innerHTML = ''
  error({ text: 'Server error \n Please try again later' })
}
