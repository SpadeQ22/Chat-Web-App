const socket = io();


function addActive(userId, username){
  console.log(username)
  const element = `<li class='nav-item B${userId}'><a class='nav-link'>${username}</a></li>`
  document.querySelector(".activeUsers").innerHTML += element;
  }

function connected(){
  console.log("connected");
  socketID = document.querySelector(".button").getAttribute("value");
  socket.emit("activeUser", socketID);
}

const addToUsersBox = (user) => {
  if (document.querySelector(`.B${user._id}`)) {
    return;
  } else {
    addActive(user._id, user.fullName);
  }
};

const msgbox = (name, body)=>{
  const element = `<div class="message-recieved">
  <p><strong>${name}</strong></h>
  <p>${body}</p></div>`;
  document.querySelector(".scroll").innerHTML+=element;
}

const myMsg = (name, body) =>{
  const element= `<div class="msg-sent ml-auto">
  <p><strong>${name}</strong></h>
  <p>${body}</p></div>`;
  document.querySelector(".scroll").innerHTML += element;
}

socket.on("connect", function(){
  connected();

});

socket.on('activeUser', function (users) {
  users.map((user)=>addToUsersBox(user));
});

socket.on("user disconnect", function(data){
  document.querySelector(`.B${data}`).remove();
});


socket.on("publicMessage", function(msg, name){
  msgbox(name, msg.body);
});

var message= "";

$(".message").on("change" ,function(event){
  message = $(this).val();
});

$(".button").click(function(event){
    const userId = event.target.value;
    const msg = {
      userId: userId,
      body: message
    };
    if(msg.body != null){
      const name = document.querySelector(".active").innerHTML;
      myMsg(name, msg.body);
      socket.emit("publicMessage", msg);
      event.preventDefault();
    }

});
