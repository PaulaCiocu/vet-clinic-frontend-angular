export class ColumnVisibility {
  column: string;
  filterValue: boolean;

  constructor(column: string, filterValue: boolean) {
    this.column = column;
    this.filterValue = filterValue;
  }
}
