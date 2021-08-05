import React, { Component } from 'react';
import Login from './component/Login';
import SucessMessage from './component/SuccessMessage';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    complete: false,
    firstName: '',
    mockAPI: {},
  };

  async componentDidMount() {
    const data = await fetch(
      'https://610ac3d652d56400176aff81.mockapi.io/alien-test'
    ).then((res) => res.json());
    this.setState({ mockAPI: data });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ complete: true });
    document.cookie = `firstName=${this.state.firstName}`;
  };

  handleInput = (e) => {
    this.setState({ firstName: e.currentTarget.value });
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 data-testid='h1' className='App-title'>
            Welcome to React
          </h1>
          <nav data-testid='navbar' className='navbar' role='navigation'>
            <ul>
              <li data-testid='navBarLi' className='nav-li'>
                <div href='#'>Home</div>
              </li>
              <li data-testid='navBarLi' className='nav-li'>
                <div href='#'>About</div>
              </li>
              <li data-testid='navBarLi' className='nav-li'>
                <div href='#'>Skills</div>
              </li>
              <li data-testid='navBarLi' className='nav-li'>
                <div href='#'>Works</div>
              </li>
            </ul>
          </nav>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h3 data-testid='mockAPI'>
            {this.state.mockAPI
              ? 'Received mock data!'
              : 'Something went wrong'}
          </h3>
          {this.state.complete ? (
            <SucessMessage />
          ) : (
            <Login submit={this.handleSubmit} input={this.handleInput} />
          )}
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
