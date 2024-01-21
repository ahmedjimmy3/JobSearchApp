const checkOwnerAccount = ()=>{
    return async(req,res,next)=>{
        const {_id} = req.authUser
        const {accountId} = req.params
        if(_id != accountId){
            return next(new Error('You are not authorized to make this request',{cause:401}))
        }
        next()
    }
}
export default checkOwnerAccount