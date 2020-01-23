const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf")
var options = {
  format: "a3",
  orientation: "landscape"
};

inquirer
  .prompt([{
    message: "Enter your GitHub username",
    name: "username"
  },{
    message: "Enter your favorite color",
    name: "color"
  }])
  .then(function ({ username, color }) {
    const queryUrl = `https://api.github.com/users/${username}`

    fs.writeFileSync("index.html", 
    `<!DOCTYPE html>
    <html lang="en" style="background-color: ${ color }">
    <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Lobster&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${username}'s Developer Profile</title>
    <style>
    #follow {
    padding-top: 20px;
    }
    
img { 
        margin: auto;
        display: block;
    }

a {
    display: block;
    margin: auto;
}

.jumbotron {
    text-align: center;
    width: 800px;
    margin: auto;
}

body,html,.jumbotron {
    height: auto;
}
</style>
    </head>
    <body style="background-color: ${ color }">
    <div class="jumbotron jumbotron-fluid" style="background-color: ${ color }">`)

    return axios.get(queryUrl)
  })

  .then((res) => {
    const profileInfo = res.data
    const user = profileInfo.login
    const image = profileInfo.avatar_url
    const profile = profileInfo.html_url
    const repos = profileInfo.public_repos
    const followers = profileInfo.followers
    let starredURL = profileInfo.starred_url
    const following = profileInfo.following
    const bio = profileInfo.bio
    const userLocation = `https://www.google.com/maps/place/${profileInfo.location}`
    const blog = profileInfo.blog
    
    starredURL = starredURL.substring(0, starredURL.length-15)
    fs.appendFileSync("index.html", 
`\n<h1>${user}'s Developer Profile</h1>
<img src="${image}" class="rounded-pill" alt="Profile Pic">
<br>
<br>         
<h2 class="text-wrap" id="follow" style="font-family: 'Lobster', cursive;">${bio}</h2>
<h4>Followers: ${followers} || Following: ${following}</h4>
<h3># of Repositories: ${repos}</h3>   
<br>
<br>
<br>
</div>
<footer> <div class="container-fluid">
<div class="row">
<div class="col-sm">
<a href="${ blog}"><h4 style="text-align: center;">Blog<h4></a>
</div>
<div class="col-sm">
<a href="${profile}"><h4 style="text-align: center;">GitHub Profile</h4></a>
</div>
<div class="col-sm">
<a href="${userLocation}"><h4 style="text-align: center;">Current City</h4></a>
</div>`)

return axios.get(starredURL)
})
.then((res) => {
  const starred = res.data.length 
  fs.appendFileSync("index.html", 
  `\n<br>
  </div>
  <div class="row">
  <div class="col-sm">
  <h3 style="text-align: center;">Starred Repos: ${ starred }</h3>  
  </div>
  </div>
  </div>
  </footer>   
  </body>
  </html>`)
    const html = fs.readFileSync("index.html", "utf8")
    const donePDF = pdf.create(html, options).toFile("./profile.pdf", (err) => {
      if (err) {
        console.log(err)
      }
      console.log("PDF created!")
    })
    return fs.writeFileSync("./profile.pdf", donePDF)
})
  .catch((err) => console.error(err))

  