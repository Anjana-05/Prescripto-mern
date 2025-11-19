import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify' // Import toast

const Login = () => {

  const {backendUrl, token, setToken} = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/user/register', {name, password,email}) // Added name to register payload
        if(data.success) {
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success("Registered Successfully") // Added Toastify success message
        } else{
          toast.error(data.message)
        }
      } else { // Handle Login state
        const requestUrl = backendUrl + '/api/user/login';
        const {data} = await axios.post(requestUrl, {email, password})
        if(data.success) {
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success("Logged in Successfully")
        } else {
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <form onSubmit={onSubmitHandler}>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[320px] sm:min-w-[380px] border rounded-2xl shadow-lg bg-white'>
          <p className='text-2xl font-semibold'>
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </p>

          <p className='text-gray-500'>
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
          </p>

          {state === 'Sign Up' && (
            <div className='w-full'>
              <p>Full Name</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type='text'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          )}

          <div className='w-full'>
            <p>Email</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='w-full'>
            <p>Password</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button
            type='submit'
            className='bg-primary text-white w-full py-2 rounded-md text-base mt-3 hover:bg-[#4f46e5] transition'
          >
            {state === 'Sign Up' ? 'Create account' : 'Login'}
          </button>

          {state === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <span
                className='text-primary underline cursor-pointer'
                onClick={() => setState('Login')}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create a new account?{' '}
              <span
                className='text-primary underline cursor-pointer'
                onClick={() => setState('Sign Up')}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
