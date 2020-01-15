const express = require("express")
const PDFDocument = require('pdfkit');
const fs = require("fs")
const multer = require("multer")
const path = require("path")
const { check, validationResult } = require("express-validator")

const router = express.Router()

const loadUsers = () => {
    const buffer = fs.readFileSync("users.json")
    const bufferIntoString = buffer.toString()
    const users = JSON.parse(bufferIntoString)
    return users;
}

router.get("/", (req, res) => { //get the whole students
    const users = loadUsers()
    res.send(users)
})

router.post("/", 
    [check("name").isLength({ min: 2 }).withMessage("The name should have at least 2 chars"),
     check("email").isEmail().withMessage("Please insert a valid email")]
     , (req, res) => { //creating a new element in the list
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const users = loadUsers();
    users.push(req.body);
    fs.writeFileSync("users.json", JSON.stringify(users))
    res.send(req.body)
})

const multerConfig = multer({})

router.post("/:email", multerConfig.single("bob"), (req,res)=>{
    const users = loadUsers();
    const user = users.find(u => u.email === req.params.email)
    if (user)
    {
        const fileSavedIn = path.join(__dirname, "./images", req.file.originalname) //=> /images/filename
        fs.writeFileSync(fileSavedIn , req.file.buffer) //write the picture in /images/filename

        user.image = "http://localhost:3456/images/" + req.file.originalname
        fs.writeFileSync("users.json", JSON.stringify(users))
        res.send(user)
    }
       
    else
        res.status(404).send("User not found!")
    res.send("test")
})

router.get("/pdf", (req,res)=>{
    // Create a document
    const doc = new PDFDocument;

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream('output.pdf'));

    // Add another page
    doc.addPage()
    .fontSize(25)
    .text('Here is some vector TEST LIVE...', 100, 100);

    // Draw a triangle
    doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill("#FF3300");

    // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    doc.scale(0.6)
    .translate(470, -380)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();

    // Add some text with annotations
    doc.addPage()
    .fillColor("blue")
    .text('Here is a link!', 100, 100)
    .underline(100, 100, 160, 27, {color: "#0000FF"})
    .link(100, 100, 160, 27, 'http://google.com/');

    // Finalize PDF file
    doc.end();
    res.download("./output.pdf")
})

router.get("/:email", (req, res) => { //get the details of a single student
    const users = loadUsers()
    const user = users.find(u => u.email === req.params.email)
    if (user)
        res.send(user)
    else
        res.status(404).send("User not found!")
})

router.put("/:email", (req,res)=>{
    const users = loadUsers()
    const user = users.find(u => u.email === req.params.email)
    if (user){
        user.name = req.body.name
        fs.writeFileSync("users.json", JSON.stringify(users))
        res.send(user)
    }
      
    else
        res.status(404).send("User not found!")
})

router.delete("/:email", (req,res)=>{
    const users = loadUsers()
    const toKeep = users.filter(u => u.email !== req.params.email)
    if (toKeep.length === users.length)
        res.status(404).send("Not found")
    else     {
        fs.writeFileSync("users.json", JSON.stringify(toKeep))
        res.send("DELETED")
    }
})



module.exports = router;