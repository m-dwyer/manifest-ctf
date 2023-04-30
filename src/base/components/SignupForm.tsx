import { useState } from "react";

import { signUp } from "@/base/queries/authentication";
import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";
import { useRouter } from "next/router";
import { FieldValues } from "react-hook-form";
import { signupSchema } from "@/base/dto/Signup";
import type { Signup } from "@/base/dto/Signup";

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (data: FieldValues) => {
    const { user, error } = await signUp(data as Signup);

    if (error) {
      setError(error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Sign up</div>
          {error != null && <div>{error}</div>}
          <Form schema={signupSchema} submitHandler={handleSignup}>
            <>
              <InputField name="email" type="email" />
              <InputField name="password" type="password" />
              <InputField
                name="confirmPassword"
                label="confirm"
                type="password"
              />
              <button className="btn mt-10" type="submit">
                submit
              </button>
            </>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
