import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';
import Masthead from './Masthead';

import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Pythag from './components/Pythag-mobile';

function withNav(MyComponent, title) {

  return function(...props) {

    return (
    <>
      <Masthead title={title} />
      <main>
        <MyComponent {...props} />
      </main>
    </>
    );
  }
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Switch>
        <Route exact path="/" component={withNav(Home, 'Home')} />
        <Route path="/pythag" component={withNav(Pythag, 'Pythagorean Toy')} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
