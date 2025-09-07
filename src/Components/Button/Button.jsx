import React from "react";

function Button({ children, type = "button", className = "" }) {

    function logout() {
        localStorage.removeItem("myapp"); // delete JWT
        alert("Logged out successfully!");
        window.location.href = "/"; // redirect to login page
    }

    return (
        <button
            type={type}
            onClick={logout}
            className={`px-4 py-2 rounded-md border border-white text-white hover:bg-white hover:text-[#4FB3B9] font-medium transition-colors ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
