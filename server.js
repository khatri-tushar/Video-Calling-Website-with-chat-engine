const express = require('express');
const app = express();
const server = require('http').Server(app);
//uuid
const { v4: uuidv4 } = require('uuid');

const io = require('socket.io')(server);


app.use(express.static('public'));
app.set('view engine', 'ejs');



app.get('/', function(req,res){
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})


io.on('connection', socket => {
    socket.on('join-room', (roomId,userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        
        //for messages
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })
    });
});

server.listen(3000)
