import { useState, SyntheticEvent } from "react";

import { InputState } from "@/common/hooks/useMultiInputs";
import { signUp } from "@/base/queries/authentication";
import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: SyntheticEvent, formData: InputState) => {
    event.preventDefault();

    if (formData.confirm !== formData.password) {
      alert("Passwords do not match");
      return;
    }

    const { user, session, error } = await signUp(
      formData.email,
      formData.password
    );

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Sign up</div>
          {error != null && <div>{error}</div>}
          <Form submitHandler={handleSignup}>
            {(formData, setFormData) => (
              <>
                <InputField
                  name="email"
                  type="email"
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
                <InputField
                  name="confirmPassword"
                  label="confirm"
                  type="password"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ confirm: e.target.value })}
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

export default SignupForm;
