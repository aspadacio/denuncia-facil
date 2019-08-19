import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, take } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericCrudService<T> {

  constructor(
    protected http: HttpClient,
    private SERVICE_URL: string
  ) { }

  list(){
    return this.http.get<T[]>(this.SERVICE_URL)
    .pipe(delay(2000));
  }

  find(id: string) {
    return this.http.get<T>(`${this.SERVICE_URL}/${id}`).pipe(take(1));
  }

  save(record: T): Observable<Object> {
    if(record['id']){
      return this.update(record);
    }else {
      return this.create(record);
    }
  }

  remove(id: any) {
    return this.http.delete(`${this.SERVICE_URL}/${id}`).pipe(take(1));
  }

  private create(record: T){
    return this.http.post(this.SERVICE_URL, record).pipe(take(1));
  }

  private update(record: T){
    return this.http.put(`${this.SERVICE_URL}/${record['id']}`, record).pipe(take(1));
  }

  /**
   * Do a search by params sent
   * @param args ArrayMap<String, String> => key, value
   */
  findParams(...args: any[]){
    let mountUrl = this.SERVICE_URL + '?';
    args[0].forEach(function(v: any, i: number, arr: any[]){
      if( i >= 1 ){
        mountUrl += '&';
      }
      mountUrl += v.key + '=' + v.value;
    });
    // console.log(mountUrl);
    return this.http.get<T[]>(`${mountUrl}`).pipe(take(1));
  }

  /**
   * Its indispensable for any cases that we has 
   * access to Subscribe(functs) to call complete()
   * then make some stuffs into that
   */
  
}
