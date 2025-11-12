
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import * as RenderFunctions from "./js/render-functions.js";
import getImagesByQuery from "./js/pixabay-api.js"

const form = document.querySelector(".form");
const galleryList = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const buttonEl = document.querySelector('[data-action="load-more"]');


const params = {
    page: 1, 
    per_page: 15,
    q: "",
    maxPage: 0,
};

const loadMoreBtn = new RenderFunctions.ButtonService(buttonEl, "is-hidden");
loadMoreBtn.hideLoadMoreButton();

const loaderMore = new RenderFunctions.LoadService(loader, "is-hidden");
loaderMore.hideLoader();



function getGalleryImageHeight() {
  const firstImage = document.querySelector('.gallery-image');
  if (!firstImage) return 0;
  const { height } = firstImage.getBoundingClientRect();
  return height;
}

async function smoothScrollByImageHeight(multiplier = 2) {

    await new Promise(resolve => requestAnimationFrame(resolve));

  const imgHeight = getGalleryImageHeight();
  if (imgHeight > 0) {
    window.scrollBy({
      top: imgHeight * multiplier,
      behavior: 'smooth',
    });
  }
}

// --- Слушатель формы ---
form.addEventListener("submit", handleSearch);
buttonEl.addEventListener("click", handleLoadMore);

let isLoading = false;

async function handleSearch(event) {
event.preventDefault();

RenderFunctions.clearGallery();

const form = event.currentTarget;
params.q = form.elements.search.value.trim();

  // важный сброс пагинации при новом запросе
  params.page = 1;
  params.maxPage = 1;

if (!params.q) {
    iziToast.error({
      title: 'Error',
      message: 'Write a request',
      position: 'topRight',
    });
    form.reset();
    return;
}

isLoading = true;
loaderMore.showLoader();
loadMoreBtn.hideLoadMoreButton();

    try {
const { hits, total } = await getImagesByQuery(params);

params.maxPage = Math.ceil( total / params.per_page);
console.log(total);

if (hits.length === 0) {
    loaderMore.hideLoader();
      loadMoreBtn.hideLoadMoreButton();
    iziToast.error({
         title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight', 
      });
      return; // прерываем выполнение
}

RenderFunctions.createGallery(hits);
// плавна прокрутка вниз на дві висоти картинки
await smoothScrollByImageHeight();

loaderMore.hideLoader(); 

if(params.maxPage > 1) {
    loadMoreBtn.showLoadMoreButton();

} else {
        loadMoreBtn.hideLoadMoreButton();
}

}
catch (err) {
    iziToast.error({
      title: 'Error',
      message: `There is a problem during query ${err}`,
      position: 'topRight',
    });
} finally {
  loaderMore.hideLoader();
  form.reset();
  isLoading = false;
}
}

async function handleLoadMore() {
    if (isLoading) return;
    params.page = Number(params.page) || 1; 
    params.maxPage = Number(params.maxPage) || 1;

    const nextPage = params.page + 1;

    if (nextPage > params.page + 1) {
          loadMoreBtn.hideLoadMoreButton();
          return
    }
  isLoading = true;
  loaderMore.showLoader();
  loadMoreBtn.hideLoadMoreButton();

    try {
      params.page = nextPage;
const { hits } = await getImagesByQuery({ ...params, page: params.page });

if (params.page >= params.maxPage) {
    iziToast.info({
      title: 'End',
      message: "You have reached the end of the results.",
      position: 'topRight',
    });
    loadMoreBtn.hideLoadMoreButton();
    return;
  }

RenderFunctions.createGallery(hits);
// плавна прокрутка вниз на дві висоти картинки
await smoothScrollByImageHeight();



    }
    catch(err) {
      iziToast.error({
      title: "Error",
      message: `There is a problem during query ${err}`,
      position: "topRight",
    }); 
    } finally  {
        loaderMore.hideLoader();
        isLoading = false;
        if(params.page < params.maxPage) {
          loadMoreBtn.showLoadMoreButton();
        } else {
          loadMoreBtn.hideLoadMoreButton();
        }
    }
} 





