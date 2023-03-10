// Base URLs
const JOKE_URL = "https://v2.jokeapi.dev/joke/";
const LOCAL_URL = "http://localhost:3000/";
const USERJOKES_URL = "http://localhost:3000/userJokes/";
const LIKES_URL = "http://localhost:3000/likeCounter/1";
const USERS_URL = "http://localhost:3000/users/";

// Global Joke Display Variables
const jokeCat = document.createElement('span');
const jokeSetup = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');
const likeCounter = document.getElementById('like-counter');

// Buttons
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const categorySpan = document.querySelectorAll('.catSpan');

// Forms/Divs
const createAccountForm = document.getElementById('create-account-form');
const loginForm = document.getElementById('login-form');
const newJokeForm = document.getElementById('submit-joke');
const bookmarkDropdown = document.getElementById('joke-dropdown');

const jokeLibDiv = document.getElementById('joke-library-display');
const userInfoDiv = document.getElementById('userInfoDiv');

// Local Storage Arrays

let currentUserArr = [];
let allUsersArr = [];
let bookmarksArr = [];

// Requests On Page Load

const fetchAllUsers = () => {
    fetch(USERS_URL)
    .then((response) => response.json())
    .then((usersArr) => {
        allUsersArr.push(usersArr);
    })
}

const fetchLikes = () => {
    fetch(LIKES_URL)
    .then((response) => response.json())
    .then((data) => {
        likeCounter.textContent = data.total;
    })
    .then((error) => console.error(error))
}

// User Account Creation and Login Functions

let accountExists = false;

createAccountForm.addEventListener('submit', (event) => {
    allUsersArr[0].forEach((userObj) => {
        if(userObj.userName.includes(event.target.newUserName.value)) {
            accountExists = true;
        }
    });
    if (accountExists) {
        window.alert("Sorry, this account already exists.  Please choose a new username.");
    } else if (accountExists == false && event.target.newUserName.value.includes(" ") === false && event.target.newPassword.value.includes(" ") === false){
        const newUser = {
            userName: event.target.newUserName.value,
            password: event.target.newPassword.value,
            bookmarks: []
        }
        postNewUser(newUser);
        displayUser(newUser);
        window.alert("Account successfully created!");
        createAccountForm.reset();
        event.preventDefault();
} else if (accountExists == false && (event.target.newUserName.value.includes(" ") === true || event.target.newPassword.value.includes(" ") === true)) {
    window.alert("Please do not use spaces in your username or password.")
}
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
        currentUserArr.push(userObj);
    })
    .catch((error) => console.error(error))
}

loginForm.addEventListener('submit', (event) => {
    const userName = event.target.userName.value;
    userName.userName = event.target.userName.value;
    const userPassword = event.target.password.value;
    userPassword.password = event.target.password.value;
    verifyLogin(userName, userPassword);
    loginForm.reset();
    event.preventDefault();
})

let alerted = false;

const verifyLogin = (userName, userPassword) => {
    allUsersArr[0].forEach((userObj) => {
        if(userObj.userName == userName && userObj.password == userPassword) {
            currentUserArr.push(userObj);
            displayLoggedIn(userName);
            alerted = true;
            window.alert("Login successful!");
        } 
    });
    if (alerted == false) {
        window.alert("Failed login. Please try again.");
    }
}

// Displaying User Info Upon Successful Account Creation/Login

const displayLoggedIn = (user) => {
    userInfoDiv.innerHTML = "";
    const currentUser = document.createElement('span');
    currentUser.textContent = user;
    currentUser.id = user;
    currentUser.userName = user;
    const displayedUser = document.createElement('h3');
    displayedUser.textContent = "Welcome back to JokeBook, ";
    userInfoDiv.appendChild(displayedUser).append(currentUser);
    fetchBookmarks();
}

const displayUser = (user) => {
    userInfoDiv.innerHTML = "";
    const currentUser = document.createElement('span');
    currentUser.textContent = user.userName;
    currentUser.id = user.userName;
    currentUser.userName = user.userName;
    const displayedUser = document.createElement('h3');
    displayedUser.textContent = "Welcome to JokeBook, ";
    userInfoDiv.appendChild(displayedUser).append(currentUser);
}

// Personal User Bookmark Features

bookmarkBtn.addEventListener('click', () => {
    if (userInfoDiv.textContent.includes("Welcome") == false) {
        window.alert("Please login to bookmark jokes."); 
    } else if(jokeSetup.textContent === "") {
        window.alert("Please select a joke to display.");
    } else if(bookmarkBtn.classList.contains("clicked") === false){
        const bookmarkedJoke = {
            category: jokeCat.category,
            setup: jokeSetup.textContent,
            delivery: jokePunchline.textContent,
        }
        currentUserArr[0].bookmarks.push(bookmarkedJoke);
        bookmarksArr.push(bookmarkedJoke);
        patchCurrentUser();
        bookmarkBtn.classList.add("clicked", "fa-solid", "gold");
    } else {
        window.alert("You've already bookmarked this joke.");
    }
})

const fetchBookmarks = () => {
    fetch(USERS_URL + currentUserArr[0].id)
    .then((response) => response.json())
    .then((userObj) => {
        bookmarksArr.push(userObj.bookmarks);
    })
}

bookmarkDropdown.addEventListener('change', (event) => {
    jokeLibDiv.innerHTML = "";
    const filteredBookmarks = filterBookmarks(event.target.value, bookmarksArr[0]);
    filteredBookmarks.forEach((bookmark) => {
        displayBookmarks(bookmark);
    })
})

const filterBookmarks = (category, bookmarksArr) => {
    return bookmarksArr.filter((bookmark) => {
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

const patchCurrentUser = () => {
    fetch(USERS_URL + currentUserArr[0].id,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUserArr[0]),
    })
    .then((response) => response.json())
    .then((userObj) => {
        console.log("Success:", userObj);
    })
    .catch((error) => console.error(error))
}

// Like/Dislike Functions

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

const createNewLike = () => {
    const newLike = {
        destination: "likeCounter",
        total: likeCounter.textContent,
    }
    patchTotal(newLike);    
}

const patchTotal = (patchObj) => {
    fetch(LIKES_URL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patchObj),
    })
    // Keep getting errors, not sure why.  Code runs fine though.
    .then((response) => response.json())
    .then((counterObj) => {
        console.log("Success:", counterObj)
    })
    .then((error) => console.error(error))
}

// Functions to Display Jokes After Clicking Category Buttons

categorySpan.forEach((span) => {
    span.addEventListener('click', (event) => {
        fetchJoke(span.id);
        span.classList.remove('selected');
        setTimeout(() => {
            categorySpan.forEach((span) => {
                event.target.classList.add('selected');
            })
        }, 1)
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

const displayJoke = (data) => {
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
}

// New Joke Submission Form

newJokeForm.addEventListener('submit', (event) => {
    const userJoke = {
        name: event.target.name.value,
        category: event.target.category.value,
        setup: event.target.setup.value,
        delivery: event.target.punchline.value,
    }
    displayJoke(userJoke);
    postJoke(userJoke);
    window.alert("Joke submitted and awaiting approval!");
    newJokeForm.reset();
    event.preventDefault();
})

const postJoke = (jokeToPost) => {
    fetch(USERJOKES_URL, {
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

// Page Initialization Function

const init = () => {
    fetchLikes();
    fetchAllUsers();
}

init();