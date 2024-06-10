export class SortCriteria {
  column: string;
  direction: string;

  constructor(column: string, direction: string) {
    this.column = column;
    this.direction = direction;
  }
}
