import express from 'express';
import GetUserResource from '../../application/userResource/GetUserResource';
import {UpdateUserResource} from '../../application/userResource/UpdateUserResource';
import { CreateUserResource } from '../../application/userResource/CreateUserResource';
import { DeleteUserResource } from '../../application/userResource/DeleteUserResource';



class UserResourceController {
    public readonly router = express.Router({mergeParams: true});
    private getUserResource: GetUserResource;
    private updateUserResource: UpdateUserResource;
    private createUserResource: CreateUserResource;
    private deleteUserResource: DeleteUserResource;

    constructor(getUserResource: GetUserResource, 
            updateUserResource: UpdateUserResource,
            createUserResource: CreateUserResource,
            deleteUserResource: DeleteUserResource){
        this.getUserResource = getUserResource;
        this.updateUserResource = updateUserResource;
        this.createUserResource = createUserResource;
        this.deleteUserResource = deleteUserResource;
        this.router.get('/:resourceId', this.getResource.bind(this));
        this.router.put('/:resourceId', this.updateResource.bind(this));
        this.router.post('/', this.createResource.bind(this));
        this.router.delete('/:resourceId', this.deleteResource.bind(this));
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

    async deleteResource(req: express.Request, res: express.Response){
        const resourceId = parseInt(req.params.resourceId);
        const userId = parseInt(req.params.userId);
        try{
            const deleted = await this.deleteUserResource.execute(userId, resourceId);
            if(deleted){
                res.status(200).json({ message: 'Resource deleted' });
            }else{
                res.status(404).json({ error: 'Resource not found' });
            }
        }catch(err){
            res.status(500).json({ error: 'Resource deletion failed' });
        }
    }
}

export default UserResourceController;