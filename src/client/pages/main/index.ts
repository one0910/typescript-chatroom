import "./index.css";
// import { name } from "@/utils";
// console.log("client side main page", name);

const nameInput = document.querySelector('#nameInput') as HTMLInputElement
const roomSelect = document.querySelector('#roomSelect') as HTMLSelectElement
const startBtn = document.querySelector('#startBtn') as HTMLButtonElement

startBtn.addEventListener('click', function (event) {
    const userName = nameInput.value
    const roomName = roomSelect.value

    // console.log("userName_enter_chatroom",userName);
    // console.log("roomName_enter_chatroom",roomName);
    location.href = `/chatRoom/chatRoom.html?user_name=${userName}&room_name=${roomName}`
}, false);

