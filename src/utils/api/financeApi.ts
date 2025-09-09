import { apiInstance } from "@/lib/apiInstance"
// this is for dashboard
export const getFinanceDashboard = async () =>{
    try {
    const response  = await apiInstance.get(`/finance/dashboard/summary`);
    return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch finance dashboard');
    }
}

// this is for the payment analytics
export const getPaymentAnalytics = async () => {
    try{
        const response = await apiInstance.get(`/finance/analytics`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment analytics');
    }
}

// this is for complete report of payment data both hostel and fees
export const paymentReports = async () => {
    try {
        const response = await apiInstance.get(`/finance/export/payments`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment reports');
    }
}

// this is for year wise report of payment data both hostel and fees
export const getPaymentYearReports = async (year: string) => {
    try {
        const response = await apiInstance.get(`/finance/reports/year/${year}`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment year reports');
    }
}

// this is for pending payments
export const getPendingPayments = async () => {
    try {
        const response = await apiInstance.get(`/finance/pending-payments`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch pending payments');
    }
}

// this is for payment details of a student
export const getPaymentDetailsStudentId = async (studentId: string) =>{
    try {
        const response = await apiInstance.get(`/finance/students/${studentId}/fees`);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
}

// this is for payment details of all students
export const getPaymentDetailsFeesAllStudent = async () =>{
    try{        
        const response = await apiInstance.get(`/finance/fees-records`);
                
        return response;
    }catch(error:any){ 
        throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
}

// this is for payment details of a hostel payment
export const getPaymentDetailsHostelPaymentId = async (paymentId:string) => {
    try {
        const response = await apiInstance.get(`/finance/hostel-payments/${paymentId}`);
        return response;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
}

// this is for payment details of a hostel payment by year
export const getPaymentDetailsHostelYear = async (year: string) =>{
    try {
        console.log('=== HOSTEL API CALL DEBUG ===');
        console.log('Making API call to: /finance/hostel-payments/year/' + year);
        console.log('API Base URL:', apiInstance.defaults.baseURL);
        console.log('============================');
        
        const response = await apiInstance.get(`/finance/hostel-payments/year/${year}`);
        
        console.log('=== HOSTEL API RESPONSE DEBUG ===');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        console.log('================================');
        
        return response.data;
    } catch (error: any) {
        console.log('=== HOSTEL API ERROR DEBUG ===');
        console.log('Error object:', error);
        console.log('Error response:', error.response);
        console.log('Error message:', error.message);
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
        console.log('==============================');
        throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
}

// this is for all hostel payments
export const getHostelAllPayments = async () =>{
    try {
        const response = await apiInstance.get(`/finance/hostel-payments`);
        return response;
        
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
}