import "./index.css";
import {io} from "socket.io-client"
import { UserData } from "@/service/usesrService";
// console.log("client side chatroom page", name);
type UserMsg = {userData:UserData, msg:string, time:number}
const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')

if (!userName || !roomName) {
    location.href = `/main/main.html`
}
// console.log("userName_from_main",userName);
// console.log("roomName_from_main",roomName);

// 建立連接server -> node server
const clientIo = io()

// 前端這裡建立一個名為join的socket event,將"userName和roomName"的資料可以謁server端監控這個socket
clientIo.emit("join",{userName,roomName})

const textInput = document.querySelector('#textInput') as HTMLInputElement
const submitBtn = document.querySelector('#submitBtn') as HTMLButtonElement
const chatdBoard = document.querySelector('#chatdBoard') as HTMLDivElement
const headerRoomName = document.querySelector('#headerRoomName') as HTMLParagraphElement
const backBtn = document.querySelector('#backBtn') as HTMLButtonElement

headerRoomName.innerHTML = roomName || "-"

let userID = ""

// 前端這裡寫一段函式來將socket.io送來的訊息,畫到web前端上
function msgHandler(data:UserMsg) {
const date = new Date(data.time)
const time = `${date.getHours()}:${date.getMinutes()}`
const divBox = document.createElement('div')
divBox.classList.add('flex',"mb-4","items-end")
if (data.userData.id === userID) {
    divBox.classList.add("justify-end")
    divBox.innerHTML = `
    <p class="text-xs text-gray-700 mr-4">${time}</p>
    <div>
          <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
            <p
                class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
            >
                ${data.msg}
            </p>
        </div>
        `
}else{
    divBox.classList.add("justify-start")
    divBox.innerHTML = `
        <div>
            <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
            <p
            class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
            >
            ${data.msg}
            </p>
        </div>

        <p class="text-xs text-gray-700 ml-4">${time}</p>
    `
}
    chatdBoard.appendChild(divBox)

    // 每輸入完訊息後, 清空輸入框訊息並且聊天室會移到最下方
    textInput.value = ""
    chatdBoard.scrollTop = chatdBoard.scrollHeight
}


// 將"xxx加入聊天室"這樣的訊息,畫到web前端上
function roomMsgHandler(msg:string) {
    const divBox = document.createElement('div')
    divBox.classList.add('flex',"justify-center","mb-4","items-center")
    divBox.innerHTML= `
        <p class="text-gray-700 text-sm">${msg}</p>
    `
    chatdBoard.append(divBox)
    chatdBoard.scrollTop = chatdBoard.scrollHeight
}

submitBtn.addEventListener('click', function (event) {
    const textValue = textInput.value
    // console.log(textValue);
    // 這邊這個chat可以隨意命名，它的概念跟event很像，主要就是建立一個socket名稱,讓後端server用這名稱來監控訊息
    clientIo.emit("chat",textValue)
}, false);

backBtn.addEventListener('click', function (event) {
    location.href = "/main/main.html"
}, false);

// 從server端的index.ts這支檔案送來的"xxx加入聊天室的訊息"
clientIo.on('joinToMsg',(msg)=>{
    console.log('joinToMsg',msg);
    roomMsgHandler(msg)
})

// 從server端的index.ts這支檔案送來聊天室的訊息
clientIo.on("communication",(data:UserMsg)=>{
    // console.log("data_from_sokect_io",data);
    msgHandler(data)
})


// 從server端的index.ts這支檔案送來使用者名稱，主要可以讓聊天室顯示誰職開了
clientIo.on("leave",(msg)=>{
    roomMsgHandler(msg)
})

clientIo.on("userID",(id)=>{
    userID = id
})



