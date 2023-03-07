const JOKE_URL = "https://v2.jokeapi.dev/joke/";
const LOCAL_URL = "http://localhost:3000/";

// Global Variables

const jokeCat = document.getElementById('joke-category-span');
const jokeSetup = document.getElementById('joke-setup-span');
const jokePunchline = document.getElementById('joke-punchline-span');
const newJokeBtn = document.getElementById('new-joke-btn');

// Buttons

const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCounter = document.getElementById('like-counter');
const bookmarkBtn = document.getElementById('bookmark-btn');

// Forms

const newJokeForm = document.getElementById('submit-joke');

// Displaying Jokes Functions

const fetchJoke = () => {
    fetch(JOKE_URL + "Any" + "?safe-mode" + "&type=twopart")
    .then((response) => response.json())
    .then((data) => {
        clickForTwoLiner(data);
    })
    .catch((error) => console.error(error))
}

const clickForTwoLiner = (data) => {
    newJokeBtn.addEventListener('click', () => {
        displayTwoLiner(data);
        fetchJoke();
        likeCounter.textContent = 0;
        }
    )
}

const displayTwoLiner = (data) => {
    jokeCat.textContent = data.category;
    jokeSetup.textContent = data.setup;
    jokePunchline.textContent = data.delivery;
    jokePunchline.style.color = 'white';
    revealPunchline(jokePunchline);
}

const revealPunchline = (jokePunchline) => {
    jokePunchline.addEventListener('mouseover', () => {
        jokePunchline.style.color = 'black';
    })
}

// New Joke Form

newJokeForm.addEventListener('submit', (event) => {
    const userJokes = {
        name: event.target.name.value,
        category: event.target.category.value,
        setup: event.target.setup.value,
        delivery: event.target.punchline.value
    }
    displayTwoLiner(userJokes);
    postUserJoke(userJokes);
    event.preventDefault();
})

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
    const bookmarkedJokes = {
        category: jokeCat.textContent,
        setup: jokeSetup.textContent,
        delivery: jokePunchline.textContent
    }
    postBookmarkedJoke(bookmarkedJokes);
    window.alert("Joke saved to your library!");
})

// POST Requests - Note:  Combine these!

const postBookmarkedJoke = (bookmarkedJokePost) => {
    fetch(LOCAL_URL + "bookmarkedJokes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookmarkedJokePost),
    })
    .then((response) => response.json())
    .then((bookmarkedJokePost) => {
        console.log("Success:", bookmarkedJokePost);
    })
    .catch((error) => console.error(error))
}

const postUserJoke = (userJokePost) => {
    fetch(LOCAL_URL + "userJokes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userJokePost),
    })
    .then((response) => response.json())
    .then((userJokePost) => {
        console.log("Success:", userJokePost);
    })
    .catch((error) => console.error(error))
}

const init = () => {
    fetchJoke();
}

init();
