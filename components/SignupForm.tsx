const SignupForm = () => {
  return (
    <div className="container mx-auto">
      <div className="card w-96 bg-primary text-primary-content mx-auto">
        <div className="card-body">
          <div className="card-title">Sign up</div>
          <div>asd</div>
          <form className="form-control">
            <label className="label" htmlFor="username">
              username
            </label>
            <input
              className="input"
              type="text"
              id="username"
              name="username"
            ></input>
            <label className="label" htmlFor="password">
              password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
            ></input>
            <label className="label" htmlFor="confirmPassword">
              confirm
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
            ></input>
            <button className="btn mt-10" type="submit">
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
