import * as yup from "yup";

export const userValidationCreateSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().required(),
    password: yup.string().required(),
});
export const userValidationUpdateSchema = yup.object().shape({  
    name: yup.string(),
    
    email: yup.string(),
    password: yup.string()});