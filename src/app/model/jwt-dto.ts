export class JwtDTO {
    token: string;
    type: string;
    userName: string;
    authorities: string[];

    constructor(token: string, type: string, userName: string, authorities: string[]){
        this.token = token;
        this.type = type;
        this.userName = userName;
        this.authorities = authorities;
    }
}