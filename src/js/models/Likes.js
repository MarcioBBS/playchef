export default class Likes {
    constructor() {
        this.likes = [];
    }

    /* For test. Using object
    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        return like;
    }
    */

    // Add recipe like to the list
    addLike(recipe) {
        const like = [recipe.id, recipe.title, recipe.author, recipe.img];
        this.likes.push(like);
        return like;
    }

    // Remove recipe like to the list
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    // Verify if recipe like is on the list
    isLiked(id) {
        return this.likes.findIndex(e => el.id === id) !== -1;
    }
    
    getNumLikes() {
        return this.likes.length;
    }
}