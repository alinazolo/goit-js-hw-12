import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import * as RenderFunctions from "./js/render-functions.js";
import getImagesByQuery from "./js/pixabay-api.js"

const form = document.querySelector(".form");
const galleryList = document.querySelector(".gallery-list");
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

// --- Инициализация SimpleLightbox ---
let gallery = new SimpleLightbox('.gallery-list a', {
  captions: true,
  captionDelay: 250,
});

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

async function handleSearch(event) {
        event.preventDefault();
        RenderFunctions.clearGallery();

const form = event.currentTarget;
params.q = form.elements.search.value.trim();

if (!params.q) {
    iziToast.error({
      title: 'Error',
      message: 'Write a request',
      position: 'topRight',
    });
    form.reset();
    return;
}

loaderMore.showLoader();
loadMoreBtn.hideLoadMoreButton();

    try {
const { hits, total } = await getImagesByQuery(params);

params.maxPage = Math.ceil( total / params.per_page);
const images = hits;

if (images.length === 0) {
    loaderMore.hideLoader();
      loadMoreBtn.hideLoadMoreButton();
    iziToast.error({
         title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight', 
      });
      return; // прерываем выполнение
}

RenderFunctions.createGallery(images);
gallery.refresh();

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
        form.reset();
}
}

async function handleLoadMore() {
    params.page += 1; 
    loaderMore.showLoader();
    loadMoreBtn.hideLoadMoreButton();

    try {
const { hits } = await getImagesByQuery(params);

RenderFunctions.createGallery(hits);
gallery.refresh();

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
        if(params.page === params.maxPage) {
            loadMoreBtn.hideLoadMoreButton();
            buttonEl.removeEventListener("click", handleLoadMore);
        } else {
            loadMoreBtn.showLoadMoreButton();
        }
    }
} 





