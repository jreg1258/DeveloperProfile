const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

inquirer
  .prompt([{
    message: "Enter your GitHub username",
    name: "username"
  }])
  .then(function({ username, color }) {
    const queryUrl = `https://api.github.com/search/users?q=${ username }`
    return axios.get(queryUrl)
  })

  .then((res) => {
    const profileInfo = new Array(res.data.items[0])
    
const user = profileInfo.map(({ login }) => login)
console.log(user)
    })
.catch((err) => console.error(err))
