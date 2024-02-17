import express from 'express';
import GetUserResource from '../../application/userResource/GetUserResource';
import {UpdateUserResource} from '../../application/userResource/UpdateUserResource';
import { CreateUserResource } from '../../application/userResource/CreateUserResource';



class UserResourceController {
    public readonly router = express.Router({mergeParams: true});
    private getUserResource: GetUserResource;
    private updateUserResource: UpdateUserResource;
    private createUserResource: CreateUserResource;

    constructor(getUserResource: GetUserResource, 
            updateUserResource: UpdateUserResource,
            createUserResource: CreateUserResource){
        this.getUserResource = getUserResource;
        this.updateUserResource = updateUserResource;
        this.createUserResource = createUserResource;
        this.router.get('/:resourceId', this.getResource.bind(this));
        this.router.put('/:resourceId', this.updateResource.bind(this));
    }

    public async getResource(req: express.Request, res: express.Response){
        const resourceId = parseInt(req.params.resourceId);
        const userId = parseInt(req.params.userId);

        const resource = await this.getUserResource.execute(userId, resourceId);
        if(!!resource){
            res.status(200).json(resource);
        }else{
            res.status(404).json({ error: 'Resource not found' });
        }
    }

    public async updateResource(req: express.Request, res: express.Response){
        const resourceId = parseInt(req.params.resourceId);
        const userId = parseInt(req.params.userId);
        
        const resource = req.body;
        const type = resource.type;
        if(type !== "WEBDAV"){
            res.status(400).json({ error: 'Invalid resource type' });
            return;
        }
        
        const updated = await this.updateUserResource.execute({
            userId,
            resourceId,
            url: resource.url,
            type: resource.type,
            username: resource.username,
            password: resource.password,
            directory: resource.directory
        });

        if(updated){
            res.status(200).json({ message: 'Resource updated' });
        }else{
            res.status(404).json({ error: 'Resource not found' });
        }
    }

    public async createResource(req: express.Request, res: express.Response){
        const userId = parseInt(req.params.userId);
        const resource = req.body;
        const type = resource.type;
        if(type !== "WEBDAV"){
            res.status(400).json({ error: 'Invalid resource type' });
            return;
        }
        const created = await this.createUserResource.execute({
            userId,
            url: resource.url,
            type: resource.type,
            username: resource.username,
            password: resource.password,
            directory: resource.directory
        });

        if(created){
            //201: Created
            res.status(201).json({ 
                message: 'Resource created',
                resourceId: created
            });
        }else{
            res.status(500).json({ error: 'Resource creation failed' });
        }
    }
}

export default UserResourceController;