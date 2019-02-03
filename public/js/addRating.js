var socket = io();

jQuery('#insert-rating').on('submit', function (e) {
    e.preventDefault();
  
    var movieName=jQuery('[name=movie-name]')
    var rating = jQuery('[name=rating]')

  
    socket.emit('addRating', {
      movieName:movieName.val(),
      rating: rating.val()

    }, function (err) {
        if (err) {
            alert('cant add this movie')
        }
    });
  });
  socket.on('successRating', function(message) {
    if (message) {
        alert(message)
        window.location.href = '/';
    }
  })

  socket.on('errortwo', function(err) {
      if(err){
        alert('error')  
      }
  })
// socket.on('addRating', function(message){
//     if (message) {
//         // console.log(message)
//         alert(message)
//     } else {
//         console.log('movie is added to the database')
//         alert('movie is added to the database')
//         // jQuery(<button><a href="/">go to main screen</a></button>)
//     }
// }) 