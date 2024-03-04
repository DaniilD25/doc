import { __rest, __assign } from './_virtual/_tslib.js';
import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import invariant from 'tiny-warning';

function fieldToCheckbox(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, type = _a.type, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "type", "onBlur"]);
    var indeterminate = !Array.isArray(field.value) && field.value == null;
    if (process.env.NODE_ENV !== 'production') {
        invariant(type === 'checkbox', "property type=checkbox is missing from field " + field.name + ", this can caused unexpected behaviour");
    }
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, indeterminate: indeterminate, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function Checkbox(props) {
    return React.createElement(MuiCheckbox, __assign({}, fieldToCheckbox(props)));
}
Checkbox.displayName = 'FormikMaterialUICheckbox';

export { Checkbox, fieldToCheckbox };
//# sourceMappingURL=Checkbox.js.map
