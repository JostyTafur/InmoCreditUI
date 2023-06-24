export class NewUser {
    name: string;
    userName: string;
    email: string;
    password: string;
    authorities: string[];
    constructor(name: string, userName: string, email: string, password: string, authorities: string[]) {
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
}