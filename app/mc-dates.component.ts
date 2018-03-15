import { Moment } from 'moment';
import './mc-dates.component.less';

enum Presets {
  YESTERDAY,
  TODAY,
  TWOWEEKS,
  MONTH,
  ALL
}

class McDatesController implements ng.IComponentController {
  public mcPlaceholder: string;
  public mcChange: (obj: object) => any;
  private _dateFrom: Date;
  private _dateTo: Date;
  private _presets: typeof Presets;

  private moment: any;
  private $timeout: any;

  constructor(moment: any, $timeout: any) {
    this._presets = Presets;
    this.moment = moment;
    this.$timeout = $timeout;
  }

  private format(d: Date): string {
    let m: Moment = this.moment(d);
    return (m.isValid() ? m.format('YYYY-MM-DD') : null);
  }

  private parse(s: string): Date {
    let m: Moment = this.moment(s);
    return (m.isValid() ? m.toDate() : null);
  }

  public get dateFrom(): string {
    return this.format(this._dateFrom);
  }

  public set dateFrom(s: string) {
    this._dateFrom = this.parse(s);
  }

  public get dateTo(): string {
    return this.format(this._dateTo);
  }

  public set dateTo(s: string) {
    this._dateTo = this.parse(s);
  }

  public onInnerChange(): void {
    this.emitEvent();
  }

  emitEvent(): void {
    if (this.mcChange && typeof this.mcChange === 'function') {
      this.mcChange({ from: this.format(this._dateFrom), to: this.format(this._dateTo) });
    }
  }

  applyPreset(preset: string | number): void {
    let m: Moment = this.moment();
    let d: Array<Date>;
    switch (preset) {
      case this._presets.YESTERDAY:
        m.subtract('1', 'day');
        d = [m.toDate(), m.toDate()];
        break;
      case this._presets.TODAY:
        d = [m.toDate(), m.toDate()];
        break;
      case this._presets.TWOWEEKS:
        d = [m.toDate(), m.subtract('14', 'day').toDate()];
        break;
      case this._presets.MONTH:
        d = [m.toDate(), m.subtract('1', 'month').toDate()];
        break;
      case this._presets.ALL:
        d = [null, null];
        break;
    }

    let prevDateFrom = this.dateFrom;
    let prevDateTo = this.dateTo;

    this._dateFrom = (d[1]) ? d[1] : null;
    this._dateTo = (d[0]) ? d[0] : null;

    if (prevDateFrom !== this.dateFrom || prevDateTo !== this.dateTo) {
      this.emitEvent();
    }

  }
}

export class McDatesComponent implements ng.IComponentOptions {

  public static NAME: string = 'mcDates';
  public static $inject: Array<string> = ['moment', '$timeout'];
  public bindings: any;
  public controller: any;
  public templateUrl: string;

  constructor() {
    this.bindings = {
      dateFrom: '=',
      dateTo: '=',
      mcPlaceholder: '@',
      mcChange: '&'
    };
    this.controller = McDatesController;
    this.templateUrl = require('./mc-dates.component.html');
  }

}
