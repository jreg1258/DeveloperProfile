const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf")
var options = { format: 'letter', 
border: {
  "top": "2in",            // default is 0, units: mm, cm, in, px
  "right": "1in",
  "bottom": "2in",
  "left": "1.5in"
}};

inquirer
  .prompt([{
    message: "Enter your GitHub username",
    name: "username"
  }])
  .then(function({ username, color }) {
    const queryUrl = `https://api.github.com/users/${ username }`
    return axios.get(queryUrl)
  })

  .then((res) => {
const profileInfo = res.data
const user = profileInfo.login 
const image = profileInfo.avatar_url
const profile = profileInfo.html_url
const repos = profileInfo.public_repos
const followers = profileInfo.followers
const starredURL = profileInfo.starred_url
const following = profileInfo.following
const bio = profileInfo.bio
const userLocation = `https://www.google.com/maps/place/${profileInfo.location}`
const blog = profileInfo.blog

fs.writeFileSync("index.html", `<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link rel="stylesheet" href="style.css">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>${user}'s Developer Profile</title>
</head>
<body>
    <h1 style="text-align: center">${user}'s Developer Profile</h1>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <p style="text-align: center; float: right;" id="follow">Followers: ${followers}</p>
            </div>
            <div class="col-md-4">
                <img src="${image}" class="rounded d-block" alt="Profile Pic">
            </div>
            <div class="col-md-4">                
                <p style="text-align: center; float: left" id="follow">Following: ${following}</p>
            </div>
        </div>

      <div class="row">
        <div class="col-md">
          <p style="text-align: center"># of Repositories: ${repos}</p>
        </div>
      </div>
        
      <div class="row">
        <div class="col-md">
          <p style="text-align: center">${bio}</p>
        </div>
      </div>

        <div class="row">
        <div class="col-md-2"></div>
                <div class="col-md">
                <a href="${ blog }"><p style="text-align: center">Blog</p></a>
                </div>
                <div class="col-md">
                    <a href="${userLocation}"><p style="text-align: center">${userLocation}</p></a>
                </div>
                <div class="col-md">
                  <a href="${profile}"><p style="text-align: center">${profile}</p></a>
            </div>
            <div class="col-md-2"></div>
        </div>
    </div>   
     
</body>
</html>`)

const html = fs.readFileSync("index.html", "utf8")
pdf.create(html, options).toFile("profile.pdf",(err, res)=> {
  if (err){
    console.log(err)
   }
   console.log(res)})
})
.catch((err) => console.error(err))
