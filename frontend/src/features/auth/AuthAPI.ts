export async function localLogin(email: string, password: string){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            email, password
        })
    })

    const result = await res.json()
    if (res.status === 200){
        localStorage.setItem('token', result.token)
        return {name: result.name, success: true }
    } else{
        return {success: false}
    }
}

export async function localSignUp(
    email: string,
    password: string,
    name: string,
    birthday: Date
){
    const res = await fetch(`${process.env.REACT_APP_API_SERVER}/auth/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            email, password, name, birthday
        })
    })

    const result = await res.json()
    if (res.status === 200){
        console.log(result)
        return true
    } else{
        return false
    }
}