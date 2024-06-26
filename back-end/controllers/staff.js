import cloudinary from '../utils/cloudinary.js';
import { Staff } from '../model/index.js';


const getAllStaff = async (req, res) => {
    try {
        let query = {};

        const { searchString, gender, page, birthday } = req.query;

        if (searchString) {
            query.name = { $regex: new RegExp(searchString, 'i') };
        }
        if (gender && gender !== 'Tất cả') {
            query.gender = gender;
        }

        // Phân trang
        const perPage = 5;
        const pageNumber = parseInt(page) || 1;

        const staffs = await Staff.find(query)
            .where(
                {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$birthday" } },
                            birthday
                        ]
                    }
                }
            )
            .skip((pageNumber - 1) * perPage)
            .limit(perPage);
        const pipeline = [
            // Match documents based on your query condition
            { $match: query },

            // Group the documents to count the total number of matches
            { $addFields: { formattedBirthday: { $dateToString: { format: "%Y-%m-%d", date: "$birthday" } } } },

            // Match documents where the formattedBirthday is equal to the provided birthday
            { $match: { $expr: { $eq: ["$formattedBirthday", birthday] } } },

            // Group the documents to count the total number of matches
            { $group: { _id: null, count: { $sum: 1 } } }
        ];

        // Execute the aggregation pipeline
        const totalCount = (await Staff.aggregate(pipeline))[0].count;
        const totalPages = Math.ceil(totalCount / perPage);

        console.log(staffs);
        console.log("Số lượng: ", staffs.length);
        console.log("==============================================================");

        res.status(200).json({ staffs, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addNewStaff = async (req, res) => {
    const { name, birthday, gender, avatar } = req.body;

    try {
        // Upload ảnh lên Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(avatar);

        // Tạo đối tượng nhân viên mới với link ảnh từ Cloudinary
        const newStaff = new Staff({ name, avatar: { url: uploadedImage.secure_url, public_id: uploadedImage.public_id }, birthday, gender });

        // Lưu vào cơ sở dữ liệu
        const createdStaff = await newStaff.save();
        res.status(201).json(createdStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateStaff = async (req, res) => {
    const { id } = req.params;
    const { name, avatar, birthday, gender } = req.body;

    try {
        // Nếu có avatar mới được cung cấp, ta cập nhật ảnh trên Cloudinary
        if (avatar) {
            // Upload ảnh mới lên Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(avatar);

            // Lấy thông tin nhân viên cũ để xóa ảnh cũ trên Cloudinary
            const oldStaff = await Staff.findById(id);
            await cloudinary.uploader.destroy(oldStaff.avatar.public_id);

            // Cập nhật đường dẫn ảnh mới vào trường avatar của nhân viên
            req.body.avatar = { url: uploadedImage.secure_url, public_id: uploadedImage.public_id };
        }

        // Cập nhật thông tin nhân viên trong cơ sở dữ liệu
        const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const deleteStaff = async (req, res) => {
    const { id } = req.params;
    try {
        // Lấy thông tin nhân viên để xóa, bao gồm đường dẫn ảnh trên Cloudinary
        const staff = await Staff.findById(id);

        // Xóa ảnh trên Cloudinary
        await cloudinary.uploader.destroy(staff.avatar.public_id);

        // Xóa nhân viên khỏi cơ sở dữ liệu
        await Staff.findByIdAndDelete(id);

        res.status(200).json({ message: "Staff deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    getAllStaff,
    addNewStaff,
    updateStaff,
    deleteStaff,
}