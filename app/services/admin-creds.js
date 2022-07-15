import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AdminCredsService extends Service {
  @tracked isAdmin = false;
  @tracked token = '';
  @tracked flights = [];
  setCreds(tok) {
    this.isAdmin = true;
    this.token = tok;
  }
  clearCreds() {
    this.isAdmin = false;
    this.token = '';
  }
  setFlights(flights_data) {
    this.flights = flights_data;
  }
  addFlight(flight) {
    this.flights = [...this.flights, flight];
  }
  removeFlight(id) {
    const flights = this.flights.filter((flight) => flight.id !== id);
    this.flights = flights;
  }
  setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }
  getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}
