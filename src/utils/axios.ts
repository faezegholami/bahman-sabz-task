const api = process.env.NEXT_PUBLIC_URL;

export const API_ENDPOINTS = {
  auth: {
    login:`${api}/auth/login`

  },
  main: {
    // getCountries: `${api}/location/Country`,
    // getStates: (id: number) =>
    //   `${api}/location/State/ByCountry/${id}`,
  }
};