import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form } from "react-bootstrap";
import { IconBrandFacebookFilled } from '@tabler/icons-react';
import '../../css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { localLogin } from './AuthAPI';
import { login } from "./AuthSlice";
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../utils/utils'

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

    const loginViaFacebook = () =>{
        const authURL = 'https://www.facebook.com/dialog/oauth'
        const search = new URLSearchParams()
        search.set('client_id', process.env.REACT_APP_FACEBOOK_APP_ID + '')
        search.set('redirect_uri', `${window.location.origin}/facebook-callback`)
        search.set('response_type', 'code')
        search.set('state', '')
        search.set('scope', 'email, public_profile')
        window.location.href = `${authURL}?${search.toString()}`
    }

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset(formState.defaultValues)
        }
    }, [formState, reset]);

    async function submit(data: FormState) {
        const result = await localLogin(data.email, data.password)
        if (result.success) {
            dispatch(login({name: result.name, userId: result.userId}))
            notify(result.success, 'Login success!')
            navigate('/')
        } else {
            notify(result.success, 'Email or password not match')
        }
    }

    return (
        <div className='container-fluid login-page'>
            <div className='login-form-div'>
                <h2>Login</h2>
                <Form id='login-form' onSubmit={handleSubmit(submit)}>
                    <Form.Group>
                        <Form.Label className='login-labels'>Email</Form.Label>
                        <Form.Control type="text" {...register("email")} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='login-labels'>Password</Form.Label>
                        <Form.Control type="password" {...register("password")} />
                    </Form.Group>

                    <Button className='submit-btn' variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

                <p className='makasar-font'>Login with</p>
                <div id='social-login-div'>
                    <button onClick={loginViaFacebook} className='social-login-btn'>
                        <IconBrandFacebookFilled />
                    </button>
                </div>
                <p className='margin-block makasar-font'>OR</p>
                <div id='sign-up-link-div'>
                    <Link to='/sign-up' id='sign-up-link'>Create an account now</Link>
                </div>
            </div>
        </div>
    )
}