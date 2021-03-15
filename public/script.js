

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
let myVideoStream
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream  
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

let text = $('input')

$('html').keydown((e)=>{
    //on enter press
    if(e.which == 13 && text.val().length!=0){
        console.log(text.val())
        socket.emit('message',text.val());
        text.val('');
    }
})

socket.on('createMessage',message =>{
    $('.messages').append(`<li class="message"><b>user</b><br>${message}</li>`)
    scrollToBottom();
})

const scrollToBottom = ()=>{
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = ()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        setUnmuteButton();
        myVideoStream.getAudioTracks()[0].enabled =false;
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled =true;
    }
}

const setMuteButton =()=>{
    const html =`
    <i class ="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton =()=>{
    const html =`
    <i class ="fas fa-microphone-slash"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}



const playStop = ()=>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled =false;
    }
    else{
        setStartButton();
        myVideoStream.getVideoTracks()[0].enabled =true;
    }
}

const setStartButton =()=>{
    const html =`
    <i class ="fas fa-video"></i>
    <span>Video ON</span>
    `
    document.querySelector('.main_stop_button').innerHTML = html;
}

const setStopButton =()=>{
    const html =`
    <i class ="fas fa-video-slash"></i>
    <span>Video Off</span></span>
    `
    document.querySelector('.main_stop_button').innerHTML = html;
}