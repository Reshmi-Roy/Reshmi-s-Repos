import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})

export class AppService{
    //let q= 
     
    constructor(public httpClientObj:HttpClient){

    }

    getAllRepositories(searchVal, pageNo, sortBy, orderBy):Observable<Object>{

        /* I have commented below line as api is not
         giving me expected result on sortby & orderby*/
        
        //const queryString =  encodeURIComponent(`name:${searchVal}&page:${pageNo}&sort=${sortBy}&order=${orderBy}`);
        
        const queryString =  encodeURIComponent(`name:${searchVal}&page:${pageNo}`);
        console.log(`getAllRepositories: searchVal ${searchVal},pageNo ${pageNo},sortBy ${sortBy}, orderBy ${orderBy}`)
        return this.httpClientObj.get(`https://api.github.com/search/repositories?q=${queryString}`);
    }

    searchRepositoriesByName(searchKey:any):Observable<Object>{
        const queryString =  encodeURIComponent(`name:${searchKey}`);
        return this.httpClientObj.get(`https://api.github.com/search/repositories?q=${queryString}`);
    }
}