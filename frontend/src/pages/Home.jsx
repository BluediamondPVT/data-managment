// src/pages/Home.jsx
import React from 'react';
import CustomerAllData from './CustomerAllData'; 
import InputForm from '../pages/Form'; 
import Select from 'react-select';

const Home = () => {
//   const options = [
//   { value: 'apple', label: 'Apple' },
//   { value: 'banana', label: 'Banana' },
// ];
  return (
    <div className="container mt-5">
      {/* <h2>Home Page</h2>
      <div className="row">
    <div className="col-md-6">

      <Select options={options} isSearchable />
    </div>
    
      </div> */}
      {/* <p>Welcome to the app!</p> */}
      <CustomerAllData />

{/* <div className="row">
  <div className="col-md-12">

<InputForm />
  </div>
</div> */}


    </div>
    
  );
};

export default Home;