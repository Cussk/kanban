import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    //login event
    const handleLogin = (e) => {
        //prevents page reset
        e.preventDefault();
        // saves the username to local storage
        localStorage.setItem("userId", username);
        setUsername("");
        // redirects to the Tasks page.
        navigate("/tasks");
    };
    return (
        <div className="login__container">
            <form className="login__form" onSubmit={{handleLogin}}>
                <label htmlFor="username">Provide a username</label>
                <input 
                    type='text'
                    name='username'
                    id='username'
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={usenamer}     
                />
                <button>SIGN IN</button>
            </form>
        </div>
    );
};

export default Login;