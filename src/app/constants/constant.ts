import { Role } from "../models/enums/role.enum";

/**
 * Константа, путь к странице
 */
export const PathToPage = {
    Login: 'login',
};

/**
 * Константа, данные после авторизации
 */
export const LOGIN_DATA = 'login_data';

/**
 * Константа, страницы по ролям
 */
export const PAGE_BY_ROLE = new Map([[Role.User, 'user'], [Role.Admin, 'admin'], [Role.Owner, 'owner']]);