import React from 'react'

const Login :React.FC = () => {
  return (
    <div>
      <h1>Sign in</h1>
      <input type='text' placeholder='username'/>
      <input type="password" placeholder='password'/>
      <label htmlFor='remember-me'>Remember me</label>
      <input type='checkbox' id='remember-me'/>
      <a href=''>Forgot password</a>
      <button>Log in</button>
    </div>
  )
}

export default Login