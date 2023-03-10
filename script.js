// Base URLs
const JOKE_URL = "https://v2.jokeapi.dev/joke/";
const LOCAL_URL = "http://localhost:3000/";
const BOOKMARK_URL = "http://localhost:3000/bookmarkedJokes";
const USERS_URL = "http://localhost:3000/users";

// Global Variables
// const jokeCat = document.getElementById('joke-category-span');
const jokeCat = document.createElement('span');
const jokeSetup = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');

// Buttons
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCounter = document.getElementById('like-counter');
const bookmarkBtn = document.getElementById('bookmark-btn');

// Forms/Divs
const newJokeForm = document.getElementById('submit-joke');
const jokeLibDiv = document.getElementById('joke-library-display');

// User Login Functions

const createAccountForm = document.getElementById('create-account-form');

createAccountForm.addEventListener('submit', (event) => {
    const newUser = {
        userName: event.target.newUserName.value,
        password: event.target.newPassword.value,
        bookmarks: []
    }
    postNewUser(newUser);
    displayUser(newUser);
    createAccountForm.reset();
    event.preventDefault();
})

const postNewUser = (newUser) => {
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    })
    .then((response) => response.json())
    .then((userObj) => {
        console.log("Success:", userObj);
    })
    .catch((error) => console.error(error))
}

const displayUser = (user) => {
    const userInfoDiv = document.getElementById('userInfoDiv');
    userInfoDiv.innerHTML = "";
    const displayedUser = document.createElement('h3');
    displayedUser.textContent = "Welcome, " + user.userName + "!";
    userInfoDiv.appendChild(displayedUser);
}

// Functions to Display Jokes:

const categorySpan = document.querySelectorAll('.catSpan');
categorySpan.forEach((span) => {
    span.addEventListener('click', (event) => {
        console.log(event.target.id);
        console.log(event.target.classList)
        fetchJoke(span.id);
        span.classList.remove('selected');
        console.log(span.classList)
        setTimeout(() => {
            categorySpan.forEach((span) => {
                event.target.classList.add('selected');
            })
        }, 1)
        // resetBtns();
    })
})

const fetchJoke = (category = "Any") => {
    fetch(JOKE_URL + category + "?safe-mode&type=twopart")
    .then((response) => response.json())
    .then((data) => {
        displayJoke(data);
    })
    .catch((error) => console.error(error))
}

// const clickForJoke = (category) => {
//     const newJokeBtn = document.getElementById('new-joke-btn');
//     newJokeBtn.addEventListener('click', () => {
//         // displayJoke(data);
//         fetchJoke(category);
//         }
//     )
// }

const displayJoke = (data) => {
    // jokeCat.textContent = data.category;
    jokeCat.category = data.category;
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

    // .classList.remove('selected');
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
    let totalLikes = Number(likeCounter.textContent);
    if(likeBtn.classList.contains("clicked") === false && dislikeBtn.classList.contains("clicked") === true) {
        totalLikes += 2;
        likeCounter.textContent = Number(totalLikes);
        likeBtn.classList.add("clicked", "fa-solid");
        dislikeBtn.classList.remove("clicked", "fa-solid"); 
        createNewLike();
    } else if(likeBtn.classList.contains("clicked") === false){
        totalLikes += 1;
        likeCounter.textContent = Number(totalLikes);
        likeBtn.classList.add("clicked", "fa-solid");   
        createNewLike();
    } else {
        window.alert("You've already liked this joke!");
    }
})

dislikeBtn.addEventListener('click', () => {
    let totalLikes = Number(likeCounter.textContent);
    if(dislikeBtn.classList.contains("clicked") === false && likeBtn.classList.contains("clicked") === true) {
        totalLikes -= 2;
        likeCounter.textContent = Number(totalLikes);
        dislikeBtn.classList.add("clicked", "fa-solid");
        likeBtn.classList.remove("clicked", "fa-solid"); 
        createNewLike();
    } else if(dislikeBtn.classList.contains("clicked") === false){
        totalLikes -= 1;
        likeCounter.textContent = Number(totalLikes);
        dislikeBtn.classList.add("clicked", "fa-solid");   
        createNewLike();
    }  else {
        window.alert("You've already disliked this joke.");
    }
})

bookmarkBtn.addEventListener('click', () => {
    if(jokeSetup.textContent === "") {
        window.alert("Please select a joke to display.")
    } else if(bookmarkBtn.classList.contains("clicked") === false){
        const bookmarkedJoke = {
            category: jokeCat.category,
            setup: jokeSetup.textContent,
            delivery: jokePunchline.textContent,
            destination: "bookmarkedJokes"
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

const createNewLike = () => {
    const newLike = {
        destination: "likeCounter",
        total: likeCounter.textContent,
    }
    patchTotal(newLike);    
}

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
    const bookmarkSetup = document.createElement('p');
    const bookmarkPunchline = document.createElement('p');
    bookmarkSetup.textContent = bookmark.setup;
    bookmarkPunchline.textContent = bookmark.delivery;
    jokeLibDiv.appendChild(newBookmarkDiv).append(bookmarkSetup, bookmarkPunchline);
}
    // const bookmarkCat = document.createElement('p');
    // bookmarkCat.textContent = "Category: " + bookmark.category;
    // bookmarkCat.classList.add("joke-label");
    // bookmarkSetup.classList.add("joke-label");
    // bookmarkPunchline.classList.add("joke-label");
    // newBookmarkDiv.appendChild(bookmarkCat);

const init = () => {
    fetchBookmarkCat();
    fetchLikes();
    // clickForJoke();
}

init();