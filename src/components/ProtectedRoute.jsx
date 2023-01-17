import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, unauthenticatedOnly }) {
    const signedIn = localStorage.getItem('username') !== null
    
    // ROUTE PROTECTION
    if (unauthenticatedOnly && signedIn) // e.g. Log in page
        return <Navigate to='/chat' />
    else if (!unauthenticatedOnly && !signedIn) // e.g. Auth-protected Page
        return <Navigate to='/welcome' />

    return children
}

export default ProtectedRoute