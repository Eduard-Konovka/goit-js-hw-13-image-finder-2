const BASE_URL = `https://pixabay.com/api`
const IMAGE_TYPE = `photo`
const ORIENTATION = `horizontal`
const QUANTITY_PER_PAGE = 12
const KEY = `23466318-01f5a1cbd4b878b74c1a7b3b5`

export default function fetchImages(searchQuery, pageNumber) {
  return fetch(
    `${BASE_URL}/?image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&q=${searchQuery}&page=${pageNumber}&per_page=${QUANTITY_PER_PAGE}&key=${KEY}`,
  ).then(response => response.json())
}

// export default class NewsApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   fetchArticles() {
//     const url = `${BASE_URL}/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`;

//     return fetch(url, options)
//       .then(response => response.json())
//       .then(({ articles }) => {
//         this.incrementPage();
//         return articles;
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
