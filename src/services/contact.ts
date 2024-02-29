import axiosInstance from "@/api/axios";

interface ContactData {
    fullname:string;
    email:string;
    phone:string;
    city:string;
    message:string;
}

export async function submitContactForm(data: ContactData) {
    try{
        const response = await axiosInstance.post('/contact-forms',{
            'fullname':data.fullname,
            'email':data.email,
            'phone':data.city,
            'city':data.city,
            'message':data.message
        });

        console.log('Response :',response.data);
    }catch(error){
        console.error('Error :',error);
    }
}
