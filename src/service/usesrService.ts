// *******************************************************************************
// 這支檔案主要用來記錄目前有哪些用戶或使用者，使用者在哪些房間，使用者的相關資訊(如id、使用者名稱...等)
// *******************************************************************************


export type UserData = {
    id:string
    userName:string
    roomName:string
}

export default class UserSerivce {
    // 記錄使用者的資訊
    private userMap: Map <string,UserData>
    
    constructor(){
        this.userMap = new Map()
    };

    addUser(data:UserData){
        this.userMap.set(data.id, data)
    }

    removeUser(id:string){
        if (this.userMap.has(id)) {
            this.userMap.delete(id)
        }
    }
    
    getUser(id:string){
        if (this.userMap.has(id)) {
            return this.userMap.get(id)
        }
        return null

        // 第二種寫法
        // if(!this.userMap.has(id)) return null
    }

    userDataInfoHandler(id:string,userName:string,roomName:string){
        return{
            id,
            userName,
            roomName
        }
    }
}