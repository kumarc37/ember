import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class AdminSectionComponent extends Component {
  @service('admin-creds') creds;
  @tracked disableDate = false;

  // function to show the form while creating flight
  @action
  showForm() {
    const element = document.getElementById('formflight');
    element.classList.remove('HIDE');
  }

  // function to hide the form
  @action
  hideForm() {
    const element = document.getElementById('formflight');
    element.classList.add('HIDE');
    this.clearForm();
  }

  //function to clear the input fields
  @action
  clearForm() {
    (document.getElementById('airline').value = ''),
      (document.getElementById('startdate').value = ''),
      (document.getElementById('enddate').value = ''),
      (document.getElementById('starttime').value = ''),
      (document.getElementById('droppingtime').value = ''),
      (document.getElementById('from').value = ''),
      (document.getElementById('destination').value = ''),
      (document.getElementById('flightno').value = ''),
      (document.getElementById('price').value = '');
  }

  //function to validate the form
  validate() {
    let flag = true;
    const elements = document.getElementsByClassName('input-required');
    const from = document.getElementById('from').value;
    const destination = document.getElementById('destination').value;
    console.log(elements);
    // code validation for mandatory fields
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value === '') {
        elements[i].style.border = '2px solid red';
        return false;
      }
    }
    // code validation for source and destination
    if(from==destination)
    {
      alert('Source and destination should not be the same...');
      return false;
    }
    //code validation for date fields
    return true;
  }

  //function to remove the red border after focussing it
  onFocus(event) {
    event.target.style.border = '1px solid #ced4da';
  }

  // function to disable the past dates in start date
  onMouseOver = () =>{
    if (!this.disableDate) {
      var dtToday = new Date();
      var month = dtToday.getMonth() + 1;
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if (month < 10) month = '0' + month.toString();
      if (day < 10) day = '0' + day.toString();
      var minDate = year + '-' + month + '-' + day;
      document.getElementById('startdate').setAttribute('min', minDate);
      this.disableDate = true;
    }
  }

  // function to disable the past dates in end date as start date
  changeHandler = () =>{
    document.getElementById('enddate').removeAttribute('disabled');
    document.getElementById('enddate').value='';
    const from = document.getElementById('startdate').value;
    document.getElementById('enddate').setAttribute('min', from);
  }

  // function to add the flight
  @action
  async saveFlight(event) {
    event.preventDefault();
    if (this.validate()) {
      document.getElementById('loading').classList.remove('HIDE');
      const body = {
        airline: document.getElementById('airline').value,
        serviceStartDate: document.getElementById('startdate').value,
        serviceEndDate: document.getElementById('enddate').value,
        startTime: document.getElementById('starttime').value,
        droppingTime: document.getElementById('droppingtime').value,
        from: document.getElementById('from').value,
        destination: document.getElementById('destination').value,
        flightNumber: document.getElementById('flightno').value,
        price: document.getElementById('price').value,
      };
      console.log(body);
      const token = this.creds.getCookie('token');
      if (token == '') {
        alert('Session expired... please login again.');
        document.getElementById('loading').classList.add('HIDE');
        return;
      }
      const addedFlight = await fetch(
        'https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/flights',
        {
          method: 'post',
          headers: {
            'content-type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(body),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          alert('Flight added successfully...');
          this.clearForm();
          this.hideForm();
          document.getElementById('loading').classList.add('HIDE');
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.creds.addFlight(addedFlight);
    }
  }

  //function to delete the flight
  @action
  async deleteFlight(id) {
    if (confirm('Are you sure want to delete it ?')) {
      document.getElementById('loading').classList.remove('HIDE');
      const deleted_id = await fetch(
        `https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/flights/${id}`,
        {
          method: 'delete',
        }
      ).then((res) => {
        alert('Flight deleted successfully...');
      });
      this.creds.removeFlight(id);
      document.getElementById('loading').classList.add('HIDE');
    }
  }
}
