import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from '../services/modal.service';

export abstract class BaseListComponent {
 
    constructor(
        public alertService: ModalService,
        public router: Router,
        public route: ActivatedRoute
    ){}

    //Must be implemented. Refreshs page's contents
    abstract onRefresh(): void;

    //Must be implemented. Calls Modal/Screen to show details
    abstract onView(obj: any): void;

    //Must be implemented. To find for results from params
    abstract onSearch(): void;

    //Send to another Modal/Screen to edit object by id
    onEdit(id: number) {
        this.router.navigate(['edit/', id], {relativeTo: this.route});
    }

    //Close Modal
    onModalClose(){
        this.alertService.close();
    }
}