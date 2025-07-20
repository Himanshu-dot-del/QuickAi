import sql from "../configs/db.js";

export const getUserCreations=async(req,res)=>{
     try{
        const {userId}=req.auth()

      const creations=  await sql `SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

      res.json({sucess:true,creations});

     }catch(error){
        res.json({sucess:false,message:error.message});
     }
}


export const getPublishCreations=async(req,res)=>{
     try{
        

      const creations=  await sql `SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;

      res.json({sucess:true,creations});

     }catch(error){
        res.json({sucess:false,message:error.message});
     }
}


export const toggleLikeCreation=async(req,res)=>{
     try{
        
          const {userId}=req.auth()
          const {id}=req.body

          const[creation]=await sql `SELECT * FROM creations WHERE id=${id}`

            if(!creation){
                return res.json({sucess:false,message:"Creation not found"})
            }

            const currentLikes=creation.likes;
            const userIdstr=userId.toString();
            let updatedLikes;
            let message;

            if(currentLikes.includes(userIdstr)){
                updatedLikes=currentLikes.filter((user)=>user !== userIdstr);
                message='Creation Unliked'
            }
            else{
                updatedLikes=[...currentLikes,userIdstr]
                message='Creation Liked'
            }

            const formattedArray=`{${updatedLikes.json(',')}}`

         await sql `UPDATE creations SET LIKES=${formattedArray}::text[] WHERE id={id}`;
          
     

      res.json({sucess:true, message});

     }catch(error){
        res.json({sucess:false,message:error.message});
     }
}