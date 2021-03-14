
const express = require('express');
const socket = require('socket.io');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
//uuid 
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');


app.get('/', function(req,res){
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room}) 
})


io.on('connection', socket => {
    
    socket.on('join-room', (roomId) => { 
        socket.join(roomId);
        io.to(roomId).emit('user-connected')
    }); // listen to the event
  });


server.listen(3030); 

