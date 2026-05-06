const express=require('express');
const http=require('http');
const { Server, Socket }=require('socket.io');
const mongoose=require('mongoose');
const cors=require('cors')
require('dotenv').config()

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{origin : "http://localhost:5173"}
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongo connected");
    
}).catch((err)=>{
    console.error(err);
})

io.on('connection' ,(socket)=>{
    console.log('User connected',socket.id);

    socket.on('join_room',(data)=>{
        socket.join(data);
        console.log(`User joined room: ${data}`);
        
    });

    socket.on('send_message',(data)=>{
        socket.to(data.room).emit('recieve_message',data);
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected');
        
    });
    
});


const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{{
    console.log(`Server running on port ${PORT}`);
}});