import styles from '.././main.scss';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
;

// The State pattern provides state-specific logic to a limited set of objects in which each object represents a particular state.
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();
    
    // If there's a query
    if (query) {
        // 2) Create a search object and add it to the state object
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput(); // Clear input text
        searchView.clearResults(); // Clear result list
        renderLoader(elements.searchRes); // Adds spinning loader icon

        try {
            // 4) Search for recipes
            await state.search.getResults(); // Await the results until the promise is fulfilled, then it can be render on step 5

            // 5) Render results on UI
            clearLoader(); // Removes spinning loader icon
            searchView.renderResults(state.search.result); // Render/Shows all result list

        } catch (error) {
            alert(`Something went wrong with the search ${error}`);
            clearLoader(); // Removes spinning loader icon
        }
    }
}

// Trigger the result
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Render the pagination
elements.searcResPages.addEventListener('click', e => {
    e.preventDefault();
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults(); // Clear result list
        searchView.renderResults(state.search.result, goToPage); // To go the next or prev page
    }    
});

/**
 * Recipe Controller
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ''); // Get the hash code from the url and remove the rash '#'
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearResults();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
        // Get recipe data and parse the ingredients
        await state.recipe.getRecipe(); // Await the recipe until the promise is fulfilled.
        console.log(state.recipe.ingredients);
        state.recipe.parseIngredients();
        
        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();        

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert(`Something went wrong with this recipe ${error}`);
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 