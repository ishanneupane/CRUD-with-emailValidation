import * as yup from "yup";

export const userValidationCreateSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string( ).required("Email is required").matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must match the required format"
      ),
    password: yup.string().required("Password is required"),
});
export const userValidationUpdateSchema = yup.object().shape({  
    name: yup.string(),
    email: yup.string( ).matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must match the required format"
      ),
    password: yup.string()});