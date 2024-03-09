import {FileStat, WebDAVClient, createClient, ResponseDataDetailed } from 'webdav';
import { WebDavFileInfo } from '../../domain/types';

type DirectoryItem = FileStat[] | ResponseDataDetailed<FileStat[]>;
function isFileStatArray(item: DirectoryItem): item is FileStat[] {
    return Array.isArray(item);
}

function isResponseDataDetailedDirectoryItem(item: DirectoryItem): item is ResponseDataDetailed<FileStat[]> {
    return !Array.isArray(item);
}

function toWebDavFile(item: FileStat, filepath:string): WebDavFileInfo{
    return {
        filepath: filepath,
        filename: item.basename,
        filesize: item.size,
        lastModified: item.lastmod,
        type: 'webdav-file',
        mime: item.mime
    }
}

export class WebDavService {
    private client: WebDAVClient;
    constructor(url: string, username: string, password: string){
        this.client = createClient(url, {
            username: username,
            password: password
        });
    }

    async traverse(dirPath: string,
         processFile: (item:WebDavFileInfo) => void): Promise<void>{
        const directoryItems = await this.client.getDirectoryContents(dirPath);
        if (isFileStatArray(directoryItems)){
            for (const item of directoryItems){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile)
                }else{
                    processFile(toWebDavFile(item, dirPath));
                }
            }
        } else if (isResponseDataDetailedDirectoryItem(directoryItems)){
            for (const item of directoryItems.data){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile)
                }else{
                    processFile(toWebDavFile(item, dirPath));
                }
            }
        }
    }
}

