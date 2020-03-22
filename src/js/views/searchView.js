import { elements } from './base';

// Returns the input value of the field
export const getInput = () => elements.searchInput.value; // Returns elements.searchInput.value
export const clearInput = () => { elements.searchInput.value = ''; }; // Doesn't returns anything because of the curly braces.

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
}

/* Table test
'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta' ]
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', tomato]
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', tomato]
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', tomato]
*/
const reduceTitle = (title, limit = 17) => {
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

export const renderResults = recipes => {
    // recipes.forEach(el => createRecipeItem(el));
    recipes.forEach(createRecipeItem); // Same as the line above. The paramenter el is implicit here. 
};