import { elements } from './base';

// Returns the input value of the field
export const getInput = () => elements.searchInput.value; // Returns elements.searchInput.value
export const clearInput = () => { elements.searchInput.value = ''; }; // Doesn't returns anything because of the curly braces.

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searcResPages.innerHTML = '';
}

export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

/**
 * 
 * @param {String} title - Title of the recipe
 * @param {number} limit  - The limit of the char per title
 * 
 * Table test
 * 'Pasta with tomato and spinach'
 * acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta' ]
 * acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
 * acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', tomato]
 * acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', tomato]
 * acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', tomato]
 */
export const reduceTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {

            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }

            return acc + cur.length;
        }, 0); // 0 is the initial value of the reduce method

        return `${newTitle.join(' ')} ...`;
    }

    return title;
}
/**
 * Create DOM recipe
 * @param {Object} recipe - recipe to be displayed in the DOM
 */
const createRecipeItem = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${reduceTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>   
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

/**
 * @param {number} page - The number of the page
 * @param {String} type - type: 'prev' or 'next'
 */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

/**
 * Render the pagination buttons 
 * @param {number} page - The number of the current page
 * @param {number} numResult - Total of the result
 * @param {number} resPerPage - Result per page to be rendered on the page
 */
const renderButtons = (page, numResult, resPerPage) => {
    const pages = Math.ceil(numResult / resPerPage); // The Math.ceil() function always rounds a number up to the next largest whole number or integer.
    let button;

    // If its the first page and there's more pages
    if (page === 1 && pages > 1) {
        // Only render the button to go to the next page
        button = createButton(page, 'next');

    // If its between pages
    } else if (page < pages) {
        // Render both (prev and next pages) buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;

    // If its on the last page
    } else if (page === pages && pages > 1) {
        // Only render the button to go to the prev page
        button = createButton(page, 'prev');
    }

    elements.searcResPages.insertAdjacentHTML('afterbegin', button);    
}
/**
 * Shows results on the left sidebar
 * @param {Object[]} recipes - The array with recipes
 * @param {number} page - The number of the page
 * @param {number} resPerPage - Result per page
 */
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // 1) Render results of the current page
    // Variables to control the pagination
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    
    // Slice method here's being used to render only 10 results per page
    recipes.slice(start, end).forEach(createRecipeItem); // Same as: recipes.forEach(el => createRecipeItem(el));

    // 2) Render results of the pagination button    
    renderButtons(page, recipes.length, resPerPage);
};