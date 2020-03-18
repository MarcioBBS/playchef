import Search from './models/Search';

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
    const query = 'pizza'; //TODO
    
    // If the query is not undefined
    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results

        // 4) Search for recipes
        await state.search.getResults(); // Await the results here so the result can be render on step n. 5)

        // 5) Render results on UI
        console.log(state.search.result);
    }

}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

