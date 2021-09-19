import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
import './index.css';
import Router from "./routers/AppRouter";
// import App from './App';

const storage = (
  <ChakraProvider>
    <Router />
  </ChakraProvider>
)

const renderApp = () => {
  ReactDOM.render(
    storage, 
    document.getElementById('root'));
}

renderApp();