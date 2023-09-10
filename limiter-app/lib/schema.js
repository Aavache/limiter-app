const Joi = require('joi')

module.exports = function validateConfig(config){
    const ConfigSchema = Joi.object({
        maxAdditions: Joi.number()
                  .integer()
                  .min(-1)
                  .required(),
        maxDeletions: Joi.number()
                  .integer()
                  .min(-1)
                  .required(),
        maxCommits: Joi.number()
                  .integer()
                  .min(-1)
                  .required(),
        maxChangedFiles: Joi.number()
                  .integer()
                  .min(-1)
                  .required(),
        exemptPRPrefix: Joi.array()
                  .items(
                      Joi.string()
                  )
                  .default([])
                  .required(),
        exemptLabels: Joi.array()
                  .items(
                      Joi.string()
                  )
                  .default([])
                  .required(),
    });
  
    return ConfigSchema.validate(config)
};
