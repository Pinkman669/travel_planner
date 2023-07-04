import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

export function AuthGuard(){
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

    if(isAuthenticated){
        return <Outlet/>;
    }else{
        return <Navigate to="/login" replace />;
    }
}