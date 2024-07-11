import { FormControl } from "@angular/forms";

export interface ILoginForm {
    email: FormControl<string>,
    password: FormControl<string>,
}


export interface ILogin {
    email: string,
    password: string,
}