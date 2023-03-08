# phase-1-code-challenge
// Checklist/Outline

Create Basic HTML Structure - COMPLETE
Fill it in with Divs/Forms/Title/etc - COMPLETE
Little CSS
Fetch JavaScript Data and Render On Page (randomly) - COMPLETE (for two liners)
Add Buttons to Render New Joke - COMPLETE (for two liners)
Add Function to Hide Punch Line for Two Liners
Reveal Punchline Button/Hover/whatever - COMPLETE
Add Upvote/DownVote Buttons - COMPLETE
Add Bookmark Button - COMPLETE
Add Joke Submission Form - COMPLETE (for two liners)
    -Name
    -Setup
    -Punchline
        -Note: Either the Setup or the Punchline will need to be optional in case of one liner joke
    -Category
Joke Request Form
    -Dropdown Selections for Categories
    -Or a Checklist
    -?






Maybe a Dark/Light Mode Toggle Event Listener?

Add Font Awesome Icons for Buttons, etc

For Reference:  These Functions have been consolidated into one function, "postJoke"
// const postBookmarkedJoke = (bookmarkedJokePost) => {
//     fetch(LOCAL_URL + "bookmarkedJoke", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookmarkedJokePost),
//     })
//     .then((response) => response.json())
//     .then((bookmarkedJokePost) => {
//         console.log("Success:", bookmarkedJokePost);
//     })
//     .catch((error) => console.error(error))
// }

// const postUserJoke = (userJokePost) => {
//     fetch(LOCAL_URL + "userJoke", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userJokePost),
//     })
//     .then((response) => response.json())
//     .then((userJokePost) => {
//         console.log("Success:", userJokePost);
//     })
//     .catch((error) => console.error(error))
// }