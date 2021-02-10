const socket = io();


socket.on('connect', function () {
  console.log('connected!!');
});


socket.on('activeUser', function(user){
  addActive(user.fullName);
});

function addActive(username){
  const element = "<li class="nav-item">"+ username+ "</li>"
  $(".flex-column").innerHTML += element;
  }


$(".button").click(function(event){
    event.preventDefault();
});
