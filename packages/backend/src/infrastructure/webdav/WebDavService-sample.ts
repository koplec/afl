import { WebDavService } from './WebDavService.js';
import { FileStat } from 'webdav';
import minimist from 'minimist';
import { WebDavFileInfo } from '../../domain/types.js';

let args = minimist(process.argv.slice(2))
let {url, user, password, dir} = args;
let webDavService: WebDavService= new WebDavService(url, user, password);

console.log('Traversing BEGIN');
webDavService.traverse(dir, async (item:WebDavFileInfo) => {
    console.log(item.filename);
});