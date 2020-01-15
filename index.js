const express = require("express")
const userService = require("./users")
const fs = require("fs")

const myMiddleware = (req, resp, next) =>{
    //console.log(req)
    //req.body.actualUrl = req.url
    fs.appendFileSync("log", new Date() + req.url + "\r\n")
    next()
}

const app = express() //create a new server

app.use("/images", express.static("images")) //=> makes the images folder available via HTTP

app.use(express.json()) //parse the content of the body as json object
app.use(myMiddleware)
app.use("/users", userService)

app.get("/", (request, response) => {
    console.log("hey, you hit my service!")
    response.send({
        name: "Mohammad",
        email: "whatever@strive.school"
    })
})

app.listen(3456, () => console.log("hey, the server is running on 3456"))