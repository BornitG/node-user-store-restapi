import { Validators } from "../../../config";

export class UpdateCategoryDto {

    private constructor(
        public readonly id: number,
        public readonly name?: string,
        public readonly available?: boolean,
    ) {}

    static create( props: { [key:string]: any } ): [string?, UpdateCategoryDto?] {

        const { id, name, available } = props;
        if ( !id ) return ['Missing id'];
        if( !Validators.isMongoID( id ) ) return ['Invalid Category ID']

        let availableBoolean;
        if ( typeof available !== 'boolean' ) {
            availableBoolean = ( available === 'true' )
        } 

        return [undefined, new UpdateCategoryDto( id, name, available)];
    }

}