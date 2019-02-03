var socket = io();

jQuery('#insert-movie').on('submit', function (e) {
    e.preventDefault();
  
    var movieName=jQuery('[name=movie]')
    var genre = jQuery('[name=genre]')
    var year = jQuery('[name=year]')

        // console.log(movieName.val());
        // console.log(genre.val());
        // console.log(year.val())
  
    socket.emit('newMovie', {
      movieName:movieName.val(),
      genre:genre.val(),
      year:year.val()

    }, function (err) {
        if (err) {
            alert(err)
        }
 
    });
  });
socket.on('updateMovieList', function(message){
    if (!message) {
        // console.log('movie is added to the database')
        alert('movie is added to the database')
        // jQuery(<button><a href="/">go to main screen</a></button>)
        window.location.href = '/';
    }
}) 
socket.on('errorone', function(err) {
    if(err){
      alert('error')  
    }
})