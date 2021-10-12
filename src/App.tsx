import React, { useState } from 'react';
import './App.css';
import { CountryModel } from './CountryModel'
import MUIDataTable from "mui-datatables";
import Grid from '@mui/material/Grid';
import {
  useQuery,
  gql
} from "@apollo/client";

// Set the graph query
const myCountries = gql`
  {
    countries{
      name
      code
      capital
      currency
      emoji
    }
  }
`;

function App() {
  const [country, setCount] = useState('None selected');
  // create empty array bound to CountryModel
  let countriesArrayReal: CountryModel[] = [];
  let countriesArray: CountryModel[] = [];
  
  // Call graph query for data
  const { loading, error, data } = useQuery(myCountries);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // Create an Array of the countries returned from the graphQL into the model we have created
  countriesArray = data.countries;
  countriesArray.forEach((element: any) => {
    let country = new CountryModel (element.name, element.code, element.capital, element.currenmcy, element.emoji)
    countriesArrayReal.push(country);
  });

  // Set our Material table options
  // Also here we call a react hook to change the state of the page we are viewing
  const options = {
      searchPlaceholder: "Search Country",
      selectableRowsHideCheckboxes: true,
      // onRowClick: (rowData: any) => CountrySelect( rowData )
      onRowClick: (rowData: any) => setCount( JSON.stringify(rowData[0])),
  }

  // Set table headers
  const columns = ["Name", "Code", "Capital", "Currency", "Flag"];

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={7}>
          {country}
        </Grid>
        <Grid item lg={5} xs={12}>
          <div className="countries-tables">
            <MUIDataTable
              title={"Countries List"}
              options={options}
              data={countriesArray.map(item => {
                return [
                    item.name,
                    item.code,
                    item.capital,
                    item.currency,
                    item.emoji,
                ]
              })}
              columns={columns}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
