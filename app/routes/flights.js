import Route from '@ember/routing/route';
export default class FlightsRoute extends Route {
  async model(queryParams) {
    //document.getElementById('loading').classList.remove('HIDE');
    const modelData = {};
    // reading query params to fetch the flights
    modelData.params = queryParams;
    const body = queryParams;
    const searchedFlights = await fetch(
      'https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/searchflights',
      {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => {
        console.log(err);
      });
    
      //Calculating travelling duration based upon start and droppting times

    const flights_with_duration = searchedFlights.map((flight) => {
      const start_time_in_minutes_arr = flight.startTime.split(':');
      const start_time_in_minutes =
        +start_time_in_minutes_arr[0] * 60 + +start_time_in_minutes_arr[1];
      const arrived_time_in_minutes_arr = flight.droppingTime.split(':');
      const arrived_time_in_minutes =
        +arrived_time_in_minutes_arr[0] * 60 + +arrived_time_in_minutes_arr[1];
      const minutes = arrived_time_in_minutes - start_time_in_minutes;
      let hours;
      let left_out_minutes = minutes % 60;
      let remaining_mins = minutes - left_out_minutes;
      if (remaining_mins === 0) {
        hours = 0;
      } else {
        hours = remaining_mins / 60;
      }
      if(hours<0) hours+=23;
      if(left_out_minutes<0) left_out_minutes+=60
      const duration = `${hours} hrs ${left_out_minutes} mins`;
      return { ...flight, duration: duration };
    });
    modelData.flights = flights_with_duration;
    if(flights_with_duration.length==0)
      modelData.noFlights = true;
    //document.getElementById('loading').classList.add('HIDE');
    console.log(modelData)
    return modelData;
  }
}
