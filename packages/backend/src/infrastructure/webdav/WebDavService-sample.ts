import { WebDavService } from './WebDavService.js';
import { FileStat } from 'webdav';

let webDavService: WebDavService= new WebDavService('http://XXXXXXXX', 'XXXXX', 'XXXXXX');

console.log('Traversing /home BEGIN');
webDavService.traverse('/home', (item: FileStat) => {
    console.log(item.filename);
})
console.log('Traversing /home ...');
