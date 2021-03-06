// see https://shimo.im/docs/3VdJgXthWpjT6VQQ
import { IField } from './index';

export interface IRequestList {
    page: number,
    size: number,
    domain?: string,
    key: string,
    sort?: string,
    direction?: boolean,
    free?: boolean,
}

export interface IRequestUploadPaper {
    // TODO
};

export interface IRequestPatchExpertInfo {
    // TODO
};

export interface IRequestPatchUserInfo {
    email?: string,
    userName?: string,
    photo?: string,
};

export interface IRequestPatchPw {
    oldPassword: string,
    newPassword: string,
};

export interface IRequestCertify {
    eid: string,
    org?: string,
    name?: string,
    tags?: Array<IField>,
};

export interface IRequestLogin {
    email: string,
    cipher: string,
};

export interface IRequestRegister {
    email: string,
    password: string,
    userName: string,
};

export type IRequestAddFavorite = Array<{ title: string, id: string }>;

export type IRequestRemoveFavorite = Array<string>;