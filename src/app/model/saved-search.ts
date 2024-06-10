import {FilterKey} from "./filterKey";
import {SortCriteria} from "./sortCriteria";
import {ColumnVisibility} from "./columnVisibility";


export class SavedSearch {
  id?: number;
  name: string;
  filterKeys?: {column: string, filterValue: string}[];
  sortCriteria?: SortCriteria[];
  columnVisibility?: ColumnVisibility[];
  userID?: number;

  constructor(id: number, name: string, filterKeys: {column: string, filterValue: string}[], sortCriteria: SortCriteria[], columnVisibility: ColumnVisibility[], userID: number) {
    this.id = id;
    this.name = name;
    this.filterKeys = filterKeys;
    this.sortCriteria = sortCriteria;
    this.columnVisibility = columnVisibility;
    this.userID = userID;
  }


}
