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


import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Protected({ children }) {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}

export default Protected;