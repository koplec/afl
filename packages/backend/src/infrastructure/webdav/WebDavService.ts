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


type RetryConfig = {
    maxRetries: number,
    retryInterval: number
}
export class RetryError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "RetryError";
    }
}

type ProcessFileFunction = (item: WebDavFileInfo) => Promise<void>;

function processFileWithRetry(processFile: ProcessFileFunction, {maxRetries, retryInterval}: RetryConfig): ProcessFileFunction {
    return async (item: WebDavFileInfo) => {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                return await processFile(item);
            } catch (error) {
                console.error(`Error processing file ${item.filename}, retrying... (${retries + 1}/${maxRetries})`);
                if (retries >= maxRetries -1 ) {
                    throw new RetryError(`Failed to process file ${item.filename} after ${maxRetries} retries`);
                }
                await new Promise(resolve => setTimeout(resolve, retryInterval));
                retries++;
            }
        }
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
         processFile:ProcessFileFunction,
         retryConfig?:RetryConfig): Promise<void>{
        const directoryItems = await this.client.getDirectoryContents(dirPath);
        if (isFileStatArray(directoryItems)){
            for (const item of directoryItems){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile, retryConfig)
                }else{
                    let webdavFile = toWebDavFile(item, dirPath);
                    if(retryConfig === undefined){
                        processFile(webdavFile);
                    }else{
                        processFileWithRetry(processFile, retryConfig)(webdavFile);
                    }
                }
            }
        } else if (isResponseDataDetailedDirectoryItem(directoryItems)){
            for (const item of directoryItems.data){
                if(item.type === 'directory'){
                    await this.traverse(item.filename, processFile, retryConfig)
                }else{
                    let webdavFile = toWebDavFile(item, dirPath);
                    if(retryConfig === undefined){
                        processFile(webdavFile);
                    }else{
                        processFileWithRetry(processFile, retryConfig)(webdavFile);
                    }
                }
            }
        }
    }
}

