const router = require('express').Router()
const ProductController =  require('../controllers/productcontroller')
const { authentication } = require('../middlewares/authentication')
const { adminAuthorization } = require('../middlewares/authorization')
const Multer = require('multer')
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});

const gcsMiddlewares = require('../middlewares/google-cloud-storage')

router.get('/', ProductController.getProducts)
router.get('/:id', ProductController.findOne)

router.use(authentication)
router.post('/', adminAuthorization, multer.single('image'), gcsMiddlewares.sendUploadToGCS, ProductController.addProduct)

router.patch('/:id', adminAuthorization, multer.single('image'), gcsMiddlewares.sendUploadToGCS, ProductController.updateProduct)
router.delete('/:id', adminAuthorization, ProductController.deleteProduct)

module.exports = router
