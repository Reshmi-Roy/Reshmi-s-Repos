export function debounce(cb,delay):Function{
    let a;
     return function(...params){
      clearTimeout(a);
      a=setTimeout(cb.bind(null,params),delay);
    }
    }

export function calculatePagination(totalCount, itemPerPage, currentDataCount){
 let totalPage = Math.ceil(totalCount/itemPerPage);
 let currentPageNo = Math.ceil(currentDataCount/itemPerPage);
  return {
    totalPage,
    currentPageNo
  }
}