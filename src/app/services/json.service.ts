import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' :'*'
    })
  }

  url="https://my-json-server.typicode.com/pointec/MatchCar"


  constructor(private httpclient:HttpClient) { }

  getData(): Observable<any>{
    return this.httpclient.get(this.url+'/users/').pipe(retry(3))

  }


}
