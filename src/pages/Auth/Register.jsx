import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate, Link } from "react-router-dom";
import { config } from '../../hook/config';
import { useState } from 'react';

function Register() {
    const navigate = useNavigate();
    const [serverMessage, setServerMessage] = useState("");

    const validate = values => {
        const errors = {};

        if (!values.name) errors.name = 'Name is required';
        else if (values.name.length < 2) errors.name = 'Name must be at least 2 characters';

        if (!values.email) errors.email = 'Email is required';
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
            errors.email = 'Invalid email address';

        if (!values.password) errors.password = 'Password is required';
        else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';

        if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';

        if (!values.mobile) errors.mobile = 'Mobile number is required';
        else if (!/^[0-9]{10}$/i.test(values.mobile)) errors.mobile = 'Mobile number must be 10 digits';

        return errors;
    };

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '', confirmPassword: '', mobile: '' },
        validate,
        onSubmit: async (values) => {
            setServerMessage(""); // reset message
            try {
                const { confirmPassword, ...submitData } = values;
                const res = await axios.post(`${config.api}/register`, submitData);

                // Show success message
                setServerMessage("Registration successful! You can now login.");
                formik.resetForm();

                // Redirect after a short delay
                setTimeout(() => navigate("/"), 1500);

            } catch (error) {
                console.error(error);
                if (error.response && error.response.data && error.response.data.message) {
                    setServerMessage(error.response.data.message); // show backend error
                } else {
                    setServerMessage("Registration failed. Please try again.");
                }
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                <form onSubmit={formik.handleSubmit} className="px-8 py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

                    {serverMessage && (
                        <div className={`p-3 mb-5 rounded-lg text-sm text-center ${
                            serverMessage.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                            {serverMessage}
                        </div>
                    )}

                    {/* Name */}
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Create a password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm your password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your mobile number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.mobile}
                        />
                        {formik.touched.mobile && formik.errors.mobile && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.mobile}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Register
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
