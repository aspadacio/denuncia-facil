import { pipe } from 'rxjs';
import { HttpEventType, HttpEvent, HttpResponse } from '@angular/common/http';
import { map, filter, tap } from 'rxjs/operators';

/**
 * Custom RXJS operator to use globally
 */

export function filterObservableResponse<T>() {
    return pipe(
        filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
        map((res: HttpResponse<T>) => res.body)
    );
}

export function calcUploadProgress<T>(callBack:(progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
        if(event.type === HttpEventType.UploadProgress) {
            callBack(Math.round((event.loaded * 100) / event.total));
        }
    });
}