import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { Button } from "react-bootstrap";
import { logout } from "../auth/AuthSlice";

export default function Home(){
	const dispatch = useAppDispatch()
    return (
        <div>
            Home!
            <Button variant="success" onClick={() => dispatch(logout())}>Logout</Button>
        </div>
    )
}