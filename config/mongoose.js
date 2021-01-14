const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1:27017/andola_soft';
mongoose.connect(
  mongoDB,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).catch(err => {
  console.log(err)
  process.exit(1);
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
