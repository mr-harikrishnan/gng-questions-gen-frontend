import axios from 'axios';
import { useFormik } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import { config } from '../../hook/config';

function Login() {
    const navigate = useNavigate();

    // Custom validation function
    const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }


        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: async (values) => {
            try {
                let login_res=await axios.post(`${config.api}/login`, values)
                console.log(login_res.data);
                window.localStorage.setItem("myapp",login_res.data.token)
                navigate("/questions")
            } catch (error) {
                console.log(error)
                alert(error)
            }

        },
    });

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

                <form onSubmit={formik.handleSubmit} className="px-8 py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

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
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>



                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don’t have an account yet??{" "}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Create an account
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Login;