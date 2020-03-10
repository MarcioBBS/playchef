/**
 * To configure webpack we need to know the 4 concepts: 1- entry point; 2- the output; 3- loaders; 4- plugins.
 * 1- Entry point: Where the webpack will start to bundling. It'll look for all the dependecies which it should bundle together.
 * 2- The output: Where to save the bundled file
 * 3- Loaders: Loaders in Webpack allow us to import or to load all kinds of different files. And more importantly, to also process them. Like converting SASS to CSS Code or covert ES6 code to ES5 JavaScript.
*/

// Global app controller
import num from './test';
const x = 23;
console.log(`I am ${num} from another module! Webpack set up!!! Variable x is ${x}`);

import styles from '../main.scss'
