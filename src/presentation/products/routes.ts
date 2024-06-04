import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { ProductController } from './controller';
import { ProductService } from '../services';




export class ProductsRoutes {


  static get routes(): Router {

    const router = Router();
      
    const productService = new ProductService();

    const controller = new ProductController(productService);
    
    // Definir las rutas
    router.get('/', controller.getProducts );

    router.post('/',[ AuthMiddleware.validateJWT ], controller.createProduct );

    router.put('/:id',[ AuthMiddleware.validateJWT ], controller.updateProduct );

    router.delete('/:id',[ AuthMiddleware.validateJWT ], controller.deleteProduct );



    return router;
  }


}

