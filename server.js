const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const myconn = require("./connection");

// every single collection will need a model
const ItemDetails = require("./models/itemdetails-model");
const Comment = require("./models/comments-model");

// init express, bodyparser now built in to express...
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// added to allow us to upload images to public folder
app.use(fileUpload());
app.use(express.static("public"));
// end init express

// my functions
function updateAfterFileUpload(req, res, objFromDB, fileName) {
  // form data from frontend is stored in the request body , req.body
  var data = req.body;
  Object.assign(objFromDB, data);

  objFromDB.profile_image = fileName;

  objFromDB.save().then(
    response => {
      res.json({
        result: true
      });
    },
    error => {
      res.json({
        result: false
      });
    }
  );
}
// end  my functions

// init database stuff
mongoose.connect(myconn.atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("connected", e => {
  console.log("+++ Mongoose connected ");
});

db.on("error", () => console.log("Database error"));
// end database stuff

// start of routes
const router = express.Router();
// add api to beginning of all 'router' routes
app.use("/api", router);

// CRUD
// CREATE Items
router.post("/items", (req, res) => {
  var newitems = new Items();

  var data = req.body;
  console.log(">>> ", data);
  Object.assign(newitems, data);

  newitems.save().then(
    result => {
      return res.json(result);
    },
    () => {
      return res.send("problem adding new items");
    }
  );
});

// READ all items
router.get("/items", (req, res) => {
  ItemDetails.find()
    // .populate("books")
    .then(items => {
      res.json(items);
    });
});

// DELETE A ITEM - Will probably never need this
// send this endpoint the mongo _id and it ill delete the item
router.delete("/items/:id", (req, res) => {
  ItemDetails.deleteOne({ _id: req.params.id }).then(
    () => {
      res.json({ result: true });
    },
    () => {
      res.json({ result: false });
    }
  );
});

// CREATE NEW ITEM WITH OPTIONAL IMAGE UPLOAD
// image would be available at http://localhost:4000/myimage.jpg
router.post("/items", (req, res) => {
  var collectionModel = new Books();

  if (req.files) {
    var files = Object.values(req.files);
    var uploadedFileObject = files[0];
    var uploadedFileName = uploadedFileObject.name;
    var nowTime = Date.now();
    var newFileName = `${nowTime}_${uploadedFileName}`;

    uploadedFileObject.mv(`public/${newFileName}`).then(
      params => {
        updateAfterFileUpload(req, res, collectionModel, newFileName);
      },
      params => {
        updateAfterFileUpload(req, res, collectionModel);
      }
    );
  } else {
    updateAfterFileUpload(req, res, collectionModel);
  }
});



  // POST a comment - every new comment is tied to a book title
  // book title is stored in a hidden input field inside our form
  router.post("/comments", (req, res) => {
    var newComment = new Comment();
    var data = req.body;
    Object.assign(newComment, data);
    console.log(">>> ", data);
  
    newComment.save().then(
      result => {
        return res.json(result);
      },
      () => {
        return res.send("problem adding new comment");
      }
    );
  });


//////////////////////////////////////////////////////////////////////
// THE rest of this is dealing with unhandled routes in a nice way //
router.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

app.get("/*", (req, res) => {
  res.json({ result: "invalid endpoint, please choose another" });
});

// grab a port and start listening
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
