const { response } = require('express');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');



/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
    // console.log("feevge", req)
    const messages = await req.consumeFlash('info');

    const locals = {
        title: 'NodeJs',
        description: "Free NodeJS app"
    }

    let perPage = 6;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: { updateAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();
        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages

        })

    } catch (error) {
        console.log(error);

    }
};

/**
 * GET /
 * About page
 */

exports.about = async (req, res) => {
    // console.log("feevge", req)
    const messages = await req.consumeFlash('info');

    const locals = {
        title: 'About',
        description: "Free NodeJS app"

    }
    try {
        res.render('about', locals);

    } catch (error) {
        console.log(error);

    }
};



// exports.homepage = async (req, res) => {
//     // console.log("feevge", req)
//     const messages = await req.consumeFlash('info');

//     const locals = {
//         title: 'NodeJs',
//         description: "Free NodeJS app"

//     }
//     try {
//         const customers = await Customer.find({}).limit();
//         res.render('index', { locals, messages, customers });

//     } catch (error) {
//         console.log(error);

//     }
// };
/**
 * GET /
 * New customer
 */

exports.addCustomer = async (req, res) => {

    const locals = {
        title: 'Add New Customer - NodeJS',
        description: "Free NodeJS User Management System"
    }

    res.render('customer/add', locals);
};

/**
 * POST /
 * Create New customer
 */

exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email
    })

    const locals = {
        title: 'Add New Customer - NodeJS',
        description: "Free NodeJS User Management System"
    }

    try {
        await Customer.create(newCustomer)
        await req.flash('info', 'New Customer added successfully')

        res.redirect('/');

    } catch (error) {
        console.log(error);

    }

    // res.render('customer/add', locals);
};
/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "View Customer Data",
            description: "Free NodeJS User Management System"
        };
        res.render('customer/view', {
            locals,
            customer
        });
        await res.redirect("/");

    } catch (error) {
        console.log(error);
    }
}

exports.viewPost = async (req, res) => {
    try {

        await res.redirect("/");

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET /
 * Edit Customer Data
 */
exports.edit = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "Edits Customer Data",
            description: "Free NodeJS User Management System"
        };
        res.render('customer/edit', {
            locals,
            customer
        });

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET /
 * Update Customer Data
 */
exports.editPost = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updateAt: Date.now()

        }
        )
        // await res.redirect(`/edit/${req.params.id}`);
        await res.redirect("/")

        // console.log('redirect');


    } catch (error) {
        console.log(error);
    }
}

/**
 * Deletes /
 * DeleteCustomer Data
 */
exports.deleteCustomer = async (req, res) => {
    try {

        await Customer.deleteOne({ _id: req.params.id });
        res.redirect("/")

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get /
 * SearchCustomer Data
 */
exports.searchCustomer = async (req, res) => {

    const locals = {
        title: "Search Customer Data",
        description: "Free NodeJS User Management System"
    };
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } }
            ]
        })
        res.render("search", {
            customers,
            locals
        })
    } catch (error) {
        console.error(error)
    }
}

