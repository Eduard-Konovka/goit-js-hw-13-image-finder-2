import URL from './settings'

export default class ImagesApiService {
  constructor() {
    this.searchQuery = ''
    this.page = 1
  }

  fetchCards() {
    const url = `${URL.BASE_URL}/?image_type=${URL.IMAGE_TYPE}&orientation=${URL.ORIENTATION}&q=${this.searchQuery}&page=${this.page}&per_page=${URL.QUANTITY_PER_PAGE}&key=${URL.KEY}`

    return fetch(url).then(response => response.json())
  }

  incrementPage() {
    this.page += 1
  }

  resetPage() {
    this.page = 1
  }

  get query() {
    return this.searchQuery
  }

  set query(newQuery) {
    this.searchQuery = newQuery
  }
}
