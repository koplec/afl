export type UserResourceType = {
    id: number;
    userId: number;
    protocolType: "WEBDAV";
    url: string;
    username: string;
    password: string;
    directory: string;
};

export type WebDavFileInfo = {
    filepath: string; //basenameを含まないfileへのpath
    filename: string;
    filesize: number;
    lastModified: string;
    type: "webdav-file";
    mime?: string;
};