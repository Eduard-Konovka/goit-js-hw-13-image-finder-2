const BASE_URL = `https://pixabay.com/api`
const IMAGE_TYPE = `photo`
const ORIENTATION = `horizontal`
const QUANTITY_PER_PAGE = 12
const KEY = `23466318-01f5a1cbd4b878b74c1a7b3b5`

export default function fetchImage(searchQuery, pageNumber) {
  return fetch(
    `${BASE_URL}/?image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&q=${searchQuery}&page=${pageNumber}&per_page=${QUANTITY_PER_PAGE}&key=${KEY}`,
  ).then(response => response.json())
}
