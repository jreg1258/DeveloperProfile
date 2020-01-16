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
    console.log(profileInfo)

const user = profileInfo.map(({ login }) => login)
const image = profileInfo.map(({ avatar_url }) => avatar_url)
const profile= profileInfo.map(({ html_url }) => html_url)
const user = profileInfo.map(({ login }) => login)

console.log(user)
    })
.catch((err) => console.error(err))
