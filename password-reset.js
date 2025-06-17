import { sendPasswordResetEmail } from "firebase/auth";

   function handlePasswordReset() {
     const email = prompt("Enter your email:");
     if (email) {
       sendPasswordResetEmail(auth, email)
         .then(() => alert("Password reset email sent!"))
         .catch((error) => alert(getAuthErrorMessage(error.code)));
     }
   }
