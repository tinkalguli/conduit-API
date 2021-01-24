module.exports = {
    verifyAuthor : (authorId, currentUserId, res) => {
        if (authorId.toString() !== currentUserId.toString()) {
             res.status(401).json({ errors : { body : [ "You are not authorized" ]}});
        }
    }
}