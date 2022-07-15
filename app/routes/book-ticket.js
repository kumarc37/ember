import Route from '@ember/routing/route';

export default class BookTicketRoute extends Route {
  async model(params) {
    //fetching the flight details for booking based on id
    const flight = await fetch(
      `https://2e6nmxmr5k.execute-api.us-east-1.amazonaws.com/Prod/api/flights/${params.flightid}`
    )
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => {
        console.log(err);
      });
    console.log(flight);
    return flight;
  }
}
