import devServer from "@/server/dev";
import prodServer from "@/server/prod";
import express from "express";
import {Server} from "socket.io"
import http from "http"
import { name } from "@/utils";
import UserSerivce from "@/service/usesrService";
import moment from "moment"

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app)
const io = new Server(server)
const userSerivce = new UserSerivce


// 監測連接
io.on('connection',(socket)=>{
  socket.emit("userID",socket.id)

  
  // 這邊去監聽join的socket, 可以收到從chatroom的index.js裡送來 userName和roomName的資料，
  socket.on('join',({userName,roomName}:{userName:string,roomName:string})=>{
    const userData = userSerivce.userDataInfoHandler(
      // 每個socket都會有一id
      socket.id,
      userName,
      roomName
    )

    // 透過join這個socket的function，它可以讓sokcet監控的資料分別對應到不同的方間,它等於是說把用戶加入到某一個空間的概念,這個空間就可以拿來當聊天室,詳細可參考官網
    socket.join(userData.roomName)
    userSerivce.addUser(userData);
    // 將收到的訊息，再用io.emit送回前端(chatroom的index.js)
    // 另外socket.broadcast.to()這個功能可以對應到目前使用者對應的房間
    socket.broadcast.to(userData.roomName).emit("joinToMsg",`${userName} 加入了 ${roomName} 聊天室`)
    // io.emit("joinToMsg",`${userName} 加入了 ${roomName} 聊天室`)
  })

  // 從chatroom.js的index.js送到後端的訊息,用socket.io來即時監控
  socket.on("chat",(msg)=>{
    console.log("socket get data:",msg);
    const time = moment.utc();
    const userData = userSerivce.getUser(socket.id)

    if (userData) {
      io.to(userData.roomName).emit("communication",{userData,msg,time})
    }
    // 這裡就定義一個communication的訊息,用io.emit送回前端(chatroom的index.js)
    // io.emit("communication",msg)
  })

  //這邊建立一個disconnect的socket，要用來監聽誰離開了聊天室
  socket.on("disconnect",()=>{
    // 用socket id來取user的資料
    const userData = userSerivce.getUser(socket.id)
    const userName = userData?.userName

    //如果使用者存在，就將使用者資料用io.emit送回前端(chatroom的index.js)
    if(userName){
      // io.emit("leave",`${userData.userName} 離開了聊天室`)
      socket.broadcast.to(userData.roomName).emit("leave",`${userData.userName} 離開了 ${userData.roomName} 聊天室`)
    }
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
console.log(process.env);
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

console.log("server side", name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
