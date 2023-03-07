const JOKE_URL = "https://v2.jokeapi.dev/joke/";

// Global Variables

const jokeCat = document.getElementById('joke-category');
const jokeSetup = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');
const newJokeBtn = document.getElementById('new-joke-btn');

const fetchJoke = () => {
    fetch(JOKE_URL + "Any" + "?safe-mode" + "&type=twopart")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        clickForTwoLiner(data);
    })
    .catch((error) => console.log(error))
}

const clickForTwoLiner = (data) => {
    newJokeBtn.addEventListener('click', () => {
        displayTwoLiner(data);
        }
    )
}


const displayTwoLiner = (data) => {
    jokeCat.textContent = data.category;
    jokeSetup.textContent = data.setup;
    jokePunchline.textContent = data.delivery;
}

const init = () => {
    fetchJoke();
}

init();
