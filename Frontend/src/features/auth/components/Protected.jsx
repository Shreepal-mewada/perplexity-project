// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router";

// function Protected({ children }) {
//   const user = useSelector((state) => state.auth.user);
//   const loading = useSelector((state) => state.auth.loading);
//   const navigate = useNavigate();
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (!user) {
//     navigate("/login");
//     return <div>Please log in to view this content.</div>;
//   }

//   return children;
// }

// export default Protected;

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function Protected({ children }) {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#121212] flex items-center justify-center text-center px-4">
        <div>
          <div className="animate-spin h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary mx-auto"></div>
          <p className="mt-4 text-sm text-white/80">
            Signing out, please wait…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default Protected;
