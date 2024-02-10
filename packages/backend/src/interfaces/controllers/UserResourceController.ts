import express from 'express';
import GetUserResource from '../../application/userResource/GetUserResource';
import {UpdateUserResource} from '../../application/userResource/UpdateUserResource';



class UserResourceController {
    public readonly router = express.Router({mergeParams: true});
    private getUserResource: GetUserResource;
    private updateUserResource: UpdateUserResource;

    constructor(getUserResource: GetUserResource, updateUserResource: UpdateUserResource){
        this.router.get('/:resourceId', this.getResource.bind(this));
        this.getUserResource = getUserResource;
        this.updateUserResource = updateUserResource;
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
}

export default UserResourceController;