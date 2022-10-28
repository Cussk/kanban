import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TasksContainer = ({socket}) => {
    const [tasks, setTasks] = useState({});

    //fetches tasks from json object on server and imports data into array
    useEffect(() => {
        function fetchTasks() {
            fetch("http://localhost:4000/api")
                .then((res) => res.json())
                .then((data) => setTasks(data));
        }
        fetchTasks();
    }, []);

    //listener for tasks event
    useEffect(() => {
        socket.on("tasks", (data) => {setTasks(data)});
    }, [socket]);

    //this function is the value of the onDragEnd prop
    const handleDragEnd = ({destination, source}) => {
        if (!destination) return; //does nothing if destination is not droppable
        if(
            destination.index === source.index &&
            destination.droppableId === source.droppableId
        ) // if source and destination index match and are droppable location sends message to node server with socketIO
            return;

        socket.emit("taskDragged", {
            source,
            destination,
        });
    };

   
    return (
        <div className='container'>
            {/* DragDropContext  */}
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Returns an array of each tasks */}
                {Object.entries(tasks).map((task) => (
                    <div
                        className={`${task[1].title.toLowerCase()}__wrapper`}
                        key={task[1].title}
                    >
                        <h3>{task[1].title} Tasks</h3>
                        <div className={`${task[1].title.toLowerCase()}__container`}>
                            {/* Droppable */}
                            <Droppable droppableId={task[1].title}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {task[1].items.map((item, index) => (
                                             //Draggable   
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {/* renders the tasks from the array */}
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`${task[1].title.toLowerCase()}__items`}
                                                    >
                                                        <p>{item.title}</p>
                                                        {/* if a comment exists link will render view comments, if no commments yet renders add comment */}
                                                        <p className='comment'>
                                                            <Link to={`/comments/${task[1].title}/${item.id}`}>
                                                                {item.comments.length > 0
                                                                    ? `View Comments`
                                                                    : "Add Comment"}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                )};
                                            </Draggable>
                                        ))};
                                        {provided.placeholder}
                                    </div>
                                )};
                            </Droppable>
                        </div>
                    </div>
                ))};
            </DragDropContext>
        </div>
    );
};

export default TasksContainer;