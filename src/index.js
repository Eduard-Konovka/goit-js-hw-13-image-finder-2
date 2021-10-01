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
defaults.delay = '2000'

// --- Подключение плагина debounce ---
const debounce = require('lodash.debounce')

// --- Подключение плагина лайтбокса basicLightbox ---
// const basicLightbox = require('basiclightbox') // import * as basicLightbox from 'basiclightbox'

// --- Создание объекта-экземпляра класса отвечающего за логику HTTP-запросов к API ---
const imagesApiService = new ImagesApiService()

// --- Слушатель событий ---
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

function onSearch(e) {
  refs.imagesContainer.innerHTML = ''
  imagesApiService.resetPage()
  imagesApiService.query = e.target.value.trim()

  if (imagesApiService.searchQuery.length < 1) {
    refs.imagesContainer.innerHTML = ''
    info({ text: 'Too many matches found. Please enter a more specific query!' })
    e.target.value = ''
    return
  }

  imagesApiService
    .fetchCards()
    // .then(checksServerErrors)
    .then(checksNumberOfImages)
    .then(checksQuantityOnPage)
    .then(createGalleryImages)
    .then(setObserver)
    .catch(onFetchError)
  e.target.value = ''
}

function onLoadMore() {
  imagesApiService.incrementPage()
  removeObserver()
  imagesApiService
    .fetchCards()
    .then(removeObserver)
    // .then(checksServerErrors)
    .then(checksQuantityOnTotalHits)
    .then(createGalleryImages)
    .then(setObserver)
    .catch(onFetchError)
}

// function checksServerErrors(images) {
//   console.log('images.status: ', images.status)
//   console.log('images.total: ', images.total)
//   if (images.status > 500) {
//     refs.imagesContainer.innerHTML = ''
//     console.log('images.status: ', images.status)
//     throw error({ text: 'Server error \n Please try again later' })
//   }

//   return images
// }

function checksNumberOfImages(images) {
  if (images.total === 0) {
    refs.imagesContainer.innerHTML = ''
    throw alert({ text: 'Check the correctness of the entered data, images of this category do not exist!' })
  }

  return images
}

function checksQuantityOnPage(images) {
  if (images.hits.length === 12) {
    return images
  }

  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  throw (success({ text: 'Upload successful!' }), notice({ text: 'No more images!' }))
}

function checksQuantityOnTotalHits(images) {
  if (refs.imagesContainer.children.length < 492) {
    return images
  }

  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  throw (success({ text: 'Upload successful!' }), notice({ text: 'No more images!' }))
}

function createGalleryImages(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(images))
  return images
}

function onFetchError() {}
