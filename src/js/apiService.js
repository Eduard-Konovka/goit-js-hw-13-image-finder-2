import URL from './settings'

export default {
  searchQuery: '',
  page: 1,

  async fetchArticles() {
    const url = `${URL.BASE_URL}/?image_type=${URL.IMAGE_TYPE}&orientation=${URL.ORIENTATION}&q=${this.searchQuery}&page=${this.page}&per_page=${URL.QUANTITY_PER_PAGE}&key=${URL.KEY}`

    const response = await fetch(url)
    return await response.json()
  },

  incrementPage() {
    this.page += 1
  },

  resetPage() {
    this.page = 1
  },

  get query() {
    return this.searchQuery
  },

  set query(newQuery) {
    this.searchQuery = newQuery
  },
}
