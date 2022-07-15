import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FlightsController extends Controller {
  queryParams = ['from', 'destination', 'date'];
  from = null;
  destination = null;
  date = null;
  @tracked adminBtn = false;
  @service router;

  //function to redirect to the booking page based on id of flight
  @action
  bookATicket(id) {
    this.router.transitionTo(`/bookticket/${id}`);
  }
}
