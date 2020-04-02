import styles from '.././main.scss';

import Likes from './models/Likes';
import List from './models/List';
import Recipe from './models/Recipe';
import Search from './models/Search';

import * as likesView from './views/likesView';
import * as listView from './views/listView';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';

import { elements, renderLoader, clearLoader } from './views/base';

// The State pattern provides state-specific logic to a limited set of objects in which each object represents a particular state.
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

window.state = state;

/**
 * SEARCH CONTROLLER
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
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ''); // Get the hash code from the url and remove the rash '#'

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
        state.recipe.parseIngredients();
        
        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();        

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            alert(`Something went wrong with this recipe ${error}`);
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new lst IF there's none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Delete and update list item event
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;      

    // Delete ingredient
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);        
        // Delete and Update UI
        listView.deleteItem(id);


    // Update the ingredient count
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const recipeID = state.recipe.id;
    
    // User has NOT yet liked the current recipe
    if (!state.likes.isLiked(recipeID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            recipeID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toogleLikeBtn(true);

        // Add like to UI list        
        likesView.renderLike(newLike);

    // User HAS liked the current recipe
    } else {
        // Remove like to the state
        state.likes.deleteLike(recipeID);

        // Toggle the like button
        likesView.toogleLikeBtn(false);

        // Remove like to UI list
        likesView.deleteLike(recipeID);
    }

    likesView.toogleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toogleLikeMenu(state.likes.getNumLikes());

    // Render the stored likes
    state.likes.likes.forEach(like => likesView.renderLike(like));


});

// Handling recipe button clicks
elements.recipe.addEventListener('click', ele => {
    if (ele.target.matches('.btn-decrease, .btn-decrease *')) { // '.btn-decrease *'  means apply it for all the children
        // Decrease servings
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (ele.target.matches('.btn-increase, .btn-increase *')) {
        // Increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (ele.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();

    } else if (ele.target.matches('.recipe__love, .recipe__love *')) {
        // Add or Remove like
        controlLike();
    }
});