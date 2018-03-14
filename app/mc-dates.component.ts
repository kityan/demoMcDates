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
  public dateFrom: string;
  public dateTo: string;
  public mcPlaceholder: string;
  public mcChange: (obj: object) => any;
  private _dateFrom: Date | string;
  private _dateTo: Date | string;
  private moment: any;
  private _presets: typeof Presets;

  constructor(moment: any, $scope: any) {
    this._presets = Presets;
    this.moment = moment;
    $scope.$watchGroup(['$ctrl.dateFrom', '$ctrl.dateTo'], this._getBindings.bind(this));
    $scope.$watchGroup(['$ctrl._dateFrom', '$ctrl._dateTo'], this._setBindings.bind(this));
  }

  _getBindings(): void {
    ['dateFrom', 'dateTo'].forEach((name: string) => {
      let m: Moment = this.moment(this[name]);
      this['_' + name] = (m.isValid()) ? m.toDate() : null;
    });
  }

  _setBindings(newValues: Array<Date>, oldValues: Array<Date>, c): void {
    let changed: boolean = false;
    ['dateFrom', 'dateTo'].forEach((name: string) => {
      let m: Moment = this.moment(this['_' + name]);
      let prev: string = (this[name]) ? this[name] : null;
      this[name] = (m.isValid()) ? m.format('YYYY-MM-DD') : null;
      changed = (prev !== this[name]) ? true : changed;
    });
    if (changed) {
      this.mcChange({ from: this._dateFrom, to: this._dateTo });
    }

  }

  applyPreset(preset: string | number): void {
    let m: Moment = this.moment();
    switch (preset) {
      case this._presets.YESTERDAY:
        m.subtract('1', 'day');
        this._dateFrom = m.toDate();
        this._dateTo = m.toDate();
        break;
      case this._presets.TODAY:
        this._dateFrom = m.toDate();
        this._dateTo = m.toDate();
        break;
      case this._presets.TWOWEEKS:
        this._dateTo = m.toDate();
        this._dateFrom = m.subtract('14', 'day').toDate();
        break;
      case this._presets.MONTH:
        this._dateTo = m.toDate();
        this._dateFrom = m.subtract('1', 'month').toDate();
        break;
      case this._presets.ALL:
        this._dateTo = null;
        this._dateFrom = null;
        break;
    }
  }
}

export class McDatesComponent implements ng.IComponentOptions {

  public static NAME: string = 'mcDates';
  public static $inject: Array<string> = ['moment', '$scope'];
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
