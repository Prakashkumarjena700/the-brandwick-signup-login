const express = require("express")
const { userModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const userRoute = express.Router()

userRoute.post("/register", async (req, res) => {
    const { name, username, email, password, phone } = req.body

    if (email == null || password == null) {
        res.send({ "msg": "Please all the required fields", "success": false })
    } else {
        try {
            const user = await userModel.find({ email })
            if (user.length > 0) {
                res.send({ "msg": "Already have an account please login", "success": false })

            } else {
                bcrypt.hash(password, 9, async (err, hash) => {
                    if (err) {
                        res.send("Something went wrong")
                    } else {
                        const user = new userModel({ name, username, email, password: hash, phone })
                        await user.save()
                        res.send({ "msg": "new user has been register", "success": true })
                    }
                });
            }

        } catch (err) {
            console.log(err)
            res.send({ "msg": "Can't register", "success": false })
        }
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (email == null || password == null) {
        res.send({ "msg": "Please all the required fields", "success": false })
    } else {
        try {
            const user = await userModel.find({ email })
            if (user.length > 0) {
                bcrypt.compare(password, user[0].password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ userID: user[0]._id }, "thebrandwick")
                        res.send({
                            "msg": "Login sucessful",
                            "sucess": true,
                            token,
                            name: user[0].name,
                            username: user[0].username,
                            id: user[0]._id,
                            phone: user[0].phone
                        })
                    } else {
                        res.send({ "msg": "Wrong crediential", "sucess": false })
                    }
                });
            } else {
                res.send({ "msg": "Wrong crediential", "sucess": false })
            }
        } catch (err) {
            res.send({ "msg": "Something Wrong", "sucess": false })
        }
    }
})

module.exports = {
    userRoute
}