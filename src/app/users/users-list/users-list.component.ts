import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';

import { User } from '../../shared/models/user';
import { UsersService } from '../../shared/services/users.service';
import { catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  @ViewChild('modalDetail', {static: false}) modalDetail: TemplateRef<any>;

  public users$: Observable<User[]>;
  public userSelected: User;

  constructor(
    private alertService: ModalService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh(){
    this.users$ = this.usersService.list()
    .pipe(
      catchError(err => {
       this.handleError('Erro ao carregar Usuários. Tente novamente.');
        return EMPTY;
    }));
  }

  onEdit(id: number){
    this.router.navigate(['edit/', id], {relativeTo: this.route});
  }

  onDelete(user: User): void {
    this.userSelected = user;
    this.onConfimrDelete();
  }

  private onConfimrDelete(){
    this.usersService.remove(this.userSelected._id)
    .subscribe(
      success => {
        this.onRefresh();
      },
      error => {
        this.handleError('Erro ao excluir Usuário. Tente Novmente');
      }
    );
  }

  private handleError(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

    /**
   * Will show a modal popup with Company's value
   * @param company 
   */
  onView(user: User){
    this.userSelected = user;
    this.alertService.showDetails(this.modalDetail);
  }

  onModalClose(){
    this.alertService.close();
  }

}
