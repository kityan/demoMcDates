import { module, element, bootstrap } from 'angular';
import { AppComponent } from '../app/app.component';
import { McDatesComponent } from '../app/mc-dates.component';
import { Moment } from 'moment';
import './app.less';

export let app = module('app', ['angularMoment', 'ngMaterial', 'ngAnimate', 'ngAria'])

  .config(['$mdDateLocaleProvider', 'moment', ($mdDateLocaleProvider: any, moment: any): void => {
    $mdDateLocaleProvider.shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;
     $mdDateLocaleProvider.formatDate = (date: Date): string => {
      let m: Moment = moment(date);
      return m.isValid() ? m.format('DD.MM.YYYY') : null;
    };
    $mdDateLocaleProvider.parseDate = function (dateString: string): Date {
      var m: Moment = moment(dateString, 'DD.MM.YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  }])

  .component(AppComponent.NAME, new AppComponent())
  .component(McDatesComponent.NAME, new McDatesComponent());

element(document).ready(() => {
  bootstrap(document, ['app']);
});
