import styles from '.././main.scss';
import Search from './models/Search';
import * as searchView from './views/searchView';
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

const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();
    
    // If there's a query
    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput(); // Clear input text
        searchView.clearResults(); // Clear result list
        renderLoader(elements.searchRes); // Adds spinning loader icon

        // 4) Search for recipes
        await state.search.getResults(); // Await the results until the promise is fulfilled, then it can be render on step 5
        
        // 5) Render results on UI
        clearLoader(); // Removes spinning loader icon
        searchView.renderResults(state.search.result); // Render/Shows all result list
    }
}

// Trigger the result
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

