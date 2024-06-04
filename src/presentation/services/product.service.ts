import { Validators } from "../../config";
import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto, UpdateProductDto } from "../../domain";


export class ProductService {

    constructor() {}

    async createProduct( createProductDto: CreateProductDto) {

        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if ( productExists )  throw CustomError.badRequest( 'Product already exists' );

        try {

            const product = new ProductModel( createProductDto );

            await product.save()

            return product;
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    };

    async getProducts( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            const [ total, products ] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('user', 'name email' )
                    .populate('category')
            ]);

            return{ 
                page: page,
                limit: limit,
                total: total,
                next: `/api/products?page=${ ( page + 1) }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `/api/products?page=${ ( page - 1 ) }&limit=${ limit }`: null,
                
                products: products
            }
          
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
    };

    async updateProduct( updateProductDto: UpdateProductDto ) {

        const { id, name, available, price, description, category } = updateProductDto;
        const product = await ProductModel.findById( id );
        if ( !product )  throw CustomError.badRequest( 'Category does not exists' );
        console.log( product.category );
        try {
        
            return await ProductModel.findByIdAndUpdate( id, {
                name,
                available,
                price,
                description,
                category
            }, { returnDocument: "after" });

        } catch (error) {
            console.log( error );
            throw CustomError.internalServer('Internal Server Error');
        }

    }

    async deleteProduct( id: string ) {

        if( !Validators.isMongoID( id ) ) throw CustomError.badRequest('Invalid Category ID');
        const category = await ProductModel.findById( id );
        if ( !category )  throw CustomError.badRequest( 'Category does not exists' );

        try {
            
            const deletedCategory = await ProductModel.findByIdAndDelete( id );

            return deletedCategory;

        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }

    }

}