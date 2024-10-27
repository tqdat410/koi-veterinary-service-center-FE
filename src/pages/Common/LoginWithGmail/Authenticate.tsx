import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/context/AuthContext";

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
            fetch(`http://localhost:8080/api/v1/users/outbound/authentication?code=${authCode}`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((data) => {
                    // if (data.result?.token) {
                    //     login(data.result.token); // Call login method from AuthContext
                    //     setIsLoggedin(true);
                    //
                    // }
                    console.log(data);

                    localStorage.setItem("token", data.result?.token);
                    setIsLoggedin(true);

                    // navigate("/");
                })
                .catch((error) => {
                    console.error("Authentication failed:", error);
                    navigate("/login"); // Navigate back to login on error
                });
        }
    }, [navigate, login]);

    useEffect(() => {
        if (isLoggedin) {
            navigate("/");
        }
    }, [isLoggedin, navigate]);
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h4>Authenticating...</h4>
        </div>
    );
};

export default Authenticate;
