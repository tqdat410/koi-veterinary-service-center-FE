import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {getKoiById, updateKoi, deleteKoi, addKoiImage, deleteKoiImage} from '../../../api/koiApi';
import '../../../styles/AddKoiFish.css';
import {IMAGE_API} from "../../../api/baseApi"
import Sidebar from "../../../components/layout/Sidebar";
interface Image {
    image_id: number;
    source_path: string;
    enable: boolean; // Make sure this matches the structure of your API
}
interface KoiData {
    species: string;
    age: string;
    gender: string;
    size: string;
    weight: string;
    color: string;
    origin: string;
    images: Image[]; // Use the Image interface for the images array
}


const KoiDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fishId: number = location.state?.fishId; // Get fishId from state
    const [newImages, setNewImages] = useState<File[]>([]);
    const [initialKoiData, setInitialKoiData] = useState<KoiData>({
        species: '',
        age: '',
        gender: '',
        size: '',
        weight: '',
        color: '',
        origin: '',
        images: []  // Use the Image interface for the images array
    });

    const [koiData, setKoiData] = useState(initialKoiData);

    const [showAllImages, setShowAllImages] = useState(false); // Control visibility of all uploaded images
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        const fetchKoiData = async () => {
            if (fishId) {
                const data = await getKoiById(fishId.toString());
                console.log(data);
                const filteredImages = data.images.filter((image: Image) => image.enable);
                setKoiData({ ...data, images: filteredImages });
                setInitialKoiData({ ...data, images: filteredImages });

            }
        };
        fetchKoiData();
    }, [fishId]);

    const handleUpdate = async () => {
        if (Object.values(koiData).some(value => value === '')) {
            alert('Please fill in all fields!');
            return;
        }
        try {
            await updateKoi(fishId, koiData);
            alert('Koi updated successfully!');
            navigate('/koi/my-koi');
        } catch (error) {
            console.error('Error updating koi:', error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this koi?');
        if (confirmDelete) {
            try {
                await deleteKoi(fishId);
                alert('Koi deleted successfully!');
                navigate('/koi/my-koi');
            } catch (error) {
                console.error('Error deleting koi:', error);
            }
        }
    };

    // Function to handle new image upload
    const handleImageUpload = async () => {
        if (newImages.length > 0) {
            try {
                for (let image of newImages) {
                    await addKoiImage(fishId, image);
                }
                alert('Images uploaded successfully!');

                const updatedKoiData = await getKoiById(fishId.toString());
                setKoiData(updatedKoiData);
                setNewImages([]);
                window.location.reload();
            } catch (error) {
                console.error('Error uploading images:', error);
                alert('Failed to upload images. Please try again.');
            }
        } else {
            alert('Please select images to upload!');
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this image?');
        if (confirmDelete) {
            try {
                const imageDTO = {
                    image_id: imageId,
                    enable: "false"
                };
                console.log(imageDTO)
                await deleteKoiImage(imageDTO);


                // Cập nhật lại danh sách ảnh sau khi xóa
                alert('Image deleted successfully!');
                window.location.reload()
            } catch (error) {
                console.error('Error deleting image:', error);
                alert('Failed to delete image. Please try again.');
            }
        }
    };



    const handleBack = () => {
        navigate('/koi/my-koi');
    };

    const handleCancel = () => {
        setKoiData(initialKoiData);
    };

    // Function to toggle image visibility
    const toggleImages = () => {
        setShowAllImages(!showAllImages);
    };

    const openModal = (imagePath: string) => {
        setSelectedImage(imagePath);
        setShowModal(true);
    };

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };
    const nextImage = () => {

        setCurrentIndex((prevIndex) => (prevIndex + 1) % koiData.images?.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + koiData.images?.length) % koiData.images?.length);
    };


    return (
        <div className="d-flex flex-grow-1 gap-3" style={{marginLeft: '272px'}}>
            <Sidebar/>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center ">
                {/*<button className="btn btn-secondary back-button" onClick={handleBack}>*/}
                {/*    Back*/}
                {/*</button>*/}
                <div className="row w-100 h-100">
                    {/* Image Section */}
                    <div
                        className="col-md-6 col-sm-12 d-flex flex-column justify-content-center align-items-center mb-4"
                        style={{marginTop: "6rem"}}>
                        <div className="image-upload-container">
                            <div className="image-upload-card">
                                <div
                                    className="image-display d-flex flex-column justify-content-center align-items-center">
                                    {koiData.images && koiData.images?.length > 0 ? (
                                        <img
                                            src={`${IMAGE_API}/${koiData.images[currentIndex]?.source_path}`}
                                            className="image-upload"
                                            alt="Koi"
                                            onClick={() => openModal(koiData.images[currentIndex]?.source_path)} // Open modal on click
                                            style={{cursor: "pointer"}}
                                        />
                                    ): (
                                        <div className="upload-placeholder text-muted fs-5 fw-bold">
                                            No image uploaded
                                        </div>
                                    )}
                                    <div className="image-navigation mt-3">
                                        <button
                                            onClick={prevImage}
                                            disabled={koiData.images?.length <= 1}
                                            className="btn btn-outline-primary me-1"
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            disabled={koiData.images?.length <= 1}
                                            className="btn btn-outline-primary ms-1"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="upload-button-container text-center  mt-3">
                                <input type="file" multiple onChange={(e) => setNewImages(Array.from(e.target.files || []))} />
                                <button className="upload-button btn btn-warning text-white me-1"
                                        onClick={handleImageUpload}>
                                    Upload
                                </button>
                                <button className="upload-button btn btn-warning text-white ms-1" onClick={toggleImages}>
                                    {showAllImages ? 'Hide Images' : 'Show Images'}
                                </button>
                            </div>
                            {showAllImages && koiData.images.length > 0 && (
                                <div className="uploaded-images mt-3">
                                    {koiData.images.map((image, index) => (
                                        <div key={image.image_id} className="image-container">
                                            <img
                                                src={`${IMAGE_API}/${image.source_path}`}
                                                className="image-upload-more"
                                                alt={`Uploaded ${index + 1}`}
                                                onClick={() => openModal(image.source_path)}
                                            />
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteImage(image.image_id)}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="col-md-6 d-flex  justify-content-center align-items-start"
                         style={{marginTop: "6rem"}}>
                        <div className="form-container card w-100 ">
                            <div className="card-body">
                                <h2 className="text-start"
                                    style={{
                                        fontWeight: "bold",
                                        color: "#02033B",
                                        fontSize: "2.3rem",

                                    }}>Koi fish details</h2>
                                {/* Species */}
                                <div className="mb-3">
                                    <label className="form-label-koi ">Species</label>
                                    <input type="text" name="species" className="form-control input-field-koi"
                                           value={koiData.species}
                                           onChange={(e) => setKoiData({...koiData, species: e.target.value})}/>
                                </div>

                                {/* Age and Gender */}
                                <div className="mb-3 row">
                                    <div className="col-md-5 col-sm-6">
                                        <label className="form-label-koi ">Age</label>
                                        <input type="number" name="age" className="form-control input-field-koi"
                                               value={koiData.age}
                                               onChange={(e) => setKoiData({...koiData, age: e.target.value})}/>
                                    </div>
                                    <div className="col-md-7 col-sm-6 d-flex align-items-end gap-3 mt-2">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" value="MALE"
                                                   checked={koiData.gender === 'MALE'}
                                                   onChange={(e) => setKoiData({...koiData, gender: e.target.value})}/>
                                            <label className="form-check-label fw-bold" htmlFor="male">Male</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender"
                                                   value="FEMALE"
                                                   checked={koiData.gender === 'FEMALE'}
                                                   onChange={(e) => setKoiData({...koiData, gender: e.target.value})}/>
                                            <label className="form-check-label fw-bold" htmlFor="female">Female</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    {/* Size */}
                                    <div className="col-md-6 col-sm-6">
                                        <label className="form-label-koi ">Size (cm)</label>
                                        <input type="text" name="size" className="form-control input-field-koi"
                                               value={koiData.size}
                                               onChange={(e) => setKoiData({...koiData, size: e.target.value})}/>
                                    </div>

                                    {/* Weight */}
                                    <div className="col-md-6 col-sm-6">
                                        <label className="form-label-koi ">Weight (kg)</label>
                                        <input type="text" name="weight" className="form-control input-field-koi"
                                               value={koiData.weight}
                                               onChange={(e) => setKoiData({...koiData, weight: e.target.value})}/>
                                    </div>
                                </div>
                                    {/* Color */}
                                    <div className="mb-3">
                                        <label className="form-label-koi ">Color</label>
                                        <input type="text" name="color" className="form-control input-field-koi"
                                               value={koiData.color}
                                               onChange={(e) => setKoiData({...koiData, color: e.target.value})}/>
                                    </div>

                                    {/* Origin */}
                                    <div className="mb-3">
                                        <label className="form-label-koi ">Origin</label>
                                        <input type="text" name="origin" className="form-control input-field-koi"
                                               value={koiData.origin}
                                               onChange={(e) => setKoiData({...koiData, origin: e.target.value})}/>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-3 ">
                                        <button className="btn btn-primary  mt-3" onClick={handleUpdate}>Save</button>
                                        <button className="btn btn-secondary  mt-3" onClick={handleCancel}>Cancel</button>
                                        <button className="btn btn-danger  mt-3" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                {/* Modal for displaying images */}
                {showModal && (
                    <div className="modal fade show" tabIndex={-1} style={{display: 'block'}}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold fs-2">Image Preview</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body text-center">
                                    {selectedImage && (
                                        <img src={`${IMAGE_API}/${selectedImage}`}
                                             className="img-fluid" alt="Koi"/>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
 };

export default KoiDetail;
