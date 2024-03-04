/// <reference types="react" />
import { InputBaseProps as MuiInputBaseProps } from '@mui/material/InputBase';
import { FieldProps } from 'formik';
export interface InputBaseProps extends FieldProps, Omit<MuiInputBaseProps, 'name' | 'value' | 'error'> {
}
export declare function fieldToInputBase({ disabled, field: { onBlur: fieldOnBlur, ...field }, form: { isSubmitting }, onBlur, ...props }: InputBaseProps): MuiInputBaseProps;
export declare function InputBase(props: InputBaseProps): JSX.Element;
export declare namespace InputBase {
    var displayName: string;
}
