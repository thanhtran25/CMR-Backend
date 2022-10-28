export interface FilterPagination {
    page: number,
    limit: number,
    sort: string,
    sortBy: string,
    [index: string]: any,
}