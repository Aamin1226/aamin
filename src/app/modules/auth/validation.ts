import {AbstractControl, ValidatorFn} from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (!control || !checkControl) {
        return null;
      }

      if (checkControl.errors && checkControl.errors['matching']) {
        if (control.value === checkControl.value) {
          checkControl.setErrors(null);
        }
      } else {
        if (control.value !== checkControl.value) {
          checkControl.setErrors({'matching': true});
          return {'matching': true};
        }
      }

      return null;
    };
  }


}
