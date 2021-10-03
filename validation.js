const Joi = require('joi');

const userRegisteration = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required()
});

const validator = {
    body: (schema) => (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        req.body = value;
        if (error)
            throw new Error("some thing went wrong");
        return next();
    },
    params: (schema) => (req, res, next) => {
        const { error, value } = schema.validate(req.params);
        req.params = value;
        if (error)
            throw new Error("some thing went wrong");
        return next();
    },
    query: (schema) => (req, res, next) => {
        const { error, value } = schema.validate(req.query);
        req.query = value;
        if (error)
            throw new Error("some thing went wrong");
        return next();
    }
}

module.exports = {
    userRegisteration,
    validator
}