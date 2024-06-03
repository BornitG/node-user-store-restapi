import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDTO, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";




export class AuthService {
    
    // DI
    constructor(
        // DI - EMAIL SERVICE
        private readonly emailService: EmailService
    ) {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if ( existUser ) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel( registerUserDto );
            
            // Encrypt password
            user.password = bcryptAdapter.hash( registerUserDto.password );
            
            await user.save();
            
            // Confirmation email
            await this.sendEmailValidationLink( user.email );
            
            const { password, ...userEntity } = UserEntity.fromObject( user );
            
            // JWT <--- auth user
            const token = await JwtAdapter.generateToken({ id: user.id })
            if ( !token ) throw CustomError.internalServer('Error while generating JWT');

            return { 
                user: userEntity,
                token: token
            };
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }

    public async loginUser( loginUserDto: LoginUserDTO ) {

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if ( !user ) throw CustomError.notFound('There is not user with this email');

        try {
            const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
            if ( !isMatching ) throw CustomError.badRequest('Invalid credentials');            

            const { password, ...userInfo } = UserEntity.fromObject( user ); 
            
            const token = await JwtAdapter.generateToken({ id: user.id })
            if ( !token ) throw CustomError.internalServer('Error while generating JWT');
            
            return {
                user: userInfo,
                token: token
            }
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
         

    }

    private sendEmailValidationLink = async(email: string) => {

        const token = await JwtAdapter.generateToken({ email });
        if ( !token ) throw CustomError.internalServer('Error while generating JWT');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail( options );
        if ( !isSent ) throw CustomError.internalServer('Error while sending email');

        return true;
    }

    public validateEmail = async ( token: string ) => {

        const payload = await JwtAdapter.validateToken( token );
        if ( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email does not exist');

        user.emailValidated = true;
        await user.save();

        return true;
    }

}