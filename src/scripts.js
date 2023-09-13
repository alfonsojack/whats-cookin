//NOTE: Data model and non-dom manipulating logic will live in this file.

import './styles.css'


  const createRandomIndex = (array) => { //REFACTOR: Move to untestedFunc or scripts
    return Math.floor(Math.random() * array.length);
  }

  
  
  

export {
  createRandomIndex,
}