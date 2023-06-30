import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form } from "react-bootstrap";
import { IconBrandGoogle, IconBrandFacebookFilled } from '@tabler/icons-react';
import '../../css/Login.css';
import { Link } from 'react-router-dom';

interface FormState {
    email: string;
    password: string;
}

export default function Login() {
    const { register, handleSubmit, watch, reset, formState } = useForm<FormState>({
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

    function submit(data: FormState) {
        console.log("submit form data:", data);
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
                    <div id='sign-up-link-div'>
                        <Link to='/sign-up' id='sign-up-link'>Create an account now</Link>
                    </div>
            </div>
        </div>
    )
}