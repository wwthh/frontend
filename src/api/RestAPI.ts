import Axios from 'axios';
import qs from 'qs';

import { version } from './config';
import { IRequestList } from '../types/request';


const entry = '/' + version + '/';

export class BaseAPI {
    protected entry: string = entry;

    public constructor(service: string) {
        this.entry += service + '/';
    }

    protected static parseParam = (param: any) =>
        '?' + qs.stringify(param);
};

// i.e. http://ip:port/v1/paper/23/
export default class RestAPI extends BaseAPI {
    protected catDetail = (id: string) =>
        this.entry + id + '/';
    protected catList = (param?: IRequestList) =>
        this.entry + (param ? BaseAPI.parseParam(param) : '');

    public list = (token: string, param?: IRequestList) => {
        return Axios.get(this.catList(param), {
            headers: { 'token': token }
        });
    }

    public retreive = (token: string, id: string) =>
        Axios.get(this.catDetail(id), {
            headers: { 'token': token }
        });

    // no demand for creating and delete resource.
};

// i.e. http://ip:port/v1/user/12/purchases/15/
export class SecondaryAPI extends BaseAPI {
    protected secondary: string;

    public constructor(service: string, secondary: string) {
        super(service);
        this.secondary = secondary;
    }

    protected catDetail = (id1: string, id2: string) =>
        this.entry + id1 + '/' + this.secondary + '/' + id2 + '/';
    protected catList = (id1: string, param?: IRequestList) =>
        this.entry + id1 + '/' + this.secondary + '/' + (param ? BaseAPI.parseParam(param) : '');

    public list = (token:string, id1: string, param?: IRequestList) =>
        Axios.get(this.catList(id1, param), {
            headers: { 'token': token }
        });
    public retreive = (token: string, id1: string, id2: string) =>
        Axios.get(this.catDetail(id1, id2), {
            headers: { 'token': token }
        });
};
