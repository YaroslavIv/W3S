"use strict";

/**
 * record controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::record.record", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany("api::record.record", {
      ...query,
      populate: {
        links: true,
        wallets: true,
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
