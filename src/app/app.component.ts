import { Component, OnInit,Inject, HostListener,ElementRef,ViewChild} from '@angular/core';
import {AppService} from './app.service';
import {debounce,calculatePagination} from './utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title = 'githubApp';
valueToBeSerached="";
repositoryItems = [];
searchItems=[];
searchName:string ="";
showTypeahead:boolean=false;
ITEM_PER_PAGE=30;
firstPage =1;
totalCount;
totalPageSize;
currentItemLength=0;
sortBy="name";
orderBy="asc";
isLoadingRepos=false;
isLoadingTypeAhead = false;
@ViewChild('reposContent', {static: false}) reposContent:ElementRef;

@HostListener('document:click', ['$event'])
  clickout(event) {
    if (!event.target.closest(".search-box")) {
     this.showTypeahead = false;
    }
    
  }

  constructor(public appServObj : AppService){

  }

  ngOnInit(){
    this.fetchFromRepos(this.valueToBeSerached,this.firstPage,this.sortBy,this.orderBy);
  
  }

  fetchFromRepos(valueToBeSerached, goToPage, sortBy,orderBy) {
    this.isLoadingRepos = true;
    this.appServObj.getAllRepositories(valueToBeSerached, goToPage, sortBy, orderBy).subscribe((response:any)=>{
      console.log(response.items);
      this.repositoryItems = [...this.repositoryItems,...response.items];
      this.totalCount =  response.total_count;
      this.currentItemLength = this.repositoryItems.length;
      this.isLoadingRepos = false
    }, (errorResp) => {
      this.isLoadingRepos = false;
      alert(`Error loading Repository data: ${errorResp.error.message}`)
    })
  }

 searchTypeahedContent = debounce((val:any)=> { 
    this.isLoadingTypeAhead = true;
    this.appServObj.searchRepositoriesByName(val).subscribe((data:any)=>{
      console.log(data);
      this.searchItems = data.items;
      this.showTypeahead = true;
      this.isLoadingTypeAhead = false
    }, (errorResp) => {
      this.isLoadingTypeAhead = false
      alert(`Error loading typeahead data: ${errorResp.error.message}`)
    })
  }, 500); 


  selectValue(itemval:string){
    this.searchName = itemval;
    this.showTypeahead = false;
    this.repositoryItems = [];
    this.fetchFromRepos(this.searchName, this.firstPage, this.sortBy, this.orderBy);
  }

  focusInput(){
    this.showTypeahead = true;
  }


  onContainerScroll(){
    console.log("scrolling")
    let { totalPage, currentPageNo } = calculatePagination(this.totalCount, this.ITEM_PER_PAGE, this.currentItemLength);
    if(currentPageNo === totalPage) {
      console.log("max Page Reached")
      return
    }
    if(this.isLoadingRepos) {
      console.log("Loading in Progress")
      return
    }
    let totalHeight = Math.ceil(this.reposContent.nativeElement.scrollTop + this.reposContent.nativeElement.clientHeight);
    let scrollReachToHeight = Math.ceil(this.reposContent.nativeElement.scrollHeight) ;
    let goToPage = currentPageNo+1;
    if (totalHeight >= scrollReachToHeight) {
      console.log("scrollmore");
      this.fetchFromRepos(this.valueToBeSerached, goToPage, this.sortBy,this.orderBy);

    }

  }

  selectedSortOption(){
    this.repositoryItems = [];
    this.fetchFromRepos(this.valueToBeSerached,this.firstPage,this.sortBy,this.orderBy);
  }

  selectedOrderOption(){

  }

}
