const searchBox = document.getElementById('search-box');
const search = document.getElementById('search');
const random = document.getElementById('random');
const form = document.getElementById('form');
const resultHeading  = document.querySelector('.result-heading');
const meal = document.querySelector('.meal');
const singleMeal = document.querySelector('.single-meal');
const sourceDiv = document.querySelector('.source-div');

async function searchFood(){
    singleMeal.classList.remove('show');
    if(searchBox.value === ''){
        alert('Provide the name of the meal!');
    }
    else{
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+searchBox.value.trim());
        const data = await res.json();
        if(data.meals === null){
            sourceDiv.classList.remove('show');
            resultHeading.innerHTML = '<h2 class="no-result-found">No results found for "'+searchBox.value.trim()+'" :(';
        }
        else{
        
            meal.innerHTML = ''
            meal.classList.add('show');
            sourceDiv.classList.remove('show');
            resultHeading.innerHTML = '<h2 class="results-found">Search results for "'+searchBox.value.trim()+'" :';

            data.meals.map(items=>{
                let div = document.createElement('div');
                div.classList.add('meal-info');
                div.setAttribute('data-mealid',items.idMeal)
                div.innerHTML = "<img class='food-img' src="+items.strMealThumb+"><p>"+items.strMeal+"</p>";                
                meal.appendChild(div)
            });
        }
    }
    searchBox.value = '';
}

// get meal by id
async function getMealById(mealId){
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+mealId);
    const data = await res.json();
    updateDom(data);
}
async function randomFood(){
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    updateDom(data);
}
// update dom
function updateDom(data){

    console.log(data.meals[0]);
    meal.classList.remove('show');
    sourceDiv.classList.add('show');
    singleMeal.classList.add('show')

    sourceDiv.innerHTML = '';
    resultHeading.innerHTML = '';
    singleMeal.innerHTML = '';
    
    const imgDiv = document.createElement('div');
    const heading = document.createElement('h2');
    const instructions = document.createElement('p');

    instructions.innerHTML = data.meals[0].strInstructions;
    heading.innerHTML = data.meals[0].strMeal;
    imgDiv.innerHTML = '<img src='+data.meals[0].strMealThumb+'>';
    sourceDiv.innerHTML = `<h2>More Information</h2><h3>Area : <span> ${data.meals[0].strArea}</span>
    <h3><br><h3>Category : <span>${data.meals[0].strCategory}</span><h3>
    <h3><br><h3>Source : <span><a target="_blank" href="${data.meals[0].strSource}">Link</a></span><h3>
    <h3><br><h3>Youtube : <span><a target="_blank" href="${data.meals[0].strYoutube}">Video Link</a></span><h3>
    
    `;


    singleMeal.appendChild(imgDiv);
    singleMeal.appendChild(heading);
    singleMeal.appendChild(instructions); 
}

// event listeners
form.addEventListener('submit',(e)=>{ e.preventDefault() })
search.addEventListener('click',searchFood);
random.addEventListener('click',randomFood);
meal.addEventListener('click',e=>{
    const mealInfo = e.path.find(items=>{
        if(items.classList){
            return items.classList.contains('meal-info');
        }
        else{
            return false;
        }
    });
    if(mealInfo){
        const mealId = mealInfo.getAttribute('data-mealid');
        getMealById(mealId);
    }
})