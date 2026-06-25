import { verifyToken } from '../middleware/common.js';
import employeeModel from '../model/employeeModel.js'

export const verify = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send({ message: "Invalid Token" });
        }

        let payload = await verifyToken(token);

        if (payload.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).send({ message: "Token Expired" });
        }

        req.user = payload;
        next();

    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server error" });
    }
};

export const verifyRoles = (...allowedRoles) => async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send({ message: "Invalid Token" });
        }

        let payload = await verifyToken(token);

        if (payload.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).send({ message: "Token Expired" });
        }

        if (!allowedRoles.includes(payload.role)) {
            return res.status(403).send({ message: "Unauthorized Access" });
        }

        req.user = payload;
        next();
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server error" });
    }
};
