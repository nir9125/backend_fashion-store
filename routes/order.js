const Order = require("../models/Order");
const {  verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin,} = require("./middlewear/middlewears");


const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  console.log(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
    try {
      const orders = query
        ? await Order.find().sort({ _id: -1 }).limit(5)
        : await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
});

// GET MONTHLY INCOME


router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
 console.log(new Date(),date,lastMonth,previousMonth);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    console.log("income",income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TOTAL EARNING


router.get("/totalincome", verifyTokenAndAdmin, async (req, res) => {


  try {
    const income = await Order.aggregate([{$group: {_id:null, total_income:{$sum:"$amount"}}}]);
   // console.log(income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});


//Previous month income
router.get("/preincome", verifyTokenAndAdmin, async (req, res) => {

  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
   // console.log(income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

//todays income
router.get("/todayincome", verifyTokenAndAdmin, async (req, res) => {

  const date = new Date();
  date.setHours(0,0,0,0);

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
        },
      },
      {
        $project: {
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$sales" },
        },
      },
    ]);
    //console.log(income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

//last week income
router.get("/lastweekincome", verifyTokenAndAdmin, async (req, res) => {

  const now = new Date();
  const date=new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  console.log(date);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
        },
      },
      {
        $project: {
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$sales" },
        },
      },
    ]);
   // console.log(income);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;