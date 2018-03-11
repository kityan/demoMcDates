class AppController implements ng.IController {
  public dateFrom: string;
  public dateTo: string;
  constructor() {

  }
  $onInit(): void {
    this.dateFrom = '2012-12-12';
    this.dateTo = '2012-12-21';
  }
  onMcDateChange(from: Date, to: Date): void {
    console.log(from, to);
  }
}

export class AppComponent implements ng.IComponentOptions {
  static NAME: string = 'app';
  controller: any;
  templateUrl: any;
  constructor() {
    this.controller = AppController;
    this.templateUrl = require('./app.component.html');
  }
}
