import {FileStat, WebDAVClient, createClient, ResponseDataDetailed } from 'webdav';

type DirectoryItem = FileStat[] | ResponseDataDetailed<FileStat[]>;
function isFileStatArray(item: DirectoryItem): item is FileStat[] {
    return Array.isArray(item);
}

function isResponseDataDetailedDirectoryItem(item: DirectoryItem): item is ResponseDataDetailed<FileStat[]> {
    return !Array.isArray(item);
}

export class WebDavService {
    private client: WebDAVClient;
    constructor(url: string, username: string, password: string){
        this.client = createClient(url, {
            username: username,
            password: password
        });
    }

    async traverse(path: string,
         processFile: (item:FileStat) => void): Promise<void>{
        const directoryItems = await this.client.getDirectoryContents(path);
        if (isFileStatArray(directoryItems)){
            for (const item of directoryItems){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile)
                }else{
                    processFile(item);
                }
            }
        } else if (isResponseDataDetailedDirectoryItem(directoryItems)){
            for (const item of directoryItems.data){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile)
                }else{
                    processFile(item);
                }
            }
        }
    }
}