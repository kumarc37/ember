import EmberRouter from '@ember/routing/router';
import config from 'flight-booking-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}
//{ queryParams: ['from','destination','date'] }
Router.map(function () {
  this.route('flights');
  this.route('book-ticket', { path: '/bookticket/:flightid' });
});
