import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto, UpdateCategoryDto } from "../../domain";
import { CategoryService } from "../services/category.service";



export class CategoryController {

    // DI
    constructor(
        private readonly categoryService: CategoryService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message });
        }

        console.log(`${ error }`);
        return res.status(500).json({ error: 'Internal server error'});
    };

    createCategory = async(req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create({
            ...req.body,
            user: req.body.user.id,
        });
        if ( error ) return res.status(400).json({ error })

        this.categoryService.createCategory(createCategoryDto!)
            .then( category => res.status(201).json( category ) )
            .catch( error => this.handleError( error, res ) );
    };

    getCategories = async(req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        
        const [error, paginationDto] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        
        this.categoryService.getCategories( paginationDto! )
            .then( category => res.json( category ) )
            .catch( error => this.handleError( error, res ) )
    };

    updateCategory = async(req: Request, res: Response) => {
        const { id } = req.params; 
        const [error, updateCategoryDto] = UpdateCategoryDto.create({ 
            ...req.body,
            id: id,
        });
        if ( error ) return res.status(400).json({ error });

        this.categoryService.updateCategories( updateCategoryDto! )
            .then( category => res.json( category ) )
            .catch( error => this.handleError( error, res ) );
    };

    deleteCategory = async(req: Request, res: Response) => {
        const { id } = req.params;

        this.categoryService.deleteCategories( id )
            .then( category => res.json({ category, message: 'Category deleted successfully' }) )
            .catch( error => this.handleError( error, res ) );
    }

};