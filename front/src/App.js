import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './components/temaConfig';
import Main from './components/Main';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
   return (
      <ThemeProvider theme={theme}>
         <Router>
            <Main />
         </Router>
      </ThemeProvider>
   );
}

export default App;
