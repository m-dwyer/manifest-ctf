import { useState, MouseEvent, SyntheticEvent } from "react";
import { useRouter } from "next/router";

import { InputState, useMultiInputs } from "@/lib/hooks/useMultiInputs";
import { login } from "@/services/authentication";
import { Form } from "@/components/Form";
import { InputField } from "./InputField";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: SyntheticEvent, formData: InputState) => {
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
          <Form submitHandler={handleLogin}>
            {(formData, setFormData) => (
              <>
                <InputField
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ email: e.target.value });
                  }}
                />
                <InputField
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ password: e.target.value });
                  }}
                />
                <button className="btn mt-10" type="submit">
                  submit
                </button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
