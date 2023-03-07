const JOKE_URL = "https://v2.jokeapi.dev/joke/";

// Global Variables

const jokeCat = document.getElementById('joke-category');
const jokeSetup = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');
const newJokeBtn = document.getElementById('new-joke-btn');

const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCounter = document.getElementById('like-counter');
const bookmarkBtn = document.getElementById('bookmark-btn');

// Displaying Jokes Functions

const fetchJoke = () => {
    fetch(JOKE_URL + "Any" + "?safe-mode" + "&type=twopart")
    .then((response) => response.json())
    .then((data) => {
        clickForTwoLiner(data);
    })
    .catch((error) => console.log(error))
}

const clickForTwoLiner = (data) => {
    newJokeBtn.addEventListener('click', () => {
        displayTwoLiner(data);
        fetchJoke();
        }
    )
}

const displayTwoLiner = (data) => {
    jokeCat.textContent = data.category;
    jokeSetup.textContent = data.setup;
    jokePunchline.textContent = data.delivery;
    jokePunchline.style.color = 'white';
    revealPunchline(jokePunchline);
    console.log(data);
}

const revealPunchline = (jokePunchline) => {
    jokePunchline.addEventListener('mouseover', () => {
        jokePunchline.style.color = 'black';
    })
}

// Like/Dislike/Bookmark Functions

likeBtn.addEventListener('click', () => {
    let totalLikes = Number(likeCounter.textContent);
    totalLikes += 1;
    likeCounter.textContent = Number(totalLikes);
})

dislikeBtn.addEventListener('click', () => {
    let totalLikes = Number(likeCounter.textContent);
    totalLikes -= 1;
    likeCounter.textContent = Number(totalLikes);
})

bookmarkBtn.addEventListener('click', () => {
    window.alert("Joke saved to your library!");
})

const init = () => {
    fetchJoke();
}

init();
