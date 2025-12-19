

export const userById = async (req, res,next,id) => {
    try {
        const user = await User.findById(id).exec();
        if(!user){
            res.status(400).json({
                message:"Không tồn tại user"
            })
        }
        req.profile = user;
        next();
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
} 