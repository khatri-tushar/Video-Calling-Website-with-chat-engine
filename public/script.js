const socket = io('/')

var video = document.getElementById('video');
// Get access to the camera!


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
    }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

socket.emit('join-room', ROOM_ID);
socket.on('user-connected',()=>{
    connectToNewUser();
})

const connectToNewUser = ()=>{
    console.log("new user")
}
 