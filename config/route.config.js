import JwtPassport from 'passport-jwt';

//Database Model
import { UserModel } from '../database/allModels';

const JwtStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "ZomatoApp"
};

export default (passport) =>{
    passport.use(
        new JwtStrategy(options, async (jwt__payload, done) =>{
            try{
                const doesUserExist = await UserModel.findById(jwt__payload.user);
                if(!doesUserExist)
                    return done(null, doesUserExist);
            }catch(error){
                throw new Error(error);
            }
        })
    )
}


// Explanation
// const req = {
//     headers: {
//         Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjE5NTIxODRkOWIwZjQ2ZTI0MDFhNTdiIiwiaWF0IjoxNjM3NzY3MTEyfQ.8BHsAcNZe_zuT-4pcqaZE63YmH3F_MfMobdGblzyTxQ"
//     }
// }
// will be converted to
// const req = {
//     headers: {
//         Authorization: "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjE5NTIxODRkOWIwZjQ2ZTI0MDFhNTdiIiwiaWF0IjoxNjM3NzY3MTEyfQ.8BHsAcNZe_zuT-4pcqaZE63YmH3F_MfMobdGblzyTxQ"
//     }
// }
// const jwt__payload = {
//     user: sfasf3423szdfa34324
// }