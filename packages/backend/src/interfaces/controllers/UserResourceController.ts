import express from 'express';
import GetUserResource from '../../application/userResource/GetUserResource';

class UserResourceController {
    public readonly router = express.Router({mergeParams: true});
    private getUserResource: GetUserResource;

    constructor(getUserResource: GetUserResource){
        this.router.get('/:resourceId', this.getResource.bind(this));
        this.getUserResource = getUserResource;
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
}

export default UserResourceController;