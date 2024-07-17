import { FormControl } from "@angular/forms";
import { ITokenPair } from "./token.interface";
import { IApiDto } from "./api.interface";

export interface ILoginForm {
    email: FormControl<string>,
    password: FormControl<string>,
}


export interface ILogin {
    email: string,
    password: string,
}

export interface ILoginDto extends IApiDto<IUserMainInfo>, ILogin, ITokenPair {
    
}

interface IUserMainInfo {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    role: string,
}