import { Validators } from "../../config";
import { CategoryModel } from "../../data";
import { CreateCategoryDto, UpdateCategoryDto, CustomError, PaginationDto } from "../../domain";



export class CategoryService {

    constructor() {}

    async createCategory( createCategoryDto: CreateCategoryDto) {

        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if ( categoryExists )  throw CustomError.badRequest( 'Category already exists' );

        try {

            const category = new CategoryModel( createCategoryDto );

            await category.save()

            return category;
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    };

    async getCategories( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            const [ total, categories ] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip( (page - 1) * limit ) /// pagina 
                    .limit( limit )
            ])

            return{ 
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${ ( page + 1) }&limi=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/categories?page=${ ( page - 1 ) }&limi=${ limit }`: null,

                categories: categories
            }
          
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
    };

    async updateCategories( updateCategoryDto: UpdateCategoryDto ) {

        const { id, name, available } = updateCategoryDto;
        const category = await CategoryModel.findById( id );
        if ( !category )  throw CustomError.badRequest( 'Category does not exists' );

        try {
            
            category.name = name ? name : category.name;
            category.available = available ? available : category.available;

            await category.save();

            return category

        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }

    }

    async deleteCategories( id: string ) {

        if( !Validators.isMongoID( id ) ) throw CustomError.badRequest('Invalid Category ID');
        const category = await CategoryModel.findById( id );
        if ( !category )  throw CustomError.badRequest( 'Category does not exists' );

        try {
            
            const deletedCategory = await CategoryModel.findByIdAndDelete( id );

            return deletedCategory;

        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }

    }

}