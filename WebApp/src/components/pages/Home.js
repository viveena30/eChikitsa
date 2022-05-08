import React from 'react'
import Navbar from '../Navbar/Navbar';
import Chatbot from '../Chatbot';
// import TakeAppointment from './TakeAppointment';
// import ReactComponent from 'svelte-react';
// import SveltePage from '../chatapp/Page.svelte';

const Home = () => {
  return (
    <>
      <Navbar />
      <Chatbot />
      {/* <ReactComponent this={SveltePage} /> */}
    </>
  )
}

export default Home

