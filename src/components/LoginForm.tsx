import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";

import { useMultiInputs } from "@lib/hooks/useMultiInputs";
import { login } from "@services/authentication";

const LoginForm = () => {
  const [formData, setFormData] = useMultiInputs({ email: "", password: "" });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: MouseEvent) => {
    e.preventDefault();

    const { error } = await login(formData.email, formData.password);
    if (error) {
      setError(error.message);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Log in </div>
          {error != null && <div>{error}</div>}
          <form className="form-control">
            <label className="label" htmlFor="email">
              email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              onChange={(e) => setFormData({ email: e.target.value })}
            ></input>
            <label className="label" htmlFor="password">
              password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              onChange={(e) => setFormData({ password: e.target.value })}
            ></input>
            <button className="btn mt-10" type="submit" onClick={handleLogin}>
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
