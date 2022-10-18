import React, { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = socketIO.connect("http://localhost:4000"); //connects socketio to react localhost

const Comments = () => {
    const {category, id} = useParams();
    //creates staeful comment
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    //fetches comments on page load
    useEffect(() => {
        socket.emit("fetchComments", {category, id});
    }, [category, id]);

    //listens to comment event
    useEffect(() => {
        socket.on("comments", (data) => setCommentList(data));
    },[]);

    //sends comment, task category, item id, and userID to server
    const addComment = (e) => {
        e.preventDefault();
        socket.emit("addComment", {
            comment,
            id,
            userId: localStorage.getItem("userId"),
        });
        setComment("");
    };

    return (
        <div className='comments__container'>
            <form className='comment__form' onSubmit={addComment}>
                <label htmlFor='comment'>Add a comment</label>
                <textarea
                    placeholder='Type your comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    id='comment'
                    name='comment'
                    required
                ></textarea>
                <button className='commentBtn'>ADD COMMENT</button>
            </form>

            {/* displays all available comments */}
            <div className='comments__section'>
                <h2>Existing Comments</h2>
                {commentList.map((comment) => (
                    <div key={comment.id}>
                        <p>
                            <span style={{fontWeight: "bold"}}>{comment.text}</span>
                            {comment.name}
                        </p>
                    </div>
                ))};
            </div>
        </div>
    );
};

export default Comments;