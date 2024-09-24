import jwt from 'jsonwebtoken'

const generateToken = (userId ) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"1Y"
    })
    return token
}

export default generateToken
