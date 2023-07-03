import React, { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import '../../css/SignUp.css'
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import { Link } from "react-router-dom";


export default function SignUp() {
    interface FormState {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        birthday: string;
    }

    const { register, handleSubmit, reset, formState, setError } = useForm<FormState>({
        defaultValues: {
            email: "",
            password: "",
            birthday: "",
            confirmPassword: "",
            name: ""
        },
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset(formState.defaultValues)
        }
    }, [formState, reset]);

    function submit(data: FormState) {
        console.log(data)
    }

    return (
        <div className="container-fluid">
            <div id="sign-up-form-div">
                <h2>Sign Up</h2>
                <Form id='login-form' onSubmit={handleSubmit(submit)}>
                    <Form.Group className="sign-up-row">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control type="password" {...register("name", { required: "Name cannot be empty" })} />
                        {
                            formState.errors.name &&
                            <Alert className="error-msg animate__fadeIn animate__animated" variant="warning">
                                {formState.errors.name.message}
                            </Alert >
                        }
                    </Form.Group>
                    <Form.Group className="sign-up-row">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" {...register("email",
                            {
                                required: "Please enter a valid email address",
                                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi
                            })} />
                        {
                            formState.errors.email &&
                            <Alert className="error-msg animate__fadeIn animate__animated" variant="warning">
                                Please enter a valid email address
                            </Alert >
                        }
                    </Form.Group>

                    <Form.Group className="sign-up-row">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" {...register("password",
                            {
                                required: "Password must contain at least 10 characters",
                                minLength: 10
                            })} />
                        {
                            formState.errors.password &&
                            <Alert className="error-msg animate__fadeIn animate__animated" variant="warning">
                                Password must contain at least 10 characters
                            </Alert >
                        }
                    </Form.Group>

                    <Form.Group className="sign-up-row">
                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control type="password" {...register("confirmPassword",
                            {
                                required: "Password not match",
                                validate: (value, data: FormState) => value === data.password
                            })} />
                        {
                            formState.errors.confirmPassword &&
                            <Alert className="error-msg animate__fadeIn animate__animated" variant="warning">
                                Password not match
                            </Alert >
                        }
                    </Form.Group>

                    <Form.Group className="sign-up-row">
                        <Form.Label>Your Birthday</Form.Label>
                        <Form.Control type="date" {...register("birthday",
                            {
                                required: "Birthday cannot be empty",
                                valueAsDate: true
                            })} />
                        {
                            formState.errors.birthday &&
                            <Alert className="error-msg animate__fadeIn animate__animated" variant="warning">
                                {formState.errors.birthday.message}
                            </Alert >
                        }
                    </Form.Group>
                    <Button className='submit-btn' variant="primary" type="submit">
                        Sign up
                    </Button>
                </Form>
                <div id='login-link-div'>
                    <Link to='/' id='login-link'>I have an account already!</Link>
                </div>
            </div>
        </div>
    )
}