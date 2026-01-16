import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/assets';
const getToken = () => localStorage.getItem('token');

// Fetch one asset by ID
export async function getOne(id) {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to fetch asset');
    }
}

// Update an asset
export async function updateOne(id, data) {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, data, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to update asset');
    }
}
// Delete an asset by ID
export async function deleteOne(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data; // or true if backend returns no content
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to delete asset');
    }
}

// Validate asset data
export function validate(data) {
    const issues = [];
    if (!data.name) issues.push({ path: ['name'], message: 'Name is required' });
    if (!data.category) issues.push({ path: ['category'], message: 'Category is required' });
    if (!data.serialNumber) issues.push({ path: ['serialNumber'], message: 'Serial Number is required' });
    if (!data.status) issues.push({ path: ['status'], message: 'Status is required' });
    return { issues };
}
