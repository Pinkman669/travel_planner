import { Knex } from 'knex'

export class AuthService{
    constructor(private knex: Knex){}

    async userInfo(email: string){
        const user = await this.knex
            .select('*')
            .from('users')
            .where('email', email)
        return user
    }

    async signUp(name: string, email: string, password: string, birthday: Date){
        await this.knex
            .insert({
                'name': name,
                'email': email,
                'password': password,
                'birthday': birthday
            })
            .into('users')
    }
}