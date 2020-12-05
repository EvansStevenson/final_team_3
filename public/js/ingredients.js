const checkboxCollection = document.querySelectorAll('input[type=checkbox]');

let ingredientsRemoved = [];
let csrf;

Array.from(checkboxCollection).forEach(item => {
  item.addEventListener('change', e => {
    if (item.checked) {
      e.target.parentNode.classList.add('crossed');
      ingredientsRemoved.push(e.target.parentNode.innerText);
      console.log(ingredientsRemoved);
    } else {
      e.target.parentNode.classList.remove('crossed');
      ingredientsRemoved = ingredientsRemoved.filter(x => x !== e.target.parentNode.innerText);
      console.log(ingredientsRemoved);
    }
  });
});

const sendData = async array => {
  const response = await fetch('http://localhost:5000/recipe/remove-from-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      ingredients: ingredientsRemoved,
      csrf: csrf,
    },
  });
};

document.getElementById('remove-btn').addEventListener('click', () => {
  csrf = document.querySelector('input[type=hidden]').value;
  sendData(ingredientsRemoved);
});
