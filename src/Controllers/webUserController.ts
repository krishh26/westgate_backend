import { Request, Response } from "express"
import { generateToken } from "../Util/JwtAuth"
import { comparepassword } from "../Util/bcrypt"
import webUserModel from "../Models/webUserModel"
import { transporter } from "../Util/nodemailer"

export const registerWebUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const user = await webUserModel.findOne({ email })

        if (user) {
            return res.status(400).json({
                message: "User already exists",
                status: false,
                data: null
            })
        }

        const newUser = await webUserModel.create(req.body)

        const token = generateToken({
            id: newUser._id,
            email: newUser.email,
            name: newUser.name
        })
        return res.status(200).json({
            message: "User create success",
            status: true,
            data: { token }
        });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        });
    }
}

export const loginWebUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await webUserModel.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(404).json({
                message: "user not found",
                status: false,
                data: null
            })
        }

        if (!(await comparepassword(password, user.password))) {
            return res.status(400).json({
                message: "please enter valid password",
                status: false,
                data: null
            })
        }

        const token = generateToken({ id: user._id, email: user.email, name: user.name })
        return res.status(200).json({
            message: "User login success",
            status: true,
            data: { token }
        });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        });
    }
}

export const registerSendMail = async (req: Request, res: Response) => {
    try {
        const data = req.body

        const template = ``

        await transporter.sendMail({
            from: 'service@uncleblock.in',
            to: process.env.ADMIN_EMAIL,
            subject: "Reset Password",
            html: template,
        });

        return res.status(200).json({
            message: "mail send successfully",
            status: true,
        });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        });
    }
}