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

    fs.writeFileSync("index.html", `<!DOCTYPE html>
    <html lang="en">
    <head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${username}'s Developer Profile</title>
    </head>
    <body style="background-color: ${ color }">
    <div class="jumbotron" style="background-color: ${ color }">`)

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
    
    fs.appendFileSync("index.html", 
    `\n<h1 style="text-align: center">${user}'s Developer Profile</h1>
    <img src="${image}" class="rounded-pill" alt="Profile Pic">
    
       
        
                
            
              <p style="text-align: center;" id="follow">Followers: ${followers} || Following: ${following}</p>
          
          <p style="text-align: center"># of Repositories: ${repos}</p>
       
        
      
          <p style="text-align: center">${bio}</p>
       

                
                <a href="${ blog}"><p style="text-align: center">Blog</p></a>
              
                    <a href="${userLocation}"><p style="text-align: center">${userLocation}</p></a>
                
                  <a href="${profile}"><p style="text-align: center">${profile}</p></a>
           
    </div>   
     
</body>
</html>`)

    const html = fs.readFileSync("index.html", "utf8")
    pdf.create(html, options).toFile("profile.pdf", (err) => {
      if (err) {
        console.log(err)
      }
      console.log("PDF created!")
    })
  })
  .catch((err) => console.error(err))
