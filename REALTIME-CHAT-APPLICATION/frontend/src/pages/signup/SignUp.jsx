import useSignup from "../../hooks/useSignup";
import { Link } from "react-router-dom";
import { useState } from "react";
const SignUp = () => {
  const [input, setInput] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, signup } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(input);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg  shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
        <h1 className="text-3xl font-semibold text-center text-gray-100 mb-6">
          Sign Up <span className="text-blue-500">ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {/* empty input field for the full name */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-borderd h-10"
              value={input.fullName}
              onChange={(e) => setInput({ ...input, fullName: e.target.value })}
            />
          </div>

          {/* empty input for username*/}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-borderd h-10"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
            />
          </div>

          {/* empty inputs for password input*/}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Passord</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-borderd h-10"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
          </div>

          {/* empty inputs for password confirmation*/}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-borderd h-10"
              value={input.confirmPassword}
              onChange={(e) =>
                setInput({ ...input, confirmPassword: e.target.value })
              }
            />
          </div>

          <Link
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
            to={"/login"}
          >
            Already have an account?
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2 border-slate-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            {/* The code above is a conditional rendering that shows a loading spinner when the signup process is in progress, and the "Sign Up" text when it's not. The button is also disabled during loading to prevent multiple submissions. */}
            {/* When the user clicks the "Sign Up" button, the handleSubmit function is called, which in turn calls the signup function from the useSignup hook with the current input state. The loading state is managed within the useSignup hook, and it updates based on the status of the signup process. */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
//           <div>
//             <label className="label p-2">
//               <span className="text-base label-text">Full name</span>
//             </label>
//             <input
//             type="text"
//             placeholder="John Doe"
//             className="w-full input input-borderd h-10"/>
//           </div>

//           {/* empty input for username*/}
//           <div>
//             <label className="label p-2">
//               <span className="text-base label-text">Username</span>
//             </label>
//             <input
//             type="text"
//             placeholder="John Doe"
//             className="w-full input input-borderd h-10"/>
//           </div>

//           {/* empty inputs for password input*/}
//           <div>
//             <label className="label p-2">
//               <span className="text-base label-text">Passord</span>
//             </label>
//             <input
//             type="password"
//             placeholder="Enter Password"
//             className="w-full input input-borderd h-10"/>
//           </div>

//           {/* empty inputs for password confirmation*/}
//           <div>
//             <label className="label p-2">
//               <span className="text-base label-text">Confirm Password</span>
//             </label>
//             <input
//             type="password"
//             placeholder="Confirm Password"
//             className="w-full input input-borderd h-10"/>
//           </div>

//           {/* GENDER CHECKBOX */}
//           <GenderCheckbox/>
//           <a className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"  href="#">
//             Already have an account?
//           </a>
//           <div>
//             <button className="btn btn-block btn-sm mt-2 border-slate-700">Sign Up</button>
//           </div>

//         </form>

//       </div>
//     </div>
//   )
// }

// export default SignUp
