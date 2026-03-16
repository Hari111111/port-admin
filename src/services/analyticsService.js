import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const analyticsService = {
    getAllPageViews: async () => {
        try {
            const response = await axios.get(`${API_URL}/views/all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
};

export default analyticsService;
