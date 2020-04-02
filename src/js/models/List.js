import uniqid from 'uniqid';

export default class List {
        constructor() {
            this.items = [];
        }

        addItem (count, unit, ingredient) {
            const item = {
                id: uniqid('item-'),
                count, 
                unit,
                ingredient
            }

            this.items.push(item);
            return item;
        }

        deleteItem(id) {
            // index of the id
            const index = this.items.findIndex(el => el.id === id);

            // SPLICE: [2,4,8].splice(1, 2) --> returns [4,8] and the original array is [2]
            // SLICE:  [2,4,8].slice(1, 2)  --> returns [4] and the original array is [2, 4, 8]
            // Delete the item
            this.items.splice(index, 1);
        }
        
        // Update the ingredient item count.
        updateCount(id, newCount) {
            if (id) {
                this.items.find(el => el.id === id).count = newCount;
            }
            
        }
}