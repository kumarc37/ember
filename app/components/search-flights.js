import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class SearchFlightsComponent extends Component {
  @tracked flights = [];
  @service router;
  @tracked disableDate = false;
  
  // function to validate the search form
  validate() {
    const elements = document.getElementsByClassName('required');
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    //checking each input field data
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value === '') {
        elements[i].style.border = '2px solid red';
        return false;
      }
    }
    //checking from and to places
    if (from == to) {
      alert('From and To places should not be the same...');
      return false;
    }
    return true;
  }

  //function to remove the red border after focussing it
  onFocus(event) {
    console.log(event);
    event.target.style.border = '1px solid #ced4da';
  }

  //function to disable the past dates and future dates
  onMouseOver = () => {
    if (!this.disableDate) {
      var dtToday = new Date();
      var maxYear;
      var month = dtToday.getMonth() + 1;
      var maxMonth = (month + 3) % 12;
      if (maxMonth < 10) {
        maxMonth = '0' + maxMonth.toString();
      }
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if (month === 10) {
        maxYear = year + 1;
      } else {
        maxYear = year;
      }
      if (month < 10) month = '0' + month.toString();
      if (day < 10) day = '0' + day.toString();

      var minDate = year + '-' + month + '-' + day;
      var maxDate = maxYear + '-' + maxMonth + '-' + day;

      document.getElementById('date').setAttribute('min', minDate);
      document.getElementById('date').setAttribute('max', maxDate);
      this.disableDate = true;
    }
  };

  // function to redirect to search route with query params
  searchFights = async (event) => {
    event.preventDefault();
    if (this.validate()) {
      const body = {
        from: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        date: document.getElementById('date').value,
      };
      document.getElementById('loading').classList.remove('HIDE');
      this.router.transitionTo('flights', {
        queryParams: {
          from: body.from,
          destination: body.destination,
          date: body.date,
        },
      });
      ``;
    }
  };
}
//flights?from=${body.from}&destination=${body.destination}&date=${body.date}
