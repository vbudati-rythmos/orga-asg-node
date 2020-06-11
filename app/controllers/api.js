const user = require('../models/user');
const order = require('../models/order');
var api = {};

var aggPipe = [];
const lookUp = {
    "$lookup": {
        "localField": "_id",
        "from": "orders",
        "foreignField": "userId",
        "as": "data"
    }
}
const unwind = {
    "$unwind": "$data"
}
const group = {
    "$group": {
        "_id": { "_id": "$_id", "name": "$name" },
        "noOfOrders": {
            "$sum": 1
        },
        "averageBillValue": {
            "$avg": "$data.subTotal"
        }
    }
}
const project = {
    "$project": {
        "_id": 0,
        "userId": "$_id._id",
        "name": "$_id.name",
        "noOfOrders": 1,
        "averageBillValue": 1
    }
}

/* api.postData = function (req, res) {
    // var userDoc = {
    //     name: req.body.name
    // }
    // user.insertMany(userDoc).then((doc) => {
    //     console.log('doc', doc);
    //     res.json({message: 'Success', result: doc});
    // }).catch((err) => {
    //     console.log('error', err);
    //     res.json({message: 'Failed', result: err});
    // });

    var orderDoc = {
        orderId: req.body.orderId,
        userId: req.body.userId,
        subTotal: req.body.subTotal,
        date: req.body.date
    }
    order.insertMany(orderDoc).then((doc) => {
        console.log('doc', doc);
        res.json({ message: 'Success', result: doc });
    }).catch((err) => {
        console.log('error', err);
        res.json({ message: 'Failed', result: err });
    });
} */

async function bulkWrite(ops) {
    var bulkResp = await user.bulkWrite(ops);
    return bulkResp;
}

function calcNumberOfOrdersAndAvgBill() {
    aggPipe.push(lookUp, unwind, group, project);
    return user.aggregate(aggPipe);
}

//middleware functions
api.calcOrdersAndBill = function (req, res) {
    calcNumberOfOrdersAndAvgBill().then((resp) => {
        res.json(resp);
    }).catch((err) => {
        res.json(err);
    })
}

api.updateNumOfOrders = function (req, res) {
    var writeOps = [];
    calcNumberOfOrdersAndAvgBill().then((resp) => {
        resp.forEach((doc) => {
            writeOps.push({
                updateOne: {
                    filter: { _id: doc.userId },
                    update: {
                        $set: { "noOfOrders": doc.noOfOrders }
                    },
                    upsert: false
                }
            })
        });
        bulkWrite(writeOps).then(() => {
            res.json({ success: true, message: "Successfully Updated" })
        }).catch((err) => {
            res.json({ success: false, message: err })
        })
    })
}




module.exports = api;