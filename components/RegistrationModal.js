import axios from "axios"
import { useState } from "react"
import { useStoreActions } from "easy-peasy"

const RegistrationModal = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const setUser = useStoreActions((actions) => actions.user.setUser)
  const setHideModal = useStoreActions((actions) => actions.modals.setHideModal)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        passwordConfirmation,
      })

      if (response.data.status === "error") {
        alert(response.data.message)
        return
      }

      setUser(email)
      setHideModal()
    } catch (error) {
      alert(error.response.data.message)
      return
    }
  }

  return (
    <>
      <h2>Sign up</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            id='email'
            type='email'
            placeholder='Email address'
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id='password'
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            id='passwordConfirmation'
            type='password'
            placeholder='Enter password again'
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button>Sign up</button>
        </form>
      </div>
      <p>
        Already have an account?{" "}
        <a href='#' onClick={() => props.showLogin()}>
          Log in
        </a>
      </p>
    </>
  )
}

export default RegistrationModal
