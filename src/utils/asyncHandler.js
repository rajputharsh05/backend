

// const asyncHandler = () => {}  step -> 1

// const asyncHandler = (func) => { () => {} }   step -> 2



// const asyncHandler =  ( fn ) => async (req, res, next) => {

//         try {
            
//             return await fn(req, res, next);

//         } catch ( error ) {

//             res.status(err.code || 500).json({
//                 success : false,
//                 message : err.message
//             })

//         }
// }


const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch
        ((err) => next(err))
    }
}


export {
    asyncHandler
}



















        // const asyncHandler = (requestHandler) => {
        //     (req,res,next) => {
        //         Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
        //     }
        // }
        