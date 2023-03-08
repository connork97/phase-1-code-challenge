const JOKE_URL = "https://v2.jokeapi.dev/joke/";
const LOCAL_URL = "http://localhost:3000/";
const BOOKMARK_URL = "http://localhost:3000/bookmarkedJokes"
const USER_URL = "http://localhost:3000/userJokes";

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

// Sort Through By Category

const jokeLibraryDiv = document.getElementById('joke-library');
const bookmarkDropdown = document.getElementById('joke-dropdown');
const jokeLibDiv = document.getElementById('joke-library-display');

let newBookmarksArr = [];

bookmarkDropdown.addEventListener('change', (event) => {
    console.log(event.target.value);
    jokeLibDiv.innerHTML = "";
    const filteredBookmarks = filterBookmarks(event.target.value, newBookmarksArr);
    console.log(filteredBookmarks);
    filteredBookmarks.forEach((bookmark) => {
        displayBookmarks(bookmark);
    })
})

const fetchBookmarkCat = () => {
    fetch(BOOKMARK_URL)
    .then((response) => response.json())
    .then((bookmarkArr) => {
        console.log(bookmarkArr);
        bookmarkArr.forEach((bookmarkObj) => {
            newBookmarksArr.push(bookmarkObj);
        })
        console.log(newBookmarksArr);
    })
}

const filterBookmarks = (category, bookmarksArray) => {
    return bookmarksArray.filter((bookmark) => {
        return bookmark.category === category;
    })
}

const displayBookmarks = (bookmark) => {
    console.log(bookmark);
    const newBookmarkDiv = document.createElement('div');
    const bookmarkCat = document.createElement('p');
    bookmarkCat.textContent = bookmark.category;
    const bookmarkSetup = document.createElement('p');
    bookmarkSetup.textContent = bookmark.setup;
    const bookmarkPunchline = document.createElement('p');
    bookmarkPunchline.textContent = bookmark.delivery;
    jokeLibDiv.appendChild(newBookmarkDiv);
    newBookmarkDiv.appendChild(bookmarkCat);
    newBookmarkDiv.appendChild(bookmarkSetup);
    newBookmarkDiv.appendChild(bookmarkPunchline);
}

const init = () => {
    fetchJoke();
    fetchBookmarkCat();
}

init();
