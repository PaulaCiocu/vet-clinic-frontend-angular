export class FilterKey {
  column: string;
  filterValue: string;

  constructor(column: string, filterValue: string) {
    this.column = column;
    this.filterValue = filterValue;
  }
}
