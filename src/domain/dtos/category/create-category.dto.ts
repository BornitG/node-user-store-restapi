import { Validators } from "../../../config";




export class CreateCategoryDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly user: string, // id
    ) {}

    static create( object: { [key:string]: any } ):[ string?, CreateCategoryDto? ] {

        const { name, available = false, user} = object
        let availableBoolean = available;

        if ( !name ) return ['Missing name'];
        if( !user ) return ['Missing user'];
        if( !Validators.isMongoID( user ) ) return ['Invalid User ID']
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' )
        } 

        return [undefined, new CreateCategoryDto( name, availableBoolean, user )];
    }

}