
const galleryList = document.querySelector(".gallery");
const hiddenClass = "is-hidden";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



class ButtonService {
  constructor(buttonEl, hiddenClass) {
    this.buttonEl = buttonEl;
    this.hiddenClass = hiddenClass;
  }

  showLoadMoreButton() {
    this.buttonEl.classList.remove(this.hiddenClass);
  }

  hideLoadMoreButton() {
    this.buttonEl.classList.add(this.hiddenClass);
  }
}

class LoadService {
  constructor(loader, hiddenClass) {
    this.loader = loader;
    this.hiddenClass = hiddenClass;
  }

  showLoader() {
    this.loader.classList.remove(this.hiddenClass);
  }

  hideLoader() {
    this.loader.classList.add(this.hiddenClass);
  }
}

// --- Инициализация SimpleLightbox ---
let galleryInstance = null;
function ensureLightbox() {
  if(!galleryInstance) {
    galleryInstance = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});
  } else {
        galleryInstance.refresh();
  }
}

function createGallery(images) {
  const markup = images
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
            `<li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img 
              class="gallery-image" 
              src="${webformatURL}" 
              alt="${tags}" 
            />
          </a>
          
          <ul class="image-description">
          <li class="image-description-item">Likes <span class="description-numbers">${likes}</span></li>
          <li class="image-description-item">Views <span class="description-numbers">${views}</span></li>
          <li class="image-description-item">Comments <span class="description-numbers">${comments}</span></li>
          <li class="image-description-item">Download <span class="description-numbers">${downloads}</span></li>
          </ul>
        </li>`
      )
    .join('');

  galleryList.insertAdjacentHTML('beforeend', markup);
    queueMicrotask(ensureLightbox);

}

function clearGallery() {
  galleryList.innerHTML = '';
    if (galleryInstance) {
    galleryInstance.destroy();
    galleryInstance = null;
    }
}

export { ButtonService, LoadService, createGallery, clearGallery };