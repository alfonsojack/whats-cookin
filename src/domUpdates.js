//NOTE: Your DOM manipulation will occur in this file

import './styles.css'
import  './apiCalls'
import {fetchData} from './apiCalls.js'
import {findRecipeIngredients, calculateCost} from './ingredient-functions'
import {findRecipe} from './recipe-functions.js'
import { createRandomIndex} from './scripts'


// Example of one way to import functions from the domUpdates file. You will delete these examples.



// query selectors

const searchField = document.querySelector('.search-field');
const allButton = document.querySelector('.all');
const navLinks = document.querySelectorAll('.nav-link');
const savedRecipes = document.querySelector('#savedRecipes');
const allRecipes = document.querySelector('#allRecipes');
const recipesContainer = document.querySelector('.recipe-container');

  //variables
  let randomUser;
  let recipesData;
  let ingredientsData;
  let featuredRecipes = [];

// event listeners

const attachRecipeCardClickListener = event => {
  const recipeCard = event.target.closest('.recipe-card');
  if (recipeCard) {
    event.preventDefault();
    const recipeId = recipeCard.getAttribute('id');
  
    displayPopUp(recipesData, ingredientsData, recipeId, randomUser);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const recipesContainer = document.querySelector('.recipe-container');
  recipesContainer.addEventListener('click', attachRecipeCardClickListener);
});

const filterByTag = (recipeData, clickedId) => {
  let filteredRecipes = findRecipe('tags', recipeData, clickedId);
  renderRecipes(filteredRecipes)
}

window.addEventListener('load', function() {
  fetchData('users', "https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users", getRandomUser);
  fetchData('recipes', "https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes", getRecipeData)
    .then(() => {
      getFeaturedRecipes(recipesData)})  
    .then(() => {
      renderRecipes(featuredRecipes);})
  fetchData('ingredients', "https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients", getIngredientData)
});


navLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const linkId = link.getAttribute('id');
    filterByTag(recipesData, linkId)
  });
});


searchField.addEventListener('keypress', function(event) {
  displayRecipes(event, recipesData, searchField);
  
});

allButton.addEventListener('click', function() {
  renderRecipes(recipesData);
});

allRecipes.addEventListener('click', function() {
  
  renderRecipes(recipesData);
  allButton.style.borderBottom = '4px solid orange';
  allButton.addEventListener('click', function() {
    renderRecipes(recipesData);
  });
  navLinks.forEach(link => {
    link.style.borderBottom = '4px solid orange';
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const linkId = link.getAttribute('id');
      filterByTag(recipesData, linkId);
    });
  });
  searchField.addEventListener('keypress', function(event) {
    displayRecipes(event, recipesData, searchField);
    
  });
})


savedRecipes.addEventListener('click', function() {
  let userRecipesToCook = randomUser.recipesToCook;
  renderRecipes(userRecipesToCook);
  allButton.style.borderBottom = '4px solid #4B1D3F';
  allButton.addEventListener('click', function() {
    renderRecipes(userRecipesToCook);
  });
  navLinks.forEach(link => {
    link.style.borderBottom = '4px solid #4B1D3F';
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const linkId = link.getAttribute('id');
      filterByTag(userRecipesToCook, linkId);
    });
  });
  searchField.addEventListener('keypress', function(event) {
    displayRecipes(event, userRecipesToCook, searchField);  
  });
})

// event handlers

const getRandomUser = (array) => {
  let randomIndex = createRandomIndex(array);
  randomUser = array[randomIndex]
return randomUser;
};

const getRecipeData = (array) => {
recipesData = array;
return recipesData
}

const getIngredientData = (array) => {
ingredientsData = array;
return ingredientsData
}

const renderRecipes = (recipeData) => {
  recipesContainer.innerHTML = '';
  recipeData.forEach((recipe) => 
    recipesContainer.innerHTML += ` 
    <button class="recipe-card"id="${recipe.id}">
        <p class ="recipe-name">${recipe.name}</p>
        <img class="image-styling" src="${recipe.image}">
      </button>`
  )
  if(recipeData.length === 0) {
    recipesContainer.innerHTML = `<h2 class="categories">No saved recipes yet!</h2>`
  }
}

const saveRecipe = (recipe, user) => {
  const saveRecipeButton = document.querySelector('.save-recipe-button')
    if (!user.recipesToCook.includes(recipe)){
      user.recipesToCook.push(recipe)
      saveRecipeButton.innerText = "Saved!"
      saveRecipeButton.style.backgroundColor = 'green';
    } else {
      let recipeIndex = user.recipesToCook.indexOf(recipe);
      user.recipesToCook.splice(recipeIndex, 1);
      saveRecipeButton.innerText = "Unsaved!"
      saveRecipeButton.style.backgroundColor = 'red';};
}


const displayRecipes = (event, recipeData, searchField) => {
  recipesContainer.innerHTML = '';
  let searchValue = searchField.value.toLowerCase();
  const filteredRecipes = recipeData.filter(recipe => recipe.name.includes(searchValue));
  if (event.key === 'Enter') {
    filteredRecipes.map(recipe => {
      recipesContainer.innerHTML += `
        <button class="recipe-card"id="${recipe.id}">
          <p class="recipe-name">${recipe.name}</p>
          <img class="image-styling" src="${recipe.image}">
        </button>
      `;
    });
  if (filteredRecipes.length === 0) {
    recipesContainer.innerHTML = `<h2 class="categories">No search results!</h2>`
  }
    return filteredRecipes;
  }
};

const findRecipeById = (recipeData, id) => {
  const matchingRecipe = recipeData.find(recipe => recipe.id == id);
  return matchingRecipe || 'oops'

};



const displayPopUp = (recipeData, ingredientInfo, recipeId, user) => {
  let recipeMatch = findRecipeById(recipeData, recipeId)
  let recipeIngredientNames = findRecipeIngredients(recipeData, ingredientInfo, recipeId);
  let recipeCost = calculateCost(recipeData, ingredientInfo, recipeId);
  let ingredientsDivs = recipeIngredientNames.map(ingredient => {
    return `<p>${ingredient}</p>`
  });
  let ingredientsString = ingredientsDivs.join("");
  let recipeInstructions = recipeMatch.instructions
  let instructionsDivs = recipeInstructions.map(step => {
    return `<p>${step.number}. ${step.instruction}</p>`
  });
  let instructionsList = instructionsDivs.join("");
  recipesContainer.innerHTML =
`
    <div class="popup-overlay">
      <div class="popup-content">
        <h2>${recipeMatch.name}</h2>
        <img src="${recipeMatch.image}" alt="${recipeMatch.name}">
        <h3>Ingredients:</h3>
        <div class="ingredients-list">${ingredientsString}</div>
        <h3>Instructions:</h3>
        <div class="instructions-list">${instructionsList}</div>
        <h3>Total Cost:</h3>
        <p>${recipeCost}</p>
      </div>
      <section class="save-and-close-button-container">
      <button class="save-and-close-button" id="closePopup">Close</button>
      <button class="save-and-close-button save-recipe-button" id="saveRecipe">Save</button>
    </section>
    </div>
  `
  const popUpContentContainer = document.querySelector('.popup-content');
  popUpContentContainer.style.backgroundColor = '#414535';
  popUpContentContainer.style.border = '3px black solid';
  const closeButton = document.querySelector('#closePopup');
  closeButton.addEventListener('click', () => {
    renderRecipes(recipeData); //REFACTOR; CHECK: SCRIPTS (82.1)
  });
 
  const saveRecipeButton = document.querySelector('.save-recipe-button');
  if (user.recipesToCook.includes(recipeMatch)){
    saveRecipeButton.innerText = "Saved!"
    saveRecipeButton.style.backgroundColor = 'green';
  }
  saveRecipeButton.addEventListener('click', () => {
    saveRecipe(recipeMatch, user);
})
}

const getFeaturedRecipes = (array) => {
  const uniqueIndexPositions = [];
  for (let i = 0; i < 6; i++) {
    let randomIndex = createRandomIndex(array);
    if (uniqueIndexPositions.includes(randomIndex)) {
      i--;
    } else {
      uniqueIndexPositions.push(randomIndex);
      featuredRecipes.push(array[randomIndex]);
    }
  }
};

export  {
  renderRecipes,
  displayRecipes,
  displayPopUp, 
}
