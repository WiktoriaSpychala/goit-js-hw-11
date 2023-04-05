import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const input = document.querySelector('input');
const btn = document.querySelector('.search-btn');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;

//my Pixabay key
const key = '35040832-5e7ee7e93ffcaf004ab10bdd7';

btnLoadMore.classList.add('is-hidden');

const fetchPictures = async (searching, page) => {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${searching}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response.data;
};

btn.addEventListener('click', event => {
  event.preventDefault();
  cleanGallery();
  const inputValue = input.value.trim();
  if (inputValue !== '') {
    fetchPictures(inputValue, pageNumber).then(pictures => {
      if (pictures.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        newGallery(pictures.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${pictures.totalHits} images.`
        );
        btnLoadMore.classList.remove('is-hidden')
        gallerySimpleLightbox.refresh();
      }
    });
  }
});

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.classList.add('is-hidden');
}

btnLoadMore.addEventListener('click', () => {
  pageNumber++;
  const inputValue = input.value.trim();
  btnLoadMore.classList.add('is-hidden');
  fetchPictures(inputValue, pageNumber).then(pictures => {
    if (pictures.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no more images matching your search query.'
      );
      btnLoadMore.classList.add('is-hidden')
    } else {
      newGallery(pictures.hits);
      btnLoadMore.classList.remove('is-hidden')
    }
  });
});

function newGallery(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}


