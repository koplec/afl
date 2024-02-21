import {WebDAVClient, createClient } from 'webdav';

export class WebDavService {
    private client: WebDAVClient;
    constructor(url: string, username: string, password: string){
        this.client = createClient(url, {
            username: username,
            password: password
        });
    }
}