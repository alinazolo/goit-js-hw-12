import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const galleryList = document.querySelector(".gallery-list");
const loader = document.querySelector(".loader");
const buttonEl = document.querySelector('[data-action="load-more"]');



import * as RenderFunctions from "./render-functions.js";
import getImagesByQuery from "./pixabay-api.js"

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

// --- Слушатель формы ---
form.addEventListener("submit", handleSearch);

async function handleSearch(event) {
        event.preventDefault();
        RenderFunctions.clearGallery();

const form = event.currentTarget;
params.q = form.elements.search.value.trim();
console.log(params.q);
if(!params.q) {
    iziToast.error({
      title: "Error",
      message: "Write a request",
      position: "topRight",
    });
    form.reset();
    return;
}

loaderMore.showLoader();

    try {
const { hits, total } = await getImagesByQuery(params);

params.maxPage = Math.ceil( total / params.per_page);
const images = hits;

RenderFunctions.createGallery(images);
gallery.refresh();

if(params.maxPage > 1) {
    loadMoreBtn.showLoadMoreButton();
    loaderMore.hideLoader();
    buttonEl.addEventListener("click", handleLoadMore);

} else {
        loadMoreBtn.hideLoadMoreButton();
}

}
catch(err) {
    iziToast.error({
      title: "Error",
      message: `There is a problem during query ${err}`,
      position: "topRight",
    });
} finally {
        form.reset();
}
}

async function handleLoadMore() {
    params.page += 1; 
    loaderMore.showLoader();

    try {
const { hits } = await getImagesByQuery(params);
RenderFunctions.createGallery(hits);
    }
    catch(err) {
      iziToast.error({
      title: "Error",
      message: `There is a problem during query ${err}`,
      position: "topRight",
    }); 
    } finally {
        if(params.page === maxPage) {
            loadMoreBtn.hideLoadMoreButton;
            buttonEl.removeEventListener("click", handleLoadMore);
        } else {
            loadMoreBtn.showLoadMoreButton();
        }
    }
} 

/// добавить дизайн лоадера 
// потестировтаь лоадер и кнопку 
// сделать так чтобы лоадер и кнопка отражались вместе внизу страницы 



