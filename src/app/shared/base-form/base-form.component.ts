import { FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {

    form: FormGroup;
    btnSubmit: string = 'Adicionar';

    constructor() { }
  
    abstract submit(): any

    reset(){
        this.form.reset();
    }

    onSubmit(){
       if(this.form.valid){
        this.submit();
       }
    }

    fillForm(data: any): void{ }
}