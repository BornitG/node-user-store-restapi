import { Validators } from "../../../config";

export class UpdateProductDto {

    private constructor(
        public readonly id: number,
        public readonly name?: string,
        public readonly available?: boolean,
        public readonly price?: number,
        public readonly description?: string,
        private readonly user?: string, // ID
        public readonly category?: string, // ID
        
    ) {}

    static create( props: { [key:string]: any } ): [string?, UpdateProductDto?] {

        const {
            id,
            name,
            available,
            price,
            description,
            user,
            category,
        } = props

        if ( !id ) return ['Missing id'];
        if ( !Validators.isMongoID( id ) ) return ['Invalid Product ID'];

        if ( category && !Validators.isMongoID( category ) ) return ['Invalid Category ID'];
        
        if ( price && isNaN( price ) ) return ['Price must be a number'];
        
        let availableBoolean;
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' )
        } 

        return [undefined, new UpdateProductDto(
            id,
            name,
            available,
            price,
            description,
            user,
            category,
        )];
    }

}