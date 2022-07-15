import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class BookTicketController extends Controller {
  @service router;
  @tracked passengersArr = [];
  @tracked adminBtn = false;
  
  // function to show PNR number after successful booking
  @action
  showModal() {
    document.getElementById('pnrModal').style.display = 'block';
  }

  // function to redirect to home page after successful booking
  @action
  hideModal() {
    document.getElementById('pnrModal').style.display = 'none';
    this.router.transitionTo('index');
  }

  // function to ftech the number of passengers and validating  it
  @action
  changeHandler(event) {
    if (event.target.value > 5)
    {
      alert('You can only add 5 passengers at once...');
      event.target.value=''
    }
    else if (event.target.value == '')
    {
      event.target.value=''
    }
    else if (event.target.value == 0)
    {
      alert('Atleast one passenger should be there...');
      event.target.value=''
    }
    else {
      this.passengersArr = [];
      for (let i = 1; i <= event.target.value; i++) {
        this.passengersArr.push(i);
      }
    }
  }

  // function to validate the ticket booking form
  validate() {
    //code validation for empty fields
    const elements = document.getElementsByClassName('passengers-required');
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value === '') {
        elements[i].style.border = '2px solid red';
        return false
      }
    }

    //code validation for mobile number
    var numFormat = /^[6-9]\d{9}$/;
    const mobileNo = document.getElementById('mobileno').value;
    if(!mobileNo.match(numFormat))
    {
      alert('Please provide a valid mobile number...');
      return false;
    }

    //code validation for mail
    //var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let mailformat = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    const mail = document.getElementById('email').value;
    if(!mailformat.test(mail))
    {
      alert('Please provide a valid mail...');
      return false;
    }

    return true;
  }

  // function to remove the red border on focussing the element
  onFocus(event) {
    console.log(event);
    event.target.style.border = '1px solid #ced4da';
  }

  //function to save the booking details
  @action
  async saveDetails() {
    if (this.validate()) {//calling validate function
      window.scrollTo(0, 0);
      document.getElementById('loading').classList.remove('HIDE');
      const passengers = [];
      //fetching each passenger details.
      for (let i = 1; i <= this.passengersArr.length; i++) {
        const passenger = {
          name: document.getElementById(`name${i}`).value,
          age: document.getElementById(`age${i}`).value,
          gender: document.getElementById(`gender${i}`).value,
        };
        passengers.push(passenger);
      }
      //generating the random PNR number
      const PNR = Math.floor(Math.random() * 9000000000) + 1000000000;
  
      const body = {
        email: document.getElementById('email').value,
        noOfPassengers: document.getElementById('passeengers').value,
        mobileNo: document.getElementById('mobileno').value,
        passengers: JSON.stringify(passengers),
        pnrNumber: PNR,
      };
      const booking_details = await fetch(
        'https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/tickets',
        {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          document.getElementById('loading').classList.add('HIDE');
          this.showModal();
          document.getElementById('body-container').style.filter = 'blur(3px)';
          document.getElementById('pnrNumber').innerText = data.pnrNumber;
          this.passengersArr=[]
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
