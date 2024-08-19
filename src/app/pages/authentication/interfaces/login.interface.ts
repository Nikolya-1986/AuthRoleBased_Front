import { FormControl } from "@angular/forms";
import { ITokenPair } from "./token.interface";
import { IResponseDto } from "./response.interface";

export interface IRegisterForm {
    firstName: FormControl<string>,
    lastName: FormControl<string>,
    userName: FormControl<string>,
    email: FormControl<string>,
    password: FormControl<string>,
}
export interface ILoginForm {
    email: FormControl<string>,
    password: FormControl<string>,
}

export interface IRegister {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
}

export interface ILogin {
    email: string,
    password: string,
}

export interface ILoginDto extends IResponseDto<IUserMainInfo>, ILogin, ITokenPair { }

export interface IRegisterDto extends ILoginDto { }
interface IUserMainInfo {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    role: string[],
}