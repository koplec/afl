export type UserResourceType = {
    id: number;
    userId: number;
    protocolType: "WEBDAV";
    url: string;
    username: string;
    password: string;
    directory: string;
};
