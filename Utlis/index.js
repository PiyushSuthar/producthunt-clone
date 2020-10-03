/**
 * 
 * @param {Request} req 
 */
exports.paginationForApi = req =>  ({
    perPage: req.query.perpage || 8,
    pageNo: req.query.page ? (req.query.page - 1) * (req.query.perpage || 8) : 0
}) 