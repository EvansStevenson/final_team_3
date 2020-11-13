let numberOfIngredients = 1;
let numberOfDirections = 1;

function addIngredient() {
    numberOfIngredients++;
    document.getElementById('numOfIngredients').value = numberOfIngredients;
    let ingredient = document.createElement("input");
    ingredient.setAttribute('type', 'text');
    ingredient.setAttribute('placeholder', 'Ingredient #' + numberOfIngredients.toString());
    ingredient.setAttribute('name', 'ingredient' + numberOfIngredients.toString());
    document.getElementById('ingredients').appendChild(ingredient);



    let amount = document.createElement("input");
    amount.setAttribute('name', 'amount' + numberOfIngredients.toString());
    amount.setAttribute('type', 'number');
    amount.setAttribute('step', '.01');
    amount.setAttribute('placeholder', 'amount');
    amount.setAttribute('style', 'width: 60px;');
    document.getElementById('ingredients').appendChild(amount);

    let selectbox = document.createElement("select");
    selectbox.setAttribute('name', 'unit' + numberOfIngredients.toString());
    selectbox.setAttribute('id', 'unit' + numberOfIngredients.toString());


    let teaspoon = document.createElement("option");
    teaspoon.setAttribute("value", "teaspoon");
    teaspoon.innerHTML = "teaspoon";

    let tablespoon = document.createElement("option");
    tablespoon.setAttribute("value", "tablespoon");
    tablespoon.innerHTML = "tablespoon";

    let cup = document.createElement("option");
    cup.setAttribute("value", "cup");
    cup.innerHTML = "cup";

    let pint = document.createElement("option");
    pint.setAttribute("value", "pint");
    pint.innerHTML = "pint";

    let quart = document.createElement("option");
    quart.setAttribute("value", "quart");
    quart.innerHTML = "quart";

    let gallon = document.createElement("option");
    gallon.setAttribute("value", "gallon");
    gallon.innerHTML = "gallon";

    let pound = document.createElement("option");
    pound.setAttribute("value", "pound");
    pound.innerHTML = "pound";

    let other = document.createElement("option");
    other.setAttribute("value", "other");
    other.setAttribute("id", "otherId" + numberOfIngredients.toString());
    other.innerHTML = "other";

    selectbox.add(teaspoon);
    selectbox.add(tablespoon);
    selectbox.add(cup);
    selectbox.add(pint);
    selectbox.add(quart);
    selectbox.add(gallon);
    selectbox.add(pound);
    selectbox.add(other);
    document.getElementById('ingredients').appendChild(selectbox);

    let hiddenText = document.createElement("input");
    hiddenText.setAttribute("id", 'hiddenUnit' + numberOfIngredients.toString());
    hiddenText.setAttribute("type", "text");
    hiddenText.setAttribute("placeholder", "other Unit");
    hiddenText.hidden = true;
    document.getElementById('ingredients').appendChild(hiddenText);
    let br = document.createElement("br");
    document.getElementById('ingredients').appendChild(br);
}

function addDirection() {
    numberOfDirections++;
    document.getElementById('numOfDirections').value = numberOfDirections;
    let newDirection = document.createElement("textarea");
    newDirection.setAttribute('placeholder', 'Direction #' + numberOfDirections.toString());
    newDirection.setAttribute('name', 'direction' + numberOfDirections.toString());
    document.getElementById('directions').appendChild(newDirection);
    let br = document.createElement("br");
    document.getElementById('directions').appendChild(br);
}


document.getElementById('unit1').addEventListener("change", () => {
    if (document.getElementById('unit1').value === "other") {
        document.getElementById("hiddenUnit1").hidden = false;
        document.getElementById("hiddenUnit1").addEventListener("change", () => {
            document.getElementById("otherId1").value = document.getElementById("hiddenUnit1").value;
        })
    }
})
document.getElementById("ingredientBtn").addEventListener("click", () => {
    addIngredient();
    document.getElementById('unit' + numberOfIngredients.toString()).addEventListener("change", () => {
        if (document.getElementById('unit' + numberOfIngredients.toString()).value === "other") {
            document.getElementById("hiddenUnit" + numberOfIngredients.toString()).hidden = false;
            document.getElementById("hiddenUnit" + numberOfIngredients.toString()).addEventListener("change", () => {
                document.getElementById("otherId" + numberOfIngredients.toString()).value = document.getElementById("hiddenUnit" + numberOfIngredients.toString()).value;
            })
        }
    })
})
