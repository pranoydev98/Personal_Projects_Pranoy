//jshint esversion: 6
export const elements = {
  searchForm: document.querySelector('.search'),     //search box
  searchInput: document.querySelector('.search__field'),  //input given
  searchRes: document.querySelector('.results'), //to place loader
  searchResList: document.querySelector('.results__list'),  //result on left
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
  loader: 'loader'
};

//loading symbol
export const renderLoader = parent => {
  const loader = `
  <div class="${elementStrings.loader}">
    <svg>
      <use href="img/icons.svg#icon-cw"></use>
    </svg>
  </div>
  `;
  parent.insertAdjacentHTML('afterbegin',loader);
};

//clear loader
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if(loader) loader.parentElement.removeChild(loader);
};
