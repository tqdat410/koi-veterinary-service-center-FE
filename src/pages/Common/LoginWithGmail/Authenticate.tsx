import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/context/AuthContext";
import {jwtDecode} from "jwt-decode";
import {BASE_API} from "../../../api/baseApi"
const Authenticate: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoggedin, setIsLoggedin] = useState(false);
    useEffect(() => {
        console.log(window.location.href);
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
            const authCode = isMatch[1];
            // Fetch the token using the auth code
            fetch(`${BASE_API}/users/outbound/authentication?code=${authCode}`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((data) => {

                    const token = data.result?.token;
                    console.log("test:",token)
                    const decodedToken: any = jwtDecode(token);
                    console.log("Debug:",decodedToken)

                    localStorage.setItem("token", data.result?.token);
                    login(token); // Gọi login để cập nhật trạng thái xác thực
                    navigate("/")
                    // setIsLoggedin(true);

                    // navigate("/");
                })
                .catch((error) => {
                    console.error("Authentication failed:", error);
                    navigate("/login"); // Navigate back to login on error
                });
        }else{
            alert("Authentication canceled. Navigating to login.")
            console.log("Authentication canceled. Navigating to login.");
            navigate("/login");
            return;
        }
    }, [navigate, login]);


    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h4>Authenticating...</h4>
        </div>
    );
};

export default Authenticate;
