//express boiler plate
const express = require("express");
const app = express();
//hardcodes port to 4000
const PORT = 4000;

//imports http and cors library aloowing data transfer between client and server
const http = require("http").Server(app);
const cors = require("cors");

//imports Socket.io to create real-time connection
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

//middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//connects to react app, creates unique ID for each socket
socketIO.on('connection', (socket) => {
    //logs ID whenever user visits the page
    console.log(`⚡: ${socket.id} user just connected!`);

    //listens for create task event
    socket.on("createTask", (data) => {
        //constructs object accodrding to data structure
        const newTask = {id: fetchID(), title: data.task, comments: []};
        //adds task to pending category
        tasks["pending"].items.push(newTask);
        //sends task event for update
        socket.emit("tasks", tasks);
    });
    
    //listens for drag event
    socket.on("taskDragged", (data) => {
        //gets the item that was dragged
    const itemMoved = {
        ...tasks[source.droppableId].items[source.index],
    };
    console.log("DraggedItems>>>", itemMoved);

    //removes item from its source
    tasks[source.droppableId].items.splice(source.index, 1);

    //add item to destination using destination index
    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

    //sends updated tasks object to React app
    socket.emit("tasks", tasks);
    });

    //listens for comment creation event
    socket.on("addComment", (data) => {
        const {category, userId, comment, id} = data;
        //gets item in task's category
        const taskItems = tasks[category].items;
        //loops through the list of items to find matching id
        for (let i = 0; i<taskItems.length; i++) {
            if (taskItems[i].id === id) {
                //then adds the comment to the list of comments under the item (task)
                taskItems[i].comments.push({
                    name: userId,
                    text: comment,
                    id: fetchID(),
                });
                //sends new event to React app
                socket.emit("comments", taskItems[i].comments);
            };
        };
    });

    //listens for fetch comments event and returns list of comments to app
    socket.on("fetchComments", (data) => {
        const { category, id } = data;
        const taskItems = tasks[category].items;
        for (let i = 0; i < taskItems.length; i++) {
            if (taskItems[i].id === id) {
                socket.emit("comments", taskItems[i].comments);
            };
        };
    });

    //disconnects socket on refreshe or close of website
    socket.on('disconnect', () => {
            socket.disconnect()
    // logs disconnection
      console.log('🔥: A user disconnected');
    });
});

//generates random number
const fetchID = () => Math.random().toString(36).substring(2,10);

//nested object for task data structure
let tasks = {
    pending: {
        title: [
            {
                id: fetchID(),
                title: "Send the Figma file to Dima",
                comments: [],
            },
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: fetchID(),
                title: "Review GitHub issues",
                comments: [
                    {
                        name: "David",
                        text: "Ensure you review before merging",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
    completed: {
        title:"completed",
        items: [
            {
                id: fetchID(),
                title: "Create technical contents",
                comments: [
                    {
                        name: "Dima",
                        text: "Make sure you check the requirements",
                        id: fetchID(),  
                    },
                ],
            },
        ],
    },
};

//returns json object when visiting app
app.get("/api", (req, res) => {
    //hosts the tasks
    res.json(tasks);
});

//console logs which port is being accessed
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});