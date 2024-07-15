const users = []

const addUser = ({ id, name, room }) => {
    if(name) name = name.trim().toLowerCase();
    if(room) room = room.trim().toLowerCase()

    const existingUser = users.find((user) => {
       return user.room == room && user.name == name
    })

    if (existingUser) {
        return { error: "User Already exist" }
    }

    const user = { id, name, room }

    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
       return user.id == id
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);


const getUsersInRoom = ((room)=>{
    users.filter((user)=>{
      return  user.room === room
    })
})


export  {
    addUser, removeUser,
    getUser, getUsersInRoom
};