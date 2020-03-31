let dbname = "clothing_data";
let username = "Cruz123";
let password = "Clothesrcool";

exports.atlas = `mongodb+srv://${username}:${password}@mycluster-vmu7y.mongodb.net/${dbname}?retryWrites=true&w=majority`;
// exports.atlas = `mongodb+srv://<username>:<password>@mycluster-vmu7y.mongodb.net/test?retryWrites=true&w=majority`