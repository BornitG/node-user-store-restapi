import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto, UpdateProductDto } from "../../domain";
import { ProductService } from "../services";



export class ProductController {

    // DI
    constructor(
        private readonly productService: ProductService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message });
        }

        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error'});
    };

    createProduct = async(req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create({
                ...req.body,
                user: req.body.user.id,
            });
        if ( error ) return res.status(400).json({ error })

        this.productService.createProduct(createProductDto!)
            .then( product => res.status(201).json( product ) )
            .catch( error => this.handleError( error, res ) );
    };

    getProducts = async(req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        
        const [error, paginationDto] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        
        this.productService.getProducts( paginationDto! )
            .then( product => res.json( product ) )
            .catch( error => this.handleError( error, res ) )
    };

    updateProduct = async(req: Request, res: Response) => {
        const { id } = req.params; 
        const [error, updateProductDto] = UpdateProductDto.create({ 
            ...req.body,
            id: id,
        });
        if ( error ) return res.status(400).json({ error });

        this.productService.updateProduct( updateProductDto! )
            .then( product => res.json( product ) )
            .catch( error => this.handleError( error, res ) );
    };

    deleteProduct = async(req: Request, res: Response) => {
        const { id } = req.params;

        this.productService.deleteProduct( id )
            .then( product => res.json({ product, message: 'Product deleted successfully' }) )
            .catch( error => this.handleError( error, res ) );
    }

};