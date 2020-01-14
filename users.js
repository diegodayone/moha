const express = require("express")
const PDFDocument = require('pdfkit');
const fs = require("fs")

const router = express.Router()

router.get("/", (req, res) => { //get the whole students
    res.send( req.query)
})


router.post("/", (req, res) => { //creating a new element in the list
    res.send(req.body)
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

router.get("/:id", (req, res) => { //get the details of a single student
    res.send("The id params has the value of " + req.params.id + req.params.name)
})



module.exports = router;