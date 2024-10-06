import { ChangeEvent, FormEvent, useState } from "react";
import axios from "../api/axios";
import { login, UserData } from "../storeAndSlices/UserSlice";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const loginFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
        withCredentials: true,
      };
      const response = await axios.post(
        "/api/v1/users/login",
        { email, password },
        config
      );
      const data = response?.data?.data;
      console.log(data);
      const userData: UserData = {
        token: data.accessToken,
        _id: data.userData._id,
        name: data.userData.name,
        lastname: data.userData.lastname,
        email: data.userData.email,
        profileImg: data.userData.profileImg,
        followers: data.userData.followers,
        following: data.userData.following,
        isAuthenticated: true,
      };
      dispatch(login(userData));
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-2/4 flex flex-col items-center border-2 py-3 px-8 bg-slate-300 rounded-xl border-gray-600 ">
        <h3 className="text-3xl ">LOGIN</h3>
        <form
          onSubmit={loginFormSubmit}
          className="w-full flex flex-col gap-4 py-2"
        >
          <label htmlFor="email" className="hidden"></label>
          <input
            placeholder="email"
            name="email"
            id="email"
            type="text"
            autoComplete="true"
            value={email}
            onChange={emailHandler}
            className="py-2 px-3 text-xl font-normal border-black border rounded-lg text-center bg-slate-200"
          />
          <label htmlFor="password" className="hidden"></label>
          <input
            placeholder="password"
            name="password"
            id="password"
            type="text"
            autoComplete="false"
            value={password}
            onChange={passwordHandler}
            className="py-2 px-3 text-xl font-normal border-black border rounded-lg text-center bg-slate-200"
          />
          <button
            type="submit"
            className="py-2 px-3 text-xl font-normal shadow-md bg-gray-950 text-white rounded-lg"
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
