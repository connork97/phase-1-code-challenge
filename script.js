// Base URLs
const JOKE_URL = "https://v2.jokeapi.dev/joke/";
const LOCAL_URL = "http://localhost:3000/";
const BOOKMARK_URL = "http://localhost:3000/bookmarkedJokes";

// Global Variables
const jokeCat = document.getElementById('joke-category-span');
const jokeSetup = document.getElementById('joke-setup-span');
const jokePunchline = document.getElementById('joke-punchline-span');

// Buttons
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCounter = document.getElementById('like-counter');
const bookmarkBtn = document.getElementById('bookmark-btn');

// Forms/Divs
const newJokeForm = document.getElementById('submit-joke');
const jokeLibDiv = document.getElementById('joke-library-display');

// Functions to Display Jokes:

const fetchJoke = () => {
    fetch(JOKE_URL + "Any" + "?safe-mode" + "&type=twopart")
    .then((response) => response.json())
    .then((data) => {
        clickForJoke(data);
    })
    .catch((error) => console.error(error))
}

const clickForJoke = (data) => {
    const newJokeBtn = document.getElementById('new-joke-btn');
    newJokeBtn.addEventListener('click', () => {
        displayJoke(data);
        fetchJoke();
        }
    )
}

const displayJoke = (data) => {
    jokeCat.textContent = data.category;
    jokeSetup.textContent = data.setup;
    jokePunchline.textContent = data.delivery;
    jokePunchline.style.color = '#001220';
    jokePunchline.classList.add("revealed-span");
    revealPunchline(jokePunchline);
    resetBtns();
}

const revealPunchline = () => {
    jokePunchline.addEventListener('mouseover', () => {
        jokePunchline.classList.add('revealed-text');
    })
}

const resetBtns = () => {
    likeBtn.classList.remove("fa-solid", "clicked");
    dislikeBtn.classList.remove("fa-solid", "clicked");
    bookmarkBtn.classList.remove("fa-solid", "gold", "clicked");
    jokePunchline.classList.remove('revealed-text');
}

// New Joke Form

newJokeForm.addEventListener('submit', (event) => {
    const userJoke = {
        name: event.target.name.value,
        category: event.target.category.value,
        setup: event.target.setup.value,
        delivery: event.target.punchline.value,
        destination: "userJokes"
    }
    displayJoke(userJoke);
    postJoke(userJoke);
    window.alert("Joke submitted and awaiting approval!");
    event.preventDefault();
})

// Like/Dislike/Bookmark Functions

likeBtn.addEventListener('click', () => {
    if(likeBtn.classList.contains("clicked") === false && dislikeBtn.classList.contains("clicked") === true) {
        let totalLikes = Number(likeCounter.textContent);
        totalLikes += 2;
        likeCounter.textContent = Number(totalLikes);
        likeBtn.classList.add("clicked", "fa-solid");
        dislikeBtn.classList.remove("clicked", "fa-solid"); 
        createNewLike();
    } else if(likeBtn.classList.contains("clicked") === false){
        let totalLikes = Number(likeCounter.textContent);
        totalLikes += 1;
        likeCounter.textContent = Number(totalLikes);
        likeBtn.classList.add("clicked", "fa-solid");   
        createNewLike();
    } else {
        window.alert("You've already liked this post!");
    }
})

dislikeBtn.addEventListener('click', () => {
    if(dislikeBtn.classList.contains("clicked") === false && likeBtn.classList.contains("clicked") === true) {
        let totalLikes = Number(likeCounter.textContent);
        totalLikes -= 2;
        likeCounter.textContent = Number(totalLikes);
        dislikeBtn.classList.add("clicked", "fa-solid");
        likeBtn.classList.remove("clicked", "fa-solid"); 
        createNewLike();
    } else if(dislikeBtn.classList.contains("clicked") === false){
        let totalLikes = Number(likeCounter.textContent);
        totalLikes -= 1;
        likeCounter.textContent = Number(totalLikes);
        dislikeBtn.classList.add("clicked", "fa-solid");   
        createNewLike();
    }  else {
        window.alert("You've already disliked this joke.");
    }
})

const createNewLike = () => {
    const newLike = {
        destination: "likeCounter",
        total: likeCounter.textContent,
    }
    patchTotal(newLike);    
}

bookmarkBtn.addEventListener('click', () => {
    if(bookmarkBtn.classList.contains("clicked") === false){
    const bookmarkedJoke = {
        category: jokeCat.textContent,
        setup: jokeSetup.textContent,
        delivery: jokePunchline.textContent,
        destination: "bookmarkedJokes/1"
        }
        postJoke(bookmarkedJoke);
        bookmarkBtn.classList.add("clicked", "fa-solid", "gold");
        setTimeout(() => {
            window.alert("Joke saved to your library!");
        }, 1000);
    } else {
        window.alert("You've already bookmarked this joke.");
    }
})

// PATCH and GET Requests for Likes and Bookmarks

const patchTotal = (patchObj) => {
    fetch(LOCAL_URL + patchObj.destination + "/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patchObj),
    })
    // Keep getting errors, not sure why.  Code runs fine though.
    .then((response) => response.json())
    .then((counterObj) => {
        console.log(counterObj)
    })
    .then((error) => console.error(error))
}

const fetchLikes = () => {
    fetch(LOCAL_URL + "likeCounter/1")
    .then((response) => response.json())
    .then((data) => {
        likeCounter.textContent = data.total;
    })
    .then((error) => console.error(error))
}

// POST Request

const postJoke = (jokeToPost) => {
    fetch(LOCAL_URL + jokeToPost.destination, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jokeToPost),
    })
    .then((response) => response.json())
    .then((jokeObj) => {
        console.log("Success:", jokeObj);
    })
    .catch((error) => console.error(error))
}

// Sort Through By Category

const bookmarkDropdown = document.getElementById('joke-dropdown');

let newBookmarksArr = [];

bookmarkDropdown.addEventListener('change', (event) => {
    jokeLibDiv.innerHTML = "";
    const filteredBookmarks = filterBookmarks(event.target.value, newBookmarksArr);
    filteredBookmarks.forEach((bookmark) => {
        displayBookmarks(bookmark);
    })
})

const fetchBookmarkCat = () => {
    fetch(BOOKMARK_URL)
    .then((response) => response.json())
    .then((bookmarkArr) => {
        bookmarkArr.forEach((bookmarkObj) => {
            newBookmarksArr.push(bookmarkObj);
        })
    })
}

const filterBookmarks = (category, bookmarksArray) => {
    return bookmarksArray.filter((bookmark) => {
        return bookmark.category === category;
    })
}

const displayBookmarks = (bookmark) => {
    const newBookmarkDiv = document.createElement('div');
    // const bookmarkCat = document.createElement('p');
    // bookmarkCat.textContent = "Category: " + bookmark.category;
    // bookmarkCat.classList.add("joke-label");
    const bookmarkSetup = document.createElement('p');
    bookmarkSetup.textContent = "Setup: " + bookmark.setup;
    // bookmarkSetup.classList.add("joke-label");
    const bookmarkPunchline = document.createElement('p');
    bookmarkPunchline.textContent = "Punchline: " + bookmark.delivery;
    // bookmarkPunchline.classList.add("joke-label");
    jokeLibDiv.appendChild(newBookmarkDiv);
    // newBookmarkDiv.appendChild(bookmarkCat);
    newBookmarkDiv.appendChild(bookmarkSetup);
    newBookmarkDiv.appendChild(bookmarkPunchline);
}

const init = () => {
    fetchJoke();
    fetchBookmarkCat();
    fetchLikes();
}

init();