/// <reference types="react" />
import { FieldProps } from 'formik';
import { FormControlProps } from '@mui/material/FormControl';
import { InputLabelProps } from '@mui/material/InputLabel';
import { InputProps } from '@mui/material/Input';
export interface SimpleFileUploadProps extends FieldProps {
    label: string;
    accept: string;
    disabled?: boolean;
    InputProps?: Omit<InputProps, 'name' | 'type' | 'label'>;
    InputLabelProps?: InputLabelProps;
    FormControlProps?: FormControlProps;
}
export declare const SimpleFileUpload: ({ field, form: { isSubmitting, touched, errors, setFieldValue }, label, accept, disabled, InputProps: inputProps, InputLabelProps: inputLabelProps, FormControlProps: formControlProps, }: SimpleFileUploadProps) => JSX.Element;
