import React, { useEffect } from "react";

function auth() {}

// export default function (SpecificComponent, option, adminRoute = null) {
//   function AuthenticationCheck(props) {
//     // let user = useSelector((state) => state.user);

//     // const dispatch = useDispatch();

//     useEffect(() => {
//       auth().then((response) => {
//         if (!response.payload.isAuth) {
//           if (option) {
//             props.history.push("/login");
//           }
//         } else {
//           if (adminRoute && !response.payload.isAdmin) {
//             props.history.push("/");
//           }
//           else {
//             if (option === false) {
//               props.history.push("/");
//             }
//           }
//         }
//       });
//     }, []);

//     return <SpecificComponent {...props} user={user} />;
//   }
//   return AuthenticationCheck;
// }
