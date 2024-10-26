import React, {useState} from "react";
import backgroundImage from "../../assets/images/background.jpg";
import Navbar from "../../components/layout/Navbar";
import {register} from "../../api/authService";
import "../../styles/LoginRegister.css";
import {useNavigate} from "react-router-dom";
export default function RegisterPage(){
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");
    const[email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();
    //cac bien bao loi
    const[errorTenDangNhap, setErrorTenDangNhap] = useState("");
    const[errorEmail, setErrorEmail] = useState("");
    const[errorMatKhau, setErrorMatKhau] = useState("");
    const[errorMatKhauNhapLai, setErrorMatKhauNhapLai] = useState("");
    const [errorFirstname, setErrorFirstname] = useState("");
    const [errorLastname, setErrorLastname] = useState("");

    //Xu Ly thong tin
    const handleSubmit = async (e: React.FormEvent) =>{
        //Clear any previous error message
        setErrorTenDangNhap("");
        setErrorEmail("");
        setErrorMatKhau("");
        setErrorMatKhauNhapLai("");
        setErrorFirstname("");
        setErrorLastname("");
        //Avoid spam click
        e.preventDefault();
        //Avoid null
        const isFirstnameValid = firstName.trim() !== "";
        const isLastnameValid = lastName.trim() !== "";
        const isUsernameValid = username.trim() !== "" && !username.includes(" ");
        const isEmailValid = validateEmail(email);

        if (!isUsernameValid) setErrorTenDangNhap("Username is required and cannot contain spaces!");
        if (!isFirstnameValid) setErrorFirstname("First name is required!");
        if (!isLastnameValid) setErrorLastname("Last name is required!");
        if (!isEmailValid) setErrorEmail("Invalid format or contain spaces!");
        //Kiem tra cac dieu kien va gan ket qua vao bien
        // const isTenDangNhapValid = !await kiemTraTenDangNhapDaTonTai(username);
        // const isEmailAvailable = !await kiemTraEmailDaTonTai(email);
        const isPasswordValid = !kiemMatKhau(password);
        const isConfirmPasswordValid = !kiemMatKhauNhapLai(confirmPassword);

        if (isFirstnameValid && isLastnameValid && isEmailValid &&isUsernameValid && isPasswordValid && isConfirmPasswordValid ) {
            try {
                // Call the register API with the form data
                await register(
                    username,
                    email,
                    password,
                    firstName,
                    lastName
                );

                // Success message
                alert("Sign up successful!");

                // Clear form fields
                setFirstName("");
                setLastName("");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                navigate('/login');
            } catch (error: any) { // Use any type for the error
                if (error instanceof Error) {
                    const errorMessage = error.message;

                    // Set specific error messages based on the API response
                    if (errorMessage.includes("Username is existed")) {
                        setErrorTenDangNhap("Username already exists!");
                    } else if (errorMessage.includes("Email is already")) {
                        setErrorEmail("Email already exists!");
                    } else {
                        alert(`Đăng ký thất bại: ${errorMessage}`);
                    }
                } else {
                    alert('Đăng ký thất bại. Vui lòng thử lại.');
                }
            }
        }

    }
// //Kiem Tra Ten Dang Nhap///////////////////////////////////////////////////////////////////////////////////////////
//     const kiemTraTenDangNhapDaTonTai = async (username: string) =>{
//         const url = 'https://66e10816c831c8811b538fae.mockapi.io/api/login';
//         console.log(url);
//
//         try {
//             const response = await fetch(url);
//             const data = await response.json();  // Parse response as JSON
//
//             // Check if any user in the data array has the same username
//             const userExists = data.some((user: any) => user.username === username);
//
//             if (userExists) {
//                 setErrorTenDangNhap("Username already exists!");
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             console.error("Loi khi kiem tra ten dang nhap:", error);
//             return false;
//         }
//     }


    const validateUsername = (username: string) => {
        const usernameRegex = /^[A-Za-z0-9]+$/; // Only allows English alphabet characters
        if (!usernameRegex.test(username)){
            return false;
        }
        return true;

    }

    const handleTenDangNhapChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //Thay doi gia tri
        const value = e.target.value;
        setUsername(value);

        if (value.trim() === "") {
            setErrorTenDangNhap(""); // Không hiển thị lỗi nếu ô trống
        }
        else if (value.includes(" ")) {
            setErrorTenDangNhap("Username cannot contain spaces!");
        } else if (!validateUsername(value)) {
            setErrorTenDangNhap("Username must be only English alphabet characters!");
        } else {
            setErrorTenDangNhap("");
            // return kiemTraTenDangNhapDaTonTai(value);
        }
    }
    //Kiem Tra Format Email//////////////////////////////////////////////////////////////////////////////////////////
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.includes(" ")) {
            return false;
        }
        return true;
    }


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //Thay doi gia tri
        setEmail(e.target.value);
        setErrorEmail("");
        // return kiemTraEmailDaTonTai(e.target.value);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Kiem Tra Mat Khau///////////////////////////////////////////////////////////////////////////////////////////
    const kiemMatKhau = (password: string) =>{
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        // Check for whitespace in the password
        if (/\s/.test(password)) {
            setErrorMatKhau("Password must not contain spaces!");
            return true; // Indicates an error
        }

        // Check if the password meets the regex criteria
        if (!passwordRegex.test(password)) {
            setErrorMatKhau("Password must be at least 8 chars with a special char!");
            return true; // Indicates an error
        } else {
            setErrorMatKhau(""); // Password is valid
            return false; // No errors
        }
    }

    const handleMatKhauChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //Thay doi gia tri
        setPassword(e.target.value);
        if (e.target.value.length > 0) {
            kiemMatKhau(e.target.value);
        } else {
            setErrorMatKhau(""); // Không hiển thị lỗi nếu chưa nhập
        }

    }
///////////////////////////////////////////////////////////////////////////////////////////////////////

    //Kiem Tra Mat Khau Nhap Lai///////////////////////////////////////////////////////////////////////////////////////////
    const kiemMatKhauNhapLai = (confirmPassword: string) =>{
        if(confirmPassword !== password){
            setErrorMatKhauNhapLai("Passwords do not match!");
            return true;
        }
        setErrorMatKhauNhapLai("");// mat khau trung khop
        return  false;
    }

    const handleMatKhauNhapLaiChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        //Thay doi gia tri
        setConfirmPassword(e.target.value);
        setErrorMatKhauNhapLai("");
        return kiemMatKhauNhapLai(e.target.value);
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center min-vh-100"
            style={{
                backgroundImage: `url(${backgroundImage})`, // Đổi URL thành hình nền bạn muốn
                backgroundSize: "cover", // Đảm bảo hình nền bao phủ toàn bộ
                backgroundPosition: "center", // Căn giữa hình nền
                height: "100vh", // Đặt chiều cao của div là toàn màn hình
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >


            <div
                className="card border-1 rounded-4  p-4 mt-5 card-register"

            >
                <div className="card-body mx-2">
                    <h3 className="card-title card-title-cus"
                       >Sign up</h3>

                    {/* Username Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <div className="d-flex flex-column align-items-start">
                                <label htmlFor="tenDangNhap" className="form-label"
                                >Username<span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="tenDangNhap"
                                    className="form-control custom-placeholder"
                                    value={username}
                                    placeholder="Enter your username"
                                    // onChange={handleTenDangNhapChange}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={handleTenDangNhapChange}

                                />
                                {errorTenDangNhap && ( // Kiểm tra có lỗi hay không
                                    <div className="error-register" >
                                        {errorTenDangNhap}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Firstname and Lastname on one row */}
                        <div className="d-flex justify-content-between ">
                            <div className="mb-2 me-1 d-flex flex-column align-items-start" style={{ flex: 1 }}>
                                <label htmlFor="firstname" className="form-label">
                                    First name<span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    className="form-control custom-placeholder"
                                    value={firstName}
                                    placeholder="Enter your first name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errorFirstname && (
                                    <div className="error-register">{errorFirstname}</div>
                                )}
                            </div>

                            <div className="mb-2 ms-1 d-flex flex-column align-items-start" style={{ flex: 1 }}>
                                <label htmlFor="lastname" className="form-label">
                                    Last name<span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    className="form-control custom-placeholder"
                                    value={lastName}
                                    placeholder="Enter your last name"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errorLastname && (
                                    <div className="error-register">{errorLastname}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="d-flex flex-column align-items-start">
                                <label htmlFor="email" className="form-label"

                                >Email<span className="required">*</span></label>
                                <input type="text"
                                       id="email"
                                       className="form-control custom-placeholder"
                                       value={email}
                                       placeholder="Enter your email"
                                    // onChange={handleEmailChange}
                                       onChange={(e) => setEmail(e.target.value)}
                                       onBlur={handleEmailChange}

                                />
                                {errorEmail && ( // Kiểm tra có lỗi hay không
                                    <div className="error-register" >
                                        {errorEmail}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="mb-2">
                            <div className="d-flex flex-column align-items-start">
                                <label htmlFor="matKhau" className="form-label"
                                >Password<span className="required">*</span></label>
                                <input type="password"
                                       id="matKhau"
                                       className="form-control custom-placeholder"
                                       value={password}
                                       placeholder="Enter your password"
                                    // onChange={handleMatKhauChange}
                                       onChange={(e) => setPassword(e.target.value)}
                                       onBlur={handleMatKhauChange}

                                />
                                {errorMatKhau && ( // Kiểm tra có lỗi hay không
                                    <div className="error-register" >
                                        {errorMatKhau}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="d-flex flex-column align-items-start">
                                <label htmlFor="matKhauNhapLai" className="form-label"
                                       >Confirm password</label>
                                <input type="password"
                                       id="matKhauNhapLai"
                                       className="form-control custom-placeholder"
                                       value={confirmPassword}
                                       placeholder="Confirm password"
                                       onChange={handleMatKhauNhapLaiChange}

                                />

                                {errorMatKhauNhapLai && ( // Kiểm tra có lỗi hay không
                                    <div className="error-register" >
                                        {errorMatKhauNhapLai}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-primary fw-bold"
                                    style={{
                                        backgroundColor: '#c19758',
                                        borderColor: "#c69533",
                                        fontSize: '0.8rem',
                                        padding: '0.5rem'
                                    }}>Register
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}