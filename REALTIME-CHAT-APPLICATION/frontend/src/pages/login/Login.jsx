import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin.jsx";

const login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const { loading, login, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // useLogin now accepts: login(username, password, role)
    await login(username.trim(), password, role);
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg  shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          {" "}
          Login
          <span className="text-blue-500"> ChatApp</span>
        </h1>
        <div className="text-sm text-center text-gray-200 mt-2">
          Logging in as:{" "}
          <span className="font-semibold capitalize">{role}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Login as
            </p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="radio radio-primary"
                />
                <span>Customer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="artisan"
                  checked={role === "artisan"}
                  onChange={(e) => setRole(e.target.value)}
                  className="radio radio-primary"
                />
                <span>Artisan</span>
              </label>
            </div>
          </div>

          <Link
            to="/signup"
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            {"Don't"} have an account?
          </Link>
          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-3" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default login;

//STARTER CODE FOR THE FILE
// const login = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
//         <div className="w-full p-6 rounded-lg  shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
//             <h1 className="text-3xl font-semibold text-center text-gray-300"> Login
//                 <span className="text-blue-500"> ChatApp</span>
//             </h1>

//             <form>
//                 <div>
//                     <label className="label p-2">
//                         <span className="text-base label-text">Username</span>
//                     </label>
//                     <input
//                     type="text"
//                     placeholder="Enter username"
//                     className="w-full input input-bordered h-10"/>
//                 </div>

//                 <div>
//                     <label className="label p-2">
//                         <span className="text-base label-text">Password</span>
//                     </label>
//                     <input
//                     type="password"
//                     placeholder="Enter password"
//                     className="w-full input input-bordered h-10"/>
//                 </div>

//                 <a href="#" className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
//                     {Dont} have an account?
//                 </a>
//                 <div>
//                     <button className="btn btn-block btn-sm mt-2">Login</button>
//                 </div>

//             </form>
//         </div>
//     </div>
//   )
// }

// export default login;
