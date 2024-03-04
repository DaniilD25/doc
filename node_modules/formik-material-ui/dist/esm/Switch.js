import { __rest, __assign } from './_virtual/_tslib.js';
import * as React from 'react';
import MuiSwitch from '@mui/material/Switch';
import invariant from 'tiny-warning';

function fieldToSwitch(_a) {
    var disabled = _a.disabled, _b = _a.field, fieldOnBlur = _b.onBlur, field = __rest(_b, ["onBlur"]), isSubmitting = _a.form.isSubmitting, type = _a.type, onBlur = _a.onBlur, props = __rest(_a, ["disabled", "field", "form", "type", "onBlur"]);
    if (process.env.NODE_ENV !== 'production') {
        invariant(type === 'checkbox', "property type=checkbox is missing from field " + field.name + ", this can caused unexpected behaviour");
    }
    return __assign(__assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : isSubmitting, onBlur: onBlur !== null && onBlur !== void 0 ? onBlur : function (e) {
            fieldOnBlur(e !== null && e !== void 0 ? e : field.name);
        } }, field), props);
}
function Switch(props) {
    return React.createElement(MuiSwitch, __assign({}, fieldToSwitch(props)));
}
Switch.displayName = 'FormikMaterialUISwitch';

export { Switch, fieldToSwitch };
//# sourceMappingURL=Switch.js.map
