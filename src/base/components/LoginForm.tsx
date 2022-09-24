import { useState } from "react";
import { useRouter } from "next/router";

import { Form } from "@/common/components/Form";
import { InputField } from "@/common/components/InputField";
import { FieldValues } from "react-hook-form";
import { login } from "@/base/queries/authentication";
import { loginSchema } from "@/base/schemas/login";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: FieldValues) => {
    const { error } = await login(data.email, data.password);
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
          <div className="card-title">Log in</div>
          {error != null && <div data-testid="login-error">{error}</div>}
          <Form schema={loginSchema} submitHandler={handleLogin}>
            <>
              <InputField type="text" name="email" />
              <InputField type="password" name="password" />
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

export default LoginForm;
