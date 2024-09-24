import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "uploads/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + file.originalname);
  },
});

const maxsize = 1024 * 1024 * 100; //100mb
const upload = multer({ storage, limits: { fieldSize: maxsize } });

const fieldsupload = upload.fields([
    { name: 'profilePicture', maxCount: 1 },
   
    { name: 'file', maxCount: 1 },
]);

export { fieldsupload };
