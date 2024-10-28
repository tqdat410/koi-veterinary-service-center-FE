import axios from 'axios';
import {BASE_API} from "./baseApi"
const FISH_URL = `${BASE_API}/fishes`;

export const getKoiById = async (id: string) => {
    const response = await axios.get(`${FISH_URL}/${id}`);
    return response.data;
};

export const updateKoi = async (id: number, koiData: any) => {
    const response = await axios.put(`${FISH_URL}/update/${id}`, koiData);
    return response.data;
};

export const deleteKoi = async (id: number) => {
    await axios.delete(`${FISH_URL}/deletefish`, {
        data: { fish_id: id ,"enable": false },
    });
};

export const fetchFishes = async (userId: number) => {
    const token = localStorage.getItem("token");  // Assuming the token is stored in localStorage
    const response = await axios.get(`${FISH_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Add a new Koi fish
export const addKoi = async (koiData: any) => {
    const response = await axios.post(`${FISH_URL}/addfish`, koiData);
    console.log(response.data)
    return response.data;
};

// Add an image for a specific Koi fish
export const addKoiImage = async (fishId: number, image: File) => {
    const formData = new FormData();
    formData.append('fish_id', fishId.toString());
    formData.append('image', image);

    const response = await axios.post(`${FISH_URL}/add_image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const deleteKoiImage = async (imageDTO: { image_id: number; enable: string  }) => {
    const response = await axios.delete(`${FISH_URL}/deleteimage`, {
        data: imageDTO
    });
    console.log(response)
    console.log(response.data)
    return response.data;
};