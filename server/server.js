require('./config/config');

const path = require ('path');
const http = require('http');
// const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
//const {ObjectID} = require('mongodb');
const socketIO = require('socket.io');

var {mongoose} = require('./db/mongoose');
var {Movie} = require('./models/movies');

var app = express();
var server = http.createServer(app);
const port = process.env.PORT;
// const port =3000;
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public')

app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on('connection', (socket) => { 
  socket.on('newMovie', (movie, callback) => {
    // var user = users.getUser(socket.id);

    // if (user && isRealString(message.text)){
    //   io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
    // }
    // console.log(message,text)

    Movie.findOne({name:movie.movieName}).then((movieExist) =>{
      if(movieExist) {
        return callback('this movie is currently on the collection')
      }
      var year = parseInt(movie.year)
      if (year<1900||year>2020){
        return callback('wrong year. please try again between 1900-2020')
      }
      var newMovie = new Movie({
        name: movie.movieName,
        genre: movie.genre,
        year: year,
      });
      
      newMovie.save().then((doc) => {
        io.emit('updateMovieList', undefined);
      }, (e) => {
        io.emit('errorone', e);
      });
    })
     // callback();
  });
  socket.on('addRating', (movie, callback) => {
    var body = movie
     Movie.findOne({name:movie.movieName}).then((movieExist) =>{
      if(movieExist) {
        body.votes = movieExist.votes+1;
        if(body.rating===''){
          return callback('you have to add rating')
        }
        var rating =parseFloat(body.rating)
        if (rating>10 || rating <0){
          return callback('invalid rating please enter rating between 0-10')
        }
        body.rating = (rating+movieExist.rating*movieExist.votes)/body.votes
        Movie.findOneAndUpdate({name:body.movieName},{$set: body}, {new: true}).then(movieExist => {
          io.emit('successRating',body.rating)
        })
      } else {
        return callback('no movie in this name on the database')
      }
    }).catch((e)=>{
      io.emit('errortwo', e);
    })
  })
  socket.on('search',(movie, callback)=>{
    // var data = req.params.data;
    // var arrayData = data.split(',')
    var yearStart = parseInt(movie.yearStart)
    var yearEnd = parseInt(movie.yearEnd)
    if(yearStart<1900||yearStart>2020||yearEnd<1900||yearEnd>2020){
      return callback('the years for search must be between 1900-2020')
    }
    Movie.find({
      genre:movie.genre, 
      year:{ $gte: yearStart, $lte: yearEnd }
    }).then((movies)=>{
      if(movies.length>0){
        io.emit('searchList',movies)
      }else {
        return callback('didnt find movies');
      }
      
    }).catch((e)=>{
      io.emit('errorthree', e);
    })
  })

})


// app.get('/movies/:data', (req,res) => {
//   // var send =false;
//   var data = req.params.data;
//   var arrayData = data.split(',')
//   Movie.find({genre:arrayData[0], year:{ $gt: arrayData[1], $lt: arrayData[2]}}).then(movies=>{
//     if(movies=[]){
//       return res.status(404).send('didnt find movies');
//     }
//     res.send(movies)
//   }).catch(e=>{
//     res.status(400).send(e);
//   })
// })
  // if (!ObjectID.isValid(id)){
  //   res.status(404).send();
  // }
  // Todo.findOne({
  //   _id:id,
  //   _creator:req.user._id
  // }).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send();
  //   }
  //   res.status(200).send({todo})
  // }).catch((e) => res.status(400).send());


server.listen(port, () => {
    console.log(`Started on port ${port}`);
})
