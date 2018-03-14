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
  private _dateFromObj: Date;
  private _dateToObj: Date;
  private _presets: typeof Presets;

  private _sielence: boolean = false;
  private _hasEventInSielence: boolean = false;

  private moment: any;

  constructor(moment: any) {
    this._presets = Presets;
    this.moment = moment;
  }

  private format(d: Date): string {
    let m: Moment = this.moment(d);
    return (m.isValid() ? m.format('YYYY-MM-DD') : null);
  }

  private parse(s: string): Date {
    let m: Moment = this.moment(s);
    return (m.isValid() ? m.toDate() : null);
  }

  // app <> mc-dates

  public get dateFrom(): string {
    return this.format(this._dateFromObj);
  }

  public set dateFrom(s: string) {
    this.updateDateObject('_dateFromObj', s);
  }

  public get dateTo(): string {
    return this.format(this._dateToObj);
  }

  public set dateTo(s: string) {
    this.updateDateObject('_dateToObj', s);
  }

  // mc-dates <> md-datepicker

  public get _dateFrom(): Date | string {
    return this.format(this._dateFromObj);
  }

  public set _dateFrom(d: Date | string) {
    this.updateDateObject('_dateFromObj', d, true);
  }

  public get _dateTo(): Date | string {
    return this.format(this._dateToObj);
  }

  public set _dateTo(d: Date | string) {
    this.updateDateObject('_dateToObj', d, true);
  }

  private updateDateObject(name: string, d: string | Date, emitChange?: boolean): void {
    if (typeof d !== 'string') {
      d = this.format(d);
    }
    if (this.format(this[name]) !== d) {
      this[name] = this.parse(d);
      if (typeof this.mcChange === 'function' && emitChange) {
        this.emitEvent();
      }
    }
  }

  emitEvent(): void {
    if (!this._sielence) {
      this.mcChange({ from: this.format(this._dateFromObj), to: this.format(this._dateToObj) });
    } else {
      this._hasEventInSielence = true;
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
    this._sielence = true; // disable emitting events
    this._dateFrom = (d[1]) ? d[1] : null;
    this._dateTo = (d[0]) ? d[0] : null;
    this._sielence = false; // enable emitting events
    if (this._hasEventInSielence) { // any event while disabled?
      this._hasEventInSielence = false;
      this.emitEvent();
    }

  }
}

export class McDatesComponent implements ng.IComponentOptions {

  public static NAME: string = 'mcDates';
  public static $inject: Array<string> = ['moment'];
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
