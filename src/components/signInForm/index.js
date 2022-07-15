import {useState, useContext} from "react"

import FormInput from "../formInput/index"
import Button from "../button/index"

import {UserContext} from "../../contexts/user"

import {
  createUserDocumentFromAuth, 
  signInWithGooglePopup, 
  signInAuthUserWithEmailAndPassword
} from "../../utils/firebase"

import "../../styles/signInForm.scss"

const defaultFormFields = {
  email: "",
  password: ""
}

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields)
  const {email, password} = formFields

  const {setCurrentUser} = useContext(UserContext)

  const resetFormFields = () => {
    setFormFields(defaultFormFields)
  }

  const signInWithGoogle = async () => {
    const {user} = await signInWithGooglePopup()
    await createUserDocumentFromAuth(user)
    setCurrentUser(user)
  }

  const handleChange = (event) => {
    const {name, value} = event.target

    setFormFields({...formFields, [name]: value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      const {user} = await signInAuthUserWithEmailAndPassword(
        email, 
        password
      )
      setCurrentUser(user)

      resetFormFields()
    }catch(err){
      switch(err.code){
        case "auth/wrong-password":
          alert("incorrect password for email")
          break
      
        case "auth/user-not-found":
          alert("no user associated with this email")
          break
        default:
          console.log(err)
      }
    }
  }

  return(
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email" 
          required 
          onChange={handleChange} 
          name="email" 
          value={email}
        />

        <FormInput
          label="Password"
          type="password" 
          required 
          onChange={handleChange} 
          name="password" 
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>Google Sign In</Button>
        </div>
      </form>
    </div>
  )
}

export default SignInForm