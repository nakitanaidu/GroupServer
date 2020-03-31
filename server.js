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
// CREATE ITEMS
router.post("/itemdetails", (req, res) => {
  var newuseritems = new ItemDetails();

  var data = req.body;
  console.log(">>> ", data);
  Object.assign(newuseritems, data);

  newuseritems.save().then(
    result => {
      return res.json(result);
    },
    () => {
      return res.send("problem adding new user");
    }
  );
});

// READ all useritems
router.get("/itemdetails", (req, res) => {
  ItemDetails.find()
    .populate("comments")
    .then(data => {
      res.json(data);
    });
});
// DELETE A USERSITEM - Will probably never need this
// send this endpoint the mongo _id and it ill delete the useritems
router.delete("/itemdetails/:id", (req, res) => {
  ItemDetails.deleteOne({ _id: req.params.id }).then(
    () => {
      res.json({ result: true });
    },
    () => {
      res.json({ result: false });
    }
  );
});

// CREATE NEW ITEMSDETAILS WITH OPTIONAL IMAGE UPLOAD
// image would be available at http://localhost:4000/myimage.jpg
router.post("/itemdetails", (req, res) => {
  var collectionModel = new ItemDetails();

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
// READ All ITEMDETAILS
router.get("/itemdetails", (req, res) => {
  ItemDetails.find()
    .populate("comments")
    .then(data => {
      res.json(data);
    });
});

// READ ONE ITEMDETAILS ONLY
// Need to add  useritems details and all comments to the itemdetails - use populate
// - see the itemdetails model. Also need to sort the comments to most recent first.
router.get("/itemdetails/:id", (req, res) => {
  ItemDetails.findOne({ _id: req.params.id })
    .populate("useritems")
    .populate({ path: "comments", options: { sort: { updatedAt: -1 } } })
    .then(itemdetails => {
      res.json([itemdetails]);
    });
});

// POST a comment - every new comment is tied to a itemdetails title
// itemdetails title is stored in a hidden input field inside our form
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
