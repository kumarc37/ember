import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
export default class HeaderComponent extends Component {
  @service('admin-creds') creds;
  
  // function to show login form
  @action
  showModal() {
    document.getElementById('myModal').style.display = 'block';
  }

  // function to hide login form
  @action
  hideModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  // function to logout
  @action
  logout() {
    this.creds.clearCreds();
    localStorage.removeItem('token');
    document.cookie =
      'token=John Smith; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/';
  }
  clearFields() {
    (document.getElementById('username').value = ''),
      (document.getElementById('password').value = '');
  }
  //function to validate the form
  validate() {
    let flag = true;
    const elements = document.getElementsByClassName('admin-required');
    console.log(elements);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].value === '') {
        elements[i].style.border = '2px solid red';
        flag = false;
      }
    }
    return flag;
  }

  //function to remove the red border after focussing it
  onFocus(event) {
    console.log(event);
    event.target.style.border = '1px solid #ced4da';
  }

  //function to login admin
  @action
  async verifyAdminDetails() {
    if (this.validate()) {
      document.getElementById('loading').classList.remove('HIDE');
      const body = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      };
      const response = await fetch(
        'https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/admin/login',
        {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
        .then((res) => res.json())
        .then((data) => data);
      if (response.status === 'success') {
        this.creds.setCreds(response.token);
        //localStorage.setItem('token', response.token);
        this.creds.setCookie('token', response.token);
        this.hideModal();
        this.clearFields();
        document.getElementById('loading').classList.add('HIDE');
      } else {
        alert('Please provide valid credentials');
        document.getElementById('loading').classList.add('HIDE');
      }
    }
  }
}
