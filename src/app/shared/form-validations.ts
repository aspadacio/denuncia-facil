import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SisUtil } from './sis-util';

/**
 * Na comunidade já existem vários projetos para validações.
 * Por exemplo, o ng2-validation
 * @see https://github.com/yuyang041060120/ng2-validation
 */
export class FormValidations {

  static requiredMinCheckBox(min = 1) {
    const validator = (formArray: FormArray) => {
      /*    **** Utilizando Programação Estruturada ****
            const values = formArray.controls;
            let totalChecked = 0;
            for(let i=0; i<values.length; i++){
              if(values[i].value){
                totalChecked++;
              }
            }     */
      /*    **** Utilizando Programação Funcional ****/
      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    };
    return validator;
  }

  static cepValidator(control: FormControl) {
    let cep: string = control.value;
    if (FormValidations.isValidString(cep)) {
      cep = SisUtil.replaceStr(cep);
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalid: true };
    }
    return null;
  }

  static cpfValidator(control: FormControl) {
    let cpf: string = control.value;
    if(FormValidations.isValidString(cpf)){
      cpf = SisUtil.replaceStr(cpf);
      return /^[0-9]{11}$/.test(cpf) ? null : { cpfInvalid: true };
    }
  }

  static cnpjValidator(control: FormControl){
    let cnpj: string = control.value;
    if(FormValidations.isValidString(cnpj)){
      cnpj = SisUtil.replaceStr(cnpj);
      return /^[0-9]{14}$/.test(cnpj) ? null : { cnpjInvalid: true };
    }
    return null;
  }

  static numberValidator(control: FormControl){
    let field: string = control.value;
    if(FormValidations.isValidString(field)){
      return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(field) ? null : { numberInvalid: true };
    }
    return null;
  }

  static equalsTo(otherField: string){
    const validator = (formControl: FormControl) => {
      if(otherField == null){
        throw new Error('É necessário informar um campo.');
      }else if( formControl.root && (<FormGroup> formControl.root).controls ){
        const field = (<FormGroup> formControl.root).get(otherField);
        if(!field){
          throw new Error('É necessário informar um campo válido.');
        }else  if(field.value !== formControl.value){
          return {equalsTo:otherField};
        }
      }
      return null;
    }
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){
    const config = {
      'required': `${fieldName} é orbigatório.`,
      'minlength': `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'cepInvalido': 'CEP inválido'
    };
    return config[validatorName];
  }

  public static isValidString(v: string){
    if( v != null && v !== ''){
      return true;
    }else{
      return false;
    }
  }
}