import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/AddKoiFish.css';
import {useAuth} from "../../../hooks/context/AuthContext";
import {addKoi, addKoiImage, getKoiById} from "../../../api/koiApi";
import {useLocation, useNavigate} from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";


const AddKoiFish: React.FC = () => {
    const { user  } = useAuth(); // Use Auth context to get userId
    const userId = user?.userId || 0;
    const navigate = useNavigate();
    const location = useLocation();
    // Individual state variables for koi fish fields
    const [species, setSpecies] = useState<string>('');

    const [gender, setGender] = useState<string>('MALE');
    const [age, setAge] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [origin, setOrigin] = useState<string>('');
    const [error, setError] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const [showAllImages, setShowAllImages] = useState(false); // State to control visibility of all uploaded images

    const handleImageUpload = async (files: FileList | null) => {
        if (!files) return;
        const selectedImages = Array.from(files);
        setImages(selectedImages);
        const uploadedImagePaths: string[] = [];
        for (const file of selectedImages) {
            const reader = new FileReader();
            reader.onloadend = () => {
                uploadedImagePaths.push(reader.result as string);
                setImagePaths(uploadedImagePaths);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit koi form data and images
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that all fields are filled
        if (!species || !gender || !color || !origin || Number(age) <= 0 || Number(size) <= 0 || Number(weight) <= 0) {
            alert('Please fill in all fields correctly (numbers must be greater than 0)!');
            setError(true);
            return;
        }

        const koiData = {
            userId,
            species,
            age: Number(age),
            gender,
            size: Number(size),
            weight: Number(weight),
            color,
            origin,
        };

        try {
            // Post koi information
            const koiResponse = await addKoi(koiData);
            const fishId = koiResponse.fish_id; // Assuming the response returns the fish ID


            for (const image of images) {
                await addKoiImage(fishId, image);
            }

            alert('Koi data and images successfully submitted!');
            navigate(location.state?.from ||'/koi/my-koi');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };



    const handleBack = () => {
        window.history.back();
    };

    // Function to toggle image visibility
    const toggleImages = () => {
        setShowAllImages(!showAllImages);
    };

    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center ">
                {/*<button className="btn btn-secondary back-button" onClick={handleBack}>*/}
                {/*    Back*/}
                {/*</button>*/}
                <div className="row w-100 h-100">
                    {/* Image Upload Section */}
                    <div
                        className="col-md-6 col-sm-12 d-flex flex-column justify-content-center align-items-center mb-4"
                        style={{marginTop: "6rem"}}>
                        <div className="image-upload-container">
                            <div className="image-upload-card">
                                {imagePaths.length > 0 && (
                                    <img src={imagePaths[0]} className="image-upload" alt="Koi"/>
                                )}
                            </div>
                            <div className="upload-button-container text-center mt-3">
                                <input type="file" multiple onChange={(e) => handleImageUpload(e.target.files)}/>
                                <button className="upload-button btn btn-warning text-white" onClick={toggleImages}>
                                    {showAllImages ? 'Hide All Images' : 'Show All Images'}
                                </button>
                            </div>
                            {showAllImages && imagePaths.length > 1 && (
                                <div className="uploaded-images mt-3">
                                    {imagePaths.slice(1).map((path, index) => (
                                        <img key={index} src={path} className="image-upload"
                                             alt={`Uploaded ${index + 1}`}/>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/*<button className="btn btn-success mt-3" onClick={handleImageSubmit}>*/}
                        {/*    Upload Images*/}
                        {/*</button>*/}
                    </div>

                    {/* Form Section */}
                    <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-center align-items-center  "
                         style={{marginTop: "3.5rem"}}>
                        <div className="form-container card w-100">
                            <div className="card-body">
                                <h2 className="text-start"
                                    style={{
                                        fontWeight: "bold",
                                        color: "#02033B",
                                        fontSize: "2.3rem",

                                    }}>Add Koi fish</h2>
                                {/* Species */}
                                <div className="mb-3">
                                    <label className="form-label-koi ">Species</label>
                                    <input type="text"
                                           className={`form-control input-field-koi ${error && !species ? 'border-danger' : ''}`}
                                           placeholder="Enter your koi species" value={species}
                                           onChange={(e) => setSpecies(e.target.value)}/>
                                </div>

                                {/* Age and Gender */}
                                <div className="mb-3 row">
                                    <div className="col-md-5 col-sm-6">
                                        <label className="form-label-koi ">Age</label>
                                        <input type="number"
                                               className={`form-control input-field-koi ${error && Number(age) <= 0 ? 'border-danger' : ''}`}
                                               placeholder="Enter koi age" value={age}
                                               onChange={(e) => setAge(e.target.value)}/>
                                    </div>
                                    <div className="col-md-7 col-sm-6 d-flex align-items-end gap-3 mt-2">
                                        <div className="form-check">
                                            <input
                                                className={`form-check-input ${error && !gender ? 'border-danger' : ''}`}
                                                type="radio" name="gender" value="MALE"
                                                id="MALE"
                                                checked={gender === 'MALE'}
                                                onChange={(e) => setGender(e.target.value)}/>
                                            <label className="form-check-label" htmlFor="MALE">Male</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className={`form-check-input ${error && !gender ? 'border-danger' : ''}`}
                                                type="radio" name="gender" value="FEMALE"
                                                id="FEMALE" onChange={(e) => setGender(e.target.value)}/>
                                            <label className="form-check-label" htmlFor="FEMALE">Female</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    {/* Size */}
                                    <div className="col-md-6 col-sm-6">
                                        <label className="form-label-koi ">Size (cm)</label>
                                        <input type="number"
                                               className={`form-control input-field-koi ${error && Number(size) <= 0 ? 'border-danger' : ''}`}
                                               placeholder="Enter your koi size " value={size}
                                               onChange={(e) => setSize(e.target.value)}/>
                                    </div>

                                    {/* Weight */}
                                    <div className="col-md-6 col-sm-6">
                                        <label className="form-label-koi ">Weight (kg)</label>
                                        <input type="number"
                                               className={`form-control input-field-koi ${error && Number(weight) <= 0 ? 'border-danger' : ''}`}
                                               placeholder="Enter koi weight in kg "
                                               value={weight}
                                               onChange={(e) => setWeight(e.target.value)}/>
                                    </div>
                                </div>
                                {/* Color */}
                                <div className="mb-3">
                                    <label className="form-label-koi ">Color</label>
                                    <input type="text"
                                           className={`form-control input-field-koi ${error && !color ? 'border-danger' : ''}`}
                                           placeholder="Enter your koi color" value={color}
                                           onChange={(e) => setColor(e.target.value)}/>
                                </div>

                                {/* Origin */}
                                <div className="mb-3">
                                    <label className="form-label-koi ">Origin</label>
                                    <input type="text"
                                           className={`form-control input-field-koi ${error && !origin ? 'border-danger' : ''}`}
                                           placeholder="Enter your koi origin" value={origin}
                                           onChange={(e) => setOrigin(e.target.value)}/>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid ">
                                    <button className="btn btn-primary submit-button mt-3" onClick={handleSubmit}>
                                        Add koi fish
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            );
            };

            export default AddKoiFish;
