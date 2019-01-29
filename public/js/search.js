var socket = io();

jQuery('#searchfor').on('submit', function (e) {
    e.preventDefault();
  
    var genre = jQuery('[name=genreName]')
    var yearStart = jQuery('[name=yearStart]')
    var yearEnd = jQuery('[name=yearEnd]')

  
    socket.emit('search', {
      genre:genre.val(),
      yearStart:yearStart.val(),
      yearEnd:yearEnd.val()
    },  function (err) {
      if (err) {
          alert(err)
      }
    });
  });

socket.on('searchList', function (movies) {
    var ol = jQuery('<ol></ol>');
  
    movies.forEach(function (movie) {
      ol.append(jQuery('<li></li>').text(`${movie.name}:, rating:${movie.rating}`));
    });

    jQuery('#moviessearch').html(ol);
  });

  socket.on('errorthree', function(err) {
    if(err){
      alert('error')  
    }
})