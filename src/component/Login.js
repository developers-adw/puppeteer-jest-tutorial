import React from 'react';

export default function Login(props) {
  return (
    <div className='login-page'>
      <div className='form-group'>
        <form onSubmit={props.submit} className='login-form'>
          <input
            data-testid='firstName'
            type='text'
            placeholder='First Name'
            onChange={props.input}
          ></input>
          <input
            data-testid='lastName'
            type='text'
            placeholder='Last Name'
          ></input>
          <input data-testid='email' type='text' placeholder='Email'></input>
          <input
            data-testid='password'
            type='password'
            placeholder='password'
          ></input>
          <button data-testid='submit'>login</button>
        </form>
      </div>
    </div>
  );
}
