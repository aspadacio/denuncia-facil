import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Category } from 'src/app/shared/models/category';
import { CategoryProblem } from 'src/app/shared/models/categoryProblem';
import { CategoryTpe } from 'src/app/shared/models/categoryType';
import { Company } from 'src/app/shared/models/company';
import { Delation } from 'src/app/shared/models/delation';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { CompaniesService } from 'src/app/shared/services/companies.service';
import { DelationCategoriesService } from 'src/app/shared/services/delation-categories.service';
import { DelationCategoryProblemsService } from 'src/app/shared/services/delation-categoryproblems.service';
import { DelationCategoryTypesService } from 'src/app/shared/services/delation-categorytypes.service';

declare var $: any;

@Component({
  selector: 'app-delation-form',
  templateUrl: './delation-form.component.html',
  styleUrls: ['./delation-form.component.css']
})
export class DelationFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {

  //Not Async
  public companies: Company[];
  public categories: Category[];
  public categoryTypes: CategoryTpe[];
  public categoryProblems: CategoryProblem[];

  public idCategoryproblem: number;
  private idCompany: number;
  private idCategory: number;
  private idCategorytype: number;

  public submitted: boolean = false;
  
  private numberFiles: number = 1;
  private filesUploadNames: string[] = [];
  public files = []; //To convey File' name & type (pdf, png, jpg)

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private categoriesService: DelationCategoriesService,
    private categoryTypesService: DelationCategoryTypesService,
    private categoryProblemsService: DelationCategoryProblemsService,
    public alertService: AlertModalService,
  ) {
    super();
    this.btnSubmit = "Publicar";
  }

  ngOnInit() {
    const delation: Delation = this.route.snapshot.data['delation'];
    if (delation && delation.id) {
      this.btnSubmit = 'Atualizar';
    }

    this.form = this.formBuilder.group({
      id: [delation.id],
      idEmpresa: [delation.idEmpresa],
      idUsuario: [delation.idUsuario],
      dsTitulo: [delation.dsTitulo, [Validators.required]],
      dsHistoria: this.formBuilder.group({
        dsHistoria: ['', [Validators.required]],
        tsHistoria: [Date.now(), [Validators.required]]
      }),
      dsResposta: this.formBuilder.group({
        dsResposta: ['', [Validators.required]],
        tsResposta: [Date.now(), [Validators.required]]
      }),
      tsReclamacao: [delation.tsReclamacao]
    });

    //First Slide
    this.companiesService.list()
    .pipe(
      catchError(err => {
        this.handleError('Erro ao obter lista de Empresas. Tente novamente.');
        return EMPTY;
      }))
    .subscribe(
      companies => this.companies = companies,
      err => console.log(err), //TODO: implement Alert Modal
      () => {
        this.handleBsSelectRefresh("selectpicker-company");
      }
    );
  }

  ngAfterViewInit(): void {
    //Get Categories from Company
    this.categoriesService.list()
      .subscribe(
        categories => this.categories = categories,
        err => console.log(err), //TODO: implement Alert Modal
        () => {
          this.handleBsSelectRefresh("selectpicker-category");
        }
      );

    //Get Types from Categories
    this.categoryTypesService.list()
      .subscribe(
        types => this.categoryTypes = types,
        err => console.log(err), //TODO: implement Alert Modal
        () => { }
      );

    //Get Problems from Category Types
    this.categoryProblemsService.list()
      .subscribe(
        problems => this.categoryProblems = problems,
        err => console.log(err), //TODO: implement Alert Modal
        () => { }
      );
  }

  submit() {
    this.submitted = true;
    console.log('ENVIANDO.....................');
  }

  /**
   * Handling files added
   * @param event 
   */
  onChangeFileUpload(event: any){
    const selectedFiles = <FileList>event.srcElement.files;
    if( this.numberFiles <= 3 ){
      for(let i=0; i<selectedFiles.length; i++){
        this.numberFiles ++;
        this.filesUploadNames.push(selectedFiles[i].name);
        let fileStrg = selectedFiles[i].name.split('.');
        //Name that contains more than one dot
        if( fileStrg.length > 2 ){
          let fullName = ""; 
          fileStrg.forEach((value, index, arr) => {
           if( index !== (fileStrg.length-1) ){
             fullName += value;
           }
          });
          this.files.push({
            name: fullName.trim(),
            type: fileStrg[fileStrg.length-1],
            id: this.files.length
          });
        }else {
          this.files.push({
            name: fileStrg[0].trim(),
            type: fileStrg[1],
            id: this.files.length
          });
        }
      }
    }else {
      //Show message error
    }
    //console.log(this.files);
    //this.upload(selectedFiles);
  }

  private upload(files: FileList){
    let formData = new FormData();
    for( let i=0; i<files.length; i++ ){
      formData.append('arquivos', files[i], files[i].name);
    }
  }

  /**
   * Handling file removed
   * @param id 
   */
  onRemoveFile(id: number): void {
    this.files = this.files.filter((v, i, arr) => {
      return v.id != id;
    });
    this.numberFiles = this.files.length;
  }

  /**
 * Get Company selected
 * Then calls for next slide
 * @param evt 
 */
onChangeSelectCompany(evt: any) {
  let arrSelected: Function = $('#selectpicker-company option:selected');
  this.idCompany = $(arrSelected).val();
  $('.selectpicker').selectpicker('refresh');
  $('.carousel').carousel('next');
}

  /**
 * Get Category selected
 * @param evt 
 */
onChangeSelectCategory(evt: any) {
  let arrSelected: Function = $('#selectpicker-category option:selected');
  this.idCategory = $(arrSelected).val();
  this.handleBsSelectRefresh("selectpicker-categorytype");
}

/**
 * Get Category Type selected
 * @param evt 
 */
onChangeSelectCategorytype(evt: any) {
  let arrSelected: Function = $('#selectpicker-categorytype option:selected');
  this.idCategorytype = $(arrSelected).val();
  this.handleBsSelectRefresh("selectpicker-problem");
}

/**
 * Get Category Problem selected
 * Then calls for next slide
 * @param evt 
 */
onChangeSelectCategoryProblem(evt: any) {
  let arrSelected: Function = $('#selectpicker-problem option:selected');
  this.idCategoryproblem = $(arrSelected).val();
  $('.carousel').carousel('next');
}

/**
 * Due to Boostrap-select plugin, it's indispensable
 * calls refresh for each selector
 * @param domEl 
 */
private handleBsSelectRefresh(domEl: string) {
  const selector = "#"+`${domEl}`;
  setTimeout(() => {
    $(`${selector}`).selectpicker('refresh');
  }, 1);
}

  private handleError(msg: string) {
    this.alertService.showAlert(AlertModalComponent, msg);
  }

}
