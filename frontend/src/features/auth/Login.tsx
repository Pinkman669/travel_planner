import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form } from "react-bootstrap";
import { IconBrandGoogle, IconBrandFacebookFilled } from '@tabler/icons-react';
import '../../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { localLogin } from './AuthAPI';
import { login } from "./AuthSlice";
import { useAppDispatch } from '../../redux/hooks';

interface FormState {
    email: string;
    password: string;
}

export default function Login() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState } = useForm<FormState>({
        defaultValues: {
            email: "",
            password: ""
        },
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful){
            reset(formState.defaultValues)
        }
    }, [formState, reset]);

    async function submit(data: FormState) {
        console.log("submit form data:", data);
        const result = await localLogin(data.email, data.password)
        if (result.success){
            dispatch(login(result.name))
            console.log('login succeeded')
            navigate('/')
        } else{
            console.log('login failed')
        }
    }

    return (
        <div className='container-fluid login-page'>
            <div className='login-form-div'>
                <h2>Login</h2>
                    <Form id='login-form' onSubmit={handleSubmit(submit)}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" {...register("email")} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" {...register("password")} />
                        </Form.Group>

                        <Button className='submit-btn' variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                    <p>Login with</p>
                    <div id='social-login-div'>
                        <button className='social-login-btn'>
                            <IconBrandGoogle />
                        </button>
                        <button className='social-login-btn'>
                            <IconBrandFacebookFilled />
                        </button>
                    </div>
                    <p className='margin-block'>OR</p>
                    <div id='sign-up-link-div'>
                        <Link to='/sign-up' id='sign-up-link'>Create an account now</Link>
                    </div>
            </div>
        </div>
    )
}