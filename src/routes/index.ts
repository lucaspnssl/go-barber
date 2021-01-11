import { Router } from 'express';

//git test
const routes = Router();

routes.post('/users', (request, response) => {
    const { name, email } = request.body;

    const user = {
        name,
        email
    }

    return response.json(user);
})

export default routes;