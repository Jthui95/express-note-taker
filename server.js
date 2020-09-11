var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT ||1000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  
fs.readFile("./db/db.json", "utf8", function (err,data){
    if (err) { 
    throw (err);
    }
    var notes = JSON.parse(data);

    function updateNotes() {
      fs.writeFile("./db/db.json", JSON.stringify(notes,"\t"), function(error) {
          if (error) { 
               throw error;
          }
          return true;
      });
    }

    //API ROUTES
    // Populate the left column
    app.get("/api/notes", function(req,res) {
        res.json(notes);
    });
  
  
    // sets up post route
    app.post("/api/notes", function (req,res) {
        let newNote = req.body;
        notes.push(newNote);
        res.json(newNote);
        updateNotes();
        return console.log("Added new note: " +newNote.title);
      });

      // deletes a note with a specific id
     
     app.delete("/api/notes/:id", function(req, res){
    //splice function returns removed item
    notes.splice(req.params.id,1);
    var chosen = req.params.id;
    console.log(chosen);
    for (var i = 0; i < notes.length; i++) {
      if (chosen === notes[i].routeName) {
        console.log("Deleted note" + notes[i].title);
        return res.json(notes[i]);
      }
    }
    return res.json(false);
 
  });
    
    // retrieves notes via id
    app.get("/api/notes/:id", function(req,res) {
      res.json(notes(req.params.id));
    });
  

// view routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
  
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });
  
  
});
