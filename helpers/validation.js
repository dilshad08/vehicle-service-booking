const JSONValidator = require('jsonschema').Validator
const v = new JSONValidator()

module.exports = {

    validateGetSlotRequest: function (req) {
        const reqObjectSchema = {
            "type": "object",
            "required": true,
            "properties": {
                "date": {
                    "type": "string",
                    "required": true
                },
                "vehicleId": {
                    "type": "string",
                    "required": true
                }
            }
        }

        validate(req, reqObjectSchema)
    },
    validateGetSlotsRequest: function (req) {
        const reqObjectSchema = { 
            "type": "object",
            "required": true,
            "properties": {
                "date": {
                    "type": "string",
                    "required": true
                }
            }    
        }
        validate(req, reqObjectSchema)
    },
    validateBookSlotsRequest: function (req) {
        const reqObjectSchema = { 
            "type": "object",
            "required": true,
            "properties": {
                "vehicleId": {
                    "type": "number",
                    "required": true
                },
                "from": {
                    "type": "number",
                    "required": true
                },
                "to": {
                    "type": "number",
                    "required": true
                },
                "date": {
                    "type": "string",
                    "required": true
                }
            }  
        }
        validate(req, reqObjectSchema)
    },


}


const validate = function (obj, reqObjectSchema) {
    const validationErrors = v.validate(obj, reqObjectSchema).errors
    if (validationErrors && validationErrors.length) {
        const errors = []
        validationErrors.map(function (err) {
            errors.push(err.stack)
        })
        throw errors.join(',')
    }
}