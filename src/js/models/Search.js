import axious from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(){    
        try {
            const res = await axious(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error){
            console.log(error);
        }
    }
}