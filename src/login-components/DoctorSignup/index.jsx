import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

const DoctorSignup = () => {
	const [data, setData] = useState({
		Name: "",
		email: "",
		password: "",
        registrationId:""
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className="signup_container">
			<div className="header-container">
				<div className="logo-container">
					<p className="title"><span>e-</span>Chikitsa</p>
				</div>
			</div>
			<div className="signup_form_container">
				<form className="form_container" onSubmit={handleSubmit}>
					<label>Name</label>
					<input
						type="text"
						placeholder="Enter your Name"
						name="Name"
						onChange={handleChange}
						value={data.Name}
						required
						className="input-field"
					/>
					<label>email</label>
					<input
						type="email"
						placeholder="johndoe@gmail.com"
						name="email"
						onChange={handleChange}
						value={data.email}
						required
						className="input-field"
					/>
					<label>registration ID</label>
					<input
						type="text"
						placeholder="G12345"
						name="registration"
						onChange={handleChange}
						value={data.registrationId}
						required
						className="input-field"
					/>
					<label>Password</label>
					<input
						type="password"
						placeholder="****************"
						name="password"
						onChange={handleChange}
						value={data.password}
						required
						className="input-field"
					/>
					{error && <div className="error_msg">{error}</div>}
					<button type="submit" className="signup-btn">
						Sing Up
					</button>
				</form>
			</div>
			<div className="login-line">
				<p>Already have an account?</p>
				<Link to="/login">
					<div type="button" className="login-btn">
						Login
					</div>
				</Link>
			</div>
		</div>
	);
};

export default DoctorSignup;