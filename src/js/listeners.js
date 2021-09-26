import refs from './refs'
import { onSearch, onLoadMore } from '../index'
var debounce = require('lodash.debounce')

refs.searchForm.addEventListener('input', debounce(onSearch, 1000))
refs.loadMoreBtn.addEventListener('click', onLoadMore)
