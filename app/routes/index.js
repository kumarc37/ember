import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class IndexRoute extends Route {
  @service('admin-creds') creds;
  async model() {
    // static cities for source and destination...
    const cities = [
      'Hyderabad',
      'Banglore',
      'Chennai',
      'Mumbai',
      'Delhi',
      'Vijayawada',
      'Vizag',
      'Kurnool',
      'Kadapa',
      'Pune',
    ];
    // reading token if exists and valid
    const token = this.creds.getCookie('token');
    if (token) {
      this.creds.setCreds(true, token);
    }
    // fetching all flights and storing through service
    let flights = await fetch(
      'https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/flights'
    )
      .then((res) => res.json())
      .then((data) => {
        this.creds.setFlights(data);
      })
      .catch((err) => {
        console.log(err);
      });
    return cities;
  }
}
