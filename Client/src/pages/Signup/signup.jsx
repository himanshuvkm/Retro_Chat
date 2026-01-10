import { Link } from "react-router-dom";
import GenderCheckbox from "./Gender-checkbox";
import { useState } from "react";
import useSignUp from "../../Hooks/useSignup";

const SignUp = () => {
  const [inputs, setinputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignUp();

  const handlecheckboxChange = (gender) => {
    setinputs({ ...inputs, gender });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(inputs);
  };

return (
  <div className="min-h-screen w-full bg-[var(--desktop-bg)] flex items-center justify-center">
    <div className="retro-window w-[460px] bg-[var(--window-bg)]">

      <div className="window-header">
        <span>🧑‍🚀 Create Account</span>
        <div className="window-dots">
          <span className="dot bg-red-400"></span>
          <span className="dot bg-yellow-400"></span>
          <span className="dot bg-green-400"></span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-center text-[var(--text-main)]">
          Join Retro_Chat
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

  <div className="retro-field">
    <input
      type="text"
      placeholder="Full Name"
      className="retro-input w-full"
      value={inputs.fullName}
      onChange={(e) => setinputs({ ...inputs, fullName: e.target.value })}
      required
    />
  </div>

  <div className="retro-field">
    <input
      type="text"
      placeholder="Username"
      className="retro-input w-full"
      value={inputs.username}
      onChange={(e) => setinputs({ ...inputs, username: e.target.value })}
      required
    />
  </div>

  <div className="retro-field">
    <input
      type="password"
      placeholder="Password"
      className="retro-input w-full"
      value={inputs.password}
      onChange={(e) => setinputs({ ...inputs, password: e.target.value })}
      required
    />
  </div>

  <div className="retro-field">
    <input
      type="password"
      placeholder="Confirm Password"
      className="retro-input w-full"
      value={inputs.confirmPassword}
      onChange={(e) =>
        setinputs({ ...inputs, confirmPassword: e.target.value })
      }
      required
    />
  </div>

  <div className="">
    <GenderCheckbox
      onChangebox={handlecheckboxChange}
      selectedGender={inputs.gender}
    />
  </div>

  <button
    type="submit"
    className="retro-button w-full"
    disabled={loading}
  >
    {loading ? "Creating..." : "Create Account"}
  </button>

  <p className="text-sm text-center text-[var(--text-muted)]">
    Already have an account?{" "}
    <Link to="/login" className="retro-link">
      Login
    </Link>
  </p>

</form>

      </div>
    </div>
  </div>
);



};

export default SignUp;