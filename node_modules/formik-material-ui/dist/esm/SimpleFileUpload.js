import { __assign } from './_virtual/_tslib.js';
import * as React from 'react';
import { getIn } from 'formik';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';

var SimpleFileUpload = function (_a) {
    var field = _a.field, _b = _a.form, isSubmitting = _b.isSubmitting, touched = _b.touched, errors = _b.errors, setFieldValue = _b.setFieldValue, label = _a.label, accept = _a.accept, _c = _a.disabled, disabled = _c === void 0 ? false : _c, inputProps = _a.InputProps, inputLabelProps = _a.InputLabelProps, formControlProps = _a.FormControlProps;
    var error = getIn(touched, field.name) && getIn(errors, field.name);
    return (React.createElement(FormControl, __assign({}, formControlProps),
        label && (React.createElement(InputLabel, __assign({ shrink: true, error: !!error }, inputLabelProps), label)),
        React.createElement(Input, __assign({ error: !!error, inputProps: {
                type: 'file',
                accept: accept,
                disabled: disabled || isSubmitting,
                name: field.name,
                onChange: function (event) {
                    if (inputProps === null || inputProps === void 0 ? void 0 : inputProps.onChange) {
                        inputProps.onChange(event);
                    }
                    else {
                        var file = event.currentTarget.files[0];
                        setFieldValue(field.name, file);
                    }
                },
            } }, inputProps)),
        error && React.createElement(FormHelperText, { error: true }, error)));
};

export { SimpleFileUpload };
//# sourceMappingURL=SimpleFileUpload.js.map
