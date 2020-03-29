import axious from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axious(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    }

    // Estimate of cooking time
    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    // Estimate of servings
    calcServings() {
        this.servings = 4; // TODO
    }

    parseIngredients() {
        const longUnit = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound'];
        const shortUnit = ['tbsp','tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb', 'lb'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            longUnit.forEach( (unit, i) =>  {
                ingredient = ingredient.replace(unit, shortUnit[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');

            // Find the position/index if the array contains the unit/value from shortUnit Array.
            const unitIndex = arrIng.findIndex(el2 => shortUnit.includes(el2)); 

            let objIng;            
            if (unitIndex > -1) { // There's a unit   
                let count;
                // Ex1:  4 1/2 cups, arrCount is [4, 1/2];  Ex2: 4 cups, is arrCount is [4]. Note: UnitIndex is not included!
                const arrCount = arrIng.slice(0, unitIndex);

                if ( arrCount.length === 1 ) { // Is only one element/number before the unit?
                    count = eval(arrIng[0].replace('-', '+')).toFixed(1);
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')).toFixed(1); // Ex1: [4, 1/2].join('+') = '4 + 1/2' ---> eval('4 + 1/2') = 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
                
            } else if (parseInt(arrIng[0], 10)) { // There's no Unit but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // Removes the number and back it together into a String
                }
            } else if (unitIndex === -1) { // There's no Unit and the 1st element is not a number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient //Object Literal Shorthand
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }
}

