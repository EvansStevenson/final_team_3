let numberOfIngredients = Number(document.getElementById('numOfIngredients').value);
let numberOfDirections = Number(document.getElementById('numOfDirections').value);

function addIngredient() {
    numberOfIngredients++;
    document.getElementById('numOfIngredients').value = numberOfIngredients;
    let ingredient = document.createElement("input");
    ingredient.setAttribute('type', 'text');
    ingredient.setAttribute('placeholder', 'Ingredient #' + numberOfIngredients.toString());
    ingredient.setAttribute('name', 'ingredient' + (numberOfIngredients - 1).toString());
    ingredient.setAttribute("class", "form-control");
    document.getElementById('ingredients').appendChild(ingredient);

    let amount = document.createElement("input");
    amount.setAttribute('name', 'amount' + (numberOfIngredients - 1).toString());
    amount.setAttribute('type', 'text');
    amount.setAttribute('step', '.01');
    amount.setAttribute('placeholder', 'amount');
    amount.setAttribute('style', 'width: 80px;');
    document.getElementById('ingredients').appendChild(amount);

    let unit = document.createElement("input");
    unit.setAttribute("id", 'unit' + numberOfIngredients.toString());
    unit.setAttribute("type", "text");
    unit.setAttribute("placeholder", "Unit (cup, teaspoon, etc.)");
    unit.setAttribute('name', 'unit' + (numberOfIngredients - 1).toString());
    document.getElementById('ingredients').appendChild(unit);
    let br = document.createElement("br");
    document.getElementById('ingredients').appendChild(br);
}

function addDirection() {
    numberOfDirections++;
    document.getElementById('numOfDirections').value = numberOfDirections;
    let newDirection = document.createElement("textarea");
    newDirection.setAttribute('placeholder', 'Direction #' + numberOfDirections.toString());
    newDirection.setAttribute("class", "form-control");
    newDirection.setAttribute('name', 'direction' + (numberOfDirections - 1).toString());
    document.getElementById('directions').appendChild(newDirection);
    let br = document.createElement("br");
    document.getElementById('directions').appendChild(br);
}

document.getElementById("ingredientBtn").addEventListener("click", () => {
    addIngredient();
})
document.getElementById("directionBtn").addEventListener("click", () => {
    addDirection();
})
