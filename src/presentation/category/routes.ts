import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { CategoryService } from '../services/category.service';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
      
    const categoryService = new CategoryService();

    const controller = new CategoryController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getCategories );

    router.post('/',[ AuthMiddleware.validateJWT ], controller.createCategory );

    router.put('/:id',[ AuthMiddleware.validateJWT ], controller.updateCategory );

    router.delete('/:id',[ AuthMiddleware.validateJWT ], controller.deleteCategory );



    return router;
  }


}

